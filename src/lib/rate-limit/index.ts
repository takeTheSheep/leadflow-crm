import { rateLimitMemory, type RateLimitInput } from "./memory-rate-limiter";

export function checkRateLimit(input: RateLimitInput) {
  // Placeholder: switch to Redis-backed implementation when REDIS_URL is configured.
  return rateLimitMemory(input);
}

