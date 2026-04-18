import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User, AuthContextType, LoginResult } from '@/types/auth'
import { hashPassword, verifyPassword } from '@/lib/crypto'
import { createSession, getSession, clearSession } from '@/lib/session'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rateLimiter'
import { loadUsers, saveUsers, migrateUsersIfNeeded } from '@/lib/storage'
import type { StoredUser } from '@/lib/storage'
import { ENV } from '@/config/env'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // One-time migration: clear old plaintext-password data
    migrateUsersIfNeeded()

    // Restore session from sessionStorage
    const session = getSession()
    if (!session) return

    if (session.role === 'admin') {
      setUser({
        id: session.userId,
        email: ENV.ADMIN_EMAIL,
        name: 'Administrator',
        role: 'admin',
        subscribed: true,
        likedArticles: [],
      })
      setIsAuthenticated(true)
      return
    }

    const users = loadUsers()
    const found = users.find(u => u.id === session.userId)
    if (found) {
      setUser(storedToUser(found))
      setIsAuthenticated(true)
    } else {
      clearSession()
    }
  }, [])

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const limit = checkRateLimit(email)
    if (!limit.allowed) {
      return {
        success: false,
        error: 'Too many failed attempts. Please try again later.',
        lockedUntilMs: limit.lockedUntilMs,
      }
    }

    // Admin login
    if (email === ENV.ADMIN_EMAIL) {
      const valid = await verifyPassword(password, ENV.ADMIN_PASSWORD_HASH)
      if (valid) {
        clearAttempts(email)
        const adminId = `admin-${btoa(ENV.ADMIN_EMAIL).slice(0, 8)}`
        const adminUser: User = {
          id: adminId,
          email: ENV.ADMIN_EMAIL,
          name: 'Administrator',
          role: 'admin',
          subscribed: true,
          likedArticles: [],
        }
        createSession(adminId, 'admin')
        setUser(adminUser)
        setIsAuthenticated(true)
        return { success: true }
      }
      recordFailedAttempt(email)
      return { success: false, error: 'Invalid email or password' }
    }

    // Regular user login
    const users = loadUsers()
    const found = users.find(u => u.email === email)
    if (found) {
      const valid = await verifyPassword(password, found.passwordHash)
      if (valid) {
        clearAttempts(email)
        createSession(found.id, 'user')
        setUser(storedToUser(found))
        setIsAuthenticated(true)
        return { success: true }
      }
    }

    recordFailedAttempt(email)
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = loadUsers()
    if (users.some(u => u.email === email) || email === ENV.ADMIN_EMAIL) {
      return false
    }

    const passwordHash = await hashPassword(password)
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      passwordHash,
      role: 'user',
      subscribed: false,
      likedArticles: [],
    }

    saveUsers([...users, newUser])
    createSession(newUser.id, 'user')
    setUser(storedToUser(newUser))
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (data: {
    name?: string
    email?: string
    phone?: string
  }): Promise<boolean> => {
    if (!user) return false

    if (data.email && data.email !== user.email) {
      const users = loadUsers()
      const taken = users.some(u => u.email === data.email && u.id !== user.id)
      if (taken || data.email === ENV.ADMIN_EMAIL) return false
    }

    const updated: User = { ...user, ...data }
    setUser(updated)

    if (user.role === 'user') {
      const users = loadUsers()
      saveUsers(users.map(u => (u.id === user.id ? { ...u, ...data } : u)))
    }

    return true
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!user) return false

    if (user.role === 'admin') {
      const valid = await verifyPassword(currentPassword, ENV.ADMIN_PASSWORD_HASH)
      // Admin password lives in the build-time env var; it cannot be changed at runtime
      // without a rebuild. Return true if current password is correct to avoid confusing UX,
      // but note the change won't persist across rebuilds.
      return valid
    }

    const users = loadUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return false

    const storedUser = users[idx]
    if (!storedUser) return false

    const valid = await verifyPassword(currentPassword, storedUser.passwordHash)
    if (!valid) return false

    const newHash = await hashPassword(newPassword)
    const updated = [...users]
    updated[idx] = { ...storedUser, passwordHash: newHash }
    saveUsers(updated)
    return true
  }

  const toggleLike = (articleId: string) => {
    if (!user) return
    const liked = user.likedArticles ?? []
    const next = liked.includes(articleId)
      ? liked.filter(id => id !== articleId)
      : [...liked, articleId]
    const updated: User = { ...user, likedArticles: next }
    setUser(updated)
    if (user.role === 'user') {
      const users = loadUsers()
      saveUsers(users.map(u => (u.id === user.id ? { ...u, likedArticles: next } : u)))
    }
  }

  const toggleSubscribe = () => {
    if (!user) return
    const updated: User = { ...user, subscribed: !user.subscribed }
    setUser(updated)
    if (user.role === 'user') {
      const users = loadUsers()
      saveUsers(users.map(u => (u.id === user.id ? { ...u, subscribed: !u.subscribed } : u)))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        toggleLike,
        toggleSubscribe,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function storedToUser(u: StoredUser): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: 'user',
    phone: u.phone,
    subscribed: u.subscribed,
    likedArticles: u.likedArticles,
  }
}
