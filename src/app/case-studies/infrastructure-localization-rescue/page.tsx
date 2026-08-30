import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/seo/json-ld'
import { getSiteUrl } from '@/lib/site-config'
import { generateArticleSchema, generateBreadcrumbSchema, generateProjectSchema } from '@/lib/seo'
import { getRequestLanguage } from '@/lib/i18n/server'
import { type EvidenceRecord, isPublishableEvidence } from '@/lib/evidence'

const siteUrl = getSiteUrl()

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLanguage()
  return {
    title: lang === 'fa' ? 'کیس استادی: نجات بومی‌سازی زیرساخت' : 'Case Study: Infrastructure Localization Rescue',
    description:
      lang === 'fa'
        ? 'چگونه یک استک استقرار پرریسک با معماری بومی و دروازه‌های حکمرانی پایدار شد.'
        : 'How a high-risk deployment stack was stabilized with local-first architecture and governance gates.',
    alternates: {
      canonical: `${siteUrl}/${lang}/case-studies/infrastructure-localization-rescue`,
    },
  }
}

function getEvidence(lang: 'fa' | 'en'): EvidenceRecord[] {
  return lang === 'en'
    ? [
        { id: 'ilr-mttr', label: 'Mean incident recovery time', value: '180m → 55m', source: 'Accepted infrastructure rescue evidence record', period: 'Six-week intervention window', method: 'Incident trend comparison before and after the release-governance intervention', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'ilr-rollback', label: 'Emergency rollback events', value: '0 in the final 21-day window', source: 'Accepted infrastructure rescue evidence record', period: 'Final 21 days after intervention', method: 'Release log and rollback-drill review', verificationDate: '2026-08-30', reviewState: 'accepted' },
      ]
    : [
        { id: 'ilr-mttr', label: 'میانگین زمان بازیابی رخداد', value: '۱۸۰ دقیقه → ۵۵ دقیقه', source: 'رکورد پذیرفته‌شده شواهد نجات زیرساخت', period: 'پنجره شش‌هفته‌ای مداخله', method: 'مقایسه روند رخدادها پیش و پس از مداخله حاکمیت انتشار', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'ilr-rollback', label: 'رخدادهای rollback اضطراری', value: 'صفر در پنجره نهایی ۲۱ روزه', source: 'رکورد پذیرفته‌شده شواهد نجات زیرساخت', period: '۲۱ روز نهایی پس از مداخله', method: 'بررسی لاگ انتشار و تمرین rollback', verificationDate: '2026-08-30', reviewState: 'accepted' },
      ]
}

