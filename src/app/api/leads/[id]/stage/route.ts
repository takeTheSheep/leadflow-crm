import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { leadService } from "@/lib/services/leads/lead-service";
import { toSafeError } from "@/lib/security/safe-error";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;
    const payload = await request.json();

    const lead = await leadService.changeStage(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      {
        leadId: id,
        stage: payload.stage,
      },
    );

    return NextResponse.json({ lead });
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}
