import { Link } from 'react-router-dom'

import type { CategorySummary } from '../../../types/categorySummary'

const PRIMARY_CATEGORY_SLUGS = new Set(['red-wine', 'white-wine', 'champagne'])
const OTHER_CATEGORY_LABEL = 'LOẠI RƯỢU KHÁC'
const OTHER_CATEGORY_SLUG = 'others'

type LeftMenuProps = {
  categories: CategorySummary[]
  selectedCategory: string
  isLoadingCategories: boolean
}

export default function LeftMenu({
  categories,
  selectedCategory,
  isLoadingCategories,
}: LeftMenuProps) {
  const groupedCategories = categories.reduce<CategorySummary[]>((items, category) => {
    if (PRIMARY_CATEGORY_SLUGS.has(category.slug)) {
      items.push(category)
      return items
    }

    const existingOtherCategory = items.find((item) => item.slug === OTHER_CATEGORY_SLUG)
    if (existingOtherCategory) {
      existingOtherCategory.count += category.count
      return items
    }

    items.push({
      name: OTHER_CATEGORY_LABEL,
      slug: OTHER_CATEGORY_SLUG,
      count: category.count,
    })

    return items
  }, [])

  return (
    <aside className="border-r border-neutral-200 pr-6">
      <h1 className="text-lg font-semibold uppercase tracking-[0.3em] text-neutral-800">Danh mục sản phẩm</h1>
      <div className="mt-4 h-px w-20 bg-neutral-300" />
      {isLoadingCategories ? (
        <p className="mt-6 text-sm text-neutral-500">Đang tải danh mục...</p>
      ) : (
        <nav className="mt-8">
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            {groupedCategories.map((category) => {
              const isActive = category.name === selectedCategory

              return (
                <li key={category.slug}>
                  <Link
                    to={`/wines/${category.slug}`}
                    className={`inline-flex items-center gap-2 transition ${isActive ? 'font-semibold text-amber-600' : 'hover:text-neutral-900'}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                    <span>{category.name}</span>
                    <span className="text-neutral-400">({category.count})</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </aside>
  )
}
