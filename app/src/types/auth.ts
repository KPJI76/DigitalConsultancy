export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  subscribed: boolean
  likedArticles: string[]
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  toggleLike: (articleId: string) => void
  toggleSubscribe: () => void
}

export interface LoginResult {
  success: boolean
  error?: string
  lockedUntilMs?: number
}
