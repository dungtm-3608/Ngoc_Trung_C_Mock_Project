import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type AuthPageLayoutProps = {
  title: string
  breadcrumbLabel: string
  asideActionLabel: string
  asideActionTo: string
  children: ReactNode
}

export default function AuthPageLayout({
  title,
  breadcrumbLabel,
  asideActionLabel,
  asideActionTo,
  children,
}: AuthPageLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Link to="/" className="hover:text-[#c29f62]">Trang chủ</Link>
            <span>/</span>
            <span className="text-[#c29f62]">{breadcrumbLabel}</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl uppercase tracking-[0.04em] text-neutral-800">{title}</h1>
          <div className="mt-3 flex items-center gap-3 text-neutral-500">
            <span className="text-sm">❦</span>
            <span className="h-px w-10 bg-neutral-400" />
          </div>
        </div>

        <Link
          to={asideActionTo}
          className="inline-flex min-h-12 items-center justify-center border border-black bg-black px-10 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#c29f62] hover:bg-[#c29f62]"
        >
          {asideActionLabel}
        </Link>
      </div>

      <section className="border border-neutral-200 bg-white px-6 py-8 md:px-10 md:py-10">
        {children}
      </section>
    </main>
  )
}