'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

  return (
    <div dir={language === 'fa' ? 'rtl' : 'ltr'}>
      <section aria-label={copy.hero} className="section-block">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-10 py-10 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:py-16">
            <div className="order-2 max-w-3xl space-y-6 md:order-1">
              <p className="text-sm font-semibold text-primary">{content.hero.name}</p>
              <div className="space-y-4">
                <h1 className="headline-tight text-4xl font-bold tracking-tight md:text-6xl">{content.hero.title}</h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{content.hero.description}</p>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">{content.hero.detail}</p>
              </div>
              <div aria-label={copy.heroActions} role="group" className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-h-11">
                  <Link href={withLocale('/qualification', language)} onClick={trackPrimaryCta}>
                    {content.hero.primaryCta}
                    <ArrowLeft aria-hidden="true" className={language === 'fa' ? 'size-4' : 'size-4 rotate-180'} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-11">
                  <Link href={withLocale('/case-studies', language)}>{content.hero.secondaryCta}</Link>
                </Button>
              </div>
            </div>
            <div aria-hidden="true" className="order-1 aspect-[4/5] rounded-2xl border border-border bg-muted md:order-2" />
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
