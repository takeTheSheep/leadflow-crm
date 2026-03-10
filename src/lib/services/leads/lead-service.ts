import {
  ActivityType,
  LeadPriority,
  LeadStage,
  Prisma,
  Role,
  TaskStatus,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { canAssignLead, canDeleteLead, canManageLead } from "@/lib/permissions/policies";
import {
  addNoteSchema,
  assignOwnerSchema,
  bulkLeadActionSchema,
  changeStageSchema,
  createLeadSchema,
  leadFilterSchema,
  updateNoteSchema,
  updateLeadSchema,
} from "@/lib/validation/lead-schemas";
import { createTaskSchema } from "@/lib/validation/task-schemas";
import {
  countLeads,
  findLeadById,
  findLeads,
  listLeadSources,
  listWorkspaceMembers,
  listWorkspaceTags,
} from "@/lib/repositories/lead-repository";
import { AppError } from "@/lib/security/safe-error";

type Actor = {
  userId: string;
  role: Role;
  workspaceId: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getFirstString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
}

function toOptionalInt(value: unknown, min: number, max: number) {
  const input = getFirstString(value);
  if (typeof input === "undefined") {
    return undefined;
  }

  const numeric = Number(input);
  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  return clamp(Math.round(numeric), min, max);
}

function toOptionalDate(value: unknown) {
  const input = getFirstString(value);
  if (!input) {
    return undefined;
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function toOptionalCuid(value: unknown) {
  const input = getFirstString(value);
  if (!input) {
    return undefined;
  }

  const parsed = z.string().cuid().safeParse(input);
  return parsed.success ? parsed.data : undefined;
}

const stageSet = new Set(Object.values(LeadStage));
const prioritySet = new Set(Object.values(LeadPriority));

function sanitizeLeadFilters(filters: unknown) {
  const input = filters && typeof filters === "object" ? (filters as Record<string, unknown>) : {};

  const stageValue = getFirstString(input.stage);
  const priorityValue = getFirstString(input.priority);

  const scoreMin = toOptionalInt(input.scoreMin, 0, 100);
  const scoreMax = toOptionalInt(input.scoreMax, 0, 100);

  const normalized = {
    query: getFirstString(input.query)?.slice(0, 120),
    stage: stageValue && stageSet.has(stageValue as LeadStage) ? (stageValue as LeadStage) : undefined,
    ownerId: toOptionalCuid(input.ownerId),
    sourceId: toOptionalCuid(input.sourceId),
    priority:
      priorityValue && prioritySet.has(priorityValue as LeadPriority)
        ? (priorityValue as LeadPriority)
        : undefined,
    scoreMin,
    scoreMax: typeof scoreMax === "number" && typeof scoreMin === "number" && scoreMax < scoreMin ? scoreMin : scoreMax,
    createdFrom: toOptionalDate(input.createdFrom),
    createdTo: toOptionalDate(input.createdTo),
    tags: Array.isArray(input.tags)
      ? input.tags
          .map((item) => toOptionalCuid(item))
          .filter((item): item is string => Boolean(item))
      : undefined,
    page: toOptionalInt(input.page, 1, 10_000) ?? 1,
    pageSize: toOptionalInt(input.pageSize, 1, 100) ?? 20,
  };

  return leadFilterSchema.parse(normalized);
}

function priorityWeight(priority: LeadPriority) {
  switch (priority) {
    case LeadPriority.URGENT:
      return 20;
    case LeadPriority.HIGH:
      return 12;
    case LeadPriority.MEDIUM:
      return 6;
    default:
      return 0;
  }
}

function stageWeight(stage: LeadStage) {
  switch (stage) {
    case LeadStage.NEW:
      return 10;
    case LeadStage.CONTACTED:
      return 20;
    case LeadStage.QUALIFIED:
      return 35;
    case LeadStage.PROPOSAL_SENT:
      return 50;
    case LeadStage.NEGOTIATION:
      return 65;
    case LeadStage.WON:
      return 100;
    case LeadStage.LOST:
      return 5;
    default:
      return 15;
  }
}

function computeLeadScore(payload: {
  stage: LeadStage;
  priority: LeadPriority;
  probabilityToClose: number;
  estimatedValue?: number;
}) {
  const valueComponent = payload.estimatedValue ? Math.min(20, payload.estimatedValue / 5_000) : 0;
  const probabilityComponent = payload.probabilityToClose * 0.4;
  const base = stageWeight(payload.stage) * 0.35 + priorityWeight(payload.priority) + probabilityComponent + valueComponent;

  return Math.round(clamp(base, 0, 100));
}

async function createActivityLog(args: {
  workspaceId: string;
  leadId: string;
  actorId: string;
  activityType: ActivityType;
  message: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.leadActivity.create({
    data: {
      workspaceId: args.workspaceId,
      leadId: args.leadId,
      actorId: args.actorId,
      activityType: args.activityType,
      message: args.message,
      metadata: args.metadata,
    },
  });
}

async function getLeadForMutation(workspaceId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      workspaceId,
      deletedAt: null,
    },
    select: {
      id: true,
      ownerId: true,
      stage: true,
      firstName: true,
      lastName: true,
      company: true,
      workspaceId: true,
    },
  });

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return lead;
}

function assertLeadPermission(actor: Actor, ownerId: string) {
  if (
    !canManageLead({
      role: actor.role,
      userId: actor.userId,
      ownerId,
    })
  ) {
    throw new AppError("You do not have permission for this lead", 403);
  }
}

export const leadService = {
  async getLeads(actor: Actor, filters: unknown) {
    const parsedFilters = sanitizeLeadFilters(filters);

    const [rows, totalCount] = await Promise.all([
      findLeads(actor.workspaceId, parsedFilters),
      countLeads(actor.workspaceId, parsedFilters),
    ]);

    const leads = rows.map((lead) => ({
      id: lead.id,
      fullName: `${lead.firstName} ${lead.lastName}`,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      stage: lead.stage,
      priority: lead.priority,
      source: lead.source?.name ?? null,
      sourceColor: lead.source?.color ?? null,
      ownerId: lead.owner.id,
      ownerName: lead.owner.name,
      ownerImage: lead.owner.image,
      leadScore: lead.leadScore,
      estimatedValue: Number(lead.estimatedValue ?? 0),
      probabilityToClose: lead.probabilityToClose,
      nextFollowUpAt: lead.nextFollowUpAt,
      createdAt: lead.createdAt,
      tags: lead.tags.map((item) => ({
        id: item.tagId,
        name: item.tag.name,
        color: item.tag.color,
      })),
    }));

    return {
      leads,
      totalCount,
      page: parsedFilters.page,
      pageSize: parsedFilters.pageSize,
      totalPages: Math.ceil(totalCount / parsedFilters.pageSize),
    };
  },

  async getLeadDetails(actor: Actor, leadId: string) {
    const lead = await findLeadById(actor.workspaceId, leadId);

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    assertLeadPermission(actor, lead.ownerId);

    return {
      ...lead,
      estimatedValue: Number(lead.estimatedValue ?? 0),
      fullName: `${lead.firstName} ${lead.lastName}`,
    };
  },

  async getLeadFormContext(workspaceId: string) {
    const [memberships, sources, tags] = await Promise.all([
      listWorkspaceMembers(workspaceId),
      listLeadSources(workspaceId),
      listWorkspaceTags(workspaceId),
    ]);

    return {
      members: memberships.map((membership) => ({
        id: membership.user.id,
        name: membership.user.name,
        role: membership.role,
      })),
      sources,
      tags,
    };
  },

  async createLead(actor: Actor, payload: unknown) {
    const parsed = createLeadSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid lead payload", 400);
    }

    const data = parsed.data;

    if (actor.role === Role.SALES_REP && actor.userId !== data.ownerId) {
      throw new AppError("Sales reps can only create leads assigned to themselves", 403);
    }

    const ownerMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: actor.workspaceId,
          userId: data.ownerId,
        },
      },
    });

    if (!ownerMembership) {
      throw new AppError("Owner does not belong to this workspace", 400);
    }

    const leadScore = computeLeadScore({
      stage: data.stage,
      priority: data.priority,
      probabilityToClose: data.probabilityToClose,
      estimatedValue: data.estimatedValue,
    });

    const created = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          workspaceId: actor.workspaceId,
          createdById: actor.userId,
          ownerId: data.ownerId,
          sourceId: data.sourceId,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          email: data.email,
          phone: data.phone,
          stage: data.stage,
          priority: data.priority,
          estimatedValue: typeof data.estimatedValue === "number" ? new Prisma.Decimal(data.estimatedValue) : null,
          probabilityToClose: data.probabilityToClose,
          nextFollowUpAt: data.nextFollowUpAt,
          leadScore,
        },
      });

      if (data.tagIds.length > 0) {
        await tx.leadTag.createMany({
          data: data.tagIds.map((tagId) => ({ leadId: lead.id, tagId })),
          skipDuplicates: true,
        });
      }

      await tx.leadActivity.create({
        data: {
          workspaceId: actor.workspaceId,
          leadId: lead.id,
          actorId: actor.userId,
          activityType: ActivityType.LEAD_CREATED,
          message: `Lead created for ${data.company}`,
        },
      });

      return lead;
    });

    return created;
  },

  async updateLead(actor: Actor, payload: unknown) {
    const parsed = updateLeadSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid lead payload", 400);
    }

    const { leadId, ...data } = parsed.data;
    const current = await getLeadForMutation(actor.workspaceId, leadId);
    assertLeadPermission(actor, current.ownerId);

    if (data.ownerId && data.ownerId !== current.ownerId && !canAssignLead(actor.role)) {
      throw new AppError("Only managers and admins can reassign leads", 403);
    }

    const nextStage = data.stage ?? current.stage;
    const nextPriority = data.priority ?? LeadPriority.MEDIUM;
    const nextProbability = data.probabilityToClose ?? 15;

    const leadScore = computeLeadScore({
      stage: nextStage,
      priority: nextPriority,
      probabilityToClose: nextProbability,
      estimatedValue: data.estimatedValue,
    });

    const updateData: Prisma.LeadUncheckedUpdateInput = {
      leadScore,
    };

    if (typeof data.firstName !== "undefined") updateData.firstName = data.firstName;
    if (typeof data.lastName !== "undefined") updateData.lastName = data.lastName;
    if (typeof data.company !== "undefined") updateData.company = data.company;
    if (typeof data.email !== "undefined") updateData.email = data.email;
    if (typeof data.phone !== "undefined") updateData.phone = data.phone;
    if (typeof data.ownerId !== "undefined") updateData.ownerId = data.ownerId;
    if (typeof data.sourceId !== "undefined") updateData.sourceId = data.sourceId;
    if (typeof data.stage !== "undefined") updateData.stage = data.stage;
    if (typeof data.priority !== "undefined") updateData.priority = data.priority;
    if (typeof data.probabilityToClose !== "undefined") updateData.probabilityToClose = data.probabilityToClose;
    if (typeof data.nextFollowUpAt !== "undefined") updateData.nextFollowUpAt = data.nextFollowUpAt;
    if (typeof data.estimatedValue !== "undefined") {
      updateData.estimatedValue =
        typeof data.estimatedValue === "number" ? new Prisma.Decimal(data.estimatedValue) : data.estimatedValue;
    }

    const updated = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: updateData,
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId,
      actorId: actor.userId,
      activityType: ActivityType.LEAD_UPDATED,
      message: `Lead profile updated for ${current.company}`,
    });

    return updated;
  },

  async changeStage(actor: Actor, payload: unknown) {
    const parsed = changeStageSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid stage payload", 400);
    }

    const current = await getLeadForMutation(actor.workspaceId, parsed.data.leadId);
    assertLeadPermission(actor, current.ownerId);

    const leadScore = computeLeadScore({
      stage: parsed.data.stage,
      priority: LeadPriority.MEDIUM,
      probabilityToClose:
        parsed.data.stage === LeadStage.WON
          ? 100
          : parsed.data.stage === LeadStage.LOST
            ? 0
            : stageWeight(parsed.data.stage),
    });

    const updated = await prisma.lead.update({
      where: {
        id: parsed.data.leadId,
      },
      data: {
        stage: parsed.data.stage,
        leadScore,
        probabilityToClose:
          parsed.data.stage === LeadStage.WON ? 100 : parsed.data.stage === LeadStage.LOST ? 0 : undefined,
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: parsed.data.leadId,
      actorId: actor.userId,
      activityType: ActivityType.STAGE_CHANGED,
      message: `${current.firstName} ${current.lastName} moved to ${parsed.data.stage.replaceAll("_", " ")}`,
      metadata: {
        previousStage: current.stage,
        nextStage: parsed.data.stage,
      },
    });

    return updated;
  },

  async assignOwner(actor: Actor, payload: unknown) {
    const parsed = assignOwnerSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid owner payload", 400);
    }

    if (!canAssignLead(actor.role)) {
      throw new AppError("Only managers and admins can reassign leads", 403);
    }

    const current = await getLeadForMutation(actor.workspaceId, parsed.data.leadId);

    const ownerMembership = await prisma.membership.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: actor.workspaceId,
          userId: parsed.data.ownerId,
        },
      },
    });

    if (!ownerMembership) {
      throw new AppError("Owner does not belong to this workspace", 400);
    }

    const updated = await prisma.lead.update({
      where: {
        id: parsed.data.leadId,
      },
      data: {
        ownerId: parsed.data.ownerId,
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: parsed.data.leadId,
      actorId: actor.userId,
      activityType: ActivityType.OWNER_ASSIGNED,
      message: `Owner changed for ${current.company}`,
      metadata: {
        previousOwnerId: current.ownerId,
        nextOwnerId: parsed.data.ownerId,
      },
    });

    return updated;
  },

  async addNote(actor: Actor, payload: unknown) {
    const parsed = addNoteSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid note payload", 400);
    }

    const current = await getLeadForMutation(actor.workspaceId, parsed.data.leadId);
    assertLeadPermission(actor, current.ownerId);

    const note = await prisma.leadNote.create({
      data: {
        workspaceId: actor.workspaceId,
        leadId: parsed.data.leadId,
        authorId: actor.userId,
        body: parsed.data.note,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: parsed.data.leadId,
      actorId: actor.userId,
      activityType: ActivityType.NOTE_ADDED,
      message: `Note added on ${current.company}`,
    });

    return note;
  },

  async updateNote(actor: Actor, payload: unknown) {
    const parsed = updateNoteSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid note payload", 400);
    }

    const currentLead = await getLeadForMutation(actor.workspaceId, parsed.data.leadId);
    assertLeadPermission(actor, currentLead.ownerId);

    const currentNote = await prisma.leadNote.findFirst({
      where: {
        id: parsed.data.noteId,
        leadId: parsed.data.leadId,
        workspaceId: actor.workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!currentNote) {
      throw new AppError("Note not found", 404);
    }

    if (actor.role === Role.SALES_REP && currentNote.authorId !== actor.userId) {
      throw new AppError("Sales reps can only edit their own notes", 403);
    }

    const updated = await prisma.leadNote.update({
      where: { id: currentNote.id },
      data: {
        body: parsed.data.note,
        editedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: parsed.data.leadId,
      actorId: actor.userId,
      activityType: ActivityType.NOTE_ADDED,
      message: `Note edited on ${currentLead.company}`,
      metadata: {
        noteId: parsed.data.noteId,
      },
    });

    return updated;
  },

  async addTask(actor: Actor, payload: unknown) {
    const parsed = createTaskSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid task payload", 400);
    }

    const current = await getLeadForMutation(actor.workspaceId, parsed.data.leadId);
    assertLeadPermission(actor, current.ownerId);

    if (actor.role === Role.SALES_REP && parsed.data.assignedToId !== actor.userId) {
      throw new AppError("Sales reps can only assign tasks to themselves", 403);
    }

    const task = await prisma.task.create({
      data: {
        workspaceId: actor.workspaceId,
        leadId: parsed.data.leadId,
        assignedToId: parsed.data.assignedToId,
        createdById: actor.userId,
        title: parsed.data.title,
        description: parsed.data.description,
        dueDate: parsed.data.dueDate,
        priority: parsed.data.priority,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: parsed.data.leadId,
      actorId: actor.userId,
      activityType: ActivityType.TASK_CREATED,
      message: `Task scheduled: ${parsed.data.title}`,
      metadata: {
        dueDate: parsed.data.dueDate.toISOString(),
      },
    });

    return task;
  },

  async completeTask(actor: Actor, taskId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId: actor.workspaceId,
      },
      include: {
        lead: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    assertLeadPermission(actor, task.lead.ownerId);

    const updated = await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId: task.leadId,
      actorId: actor.userId,
      activityType: ActivityType.TASK_COMPLETED,
      message: `Task completed: ${task.title}`,
    });

    return updated;
  },

  async archiveLead(actor: Actor, leadId: string) {
    const current = await getLeadForMutation(actor.workspaceId, leadId);
    assertLeadPermission(actor, current.ownerId);

    const updated = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        archivedAt: new Date(),
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId,
      actorId: actor.userId,
      activityType: ActivityType.LEAD_ARCHIVED,
      message: `Lead archived for ${current.company}`,
    });

    return updated;
  },

  async softDeleteLead(actor: Actor, leadId: string) {
    if (!canDeleteLead(actor.role)) {
      throw new AppError("Only admins can delete leads", 403);
    }

    const current = await getLeadForMutation(actor.workspaceId, leadId);

    const deleted = await prisma.lead.update({
      where: {
        id: leadId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    await createActivityLog({
      workspaceId: actor.workspaceId,
      leadId,
      actorId: actor.userId,
      activityType: ActivityType.LEAD_DELETED,
      message: `Lead soft-deleted for ${current.company}`,
    });

    return deleted;
  },

  async bulkAction(actor: Actor, payload: unknown) {
    const parsed = bulkLeadActionSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid bulk action", 400);
    }

    const { action, leadIds, ownerId, stage, tagId } = parsed.data;

    const leads = await prisma.lead.findMany({
      where: {
        workspaceId: actor.workspaceId,
        id: {
          in: leadIds,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (leads.length !== leadIds.length) {
      throw new AppError("Some leads were not found", 404);
    }

    for (const lead of leads) {
      assertLeadPermission(actor, lead.ownerId);
    }

    if (action === "assign-owner") {
      if (!ownerId) {
        throw new AppError("Owner is required", 400);
      }
      if (!canAssignLead(actor.role)) {
        throw new AppError("You do not have permission to assign leads", 403);
      }

      await prisma.lead.updateMany({
        where: {
          workspaceId: actor.workspaceId,
          id: { in: leadIds },
        },
        data: {
          ownerId,
        },
      });
    }

    if (action === "change-stage") {
      if (!stage) {
        throw new AppError("Stage is required", 400);
      }

      await prisma.lead.updateMany({
        where: {
          workspaceId: actor.workspaceId,
          id: { in: leadIds },
        },
        data: {
          stage,
        },
      });
    }

    if (action === "add-tag") {
      if (!tagId) {
        throw new AppError("Tag is required", 400);
      }

      await prisma.leadTag.createMany({
        data: leadIds.map((leadId) => ({
          leadId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    if (action === "archive") {
      await prisma.lead.updateMany({
        where: {
          workspaceId: actor.workspaceId,
          id: { in: leadIds },
        },
        data: {
          archivedAt: new Date(),
        },
      });
    }

    if (action === "delete") {
      if (!canDeleteLead(actor.role)) {
        throw new AppError("Only admins can delete leads", 403);
      }

      await prisma.lead.updateMany({
        where: {
          workspaceId: actor.workspaceId,
          id: { in: leadIds },
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }

    await prisma.leadActivity.createMany({
      data: leadIds.map((leadId) => ({
        workspaceId: actor.workspaceId,
        leadId,
        actorId: actor.userId,
        activityType: ActivityType.LEAD_UPDATED,
        message: `Bulk action executed: ${action}`,
      })),
    });

    return { success: true, affected: leadIds.length };
  },
};

