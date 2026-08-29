'use client'

import type { FormEvent } from 'react'
import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { DiscoverPublicQuery } from '@/lib/discover-query'

type DiscoverControlsProps = {
  query: DiscoverPublicQuery
  categories: string[]
  platforms: string[]
  resourceTypes: string[]
  isEn: boolean
}

export function DiscoverControls({
  query,
  categories,
  platforms,
  resourceTypes,
  isEn,
}: DiscoverControlsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const copy = isEn
    ? {
        search: 'Search resources',
        category: 'Category',
        allCategories: 'All categories',
        type: 'Resource type',
        allTypes: 'All types',
        platform: 'Platform',
        allPlatforms: 'All platforms',
        sort: 'Sort',
        featured: 'Featured first',
        latest: 'Latest',
        submit: 'Search',
      }
    : {
        search: 'جستجوی منابع',
        category: 'دسته‌بندی',
        allCategories: 'همه دسته‌ها',
        type: 'نوع منبع',
        allTypes: 'همه نوع‌ها',
        platform: 'پلتفرم',
        allPlatforms: 'همه پلتفرم‌ها',
        sort: 'مرتب‌سازی',
        featured: 'منتخب‌ها',
        latest: 'جدیدترین',
        submit: 'جستجو',
      }

  function setParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      if (!value) next.delete(key)
      else next.set(key, value)
    }

    next.set('page', '1')
    const serialized = next.toString()
    const href = serialized ? `${pathname}?${serialized}` : pathname

    startTransition(() => {
      router.replace(href, { scroll: false })
    })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setParams({ q: String(data.get('q') ?? '').trim() || null })
  }

  const selectClassName =
    'min-h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <section
      aria-label={isEn ? 'Discover controls' : 'کنترل‌های جستجوی منابع'}
      className="rounded-2xl border border-border/70 bg-card p-4 md:p-5"
      aria-busy={isPending}
    >
      <form
        role="search"
        aria-label={copy.search}
        onSubmit={submitSearch}
        className="grid gap-3 lg:grid-cols-[minmax(16rem,1.4fr)_repeat(4,minmax(9rem,0.7fr))_auto]"
      >
        <label className="grid gap-1.5">
          <span className="sr-only">{copy.search}</span>
          <input
            key={query.q}
            type="search"
            name="q"
            defaultValue={query.q}
            aria-label={copy.search}
            placeholder={copy.search}
            className="min-h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="sr-only">{copy.category}</span>
          <select
            aria-label={copy.category}
            value={query.category}
            onChange={(event) => setParams({ category: event.target.value || null })}
            className={selectClassName}
          >
            <option value="">{copy.allCategories}</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="sr-only">{copy.type}</span>
          <select
            aria-label={copy.type}
            value={query.type}
            onChange={(event) => setParams({ type: event.target.value || null })}
            className={selectClassName}
          >
            <option value="">{copy.allTypes}</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="sr-only">{copy.platform}</span>
          <select
            aria-label={copy.platform}
            value={query.platform}
            onChange={(event) => setParams({ platform: event.target.value || null })}
            className={selectClassName}
          >
            <option value="">{copy.allPlatforms}</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="sr-only">{copy.sort}</span>
          <select
            aria-label={copy.sort}
            value={query.sort}
            onChange={(event) => setParams({ sort: event.target.value })}
            className={selectClassName}
          >
            <option value="featured">{copy.featured}</option>
            <option value="latest">{copy.latest}</option>
          </select>
        </label>

        <button
          type="submit"
          className="min-h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          disabled={isPending}
        >
          {copy.submit}
        </button>
      </form>
    </section>
  )
}
