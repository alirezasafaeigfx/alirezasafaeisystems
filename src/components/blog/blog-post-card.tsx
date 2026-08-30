import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type BlogPostCardProps = {
  title: string
  excerpt: string
  href: string
  category: string
  publishedLabel: string
  readTimeLabel: string
  featured: boolean
  locale: 'fa' | 'en'
}

export function BlogPostCard({
  title,
  excerpt,
  href,
  category,
  publishedLabel,
  readTimeLabel,
  featured,
  locale,
}: BlogPostCardProps) {
  const featuredLabel = locale === 'fa' ? 'منتخب' : 'Featured'
  const articleLabel = featured
    ? locale === 'fa'
      ? `یادداشت منتخب: ${title}`
      : `Featured insight: ${title}`
    : locale === 'fa'
      ? `یادداشت: ${title}`
      : `Insight: ${title}`
  const readLabel = locale === 'fa' ? 'مطالعه یادداشت' : 'Read insight'

  return (
    <article
      aria-label={articleLabel}
      className={`group flex h-full flex-col border-t pt-5 ${
        featured
          ? 'border-primary/60 md:rounded-2xl md:border md:bg-card md:p-7 md:shadow-sm'
          : 'border-border/70'
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        {featured ? (
          <span className="font-semibold text-primary">{featuredLabel}</span>
        ) : null}
        <span>{category}</span>
        <span aria-hidden="true">·</span>
        <time>{publishedLabel}</time>
        <span aria-hidden="true">·</span>
        <span>{readTimeLabel}</span>
      </div>

      <h2 className={`mt-3 font-semibold tracking-tight ${featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
        {title}
      </h2>
      <p className={`mt-3 leading-7 text-muted-foreground ${featured ? 'max-w-3xl text-base md:text-lg md:leading-8' : 'text-sm'}`}>
        {excerpt}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`${readLabel}: ${title}`}
      >
        {readLabel}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  )
}
