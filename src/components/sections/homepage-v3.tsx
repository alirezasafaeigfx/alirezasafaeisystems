'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpLeft,
  CheckCircle2,
  Code2,
  Gauge,
  Layers3,
  LifeBuoy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectShowcase } from '@/components/public/project-showcase'
import { ProofStrip } from '@/components/public/proof-strip'
import { SectionHeading } from '@/components/public/section-heading'
import { VisualFrame } from '@/components/public/visual-frame'
import { OperationalScene } from '@/components/public/operational-scene'
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
    annotation: 'معماری نرم‌افزار • توسعه محصول • پایداری',
    services: 'خدمات اصلی',
    servicesEyebrow: 'خدمات اصلی',
    servicesTitle: 'برای مسئله‌های واقعی، راه‌حل فنی قابل اتکا می‌سازم',
    servicesDescription: 'از ساخت محصول جدید تا پایدارسازی و نجات سیستم موجود؛ هر مسیر با مسئله، محدودیت و نتیجه مورد انتظار شروع می‌شود.',
    projects: 'پروژه‌های منتخب',
    projectsEyebrow: 'کار منتخب',
    projectsTitle: 'محصول‌ها و سیستم‌هایی که می‌شود بررسی‌شان کرد',
    projectsDescription: 'به‌جای لیست طولانی مهارت‌ها، سه نمونه کار را با زمینه مسئله، نقش و تصمیم‌های فنی نشان می‌دهم.',
    proof: 'شواهد واقعی',
    proofEyebrow: 'اثبات‌پذیر',
    proofTitle: 'شواهد به‌جای ادعا',
    proofDescription: 'این بخش فقط به محصول‌ها و مطالعات موردی موجود متکی است؛ بدون آمار، مشتری یا نتیجه ساختگی.',
    about: 'درباره علیرضا صفایی',
    aboutEyebrow: 'درباره من',
    aboutTitle: 'مهندسی برای من یعنی ساخت چیزی که بعد از تحویل هم قابل اتکا بماند',
    principles: 'شیوه همکاری',
  },
  en: {
    hero: 'Alireza Safaei introduction',
    heroActions: 'Primary actions',
    portrait: 'Alireza Safaei portrait frame',
    annotation: 'Software architecture • Product delivery • Reliability',
    services: 'Core services',
    servicesEyebrow: 'Core services',
    servicesTitle: 'Engineering built around real product problems',
    servicesDescription: 'From a new product to stabilization or rescue work, every engagement starts with the problem, constraints, and the outcome that actually matters.',
    projects: 'Selected projects',
    projectsEyebrow: 'Selected work',
    projectsTitle: 'Products and systems you can inspect',
    projectsDescription: 'Instead of a long skills inventory, these three examples show the problem context, my role, and the engineering decisions behind the work.',
    proof: 'Real evidence',
    proofEyebrow: 'Reviewable',
    proofTitle: 'Evidence over claims',
    proofDescription: 'This surface points only to owned products and documented case studies—no invented metrics, clients, or outcomes.',
    about: 'About Alireza Safaei',
    aboutEyebrow: 'About me',
    aboutTitle: 'Engineering means building something that remains dependable after handoff',
    principles: 'How I work',
  },
} as const

const serviceIcons = [Layers3, Gauge, LifeBuoy] as const
const projectTones = ['cobalt', 'ink', 'violet'] as const

