import { requireAuthSession } from "@/lib/auth";
import { userService } from "@/lib/services/users/user-service";

export async function getTeamData() {
  const session = await requireAuthSession();

  return userService.listTeamPerformance(session.user.workspaceId, session.user.role);
}

