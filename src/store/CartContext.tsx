import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { CartItem } from '../types/wine'

type AddToCartInput = {
  wineId: string
  quantity?: number
  selectedColor?: string
  selectedSize?: string
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addToCart: (input: AddToCartInput) => void
  updateQuantity: (cartItemKey: string, quantity: number) => void
  removeFromCart: (cartItemKey: string) => void
  toggleSelected: (cartItemKey: string) => void
  clearSelected: () => void
}

const CART_STORAGE_KEY = 'cart-items'

const CartContext = createContext<CartContextType | undefined>(undefined)

function getBrowserStorage() {
  const storage = globalThis.localStorage

  if (
    storage
    && typeof storage.getItem === 'function'
    && typeof storage.setItem === 'function'
    && typeof storage.removeItem === 'function'
  ) {
    return storage
  }

  return null
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return typeof candidate.wineId === 'string'
    && typeof candidate.quantity === 'number'
    && typeof candidate.selected === 'boolean'
}

function normalizeQuantity(quantity?: number) {
  if (!Number.isFinite(quantity)) return 1
  return Math.max(1, Math.floor(quantity ?? 1))
}

export function getCartItemKey(item: Pick<CartItem, 'wineId' | 'selectedColor' | 'selectedSize'>) {
  return [item.wineId, item.selectedColor ?? '', item.selectedSize ?? ''].join('::')
}

function loadStoredCartItems(): CartItem[] {
  const storage = getBrowserStorage()
  if (!storage) return []

  const stored = storage.getItem(CART_STORAGE_KEY)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      storage.removeItem(CART_STORAGE_KEY)
      return []
    }

    return parsed.filter(isCartItem)
  } catch {
    storage.removeItem(CART_STORAGE_KEY)
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCartItems)

  useEffect(() => {
    getBrowserStorage()?.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextType>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addToCart: ({ wineId, quantity, selectedColor, selectedSize }) => {
      setItems((currentItems) => {
        const nextQuantity = normalizeQuantity(quantity)
        const nextItemKey = getCartItemKey({ wineId, selectedColor, selectedSize })
        const existingItem = currentItems.find((item) => getCartItemKey(item) === nextItemKey)

        if (!existingItem) {
          return [
            ...currentItems,
            {
              wineId,
              quantity: nextQuantity,
              selected: true,
              selectedColor,
              selectedSize,
            },
          ]
        }

        return currentItems.map((item) => {
          if (getCartItemKey(item) !== nextItemKey) return item

          return {
            ...item,
            quantity: item.quantity + nextQuantity,
            selected: true,
          }
        })
      })
    },
    updateQuantity: (cartItemKey, quantity) => {
      setItems((currentItems) => currentItems.map((item) => {
        if (getCartItemKey(item) !== cartItemKey) return item
        return { ...item, quantity: normalizeQuantity(quantity) }
      }))
    },
    removeFromCart: (cartItemKey) => {
      setItems((currentItems) => currentItems.filter((item) => getCartItemKey(item) !== cartItemKey))
    },
    toggleSelected: (cartItemKey) => {
      setItems((currentItems) => currentItems.map((item) => {
        if (getCartItemKey(item) !== cartItemKey) return item
        return { ...item, selected: !item.selected }
      }))
    },
    clearSelected: () => {
      setItems((currentItems) => currentItems.filter((item) => !item.selected))
    },
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}