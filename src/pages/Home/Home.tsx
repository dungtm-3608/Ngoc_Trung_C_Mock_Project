import { useEffect, useMemo, useState } from 'react'
import wineService from '../../services/wineService'
import FeaturedWine from '../../components/layout/home/FeaturedWine.tsx'
import { formatCurrency, getOriginalPrice } from '../../utils/currencyUtil.ts'
import type { Wine } from '../../types/wine.ts'
import { getWineDetailPath, resolveWineImage } from '../../utils/wineCatalog.ts'
import { Link } from 'react-router-dom'

const MAX_PRODUCTS = 8

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
  const [newProducts, setNewProducts] = useState<Wine[]>([])
  const [bestSellers, setBestSellers] = useState<Wine[]>([])

  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        const newProducts = await wineService.getNewProduct()
        const bestSellers = await wineService.getBestSellerProduct()
        if (!mounted) return
        setNewProducts(newProducts)
        setBestSellers(bestSellers)
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

  const renderProduct = (w: Wine) => (
    <article key={w.id} className="group relative flex w-full max-w-[250px] flex-col items-center px-2 pb-4 text-center">
  
      <div className="flex h-64 w-40 items-center justify-center overflow-hidden bg-white transition duration-300 group-hover:scale-[1.02]">
        <Link to={getWineDetailPath(w)}>
          <img
            src={resolveWineImage(w.id)}
            alt={w.name}
            className="h-full w-full object-contain"
            onError={(e) => console.warn('Home: image error for', w.id, e)}
          />
        </Link>
      </div>
      <Link to={getWineDetailPath(w)} className="mt-4 min-h-12 text-sm font-semibold uppercase tracking-[0.08em] text-slate-800 transition hover:text-amber-600">{w.name}</Link>
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

  const featuredWine = useMemo(
    () => bestSellers[0] ?? newProducts[0] ?? null,
    [bestSellers, newProducts],
  )

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
        {featuredWine ? (
          <FeaturedWine
            wine={featuredWine}
            bannerImage={farmGalleryImages[6] ?? farmGalleryImages[0] ?? ''}
            resolveImage={resolveWineImage}
          />
        ) : null}
        {newSection}
        {farmGallerySection}
        {bestSection}
      </div>
    </main>
  )
}
