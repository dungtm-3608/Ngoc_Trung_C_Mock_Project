import type { Wine } from '../types/wine'

export const DEFAULT_CATEGORY_SLUG = 'red-wine'
export const OTHER_CATEGORY_SLUG = 'others'
export const OTHER_CATEGORY_LABEL = 'LOẠI RƯỢU KHÁC'
export const PRIMARY_CATEGORY_SLUGS = ['red-wine', 'white-wine', 'champagne'] as const

const PRIMARY_CATEGORY_ID_SUFFIX_TO_SLUG: Record<string, (typeof PRIMARY_CATEGORY_SLUGS)[number]> = {
  'Red-Wine': 'red-wine',
  'White-Wine': 'white-wine',
  Champagne: 'champagne',
}

const wineImages = import.meta.glob('/src/assets/wine/*.{png,jpg,jpeg}', { eager: true }) as Record<string, { default?: string } | string>

function resolveAssetImage(asset: { default?: string } | string) {
  return typeof asset === 'string' ? asset : (asset.default ?? '')
}

export function toCategorySlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function mapImageId(idStr: string) {
  const id = parseInt(idStr, 10) || 0
  if (id <= 0) return '1'
  const wrapped = ((id - 1) % 14) + 1
  return String(wrapped)
}

const wineImageUrlById = Object.fromEntries(
  Object.entries(wineImages).flatMap(([path, asset]) => {
    const match = path.match(/\/wine\/(\d+)\.(png|jpg|jpeg)$/)
    if (!match) return []
    return [[match[1], resolveAssetImage(asset)]]
  }),
) as Record<string, string>

export function resolveWineImage(wineId: string) {
  const imageId = mapImageId(wineId)
  return wineImageUrlById[imageId] ?? ''
}

export function getWineCategorySlug(category?: string) {
  if (!category) return DEFAULT_CATEGORY_SLUG

  return toCategorySlug(category)
}

export function getCategorySlug(category: { id?: string; name?: string } | null | undefined) {
  if (!category) return DEFAULT_CATEGORY_SLUG

  const suffix = category.id?.split('-').slice(1).join('-')
  if (suffix && suffix in PRIMARY_CATEGORY_ID_SUFFIX_TO_SLUG) {
    return PRIMARY_CATEGORY_ID_SUFFIX_TO_SLUG[suffix]
  }

  return toCategorySlug(category.name ?? '') || DEFAULT_CATEGORY_SLUG
}

export function isPrimaryCategory(category: { id?: string; name?: string } | null | undefined) {
  const slug = getCategorySlug(category)
  return (PRIMARY_CATEGORY_SLUGS as readonly string[]).includes(slug)
}

export function getWineDetailPath(wine: Pick<Wine, 'id' | 'category' | 'categoryId' | 'categoryName'>) {
  return `/wines/${getCategorySlug({ id: wine.categoryId, name: wine.categoryName ?? wine.category })}/${wine.id}`
}