import { Link } from 'react-router-dom'

import notFoundImage from '../../assets/not_found_error/404.png'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-16">
      <section className="flex w-full max-w-5xl flex-col items-center justify-center text-center">
        <img
          src={notFoundImage}
          alt="404 not found"
          className="w-full max-w-5xl object-contain"
        />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62]"
          >
            Trang chủ
          </Link>
          <Link
            to="/wines"
            className="border border-neutral-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-800 transition hover:border-neutral-900"
          >
            Xem sản phẩm
          </Link>
        </div>
      </section>
    </main>
  )
}