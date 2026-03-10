"use server";

import { revalidatePath } from "next/cache";
import { requireAuthSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadService } from "@/lib/services/leads/lead-service";
import { hashMutationPayload, releaseMutationSlot, reserveMutationSlot } from "@/lib/security/mutation-guard";
import { toSafeError } from "@/lib/security/safe-error";

type ActionResult = {
  success: boolean;
  message?: string;
};

async function withActor() {
  const session = await requireAuthSession();

  return {
    workspaceId: session.user.workspaceId,
    userId: session.user.id,
    role: session.user.role,
  };
}

export async function createLeadAction(payload: unknown): Promise<ActionResult> {
  let mutationGuardKey = "";
  try {
    const actor = await withActor();

    const rate = checkRateLimit({
      key: `action:lead:create:${actor.workspaceId}:${actor.userId}`,
      limit: 15,
      windowMs: 60_000,
    });

    if (!rate.allowed) {
      return { success: false, message: "Too many lead submissions. Please wait a moment." };
    }

    mutationGuardKey = `action:lead:create:${actor.workspaceId}:${actor.userId}:${hashMutationPayload(payload)}`;
    const slot = reserveMutationSlot({
      key: mutationGuardKey,
      ttlMs: 8_000,
    });

    if (!slot.reserved) {
      return { success: false, message: "Duplicate submission blocked. Please wait before retrying." };
    }

    await leadService.createLead(actor, payload);
    revalidatePath("/leads");
    revalidatePath("/dashboard");
    revalidatePath("/pipeline");

    return { success: true };
  } catch (error) {
    if (mutationGuardKey) {
      releaseMutationSlot(mutationGuardKey);
    }
    const safe = toSafeError(error, "Failed to create lead");
    return { success: false, message: safe.message };
  }
}

export async function addLeadNoteAction(payload: unknown): Promise<ActionResult> {
  try {
    await leadService.addNote(await withActor(), payload);
    const leadId = typeof payload === "object" && payload && "leadId" in payload ? String(payload.leadId) : "";
    revalidatePath(`/leads/${leadId}`);
    revalidatePath("/activity");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to add note");
    return { success: false, message: safe.message };
  }
}

export async function updateLeadNoteAction(payload: unknown): Promise<ActionResult> {
  try {
    await leadService.updateNote(await withActor(), payload);
    const leadId = typeof payload === "object" && payload && "leadId" in payload ? String(payload.leadId) : "";
    revalidatePath(`/leads/${leadId}`);
    revalidatePath("/activity");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to update note");
    return { success: false, message: safe.message };
  }
}

export async function createLeadTaskAction(payload: unknown): Promise<ActionResult> {
  try {
    await leadService.addTask(await withActor(), payload);
    const leadId = typeof payload === "object" && payload && "leadId" in payload ? String(payload.leadId) : "";
    revalidatePath(`/leads/${leadId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to create task");
    return { success: false, message: safe.message };
  }
}

export async function changeLeadStageAction(payload: unknown): Promise<ActionResult> {
  try {
    await leadService.changeStage(await withActor(), payload);
    revalidatePath("/leads");
    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to change stage");
    return { success: false, message: safe.message };
  }
}

export async function assignLeadOwnerAction(payload: unknown): Promise<ActionResult> {
  try {
    await leadService.assignOwner(await withActor(), payload);
    const leadId = typeof payload === "object" && payload && "leadId" in payload ? String(payload.leadId) : "";
    revalidatePath(`/leads/${leadId}`);
    revalidatePath("/leads");
    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to assign owner");
    return { success: false, message: safe.message };
  }
}

export async function archiveLeadAction(leadId: string): Promise<ActionResult> {
  try {
    await leadService.archiveLead(await withActor(), leadId);
    revalidatePath("/leads");
    revalidatePath("/pipeline");
    return { success: true };
  } catch (error) {
    const safe = toSafeError(error, "Failed to archive lead");
    return { success: false, message: safe.message };
  }
}

