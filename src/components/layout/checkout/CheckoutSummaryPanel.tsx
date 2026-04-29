import { formatCurrency } from '../../../utils/currencyUtil'

type CheckoutSummaryPanelProps = {
  customerName: string
  phoneNumber: string
  shippingAddress: string
  submitError: string
  isSubmitting: boolean
  total: number
  onCustomerNameChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
  onShippingAddressChange: (value: string) => void
  onPlaceOrder: () => void
}

export default function CheckoutSummaryPanel({
  customerName,
  phoneNumber,
  shippingAddress,
  submitError,
  isSubmitting,
  total,
  onCustomerNameChange,
  onPhoneNumberChange,
  onShippingAddressChange,
  onPlaceOrder,
}: CheckoutSummaryPanelProps) {
  return (
    <aside className="h-fit border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Thông tin giao hàng</p>
      <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Tóm tắt thanh toán</h2>
      <div className="mt-6 space-y-4 text-sm text-neutral-600">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Người nhận</span>
          <input
            name="customerName"
            autoComplete="name"
            placeholder="Họ và tên người nhận"
            value={customerName}
            onChange={(event) => onCustomerNameChange(event.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-800"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Số điện thoại</span>
          <input
            type="tel"
            name="phoneNumber"
            autoComplete="tel"
            placeholder="0912345678"
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange(event.target.value)}
            className="w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-800"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Địa chỉ giao hàng</span>
          <textarea
            name="shippingAddress"
            autoComplete="street-address"
            placeholder="Số nhà, đường, quận, thành phố"
            value={shippingAddress}
            onChange={(event) => onShippingAddressChange(event.target.value)}
            className="min-h-28 w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-800"
          />
        </label>
      </div>

      {submitError ? (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
      ) : null}

      <div className="mt-6 border-y border-neutral-200 py-5">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>Tạm tính</span>
          <span>{formatCurrency(total)}đ</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-base font-semibold text-neutral-900">
          <span>Tổng thanh toán</span>
          <span>{formatCurrency(total)}đ</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || !customerName.trim() || !phoneNumber.trim() || !shippingAddress.trim()}
        className="mt-6 w-full border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-amber-500 hover:bg-amber-500 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500"
      >
        Đặt hàng
      </button>
    </aside>
  )
}