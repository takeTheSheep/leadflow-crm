import { analyticsService } from "@/lib/services/analytics/analytics-service";
import { activityService } from "@/lib/services/activity/activity-service";
import { taskService } from "@/lib/services/tasks/task-service";
import { requireAuthSession } from "@/lib/auth";

export async function getDashboardData(filters?: { rangeDays?: number }) {
  const session = await requireAuthSession();
  const workspaceId = session.user.workspaceId;
  const rangeDays = filters?.rangeDays ?? 7;
  const dashboardFilters = { rangeDays };

  const [metrics, leadVolume, conversionBySource, pipelineDistribution, forecast, followUp, recentActivities, upcomingTasks, ownerPerformance, stageVelocity] =
    await Promise.all([
      analyticsService.getDashboardMetrics(workspaceId, dashboardFilters),
      analyticsService.getLeadVolumeSeries(workspaceId, dashboardFilters),
      analyticsService.getConversionBySource(workspaceId, dashboardFilters),
      analyticsService.getPipelineDistribution(workspaceId, dashboardFilters),
      analyticsService.getForecast(workspaceId, dashboardFilters),
      analyticsService.getFollowUpCompletion(workspaceId, dashboardFilters),
      activityService.listWorkspaceActivity({
        workspaceId,
        role: session.user.role,
        userId: session.user.id,
        limit: 12,
      }),
      taskService.listUpcoming(workspaceId, session.user.id, session.user.role),
      analyticsService.getOwnerPerformance(workspaceId, dashboardFilters),
      analyticsService.getStageVelocity(workspaceId, dashboardFilters),
    ]);

  const teamPerformance = ownerPerformance.map((member) => ({
    userId: member.ownerId,
    name: member.ownerName,
    activeLeads: member.activeLeads,
    conversionRate: member.conversionRate,
    responseTime: member.responseHours,
  }));

  return {
    rangeDays,
    metrics,
    leadVolume,
    conversionBySource,
    pipelineDistribution,
    forecast,
    followUp,
    recentActivities,
    upcomingTasks,
    teamPerformance,
    stageVelocity,
  };
}

