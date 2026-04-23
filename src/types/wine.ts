export type Wine = {
  id: string
  name: string
  category: string
  description?: string
  colors?: string[]
  size?: string[]
  price: number
  discount?: number
  onStoreDate?: string
  yearFrom?: string
}
