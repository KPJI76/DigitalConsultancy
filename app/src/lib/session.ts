const SESSION_KEY = 'ec_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours

export interface SessionData {
  token: string
  userId: string
  role: 'admin' | 'user'
  expiresAt: number
}

function generateToken(): string {
  const arr = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export function createSession(userId: string, role: 'admin' | 'user'): SessionData {
  const session: SessionData = {
    token: generateToken(),
    userId,
    role,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getSession(): SessionData | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as SessionData
    if (Date.now() > session.expiresAt) {
      clearSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function refreshSession(session: SessionData): void {
  const refreshed: SessionData = { ...session, expiresAt: Date.now() + SESSION_DURATION_MS }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(refreshed))
}
