import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { hasCompleteBlogTranslation } from '@/lib/blog'
import { BlogMarkdown } from '@/lib/blog-markdown'

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const lang = await getRequestLanguage(); const en = lang === 'en'; const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug } })
  if (!post?.published || (en && !hasCompleteBlogTranslation(post))) notFound()
  const title = en ? (post.titleEn ?? '') : post.title; const excerpt = en ? (post.excerptEn ?? '') : post.excerpt; const content = en ? (post.contentEn ?? '') : post.content
  return <main className="container mx-auto max-w-4xl px-4 py-28"><article><p className="text-sm text-muted-foreground">{post.category}</p><h1 className="mt-3 text-4xl font-bold">{title}</h1><p className="mt-4 text-lg text-muted-foreground">{excerpt}</p><div className="mt-10"><BlogMarkdown content={content} locale={lang} /></div></article></main>
}
