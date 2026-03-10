import { ActivityType, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/security/safe-error";

export const activityService = {
  async listWorkspaceActivity({
    workspaceId,
    role,
    userId,
    actorId,
    action,
    from,
    to,
    limit = 80,
  }: {
    workspaceId: string;
    role: Role;
    userId: string;
    actorId?: string;
    action?: ActivityType;
    from?: Date;
    to?: Date;
    limit?: number;
  }) {
    if (role === Role.SALES_REP && actorId && actorId !== userId) {
      throw new AppError("Sales reps can only view their own activity filter", 403);
    }

    const resolvedActorId = role === Role.SALES_REP ? userId : actorId;

    const where = {
      workspaceId,
      ...(resolvedActorId ? { actorId: resolvedActorId } : {}),
      ...(action ? { activityType: action } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    };

    return prisma.leadActivity.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            ownerId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Math.min(limit, 200),
    });
  },
};

