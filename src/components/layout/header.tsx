'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowUpLeft, Languages, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n-context'
import { brand } from '@/lib/brand'
import { getLocalizedPathname, withLocale } from '@/lib/locale-utils'
import type { Locale } from '@/lib/locale-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const navItems = [
  { key: 'home', name: 'nav.home', href: '/' },
  { key: 'services', name: 'nav.services', href: '/services' },
  { key: 'caseStudies', name: 'nav.caseStudies', href: '/case-studies' },
  { key: 'discover', name: 'nav.discover', href: '/discover' },
  { key: 'blog', name: 'nav.blog', href: '/blog' },
] as const

export function Header() {
  const { t, language, setLanguage } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lang: Locale) => {
    setLanguage(lang)
    router.push(getLocalizedPathname(pathname, lang))
    router.refresh()
  }

  const collaborationLabel = language === 'fa' ? 'شروع همکاری' : 'Start collaboration'
  const primaryNavLabel = language === 'fa' ? 'ناوبری اصلی' : 'Primary navigation'
  const mobileNavLabel = language === 'fa' ? 'ناوبری موبایل' : 'Mobile navigation'

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="public-shell pt-3 md:pt-4">
        <div
          className={`pointer-events-auto flex min-h-16 items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 transition-[background-color,border-color,box-shadow] duration-200 md:px-4 ${
            isScrolled
              ? 'border-border/80 bg-background/92 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.55)] backdrop-blur-xl'
              : 'border-border/65 bg-background/82 shadow-[0_12px_40px_-34px_rgba(15,23,42,0.4)] backdrop-blur-lg'
          }`}
        >
          <Link
            href={withLocale('/', language)}
            className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setMobileMenuOpen(false)}
            aria-label={language === 'fa' ? 'خانه علیرضا صفایی' : 'Alireza Safaei home'}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground shadow-sm">
              AS
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-extrabold text-foreground">{brand.ownerName}</span>
              <span className="block text-[11px] font-medium text-muted-foreground">
                {language === 'fa' ? 'مهندس نرم‌افزار' : 'Software Engineer'}
              </span>
            </span>
          </Link>

          <nav
            aria-label={primaryNavLabel}
            className="hidden items-center gap-0.5 rounded-xl border border-border/55 bg-muted/30 p-1 lg:flex"
          >
            {navItems.map((item) => {
              const target = withLocale(item.href, language)
              const active = pathname === target || (target !== '/' && pathname.startsWith(`${target}/`))
              return (
                <Link
                  key={item.key}
                  href={target}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                  }`}
                >
                  {t(item.name)}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl"
                  aria-label={t('ui.changeLanguage')}
                >
                  <Languages className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  {t('nav.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('fa')}>
                  {t('nav.persian')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="hidden min-h-10 rounded-xl px-4 font-bold sm:inline-flex">
              <Link href={withLocale('/qualification', language)} aria-label={collaborationLabel}>
                {collaborationLabel}
                <ArrowUpLeft
                  aria-hidden="true"
                  className={language === 'fa' ? 'size-4' : 'size-4 rotate-90'}
                />
              </Link>
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl"
                  aria-label={mobileMenuOpen ? t('ui.closeMenu') : t('ui.openMenu')}
                >
                  {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'fa' ? 'left' : 'right'} className="w-[min(88vw,22rem)] p-0">
                <div className="flex h-full flex-col p-5 pt-8">
                  <div className="mb-8">
                    <p className="text-lg font-extrabold">{brand.ownerName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {language === 'fa' ? 'مهندس نرم‌افزار' : 'Software Engineer'}
                    </p>
                  </div>

                  <nav aria-label={mobileNavLabel} className="grid gap-1.5">
                    {navItems.map((item) => {
                      const target = withLocale(item.href, language)
                      const active = pathname === target || (target !== '/' && pathname.startsWith(`${target}/`))
                      return (
                        <Link
                          key={item.key}
                          href={target}
                          aria-current={active ? 'page' : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                            active ? 'bg-primary/10 text-primary' : 'text-foreground/85 hover:bg-muted'
                          }`}
                        >
                          {t(item.name)}
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="mt-auto space-y-3 border-t border-border/70 pt-5">
                    <Button asChild size="lg" className="w-full rounded-xl font-bold">
                      <Link
                        href={withLocale('/qualification', language)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {collaborationLabel}
                      </Link>
                    </Button>
                    <button
                      type="button"
                      onClick={() => changeLanguage(language === 'en' ? 'fa' : 'en')}
                      className="min-h-11 w-full rounded-xl border border-border px-4 text-sm font-semibold"
                    >
                      {language === 'en' ? 'فارسی' : 'English'}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
