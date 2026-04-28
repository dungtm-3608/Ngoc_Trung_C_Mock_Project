import { Link } from 'react-router-dom'

import type { Wine } from '../../../types/wine'
import { formatCurrency } from '../../../utils/currencyUtil'
import { getWineDetailPath, resolveWineImage } from '../../../utils/wineUtils'

type RelatedWinesSectionProps = {
  relatedWines: Wine[]
  relatedSectionTitle: string
  onAddToCart: (wine: Wine) => void
}

export default function RelatedWinesSection({ relatedWines, relatedSectionTitle, onAddToCart }: RelatedWinesSectionProps) {
  if (!relatedWines.length) {
    return null
  }

  return (
    <section className="mt-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Gợi ý thêm</p>
        <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.14em] text-neutral-900">{relatedSectionTitle}</h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {relatedWines.map((relatedWine) => (
          <article key={relatedWine.id} className="flex flex-col items-center border border-neutral-200 px-5 py-6 text-center">
            <Link to={getWineDetailPath(relatedWine)} className="flex h-64 items-center justify-center">
              <img src={resolveWineImage(relatedWine.id)} alt={relatedWine.name} className="h-full w-auto object-contain" />
            </Link>
            <Link to={getWineDetailPath(relatedWine)} className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900 transition hover:text-amber-600">
              {relatedWine.name}
            </Link>
            <p className="mt-3 text-2xl text-amber-500">{formatCurrency(relatedWine.price)}đ</p>
        
          </article>
        ))}
      </div>
    </section>
  )
}