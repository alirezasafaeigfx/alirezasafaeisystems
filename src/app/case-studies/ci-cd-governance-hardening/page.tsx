import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import { getSiteUrl } from '@/lib/site-config'
import { generateArticleSchema, generateBreadcrumbSchema, generateProjectSchema } from '@/lib/seo'
import { getRequestLanguage } from '@/lib/i18n/server'

const siteUrl = getSiteUrl()

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage()
  return {
    title: lang === 'fa' ? 'کیس استادی: سخت‌سازی حکمرانی CI/CD' : 'Case Study: CI/CD Governance Hardening',
    description:
      lang === 'fa'
        ? 'روایت سخت‌سازی حاکمیت CI/CD؛ بازبینی مستقل شواهد عمومی هنوز در انتظار است.'
        : 'A CI/CD governance hardening narrative; independent evidence review remains pending.',
    alternates: {
      canonical: `${siteUrl}/${lang}/case-studies/ci-cd-governance-hardening`,
    },
  }
}

export default async function CiCdGovernanceHardeningPage() {
  const lang = await getRequestLanguage()
  const withLocale = (path: string) => (lang === 'fa' ? path : `/${lang}${path}`)
  const copy = {
    breadcrumbHome: lang === 'en' ? 'Home' : 'خانه',
    breadcrumbCases: lang === 'en' ? 'Case Studies' : 'مطالعات موردی',
    eyebrow: lang === 'en' ? 'Case Study' : 'مطالعه موردی',
    title: lang === 'en' ? 'CI/CD Governance Hardening' : 'سخت‌سازی حاکمیت CI/CD',
    intro:
      lang === 'en'
        ? 'Delivery quality was inconsistent due to manual exceptions and unclear ownership.'
        : 'کیفیت تحویل به خاطر استثناهای دستی و مالکیت نامشخص یکسان و قابل اتکا نبود.',
    hProblem: lang === 'en' ? 'Problem' : 'مسئله',
    pProblem:
      lang === 'en'
        ? 'Releases bypassed test gates, incident handoffs lacked structure, and postmortems were not actionable.'
        : 'انتشارها از دروازه‌های آزمون عبور می‌کردند، تحویل‌گیری رخداد ساختار نداشت، و بررسی پس از رخداد به اقدام عملی تبدیل نمی‌شد.',
    hSolution: lang === 'en' ? 'Solution' : 'راهکار',
    solutionItems:
      lang === 'en'
        ? [
            'Made lint, type-check, integration, smoke, and Lighthouse gates blocking',
            'Defined rollback drill cadence and release ownership model',
            'Standardized release report and incident evidence templates',
          ]
        : [
            'الزامی کردن بررسی کد، بررسی نوع‌ها، آزمون یکپارچه، آزمون سریع و سنجش عملکرد',
            'تعریف زمان‌بندی تمرین بازگردانی نسخه و مدل مسئولیت انتشار',
            'استانداردسازی قالب گزارش انتشار و شواهد رخداد',
          ],
    hResult: lang === 'en' ? 'Result' : 'نتیجه',
    pResult:
      lang === 'en'
        ? 'No accepted quantitative outcome is published for this case until independent evidence review remains pending.'
        : 'تا پایان بازبینی مستقل، هیچ نتیجه کمّی یا ادعای آمادگی بازگردانی نسخه برای این مورد منتشر نمی‌شود.',
    hRole: lang === 'en' ? 'Role' : 'نقش',
    pRole:
      lang === 'en'
        ? 'Pipeline governance design, standards implementation, and release enablement.'
        : 'طراحی حاکمیت خط انتشار، پیاده‌سازی استانداردها، و توانمندسازی تیم برای انتشار.',
    hStack: lang === 'en' ? 'Tech Stack' : 'تکنولوژی‌ها',
    pStack: 'GitHub Actions, Playwright, Lighthouse CI, Node.js, Nginx.',
    hProof: lang === 'en' ? 'Proof' : 'شواهد',
    pProof:
      lang === 'en'
        ? 'Public workflow records exist, but independent evidence review remains pending; they are not presented as accepted proof.'
        : 'رکوردهای عمومی گردش‌کار وجود دارند، اما بازبینی مستقل شواهد هنوز در انتظار است و این رکوردها به‌عنوان شاهد پذیرفته‌شده عرضه نمی‌شوند.',
    hLessons: lang === 'en' ? 'Lessons & Tradeoffs' : 'درس‌ها و ملاحظه‌ها',
    pLessons:
      lang === 'en'
        ? 'Stricter gates require more pre-release discipline; the effect and cost tradeoff in this case have not been independently accepted.'
        : 'دروازه‌های سخت‌گیرانه، کار پیش از انتشار را بیشتر می‌کنند؛ نسبت اثر و هزینه در این مورد هنوز به‌طور مستقل تأیید نشده است.',
    back: lang === 'en' ? 'Back to case studies' : 'بازگشت به مطالعات موردی',
    ctaAudit: lang === 'en' ? 'Request a website review' : 'درخواست بررسی سایت',
    ctaAuditDesc: lang === 'en'
      ? 'Want a similar assessment for your site? Send its address for review.'
      : 'برای بررسی مشابه، آدرس سایت خود را بفرستید.',
  }

  const pageUrl = `${siteUrl}/${lang}/case-studies/ci-cd-governance-hardening`
  const projectSchema = generateProjectSchema({
    name: 'CI/CD Governance Hardening',
    description: 'A CI/CD governance hardening narrative; independent evidence review remains pending.',
    url: lang === 'fa' ? '/case-studies/ci-cd-governance-hardening' : `/${lang}/case-studies/ci-cd-governance-hardening`,
    technologies: ['GitHub Actions', 'Playwright', 'Lighthouse CI', 'Nginx', 'Node.js'],
  })

  const articleSchema = generateArticleSchema({
    title: 'Case Study: CI/CD Governance Hardening',
    description: 'A CI/CD governance hardening narrative; independent evidence review remains pending.',
    publishDate: '2026-02-10',
    modifiedDate: '2026-02-16',
    author: 'Alireza Safaei',
  })

  return (
    <main className="container mx-auto px-4 py-28 subtle-grid">
      <JsonLd data={generateBreadcrumbSchema([
        { name: copy.breadcrumbHome, url: siteUrl },
        { name: copy.breadcrumbCases, url: `${siteUrl}/${lang}/case-studies` },
        { name: copy.title, url: pageUrl },
      ])} />
      <JsonLd data={projectSchema} />
      <JsonLd data={{ ...articleSchema, url: pageUrl }} />

      <article className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-3 section-surface aurora-shell p-6 md:p-8">
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h1 className="headline-tight text-3xl font-bold md:text-5xl">{copy.title}</h1>
          <p className="text-muted-foreground leading-8">{copy.intro}</p>
        </header>

        <section className="rounded-xl border bg-card p-6 space-y-2 card-hover">
          <h2 className="text-xl font-semibold">{copy.hProblem}</h2>
          <p className="text-sm text-muted-foreground">{copy.pProblem}</p>
        </section>

        <section className="rounded-xl border bg-card p-6 space-y-2 card-hover">
          <h2 className="text-xl font-semibold">{copy.hSolution}</h2>
          <ul className="list-disc ps-5 text-sm text-muted-foreground space-y-1">
            {copy.solutionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border bg-card p-6 space-y-2 card-hover">
          <h2 className="text-xl font-semibold">{copy.hResult}</h2>
          <p className="text-sm text-muted-foreground">{copy.pResult}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 space-y-2 card-hover">
            <h3 className="font-semibold">{copy.hRole}</h3>
            <p className="text-sm text-muted-foreground">{copy.pRole}</p>
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-2 card-hover">
            <h3 className="font-semibold">{copy.hStack}</h3>
            <p className="text-sm text-muted-foreground">{copy.pStack}</p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-6 space-y-2 card-hover">
          <h2 className="text-xl font-semibold">{copy.hProof}</h2>
          <p className="text-sm text-muted-foreground">{copy.pProof}</p>
        </section>

        <section className="rounded-xl border bg-card p-6 space-y-2 card-hover">
          <h2 className="text-xl font-semibold">{copy.hLessons}</h2>
          <p className="text-sm text-muted-foreground">{copy.pLessons}</p>
        </section>

        <section className="rounded-xl border bg-card p-6 space-y-3 card-hover text-center">
          <h2 className="text-xl font-semibold">{copy.ctaAudit}</h2>
          <p className="text-sm text-muted-foreground">{copy.ctaAuditDesc}</p>
          <a
            href="https://audit.alirezasafaeisystems.ir/audit?utm_source=portfolio&utm_medium=case_study&utm_campaign=asdev_audit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {copy.ctaAudit}
          </a>
        </section>

        <footer>
          <Link href={withLocale('/case-studies')} className="underline text-sm text-muted-foreground">{copy.back}</Link>
        </footer>
      </article>
    </main>
  )
}
