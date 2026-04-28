import { Link } from 'react-router-dom'

import { formatCurrency, getOriginalPrice } from '../../../utils/currencyUtil.ts'
import { FeaturedWineProps } from '../../../types/home/featureWineProps.ts'
import { getWineDetailPath } from '../../../utils/wineUtils.ts'

export default function FeaturedWine({ wine, bannerImage, resolveImage }: FeaturedWineProps) {
  return (
    <section className="relative mx-auto mb-16 max-w-5xl">
      <div className="h-[360px] overflow-hidden md:h-[420px]">
        <img src={bannerImage} alt="Detail of item" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto -mt-20 grid max-w-4xl gap-8 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:grid-cols-[1fr_1.1fr] md:px-12">
        <div className="relative flex items-center justify-center">
          {wine.discount ? (
            <div className="absolute left-0 top-0 h-0 w-0 border-b-[78px] border-l-[78px] border-b-amber-400 border-l-transparent">
              <span className="absolute -left-16 top-4 -rotate-45 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Giảm
              </span>
            </div>
          ) : null}
          <img src={resolveImage(wine.id)} alt={wine.name} className="h-[320px] w-auto object-contain" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chi tiết sản phẩm</p>
          <Link to={getWineDetailPath(wine)} className="mt-3 text-[30px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:text-amber-600">
            {wine.name}
          </Link>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Niên vụ {wine.yearFrom ?? '2026'}</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="text-[38px] leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
            {wine.discount ? (
              <span className="pb-1 text-base text-slate-400 line-through">
                {formatCurrency(getOriginalPrice(wine.price, wine.discount))}đ
              </span>
            ) : null}
          </div>
          <button className="mt-6 w-fit border border-slate-900 bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-500 hover:border-amber-500">
            Thêm vào giỏ
          </button>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
            {wine.description ?? 'Rượu vang được ủ trong điều kiện lý tưởng, tạo nên hương vị cân bằng và dư vị bền lâu.'}
          </p>
          <div className="mt-6 grid max-w-[280px] grid-cols-2 divide-x divide-y divide-amber-200 border border-amber-200 text-center text-amber-500">
            <div className="px-4 py-3">
              <p className="text-2xl leading-none">{wine.discount ?? 12}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em]">Giảm</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-2xl leading-none">{wine.yearFrom ?? '2026'}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em]">Năm</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-2xl leading-none">{wine.id}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em]">Mã</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-2xl leading-none">3</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em]">Cỡ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}