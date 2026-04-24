import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ProductOverviewSection from '../../components/layout/product_detail/ProductOverviewSection'
import ProductHighlightsSection from '../../components/layout/product_detail/ProductHighlightsSection'
import RelatedWinesSection from '../../components/layout/product_detail/RelatedWinesSection'
import { isUserLoggedIn } from '../../store/AuthContext'
import wineService from '../../services/wineService'
import type { Wine } from '../../types/wine'
import { getWineCategorySlug } from '../../utils/wineUtils'

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { wineId } = useParams<{ categorySlug?: string; wineId?: string }>()
  const [wine, setWine] = useState<Wine | null>(null)
  const [relatedWines, setRelatedWines] = useState<Wine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const isLoggedIn = isUserLoggedIn()

  useEffect(() => {
    if (!wineId) {
      setWine(null)
      setErrorMessage('Không tìm thấy sản phẩm.')
      setIsLoading(false)
      return
    }

    let active = true

    ;(async () => {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const [currentWine, wines] = await Promise.all([
          wineService.getWineById(wineId),
          wineService.getWines(),
        ])

        if (!active) return

        if (!currentWine) {
          setWine(null)
          setRelatedWines([])
          setErrorMessage('Không tìm thấy sản phẩm.')
          return
        }

        setWine(currentWine)
        setSelectedColor(currentWine.colors?.[0] ?? '')
        setSelectedSize(currentWine.size?.[0] ?? '')
        setRelatedWines(
          wines
            .filter((candidate) => candidate.category === currentWine.category && candidate.id !== currentWine.id)
            .slice(0, 4),
        )
      } catch (error) {
        if (!active) return
        console.error('ProductDetailPage: error fetching product', error)
        setWine(null)
        setRelatedWines([])
        setErrorMessage('Không thể tải chi tiết sản phẩm.')
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [wineId])

  const relatedSectionTitle = useMemo(() => {
    if (!wine?.category) return 'Sản phẩm liên quan'
    return `Khám phá thêm ${wine.category}`
  }, [wine])

  const handleAddToCart = () => {
    if (!wine) return

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

  }

  const handleRelatedWineAddToCart = (relatedWine: Wine) => {
    void relatedWine

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

  }

  if (isLoading) {
    return <main className="mx-auto max-w-7xl px-6 py-12 text-sm text-neutral-500">Đang tải chi tiết sản phẩm...</main>
  }

  if (!wine) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-neutral-400">Sản phẩm</p>
        <h1 className="mt-4 text-3xl font-semibold uppercase tracking-[0.12em] text-neutral-900">Không tìm thấy sản phẩm</h1>
        <p className="mt-4 text-neutral-500">{errorMessage}</p>
        <Link to="/wines" className="mt-8 inline-flex border border-neutral-900 bg-neutral-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500">
          Quay lại danh sách
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="transition hover:text-amber-600">Trang chủ</Link>
        <span>/</span>
        <Link to={`/wines/${getWineCategorySlug(wine.category)}`} className="transition hover:text-amber-600">{wine.category}</Link>
        <span>/</span>
        <span className="text-neutral-800">{wine.name}</span>
      </div>

      <ProductOverviewSection
        wine={wine}
        quantity={quantity}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        setQuantity={setQuantity}
        setSelectedColor={setSelectedColor}
        setSelectedSize={setSelectedSize}
        onAddToCart={handleAddToCart}
      />

      <ProductHighlightsSection wine={wine} highlightWineId={relatedWines[0]?.id} />
      <RelatedWinesSection
        relatedWines={relatedWines}
        relatedSectionTitle={relatedSectionTitle}
        onAddToCart={handleRelatedWineAddToCart}
      />
    </main>
  )
}
