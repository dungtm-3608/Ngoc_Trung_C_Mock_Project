import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CheckoutEmptyState from '../../components/layout/checkout/CheckoutEmptyState'
import CheckoutLoadErrorState from '../../components/layout/checkout/CheckoutLoadErrorState'
import CheckoutSelectedItemsList from '../../components/layout/checkout/CheckoutSelectedItemsList'
import CheckoutSummaryPanel from '../../components/layout/checkout/CheckoutSummaryPanel'
import { useAuth } from '../../store/AuthContext'
import { getCartItemKey, useCart } from '../../store/CartContext'
import { createOrder } from '../../services/orderService'
import wineService from '../../services/wineService'
import type { CheckoutSelectedItem } from '../../types/checkout/checkoutSelectedItem'
import type { Wine } from '../../types/wine'
import { validatePhoneNumber } from '../../utils/validators'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, clearSelected } = useCart()
  const [wines, setWines] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadSeed, setReloadSeed] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!user) return

    setCustomerName((currentValue) => currentValue || user.name)
    setPhoneNumber((currentValue) => currentValue || user.phoneNumber)
  }, [user])

  useEffect(() => {
    setShippingAddress((currentValue) => currentValue || '12 Nguyen Hue, District 1, Ho Chi Minh City')
  }, [])

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
        console.error('CheckoutPage: error fetching wines', error)
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

  const selectedItems = useMemo<CheckoutSelectedItem[]>(() => {
    return items
      .filter((item) => item.selected)
      .flatMap((item) => {
        const wine = wines.find((candidate) => candidate.id === item.wineId)

        if (!wine) return []

        return [{
          cartItemKey: getCartItemKey(item),
          wine,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        }]
      })
  }, [items, wines])

  const total = selectedItems.reduce((sum, item) => sum + item.wine.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    const trimmedName = customerName.trim()
    const trimmedPhoneNumber = phoneNumber.trim()
    const trimmedAddress = shippingAddress.trim()
    const phoneNumberError = validatePhoneNumber(trimmedPhoneNumber)

    if (!trimmedName || !trimmedAddress) {
      setSubmitError('Vui lòng nhập đầy đủ thông tin giao hàng.')
      return
    }

    if (phoneNumberError) {
      setSubmitError(phoneNumberError)
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')

      const order = await createOrder({
        userId: user.id,
        customerName: trimmedName,
        phoneNumber: trimmedPhoneNumber,
        shippingAddress: trimmedAddress,
        total,
        items: selectedItems.map((item) => ({
          wineId: item.wine.id,
          wineName: item.wine.name,
          unitPrice: item.wine.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
      })

      clearSelected()
      navigate('/cart', { replace: true, state: { checkoutSuccess: true, orderId: order.id } })
    } catch (error) {
      console.error('CheckoutPage: error creating order', error)
      setSubmitError('Không thể lưu đơn hàng. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-6 py-12 text-sm text-neutral-500">Đang tải thông tin thanh toán...</main>
  }

  if (loadError) {
    return <CheckoutLoadErrorState message={loadError} onRetry={() => setReloadSeed((currentValue) => currentValue + 1)} />
  }

  if (!selectedItems.length) {
    return <CheckoutEmptyState />
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="transition hover:text-amber-600">Trang chủ</Link>
        <span>/</span>
        <Link to="/cart" className="transition hover:text-amber-600">Giỏ hàng</Link>
        <span>/</span>
        <span className="text-neutral-800">Thanh toán</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <CheckoutSelectedItemsList items={selectedItems} />
        <CheckoutSummaryPanel
          customerName={customerName}
          phoneNumber={phoneNumber}
          shippingAddress={shippingAddress}
          submitError={submitError}
          isSubmitting={isSubmitting}
          total={total}
          onCustomerNameChange={(value) => {
            setCustomerName(value)
            setSubmitError('')
          }}
          onPhoneNumberChange={(value) => {
            setPhoneNumber(value)
            setSubmitError('')
          }}
          onShippingAddressChange={(value) => {
            setShippingAddress(value)
            setSubmitError('')
          }}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </main>
  )
}