import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadService } from "@/lib/services/leads/lead-service";
import { hashMutationPayload, releaseMutationSlot, reserveMutationSlot } from "@/lib/security/mutation-guard";
import { toSafeError } from "@/lib/security/safe-error";

export async function GET(request: NextRequest) {
  try {
    const session = await requireApiSession();
    const searchParams = request.nextUrl.searchParams;

    const result = await leadService.getLeads(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      {
        query: searchParams.get("query") ?? undefined,
        stage: searchParams.get("stage") ?? undefined,
        ownerId: searchParams.get("ownerId") ?? undefined,
        sourceId: searchParams.get("sourceId") ?? undefined,
        priority: searchParams.get("priority") ?? undefined,
        page: Number(searchParams.get("page") ?? 1),
        pageSize: Number(searchParams.get("pageSize") ?? 20),
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}

export async function POST(request: NextRequest) {
  let mutationGuardKey = "";
  try {
    const session = await requireApiSession();

    const rate = checkRateLimit({
      key: `lead:create:${session.user.workspaceId}:${session.user.id}`,
      limit: 25,
      windowMs: 60_000,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        {
          message: "Too many lead creation attempts. Please wait before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)),
          },
        },
      );
    }

    const payload = await request.json();
    const idempotencyKey = request.headers.get("x-idempotency-key");
    const payloadHash = hashMutationPayload(payload);
    mutationGuardKey = `lead:create:${session.user.workspaceId}:${session.user.id}:${idempotencyKey ?? payloadHash}`;

    const slot = reserveMutationSlot({
      key: mutationGuardKey,
      ttlMs: 15_000,
    });

    if (!slot.reserved) {
      return NextResponse.json(
        {
          message: "Duplicate submission detected. Please wait before retrying.",
        },
        {
          status: 409,
          headers: {
            "Retry-After": String(Math.ceil(slot.retryAfterMs / 1000)),
          },
        },
      );
    }

    const lead = await leadService.createLead(
      {
        workspaceId: session.user.workspaceId,
        userId: session.user.id,
        role: session.user.role,
      },
      payload,
    );

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (mutationGuardKey) {
      releaseMutationSlot(mutationGuardKey);
    }
    const safe = toSafeError(error);
    return NextResponse.json({ message: safe.message }, { status: safe.statusCode });
  }
}

