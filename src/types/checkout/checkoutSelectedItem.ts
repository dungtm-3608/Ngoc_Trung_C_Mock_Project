import type { Wine } from '../wine'

export type CheckoutSelectedItem = {
  cartItemKey: string
  wine: Wine
  quantity: number
  selectedColor?: string
  selectedSize?: string
}