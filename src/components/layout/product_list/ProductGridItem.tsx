import { Link, useNavigate } from 'react-router-dom'

import { isUserLoggedIn } from '../../../store/AuthContext'

import type { Wine } from '../../../types/wine'
import { formatCurrency, getOriginalPrice } from '../../../utils/currencyUtil'
import { getWineDetailPath } from '../../../utils/wineUtils'

type ProductCardProps = {
  wine: Wine
  resolveImage: (wineId: string) => string
}

export default function ProductGridItem({ wine, resolveImage }: ProductCardProps) {
  const navigate = useNavigate()
  const isLoggedIn = isUserLoggedIn()

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
  }

  return (
    <article className="group flex flex-col items-center text-center">
      <Link to={getWineDetailPath(wine)} className="block w-full">
        <div className="flex h-72 w-full items-center justify-center overflow-hidden bg-white px-6 py-4 transition duration-300 group-hover:scale-[1.01]">
          <img src={resolveImage(wine.id)} alt={wine.name} className="h-full w-auto object-contain" />
        </div>
      </Link>
      <p className="mt-5 text-xs uppercase tracking-[0.28em] text-neutral-500">{wine.category}</p>
      <Link to={getWineDetailPath(wine)} className="mt-2 text-base font-semibold uppercase tracking-[0.12em] text-neutral-800 transition hover:text-amber-600">
        {wine.name}
      </Link>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
        {wine.discount ? (
          <span className="pb-1 text-sm text-neutral-400 line-through">{formatCurrency(getOriginalPrice(wine.price, wine.discount))}đ</span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-5 border border-neutral-900 bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500"
      >
        THÊM VÀO GIỎ
      </button>
    </article>
  )
}
