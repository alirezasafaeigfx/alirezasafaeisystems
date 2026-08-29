import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DiscoverGrid } from '@/components/discover/discover-grid'

const items = [
  {
    slug: 'notebooklm',
    title: 'NotebookLM',
    description: 'Research assistant grounded in your sources',
    category: 'AI',
    tags: ['research', 'productivity'],
    featured: true,
    imageUrl: null,
  },
  {
    slug: 'canva',
    title: 'Canva',
    description: 'Visual design platform',
    category: 'Design',
    tags: ['design'],
    featured: false,
    imageUrl: null,
  },
]

describe('DiscoverGrid', () => {
  it('renders internal detail links with approved Instagram attribution', () => {
    render(
      <DiscoverGrid
        items={items}
        isEn={false}
        attribution={{
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'ai-tools',
          utm_content: 'reel-42',
        }}
      />,
    )

    const links = screen.getAllByRole('link', { name: /توضیح کوتاه و لینک رسمی/ })
    const href = links[0]?.getAttribute('href') || ''
    const parsed = new URL(href, 'https://alirezasafaeisystems.ir')

    expect(parsed.pathname).toBe('/discover/notebooklm')
    expect(parsed.searchParams.get('utm_source')).toBe('instagram')
    expect(parsed.searchParams.get('utm_medium')).toBe('social')
    expect(parsed.searchParams.get('utm_campaign')).toBe('ai-tools')
    expect(parsed.searchParams.get('utm_content')).toBe('reel-42')
  })

  it('renders exactly the server-provided result set without local filter truth', () => {
    render(<DiscoverGrid items={items} isEn={false} attribution={{}} />)

    expect(screen.getByText('NotebookLM')).toBeInTheDocument()
    expect(screen.getByText('Canva')).toBeInTheDocument()
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'AI' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Design' })).not.toBeInTheDocument()
  })

  it('renders an accessible empty state for an empty server result set', () => {
    render(<DiscoverGrid items={[]} isEn={false} attribution={{}} />)

    expect(screen.getByRole('status')).toHaveTextContent('موردی با این فیلتر پیدا نشد.')
  })
})
