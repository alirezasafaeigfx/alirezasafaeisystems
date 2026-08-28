import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePageV3 } from '@/components/sections/homepage-v3'

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}))

vi.mock('@/lib/analytics/client', () => ({
  trackEvent: trackEventMock,
}))

describe('Homepage V3', () => {
  beforeEach(() => {
    trackEventMock.mockReset()
    trackEventMock.mockResolvedValue(undefined)
  })

  it('renders the personal Persian hero with exactly two primary actions', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByLabelText('معرفی علیرضا صفایی')
    expect(within(hero).getByRole('heading', { level: 1, name: 'مهندس نرم‌افزار' })).toBeInTheDocument()

    const actions = within(hero).getByRole('group', { name: 'اقدام‌های اصلی' })
    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: 'شروع همکاری' })).toHaveAttribute('href', '/qualification')
    expect(within(actions).getByRole('link', { name: 'مشاهده پروژه‌ها' })).toHaveAttribute('href', '/case-studies')
  })

  it('renders only the three scoped services and selected-work cards', () => {
    render(<HomePageV3 language="fa" />)

    expect(within(screen.getByLabelText('خدمات اصلی')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByLabelText('پروژه‌های منتخب')).getAllByRole('article')).toHaveLength(3)
  })

  it('tracks the renamed primary hero CTA without identifying metadata', () => {
    render(<HomePageV3 language="fa" />)

    fireEvent.click(within(screen.getByLabelText('معرفی علیرضا صفایی')).getByRole('link', { name: 'شروع همکاری' }))

    expect(trackEventMock).toHaveBeenCalledWith({
      name: 'hero_primary_cta_click',
      category: 'conversion',
      locale: 'fa',
    })
  })
})
