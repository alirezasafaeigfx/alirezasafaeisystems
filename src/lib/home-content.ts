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
      name: 'مهندسی نرم‌افزار و راه‌حل‌های قابل اجرا',
      title: 'سیستم‌های عملیاتی را قابل دیدن می‌کنم',
      description: 'به کسب‌وکارها کمک می‌کنم وقتی سایت یا محصولشان به مشکل می‌خورد، علت را بفهمند و مسیر فنی مطمئنی برای ادامه داشته باشند.',
      detail: 'مسئله و محدودیت واقعی را بررسی می‌کنیم، راه‌حل را روشن توضیح می‌دهم و نتیجه را با شواهد قابل بررسی تحویل می‌دهم.',
      primaryCta: 'درخواست بررسی سایت',
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
        description: 'سرعت، کیفیت فنی و آمادگی انتشار را بهتر می‌کنم تا تیم با اطمینان بیشتری ادامه دهد.',
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
        title: 'نجات بومی‌سازی زیرساخت',
        description: 'مطالعه موردی یک مسیر استقرار که برای محدودیت‌های دسترسی و ریسک‌های عملیاتی بازطراحی شد.',
        role: 'بازطراحی مسیر انتشار و آماده‌سازی بازگشت امن',
        technologies: ['Next.js', 'TypeScript', 'Nginx'],
        imageSrc: '/images/portfolio/infrastructure-localization-rescue.png',
        imageAlt: 'اسکرین‌شات مطالعه موردی نجات بومی‌سازی زیرساخت',
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies/infrastructure-localization-rescue',
      },
      {
        title: 'پلتفرم PersianToolbox',
        description: 'پلتفرم ابزارهای فارسی که ابزارهای آن تا حد ممکن روی دستگاه کاربر اجرا می‌شوند.',
        role: 'معماری، طراحی رابط و آماده‌سازی انتشار',
        technologies: ['Next.js', 'TypeScript'],
        imageSrc: '/images/portfolio/persiantoolbox-showcase.png',
        imageAlt: 'اسکرین‌شات صفحه اصلی PersianToolbox',
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies/asdev-persiantoolbox-platform',
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
        { id: 'persiantoolbox-case-study', label: 'PersianToolbox', value: 'مطالعه موردی قابل بررسی', source: 'صفحه عمومی مطالعه موردی PersianToolbox', sourceUrl: '/case-studies/asdev-persiantoolbox-platform', period: 'بررسی مسیر عمومی در ۲۰۲۶-۰۸-۳۰', method: 'بررسی مسیر و توضیحات منتشرشده', verificationDate: '2026-08-30', reviewState: 'draft' },
        { id: 'infrastructure-rescue-case-study', label: 'Infrastructure Localization Rescue', value: 'مسیر انتشار قابل بررسی', source: 'صفحه عمومی مطالعه موردی نجات زیرساخت', sourceUrl: '/case-studies/infrastructure-localization-rescue', period: 'بررسی مسیر عمومی در ۲۰۲۶-۰۸-۳۰', method: 'بررسی روایت مطالعه موردی و شواهد انتشار', verificationDate: '2026-08-30', reviewState: 'draft' },
        { id: 'audit-systems-product', label: 'Audit Systems', value: 'گردش‌کار ارزیابی قابل بررسی', source: 'صفحه عمومی محصول Audit Systems', sourceUrl: 'https://audit.alirezasafaeisystems.ir/', period: 'بررسی مسیر عمومی در ۲۰۲۶-۰۸-۳۰', method: 'بررسی سطح عمومی محصول و مسیر ارزیابی', verificationDate: '2026-08-30', reviewState: 'draft' },
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
      detail: 'We clarify the real constraint, explain the path forward, and hand over evidence you can inspect and act on.',
      primaryCta: 'Request a website review',
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
        title: 'PersianToolbox Platform',
        description: 'A Persian utility platform designed to run tools on the user\'s device where possible, with a simple and dependable experience.',
        role: 'Product engineering lead: architecture, frontend system design, QA governance, and operational deployment readiness.',
        technologies: ['Next.js', 'TypeScript'],
        imageSrc: '/images/portfolio/persiantoolbox-showcase.png',
        imageAlt: 'PersianToolbox homepage screenshot',
        label: 'View case study',
        href: '/case-studies/asdev-persiantoolbox-platform',
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
        { id: 'persiantoolbox-case-study', label: 'PersianToolbox', value: 'Reviewable case study', source: 'Public PersianToolbox case-study page', sourceUrl: '/en/case-studies/asdev-persiantoolbox-platform', period: 'Public route review on 2026-08-30', method: 'Published route and narrative review', verificationDate: '2026-08-30', reviewState: 'draft' },
        { id: 'infrastructure-rescue-case-study', label: 'Infrastructure Localization Rescue', value: 'Reviewable release path', source: 'Public infrastructure rescue case-study page', sourceUrl: '/en/case-studies/infrastructure-localization-rescue', period: 'Public route review on 2026-08-30', method: 'Case-study narrative and release evidence review', verificationDate: '2026-08-30', reviewState: 'draft' },
        { id: 'audit-systems-product', label: 'Audit Systems', value: 'Reviewable audit workflow', source: 'Public Audit Systems product site', sourceUrl: 'https://audit.alirezasafaeisystems.ir/', period: 'Public route review on 2026-08-30', method: 'Public product-surface and assessment-path review', verificationDate: '2026-08-30', reviewState: 'draft' },
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
