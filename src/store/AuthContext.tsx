import React, { createContext, useContext, useState, useEffect } from 'react'
import type { LoginPayload, RegisterPayload, User } from '../types'
import * as authService from '../services/authService'

type AuthContextType = {
  user: User | null
  login: (p: LoginPayload) => Promise<void>
  register: (p: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return

    try {
      setUser(JSON.parse(stored) as User)
    } catch {
      localStorage.removeItem('user')
    }
  }, [])

  const persistSession = (nextUser: User, token: string) => {
    setUser(nextUser)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(nextUser))
  }

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload)
    persistSession(res.user, res.token)
  }

  const register = async (payload: RegisterPayload) => {
    const res = await authService.register(payload)
    persistSession(res.user, res.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
