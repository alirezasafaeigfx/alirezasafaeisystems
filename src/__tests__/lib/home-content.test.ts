import { describe, expect, it } from 'vitest'
import { getHomeContent } from '@/lib/home-content'

describe('home content', () => {
  it('explains the service in plain Persian and keeps one primary audit action', () => {
    const content = getHomeContent('fa')

    expect(content.hero.title).toContain('سایت و محصول دیجیتال')
    expect(content.hero.description).toContain('ارزیابی')
    expect(content.hero.primaryCta).toBe('درخواست ارزیابی رایگان')
    expect(content.audiences).toHaveLength(3)
  })

  it('provides an equivalent English acquisition message', () => {
    const content = getHomeContent('en')

    expect(content.hero.title).toContain('website and digital product')
    expect(content.hero.primaryCta).toBe('Request a free assessment')
    expect(content.audiences.map((audience) => audience.key)).toEqual([
      'owner',
      'employer',
      'technical',
    ])
  })
})
