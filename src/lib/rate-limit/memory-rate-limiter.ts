type Bucket = {
  attempts: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitInput = {
  key: string;
  windowMs: number;
  limit: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function rateLimitMemory({ key, windowMs, limit }: RateLimitInput): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, {
      attempts: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterMs: windowMs,
    };
  }

  bucket.attempts += 1;
  const remaining = Math.max(0, limit - bucket.attempts);
  const allowed = bucket.attempts <= limit;

  return {
    allowed,
    remaining,
    retryAfterMs: Math.max(0, bucket.resetAt - now),
  };
}

