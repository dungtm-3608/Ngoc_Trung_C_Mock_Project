import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import OrderDetailPanel from '../../components/layout/order/OrderDetailPanel'
import OrderListTable from '../../components/layout/order/OrderListTable'
import { getOrderById, getOrdersByUserId } from '../../services/orderService'
import { useAuth } from '../../store/AuthContext'
import type { OrderRecord } from '../../types/order/orderRecord'
import { ORDER_STATUS_OPTIONS, countOrdersByStatus, getOrderStatusLabel, type OrderStatusFilter } from '../../utils/orderUtils'

export default function OrderPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId?: string }>()
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [shouldScrollToDetail, setShouldScrollToDetail] = useState(false)
  const detailSectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!user) return

    let active = true

    ;(async () => {
      try {
        setIsLoading(true)
        setLoadError('')
        const nextOrders = await getOrdersByUserId(user.id)
        if (!active) return

        if (!orderId) {
          setOrders(nextOrders)
          return
        }

        const matchedOrder = nextOrders.find((order) => String(order.id) === orderId)

        if (matchedOrder) {
          setOrders(nextOrders)
          return
        }

        try {
          const nextSelectedOrder = await getOrderById(orderId)

          if (!active) return

          if (nextSelectedOrder.userId !== user.id) {
            setOrders(nextOrders)
            return
          }

          setOrders([nextSelectedOrder, ...nextOrders])
        } catch {
          if (!active) return
          setOrders(nextOrders)
        }
      } catch (error) {
        if (!active) return
        console.error('OrderPage: error fetching orders', error)
        setLoadError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [orderId, user])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  const selectedOrder = useMemo(() => {
    if (orderId) {
      return filteredOrders.find((order) => String(order.id) === orderId) ?? null
    }

    return filteredOrders[0] ?? null
  }, [filteredOrders, orderId])

  useEffect(() => {
    if (!orderId) return
    if (filteredOrders.some((order) => String(order.id) === orderId)) return

    if (filteredOrders[0]) {
      navigate(`/order/${filteredOrders[0].id}`, { replace: true })
      return
    }

    navigate('/order', { replace: true })
  }, [filteredOrders, navigate, orderId])

  useEffect(() => {
    if (!shouldScrollToDetail || !selectedOrder || !detailSectionRef.current) return

    detailSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setShouldScrollToDetail(false)
  }, [selectedOrder, shouldScrollToDetail])

  const handleSelectOrder = (nextOrderId: string) => {
    setShouldScrollToDetail(true)
    navigate(`/order/${nextOrderId}`)
  }

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-6 py-12 text-sm text-neutral-500">Đang tải đơn hàng...</main>
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="transition hover:text-amber-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-neutral-800">Danh sách đơn hàng</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Đơn hàng</p>
          <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.08em] text-neutral-900">Danh sách đơn hàng</h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-neutral-500">
          Theo dõi trạng thái, xem thông tin người nhận và kiểm tra từng sản phẩm trong đơn hàng của bạn.
        </p>
      </div>

      {loadError ? (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
      ) : null}

      {!loadError ? (
        <>
          <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 px-6 py-5">
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Bộ lọc trạng thái</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {ORDER_STATUS_OPTIONS.map((status) => {
                    const isActive = statusFilter === status

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        aria-pressed={isActive}
                        className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${isActive ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'}`}
                      >
                        {status === 'all' ? 'Tất cả' : getOrderStatusLabel(status)} ({countOrdersByStatus(orders, status)})
                      </button>
                    )
                  })}
                </div>
              </div>

              {!filteredOrders.length ? (
                <div className="px-6 py-12 text-center text-sm text-neutral-500">
                  {orders.length ? 'Không có đơn hàng phù hợp với trạng thái đang chọn.' : 'Bạn chưa có đơn hàng nào. Hoàn tất thanh toán để đơn hàng xuất hiện tại đây.'}
                </div>
              ) : (
                <OrderListTable
                  orders={filteredOrders}
                  activeOrderId={selectedOrder ? String(selectedOrder.id) : undefined}
                  onSelectOrder={handleSelectOrder}
                />
              )}
            </div>

          </section>

          {selectedOrder ? (
            <div ref={detailSectionRef} className="mt-8">
              <OrderDetailPanel order={selectedOrder} />
            </div>
          ) : null}
        </>
      ) : null}
    </main>
  )
}