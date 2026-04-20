import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, LoginPayload } from '../types'
import * as authService from '../services/authService'

type AuthContextType = {
  user: User | null
  login: (p: LoginPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload)
    const u: User = { id: '1', email: payload.email, name: res.name }
    setUser(u)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
