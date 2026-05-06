import type { CheckoutSelectedItem } from '../../../types/checkout/checkoutSelectedItem'
import { formatCurrency, getDiscountedPrice } from '../../../utils/currencyUtil'
import { resolveWineImage } from '../../../utils/wineUtils'

type CheckoutSelectedItemsListProps = {
  items: CheckoutSelectedItem[]
}

export default function CheckoutSelectedItemsList({ items }: CheckoutSelectedItemsListProps) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Checkout</p>
      <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.08em] text-neutral-900">Xác nhận đơn hàng</h1>
      <div className="mt-8 divide-y divide-neutral-200 border border-neutral-200">
        {items.map((item) => (
          <article key={item.cartItemKey} className="grid gap-5 px-6 py-5 md:grid-cols-[90px_minmax(0,1fr)_140px] md:items-center">
            <div className="flex h-24 items-center justify-center bg-white">
              <img src={resolveWineImage(item.wine.id)} alt={item.wine.name} className="h-full w-auto object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">{item.wine.category}</p>
              <h2 className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900">{item.wine.name}</h2>
              <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
                <span>Số lượng: {item.quantity}</span>
                {item.selectedColor ? <span>Màu: {item.selectedColor}</span> : null}
                {item.selectedSize ? <span>Cỡ: {item.selectedSize}</span> : null}
              </div>
            </div>
            <div className="text-lg font-semibold text-neutral-900 md:text-right">
              {(() => {
                const discounted = getDiscountedPrice(item.wine.price, item.wine.discount)
                return item.wine.discount ? (
                  <div className="flex flex-col items-end">
                    <span className="text-lg text-amber-500">{formatCurrency(discounted)}đ</span>
                    <span className="text-sm text-neutral-400 line-through">{formatCurrency(item.wine.price)}đ</span>
                    <span className="mt-1">{formatCurrency(discounted * item.quantity)}đ</span>
                  </div>
                ) : (
                  <div>{formatCurrency(item.wine.price * item.quantity)}đ</div>
                )
              })()}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}