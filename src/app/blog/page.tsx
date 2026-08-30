import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { hasCompleteBlogTranslation } from '@/lib/blog'
import { BlogPostCard } from '@/components/blog/blog-post-card'

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLanguage()) === 'en'

  return {
    title: en ? 'Blog | Engineering Insights' : 'بلاگ | بینش‌های مهندسی',
    description: en
      ? 'Practical engineering notes on systems, architecture and reliability.'
      : 'یادداشت‌های عملی درباره سیستم‌ها، معماری و پایداری نرم‌افزار.',
    alternates: { canonical: en ? '/en/blog' : '/blog' },
  }
}

function formatDate(date: Date, locale: 'fa' | 'en') {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default async function BlogPage() {
  const lang = await getRequestLanguage()
  const en = lang === 'en'
  const locale = en ? 'en' : 'fa'

  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [
      { featured: 'desc' },
      { publishedAt: 'desc' },
      { updatedAt: 'desc' },
    ],
    take: 12,
  })

  const visible = posts.filter((post) => !en || hasCompleteBlogTranslation(post))
  const featured = visible.find((post) => post.featured)
  const remaining = featured
    ? visible.filter((post) => post.id !== featured.id)
    : visible

  const copy = en
    ? {
        eyebrow: 'Insights',
        title: 'Engineering notes for reliable delivery',
        description: 'Practical field notes on software architecture, production reliability, delivery systems, and the decisions behind maintainable products.',
        latest: 'Latest notes',
        empty: 'No published insights are available yet.',
      }
    : {
        eyebrow: 'بینش‌ها',
        title: 'یادداشت‌هایی برای تحویل مطمئن نرم‌افزار',
        description: 'یادداشت‌های عملی درباره معماری نرم‌افزار، پایداری Production، سیستم تحویل و تصمیم‌هایی که محصول را قابل نگهداری می‌کنند.',
        latest: 'یادداشت‌های تازه',
        empty: 'هنوز یادداشت منتشرشده‌ای وجود ندارد.',
      }

  function card(post: (typeof visible)[number], isFeatured: boolean) {
    const title = en ? (post.titleEn ?? '') : post.title
    const excerpt = en ? (post.excerptEn ?? '') : post.excerpt
    const publishedAt = post.publishedAt ?? post.createdAt

    return (
      <BlogPostCard
        key={post.id}
        title={title}
        excerpt={excerpt}
        href={`${en ? '/en' : ''}/blog/${post.slug}`}
        category={post.category}
        publishedLabel={formatDate(publishedAt, locale)}
        readTimeLabel={en ? `${post.readTime} min read` : `${post.readTime} دقیقه مطالعه`}
        featured={isFeatured}
        locale={locale}
      />
    )
  }

  return (
    <section className="container mx-auto px-4 pb-20 pt-24 md:pt-28" aria-labelledby="blog-heading">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {copy.eyebrow}
          </p>
          <h1 id="blog-heading" className="headline-tight text-4xl font-bold tracking-tight md:text-6xl">
            {copy.title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            {copy.description}
          </p>
        </header>

        {visible.length === 0 ? (
          <p role="status" className="mt-12 rounded-2xl border border-dashed p-8 text-muted-foreground">
            {copy.empty}
          </p>
        ) : (
          <div className="mt-12 space-y-12">
            {featured ? <section aria-label={en ? 'Featured insight' : 'یادداشت منتخب'}>{card(featured, true)}</section> : null}

            {remaining.length > 0 ? (
              <section aria-labelledby="latest-insights-heading">
                <h2 id="latest-insights-heading" className="text-sm font-semibold text-muted-foreground">
                  {copy.latest}
                </h2>
                <div className="mt-5 grid gap-x-8 gap-y-10 md:grid-cols-2">
                  {remaining.map((post) => card(post, false))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
