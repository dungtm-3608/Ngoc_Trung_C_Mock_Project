import { Link } from 'react-router-dom'

type CheckoutLoadErrorStateProps = {
  message: string
  onRetry: () => void
}

export default function CheckoutLoadErrorState({ message, onRetry }: CheckoutLoadErrorStateProps) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Checkout</p>
      <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Không thể tải thanh toán</h1>
      <p className="mt-4 text-neutral-500">{message}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500"
        >
          Thử lại
        </button>
        <Link to="/cart" className="inline-flex border border-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 transition hover:border-amber-500 hover:text-amber-600">
          Quay lại giỏ hàng
        </Link>
      </div>
    </main>
  )
}