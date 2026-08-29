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
        title: 'Find the tools and resources I mention on Instagram',
        description: 'Search a name, open its real official destination, read the quick guide, and use the full Telegram resource when one is available.',
        note: `Use this page as the single link in my Instagram bio; no DM automation is required. ${total} items match this view.`,
        results: `${total} resources`,
        home: 'Back to home',
      }
    : {
        eyebrow: 'مرکز منابع ASDEV',
        title: 'ابزارها و منابعی که در اینستاگرام معرفی می‌کنم، اینجا پیدا کن',
        description: 'اسم ابزار را جستجو کن، به مقصد رسمی برو، راهنمای کوتاه را بخوان و اگر منبع کامل تلگرام موجود بود مستقیم همان را باز کن.',
        note: `این صفحه مقصد ثابت لینک بیوی اینستاگرام است و برای دریافت منابع نیازی به اتوماسیون دایرکت نیست. ${total} مورد با این فیلتر پیدا شد.`,
        results: `${total} منبع`,
        home: 'بازگشت به خانه',
      }

  const BackIcon = isEn ? ArrowLeft : ArrowRight

  return (
    <section className="container mx-auto px-4 py-28 subtle-grid" aria-labelledby="discover-heading">
      <JsonLd data={generateBreadcrumbSchema([
        { name: isEn ? 'Home' : 'خانه', url: siteUrl },
        { name: 'Discover', url: `${siteUrl}${canonicalPath}` },
      ])} />
      <DiscoverTelemetry
        name="discover_landing_view"
        locale={locale}
        metadata={discoverAnalyticsMetadata(attribution, { surface: 'discover' })}
      />

      <section className="mx-auto max-w-6xl space-y-8">
        <header className="section-surface aurora-shell overflow-hidden space-y-4 p-6 md:p-10">
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h1 id="discover-heading" className="headline-tight max-w-4xl text-3xl font-bold md:text-5xl">{copy.title}</h1>
          <p className="max-w-4xl text-base leading-8 text-muted-foreground md:text-lg">{copy.description}</p>
          <p className="max-w-4xl text-xs leading-6 text-muted-foreground">{copy.note}</p>
        </header>

        <DiscoverControls
          query={query}
          categories={categories}
          platforms={platforms}
          resourceTypes={[...DISCOVER_RESOURCE_TYPES]}
          isEn={isEn}
        />

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {copy.results}
        </p>

        <DiscoverGrid items={items} attribution={attribution} isEn={isEn} />

        <DiscoverPagination
          query={query}
          total={total}
          pageSize={DISCOVER_PAGE_SIZE}
          isEn={isEn}
          attribution={attribution}
        />

        <Link
          href={isEn ? '/en/' : '/'}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4"
        >
          <BackIcon className="h-4 w-4" />
          {copy.home}
        </Link>
      </section>
    </section>
  )
}
