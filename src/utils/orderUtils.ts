import type { OrderRecord } from '../types/order/orderRecord'

export const ORDER_STATUS_OPTIONS = [
  'all',
  'pending',
  'confirmed',
  'delivering',
  'delivered',
  'cancelled',
] as const

export type OrderStatusFilter = (typeof ORDER_STATUS_OPTIONS)[number]

const ORDER_STATUS_LABELS: Record<Exclude<OrderStatusFilter, 'all'>, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

const ORDER_STATUS_BADGE_CLASSES: Record<Exclude<OrderStatusFilter, 'all'>, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmed: 'border-sky-200 bg-sky-50 text-sky-700',
  delivering: 'border-violet-200 bg-violet-50 text-violet-700',
  delivered: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
}

export function getOrderStatusLabel(status: string) {
  return ORDER_STATUS_LABELS[status as Exclude<OrderStatusFilter, 'all'>] ?? status
}

export function getOrderStatusBadgeClass(status: string) {
  return ORDER_STATUS_BADGE_CLASSES[status as Exclude<OrderStatusFilter, 'all'>] ?? 'border-neutral-200 bg-neutral-50 text-neutral-700'
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getOrderItemCount(order: OrderRecord) {
  return order.items.reduce((total, item) => total + item.quantity, 0)
}

export function countOrdersByStatus(orders: OrderRecord[], status: OrderStatusFilter) {
  if (status === 'all') return orders.length
  return orders.filter((order) => order.status === status).length
}