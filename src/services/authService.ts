import { LoginPayload } from '../types'

export const login = async (payload: LoginPayload) => {
  // Mock API call - replace with real request
  await new Promise((r) => setTimeout(r, 700))
  if (payload.email === 'user@example.com' && payload.password === 'password') {
    return { token: 'mock-token-123', name: 'Demo User' }
  }
  throw new Error('Invalid credentials')
}
