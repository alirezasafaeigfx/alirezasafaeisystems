import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePageV3 } from '@/components/sections/homepage-v3'

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}))

vi.mock('@/lib/analytics/client', () => ({
  trackEvent: trackEventMock,
}))

describe('Homepage V3.1', () => {
  beforeEach(() => {
    trackEventMock.mockReset()
    trackEventMock.mockResolvedValue(undefined)
  })

  it('renders the personal Persian hero with exactly two actions and a real visual frame contract', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByRole('region', { name: 'معرفی علیرضا صفایی' })
    expect(within(hero).getByRole('heading', { level: 1, name: 'مهندس نرم‌افزار' })).toBeInTheDocument()

    const actions = within(hero).getByRole('group', { name: 'اقدام‌های اصلی' })
    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: 'شروع همکاری' })).toHaveAttribute('href', '/qualification')
    expect(within(actions).getByRole('link', { name: 'مشاهده پروژه‌ها' })).toHaveAttribute('href', '/case-studies')

    const portraitFrame = within(hero).getByTestId('owner-portrait-frame')
    expect(portraitFrame).toBeInTheDocument()
    expect(portraitFrame).not.toHaveAttribute('aria-hidden', 'true')
    expect(within(portraitFrame).getByText('AS')).toBeInTheDocument()
  })

  it('renders only the three scoped services and selected-work cards', () => {
    render(<HomePageV3 language="fa" />)

    expect(within(screen.getByLabelText('خدمات اصلی')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByLabelText('پروژه‌های منتخب')).getAllByRole('article')).toHaveLength(3)
  })

  it('tracks both hero actions without identifying metadata', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByRole('region', { name: 'معرفی علیرضا صفایی' })
    fireEvent.click(within(hero).getByRole('link', { name: 'شروع همکاری' }))
    fireEvent.click(within(hero).getByRole('link', { name: 'مشاهده پروژه‌ها' }))

    expect(trackEventMock).toHaveBeenCalledWith({
      name: 'hero_primary_cta_click',
      category: 'conversion',
      locale: 'fa',
    })
    expect(trackEventMock).toHaveBeenCalledWith({
      name: 'hero_projects_cta_click',
      category: 'engagement',
      locale: 'fa',
    })
  })
})
