import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DISCOVER_PRICING_MODELS,
  DISCOVER_RESOURCE_TYPES,
  discoverCreateSchema,
  discoverPlatformsSchema,
  hasCompleteDiscoverTranslation,
} from '@/lib/discover'

describe('Discover V3 contracts', () => {
  it('defines additive DiscoverItem fields in Prisma schema', () => {
    const schema = readFileSync(resolve(process.cwd(), 'prisma/schema.prisma'), 'utf8')
    for (const field of [
      'titleEn', 'descriptionEn', 'contentEn', 'publishedEn', 'resourceType', 'platforms',
      'pricingModel', 'seoTitle', 'seoDescription', 'seoTitleEn',
      'seoDescriptionEn', 'lastReviewedAt',
    ]) expect(schema).toContain(field)

    const migration = readFileSync(resolve(process.cwd(), 'prisma/migrations/20260828000000_add_discover_v3_fields/migration.sql'), 'utf8')
    expect(migration.match(/ALTER TABLE "DiscoverItem" ADD COLUMN/g)?.length).toBe(8)
    expect(migration).not.toMatch(/DROP TABLE|DELETE FROM|DROP COLUMN/)
  })

  it('accepts controlled taxonomy and applies V3 defaults', () => {
    const parsed = discoverCreateSchema.parse({
      slug: 'tool', title: 'ابزار', description: 'توضیح', content: 'محتوا',
      externalUrl: 'https://example.com', category: 'ai', tags: [],
    })
    expect(parsed.resourceType).toBe('tool')
    expect(parsed.pricingModel).toBe('unknown')
    expect(parsed.platforms).toEqual([])
    expect(DISCOVER_RESOURCE_TYPES).toContain('ai-tool')
    expect(DISCOVER_PRICING_MODELS).toContain('freemium')
    expect(discoverCreateSchema.safeParse({ ...parsed, resourceType: 'unknown-type' }).success).toBe(false)
    expect(discoverCreateSchema.safeParse({ ...parsed, pricingModel: 'enterprise' }).success).toBe(false)
  })

  it('normalizes and bounds platform values', () => {
    expect(discoverPlatformsSchema.parse(' Web, ios, Web ')).toEqual(['Web', 'ios'])
    expect(discoverPlatformsSchema.safeParse(Array.from({ length: 13 }, (_, i) => `p${i}`)).success).toBe(false)
  })

  it('requires complete English translation fields', () => {
    expect(hasCompleteDiscoverTranslation({ titleEn: 'A', descriptionEn: 'B', contentEn: 'C' })).toBe(true)
    expect(hasCompleteDiscoverTranslation({ titleEn: 'A', descriptionEn: null, contentEn: 'C' })).toBe(false)
  })
})
