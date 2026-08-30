import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { db } from '@/lib/db'
import {
  DISCOVER_RESOURCE_TYPES,
  discoverAnalyticsMetadata,
  extractDiscoverAttribution,
} from '@/lib/discover'
import { getRequestLanguage } from '@/lib/i18n/server'
import { getSiteUrl } from '@/lib/site-config'
import { generateBreadcrumbSchema } from '@/lib/seo'
import { DiscoverControls } from '@/components/discover/discover-controls'
import { DiscoverGrid, type DiscoverGridItem } from '@/components/discover/discover-grid'
import { DiscoverPagination } from '@/components/discover/discover-pagination'
import { DiscoverTelemetry } from '@/components/discover/discover-telemetry'
import { JsonLd } from '@/components/seo/json-ld'
import {
  buildDiscoverOrderBy,
  buildDiscoverWhere,
  DISCOVER_PAGE_SIZE,
  parseDiscoverPublicQuery,
  type DiscoverPublicQuery,
} from '@/lib/discover-query'

const siteUrl = getSiteUrl()

type DiscoverPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const emptyDiscoverQuery: DiscoverPublicQuery = {
  q: '',
  category: '',
  type: '',
  platform: '',
  sort: 'featured',
  page: 1,
}

export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
  const lang = await getRequestLanguage()
  const isEn = lang === 'en'
  const canonicalPath = isEn ? '/en/discover' : '/discover'
  const query = parseDiscoverPublicQuery(await searchParams)
  const hasFacets = Boolean(query.q || query.category || query.type || query.platform || query.page > 1)
  return {
    title: isEn ? 'Discover Tools, Guides and Resources' : 'Discover | ابزارها، راهنماها و منابع',
    description: isEn
      ? 'Find the tools and resources mentioned in ASDEV social content, with official destinations, quick guides, and direct full-resource links when available.'
      : 'ابزارها و منابع معرفی‌شده در محتوای ASDEV؛ همراه با مقصد رسمی، راهنمای کوتاه و لینک مستقیم منبع کامل در صورت وجود.',
    alternates: {
      canonical: canonicalPath,
      languages: {
        'fa-IR': `${siteUrl}/discover`,
        'en-US': `${siteUrl}/en/discover`,
        'x-default': `${siteUrl}/discover`,
      },
    },
    ...(hasFacets ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const lang = await getRequestLanguage()
  const isEn = lang === 'en'
  const locale = isEn ? 'en' : 'fa'
  const canonicalPath = isEn ? '/en/discover' : '/discover'
  const rawSearchParams = await searchParams
  const attribution = extractDiscoverAttribution(rawSearchParams)
  const query = parseDiscoverPublicQuery(rawSearchParams)
  const where = buildDiscoverWhere(query, locale)
  const taxonomyWhere = buildDiscoverWhere(emptyDiscoverQuery, locale)

  const [records, total, taxonomyRecords] = await Promise.all([
    db.discoverItem.findMany({
      where,
      skip: (query.page - 1) * DISCOVER_PAGE_SIZE,
      take: DISCOVER_PAGE_SIZE,
      select: {
        slug: true,
        title: true,
        description: true,
        category: true,
        tags: true,
        featured: true,
        imageUrl: true,
        resourceType: true,
        platforms: true,
        pricingModel: true,
        titleEn: true,
        descriptionEn: true,
      },
      orderBy: buildDiscoverOrderBy(query),
    }),
    db.discoverItem.count({ where }),
    db.discoverItem.findMany({
      where: taxonomyWhere,
      select: {
        category: true,
        platforms: true,
      },
    }),
  ])

  const items: DiscoverGridItem[] = records.map((item) => ({
    ...item,
    title: isEn ? (item.titleEn ?? item.title) : item.title,
    description: isEn ? (item.descriptionEn ?? item.description) : item.description,
    tags: item.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    platforms: item.platforms.split(',').map((platform) => platform.trim()).filter(Boolean),
  }))

  const categories = [...new Set(
    taxonomyRecords
      .map((item) => item.category.trim())
      .filter(Boolean),
  )].sort((a, b) => a.localeCompare(b))

  const platforms = [...new Set(
    taxonomyRecords.flatMap((item) =>
      item.platforms
        .split(',')
        .map((platform) => platform.trim())
        .filter(Boolean),
    ),
  )].sort((a, b) => a.localeCompare(b))

  const copy = isEn
    ? {
        eyebrow: 'ASDEV Resource Hub',
        title: 'Find the tool. Get the real source.',
        description: 'Search the resources I mention across Instagram and ASDEV. Every card leads to one internal guide with the official destination and verified resource links when available.',
        results: `${total} resources`,
        trustTitle: 'Curated, not scraped',
        trustBody: 'Items are published intentionally. Featured labels are editorial, external destinations stay separate from campaign tracking, and filter pages remain out of the search index.',
        home: 'Back to home',
      }
    : {
        eyebrow: 'مرکز منابع ASDEV',
        title: 'ابزار را پیدا کن؛ به منبع واقعی برس.',
        description: 'منابعی که در اینستاگرام و ASDEV معرفی می‌کنم اینجا یک‌جا هستند. هر کارت فقط به یک راهنمای داخلی می‌رسد و از آنجا مقصد رسمی و منابع تأییدشده را می‌بینی.',
        results: `${total} منبع`,
        trustTitle: 'منتخب و بررسی‌شده؛ نه جمع‌آوری خودکار',
        trustBody: 'هر مورد عمداً منتشر می‌شود. برچسب منتخب فقط برای منابع واقعاً Featured است، لینک‌های خارجی با پارامترهای کمپین آلوده نمی‌شوند و صفحات فیلترشده وارد ایندکس جستجو نمی‌شوند.',
        home: 'بازگشت به خانه',
      }

  const BackIcon = isEn ? ArrowLeft : ArrowRight

  return (
    <section className="container mx-auto px-4 pb-20 pt-24 md:pt-28" aria-labelledby="discover-heading">
      <JsonLd data={generateBreadcrumbSchema([
        { name: isEn ? 'Home' : 'خانه', url: siteUrl },
        { name: 'Discover', url: `${siteUrl}${canonicalPath}` },
      ])} />
      <DiscoverTelemetry
        name="discover_landing_view"
        locale={locale}
        metadata={discoverAnalyticsMetadata(attribution, { surface: 'discover' })}
      />

      <section className="mx-auto max-w-6xl space-y-7">
        <header className="max-w-4xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</p>
          <h1 id="discover-heading" className="headline-tight text-4xl font-bold tracking-tight md:text-6xl">{copy.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">{copy.description}</p>
        </header>

        <DiscoverControls
          query={query}
          categories={categories}
          platforms={platforms}
          resourceTypes={[...DISCOVER_RESOURCE_TYPES]}
          isEn={isEn}
        />

        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <p className="text-sm font-medium text-foreground" aria-live="polite">{copy.results}</p>
          <p className="hidden text-xs text-muted-foreground md:block">{query.sort === 'latest' ? (isEn ? 'Latest first' : 'جدیدترین‌ها') : (isEn ? 'Featured first' : 'منتخب‌ها اول')}</p>
        </div>

        <DiscoverGrid items={items} attribution={attribution} isEn={isEn} />

        <DiscoverPagination
          query={query}
          total={total}
          pageSize={DISCOVER_PAGE_SIZE}
          isEn={isEn}
          attribution={attribution}
        />

        <aside className="rounded-2xl border border-border/60 bg-muted/25 p-5 md:p-6" aria-label={copy.trustTitle}>
          <h2 className="text-base font-semibold">{copy.trustTitle}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">{copy.trustBody}</p>
        </aside>

        <Link
          href={isEn ? '/en/' : '/'}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground underline underline-offset-4"
        >
          <BackIcon className="h-4 w-4" />
          {copy.home}
        </Link>
      </section>
    </section>
  )
}
