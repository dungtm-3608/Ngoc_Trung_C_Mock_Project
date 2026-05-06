import type { OrderRecord } from '../../../types/order/orderRecord'
import { formatCurrency } from '../../../utils/currencyUtil'
import {
  formatOrderDate,
  getOrderItemCount,
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
} from '../../../utils/orderUtils'

type OrderDetailPanelProps = {
  order: OrderRecord
}

export default function OrderDetailPanel({ order }: OrderDetailPanelProps) {
  return (
    <section className="border border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Chi tiết đơn hàng</p>
            <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.08em] text-neutral-900">#{order.id}</h2>
            <p className="mt-2 text-sm text-neutral-500">Đặt lúc {formatOrderDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </span>
            <span className="text-sm text-neutral-500">{getOrderItemCount(order)} sản phẩm</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="overflow-x-auto border border-neutral-200">
            <table className="min-w-[640px] border-collapse text-left text-sm text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                <tr>
                  <th className="px-4 py-4">Sản phẩm</th>
                  <th className="px-4 py-4">Thuộc tính</th>
                  <th className="px-4 py-4">SL</th>
                  <th className="px-4 py-4">Đơn giá</th>
                  <th className="px-4 py-4">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${item.wineId}-${item.selectedColor ?? ''}-${item.selectedSize ?? ''}`} className="border-t border-neutral-200">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-neutral-900">{item.wineName}</p>
                      <p className="mt-1 text-xs text-neutral-500">Mã SP: {item.wineId}</p>
                    </td>
                    <td className="px-4 py-4 text-neutral-500">
                      <p>{item.selectedColor ? `Màu: ${item.selectedColor}` : 'Màu mặc định'}</p>
                      <p className="mt-1">{item.selectedSize ? `Dung tích: ${item.selectedSize}` : 'Kích cỡ mặc định'}</p>
                    </td>
                    <td className="px-4 py-4">{item.quantity}</td>
                    <td className="px-4 py-4">{formatCurrency(item.unitPrice)}đ</td>
                    <td className="px-4 py-4 font-semibold text-neutral-900">{formatCurrency(item.unitPrice * item.quantity)}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border border-neutral-200 bg-neutral-50 px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Khách hàng</p>
            <dl className="mt-4 space-y-3 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold text-neutral-900">Người nhận</dt>
                <dd className="mt-1">{order.customerName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Số điện thoại</dt>
                <dd className="mt-1">{order.phoneNumber}</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-900">Địa chỉ giao hàng</dt>
                <dd className="mt-1 leading-6">{order.shippingAddress}</dd>
              </div>
            </dl>
          </div>

          <div className="border border-neutral-200 bg-white px-5 py-5">
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Thanh toán</p>
            <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.total)}đ</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 text-sm font-semibold uppercase tracking-[0.08em] text-neutral-900">
              <span>Tổng cộng</span>
              <span>{formatCurrency(order.total)}đ</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}