import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePageV3 } from '@/components/sections/homepage-v3'

const { trackEventMock } = vi.hoisted(() => ({
  trackEventMock: vi.fn(),
}))

vi.mock('@/lib/analytics/client', () => ({
  trackEvent: trackEventMock,
}))

describe('Homepage V3.2 positioning and proof', () => {
  beforeEach(() => {
    trackEventMock.mockReset()
    trackEventMock.mockResolvedValue(undefined)
  })

  it('keeps the first mobile viewport focused on the problem, action, and interactive scene', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByRole('region', { name: 'معرفی علیرضا صفایی' })
    expect(within(hero).getByRole('heading', { level: 1, name: 'سیستم‌های عملیاتی را قابل دیدن می‌کنم' })).toBeInTheDocument()

    const actions = within(hero).getByRole('group', { name: 'اقدام‌های اصلی' })
    expect(within(actions).getAllByRole('link')).toHaveLength(2)
    expect(within(actions).getByRole('link', { name: 'درخواست بررسی سایت' })).toHaveAttribute(
      'href',
      '/qualification?source=portfolio&placement=hero&offer=request_assessment',
    )
    expect(within(actions).getByRole('link', { name: 'مشاهده پروژه‌ها' })).toHaveAttribute('href', '/case-studies')

    expect(within(hero).getByTestId('operational-scene')).toBeInTheDocument()
    expect(within(hero).queryByTestId('owner-portrait-frame')).not.toBeInTheDocument()

    const founder = screen.getByLabelText('درباره علیرضا صفایی')
    const portraitFrame = within(founder).getByTestId('owner-portrait-frame')
    expect(portraitFrame).toBeInTheDocument()
    expect(portraitFrame).not.toHaveAttribute('aria-hidden', 'true')
    expect(portraitFrame).not.toHaveAttribute('data-asset-status', 'pending-owner-portrait')
    expect(within(portraitFrame).getByRole('img', { name: 'پرتره حرفه‌ای علیرضا صفایی' })).toBeInTheDocument()
    expect(within(portraitFrame).queryByText('AS')).not.toBeInTheDocument()
  })

  it('uses the authored roadmap reading order and makes one flagship project dominant', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByLabelText('معرفی علیرضا صفایی')
    const proof = screen.getByLabelText('شواهد واقعی')
    const projects = screen.getByLabelText('پروژه‌های منتخب')
    const services = screen.getByLabelText('خدمات اصلی')
    const founder = screen.getByLabelText('درباره علیرضا صفایی')

    expect(hero.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(proof.compareDocumentPosition(projects) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(projects.compareDocumentPosition(services) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(services.compareDocumentPosition(founder) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(projects).getByTestId('flagship-project')).toContainElement(within(projects).getByRole('heading', { name: /PersianToolbox/ }))
  })

  it('renders three differentiated services and three visual project showcases', () => {
    render(<HomePageV3 language="fa" />)

    const services = screen.getByLabelText('خدمات اصلی')
    expect(within(services).getAllByRole('article')).toHaveLength(3)
    expect(within(services).getByText('01')).toBeInTheDocument()
    expect(within(services).getByText('02')).toBeInTheDocument()
    expect(within(services).getByText('03')).toBeInTheDocument()

    const projects = screen.getByLabelText('پروژه‌های منتخب')
    expect(within(projects).getAllByRole('article')).toHaveLength(3)
    expect(within(projects).getAllByRole('img')).toHaveLength(3)
    expect(
      within(projects).getByRole('img', { name: 'اسکرین‌شات صفحه اصلی PersianToolbox' }),
    ).toBeInTheDocument()
    expect(
      within(projects).getByRole('img', { name: 'اسکرین‌شات مطالعه موردی نجات بومی‌سازی زیرساخت' }),
    ).toBeInTheDocument()
    expect(
      within(projects).getByRole('img', { name: 'اسکرین‌شات صفحه اصلی Audit Systems' }),
    ).toBeInTheDocument()
  })

  it('does not publish evidence records while independent review remains pending', () => {
    render(<HomePageV3 language="fa" />)

    const proof = screen.getByLabelText('شواهد واقعی')
    expect(within(proof).getByText('این شواهد هنوز تأیید مستقل نشده‌اند.')).toBeInTheDocument()
    expect(within(proof).queryByText('PersianToolbox')).not.toBeInTheDocument()

    const about = screen.getByLabelText('درباره علیرضا صفایی')
    expect(within(about).getByRole('heading', { level: 2, name: 'درباره من' })).toBeInTheDocument()
  })

  it('tracks both hero actions without identifying metadata', () => {
    render(<HomePageV3 language="fa" />)

    const hero = screen.getByRole('region', { name: 'معرفی علیرضا صفایی' })
    fireEvent.click(within(hero).getByRole('link', { name: 'درخواست بررسی سایت' }))
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
