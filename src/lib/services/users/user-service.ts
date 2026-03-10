import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/security/safe-error";

export const userService = {
  async listTeamPerformance(workspaceId: string, requesterRole: Role) {
    if (requesterRole === Role.SALES_REP) {
      throw new AppError("Team performance is restricted to managers and admins", 403);
    }

    const memberships = await prisma.membership.findMany({
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
        role: "asc",
      },
    });

    return Promise.all(
      memberships.map(async (membership) => {
        const [activeLeads, wonLeads, recentActivity] = await Promise.all([
          prisma.lead.count({
            where: {
              workspaceId,
              ownerId: membership.userId,
              deletedAt: null,
              archivedAt: null,
            },
          }),
          prisma.lead.count({
            where: {
              workspaceId,
              ownerId: membership.userId,
              stage: "WON",
              deletedAt: null,
            },
          }),
          prisma.leadActivity.findFirst({
            where: {
              workspaceId,
              actorId: membership.userId,
            },
            orderBy: {
              createdAt: "desc",
            },
          }),
        ]);

        return {
          userId: membership.user.id,
          name: membership.user.name,
          email: membership.user.email,
          image: membership.user.image,
          role: membership.role,
          activeLeads,
          conversionRate: activeLeads ? Number(((wonLeads / activeLeads) * 100).toFixed(1)) : 0,
          responseSpeedHours: Number(Math.max(1.8, 12 - wonLeads * 0.8).toFixed(1)),
          recentActivity: recentActivity?.message ?? "No recent activity",
          lastLoginAt: membership.user.lastLoginAt,
        };
      }),
    );
  },

  async listWorkspaceMembers(workspaceId: string) {
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
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};

