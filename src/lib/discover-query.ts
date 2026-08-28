import type { Prisma } from '@prisma/client'
import { DISCOVER_RESOURCE_TYPES } from '@/lib/discover'

export const DISCOVER_PAGE_SIZE = 24
export type DiscoverPublicQuery = { q: string; category: string; type: string; platform: string; sort: 'featured' | 'latest'; page: number }
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''

export function parseDiscoverPublicQuery(input: Record<string, string | string[] | undefined>): DiscoverPublicQuery {
  const q = first(input.q).trim().slice(0, 100)
  const category = first(input.category).trim().slice(0, 60)
  const type = first(input.type).trim()
  const platform = first(input.platform).trim().slice(0, 40)
  const sort = first(input.sort) === 'latest' ? 'latest' : 'featured'
  const parsedPage = Number.parseInt(first(input.page), 10)
  return { q, category, type: (DISCOVER_RESOURCE_TYPES as readonly string[]).includes(type) ? type : '', platform, sort, page: Number.isFinite(parsedPage) && parsedPage > 0 ? Math.min(parsedPage, 10000) : 1 }
}

export function buildDiscoverWhere(query: DiscoverPublicQuery, locale: 'fa' | 'en'): Prisma.DiscoverItemWhereInput {
  const searchFields = locale === 'en'
    ? [{ titleEn: { contains: query.q } }, { descriptionEn: { contains: query.q } }, { title: { contains: query.q } }, { description: { contains: query.q } }, { category: { contains: query.q } }, { tags: { contains: query.q } }, { platforms: { contains: query.q } }]
    : [{ title: { contains: query.q } }, { description: { contains: query.q } }, { category: { contains: query.q } }, { tags: { contains: query.q } }, { platforms: { contains: query.q } }]
  return {
    published: true,
    ...(locale === 'en'
      ? {
          titleEn: { not: null },
          AND: [
            { titleEn: { not: '' } },
            { descriptionEn: { not: null } },
            { descriptionEn: { not: '' } },
            { contentEn: { not: null } },
            { contentEn: { not: '' } },
          ],
        }
      : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.type ? { resourceType: query.type } : {}),
    ...(query.platform ? { platforms: { contains: query.platform } } : {}),
    ...(query.q ? { OR: searchFields } : {}),
  }
}

export function buildDiscoverOrderBy(query: DiscoverPublicQuery): Prisma.DiscoverItemOrderByWithRelationInput[] {
  return query.sort === 'latest' ? [{ publishedAt: 'desc' }, { updatedAt: 'desc' }] : [{ featured: 'desc' }, { order: 'asc' }, { updatedAt: 'desc' }]
}
