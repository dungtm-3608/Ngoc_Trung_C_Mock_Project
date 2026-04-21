import axios from './axiosClient';

const WINE_API = '/wines';

function normalizeWines(data: unknown) {
  if (Array.isArray(data)) {
    return data
  }

  if (data && typeof data === 'object' && Array.isArray((data as { wines?: unknown[] }).wines)) {
    return (data as { wines: unknown[] }).wines
  }

  console.warn('wineService: unexpected response payload', data)
  return []
}

const wineService = {
  async getNewProduct() {
    const response = await axios.get(WINE_API)
    const wines = normalizeWines(response.data)

    return [...wines].sort(
      (a: any, b: any) => new Date(b.onStoreDate).getTime() - new Date(a.onStoreDate).getTime(),
    )
  },

  async getBestSellerProduct() {
    const response = await axios.get(WINE_API)
    const wines = normalizeWines(response.data)
    // Mocking best-seller logic: selecting wines with the highest discounts
    return [...wines].sort((a: any, b: any) => b.discount - a.discount).slice(0, 3)
  }
};

export default wineService;