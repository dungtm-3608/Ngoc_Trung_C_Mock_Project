import type { OrderRecord } from '../../../types/order/orderRecord'
import { formatCurrency } from '../../../utils/currencyUtil'
import {
  formatOrderDate,
  getOrderItemCount,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from '../../../utils/orderUtils'

type OrderListTableProps = {
  orders: OrderRecord[]
  activeOrderId?: string
  onSelectOrder: (orderId: string) => void
}

export default function OrderListTable({ orders, activeOrderId, onSelectOrder }: OrderListTableProps) {
  return (
    <div className="overflow-x-auto border border-neutral-200 bg-white">
      <table className="min-w-full border-collapse text-left text-sm text-neutral-700">
        <thead className="bg-neutral-50 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
          <tr>
            <th className="px-4 py-4">Mã đơn</th>
            <th className="px-4 py-4">Ngày đặt</th>
            <th className="px-4 py-4">Số SP</th>
            <th className="px-4 py-4">Tổng tiền</th>
            <th className="px-4 py-4">Tình trạng</th>
            <th className="px-4 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isActive = String(order.id) === activeOrderId

            return (
              <tr
                key={order.id}
                className={`border-t border-neutral-200 transition ${isActive ? 'bg-amber-50/60' : 'hover:bg-neutral-50'}`}
              >
                <td className="px-4 py-4 font-semibold text-neutral-900">#{order.id}</td>
                <td className="px-4 py-4 text-neutral-500">{formatOrderDate(order.createdAt)}</td>
                <td className="px-4 py-4">{getOrderItemCount(order)}</td>
                <td className="px-4 py-4 font-semibold text-neutral-900">{formatCurrency(order.total)}đ</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onSelectOrder(String(order.id))}
                    aria-label={`Xem chi tiết đơn hàng #${order.id}`}
                    className="border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-800 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}