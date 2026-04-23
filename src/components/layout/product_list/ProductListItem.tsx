import { useNavigate } from 'react-router-dom'

import { isUserLoggedIn } from '../../../store/AuthContext'
import type { Wine } from '../../../types/wine'
import { formatCurrency, getOriginalPrice } from '../../../utils/currencyUtil'

type ProductListItemProps = {
  wine: Wine
  resolveImage: (wineId: string) => string
}

export default function ProductListItem({ wine, resolveImage }: ProductListItemProps) {
  const navigate = useNavigate()
  const isLoggedIn = isUserLoggedIn()

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
  }

  return (
    <article className="grid gap-6 border-b border-neutral-200 pb-8 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
      <div className="flex h-64 items-center justify-center bg-white px-6 py-4">
        <img src={resolveImage(wine.id)} alt={wine.name} className="h-full w-auto object-contain" />
      </div>
      <div>
        <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.08em] text-neutral-800">{wine.name}</h2>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-4xl leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
          {wine.discount ? (
            <span className="pb-1 text-base text-neutral-400 line-through">{formatCurrency(getOriginalPrice(wine.price, wine.discount))}đ</span>
          ) : null}
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500">{wine.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <button
            type="button"
            onClick={handleAddToCart}
            className="border border-neutral-900 bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500"
          >
            THÊM VÀO GIỎ
          </button>
        </div>
      </div>
    </article>
  )
}
