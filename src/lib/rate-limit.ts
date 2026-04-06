interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, RateLimitEntry>();

// Periodic cleanup of stale entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of attempts) {
      if (now - entry.firstAttempt > WINDOW_MS) {
        attempts.delete(key);
      }
    }
  }, 60_000);
}

export function checkRateLimit(
  slug: string,
  ip: string
): { allowed: boolean; retryAfterMs?: number } {
  const key = `${slug}:${ip}`;
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { attempts: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAttempt);
    return { allowed: false, retryAfterMs };
  }

  entry.attempts++;
  return { allowed: true };
}

export function clearRateLimit(slug: string, ip: string): void {
  attempts.delete(`${slug}:${ip}`);
}
