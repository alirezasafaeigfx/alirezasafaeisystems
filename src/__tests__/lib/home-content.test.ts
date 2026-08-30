import { describe, expect, it } from 'vitest'
import { getHomeContent } from '@/lib/home-content'

describe('home content', () => {
  it('defines the approved Persian personal-brand hero and its two conversion actions', () => {
    const content = getHomeContent('fa')

    expect(content.hero).toMatchObject({
      name: 'مهندسی تحریریه + رابط عملیاتی',
      title: 'سیستم‌های عملیاتی را قابل دیدن می‌کنم',
      primaryCta: 'درخواست ارزیابی Audit',
      secondaryCta: 'مشاهده پروژه‌ها',
    })
  })

  it('uses the supplied English hero copy without making an English content shell', () => {
    const content = getHomeContent('en')

    expect(content.hero).toMatchObject({
      name: 'Engineering Editorial + Operational Interface',
      title: 'Operational systems made visible',
      primaryCta: 'Request an ASDEV Audit',
      secondaryCta: 'View projects',
    })
  })

  it('limits the homepage to three linked services and three evidence-backed selected-work cards', () => {
    const content = getHomeContent('fa')

    expect(content).toMatchObject({
      services: expect.arrayContaining([
        expect.objectContaining({ title: 'توسعه محصول و سیستم وب', href: '/services' }),
        expect.objectContaining({ title: 'پایدارسازی و بهینه‌سازی', href: '/services/infrastructure-localization' }),
        expect.objectContaining({ title: 'نجات پروژه‌های نیمه‌کاره', href: '/qualification' }),
      ]),
      projects: expect.arrayContaining([
        expect.objectContaining({ title: 'پلتفرم PersianToolbox' }),
        expect.objectContaining({ title: 'نجات بومی‌سازی زیرساخت' }),
        expect.objectContaining({ title: 'پلتفرم Audit Systems' }),
      ]),
    })
    expect((content as { services?: unknown[] }).services).toHaveLength(3)
    expect((content as { projects?: unknown[] }).projects).toHaveLength(3)
  })
})
