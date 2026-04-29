import type { OrderItemPayload } from './orderItemPayload'

export type CreateOrderPayload = {
  userId: string
  customerName: string
  phoneNumber: string
  shippingAddress: string
  total: number
  status?: string
  items: OrderItemPayload[]
}