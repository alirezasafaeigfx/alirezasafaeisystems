import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { hasCompleteBlogTranslation } from '@/lib/blog'

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getRequestLanguage()) === 'en'
  return { title: en ? 'Blog | Engineering Insights' : 'بلاگ | بینش‌های مهندسی', description: en ? 'Practical engineering notes on systems, architecture and reliability.' : 'یادداشت‌های عملی درباره سیستم‌ها، معماری و پایداری نرم‌افزار.', alternates: { canonical: en ? '/en/blog' : '/blog' } }
}

export default async function BlogPage() {
  const lang = await getRequestLanguage(); const en = lang === 'en'
  const posts = await db.blogPost.findMany({ where: { published: true }, orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { updatedAt: 'desc' }], take: 12 })
  const visible = posts.filter((post) => !en || hasCompleteBlogTranslation(post))
  return <main className="container mx-auto px-4 py-28"><header className="mx-auto max-w-3xl space-y-4"><p className="text-sm font-semibold text-primary">{en ? 'Insights' : 'بینش‌ها'}</p><h1 className="text-4xl font-bold">{en ? 'Engineering notes for reliable delivery' : 'یادداشت‌هایی برای تحویل مطمئن نرم‌افزار'}</h1></header><div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">{visible.map((post) => <article key={post.id} className="rounded-xl border bg-card p-6"><h2 className="text-2xl font-semibold"><Link href={`${en ? '/en' : ''}/blog/${post.slug}`} className="hover:underline">{en ? post.titleEn : post.title}</Link></h2><p className="mt-3 text-muted-foreground">{en ? post.excerptEn : post.excerpt}</p></article>)}</div></main>
}
