import { useEffect, useState } from 'react'
import axiosClient from '../services/axiosClient'
import type { OrderRecord } from '../types/order/orderRecord'

type PaginatedOrdersResponse = {
  data?: OrderRecord[]
  items?: number
  pages?: number
}

const STATUS_LABELS: Record<string, string> = {
  all: 'Tất cả',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  delivering: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
}

export default function useAdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [editingStatus, setEditingStatus] = useState<Record<string, string>>({})
  const [page, setPage] = useState<number>(1)
  const perPage = 20
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => { fetchOrders(page) }, [page])

  const fetchOrders = async (p = 1) => {
    setLoading(true)
    try {
      const res = await axiosClient.get('/orders', { params: { _page: p, _per_page: perPage, _sort: '-createdAt' } })
      const payload = res.data as OrderRecord[] | PaginatedOrdersResponse
      const nextOrders = Array.isArray(payload) ? payload : (payload.data ?? [])
      const totalCount = Array.isArray(payload) ? payload.length : (payload.items ?? nextOrders.length)
      const nextTotalPages = Array.isArray(payload) ? Math.max(1, Math.ceil(totalCount / perPage)) : (payload.pages ?? Math.max(1, Math.ceil(totalCount / perPage)))

      const sortOrders = (arr: OrderRecord[]) => arr.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setOrders(sortOrders(nextOrders))
      setTotalPages(nextTotalPages)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (orderId: string | number, status: string) => {
    setEditingStatus((s) => ({ ...s, [String(orderId)]: status }))
  }

  const saveStatus = async (orderId: string | number) => {
    const status = editingStatus[String(orderId)]
    if (!status) return
    try {
      await axiosClient.patch(`/orders/${orderId}`, { status })
      await fetchOrders()
      setEditingStatus((s) => { const c = { ...s }; delete c[String(orderId)]; return c })
    } catch (err) {
      console.error('useAdminOrders: update status error', err)
    }
  }

  const filtered = orders.filter((o) => (filter === 'all' ? true : o.status === filter))

  return {
    orders,
    loading,
    filter,
    setFilter,
    editingStatus,
    handleStatusChange,
    saveStatus,
    filtered,
    STATUS_LABELS,
    fetchOrders,
    page,
    setPage,
    perPage,
    totalPages,
  }
}
