import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Header } from '@/components/layout/header'
import { SectionHeading } from '@/components/public/section-heading'
import { VisualFrame } from '@/components/public/visual-frame'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/i18n-context', () => ({
  useI18n: () => ({
    language: 'en',
    setLanguage: vi.fn(),
    t: (key: string) => ({
      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.caseStudies': 'Case Studies',
      'nav.discover': 'Discover',
      'nav.contact': 'Contact',
      'ui.changeLanguage': 'Change language',
      'ui.openMenu': 'Open menu',
      'ui.closeMenu': 'Close menu',
      'ui.language': 'Language',
      'nav.english': 'English',
      'nav.persian': 'Persian',
    })[key] ?? key,
  }),
}))

describe('V3.1 public visual primitives', () => {
  it('renders one labelled editorial section heading', () => {
    render(
      <SectionHeading
        eyebrow="Selected work"
        title="Systems I have shipped"
        description="Real product proof."
      />,
    )

    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Systems I have shipped' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Real product proof.')).toBeInTheDocument()
  })

  it('reserves media dimensions and exposes semantic content', () => {
    render(
      <VisualFrame ariaLabel="PersianToolbox product preview">
        <span>preview</span>
      </VisualFrame>,
    )

    expect(screen.getByLabelText('PersianToolbox product preview')).toHaveClass(
      'public-visual-frame',
    )
    expect(screen.getByText('preview')).toBeInTheDocument()
  })
})

describe('V3.1 global public shell', () => {
  it('keeps the primary desktop navigation focused and separates collaboration', () => {
    render(<Header />)

    const primaryNav = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(within(primaryNav).getAllByRole('link')).toHaveLength(4)
    expect(within(primaryNav).getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(within(primaryNav).getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(within(primaryNav).getByRole('link', { name: 'Case Studies' })).toBeInTheDocument()
    expect(within(primaryNav).getByRole('link', { name: 'Discover' })).toBeInTheDocument()
    expect(within(primaryNav).queryByRole('link', { name: 'Blog' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Request a website review' })).toHaveAttribute(
      'href',
      '/en/qualification?source=portfolio&placement=header&offer=request_assessment',
    )
  })

  it('retires the generic fixed mobile bottom navigation from the root layout', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')
    expect(layout).not.toContain('BottomNav')
    expect(layout).not.toContain('pb-20 md:pb-0')
  })
})
