import "server-only";

/**
 * Best-effort in-memory rate limit: max `limit` requests per key within
 * `windowMs`. Good enough to stop a naive flood of the demo inbox, but
 * the counters live in module memory, so they reset on redeploy and
 * aren't shared across multiple server instances — not a substitute
 * for a real limiter (e.g. Upstash) if this ever needs to hold up
 * under real abuse.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (requestLog.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, timestamps);
    const retryAfterMs = timestamps[0] + WINDOW_MS - now;
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return { allowed: true };
}
