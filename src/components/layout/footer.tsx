'use client'

import Link from 'next/link'
import { ArrowUpLeft, Github, Instagram, Linkedin, Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
import { withLocale } from '@/lib/locale-utils'

const footerLinks = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'discover', href: '/discover' },
  { key: 'blog', href: '/blog' },
] as const

export function Footer() {
  const { t, language } = useI18n()
  const currentYear = new Date().getFullYear()
  const isFa = language === 'fa'

  const socialLinks = [
    { name: 'GitHub', href: brand.githubUrl, icon: Github },
    { name: 'LinkedIn', href: brand.linkedinUrl, icon: Linkedin },
    { name: 'Telegram', href: brand.telegramUrl, icon: Send },
    { name: 'Instagram', href: brand.instagramUrl, icon: Instagram },
  ].filter((item) => Boolean(item.href))

  return (
    <footer className="public-dark-surface mt-auto border-t border-white/10" data-public-footer>
      <div className="public-shell py-12 md:py-16">
        <section className="grid gap-8 border-b border-white/12 pb-10 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] md:items-end md:pb-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold text-blue-300">
              {isFa ? 'پروژه بعدی' : 'Next project'}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
              {isFa
                ? 'اگر مسئله مهمی برای ساختن یا نجات‌دادن دارید، از اینجا شروع کنیم.'
                : 'If you have something important to build or rescue, start here.'}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
              {isFa
                ? 'مسئله، محدودیت‌ها و وضعیت فعلی را بگویید؛ مسیر فنی بعدی را شفاف و عملی مشخص می‌کنیم.'
                : 'Share the problem, constraints, and current state. We will turn it into a clear, practical technical path.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Button asChild size="lg" className="min-h-12 rounded-xl px-6 font-extrabold">
              <Link href={withLocale('/qualification', language)}>
                {isFa ? 'شروع همکاری' : 'Start collaboration'}
                <ArrowUpLeft aria-hidden="true" className={isFa ? 'size-4' : 'size-4 rotate-90'} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 rounded-xl border-white/20 bg-white/5 px-6 font-bold text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`mailto:${brand.contactEmail}`}>
                <Mail className="size-4" />
                {isFa ? 'ایمیل مستقیم' : 'Email directly'}
              </a>
            </Button>
          </div>
        </section>

        <div className="grid gap-10 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:py-12">
          <div className="max-w-md">
            <Link
              href={withLocale('/', language)}
              className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white text-sm font-black text-slate-950">
                AS
              </span>
              <span>
                <span className="block font-extrabold text-white">{brand.ownerName}</span>
                <span className="block text-sm text-white/55">
                  {isFa ? 'مهندس نرم‌افزار' : 'Software Engineer'}
                </span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/58">
              {isFa
                ? 'طراحی و ساخت سیستم‌های وب، معماری نرم‌افزار، پایدارسازی و تحویل مطمئن برای استفاده واقعی.'
                : 'Web systems, software architecture, stabilization, and reliable delivery for real production use.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">{isFa ? 'دسترسی سریع' : 'Navigate'}</h3>
            <nav aria-label={isFa ? 'لینک‌های فوتر' : 'Footer navigation'} className="mt-4 grid gap-2">
              {footerLinks.map((item) => (
                <Link
                  key={item.key}
                  href={withLocale(item.href, language)}
                  className="w-fit rounded-md py-1 text-sm font-medium text-white/58 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">{isFa ? 'ارتباط' : 'Connect'}</h3>
            <a
              href={`mailto:${brand.contactEmail}`}
              className="mt-4 block break-all text-sm font-medium text-white/68 underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              {brand.contactEmail}
            </a>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="grid size-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-white/68 transition-colors hover:border-white/22 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <span>{`© ${currentYear} ${brand.ownerName}. ${t('footer.allRights')}`}</span>
          <span>{isFa ? 'طراحی و توسعه با تمرکز بر وضوح، کارایی و قابلیت اتکا.' : 'Designed and engineered for clarity, performance, and reliability.'}</span>
        </div>
      </div>
    </footer>
  )
}
