import type { Language } from '@/lib/i18n/translations'
import type { EvidenceRecord } from '@/lib/evidence'

type HomeLink = {
  label: string
  href: string
}

type HomeCard = HomeLink & {
  title: string
  description: string
}

type ProjectCard = HomeCard & {
  role: string
  technologies: string[]
  imageSrc?: string
  imageAlt?: string
}

export type HomeContent = {
  hero: {
    name: string
    title: string
    description: string
    detail: string
    primaryCta: string
    secondaryCta: string
  }
  services: HomeCard[]
  projects: ProjectCard[]
  proof: {
    title: string
    description: string
    items: EvidenceRecord[]
  }
  principles: string[]
  about: {
    title: string
    description: string
  }
  contact: {
    title: string
    description: string
    cta: string
  }
}

const content: Record<Language, HomeContent> = {
  fa: {
    hero: {
      name: 'مهندسی تحریریه + رابط عملیاتی',
      title: 'سیستم‌های عملیاتی را قابل دیدن می‌کنم',
      description: 'برای محصول‌ها و تیم‌هایی که باید در Production قابل اتکا بمانند، معماری، اجرا و مسیر انتشار را به یک سیستم قابل بررسی تبدیل می‌کنم.',
      detail: 'از تشخیص مسئله و محدودیت واقعی تا Audit، پایدارسازی و تحویل؛ هر تصمیم با زمینه، شواهد و مسیر ادامه‌دادن ثبت می‌شود.',
      primaryCta: 'درخواست ارزیابی Audit',
      secondaryCta: 'مشاهده پروژه‌ها',
    },
    services: [
      {
        title: 'توسعه محصول و سیستم وب',
        description: 'طراحی و توسعه سیستم‌ها و محصولات وب با معماری قابل نگهداری و مقیاس‌پذیر.',
        label: 'مشاهده خدمات',
        href: '/services',
      },
      {
        title: 'پایدارسازی و بهینه‌سازی',
        description: 'بهبود سرعت، reliability، کیفیت فنی و آمادگی واقعی برای production.',
        label: 'مشاهده خدمات',
        href: '/services/infrastructure-localization',
      },
      {
        title: 'نجات پروژه‌های نیمه‌کاره',
        description: 'تحلیل، بازطراحی و تکمیل پروژه‌هایی که متوقف، ناپایدار یا دشوار برای ادامه شده‌اند.',
        label: 'شروع گفتگو',
        href: '/qualification',
      },
    ],
    projects: [
      {
        title: 'پلتفرم PersianToolbox',
        description: 'پلتفرم ابزارهای فارسی local-first با تجربه کاربری ساده و عملیات انتشار پایدار.',
        role: 'معماری، طراحی سیستم Frontend و آمادگی استقرار عملیاتی',
        technologies: ['Next.js', 'TypeScript'],
        imageSrc: '/images/portfolio/persiantoolbox-showcase.png',
        imageAlt: 'اسکرین‌شات صفحه اصلی PersianToolbox',
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies/asdev-persiantoolbox-platform',
      },
      {
        title: 'نجات بومی‌سازی زیرساخت',
        description: 'مطالعه موردی یک مسیر استقرار و حاکمیت که برای محدودیت‌های local-first و ریسک‌های عملیاتی بازطراحی شد.',
        role: 'حاکمیت زیرساخت، بازطراحی انتشار و تقویت مسیر rollback',
        technologies: ['Next.js', 'TypeScript', 'Nginx'],
        imageSrc: '/images/portfolio/infrastructure-localization-rescue.png',
        imageAlt: 'اسکرین‌شات مطالعه موردی نجات بومی‌سازی زیرساخت',
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies/infrastructure-localization-rescue',
      },
      {
        title: 'پلتفرم Audit Systems',
        description: 'گردش‌کار ارزیابی سایت برای عملکرد، امنیت و سئو فنی با خروجی عملی و قابل اجرا.',
        role: 'طراحی و راه‌اندازی محصول ارزیابی فنی',
        technologies: ['Next.js', 'Prisma'],
        imageSrc: '/images/portfolio/audit-systems-home.png',
        imageAlt: 'اسکرین‌شات صفحه اصلی Audit Systems',
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies',
      },
    ],
    proof: {
      title: 'شواهد به‌جای ادعا',
      description: 'هر همکاری با زمینه مسئله، تصمیم‌های فنی و خروجی قابل بررسی توضیح داده می‌شود.',
      items: [
        { id: 'persiantoolbox-case-study', label: 'PersianToolbox', value: 'مطالعه موردی قابل بررسی', source: 'ASDEV Systems case-study page', period: 'Published reference', method: 'Public route and implementation review', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'infrastructure-rescue-case-study', label: 'Infrastructure Localization Rescue', value: 'مسیر انتشار قابل بررسی', source: 'ASDEV Systems flagship case study', period: 'Published reference', method: 'Case-study narrative and deployment evidence review', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'audit-systems-product', label: 'Audit Systems', value: 'گردش‌کار ارزیابی قابل بررسی', source: 'ASDEV Systems product case-study page', period: 'Published reference', method: 'Public route and product-surface review', verificationDate: '2026-08-30', reviewState: 'accepted' },
      ],
    },
    principles: [
      'اول مسئله و محدودیت واقعی را روشن می‌کنم، بعد تکنولوژی و معماری را انتخاب می‌کنم.',
      'کیفیت، قابلیت نگهداری و مسیر انتشار را از ابتدای توسعه جزئی از محصول می‌بینم.',
      'تحویل برای من یعنی سیستم قابل بررسی، مستند و قابل ادامه؛ نه صرفاً کدی که یک‌بار اجرا شده است.',
    ],
    about: {
      title: 'درباره من',
      description: 'من علیرضا صفایی‌ام؛ مهندس نرم‌افزار و سازنده سیستم‌های وب. بیشتر از اضافه‌کردن تکنولوژی، به کم‌کردن ابهام، انتخاب معماری درست و رساندن محصول به وضعیتی فکر می‌کنم که تیم بتواند با اطمینان آن را ادامه دهد.',
    },
    contact: {
      title: 'برای همکاری آماده‌اید؟',
      description: 'اگر مسئله، محصول یا پروژه‌ای دارید که به مسیر فنی روشن نیاز دارد، از اینجا شروع کنیم.',
      cta: 'شروع همکاری',
    },
  },
  en: {
    hero: {
      name: 'Engineering Editorial + Operational Interface',
      title: 'Operational systems made visible',
      description: 'I turn architecture, execution, and release paths into reviewable systems for products and teams that must remain dependable in production.',
      detail: 'From the real constraint through Audit, stabilization, and handoff, every decision is tied to context, evidence, and a safe next step.',
      primaryCta: 'Request an ASDEV Audit',
      secondaryCta: 'View projects',
    },
    services: [
      {
        title: 'Software Architecture & System Design',
        description: 'Architecture decisions, service boundaries, and delivery constraints aligned with business goals.',
        label: 'View services',
        href: '/services',
      },
      {
        title: 'End-to-End Build & Production Readiness',
        description: 'From concept to production release with quality gates, observability, and rollback safety.',
        label: 'View services',
        href: '/services/infrastructure-localization',
      },
      {
        title: 'Project Rescue & Dependency Stabilization',
        description: 'Recover stalled projects, reduce dependency risk, and harden runtime reliability.',
        label: 'Start a conversation',
        href: '/qualification',
      },
    ],
    projects: [
      {
        title: 'PersianToolbox Platform',
        description: 'A local-first Persian utility platform engineered to be fast, reliable, and intentionally simple for everyday users.',
        role: 'Product engineering lead: architecture, frontend system design, QA governance, and operational deployment readiness.',
        technologies: ['Next.js', 'TypeScript'],
        imageSrc: '/images/portfolio/persiantoolbox-showcase.png',
        imageAlt: 'PersianToolbox homepage screenshot',
        label: 'View case study',
        href: '/case-studies/asdev-persiantoolbox-platform',
      },
      {
        title: 'Infrastructure Localization Rescue',
        description: 'A case study for a localized release and governance path redesigned around operational risk and local-first constraints.',
        role: 'Infrastructure governance, release redesign, and rollback hardening.',
        technologies: ['Next.js', 'TypeScript', 'Nginx'],
        imageSrc: '/images/portfolio/infrastructure-localization-rescue.png',
        imageAlt: 'Infrastructure Localization Rescue case study screenshot',
        label: 'View case study',
        href: '/case-studies/infrastructure-localization-rescue',
      },
      {
        title: 'Audit Systems Platform',
        description: 'Production audit workflow for performance, security, and technical SEO with actionable outputs.',
        role: 'Technical audit product design and delivery.',
        technologies: ['Next.js', 'Prisma'],
        imageSrc: '/images/portfolio/audit-systems-home.png',
        imageAlt: 'Audit Systems homepage screenshot',
        label: 'View case study',
        href: '/case-studies',
      },
    ],
    proof: {
      title: 'Evidence over claims',
      description: 'Each engagement is explained through its problem context, technical decisions, and reviewable outcome.',
      items: [
        { id: 'persiantoolbox-case-study', label: 'PersianToolbox', value: 'Reviewable case study', source: 'ASDEV Systems case-study page', period: 'Published reference', method: 'Public route and implementation review', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'infrastructure-rescue-case-study', label: 'Infrastructure Localization Rescue', value: 'Reviewable release path', source: 'ASDEV Systems flagship case study', period: 'Published reference', method: 'Case-study narrative and deployment evidence review', verificationDate: '2026-08-30', reviewState: 'accepted' },
        { id: 'audit-systems-product', label: 'Audit Systems', value: 'Reviewable audit workflow', source: 'ASDEV Systems product case-study page', period: 'Published reference', method: 'Public route and product-surface review', verificationDate: '2026-08-30', reviewState: 'accepted' },
      ],
    },
    principles: [
      'Clarify the real problem and constraints first; choose technology and architecture second.',
      'Treat maintainability, quality, and the release path as product concerns from the beginning.',
      'A handoff should leave a system that is reviewable, documented, and safe to continue—not code that merely ran once.',
    ],
    about: {
      title: 'About me',
      description: 'I am Alireza Safaei, a Software Engineer and web-systems builder. I care less about adding technology for its own sake and more about reducing ambiguity, choosing the right architecture, and leaving teams with a product they can continue with confidence.',
    },
    contact: {
      title: 'Ready to collaborate?',
      description: 'If your product or project needs a clear technical path, this is where we can start.',
      cta: 'Start collaboration',
    },
  },
}

export function getHomeContent(language: Language): HomeContent {
  return content[language]
}
