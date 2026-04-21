import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../store/AuthContext'
import wineService from '../../services/wineService'

const MAX_PRODUCTS = 8

type Wine = {
  id: string
  name: string
  description?: string
  price: number
  discount?: number
  onStoreDate?: string
  yearFrom?: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value)
}

function getOriginalPrice(price: number, discount = 0) {
  if (!discount) return price
  return Math.round(price / (1 - discount / 100))
}

function mapImageId(idStr: string) {
  const id = parseInt(idStr, 10) || 0
  if (id <= 0) return '1'
  const wrapped = ((id - 1) % 14) + 1
  return String(wrapped)
}

// load images from assets using Vite's import.meta.glob
const wineImages = import.meta.glob('/src/assets/wine/*.{png,jpg,jpeg}', { eager: true }) as Record<string, any>
const farmImages = import.meta.glob('/src/assets/farm/*.{png,jpg,jpeg}', { eager: true }) as Record<string, any>
const farmGalleryImages = Object.keys(farmImages)
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
  .slice(0, 8)
  .map((key) => farmImages[key].default || farmImages[key])

export default function Home() {
  const { user, logout } = useAuth()
  const [newProducts, setNewProducts] = useState<Wine[]>([])
  const [bestSellers, setBestSellers] = useState<Wine[]>([])

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        const newP = await wineService.getNewProduct()
        const best = await wineService.getBestSellerProduct()
        if (!mounted) return
        setNewProducts(newP)
        setBestSellers(best)
      } catch (err) {
        console.error('Home: error fetching products', err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const resolveImage = (wineId: string) => {
    const imgId = mapImageId(wineId)
    const candidates = Object.keys(wineImages)
    const found = candidates.find((p) => p.includes(`/wine/${imgId}.`))
    if (found) return wineImages[found].default || wineImages[found]

    const farmKeys = Object.keys(farmImages)
    if (farmKeys.length) return farmImages[farmKeys[0]].default || farmImages[farmKeys[0]]

    return ''
  }

  const featuredWine = useMemo(
    () => newProducts.find((wine) => mapImageId(wine.id) === '6') ?? newProducts[0] ?? bestSellers[0],
    [bestSellers, newProducts],
  )

  const renderProduct = (w: Wine) => (
    <article key={w.id} className="group relative flex w-full max-w-[250px] flex-col items-center px-2 pb-4 text-center">
  
      <div className="flex h-64 w-40 items-center justify-center overflow-hidden bg-white transition duration-300 group-hover:scale-[1.02]">
        <img
          src={resolveImage(w.id)}
          alt={w.name}
          className="h-full w-full object-contain"
          onError={(e) => console.warn('Home: image error for', w.id, e)}
        />
      </div>
      <div className="mt-4 min-h-12 text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">{w.name}</div>
      <div className="mt-1 flex items-end justify-center gap-2">
        <span className="text-[30px] leading-none text-amber-500">{formatCurrency(w.price)}đ</span>
        {w.discount ? (
          <span className="text-sm text-slate-400 line-through">{formatCurrency(getOriginalPrice(w.price, w.discount))}đ</span>
        ) : null}
      </div>
      <button className="mt-4 border border-slate-900 bg-slate-900 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:border-amber-500">
        Thêm vào giỏ
      </button>
    </article>
  )

  const bestSection = useMemo(() => (
    <section className="mx-auto my-12 max-w-6xl">
      <h2 className="mb-8 text-center text-lg uppercase tracking-[0.28em] text-slate-800">Sản phẩm bán chạy</h2>
      <div className="grid grid-cols-2 justify-items-center gap-x-0 gap-y-8 md:grid-cols-4">
        {bestSellers.slice(0, MAX_PRODUCTS).map(renderProduct)}
      </div>
    </section>
  ), [bestSellers])

  const farmGallerySection = useMemo(() => (
    <section className="mx-auto my-10 max-w-6xl overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {farmGalleryImages.map((image, index) => (
          <div key={image} className="aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={`Farm ${index + 1}`}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  ), [])

  const newSection = useMemo(() => (
    <section className="mx-auto my-12 max-w-6xl">
      <h2 className="mb-8 text-center text-lg uppercase tracking-[0.28em] text-slate-800">Sản phẩm mới</h2>
      <div className="grid grid-cols-2 justify-items-center gap-x-0 gap-y-8 md:grid-cols-4">
        {newProducts.slice(0, MAX_PRODUCTS).map(renderProduct)}
      </div>
    </section>
  ), [newProducts])

  return (
    <main className="px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">Trang chủ</p>
        </div>
      
      </header>

      <div className="container mx-auto max-w-6xl">
        <section className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-[28px] font-semibold uppercase tracking-[0.3em] text-slate-800">Giới thiệu</h2>
          <div className="mx-auto mt-3 h-px w-36 bg-slate-300" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            Không gian rượu vang được chọn lọc để mang đến những chai rượu chất lượng, hương vị đậm đà và trải nghiệm mua sắm gần với phong cách hầm rượu cổ điển.
          </p>
          <button className="mt-6 border border-slate-900 bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-500 hover:border-amber-500">
            Xem thêm
          </button>
        </section>
        {/* {featuredWine ? (
          <section className="relative mx-auto mb-16 max-w-5xl">
            <div className="h-[360px] overflow-hidden md:h-[420px]">
              <img src={farmGalleryImages[6] ?? farmGalleryImages[0]} alt="Detail of item" className="h-full w-full object-cover" />
            </div>
            <div className="relative mx-auto -mt-20 grid max-w-4xl gap-8 bg-white px-8 py-10 shadow-[0_18px_60px_rgba(15,23,42,0.12)] md:grid-cols-[1fr_1.1fr] md:px-12">
              <div className="relative flex items-center justify-center">
                {featuredWine.discount ? (
                  <div className="absolute left-0 top-0 h-0 w-0 border-b-[78px] border-l-[78px] border-b-amber-400 border-l-transparent">
                    <span className="absolute -left-16 top-4 -rotate-45 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                      Giảm
                    </span>
                  </div>
                ) : null}
                <img src={resolveImage(featuredWine.id)} alt={featuredWine.name} className="h-[320px] w-auto object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Chi tiết sản phẩm</p>
                <h3 className="mt-3 text-[30px] font-semibold uppercase tracking-[0.12em] text-slate-800">
                  {featuredWine.name}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Niên vụ {featuredWine.yearFrom ?? '2026'}</p>
                <div className="mt-6 flex items-end gap-3">
                  <span className="text-[38px] leading-none text-amber-500">{formatCurrency(featuredWine.price)}đ</span>
                  {featuredWine.discount ? (
                    <span className="pb-1 text-base text-slate-400 line-through">
                      {formatCurrency(getOriginalPrice(featuredWine.price, featuredWine.discount))}đ
                    </span>
                  ) : null}
                </div>
                <button className="mt-6 w-fit border border-slate-900 bg-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-500 hover:border-amber-500">
                  Thêm vào giỏ
                </button>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                  {featuredWine.description ?? 'Rượu vang được ủ trong điều kiện lý tưởng, tạo nên hương vị cân bằng và dư vị bền lâu.'}
                </p>
                <div className="mt-6 grid max-w-[280px] grid-cols-2 divide-x divide-y divide-amber-200 border border-amber-200 text-center text-amber-500">
                  <div className="px-4 py-3">
                    <p className="text-2xl leading-none">{featuredWine.discount ?? 12}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em]">Giảm</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-2xl leading-none">{featuredWine.yearFrom ?? '2026'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em]">Năm</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-2xl leading-none">{featuredWine.id}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em]">Mã</p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-2xl leading-none">3</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em]">Cỡ</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null} */}
        {newSection}
        {farmGallerySection}
        {bestSection}
      </div>
    </main>
  )
}
