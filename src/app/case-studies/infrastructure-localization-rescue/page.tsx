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
        : 'A documented infrastructure-localization approach with its public evidence review still pending.',
    alternates: {
      canonical: `${siteUrl}/${lang}/case-studies/infrastructure-localization-rescue`,
    },
  }
}

function getEvidence(lang: 'fa' | 'en'): EvidenceRecord[] {
  return lang === 'en'
    ? [
        { id: 'ilr-release-path', label: 'Documented release path', value: 'Health, build and public verification steps are recorded', source: 'Public release workflow and verification record', sourceUrl: 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/actions/runs/33332174608', period: 'Public workflow review on 2026-08-30', method: 'Workflow summary and verification markers', verificationDate: '2026-08-30', reviewState: 'draft' },
      ]
    : [
        { id: 'ilr-release-path', label: 'مسیر انتشار مستند', value: 'مراحل سلامت، ساخت و راستی‌آزمایی عمومی ثبت شده‌اند', source: 'گردش‌کار عمومی انتشار و رکورد راستی‌آزمایی', sourceUrl: 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/actions/runs/33332174608', period: 'بررسی گردش‌کار عمومی در ۲۰۲۶-۰۸-۳۰', method: 'بررسی خلاصه گردش‌کار و نشانگرهای راستی‌آزمایی', verificationDate: '2026-08-30', reviewState: 'draft' },
      ]
}

export default async function InfrastructureLocalizationRescueCaseStudyPage() {
  const lang = await getRequestLanguage()
  const withLocale = (path: string) => (lang === 'fa' ? path : `/${lang}${path}`)
  const evidence = getEvidence(lang)
  const publishableEvidence = evidence.filter(isPublishableEvidence)
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
        : 'مسیر اصلی تحویل به سرویس‌های بیرونی شکننده و تصمیم‌های استقرار بدون روال یکسان وابسته بود. رخدادها به دلیل مشاهده‌پذیری ضعیف و مسئولیت نامشخص بازگردانی نسخه دیر کنترل می‌شدند.',
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
            'نقشه ریسک وابستگی‌ها و بررسی گستره اثر خرابی',
            'معماری بومی با مسیر جایگزین کنترل‌شده',
            'دروازه‌های حاکمیت انتشار و اجرای چک‌لیست تحویل',
          ],
    hOutcomes: lang === 'en' ? 'Measured Outcomes' : 'خروجی‌های قابل اندازه‌گیری',
    hRole: lang === 'en' ? 'Role' : 'نقش',
    pRole:
      lang === 'en'
        ? 'Infrastructure and release governance lead, responsible for risk prioritization, architecture redesign, and deployment guardrails.'
        : 'مسئول حاکمیت زیرساخت و انتشار: اولویت‌بندی ریسک، بازطراحی معماری، و کنترل‌های حفاظتی استقرار.',
    hStack: lang === 'en' ? 'Tech Stack' : 'تکنولوژی‌ها',
    pStack: 'Next.js, TypeScript, Prisma, Nginx, PM2, Playwright, Lighthouse CI.',
    hProof: lang === 'en' ? 'Proof' : 'شواهد',
    pProof:
      lang === 'en'
        ? 'A public release-path record exists for this narrative, but no report or outcome is presented as accepted evidence before independent review.'
        : 'برای این روایت، یک رکورد عمومی از مسیر انتشار وجود دارد؛ اما پیش از بازبینی مستقل، هیچ گزارش یا نتیجه‌ای به‌عنوان شاهد پذیرفته‌شده عرضه نمی‌شود.',
    hLessons: lang === 'en' ? 'Lessons & Tradeoffs' : 'درس‌ها و ملاحظه‌ها',
    pLessons:
      lang === 'en'
        ? 'Local-first resilience requires tighter operational discipline and explicit ownership; the effect in this case has not been independently accepted.'
        : 'تاب‌آوری مبتنی بر زیرساخت بومی به نظم عملیاتی سخت‌گیرانه‌تر و مسئولیت‌پذیری روشن‌تر نیاز دارد؛ میزان اثر آن در این مورد هنوز به‌طور مستقل تأیید نشده است.',
    back: lang === 'en' ? 'Back to case studies' : 'بازگشت به مطالعات موردی',
    ctaAudit: lang === 'en' ? 'Request a website review' : 'درخواست بررسی سایت',
    ctaAuditDesc: lang === 'en'
      ? 'Want a similar assessment for your site? Send its address for review.'
      : 'برای بررسی مشابه، آدرس سایت خود را بفرستید.',
  }

  const pageUrl = `${siteUrl}/${lang}/case-studies/infrastructure-localization-rescue`
  const projectSchema = generateProjectSchema({
    name: 'Infrastructure Localization Rescue',
    description: 'A documented approach to a high-risk deployment stack under localization constraints; evidence review pending.',
    url: lang === 'fa' ? '/case-studies/infrastructure-localization-rescue' : `/${lang}/case-studies/infrastructure-localization-rescue`,
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Nginx', 'PM2'],
  })
  const articleSchema = generateArticleSchema({
    title: 'Case Study: Infrastructure Localization Rescue',
    description: 'A documented infrastructure-localization approach with its public evidence review still pending.',
    publishDate: '2026-02-14',
    modifiedDate: '2026-02-16',
    author: 'Alireza Safaei',
  })

  return (
    <div className="container mx-auto px-4 py-28 subtle-grid">
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
              : ['سرویس‌های بیرونی روی مسیر حیاتی تحویل قرار داشتند.', 'تصمیم‌های استقرار روال یکسانی نداشتند.', 'مسئولیت بازگردانی نسخه و مشاهده‌پذیری روشن نبود.']
            ).map((item, index) => <li key={item} className="rounded-lg border p-4"><span className="font-bold text-primary">0{index + 1}</span><p className="mt-2">{item}</p></li>)}
          </ol>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hDiagnosis}</h2>
          <p className="text-sm leading-7 text-muted-foreground">{lang === 'en' ? 'The failure surface was a chain: external resolution, release transport, runtime startup, and public verification were not separated into observable gates.' : 'سطح خرابی یک زنجیره بود: حل نام بیرونی، انتقال انتشار، راه‌اندازی برنامه و راستی‌آزمایی عمومی به دروازه‌های قابل مشاهده جدا نشده بودند.'}</p>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hIntervention}</h2>
          <ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-muted-foreground">
            {(lang === 'en' ? ['Map dependency and blast radius.', 'Separate same-host smoke from public DNS verification.', 'Make immutable identity, health, evidence, and rollback explicit.'] : ['نقشه وابستگی و گستره اثر خرابی تهیه شد.', 'آزمون سریع روی همان میزبان از راستی‌آزمایی عمومی نام دامنه جدا شد.', 'شناسه تغییرناپذیر نسخه، سلامت، شواهد و بازگردانی نسخه صریح شدند.']).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hAfter}</h2>
          <div className="grid gap-3 text-sm md:grid-cols-4">
            {(lang === 'en' ? ['Candidate SHA', 'Build + Prisma', 'Internal health', 'Public verification'] : ['شناسه نسخه کاندید', 'ساخت و آماده‌سازی پایگاه‌داده', 'سلامت داخلی', 'راستی‌آزمایی عمومی']).map((item, index) => <div key={item} className="rounded-lg border p-4"><span className="font-bold text-primary">0{index + 1}</span><p className="mt-2 font-semibold">{item}</p></div>)}
          </div>
        </section>

        <section className="space-y-3 rounded-xl border bg-card p-6 card-hover">
          <h2 className="text-xl font-semibold">{copy.hOutcomes}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {publishableEvidence.map((item) => (
              <div key={item.id} className="rounded-lg border p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-2 text-lg font-bold text-primary">{item.value}</p>
                <details className="mt-3 text-xs leading-6 text-muted-foreground"><summary className="cursor-pointer font-semibold text-foreground">{lang === 'en' ? 'Provenance' : 'منشأ شواهد'}</summary><p className="mt-2">{item.source} · {item.period} · {item.method} · {item.verificationDate}</p></details>
              </div>
            ))}
            {publishableEvidence.length === 0 ? (
              <p className="md:col-span-2 rounded-lg border border-dashed p-4 text-sm leading-7 text-muted-foreground" role="status">
                {lang === 'en' ? 'No outcome evidence is published until independent review is complete.' : 'تا پایان بازبینی مستقل، نتیجه‌ای به‌عنوان دستاورد منتشر نمی‌شود.'}
              </p>
            ) : null}
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
          <p className="text-sm leading-7 text-muted-foreground">{lang === 'en' ? 'Acceptance would require an immutable candidate identity, build and type checks, internal readiness, same-host smoke, and two consecutive public browser passes; independent acceptance is still pending.' : 'معیار پذیرش این مسیر شامل شناسه تغییرناپذیر نسخه کاندید، ساخت و بررسی نوع‌ها، آمادگی داخلی، آزمون سریع روی همان میزبان و دو بررسی پیاپی مرورگر عمومی است؛ تأیید مستقل آن هنوز در انتظار است.'}</p>
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
    </div>
  )
}
