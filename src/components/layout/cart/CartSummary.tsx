import { Link } from 'react-router-dom'

import { formatCurrency } from '../../../utils/currencyUtil'

type CartSummaryProps = {
  subtotal: number
  selectedCount: number
  selectedSubtotal: number
  onCheckout: () => void
}

export default function CartSummary({ subtotal, selectedCount, selectedSubtotal, onCheckout }: CartSummaryProps) {
  return (
    <aside className="h-fit border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Tóm tắt</p>
      <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Thanh toán</h2>

      <div className="mt-6 space-y-4 border-y border-neutral-200 py-5 text-sm text-neutral-600">
        <div className="flex items-center justify-between">
          <span>Tổng giỏ hàng</span>
          <span className="text-neutral-900">{formatCurrency(subtotal)}đ</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Đã chọn</span>
          <span className="text-neutral-900">{selectedCount} sản phẩm</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-neutral-900">
          <span>Tạm tính thanh toán</span>
          <span>{formatCurrency(selectedSubtotal)}đ</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className="mt-6 w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition enabled:hover:border-amber-500 enabled:hover:bg-amber-500 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500"
      >
        Tiến hành thanh toán
      </button>
      <Link to="/wines" className="mt-3 inline-flex text-sm text-neutral-500 transition hover:text-neutral-900">
        Tiếp tục mua hàng
      </Link>
    </aside>
  )
}