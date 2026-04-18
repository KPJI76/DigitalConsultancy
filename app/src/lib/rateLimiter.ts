const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000  // 15-minute window
const LOCKOUT_MS = 30 * 60 * 1000 // 30-minute lockout

interface AttemptRecord {
  count: number
  firstAttemptAt: number
  lockedUntil?: number
}

const store = new Map<string, AttemptRecord>()

export interface RateLimitResult {
  allowed: boolean
  remainingAttempts: number
  lockedUntilMs?: number
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now()
  const record = store.get(identifier)

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  if (record.lockedUntil !== undefined && now < record.lockedUntil) {
    return { allowed: false, remainingAttempts: 0, lockedUntilMs: record.lockedUntil }
  }

  if (now - record.firstAttemptAt > WINDOW_MS) {
    store.delete(identifier)
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS }
  }

  const remaining = MAX_ATTEMPTS - record.count
  return { allowed: remaining > 0, remainingAttempts: Math.max(0, remaining) }
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const existing = store.get(identifier)

  if (!existing || now - existing.firstAttemptAt > WINDOW_MS) {
    store.set(identifier, { count: 1, firstAttemptAt: now })
    return
  }

  const newCount = existing.count + 1
  if (newCount >= MAX_ATTEMPTS) {
    store.set(identifier, { ...existing, count: newCount, lockedUntil: now + LOCKOUT_MS })
  } else {
    store.set(identifier, { ...existing, count: newCount })
  }
}

export function clearAttempts(identifier: string): void {
  store.delete(identifier)
}
