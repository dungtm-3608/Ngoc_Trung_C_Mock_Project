import type { AuthUserRecord } from '../types'
import axiosClient from './axiosClient'

export const getUsers = async (): Promise<AuthUserRecord[]> => {
  const res = await axiosClient.get('/users')
  return res.data
}

export const updateUser = async (id: string, payload: Partial<AuthUserRecord>) => {
  const res = await axiosClient.patch(`/users/${id}`, payload)
  return res.data
}

export const deleteUser = async (id: string) => {
  const res = await axiosClient.delete(`/users/${id}`)
  return res.data
}

export default {
  getUsers,
  updateUser,
  deleteUser,
}
