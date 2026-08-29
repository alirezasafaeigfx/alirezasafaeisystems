'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, CheckCircle2, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VisualFrame } from '@/components/public/visual-frame'
import { trackEvent } from '@/lib/analytics/client'
import { getHomeContent } from '@/lib/home-content'
import { withLocale, type Locale } from '@/lib/locale-utils'

type HomePageV3Props = {
  language: Locale
}

const labels = {
  fa: {
    hero: 'معرفی علیرضا صفایی',
    heroActions: 'اقدام‌های اصلی',
    portrait: 'قاب تصویر علیرضا صفایی',
    portraitStatus: 'تصویر واقعی مالک در نسخه نهایی جایگزین می‌شود',
    annotation: 'معماری نرم‌افزار • توسعه محصول • پایداری',
    services: 'خدمات اصلی',
    servicesTitle: 'چه کاری انجام می‌دهم',
    projects: 'پروژه‌های منتخب',
    projectsTitle: 'پروژه‌های منتخب',
    principles: 'شیوه همکاری',
    principlesTitle: 'اصول مهندسی',
  },
  en: {
    hero: 'Alireza Safaei introduction',
    heroActions: 'Primary actions',
    portrait: 'Alireza Safaei portrait frame',
    portraitStatus: 'Owner-approved portrait will replace this development visual',
    annotation: 'Software architecture • Product delivery • Reliability',
    services: 'Core services',
    servicesTitle: 'What I do',
    projects: 'Selected projects',
    projectsTitle: 'Selected projects',
    principles: 'How I work',
    principlesTitle: 'Engineering principles',
  },
} as const

export function HomePageV3({ language }: HomePageV3Props) {
  const content = getHomeContent(language)
  const copy = labels[language]

  function trackPrimaryCta() {
    void trackEvent({
      name: 'hero_primary_cta_click',
      category: 'conversion',
      locale: language,
    })
  }

  function trackProjectsCta() {
    void trackEvent({
      name: 'hero_projects_cta_click',
      category: 'engagement',
      locale: language,
    })
  }

  return (
    <div dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <section aria-label={copy.hero} className="public-section overflow-hidden pt-28 md:pt-36 lg:pt-40">
        <div className="public-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:gap-14 xl:gap-20">
            <div className="order-2 max-w-3xl lg:order-1">
              <p className="public-kicker">{content.hero.name}</p>
              <div className="mt-5 space-y-5">
                <h1 className="public-display text-5xl font-black sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                  {content.hero.title}
                </h1>
                <p className="max-w-2xl text-lg font-medium leading-9 text-foreground/86 md:text-xl md:leading-10">
                  {content.hero.description}
                </p>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  {content.hero.detail}
                </p>
              </div>

              <div aria-label={copy.heroActions} role="group" className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-h-12 rounded-xl px-6 font-extrabold shadow-sm">
                  <Link href={withLocale('/qualification', language)} onClick={trackPrimaryCta}>
                    {content.hero.primaryCta}
                    <ArrowUpLeft
                      aria-hidden="true"
                      className={language === 'fa' ? 'size-4' : 'size-4 rotate-90'}
                    />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl px-6 font-bold">
                  <Link href={withLocale('/case-studies', language)} onClick={trackProjectsCta}>
                    {content.hero.secondaryCta}
                    <ArrowLeft
                      aria-hidden="true"
                      className={language === 'fa' ? 'size-4' : 'size-4 rotate-180'}
                    />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  {language === 'fa' ? 'تمرکز روی استفاده واقعی در Production' : 'Built for real production use'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Code2 className="size-4 text-primary" aria-hidden="true" />
                  {language === 'fa' ? 'تصمیم‌های فنی قابل توضیح و قابل بررسی' : 'Reviewable, explainable engineering decisions'}
                </span>
              </div>
            </div>

            <div className="order-1 lg:order-2" data-testid="owner-portrait-frame" data-asset-status="pending-owner-portrait">
              <VisualFrame ariaLabel={copy.portrait} ratio="portrait" className="min-h-[28rem] sm:min-h-[34rem] lg:min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,color-mix(in_oklab,var(--primary)_24%,transparent),transparent_35%),linear-gradient(155deg,color-mix(in_oklab,var(--card)_96%,transparent),color-mix(in_oklab,var(--muted)_88%,transparent))]" />
                <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--border)_45%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--border)_45%,transparent)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black_15%,transparent_72%)]" aria-hidden="true" />
                <div className="absolute inset-x-[12%] top-[10%] aspect-square rounded-full border border-primary/20" aria-hidden="true" />
                <div className="absolute inset-x-[20%] top-[18%] aspect-square rounded-full border border-primary/12" aria-hidden="true" />

                <div className="relative z-10 flex h-full min-h-[28rem] flex-col items-center justify-center px-6 py-8 text-center sm:min-h-[34rem] lg:min-h-full">
                  <div className="grid size-36 place-items-center rounded-[2rem] border border-primary/20 bg-background/72 text-5xl font-black tracking-[-0.06em] text-primary shadow-[0_28px_80px_-38px_color-mix(in_oklab,var(--primary)_70%,transparent)] backdrop-blur-sm sm:size-44 sm:text-6xl">
                    AS
                  </div>
                  <p className="mt-7 max-w-xs text-sm font-bold leading-7 text-foreground/80">
                    {copy.annotation}
                  </p>
                  <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
                    {copy.portraitStatus}
                  </p>
                </div>
              </VisualFrame>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={copy.services} className="section-block border-y border-border/70 bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">{copy.servicesTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.services.map((service) => (
              <article key={service.title} className="flex min-h-64 flex-col rounded-xl border bg-card p-6">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-muted-foreground">{service.description}</p>
                <Link href={withLocale(service.href, language)} className="mt-6 inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {service.label}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-label={copy.projects} className="section-block">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">{copy.projectsTitle}</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {content.projects.map((project) => (
              <article key={project.title} className="flex min-h-80 flex-col rounded-xl border bg-card p-6">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
                <p className="mt-4 text-sm font-medium">{project.role}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
                  {project.technologies.map((technology) => <li key={technology} className="rounded-full bg-muted px-3 py-1 text-sm">{technology}</li>)}
                </ul>
                <Link href={withLocale(project.href, language)} className="mt-6 inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {project.label}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block border-y border-border/70 bg-muted/30">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{content.proof.title}</h2>
            <p className="mt-4 max-w-xl leading-8 text-muted-foreground">{content.proof.description}</p>
          </div>
          <div aria-label={copy.principles}>
            <h2 className="text-2xl font-bold md:text-3xl">{copy.principlesTitle}</h2>
            <ul className="mt-4 space-y-3">
              {content.principles.map((principle) => <li key={principle} className="border-s border-primary ps-4 leading-7 text-muted-foreground">{principle}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{content.about.title}</h2>
            <p className="mt-4 max-w-xl leading-8 text-muted-foreground">{content.about.description}</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-2xl font-bold">{content.contact.title}</h2>
            <p className="mt-4 leading-8 text-muted-foreground">{content.contact.description}</p>
            <Button asChild className="mt-6 min-h-11">
              <Link href={withLocale('/qualification', language)}>{content.contact.cta}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
