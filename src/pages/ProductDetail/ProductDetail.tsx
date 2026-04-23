import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { isUserLoggedIn } from '../../store/AuthContext'
import wineService from '../../services/wineService'
import type { Wine } from '../../types/wine'
import { formatCurrency, getOriginalPrice } from '../../utils/currencyUtil'
import { getWineCategorySlug, getWineDetailPath, resolveWineImage } from '../../utils/wineCatalog'

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
            <span className="text-5xl leading-none text-amber-500">{formatCurrency(wine.price)}đ</span>
            {wine.discount ? (
              <span className="pb-1 text-lg text-neutral-400 line-through">{formatCurrency(getOriginalPrice(wine.price, wine.discount))}đ</span>
            ) : null}
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
              onClick={handleAddToCart}
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
          <img src={resolveWineImage(relatedWines[0]?.id ?? wine.id)} alt="Wine highlight" className="h-full w-full object-cover" />
        </aside>
      </section>

      {relatedWines.length ? (
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
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login')
                      return
                    }

                  }}
                  className="mt-4 border border-neutral-900 bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:border-amber-500 hover:bg-amber-500"
                >
                  Thêm vào giỏ
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
