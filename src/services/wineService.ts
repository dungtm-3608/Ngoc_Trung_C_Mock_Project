import { Wine } from '../types/wine'
import axios from './axiosClient'

const WINE_API = '/wines'

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

function getOnStoreTimestamp(onStoreDate?: string) {
  const timestamp = Date.parse(onStoreDate ?? '')
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const wineService = {
  async getNewProduct() {
    const response = await axios.get(WINE_API)
    const wines = normalizeWines(response.data)

    return [...wines].sort((a: Wine, b: Wine) => getOnStoreTimestamp(b.onStoreDate) - getOnStoreTimestamp(a.onStoreDate))
  },

  async getBestSellerProduct() {
    const response = await axios.get(WINE_API)
    const wines = normalizeWines(response.data)
    return [...wines].sort((a: Wine, b: Wine) => (b.discount ?? 0) - (a.discount ?? 0)).slice(0, 3)
  }
}

export default wineService
