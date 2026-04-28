import { Link } from 'react-router-dom'
import type { Wine } from '../../../types/wine'
import { formatCurrency, getOriginalPrice } from '../../../utils/currencyUtil'
import { getWineDetailPath } from '../../../utils/wineUtils'

type ProductListItemProps = {
  wine: Wine
  resolveImage: (wineId: string) => string
}

export default function ProductListItem({ wine, resolveImage }: ProductListItemProps) {
  return (
    <article className="grid gap-6 border-b border-neutral-200 pb-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
      <Link to={getWineDetailPath(wine)} className="flex h-64 items-center justify-center bg-white px-6 py-4">
        <img src={resolveImage(wine.id)} alt={wine.name} className="h-full w-auto object-contain" />
      </Link>
      <div>
        <Link to={getWineDetailPath(wine)} className="mt-3 inline-block text-3xl font-semibold uppercase tracking-[0.08em] text-neutral-800 transition hover:text-amber-600">
          {wine.name}
        </Link>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-4xl leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
          {wine.discount ? (
            <span className="pb-1 text-base text-neutral-400 line-through">{formatCurrency(getOriginalPrice(wine.price, wine.discount))}đ</span>
          ) : null}
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500">{wine.description}</p>
      </div>
    </article>
  )
}
