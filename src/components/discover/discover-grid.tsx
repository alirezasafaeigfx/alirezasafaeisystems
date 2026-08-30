'use client'

import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { appendDiscoverAttribution, type DiscoverAttribution } from '@/lib/discover'

export type DiscoverGridItem = {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  featured: boolean
  imageUrl: string | null
  resourceType: string
  platforms: string[]
  pricingModel: string
}

type DiscoverGridProps = {
  items: DiscoverGridItem[]
  attribution: DiscoverAttribution
  isEn: boolean
}

export function DiscoverGrid({ items, attribution, isEn }: DiscoverGridProps) {
  const resourceTypeLabels: Record<string, string> = isEn
    ? { tool: 'Tool', 'ai-tool': 'AI tool', app: 'App', 'web-service': 'Web service', 'developer-tool': 'Developer tool', productivity: 'Productivity', guide: 'Guide', resource: 'Resource', other: 'Other' }
    : { tool: 'ابزار', 'ai-tool': 'ابزار هوش مصنوعی', app: 'اپلیکیشن', 'web-service': 'سرویس وب', 'developer-tool': 'ابزار توسعه', productivity: 'بهره‌وری', guide: 'راهنما', resource: 'منبع', other: 'سایر' }
  const pricingLabels: Record<string, string> = isEn
    ? { free: 'Free', freemium: 'Free with paid options', paid: 'Paid', 'open-source': 'Open source', unknown: 'Pricing not specified' }
    : { free: 'رایگان', freemium: 'رایگان با امکانات بیشتر', paid: 'پولی', 'open-source': 'متن‌باز', unknown: 'وضعیت قیمت اعلام نشده' }
  const copy = isEn
    ? {
        featured: 'Featured',
        open: 'View guide and official link',
        empty: 'No Discover items match this filter.',
        featuredArticle: (title: string) => `Featured resource: ${title}`,
        article: (title: string) => `Resource: ${title}`,
      }
    : {
        featured: 'منتخب',
        open: 'توضیح کوتاه و لینک رسمی',
        empty: 'موردی با این فیلتر پیدا نشد.',
        featuredArticle: (title: string) => `منبع منتخب: ${title}`,
        article: (title: string) => `منبع: ${title}`,
      }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground" role="status">
        {copy.empty}
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const basePath = isEn ? `/en/discover/${item.slug}` : `/discover/${item.slug}`
        const href = appendDiscoverAttribution(basePath, attribution)
        const articleLabel = item.featured
          ? copy.featuredArticle(item.title)
          : copy.article(item.title)

        return (
          <article
            key={item.slug}
            aria-label={articleLabel}
            className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              item.featured ? 'border-primary/45 shadow-sm ring-1 ring-primary/10' : 'border-border/70'
            }`}
          >
            <div className="relative overflow-hidden border-b border-border/60 bg-muted/30">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  width={1280}
                  height={720}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  fetchPriority={index < 3 ? 'high' : undefined}
                  className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.015]"
                />
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center" aria-hidden="true">
                  <Sparkles className="h-8 w-8 text-primary/65" />
                </div>
              )}
              {item.featured ? (
                <span className="absolute start-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  {copy.featured}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>{item.category}</span>
                <span aria-hidden="true">·</span>
                <span>{resourceTypeLabels[item.resourceType] ?? (isEn ? 'Type not specified' : 'نوع منبع اعلام نشده')}</span>
                <span aria-hidden="true">·</span>
                <span>{pricingLabels[item.pricingModel] ?? (isEn ? 'Pricing not specified' : 'وضعیت قیمت اعلام نشده')}</span>
              </div>

              <h2 className="mt-3 text-xl font-semibold leading-8 tracking-tight">{item.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.description}</p>

              {item.platforms.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-foreground/75" aria-label={`${item.title} platforms`}>
                  {item.platforms.slice(0, 3).map((platform) => (
                    <span key={platform}>{platform}</span>
                  ))}
                </div>
              ) : null}

              <Link
                href={href}
                className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {copy.open}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
