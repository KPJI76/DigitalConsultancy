const STORAGE_VERSION = 1
const CONTENT_KEY = `ec_content_v${STORAGE_VERSION}`
const USERS_KEY = `ec_users_v${STORAGE_VERSION}`

export interface StoredUser {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'user'
  phone?: string
  subscribed: boolean
  likedArticles: string[]
}

export function loadContent<T>(defaultValue: T): T {
  try {
    const raw = localStorage.getItem(CONTENT_KEY)
    if (!raw) return defaultValue
    const parsed = JSON.parse(raw) as { version: number; data: T }
    if (parsed.version !== STORAGE_VERSION) return defaultValue
    return parsed.data
  } catch {
    return defaultValue
  }
}

export function saveContent<T>(data: T): void {
  localStorage.setItem(CONTENT_KEY, JSON.stringify({ version: STORAGE_VERSION, data }))
}

export function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as StoredUser[]
  } catch {
    return []
  }
}

export function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function migrateUsersIfNeeded(): void {
  // Migrate old plaintext-password records from pre-security versions
  const OLD_KEY = 'ec_users'
  const old = localStorage.getItem(OLD_KEY)
  if (!old) return
  // Migration is async (hashing), so we just clear the old key safely
  // New AuthContext will re-hash passwords on next login if needed
  localStorage.removeItem(OLD_KEY)
  localStorage.removeItem('ec_user')
  localStorage.removeItem('ec_admin_password')
}
