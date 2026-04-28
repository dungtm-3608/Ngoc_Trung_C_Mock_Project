import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types'
import * as authService from '../services/authService'

type AuthContextType = {
  user: User | null
  login: (p: LoginPayload) => Promise<void>
  register: (p: RegisterPayload) => Promise<AuthResponse>
  persistAuth: (auth: AuthResponse) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function isStoredUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return [
    candidate.id,
    candidate.email,
    candidate.username,
    candidate.firstName,
    candidate.lastName,
    candidate.name,
    candidate.phoneNumber,
  ].every((field) => typeof field === 'string' && field.trim().length > 0)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return

    try {
      const parsedUser = JSON.parse(stored)

      if (!isStoredUser(parsedUser)) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return
      }

      setUser(parsedUser)
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }, [])

  const persistSession = (nextUser: User, token: string) => {
    setUser(nextUser)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(nextUser))
  }

  const persistAuth = ({ user: nextUser, token }: AuthResponse) => {
    persistSession(nextUser, token)
  }

  const login = async (payload: LoginPayload) => {
    const res = await authService.login(payload)
    persistSession(res.user, res.token)
  }

  const register = async (payload: RegisterPayload) => {
    return authService.register(payload)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, persistAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token')
  return token?.trim() ? true : false
}
