import { describe, expect, it } from 'vitest'
import { buildDiscoverOrderBy, buildDiscoverWhere, parseDiscoverPublicQuery } from '@/lib/discover-query'

describe('discover public query contract', () => {
  it('normalizes invalid and array-valued params', () => {
    expect(parseDiscoverPublicQuery({ page: '0', sort: 'bad', q: [' tools ', 'ignored'] })).toEqual({ q: 'tools', category: '', type: '', platform: '', sort: 'featured', page: 1 })
  })
  it('builds locale-aware published filters', () => {
    const where = buildDiscoverWhere({ q: 'ai', category: '', type: '', platform: '', sort: 'latest', page: 1 }, 'en')
    expect(where).toMatchObject({ published: true, titleEn: { not: null } })
    expect(where.OR).toBeDefined()
  })
  it('orders featured before latest', () => {
    expect(buildDiscoverOrderBy({ q: '', category: '', type: '', platform: '', sort: 'featured', page: 1 })[0]).toEqual({ featured: 'desc' })
  })
})
