import axios from './axiosClient'
import type { AuthResponse, AuthUserRecord, LoginPayload, RegisterPayload, User } from '../types'

const USERS_API = '/users'

function createToken(userId: string) {
  return `mock-token-${userId}-${Date.now()}`
}

function toUser(record: AuthUserRecord): User {
  return {
    id: String(record.id),
    email: record.email,
    username: record.username,
    firstName: record.firstName,
    lastName: record.lastName,
    name: `${record.firstName} ${record.lastName}`.trim(),
    phoneNumber: record.phoneNumber,
  }
}

async function getUsers() {
  const response = await axios.get<AuthUserRecord[]>(USERS_API)
  return Array.isArray(response.data) ? response.data : []
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const normalizedEmail = payload.email.trim().toLowerCase()
  const users = await getUsers()
  const matchedUser = users.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (!matchedUser || (matchedUser.password !== payload.password)) {
    throw new Error('Thông tin đăng nhập không chính xác.')
  }

  return {
    token: createToken(String(matchedUser.id)),
    user: toUser(matchedUser),
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const users = await getUsers()
  const normalizedEmail = payload.email.trim().toLowerCase()
  const normalizedUsername = payload.username.trim().toLowerCase()

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Email đã tồn tại.')
  }

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
    throw new Error('Tên người dùng đã tồn tại.')
  }

  const response = await axios.post<AuthUserRecord>(USERS_API, {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    username: payload.username.trim(),
    email: normalizedEmail,
    phoneNumber: payload.phoneNumber.trim(),
    password: payload.password,
    subscribeNewsletter: payload.subscribeNewsletter,
    createdAt: new Date().toISOString(),
  })

  return {
    token: createToken(String(response.data.id)),
    user: toUser(response.data),
  }
}
