import { LeadStage, Prisma } from "@prisma/client";
import type { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { leadFilterSchema } from "@/lib/validation/lead-schemas";

export type LeadFilters = z.infer<typeof leadFilterSchema>;

function buildLeadWhere(workspaceId: string, filters: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {
    workspaceId,
    deletedAt: null,
    archivedAt: null,
  };

  if (filters.query) {
    where.OR = [
      { firstName: { contains: filters.query, mode: "insensitive" } },
      { lastName: { contains: filters.query, mode: "insensitive" } },
      { company: { contains: filters.query, mode: "insensitive" } },
      { email: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters.stage) {
    where.stage = filters.stage;
  }

  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }

  if (filters.sourceId) {
    where.sourceId = filters.sourceId;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (typeof filters.scoreMin === "number" || typeof filters.scoreMax === "number") {
    where.leadScore = {
      gte: typeof filters.scoreMin === "number" ? filters.scoreMin : 0,
      lte: typeof filters.scoreMax === "number" ? filters.scoreMax : 100,
    };
  }

  if (filters.createdFrom || filters.createdTo) {
    where.createdAt = {
      gte: filters.createdFrom,
      lte: filters.createdTo,
    };
  }

  if (filters.tags?.length) {
    where.tags = {
      some: {
        tagId: { in: filters.tags },
      },
    };
  }

  return where;
}

export async function findLeads(workspaceId: string, filters: LeadFilters) {
  const where = buildLeadWhere(workspaceId, filters);
  const skip = (filters.page - 1) * filters.pageSize;

  return prisma.lead.findMany({
    where,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      source: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      tasks: {
        orderBy: {
          dueDate: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: filters.pageSize,
  });
}

export async function countLeads(workspaceId: string, filters: LeadFilters) {
  const where = buildLeadWhere(workspaceId, filters);
  return prisma.lead.count({ where });
}

export async function findLeadById(workspaceId: string, leadId: string) {
  return prisma.lead.findFirst({
    where: {
      id: leadId,
      workspaceId,
      deletedAt: null,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      source: true,
      tags: {
        include: {
          tag: true,
        },
      },
      notes: {
        where: { deletedAt: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      activities: {
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      tasks: {
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          dueDate: "asc",
        },
      },
    },
  });
}

export async function countByStage(workspaceId: string) {
  return prisma.lead.groupBy({
    by: ["stage"],
    where: {
      workspaceId,
      deletedAt: null,
      archivedAt: null,
    },
    _count: {
      stage: true,
    },
    _sum: {
      estimatedValue: true,
    },
  });
}

export async function countWonAndLost(workspaceId: string) {
  return prisma.lead.groupBy({
    by: ["stage"],
    where: {
      workspaceId,
      deletedAt: null,
      stage: {
        in: [LeadStage.WON, LeadStage.LOST],
      },
    },
    _count: {
      stage: true,
    },
  });
}

export async function listRecentLeadActivity(workspaceId: string, limit = 20) {
  return prisma.leadActivity.findMany({
    where: { workspaceId },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
        },
      },
      actor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

export async function listUpcomingTasks(workspaceId: string, limit = 10) {
  return prisma.task.findMany({
    where: {
      workspaceId,
      status: {
        in: ["OPEN", "IN_PROGRESS"],
      },
    },
    include: {
      lead: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: limit,
  });
}

export async function listLeadSources(workspaceId: string) {
  return prisma.leadSource.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function listWorkspaceTags(workspaceId: string) {
  return prisma.tag.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function listWorkspaceMembers(workspaceId: string) {
  return prisma.membership.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          lastLoginAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

