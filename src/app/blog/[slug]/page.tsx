import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { hasCompleteBlogTranslation } from '@/lib/blog'
import { BlogMarkdown } from '@/lib/blog-markdown'
import { BlogArticleShell } from '@/components/blog/blog-article-shell'
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { getSiteUrl } from '@/lib/site-config'
import { brand } from '@/lib/brand'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getRequestLanguage()
  const en = lang === 'en'
  const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug } })

  if (!post?.published || (en && !hasCompleteBlogTranslation(post))) return {}

  return {
    title: en ? post.titleEn : post.title,
    description: en ? post.excerptEn : post.excerpt,
    alternates: {
      canonical: `${en ? '/en' : ''}/blog/${post.slug}`,
      languages: {
        'fa-IR': `${getSiteUrl()}/blog/${post.slug}`,
        ...(hasCompleteBlogTranslation(post)
          ? { 'en-US': `${getSiteUrl()}/en/blog/${post.slug}` }
          : {}),
      },
    },
  }
}

function formatDate(date: Date, locale: 'fa' | 'en') {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getRequestLanguage()
  const en = lang === 'en'
  const locale = en ? 'en' : 'fa'
  const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug } })

  if (!post?.published || (en && !hasCompleteBlogTranslation(post))) notFound()

  const title = en ? (post.titleEn ?? '') : post.title
  const excerpt = en ? (post.excerptEn ?? '') : post.excerpt
  const content = en ? (post.contentEn ?? '') : post.content
  const url = `${en ? '/en' : ''}/blog/${post.slug}`
  const blogPath = `${en ? '/en' : ''}/blog`
  const publishedAt = post.publishedAt ?? post.createdAt

  const relatedRecords = await db.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      slug: { not: post.slug },
    },
    orderBy: [
      { featured: 'desc' },
      { publishedAt: 'desc' },
      { updatedAt: 'desc' },
    ],
    take: 4,
  })

  const related = relatedRecords
    .filter((item) => !en || hasCompleteBlogTranslation(item))
    .slice(0, 2)
    .map((item) => ({
      title: en ? (item.titleEn ?? '') : item.title,
      href: `${blogPath}/${item.slug}`,
    }))

  return (
    <section className="container mx-auto px-4 pb-20 pt-24 md:pt-28">
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: en ? 'Home' : 'خانه', url: getSiteUrl() },
          { name: 'Blog', url: `${getSiteUrl()}${blogPath}` },
          { name: title, url: `${getSiteUrl()}${url}` },
        ])}
      />
      <JsonLd
        data={generateBlogPostSchema({
          title,
          description: excerpt,
          url,
          author: brand.ownerName,
          publishDate: publishedAt.toISOString(),
          modifiedDate: post.updatedAt.toISOString(),
          readTime: post.readTime,
          language: en ? 'en-US' : 'fa-IR',
        })}
      />

      <BlogArticleShell
        title={title}
        excerpt={excerpt}
        category={post.category}
        publishedLabel={formatDate(publishedAt, locale)}
        readTimeLabel={en ? `${post.readTime} min read` : `${post.readTime} دقیقه مطالعه`}
        author={brand.ownerName}
        backHref={blogPath}
        backLabel={en ? 'Back to insights' : 'بازگشت به یادداشت‌ها'}
        locale={locale}
        related={related}
      >
        <BlogMarkdown content={content} locale={locale} />
      </BlogArticleShell>
    </section>
  )
}