export function HomePageV3({ language }: HomePageV3Props) {
  const content = getHomeContent(language)
  const copy = labels[language]
  const isFa = language === 'fa'

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
    <div dir={isFa ? 'rtl' : 'ltr'}>
      <section aria-label={copy.hero} className="public-section overflow-hidden pt-28 md:pt-36 lg:pt-40">
        <div className="public-shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(24rem,1.08fr)] lg:items-start lg:gap-12 xl:gap-16">
            <div className="max-w-3xl">
              <p className="public-kicker">{content.hero.name}</p>
              <div className="mt-5 space-y-5">
                <h1 className="public-display text-4xl font-black sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
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
                  <Link href={withLocale('/qualification?source=portfolio&placement=hero&offer=request_assessment', language)} onClick={trackPrimaryCta}>
                    {content.hero.primaryCta}
                    <ArrowUpLeft
                      aria-hidden="true"
                      className={isFa ? 'size-4' : 'size-4 rotate-90'}
                    />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="min-h-12 rounded-xl px-6 font-bold">
                  <Link href={withLocale('/case-studies', language)} onClick={trackProjectsCta}>
                    {content.hero.secondaryCta}
                    <ArrowLeft
                      aria-hidden="true"
                      className={isFa ? 'size-4' : 'size-4 rotate-180'}
                    />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  {isFa ? 'برای استفاده واقعی و قابل اتکا ساخته شده' : 'Built for dependable real-world use'}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Code2 className="size-4 text-primary" aria-hidden="true" />
                  {isFa ? 'تصمیم‌های فنی قابل توضیح و قابل بررسی' : 'Reviewable, explainable engineering decisions'}
                </span>
              </div>
            </div>
            <div className="min-w-0 lg:pt-1">
              <OperationalScene isFa={isFa} />
            </div>
          </div>
        </div>
      </section>

      <section className="public-section-compact border-y border-border/60 bg-muted/22">
        <div className="public-shell">
          <ProofStrip
            ariaLabel={copy.proof}
            eyebrow={copy.proofEyebrow}
            title={copy.proofTitle}
            description={copy.proofDescription}
            language={language}
            items={content.proof.items.map((item) => ({ title: item.label, description: item.value, evidence: item }))}
          />
        </div>
      </section>

      <section aria-label={copy.projects} className="public-section">
        <div className="public-shell">
          <SectionHeading
            eyebrow={copy.projectsEyebrow}
            title={copy.projectsTitle}
            description={copy.projectsDescription}
          />
          <div className="mt-8 rounded-[2rem] border border-primary/20 bg-primary/[0.035] p-4 shadow-[0_28px_80px_-60px_rgba(15,23,42,0.6)] md:p-8" data-testid="flagship-project">
            <ProjectShowcase
              title={content.projects[0].title}
              description={content.projects[0].description}
              role={content.projects[0].role}
              technologies={content.projects[0].technologies}
              href={withLocale(content.projects[0].href, language)}
              imageSrc={content.projects[0].imageSrc}
              imageAlt={content.projects[0].imageAlt}
              tone={projectTones[0]}
              locale={language}
              index="01"
            />
          </div>
          <div className="mt-10">
            {content.projects.slice(1).map((project, index) => (
              <ProjectShowcase
                key={project.title}
                title={project.title}
                description={project.description}
                role={project.role}
                technologies={project.technologies}
                href={withLocale(project.href, language)}
                imageSrc={project.imageSrc}
                imageAlt={project.imageAlt}
                tone={projectTones[index + 1]}
                locale={language}
                index={`0${index + 2}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label={copy.services} className="public-section-compact border-y border-border/60 bg-muted/22">
        <div className="public-shell">
          <SectionHeading
            eyebrow={copy.servicesEyebrow}
            title={copy.servicesTitle}
            description={copy.servicesDescription}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-12">
            {content.services.map((service, index) => {
              const Icon = serviceIcons[index]
              const columnClass = index === 0 ? 'md:col-span-5' : index === 1 ? 'md:col-span-4' : 'md:col-span-3'
              return (
                <article
                  key={service.title}
                  className={`group flex min-h-72 flex-col rounded-[1.6rem] border border-border/70 bg-background/78 p-6 shadow-[0_18px_60px_-48px_rgba(15,23,42,0.5)] transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-primary/30 ${columnClass}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-3xl font-black tabular-nums text-primary/35">0{index + 1}</span>
                    <span className="grid size-11 place-items-center rounded-xl border border-primary/15 bg-primary/8 text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-black leading-8 md:text-2xl">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground md:text-base">{service.description}</p>
                  <Link
                    href={withLocale(service.href, language)}
                    className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg font-bold text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {service.label}
                    <ArrowUpLeft aria-hidden="true" className={isFa ? 'public-link-arrow size-4' : 'public-link-arrow size-4 rotate-90'} />
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section aria-label={copy.about} className="public-section">
        <div className="public-shell">
          <div>
            <p className="public-kicker">{copy.aboutEyebrow}</p>
            <h2 className="public-display mt-3 text-3xl font-black md:text-4xl lg:text-5xl">{content.about.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">{content.about.description}</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-[minmax(14rem,0.68fr)_minmax(0,1.32fr)] md:items-stretch lg:gap-10">
            <div className="max-w-md" data-testid="owner-portrait-frame" data-asset-status="owner-portrait">
              <VisualFrame ariaLabel={copy.portrait} ratio="portrait">
                <Image
                  src="/images/portrait/alireza-safaei.webp"
                  alt={isFa ? 'پرتره حرفه‌ای علیرضا صفایی' : 'Professional portrait of Alireza Safaei'}
                  fill
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 36vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/30 to-transparent" aria-hidden="true" />
                <p className="absolute inset-x-0 bottom-0 z-10 p-5 text-sm font-bold leading-7 text-white/90">{copy.annotation}</p>
              </VisualFrame>
            </div>
            <div className="rounded-[1.75rem] border border-border/70 bg-card/75 p-6 md:p-8">
              <h3 className="text-xl font-black md:text-2xl">{copy.aboutTitle}</h3>
              <ul aria-label={copy.principles} className="mt-6 grid gap-4">
                {content.principles.map((principle, index) => (
                  <li key={principle} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border/65 pt-4 first:border-t-0 first:pt-0">
                    <span className="text-sm font-black tabular-nums text-primary/55">0{index + 1}</span>
                    <span className="text-base leading-8 text-foreground/82">{principle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
