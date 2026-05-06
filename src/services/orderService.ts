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

export async function getOrdersByUserId(userId: string) {
  const response = await axios.get<OrderRecord[]>(ORDERS_API, {
    params: {
      _where: JSON.stringify({
        userId: {
          eq: String(userId),
        },
      }),
      _sort: '-createdAt',
    },
  })

  const orders = Array.isArray(response.data) ? response.data : []

   return orders.filter((order) => String(order.userId) === String(userId))
}

export async function getOrderById(orderId: string) {
  const response = await axios.get<OrderRecord>(`${ORDERS_API}/${orderId}`)

  return response.data
}
