import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type BlogArticleShellProps = {
  title: string
  excerpt: string
  category: string
  publishedLabel: string
  readTimeLabel: string
  author: string
  backHref: string
  backLabel: string
  locale: 'fa' | 'en'
  children: ReactNode
  related?: Array<{ title: string; href: string }>
}

export function BlogArticleShell({
  title,
  excerpt,
  category,
  publishedLabel,
  readTimeLabel,
  author,
  backHref,
  backLabel,
  locale,
  children,
  related = [],
}: BlogArticleShellProps) {
  const BackIcon = locale === 'fa' ? ArrowRight : ArrowLeft
  const relatedTitle = locale === 'fa' ? 'یادداشت‌های مرتبط' : 'Related insights'
  const byLabel = locale === 'fa' ? 'نوشته علیرضا صفایی' : 'By Alireza Safaei'

  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className="mx-auto max-w-6xl">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <BackIcon className="size-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <article className="mx-auto mt-8 max-w-3xl">
        <header className="space-y-5 border-b border-border/70 pb-8">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
            <span>{category}</span>
            <span aria-hidden="true">·</span>
            <time>{publishedLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{readTimeLabel}</span>
          </div>

          <h1 className="headline-tight text-4xl font-bold tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
            {excerpt}
          </p>

          <div className="flex items-center gap-3 pt-1 text-sm">
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-semibold text-primary"
            >
              AS
            </span>
            <div>
              <p className="font-semibold text-foreground">{author}</p>
              <p className="text-xs text-muted-foreground">{byLabel}</p>
            </div>
          </div>
        </header>

        <div className="mt-9">{children}</div>
      </article>

      {related.length > 0 ? (
        <nav aria-label={relatedTitle} className="mx-auto mt-14 max-w-3xl border-t border-border/70 pt-7">
          <h2 className="text-lg font-semibold">{relatedTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-border/70 p-4 text-sm font-semibold transition hover:border-primary/35 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{item.title}</span>
                  <ArrowLeft className={`size-4 shrink-0 transition-transform group-hover:-translate-x-0.5 ${locale === 'en' ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
