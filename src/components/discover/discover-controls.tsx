'use client'

import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { DiscoverPublicQuery } from '@/lib/discover-query'
import { discoverCategoryLabel, discoverPlatformLabel } from '@/lib/discover-labels'

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
  const locale = isEn ? 'en' : 'fa'
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
        filters: 'Resource filters',
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
        filters: 'فیلترهای منابع',
      }

  const resourceTypeLabels: Record<string, string> = isEn
    ? { tool: 'Tool', 'ai-tool': 'AI tool', app: 'App', 'web-service': 'Web service', 'developer-tool': 'Developer tool', productivity: 'Productivity', guide: 'Guide', resource: 'Resource', other: 'Other' }
    : { tool: 'ابزار', 'ai-tool': 'ابزار هوش مصنوعی', app: 'اپلیکیشن', 'web-service': 'سرویس وب', 'developer-tool': 'ابزار توسعه', productivity: 'بهره‌وری', guide: 'راهنما', resource: 'منبع', other: 'سایر' }

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
    'min-h-10 min-w-0 rounded-lg border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <section
      aria-label={isEn ? 'Discover controls' : 'کنترل‌های جستجوی منابع'}
      className="space-y-3"
      aria-busy={isPending}
    >
      <form
        role="search"
        aria-label={copy.search}
        onSubmit={submitSearch}
        className="relative flex items-center gap-2 rounded-2xl border border-border/80 bg-card p-2 shadow-sm focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/10"
      >
        <Search className="ms-2 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label className="min-w-0 flex-1">
          <span className="sr-only">{copy.search}</span>
          <input
            key={query.q}
            type="search"
            name="q"
            defaultValue={query.q}
            aria-label={copy.search}
            placeholder={copy.search}
            className="min-h-12 w-full bg-transparent px-2 text-base outline-none placeholder:text-muted-foreground md:text-lg"
          />
        </label>
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          disabled={isPending}
        >
          {copy.submit}
        </button>
      </form>

      <div
        role="group"
        aria-label={copy.filters}
        className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-muted/25 p-2 md:grid-cols-4"
      >
        <label className="min-w-0">
          <span className="sr-only">{copy.category}</span>
          <select
            aria-label={copy.category}
            value={query.category}
            onChange={(event) => setParams({ category: event.target.value || null })}
            className={`${selectClassName} w-full`}
          >
            <option value="">{copy.allCategories}</option>
            {categories.map((category) => (
              <option key={category} value={category}>{discoverCategoryLabel(category, locale)}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="sr-only">{copy.type}</span>
          <select
            aria-label={copy.type}
            value={query.type}
            onChange={(event) => setParams({ type: event.target.value || null })}
            className={`${selectClassName} w-full`}
          >
            <option value="">{copy.allTypes}</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>{resourceTypeLabels[type] ?? (isEn ? 'Type not specified' : 'نوع منبع اعلام نشده')}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="sr-only">{copy.platform}</span>
          <select
            aria-label={copy.platform}
            value={query.platform}
            onChange={(event) => setParams({ platform: event.target.value || null })}
            className={`${selectClassName} w-full`}
          >
            <option value="">{copy.allPlatforms}</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>{discoverPlatformLabel(platform, locale)}</option>
            ))}
          </select>
        </label>

        <label className="min-w-0">
          <span className="sr-only">{copy.sort}</span>
          <select
            aria-label={copy.sort}
            value={query.sort}
            onChange={(event) => setParams({ sort: event.target.value })}
            className={`${selectClassName} w-full`}
          >
            <option value="featured">{copy.featured}</option>
            <option value="latest">{copy.latest}</option>
          </select>
        </label>
      </div>
    </section>
  )
}
