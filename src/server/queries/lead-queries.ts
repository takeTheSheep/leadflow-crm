import { requireAuthSession } from "@/lib/auth";
import { leadService } from "@/lib/services/leads/lead-service";

function parseIntInRange(value: string | string[] | undefined, options: { min: number; max: number }) {
  if (typeof value !== "string") {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.min(options.max, Math.max(options.min, Math.trunc(parsed)));
}

export async function getLeadListData(filters: Record<string, string | string[] | undefined>) {
  const session = await requireAuthSession();
  const page = parseIntInRange(filters.page, { min: 1, max: 10_000 }) ?? 1;
  const pageSize = parseIntInRange(filters.pageSize, { min: 1, max: 100 }) ?? 20;
  const scoreMin = parseIntInRange(filters.scoreMin, { min: 0, max: 100 });
  const scoreMax = parseIntInRange(filters.scoreMax, { min: 0, max: 100 });

  return leadService.getLeads(
    {
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
      role: session.user.role,
    },
    {
      query: typeof filters.query === "string" ? filters.query : undefined,
      stage: typeof filters.stage === "string" ? filters.stage : undefined,
      ownerId: typeof filters.ownerId === "string" ? filters.ownerId : undefined,
      sourceId: typeof filters.sourceId === "string" ? filters.sourceId : undefined,
      priority: typeof filters.priority === "string" ? filters.priority : undefined,
      scoreMin,
      scoreMax,
      page,
      pageSize,
    },
  );
}

export async function getLeadDetailData(leadId: string) {
  const session = await requireAuthSession();

  return leadService.getLeadDetails(
    {
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
      role: session.user.role,
    },
    leadId,
  );
}

export async function getLeadFormData() {
  const session = await requireAuthSession();
  return leadService.getLeadFormContext(session.user.workspaceId);
}

