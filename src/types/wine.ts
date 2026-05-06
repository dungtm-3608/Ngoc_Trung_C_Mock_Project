export type Wine = {
  id: string
  name: string
  category?: string
  categoryId?: string
  categoryName?: string
  description?: string
  colors?: string[]
  size?: string[]
  price: number
  discount?: number
  onStoreDate?: string
  yearFrom?: string
}

export type CartItem = {
  wineId: string
  quantity: number
  selected: boolean
  selectedColor?: string
  selectedSize?: string
}
