import { ActivityType } from "@prisma/client";
import { requireAuthSession } from "@/lib/auth";
import { activityService } from "@/lib/services/activity/activity-service";

export async function getActivityFeed(filters: {
  actorId?: string;
  action?: ActivityType;
  from?: Date;
  to?: Date;
}) {
  const session = await requireAuthSession();

  return activityService.listWorkspaceActivity({
    workspaceId: session.user.workspaceId,
    userId: session.user.id,
    role: session.user.role,
    actorId: filters.actorId,
    action: filters.action,
    from: filters.from,
    to: filters.to,
    limit: 120,
  });
}

