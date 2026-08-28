import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { hasCompleteBlogTranslation } from '@/lib/blog'
import { BlogMarkdown } from '@/lib/blog-markdown'
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { getSiteUrl } from '@/lib/site-config'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getRequestLanguage(); const en = lang === 'en'; const post = await db.blogPost.findUnique({ where: { slug: (await params).slug } })
  if (!post?.published || (en && !hasCompleteBlogTranslation(post))) return {}
  return { title: en ? post.titleEn : post.title, description: en ? post.excerptEn : post.excerpt, alternates: { canonical: `${en ? '/en' : ''}/blog/${post.slug}`, languages: { 'fa-IR': `${getSiteUrl()}/blog/${post.slug}`, ...(hasCompleteBlogTranslation(post) ? { 'en-US': `${getSiteUrl()}/en/blog/${post.slug}` } : {}) } } }
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getRequestLanguage(); const en = lang === 'en'; const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug } })
  if (!post?.published || (en && !hasCompleteBlogTranslation(post))) notFound()
  const title = en ? (post.titleEn ?? '') : post.title; const excerpt = en ? (post.excerptEn ?? '') : post.excerpt; const content = en ? (post.contentEn ?? '') : post.content
  const url = `${en ? '/en' : ''}/blog/${post.slug}`
  return <section className="container mx-auto max-w-4xl px-4 py-28" aria-labelledby="blog-heading"><JsonLd data={generateBreadcrumbSchema([{ name: en ? 'Home' : 'خانه', url: getSiteUrl() }, { name: 'Blog', url: `${getSiteUrl()}${en ? '/en' : ''}/blog` }, { name: title, url: `${getSiteUrl()}${url}` }])} /><JsonLd data={generateBlogPostSchema({ title, description: excerpt, url, author: 'Alireza Safaei', publishDate: (post.publishedAt ?? post.createdAt).toISOString(), modifiedDate: post.updatedAt.toISOString(), readTime: post.readTime, language: en ? 'en-US' : 'fa-IR' })} /><article><p className="text-sm text-muted-foreground">{post.category}</p><h1 id="blog-heading" className="mt-3 text-4xl font-bold">{title}</h1><p className="mt-4 text-lg text-muted-foreground">{excerpt}</p><div className="mt-10"><BlogMarkdown content={content} locale={lang} /></div></article></section>
}
