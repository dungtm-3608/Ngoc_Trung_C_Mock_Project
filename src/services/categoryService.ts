import axiosClient from './axiosClient'
import type { AxiosResponse } from 'axios'

const API = '/categories'

export type CategoryRecord = {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

const categoryService = {
  async getCategories(): Promise<CategoryRecord[]> {
    const res: AxiosResponse = await axiosClient.get(API)
    return Array.isArray(res.data) ? (res.data as CategoryRecord[]) : []
  },

  async getCategoryById(id: string): Promise<CategoryRecord | null> {
    try {
      const res = await axiosClient.get(`${API}/${id}`)
      return res.data as CategoryRecord
    } catch (err) {
      return null
    }
  },

  async createCategory(payload: { name: string }) {
    const now = new Date().toISOString()
    const res = await axiosClient.post(API, { ...payload, createdAt: now, updatedAt: now, id: String(Date.now()) })
    return res.data as CategoryRecord
  },

  async updateCategory(id: string, payload: Partial<CategoryRecord>) {
    const res = await axiosClient.patch(`${API}/${id}`, { ...payload, updatedAt: new Date().toISOString() })
    return res.data as CategoryRecord
  },

  async deleteCategory(id: string) {
    const res = await axiosClient.delete(`${API}/${id}`)
    return res.data
  },
}

export default categoryService
