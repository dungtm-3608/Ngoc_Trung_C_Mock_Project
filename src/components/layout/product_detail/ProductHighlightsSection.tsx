import type { Wine } from '../../../types/wine'

import { resolveWineImage } from '../../../utils/wineUtils'

type ProductHighlightsSectionProps = {
  wine: Wine
  highlightWineId?: string
}

export default function ProductHighlightsSection({ wine, highlightWineId }: ProductHighlightsSectionProps) {
  return (
    <section className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="border border-neutral-200 p-6 md:p-8">
        <div className="flex flex-wrap gap-3 border-b border-neutral-200 pb-4 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          <span className="border-b-2 border-amber-500 pb-3 text-neutral-900">Đặc điểm nổi bật</span>
          <span>Thông tin sản phẩm</span>
          <span>Đánh giá</span>
        </div>
        <p className="mt-6 text-sm leading-8 text-neutral-600">
          {wine.description ?? 'Rượu được bảo quản trong điều kiện nhiệt độ ổn định để giữ hương thơm trái cây và cấu trúc tannin cân đối. Phù hợp khi dùng cùng thịt đỏ, phô mai lâu năm hoặc những buổi gặp gỡ mang tính lễ nghi.'}
        </p>
      </div>

      <aside className="overflow-hidden border border-neutral-200 bg-neutral-100">
        <img src={resolveWineImage(highlightWineId ?? wine.id)} alt="Wine highlight" className="h-full w-full object-cover" />
      </aside>
    </section>
  )
}