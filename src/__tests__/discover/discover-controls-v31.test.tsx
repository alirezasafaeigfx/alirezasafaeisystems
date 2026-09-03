import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DiscoverControls } from '@/components/discover/discover-controls'

const { routerReplace } = vi.hoisted(() => ({ routerReplace: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: routerReplace }),
  usePathname: () => '/discover',
  useSearchParams: () => new URLSearchParams('sort=featured&page=3'),
}))

const query = {
  q: '',
  category: '',
  type: '',
  platform: '',
  sort: 'featured' as const,
  page: 3,
}

describe('DiscoverControls V3.1', () => {
  beforeEach(() => routerReplace.mockReset())

  it('writes submitted search state to the URL and resets pagination', () => {
    render(
      <DiscoverControls
        query={query}
        categories={['AI', 'Design']}
        platforms={['Android', 'Web']}
        resourceTypes={['ai-tool', 'app']}
        isEn={false}
      />,
    )

    fireEvent.change(screen.getByRole('searchbox', { name: 'جستجوی منابع' }), {
      target: { value: 'gemini' },
    })
    fireEvent.submit(screen.getByRole('search', { name: 'جستجوی منابع' }))

    expect(routerReplace).toHaveBeenCalledWith(
      '/discover?sort=featured&page=1&q=gemini',
      { scroll: false },
    )
  })

  it('updates category in the URL without creating a second client-side result truth', () => {
    render(
      <DiscoverControls
        query={query}
        categories={['AI', 'Design']}
        platforms={['Android', 'Web']}
        resourceTypes={['ai-tool', 'app']}
        isEn={false}
      />,
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'دسته‌بندی' }), {
      target: { value: 'AI' },
    })

    expect(routerReplace).toHaveBeenCalledWith(
      '/discover?sort=featured&page=1&category=AI',
      { scroll: false },
    )
  })

  it('keeps search visually and semantically primary while filters form a compact secondary group', () => {
    render(
      <DiscoverControls
        query={query}
        categories={['AI', 'Design']}
        platforms={['Android', 'Web']}
        resourceTypes={['ai-tool', 'app']}
        isEn={false}
      />,
    )

    const search = screen.getByRole('search', { name: 'جستجوی منابع' })
    const filters = screen.getByRole('group', { name: 'فیلترهای منابع' })

    expect(within(search).getByRole('searchbox', { name: 'جستجوی منابع' })).toBeInTheDocument()
    expect(within(filters).getAllByRole('combobox')).toHaveLength(4)
    expect(within(search).queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'هوش مصنوعی' })).toHaveValue('AI')
    expect(screen.getByRole('option', { name: 'طراحی' })).toHaveValue('Design')
    expect(screen.getByRole('option', { name: 'اندروید' })).toHaveValue('Android')
    expect(screen.getByRole('option', { name: 'وب' })).toHaveValue('Web')
  })
})
