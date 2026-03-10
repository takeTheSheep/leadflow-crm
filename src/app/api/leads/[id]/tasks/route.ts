import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { leadService } from "@/lib/services/leads/lead-service";
import { toSafeError } from "@/lib/security/safe-error";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: Params) {
  try {
    const session = await requireApiSession();
    const { id } = await context.params;
    const payload = await request.json();

    const task = await leadService.addTask(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      {
        leadId: id,
        title: payload.title,
        description: payload.description,
        assignedToId: payload.assignedToId,
        dueDate: payload.dueDate,
        priority: payload.priority,
      },
    );

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}
