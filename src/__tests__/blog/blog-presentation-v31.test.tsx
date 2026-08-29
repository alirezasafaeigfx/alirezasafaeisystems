import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { BlogArticleShell } from '@/components/blog/blog-article-shell'
import { BlogMarkdown } from '@/lib/blog-markdown'

describe('Blog V3.1 public presentation', () => {
  it('gives a real featured post distinct semantic treatment without inventing content', () => {
    render(
      <BlogPostCard
        title="Release safety without heroics"
        excerpt="A practical note about governed production changes."
        href="/en/blog/release-safety"
        category="reliability"
        publishedLabel="Aug 29, 2026"
        readTimeLabel="6 min read"
        featured
        locale="en"
      />,
    )

    const article = screen.getByRole('article', { name: 'Featured insight: Release safety without heroics' })
    expect(within(article).getByText('Featured')).toBeInTheDocument()
    expect(within(article).getByRole('heading', { level: 2, name: 'Release safety without heroics' })).toBeInTheDocument()
    expect(within(article).getAllByRole('link')).toHaveLength(1)
  })

  it('keeps article metadata subordinate and exposes exactly one H1', () => {
    render(
      <BlogArticleShell
        title="Production readiness"
        excerpt="What must be true before a release is allowed to move."
        category="engineering"
        publishedLabel="Aug 29, 2026"
        readTimeLabel="8 min read"
        author="Alireza Safaei"
        backHref="/en/blog"
        backLabel="Back to insights"
        locale="en"
      >
        <p>Article body</p>
      </BlogArticleShell>,
    )

    const article = screen.getByRole('article')
    expect(within(article).getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(within(article).getByRole('heading', { level: 1, name: 'Production readiness' })).toBeInTheDocument()
    expect(within(article).getByText('engineering')).toBeInTheDocument()
    expect(within(article).getByText('Aug 29, 2026')).toBeInTheDocument()
    expect(within(article).getByText('8 min read')).toBeInTheDocument()
    expect(within(article).getByText('Alireza Safaei')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to insights' })).toHaveAttribute('href', '/en/blog')
  })

  it('uses a stable article-prose reading wrapper for markdown content', () => {
    const { container } = render(
      <BlogMarkdown
        locale="en"
        content={'## Operational notes\n\nReadable paragraph.\n\n```ts\nconst safe = true\n```'}
      />,
    )

    const prose = container.querySelector('.article-prose')
    expect(prose).toBeInTheDocument()
    expect(within(prose as HTMLElement).getByRole('heading', { level: 3, name: 'Operational notes' })).toBeInTheDocument()
    expect(within(prose as HTMLElement).getByText('const safe = true')).toBeInTheDocument()
  })
})
