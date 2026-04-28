import type { CreateOrderPayload } from '../types/order/createOrderPayload'
import type { OrderRecord } from '../types/order/orderRecord'

import axios from './axiosClient'

const ORDERS_API = '/orders'

export async function createOrder(payload: CreateOrderPayload) {
  const response = await axios.post<OrderRecord>(ORDERS_API, {
    ...payload,
    status: payload.status ?? 'pending',
    createdAt: new Date().toISOString(),
  })

  return response.data
}
