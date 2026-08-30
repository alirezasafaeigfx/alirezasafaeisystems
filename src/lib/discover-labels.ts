import type { Locale } from '@/lib/locale-utils'

const labels = {
  category: {
    ai: { fa: 'هوش مصنوعی', en: 'AI' },
    design: { fa: 'طراحی', en: 'Design' },
    productivity: { fa: 'بهره‌وری', en: 'Productivity' },
    development: { fa: 'توسعه نرم‌افزار', en: 'Development' },
    education: { fa: 'آموزش', en: 'Education' },
    security: { fa: 'امنیت', en: 'Security' },
  },
  platform: {
    web: { fa: 'وب', en: 'Web' },
    android: { fa: 'اندروید', en: 'Android' },
    ios: { fa: 'آی‌اواس', en: 'iOS' },
    windows: { fa: 'ویندوز', en: 'Windows' },
    macos: { fa: 'مک', en: 'macOS' },
    linux: { fa: 'لینوکس', en: 'Linux' },
    telegram: { fa: 'تلگرام', en: 'Telegram' },
  },
} as const

function normalized(value: string): string {
  return value.trim().toLocaleLowerCase('en-US').replace(/[ _-]+/g, '')
}

export function discoverCategoryLabel(value: string, locale: Locale): string {
  const key = normalized(value) as keyof typeof labels.category
  return labels.category[key]?.[locale] ?? value
}

export function discoverPlatformLabel(value: string, locale: Locale): string {
  const key = normalized(value) as keyof typeof labels.platform
  return labels.platform[key]?.[locale] ?? value
}