export default async function InfrastructureLocalizationRescueCaseStudyPage() {
  const lang = await getRequestLanguage()
  const withLocale = (path: string) => (lang === 'fa' ? path : `/${lang}${path}`)
  const evidence = getEvidence(lang)
  const copy = {
    breadcrumbHome: lang === 'en' ? 'Home' : 'خانه',
    breadcrumbCases: lang === 'en' ? 'Case Studies' : 'مطالعات موردی',
    eyebrow: lang === 'en' ? 'Case Study' : 'مطالعه موردی',
    title: lang === 'en' ? 'Infrastructure Localization Rescue' : 'نجات بومی‌سازی زیرساخت',
    context:
      lang === 'en'
        ? 'Context: sanctions exposure, fragile delivery flow, and limited operational observability.'
        : 'زمینه: ریسک تحریم، مسیر تحویل شکننده، و مشاهده‌پذیری محدود.',
    hProblem: lang === 'en' ? 'Problem' : 'مسئله',
    pProblem:
      lang === 'en'
        ? 'Core delivery depended on fragile external services and ad-hoc deployment decisions. Incidents escalated slowly due to weak observability and unclear rollback ownership.'
        : 'مسیر اصلی تحویل به سرویس‌های بیرونی شکننده و تصمیم‌های استقرار ad-hoc وابسته بود. رخدادها به دلیل مشاهده‌پذیری ضعیف و مالکیت نامشخص rollback دیر کنترل می‌شدند.',
    hSolution: lang === 'en' ? 'Solution' : 'راهکار',
    hBefore: lang === 'en' ? 'Architecture Before' : 'معماری قبل',
    hDiagnosis: lang === 'en' ? 'Diagnosis' : 'تشخیص',
    hIntervention: lang === 'en' ? 'Intervention' : 'مداخله',
    hAfter: lang === 'en' ? 'Architecture After' : 'معماری بعد',
    hEvidence: lang === 'en' ? 'Evidence' : 'شواهد',
    hVerification: lang === 'en' ? 'Verification' : 'راستی‌آزمایی',
    solutionItems:
      lang === 'en'
        ? [
            'Dependency risk map and blast-radius review',
            'Localization-first architecture with controlled fallback paths',
            'Release governance gates and handover checklist rollout',
          ]
        : [
            'نقشه ریسک وابستگی‌ها و بررسی blast radius',
            'معماری localization-first با مسیرهای fallback کنترل‌شده',
            'گیت‌های حاکمیت انتشار و rollout چک‌لیست تحویل/تحویل‌گیری',
          ],
    hOutcomes: lang === 'en' ? 'Measured Outcomes' : 'خروجی‌های قابل اندازه‌گیری',
    hRole: lang === 'en' ? 'Role' : 'نقش',
    pRole:
      lang === 'en'
        ? 'Infrastructure and release governance lead, responsible for risk prioritization, architecture redesign, and deployment guardrails.'
        : 'مسئول حاکمیت زیرساخت و انتشار: اولویت‌بندی ریسک، بازطراحی معماری، و گاردریل‌های استقرار.',
    hStack: lang === 'en' ? 'Tech Stack' : 'تکنولوژی‌ها',
    pStack: 'Next.js, TypeScript, Prisma, Nginx, PM2, Playwright, Lighthouse CI.',
    hProof: lang === 'en' ? 'Proof' : 'شواهد',
    pProof:
      lang === 'en'
        ? 'Weekly incident trend snapshots, release evidence logs, and governance checklist completion records were delivered to stakeholders.'
        : 'اسنپ‌شات‌های روند رخداد، لاگ‌های شواهد انتشار، و وضعیت تکمیل چک‌لیست حاکمیت به صورت هفتگی ارائه شد.',
    hLessons: lang === 'en' ? 'Lessons & Tradeoffs' : 'درس‌ها و tradeoffها',
    pLessons:
      lang === 'en'
        ? 'Local-first resilience required tighter operational discipline and more explicit ownership, but dramatically reduced outage exposure and release anxiety.'
        : 'تاب‌آوری local-first نیاز به نظم عملیاتی سخت‌گیرانه‌تر و مالکیت صریح‌تر داشت، اما ریسک قطعی و استرس انتشار را به شکل چشمگیر کاهش داد.',
    back: lang === 'en' ? 'Back to case studies' : 'بازگشت به مطالعات موردی',
    ctaAudit: lang === 'en' ? 'Start Free Audit' : 'شروع Audit رایگان',
    ctaAuditDesc: lang === 'en'
      ? 'Want a similar assessment for your site? Start with a free audit.'
      : 'ارزیابی مشابهی برای سایت خود می‌خواهید؟ با یک Audit رایگان شروع کنید.',
  }

  const pageUrl = `${siteUrl}/${lang}/case-studies/infrastructure-localization-rescue`
  const projectSchema = generateProjectSchema({
    name: 'Infrastructure Localization Rescue',
    description: 'Stabilization of a high-risk deployment stack under localization constraints.',
    url: lang === 'fa' ? '/case-studies/infrastructure-localization-rescue' : `/${lang}/case-studies/infrastructure-localization-rescue`,
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Nginx', 'PM2'],
  })
  const articleSchema = generateArticleSchema({
    title: 'Case Study: Infrastructure Localization Rescue',
    description: 'How a high-risk deployment stack was stabilized with local-first architecture and governance gates.',
    publishDate: '2026-02-14',
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
      <article className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3 section-surface aurora-shell p-6 md:p-8">
          <p className="text-sm font-semibold text-primary">{copy.eyebrow}</p>
          <h1 className="headline-tight text-3xl font-bold md:text-5xl">{copy.title}</h1>
          <p className="text-muted-foreground leading-8">{copy.context}</p>
        </header>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hProblem}</h2>
          <p className="text-sm text-muted-foreground">{copy.pProblem}</p>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hSolution}</h2>
          <ul className="list-disc space-y-1 ps-5 text-sm text-muted-foreground">
            {copy.solutionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hBefore}</h2>
          <ol className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            {(lang === 'en'
              ? ['External services sat on the critical delivery path.', 'Deployment decisions were ad hoc.', 'Rollback ownership and observability were unclear.']
              : ['سرویس‌های بیرونی روی مسیر حیاتی تحویل قرار داشتند.', 'تصمیم‌های استقرار ad-hoc بودند.', 'مالکیت rollback و مشاهده‌پذیری روشن نبود.']
            ).map((item, index) => <li key={item} className="rounded-lg border p-4"><span className="font-bold text-primary">0{index + 1}</span><p className="mt-2">{item}</p></li>)}
          </ol>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hDiagnosis}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{lang === 'en' ? 'The failure surface was a chain: external resolution, release transport, runtime startup, and public verification were not separated into observable gates.' : 'سطح خرابی یک زنجیره بود: resolve بیرونی، انتقال انتشار، راه‌اندازی runtime و راستی‌آزمایی عمومی به گیت‌های قابل مشاهده جدا نشده بودند.'}</p>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hIntervention}</h2>
          <ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-muted-foreground">
            {(lang === 'en' ? ['Map dependency and blast radius.', 'Separate same-host smoke from public DNS verification.', 'Make immutable identity, health, evidence, and rollback explicit.'] : ['نقشه وابستگی و blast radius تهیه شد.', 'Smoke هم‌میزبان از راستی‌آزمایی DNS عمومی جدا شد.', 'هویت immutable، health، شواهد و rollback صریح شدند.']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hAfter}</h2>
          <div className="grid gap-3 text-sm md:grid-cols-4">
            {(lang === 'en' ? ['Candidate SHA', 'Build + Prisma', 'Internal health', 'Public verification'] : ['SHA کاندید', 'Build + Prisma', 'سلامت داخلی', 'راستی‌آزمایی عمومی']).map((item, index) => <div key={item} className="rounded-lg border p-4"><span className="font-bold text-primary">0{index + 1}</span><p className="mt-2 font-semibold">{item}</p></div>)}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hOutcomes}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {evidence.filter(isPublishableEvidence).map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-primary">{item.value}</p>
                <details className="mt-3 text-xs leading-6 text-muted-foreground"><summary className="cursor-pointer font-semibold text-foreground">{lang === 'en' ? 'Provenance' : 'منشأ شواهد'}</summary><p className="mt-2">{item.source} · {item.period} · {item.method} · {item.verificationDate}</p></details>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-xl border bg-card p-6 card-hover">
            <h2 className="text-xl font-semibold">{copy.hRole}</h2>
            <p className="text-sm text-muted-foreground">{copy.pRole}</p>
          </div>
          <div className="space-y-3 rounded-xl border bg-card p-6 card-hover">
            <h2 className="text-xl font-semibold">{copy.hStack}</h2>
            <p className="text-sm text-muted-foreground">{copy.pStack}</p>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hProof}</h2>
          <p className="text-sm text-muted-foreground">{copy.pProof}</p>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hVerification}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{lang === 'en' ? 'The accepted path is verified by immutable candidate identity, build and type checks, internal readiness, same-host smoke, and two consecutive public browser passes.' : 'مسیر پذیرفته‌شده با هویت immutable کاندید، build و type-check، آمادگی داخلی، smoke هم‌میزبان و دو pass متوالی مرورگر عمومی راستی‌آزمایی شد.'}</p>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
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

        <footer className="text-sm text-muted-foreground">
          <Link href={withLocale('/case-studies')} className="underline">
            {copy.back}
          </Link>
        </footer>
      </article>
    </main>
  )
}
