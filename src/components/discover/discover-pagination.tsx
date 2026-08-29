import Link from 'next/link'
import { appendDiscoverAttribution, type DiscoverAttribution } from '@/lib/discover'
import type { DiscoverPublicQuery } from '@/lib/discover-query'

type DiscoverPaginationProps = {
  query: DiscoverPublicQuery
  total: number
  pageSize: number
  isEn: boolean
  attribution: DiscoverAttribution
}

export function DiscoverPagination({
  query,
  total,
  pageSize,
  isEn,
  attribution,
}: DiscoverPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(query.page, 1), totalPages)

  if (totalPages <= 1) return null

  const copy = isEn
    ? {
        label: 'Resource pagination',
        previous: 'Previous page',
        next: 'Next page',
        page: (page: number) => `Page ${page}`,
      }
    : {
        label: 'صفحه‌بندی منابع',
        previous: 'صفحه قبل',
        next: 'صفحه بعد',
        page: (page: number) => `صفحه ${page}`,
      }

  function hrefFor(page: number) {
    const params = new URLSearchParams()
    if (query.q) params.set('q', query.q)
    if (query.category) params.set('category', query.category)
    if (query.type) params.set('type', query.type)
    if (query.platform) params.set('platform', query.platform)
    params.set('sort', query.sort)
    params.set('page', String(page))

    const pathname = isEn ? '/en/discover' : '/discover'
    return appendDiscoverAttribution(`${pathname}?${params.toString()}`, attribution)
  }

  const pageNumbers = [...new Set([
    1,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    totalPages,
  ].filter((page) => page >= 1 && page <= totalPages))].sort((a, b) => a - b)

  return (
    <nav aria-label={copy.label} className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
      <div>
        {currentPage > 1 ? (
          <Link
            href={hrefFor(currentPage - 1)}
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.previous}
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pageNumbers.map((page, index) => {
          const previousPage = pageNumbers[index - 1]
          const showGap = previousPage !== undefined && page - previousPage > 1
          const active = page === currentPage

          return (
            <span key={page} className="contents">
              {showGap ? <span aria-hidden="true" className="px-1 text-muted-foreground">…</span> : null}
              <Link
                href={hrefFor(page)}
                aria-label={copy.page(page)}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex size-11 items-center justify-center rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted'
                }`}
              >
                {page}
              </Link>
            </span>
          )
        })}
      </div>

      <div>
        {currentPage < totalPages ? (
          <Link
            href={hrefFor(currentPage + 1)}
            className="inline-flex min-h-11 items-center rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {copy.next}
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
