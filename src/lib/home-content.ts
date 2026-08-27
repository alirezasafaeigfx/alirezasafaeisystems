import type { Language } from '@/lib/i18n/translations'

type AudienceKey = 'owner' | 'employer' | 'technical'

type HomeContent = {
  hero: {
    title: string
    description: string
    primaryCta: string
  }
  audienceTitle: string
  audiences: Array<{
    key: AudienceKey
    title: string
    description: string
  }>
}

const content: Record<Language, HomeContent> = {
  fa: {
    hero: {
      title: 'سایت و محصول دیجیتال شما؛ سریع‌تر، امن‌تر و آماده رشد',
      description:
        'اگر سایت کند است، پروژه نیمه‌کاره مانده یا برای رشد آماده نیست، از یک ارزیابی روشن شروع کنید. مهم‌ترین ایرادها را پیدا می‌کنیم و مسیر اصلاح را با خروجی قابل‌فهم و قابل‌اندازه‌گیری تحویل می‌دهیم.',
      primaryCta: 'درخواست ارزیابی رایگان',
    },
    audienceTitle: 'برای هر تصمیم، پاسخ روشن و شواهد واقعی',
    audiences: [
      {
        key: 'owner',
        title: 'برای صاحب سایت و کسب‌وکار',
        description: 'بدون اصطلاحات پیچیده بفهمید چه چیزی مانع سرعت، اعتماد و جذب مشتری شده است.',
      },
      {
        key: 'employer',
        title: 'برای کارفرما و سرمایه‌گذار',
        description: 'ریسک، هزینه، اولویت و مسیر رشد محصول را در یک تصویر قابل تصمیم‌گیری ببینید.',
      },
      {
        key: 'technical',
        title: 'برای تیم فنی',
        description: 'معماری، امنیت، عملکرد و کیفیت تحویل را با یافته‌های مستند و اقدام‌های مشخص بررسی کنید.',
      },
    ],
  },
  en: {
    hero: {
      title: 'Make your website and digital product faster, safer, and ready to grow',
      description:
        'Start with a clear assessment when your website is slow, your project is stuck, or your product is not ready to scale. Get prioritized findings and a measurable path forward.',
      primaryCta: 'Request a free assessment',
    },
    audienceTitle: 'Clear decisions, backed by real evidence',
    audiences: [
      {
        key: 'owner',
        title: 'For business and website owners',
        description: 'Understand what blocks speed, trust, and customer acquisition without technical jargon.',
      },
      {
        key: 'employer',
        title: 'For employers and investors',
        description: 'See product risk, cost, priorities, and growth path in a decision-ready format.',
      },
      {
        key: 'technical',
        title: 'For technical teams',
        description: 'Review architecture, security, performance, and delivery quality with actionable evidence.',
      },
    ],
  },
}

export function getHomeContent(language: Language): HomeContent {
  return content[language]
}
