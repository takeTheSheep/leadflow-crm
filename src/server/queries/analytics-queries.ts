import { requireAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { analyticsService } from "@/lib/services/analytics/analytics-service";

function parseRangeDays(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return 90;
  }

  const parsed = Number(value);
  if (parsed === 7 || parsed === 30 || parsed === 90) {
    return parsed;
  }

  return 90;
}

function parseOptionalCuid(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return undefined;
  }

  return /^c[a-z0-9]{8,}$/i.test(value) ? value : undefined;
}

export async function getAnalyticsData(filters: Record<string, string | string[] | undefined> = {}) {
  const session = await requireAuthSession();

  const workspaceId = session.user.workspaceId;
  const requestedOwnerId = parseOptionalCuid(filters.ownerId);
  const requestedSourceId = parseOptionalCuid(filters.sourceId);
  const rangeDays = parseRangeDays(filters.rangeDays);

  const [memberships, sources] = await Promise.all([
    prisma.membership.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.leadSource.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const ownerOptions = memberships.map((membership) => ({
    id: membership.user.id,
    name: membership.user.name,
  }));

  const sourceOptions = sources.map((source) => ({
    id: source.id,
    name: source.name,
  }));

  const ownerId = ownerOptions.some((owner) => owner.id === requestedOwnerId) ? requestedOwnerId : undefined;
  const sourceId = sourceOptions.some((source) => source.id === requestedSourceId) ? requestedSourceId : undefined;

  const analyticsFilters = {
    rangeDays,
    ownerId,
    sourceId,
  };

  const [leadVolume, conversionBySource, pipelineDistribution, ownerPerformance, followUpCompletion, lostReasons, stageVelocity, forecast] =
    await Promise.all([
      analyticsService.getLeadVolumeSeries(workspaceId, analyticsFilters),
      analyticsService.getConversionBySource(workspaceId, analyticsFilters),
      analyticsService.getPipelineDistribution(workspaceId, analyticsFilters),
      analyticsService.getOwnerPerformance(workspaceId, analyticsFilters),
      analyticsService.getFollowUpCompletion(workspaceId, analyticsFilters),
      analyticsService.getLostReasonBreakdown(workspaceId, analyticsFilters),
      analyticsService.getStageVelocity(workspaceId, analyticsFilters),
      analyticsService.getForecast(workspaceId, analyticsFilters),
    ]);

  return {
    filters: analyticsFilters,
    ownerOptions,
    sourceOptions,
    leadVolume,
    conversionBySource,
    pipelineDistribution,
    ownerPerformance,
    followUpCompletion,
    lostReasons,
    stageVelocity,
    forecast,
  };
}

