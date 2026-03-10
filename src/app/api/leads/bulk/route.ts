import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadService } from "@/lib/services/leads/lead-service";
import { hashMutationPayload, releaseMutationSlot, reserveMutationSlot } from "@/lib/security/mutation-guard";
import { toSafeError } from "@/lib/security/safe-error";

export async function POST(request: NextRequest) {
  let mutationGuardKey = "";
  try {
    const session = await requireApiSession();
    const rate = checkRateLimit({
      key: `lead:bulk:${session.user.workspaceId}:${session.user.id}`,
      limit: 20,
      windowMs: 60_000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { message: "Too many bulk operations. Please wait before retrying." },
        { status: 429 },
      );
    }

    const payload = await request.json();
    const idempotencyKey = request.headers.get("x-idempotency-key");
    const payloadHash = hashMutationPayload(payload);
    mutationGuardKey = `lead:bulk:${session.user.workspaceId}:${session.user.id}:${idempotencyKey ?? payloadHash}`;

    const slot = reserveMutationSlot({
      key: mutationGuardKey,
      ttlMs: 10_000,
    });

    if (!slot.reserved) {
      return NextResponse.json(
        { message: "Duplicate bulk submission detected." },
        { status: 409 },
      );
    }

    const result = await leadService.bulkAction(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      payload,
    );

    return NextResponse.json(result);
  } catch (error) {
    if (mutationGuardKey) {
      releaseMutationSlot(mutationGuardKey);
    }
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}

