import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getSession } from '../lib/session'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth()

  // Verify the session token is still valid (not expired)
  const session = getSession()
  if (!isAuthenticated || !session) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
