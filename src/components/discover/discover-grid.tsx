'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { appendDiscoverAttribution, type DiscoverAttribution } from '@/lib/discover'

export type DiscoverGridItem = {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  featured: boolean
  imageUrl: string | null
}

type DiscoverGridProps = {
  items: DiscoverGridItem[]
  attribution: DiscoverAttribution
  isEn: boolean
}

export function DiscoverGrid({ items, attribution, isEn }: DiscoverGridProps) {
  const copy = isEn
    ? {
        featured: 'Featured',
        open: 'View guide and official link',
        empty: 'No Discover items match this filter.',
      }
    : {
        featured: 'منتخب',
        open: 'توضیح کوتاه و لینک رسمی',
        empty: 'موردی با این فیلتر پیدا نشد.',
      }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground" role="status">
        {copy.empty}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const basePath = isEn ? `/en/discover/${item.slug}` : `/discover/${item.slug}`
        const href = appendDiscoverAttribution(basePath, attribution)

        return (
          <article key={item.slug} className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card card-hover">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt="" loading="lazy" className="aspect-[16/9] w-full border-b object-cover" />
            ) : (
              <div className="flex aspect-[16/7] items-center justify-center border-b bg-muted/40" aria-hidden="true">
                <Sparkles className="h-8 w-8 text-primary/70" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{item.category}</span>
                {item.featured ? <span className="font-semibold text-primary">{copy.featured}</span> : null}
              </div>
              <h2 className="mt-4 text-xl font-semibold leading-8">{item.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                ))}
              </div>
              <Link href={href} className="mt-auto pt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                {copy.open} →
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
