import { Link } from 'react-router-dom'

export default function CheckoutEmptyState() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Checkout</p>
      <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Chưa có sản phẩm được chọn</h1>
      <p className="mt-4 text-neutral-500">Hãy quay lại giỏ hàng và chọn ít nhất một sản phẩm để tiếp tục.</p>
      <Link to="/cart" className="mt-8 inline-flex border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500">
        Quay lại giỏ hàng
      </Link>
    </main>
  )
}