import { describe, expect, it } from 'vitest'
import { BLOG_CATEGORIES, blogCreateSchema, estimateReadTime, hasCompleteBlogTranslation } from '@/lib/blog'

describe('blog content contract', () => {
  it('applies engineering category and rejects unsafe slug', () => {
    const parsed = blogCreateSchema.safeParse({ title: 'A post', slug: 'a-post', excerpt: 'Summary', content: 'Body', tags: [] })
    expect(parsed.success).toBe(true)
    if (parsed.success) expect(parsed.data.category).toBe('engineering')
    expect(blogCreateSchema.safeParse({ title: 'A', slug: 'Bad Slug', excerpt: 'x', content: 'y', tags: [] }).success).toBe(false)
  })

  it('requires complete English translation', () => {
    expect(hasCompleteBlogTranslation({ titleEn: 'Title', excerptEn: 'Summary', contentEn: 'Body' })).toBe(true)
    expect(hasCompleteBlogTranslation({ titleEn: 'Title', excerptEn: '', contentEn: 'Body' })).toBe(false)
  })

  it('estimates deterministic positive read time', () => {
    expect(estimateReadTime('one two three four five', 'en')).toBeGreaterThan(0)
    expect(BLOG_CATEGORIES).toContain('engineering')
  })
})
