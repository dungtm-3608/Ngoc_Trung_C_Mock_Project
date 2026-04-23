import axios from 'axios'

import { Wine } from '../types/wine'
import axiosClient from './axiosClient'

const WINE_API = '/wines'

type WinesQueryOptions = {
  category?: string
}

function normalizeWines(data: unknown): Wine[] {
  if (Array.isArray(data)) {
    return data as Wine[]
  }

  if (data && typeof data === 'object' && Array.isArray((data as { wines?: Wine[] }).wines)) {
    return (data as { wines: Wine[] }).wines
  }

  console.warn('wineService: unexpected response payload', data)
  return []
}

function normalizeWine(data: unknown): Wine | null {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Wine
  }

  if (Array.isArray(data)) {
    return data[0] ?? null
  }

  if (data === null || data === undefined) {
    return null
  }

  console.warn('wineService: unexpected single wine payload', data)
  return null
}

function getOnStoreTimestamp(onStoreDate?: string) {
  const timestamp = Date.parse(onStoreDate ?? '')
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const wineService = {
  async getWines(options: WinesQueryOptions = {}) {
    const response = await axiosClient.get(WINE_API, {
      params: options.category ? { category: options.category } : undefined,
    })

    return normalizeWines(response.data)
  },

  async getWineById(wineId: string) {
    try {
      const response = await axiosClient.get(`${WINE_API}/${wineId}`)
      return normalizeWine(response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }

      throw error
    }
  },

  async getNewProduct() {
    const wines = await this.getWines()

    return [...wines].sort((a: Wine, b: Wine) => getOnStoreTimestamp(b.onStoreDate) - getOnStoreTimestamp(a.onStoreDate))
  },

  async getBestSellerProduct() {
    const wines = await this.getWines()
    return [...wines].sort((a: Wine, b: Wine) => (b.discount ?? 0) - (a.discount ?? 0)).slice(0, 3)
  }
}

export default wineService
