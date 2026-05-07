import { Link } from 'react-router-dom'
import type { Dispatch, SetStateAction } from 'react'

import type { Wine } from '../../../types/wine'
import { formatCurrency, getDiscountedPrice } from '../../../utils/currencyUtil'
import { resolveWineImage } from '../../../utils/wineUtils'

type ProductOverviewSectionProps = {
  wine: Wine
  quantity: number
  selectedColor: string
  selectedSize: string
  setQuantity: Dispatch<SetStateAction<number>>
  setSelectedColor: Dispatch<SetStateAction<string>>
  setSelectedSize: Dispatch<SetStateAction<string>>
  onAddToCart: () => void
}

export default function ProductOverviewSection({
  wine,
  quantity,
  selectedColor,
  selectedSize,
  setQuantity,
  setSelectedColor,
  setSelectedSize,
  onAddToCart,
}: ProductOverviewSectionProps) {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="border border-neutral-200 bg-white px-6 py-8 md:px-10">
        <div className="flex min-h-[420px] items-center justify-center">
          <img src={resolveWineImage(wine.id)} alt={wine.name} className="max-h-[520px] w-auto object-contain" />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">{wine.category}</p>
        <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.08em] text-neutral-900">{wine.name}</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.18em] text-neutral-500">Niên vụ {wine.yearFrom ?? '2026'}</p>

        <div className="mt-6 flex items-end gap-3 border-b border-neutral-200 pb-6">
          {wine.discount ? (
            <>
              <span className="text-5xl leading-none text-amber-500">{formatCurrency(getDiscountedPrice(wine.price, wine.discount))}đ</span>
              <span className="pb-1 text-lg text-neutral-400 line-through">{formatCurrency(wine.price)}đ</span>
            </>
          ) : (
            <span className="text-5xl leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
          )}
        </div>

        <p className="mt-6 text-sm leading-7 text-neutral-600">
          {wine.description ?? 'Rượu vang được tuyển chọn với hương vị cân bằng, hậu vị dài và cấu trúc phù hợp cho nhiều bữa tiệc.'}
        </p>

        <div className="mt-8 space-y-6">
          {wine.colors?.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Màu sắc</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {wine.colors.map((color) => {
                  const isActive = color === selectedColor
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${isActive ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-700 hover:border-neutral-800'}`}
                    >
                      {color}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          {wine.size?.length ? (
            <div>
              <label htmlFor="product-size" className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Kích cỡ</label>
              <select
                id="product-size"
                value={selectedSize}
                onChange={(event) => setSelectedSize(event.target.value)}
                className="mt-3 block w-full border border-neutral-300 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-neutral-800"
              >
                {wine.size.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Số lượng</p>
            <div className="mt-3 flex w-fit items-center border border-neutral-300">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="h-12 w-12 text-lg text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Giảm số lượng"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="h-12 w-16 border-x border-neutral-300 text-center text-sm text-neutral-900 outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="h-12 w-12 text-lg text-neutral-700 transition hover:bg-neutral-100"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onAddToCart}
            className="border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-amber-500 hover:bg-amber-500"
          >
            Thêm vào giỏ
          </button>
          <Link to="/cart" className="border border-neutral-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 transition hover:border-neutral-800">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </section>
  )
}