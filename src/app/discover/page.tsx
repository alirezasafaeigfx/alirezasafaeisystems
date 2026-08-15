import type { Metadata } from 'next'
import Link from 'next/link'
import { db } from '@/lib/db'
import { getRequestLanguage } from '@/lib/i18n/server'
import { getSiteUrl } from '@/lib/site-config'
import { generateBreadcrumbSchema } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'

const siteUrl = getSiteUrl()

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage()
  const isEn = lang === 'en'
  const canonicalPath = isEn ? '/en/discover' : '/discover'
  return {
    title: isEn ? 'Discover Projects and Tools' : 'Discover | پروژه‌ها و ابزارها',
    description: isEn
      ? 'A curated collection of Alireza Safaei projects, tools, and useful systems.'
      : 'مجموعه‌ای منتخب از پروژه‌ها، ابزارها و سیستم‌های کاربردی علیرضا صفایی.',
    alternates: {
      canonical: canonicalPath,
      languages: {
        'fa-IR': `${siteUrl}/discover`,
        'en-US': `${siteUrl}/en/discover`,
        'x-default': `${siteUrl}/discover`,
      },
    },
  }
}

export default async function DiscoverPage() {
  const lang = await getRequestLanguage()
  const isEn = lang === 'en'
  const canonicalPath = isEn ? '/en/discover' : '/discover'
  const projects = await db.project.findMany({
    where: { contentType: 'discover', published: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  })
  const copy = isEn
    ? {
        eyebrow: 'Personal portfolio collection',
        title: 'Discover useful systems and tools',
        description: 'Selected projects managed from the same portfolio Admin, with direct links and clear context.',
        empty: 'New Discover items will appear here after publication.',
        open: 'Open project',
        featured: 'Featured',
        home: 'Home',
      }
    : {
        eyebrow: 'مجموعهٔ شخصی پورتفولیو',
        title: 'کشف ابزارها و سیستم‌های کاربردی',
        description: 'پروژه‌های منتخب با لینک مستقیم و توضیح روشن؛ مدیریت‌شده از همان پنل سایت شخصی.',
        empty: 'پس از انتشار، آیتم‌های جدید Discover در اینجا نمایش داده می‌شوند.',
        open: 'مشاهده پروژه',
        featured: 'منتخب',
        home: 'خانه',
      }

  return (
    <main className="container mx-auto px-4 py-28 subtle-grid">
      <JsonLd data={generateBreadcrumbSchema([
        { name: copy.home, url: siteUrl },
        { name: 'Discover', url: `${siteUrl}${canonicalPath}` },
      ])} />
      <section className="mx-auto max-w-5xl space-y-8 section-surface aurora-shell p-6 md:p-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h1 className="headline-tight text-3xl font-bold md:text-5xl">{copy.title}</h1>
          <p className="max-w-3xl text-muted-foreground leading-8">{copy.description}</p>
        </header>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground" role="status">
            {copy.empty}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => {
              const tags = project.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
              return (
                <article key={project.id} className="rounded-xl border bg-card p-6 card-hover reveal-up" style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => <span key={tag} className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>)}
                    </div>
                    {project.featured && <span className="text-xs font-semibold text-primary">{copy.featured}</span>}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">{project.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{project.description}</p>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted card-hover">
                      {copy.open}
                    </a>
                  )}
                  {!project.liveUrl && project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex rounded-md border px-4 py-2 text-sm hover:bg-muted card-hover">
                      GitHub
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        )}
        <Link href={isEn ? '/en/' : '/'} className="text-sm text-muted-foreground underline underline-offset-4">{copy.home}</Link>
      </section>
    </main>
  )
}
