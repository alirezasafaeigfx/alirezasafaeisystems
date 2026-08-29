import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiscoverPagination } from '@/components/discover/discover-pagination'

const query = {
  q: 'gemini',
  category: 'AI',
  type: '',
  platform: 'Web',
  sort: 'latest' as const,
  page: 2,
}

describe('DiscoverPagination V3.1', () => {
  it('preserves canonical server query and attribution across pages', () => {
    render(
      <DiscoverPagination
        query={query}
        total={73}
        pageSize={24}
        isEn={false}
        attribution={{ utm_source: 'instagram', utm_campaign: 'ai-tools' }}
      />,
    )

    expect(screen.getByRole('navigation', { name: 'صفحه‌بندی منابع' })).toBeInTheDocument()

    const next = screen.getByRole('link', { name: 'صفحه بعد' })
    const url = new URL(next.getAttribute('href') || '', 'https://alirezasafaeisystems.ir')

    expect(url.pathname).toBe('/discover')
    expect(url.searchParams.get('q')).toBe('gemini')
    expect(url.searchParams.get('category')).toBe('AI')
    expect(url.searchParams.get('platform')).toBe('Web')
    expect(url.searchParams.get('sort')).toBe('latest')
    expect(url.searchParams.get('page')).toBe('3')
    expect(url.searchParams.get('utm_source')).toBe('instagram')
    expect(url.searchParams.get('utm_campaign')).toBe('ai-tools')
  })

  it('uses locale-aware paths and suppresses impossible previous/next links', () => {
    render(
      <DiscoverPagination
        query={{ ...query, page: 1 }}
        total={25}
        pageSize={24}
        isEn
        attribution={{}}
      />,
    )

    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute(
      'href',
      expect.stringContaining('/en/discover?'),
    )
  })
})
