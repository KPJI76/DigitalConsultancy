import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  subscribed: boolean
  likedArticles: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  updateProfile: (data: { name?: string; email?: string; phone?: string }) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  toggleLike: (articleId: string) => void
  toggleSubscribe: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin credentials - YOUR PERSONAL ADMIN LOGIN
const ADMIN_EMAIL = 'aanyaus@gmail.com'
const DEFAULT_ADMIN_PASSWORD = 'Admin@123'

// Helper to get current admin password (stored or default)
const getAdminPassword = (): string => {
  return localStorage.getItem('ec_admin_password') || DEFAULT_ADMIN_PASSWORD
}

// Helper to set admin password
const setAdminPassword = (password: string): void => {
  localStorage.setItem('ec_admin_password', password)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('ec_user')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get current admin password (may have been changed)
    const currentAdminPassword = getAdminPassword()
    
    // Admin login - only YOUR credentials will have admin access
    if (email === ADMIN_EMAIL && password === currentAdminPassword) {
      const adminUser: User = {
        id: 'admin-' + btoa(ADMIN_EMAIL).slice(0, 8),
        email: ADMIN_EMAIL,
        name: 'Administrator',
        role: 'admin',
        subscribed: true,
        likedArticles: [],
      }
      setUser(adminUser)
      setIsAuthenticated(true)
      localStorage.setItem('ec_user', JSON.stringify(adminUser))
      return true
    }

    // Check regular users
    const users = JSON.parse(localStorage.getItem('ec_users') || '[]')
    const foundUser = users.find((u: any) => u.email === email && u.password === password)
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: 'user',
        subscribed: foundUser.subscribed || false,
        likedArticles: foundUser.likedArticles || [],
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('ec_user', JSON.stringify(userData))
      return true
    }

    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('ec_users') || '[]')
    
    // Check if email exists
    if (users.find((u: any) => u.email === email) || email === ADMIN_EMAIL) {
      return false
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role: 'user' as UserRole,
      subscribed: false,
      likedArticles: [],
    }

    users.push(newUser)
    localStorage.setItem('ec_users', JSON.stringify(users))

    // Auto login
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: 'user',
      subscribed: false,
      likedArticles: [],
    }
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('ec_user', JSON.stringify(userData))

    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('ec_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      setUser(updated)
      localStorage.setItem('ec_user', JSON.stringify(updated))
    }
  }

  const updateProfile = async (data: { name?: string; email?: string; phone?: string }): Promise<boolean> => {
    if (!user) return false

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const users = JSON.parse(localStorage.getItem('ec_users') || '[]')
      const emailExists = users.find((u: any) => u.email === data.email && u.id !== user.id)
      if (emailExists || data.email === ADMIN_EMAIL) {
        return false
      }
    }

    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('ec_user', JSON.stringify(updated))

    // Update in users list for regular users
    if (user.role === 'user') {
      const users = JSON.parse(localStorage.getItem('ec_users') || '[]')
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...data } : u
      )
      localStorage.setItem('ec_users', JSON.stringify(updatedUsers))
    }

    return true
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false

    // For admin, verify against stored password and update it
    if (user.role === 'admin') {
      const currentAdminPassword = getAdminPassword()
      if (currentPassword !== currentAdminPassword) {
        return false
      }
      // Save new admin password to localStorage
      setAdminPassword(newPassword)
      return true
    }

    // For regular users, verify and update in users list
    const users = JSON.parse(localStorage.getItem('ec_users') || '[]')
    const userIndex = users.findIndex((u: any) => u.id === user.id && u.password === currentPassword)
    
    if (userIndex === -1) {
      return false
    }

    users[userIndex].password = newPassword
    localStorage.setItem('ec_users', JSON.stringify(users))
    return true
  }

  const toggleLike = (articleId: string) => {
    if (!user) return
    
    const likedArticles = user.likedArticles || []
    const newLiked = likedArticles.includes(articleId)
      ? likedArticles.filter(id => id !== articleId)
      : [...likedArticles, articleId]
    
    updateUser({ likedArticles: newLiked })
  }

  const toggleSubscribe = () => {
    if (!user) return
    updateUser({ subscribed: !user.subscribed })
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin: user?.role === 'admin',
      login,
      signup,
      logout,
      updateUser,
      updateProfile,
      changePassword,
      toggleLike,
      toggleSubscribe,
    }}>
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
