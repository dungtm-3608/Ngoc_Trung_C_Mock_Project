import type { OrderItemPayload } from './orderItemPayload'

export type OrderRecord = {
  id: string | number
  userId: string
  customerName: string
  phoneNumber: string
  shippingAddress: string
  total: number
  status: string
  createdAt: string
  items: OrderItemPayload[]
}
