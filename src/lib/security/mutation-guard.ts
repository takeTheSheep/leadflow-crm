import { createHash } from "node:crypto";

type GuardEntry = {
  expiresAt: number;
};

const guards = new Map<string, GuardEntry>();

function cleanupExpired(now: number) {
  for (const [key, entry] of guards.entries()) {
    if (entry.expiresAt <= now) {
      guards.delete(key);
    }
  }
}

export function hashMutationPayload(payload: unknown) {
  const raw = typeof payload === "string" ? payload : JSON.stringify(payload);
  return createHash("sha256").update(raw ?? "").digest("hex").slice(0, 24);
}

export function reserveMutationSlot({ key, ttlMs }: { key: string; ttlMs: number }) {
  const now = Date.now();
  cleanupExpired(now);

  const existing = guards.get(key);

  if (existing && existing.expiresAt > now) {
    return {
      reserved: false,
      retryAfterMs: existing.expiresAt - now,
    };
  }

  guards.set(key, {
    expiresAt: now + ttlMs,
  });

  return {
    reserved: true,
    retryAfterMs: 0,
  };
}

export function releaseMutationSlot(key: string) {
  guards.delete(key);
}
