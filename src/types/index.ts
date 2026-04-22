export type User = {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  name: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  subscribeNewsletter: boolean
}

export type AuthUserRecord = {
  id: string | number
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  subscribeNewsletter?: boolean
  createdAt?: string
}

export type AuthResponse = {
  token: string
  user: User
}
