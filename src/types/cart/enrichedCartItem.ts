import type { Wine } from '../wine'

export type EnrichedCartItem = {
  wineId: string
  wine: Wine
  quantity: number
  selected: boolean
  selectedColor?: string
  selectedSize?: string
}