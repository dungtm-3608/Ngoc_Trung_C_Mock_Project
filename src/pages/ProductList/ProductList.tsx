import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import LeftMenu from '../../components/layout/product_list/LeftMenu.tsx'
import PaginationButton from '../../components/layout/product_list/PaginationButton.tsx'
import ProductGridItem from '../../components/layout/product_list/ProductGridItem.tsx'
import ProductListItem from '../../components/layout/product_list/ProductListItem.tsx'
import wineService from '../../services/wineService.ts'
import type { Wine } from '../../types/wine.ts'
import {
  DEFAULT_CATEGORY_SLUG,
  OTHER_CATEGORY_LABEL,
  OTHER_CATEGORY_SLUG,
  PRIMARY_CATEGORY_NAMES,
  PRIMARY_CATEGORY_SLUG_TO_NAME,
  resolveWineImage,
  toCategorySlug,
} from '../../utils/wineUtils.ts'

import type { CategorySummary } from '../../types/categorySummary.ts'
import { PRODUCT_GRID_PAGE_SIZE, PRODUCT_LIST_PAGE_SIZE } from '../../constants/index.ts'

type ItemViewMode = 'grid' | 'list'

const farmImages = import.meta.glob('/src/assets/farm/*.{png,jpg,jpeg}', { eager: true }) as Record<string, { default?: string } | string>

function resolveAssetImage(asset: { default?: string } | string) {
  return typeof asset === 'string' ? asset : (asset.default ?? '')
}

function buildCategorySummaries(wines: Wine[]): CategorySummary[] {
  const counts = new Map<string, number>()

  wines.forEach((wine) => {
    counts.set(wine.category, (counts.get(wine.category) ?? 0) + 1)
  })

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      slug: toCategorySlug(name),
      count,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export default function ProductListPage() {
  const navigate = useNavigate()
  const { categorySlug } = useParams<{ categorySlug?: string }>()
  const [allWines, setAllWines] = useState<Wine[]>([])
  const [itemViewMode, setItemViewMode] = useState<ItemViewMode>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true

      ; (async () => {
        try {
          setIsLoadingCategories(true)
          setErrorMessage('')
          const wines = await wineService.getWines()
          if (!active) return
          setAllWines(wines)
        } catch (error) {
          if (!active) return
          console.error('ProductListPage: error fetching categories', error)
          setErrorMessage('Không thể tải danh mục sản phẩm.')
        } finally {
          if (active) {
            setIsLoadingCategories(false)
          }
        }
      })()

    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(() => buildCategorySummaries(allWines), [allWines])

  const selectedRouteSlug = useMemo(() => {
    if (!categorySlug) return DEFAULT_CATEGORY_SLUG
    return categorySlug in PRIMARY_CATEGORY_SLUG_TO_NAME ? categorySlug : OTHER_CATEGORY_SLUG
  }, [categorySlug])

  const selectedCategory = useMemo(() => {
    if (selectedRouteSlug === OTHER_CATEGORY_SLUG) {
      return OTHER_CATEGORY_LABEL
    }

    return PRIMARY_CATEGORY_SLUG_TO_NAME[selectedRouteSlug] ?? ''
  }, [selectedRouteSlug])

  useEffect(() => {
    if (categorySlug !== selectedRouteSlug) {
      navigate(`/wines/${selectedRouteSlug}`, { replace: true })
    }
  }, [categorySlug, selectedRouteSlug, navigate])

  const products = useMemo(() => {
    if (isLoadingCategories) return []

    return selectedRouteSlug === OTHER_CATEGORY_SLUG
      ? allWines.filter((wine) => !PRIMARY_CATEGORY_NAMES.has(wine.category))
      : allWines.filter((wine) => wine.category === PRIMARY_CATEGORY_SLUG_TO_NAME[selectedRouteSlug])
  }, [allWines, selectedRouteSlug, isLoadingCategories])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedRouteSlug, itemViewMode])

  const selectedCount = products.length
  const pageSize = itemViewMode === 'grid' ? PRODUCT_GRID_PAGE_SIZE : PRODUCT_LIST_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))
  const coverImage = useMemo(() => {
    const farmKeys = Object.keys(farmImages).sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))

    if (!farmKeys.length) return ''

    const randomIndex = Math.floor(Math.random() * farmKeys.length)
    return resolveAssetImage(farmImages[farmKeys[randomIndex]])
  }, [])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return products.slice(startIndex, startIndex + pageSize)
  }, [products, currentPage, pageSize])

  useEffect(() => {
    if (currentPage <= totalPages) return
    setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="transition hover:text-amber-600">Trang chủ</Link>
        <span>/</span>
        <span className="text-neutral-800">Danh mục sản phẩm</span>
        {selectedCategory ? (
          <>
            <span>/</span>
            <span className="text-neutral-800">{selectedCategory}</span>
          </>
        ) : null}
      </div>

      {coverImage ? (
        <div className="mb-8 overflow-hidden border border-neutral-200 bg-neutral-100">
          <img src={coverImage} alt="Wine collection cover" className="h-[240px] w-full object-cover md:h-[320px]" />
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <LeftMenu
          categories={categories}
          selectedCategory={selectedCategory}
          isLoadingCategories={isLoadingCategories}
        />

        <section>
          <header className="flex flex-col gap-4 border border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Wine collection</p>
              <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.18em] text-neutral-800">{selectedCategory || 'Danh mục rượu'}</h2>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setItemViewMode('grid')}
                  className={`flex h-9 w-9 items-center justify-center border text-sm transition ${itemViewMode === 'grid' ? 'border-amber-500 bg-amber-500 text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'}`}
                  aria-pressed={itemViewMode === 'grid'}
                  aria-label="Grid view">
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => setItemViewMode('list')}
                  className={`flex h-9 w-9 items-center justify-center border text-sm transition ${itemViewMode === 'list' ? 'border-amber-500 bg-amber-500 text-white' : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800'}`}
                  aria-pressed={itemViewMode === 'list'}
                  aria-label="List view">
                  ☰
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {!isLoadingCategories && !errorMessage && products.length ? (
                  <div className="ml-2 flex flex-wrap items-center gap-2">
                    <PaginationButton
                      ariaLabel="Trang trước"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                      &lt;
                    </PaginationButton>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <PaginationButton
                        key={page}
                        ariaLabel={`Trang ${page}`}
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationButton>
                    ))}
                    <PaginationButton
                      ariaLabel="Trang sau"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    >
                      &gt;
                    </PaginationButton>
                  </div>
                ) : null}
              </div>
              <p className="text-sm text-neutral-500">{selectedCount} sản phẩm</p>
            </div>
          </header>

          {errorMessage ? (
            <p className="mt-8 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
          ) : null}

          {isLoadingCategories ? (
            <p className="mt-8 text-sm text-neutral-500">Đang tải sản phẩm...</p>
          ) : itemViewMode === 'grid' ? (
            <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedProducts.map((wine) => (
                <ProductGridItem key={wine.id} wine={wine} resolveImage={resolveWineImage} />
              ))}
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {paginatedProducts.map((wine) => (
                <ProductListItem key={wine.id} wine={wine} resolveImage={resolveWineImage} />
              ))}
            </div>
          )}

          {!isLoadingCategories && !errorMessage && !products.length ? (
            <p className="mt-8 text-sm text-neutral-500">Không có sản phẩm trong danh mục này.</p>
          ) : null}
        </section>
      </div>
    </main>
  )
}
