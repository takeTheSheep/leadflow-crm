import { requireAuthSession } from "@/lib/auth";
import { leadService } from "@/lib/services/leads/lead-service";

export async function mutateLeadCreate(payload: unknown) {
  const session = await requireAuthSession();

  return leadService.createLead(
    {
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
      role: session.user.role,
    },
    payload,
  );
}

export async function mutateLeadBulk(payload: unknown) {
  const session = await requireAuthSession();

  return leadService.bulkAction(
    {
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
      role: session.user.role,
    },
    payload,
  );
}

