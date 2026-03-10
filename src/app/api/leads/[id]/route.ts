import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { leadService } from "@/lib/services/leads/lead-service";
import { toSafeError } from "@/lib/security/safe-error";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;

    const lead = await leadService.getLeadDetails(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      id,
    );

    return NextResponse.json({ lead });
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}

export async function PATCH(request: NextRequest, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;
    const payload = await request.json();

    const lead = await leadService.updateLead(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      {
        ...payload,
        leadId: id,
      },
    );

    return NextResponse.json({ lead });
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}

export async function DELETE(_request: NextRequest, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;

    await leadService.softDeleteLead(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      id,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}
