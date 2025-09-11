import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password, role) => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      })
      const data = await res.json()
      if (!data.success) throw new Error('Login failed')
      const userData = data.user
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true }
    } catch (error) {
      toast.error('Login failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      if (!data.success) throw new Error('Registration failed')
      const newUser = data.user
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      toast.success('Registration successful! Welcome to Shareity!')
      return { success: true }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    toast.success('Profile updated successfully')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
