import { Role, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { canManageLead } from "@/lib/permissions/policies";
import { updateTaskStatusSchema } from "@/lib/validation/task-schemas";
import { AppError } from "@/lib/security/safe-error";

export const taskService = {
  async listUpcoming(workspaceId: string, userId: string, role: Role) {
    return prisma.task.findMany({
      where: {
        workspaceId,
        status: {
          in: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS],
        },
        ...(role === Role.SALES_REP ? { assignedToId: userId } : {}),
      },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            ownerId: true,
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
      take: 20,
    });
  },

  async updateStatus({
    workspaceId,
    userId,
    role,
    payload,
  }: {
    workspaceId: string;
    userId: string;
    role: Role;
    payload: unknown;
  }) {
    const parsed = updateTaskStatusSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError(parsed.error.issues[0]?.message ?? "Invalid task payload", 400);
    }

    const task = await prisma.task.findFirst({
      where: {
        id: parsed.data.taskId,
        workspaceId,
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

    if (
      role === Role.SALES_REP &&
      !canManageLead({
        role,
        userId,
        ownerId: task.lead.ownerId,
      })
    ) {
      throw new AppError("Permission denied", 403);
    }

    return prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        status: parsed.data.status,
        completedAt: parsed.data.status === TaskStatus.COMPLETED ? new Date() : null,
      },
    });
  },
};

