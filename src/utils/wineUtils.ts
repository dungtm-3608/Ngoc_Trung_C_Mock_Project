import type { Wine } from '../types/wine'

export const DEFAULT_CATEGORY_SLUG = 'red-wine'
export const OTHER_CATEGORY_SLUG = 'others'
export const OTHER_CATEGORY_LABEL = 'LOẠI RƯỢU KHÁC'
export const PRIMARY_CATEGORY_SLUG_TO_NAME: Record<string, string> = {
  'red-wine': 'Red Wine',
  'white-wine': 'White Wine',
  champagne: 'Champagne',
}
export const PRIMARY_CATEGORY_NAMES = new Set(Object.values(PRIMARY_CATEGORY_SLUG_TO_NAME))

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

  const matchedSlug = Object.entries(PRIMARY_CATEGORY_SLUG_TO_NAME).find(([, label]) => label === category)?.[0]
  return matchedSlug ?? toCategorySlug(category)
}

export function getWineDetailPath(wine: Pick<Wine, 'id' | 'category'>) {
  return `/wines/${getWineCategorySlug(wine.category)}/${wine.id}`
}