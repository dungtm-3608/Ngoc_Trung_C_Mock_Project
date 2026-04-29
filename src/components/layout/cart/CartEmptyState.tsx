import { Link } from 'react-router-dom'

export default function CartEmptyState() {
  return (
    <section className="mt-10 border border-dashed border-neutral-300 px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">Giỏ hàng đang trống</p>
      <h2 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Chưa có sản phẩm nào trong giỏ</h2>
      <Link to="/wines" className="mt-8 inline-flex border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500">
        Tiếp tục mua hàng
      </Link>
    </section>
  )
}