import { Link } from 'react-router-dom'

import { getCartItemKey } from '../../../store/CartContext'
import type { EnrichedCartItem } from '../../../types/cart/enrichedCartItem'
import { formatCurrency, getDiscountedPrice } from '../../../utils/currencyUtil'
import { getWineDetailPath, resolveWineImage } from '../../../utils/wineUtils'

type CartItemsTableProps = {
  items: EnrichedCartItem[]
  onToggleSelected: (cartItemKey: string) => void
  onUpdateQuantity: (cartItemKey: string, quantity: number) => void
  onRemove: (cartItemKey: string) => void
}

export default function CartItemsTable({ items, onToggleSelected, onUpdateQuantity, onRemove }: CartItemsTableProps) {
  return (
    <section className="overflow-hidden border border-neutral-200">
      <div className="hidden grid-cols-[minmax(0,1.9fr)_128px_160px_132px_72px] border-b border-neutral-200 bg-neutral-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 md:grid">
        <span>Sản phẩm</span>
        <span>Giá</span>
        <span>Số lượng</span>
        <span>Tổng</span>
        <span>Xoá</span>
      </div>

      <div className="divide-y divide-neutral-200">
        {items.map((item) => {
          const cartItemKey = getCartItemKey(item)
          const discounted = getDiscountedPrice(item.wine.price, item.wine.discount)

          return (
            <article key={cartItemKey} className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.9fr)_128px_160px_132px_72px] md:items-center">
              <div className="flex min-w-0 gap-3">
                <label className="flex shrink-0 items-center gap-2 text-sm text-neutral-600">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => onToggleSelected(cartItemKey)}
                    aria-label={`Chọn sản phẩm ${item.wine.name}`}
                    className="h-4 w-4 border-neutral-300 text-neutral-900 accent-neutral-900"
                  />
                  <span className="md:hidden">Chọn</span>
                </label>
                <Link to={getWineDetailPath(item.wine)} className="flex h-20 w-16 shrink-0 items-center justify-center bg-white">
                  <img src={resolveWineImage(item.wine.id)} alt={item.wine.name} className="h-full w-auto object-contain" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">{item.wine.category}</p>
                  <Link to={getWineDetailPath(item.wine)} className="mt-1 block text-[13px] font-semibold uppercase tracking-[0.08em] text-neutral-900 transition hover:text-amber-600 md:max-w-[150px]">
                    {item.wine.name}
                  </Link>
                  {item.selectedColor || item.selectedSize ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">Phân loại đã chọn</p>
                      <div className="flex flex-wrap gap-2">
                        {item.selectedColor ? (
                          <span className="border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                            Màu: {item.selectedColor}
                          </span>
                        ) : null}
                        {item.selectedSize ? (
                          <span className="border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                            Cỡ: {item.selectedSize}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

                <div className="text-sm text-neutral-700 md:pl-1">
                <p className="md:hidden text-xs uppercase tracking-[0.18em] text-neutral-400">Giá</p>
                <div>
                  {item.wine.discount ? (
                    <>
                      <span className="text-base text-amber-500">{formatCurrency(discounted)}đ</span>
                      <div className="text-xs text-neutral-400 line-through">{formatCurrency(item.wine.price)}đ</div>
                    </>
                  ) : (
                    <span className="text-base text-amber-500">{formatCurrency(item.wine.price)}đ</span>
                  )}
                </div>
              </div>

              <div>
                <p className="md:hidden text-xs uppercase tracking-[0.18em] text-neutral-400">Số lượng</p>
                <div className="mt-2 flex w-fit items-center border border-neutral-300">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(cartItemKey, Math.max(1, item.quantity - 1))}
                    className="h-10 w-10 text-lg text-neutral-700 transition hover:bg-neutral-100"
                    aria-label={`Giảm số lượng ${item.wine.name}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => onUpdateQuantity(cartItemKey, Number(event.target.value) || 1)}
                    className="cart-quantity-input h-10 w-14 border-x border-neutral-300 text-center text-sm text-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(cartItemKey, item.quantity + 1)}
                    className="h-10 w-10 text-lg text-neutral-700 transition hover:bg-neutral-100"
                    aria-label={`Tăng số lượng ${item.wine.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

                <div className="text-sm text-neutral-700">
                <p className="md:hidden text-xs uppercase tracking-[0.18em] text-neutral-400">Tổng</p>
                <span className="text-lg font-semibold text-neutral-900">{formatCurrency(discounted * item.quantity)}đ</span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(cartItemKey)}
                className="w-fit text-sm uppercase tracking-[0.18em] text-neutral-500 transition hover:text-red-600"
              >
                Xoá
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}