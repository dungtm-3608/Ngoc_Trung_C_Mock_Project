import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import CartEmptyState from '../../components/layout/cart/CartEmptyState'
import CartItemsTable from '../../components/layout/cart/CartItemsTable'
import CartSummary from '../../components/layout/cart/CartSummary'
import CheckoutLoadErrorState from '../../components/layout/checkout/CheckoutLoadErrorState'
import { useCart } from '../../store/CartContext'
import wineService from '../../services/wineService'
import { getDiscountedPrice } from '../../utils/currencyUtil'
import type { EnrichedCartItem } from '../../types/cart/enrichedCartItem'
import type { Wine } from '../../types/wine'

export default function CartPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, toggleSelected, updateQuantity, removeFromCart } = useCart()
  const [wines, setWines] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadSeed, setReloadSeed] = useState(0)

  const checkoutState = location.state as { checkoutSuccess?: boolean; orderId?: string | number } | null

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        setIsLoading(true)
        setLoadError('')
        const nextWines = await wineService.getWines()
        if (!active) return
        setWines(nextWines)
      } catch (error) {
        if (!active) return
        console.error('CartPage: error fetching wines', error)
        setWines([])
        setLoadError('Không thể tải thông tin sản phẩm. Vui lòng thử lại.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [reloadSeed])

  const detailedItems = useMemo<EnrichedCartItem[]>(() => {
    return items.flatMap((item) => {
      const wine = wines.find((candidate) => candidate.id === item.wineId)

      if (!wine) return []

      return [{
        wineId: item.wineId,
        wine,
        quantity: item.quantity,
        selected: item.selected,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
      }]
    })
  }, [items, wines])

  const selectedCount = detailedItems.filter((item) => item.selected).length
  const subtotal = detailedItems.reduce((total, item) => total + (getDiscountedPrice(item.wine.price, item.wine.discount) * item.quantity), 0)
  const selectedSubtotal = detailedItems
    .filter((item) => item.selected)
    .reduce((total, item) => total + (getDiscountedPrice(item.wine.price, item.wine.discount) * item.quantity), 0)

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-6 py-12 text-sm text-neutral-500">Đang tải giỏ hàng...</main>
  }

  if (loadError) {
    return <CheckoutLoadErrorState message={loadError} onRetry={() => setReloadSeed((s) => s + 1)} />
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="transition hover:text-amber-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-neutral-800">Giỏ hàng</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neutral-400">Cart</p>
          <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.08em] text-neutral-900">Giỏ hàng</h1>
        </div>
        <p className="text-sm text-neutral-500">Chọn sản phẩm cần thanh toán, thay đổi số lượng hoặc xoá khỏi giỏ.</p>
      </div>

      {checkoutState?.checkoutSuccess ? (
        <p className="mt-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Đơn hàng đã được lưu thành công{checkoutState.orderId ? `, mã đơn hàng: ${checkoutState.orderId}` : ''}.
        </p>
      ) : null}

      {!detailedItems.length ? (
        <CartEmptyState />
      ) : (
        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <CartItemsTable
            items={detailedItems}
            onToggleSelected={toggleSelected}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
          <CartSummary
            subtotal={subtotal}
            selectedCount={selectedCount}
            selectedSubtotal={selectedSubtotal}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      )}
    </main>
  )
}