import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BlogMarkdown } from '@/lib/blog-markdown'

describe('BlogMarkdown', () => {
  it('renders markdown headings and never injects raw HTML', () => {
    const { container } = render(<BlogMarkdown locale="en" content={'# Safe title\n\n<script>alert(1)</script>'} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Safe title' })).toBeTruthy()
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toContain('<script>alert(1)</script>')
  })
})
