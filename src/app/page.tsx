import type { Metadata } from 'next'
import { HomePageV3 } from '@/components/sections/homepage-v3'
import { getRequestLanguage } from '@/lib/i18n/server'
import { brand } from '@/lib/brand'

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage()
  return {
    title: lang === 'fa'
      ? `${brand.ownerName} | ساخت و پایدارسازی سایت و محصول دیجیتال`
      : `${brand.ownerName} | Web Systems Engineer - Infrastructure Localization & Operational Resilience`,
    description:
      lang === 'fa'
        ? `${brand.ownerName} به کسب‌وکارها کمک می‌کند سایت و محصول دیجیتال خود را سریع‌تر، امن‌تر و آماده رشد کنند؛ از ارزیابی فنی و رفع ایراد تا معماری و تحویل آماده تولید.`
        : `${brand.ownerName}, Web Systems Engineer. Infrastructure localization, operational resilience, CI/CD hardening, and release governance. From architecture to production-ready delivery.`,
    keywords: lang === 'fa'
      ? ['مهندس سیستم وب', 'بومی‌سازی زیرساخت', 'پایداری عملیاتی', 'CI/CD', 'معماری نرم‌افزار', 'تاب‌آوری']
      : ['web systems engineer', 'infrastructure localization', 'operational resilience', 'CI/CD', 'software architecture', 'production readiness'],
  }
}

export default async function Home() {
  const language = await getRequestLanguage()

  return (
    <HomePageV3 language={language} />
  )
}
