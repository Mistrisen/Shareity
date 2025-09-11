import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const dashboardPath = user?.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard'
    return <Navigate to={dashboardPath} replace />
  }

  return children
}

export default ProtectedRoute
