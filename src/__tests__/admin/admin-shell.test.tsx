import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { routerMock, pathnameMock } = vi.hoisted(() => ({
  routerMock: { replace: vi.fn(), refresh: vi.fn() },
  pathnameMock: vi.fn(() => '/admin/leads'),
}))

vi.mock('next/navigation', () => ({
  usePathname: pathnameMock,
  useRouter: () => routerMock,
}))

import { AdminShell } from '@/components/admin/admin-shell'

describe('AdminShell navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pathnameMock.mockReturnValue('/admin/leads')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
  })

  it('renders every control-center route and marks the current route', () => {
    render(<AdminShell><p>Leads content</p></AdminShell>)

    const navigation = screen.getByRole('navigation', { name: /admin/i })
    const routes = [
      ['/admin', 'Overview'],
      ['/admin/leads', 'Leads'],
      ['/admin/messages', 'Messages'],
      ['/admin/projects', 'Projects'],
      ['/admin/discover', 'Discover'],
      ['/admin/blog', 'Blog'],
      ['/admin/analytics', 'Analytics'],
    ] as const

    for (const [href, label] of routes) {
      expect(within(navigation).getByRole('link', { name: label })).toHaveAttribute('href', href)
    }

    expect(within(navigation).getByRole('link', { name: 'Leads' })).toHaveAttribute('aria-current', 'page')
    expect(within(navigation).getByRole('link', { name: 'Overview' })).not.toHaveAttribute('aria-current')
  })

  it('keeps nested module routes active', () => {
    pathnameMock.mockReturnValue('/admin/discover/item-1')

    render(<AdminShell><p>Discover content</p></AdminShell>)

    expect(screen.getByRole('link', { name: 'Discover' })).toHaveAttribute('aria-current', 'page')
  })

  it('provides view-site and logout controls', async () => {
    render(<AdminShell><p>Content</p></AdminShell>)

    expect(screen.getAllByRole('link', { name: /view site/i }).every((link) => link.getAttribute('href') === '/')).toBe(true)
    fireEvent.click(screen.getAllByRole('button', { name: /log out/i })[0])

    await vi.waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/admin/auth/logout', { method: 'POST' }))
    expect(routerMock.replace).toHaveBeenCalledWith('/admin/login')
    expect(routerMock.refresh).toHaveBeenCalled()
  })

  it('opens mobile navigation with the same route links', () => {
    render(<AdminShell><p>Content</p></AdminShell>)

    fireEvent.click(screen.getByRole('button', { name: /open admin navigation/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByRole('link', { name: 'Analytics' })).toHaveAttribute(
      'href',
      '/admin/analytics',
    )
  })
})
