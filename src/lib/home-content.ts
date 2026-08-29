import type { Language } from '@/lib/i18n/translations'

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
      name: 'علیرضا صفایی',
      title: 'مهندس نرم‌افزار',
      description: 'سیستم‌های وبی طراحی و می‌سازم که از اولین تصمیم معماری تا استفاده واقعی در Production سریع، قابل نگهداری و قابل اتکا بمانند.',
      detail: 'تمرکز من روی معماری نرم‌افزار، توسعه محصول، پایدارسازی و نجات پروژه‌هایی است که باید واقعاً کار کنند؛ نه فقط در دمو خوب به نظر برسند.',
      primaryCta: 'شروع همکاری',
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
        title: 'هشدار قیمت Novax',
        description: 'بات تلگرام و TWA برای هشدار قیمت بازار ایران با جریان مرحله‌ای و سخت‌سازی قابلیت اعتماد.',
        role: 'مهندسی محصول کامل: معماری، Backend، TWA و عملیات',
        technologies: ['FastAPI', 'Telegram'],
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies/novax-price-alert',
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
      name: 'Alireza Safaei',
      title: 'Software Engineer',
      description: 'I design and build web systems that stay fast, maintainable, and dependable from the first architecture decision through real production use.',
      detail: 'My work spans software architecture, product delivery, stabilization, and rescuing projects that need to work reliably—not just look good in a demo.',
      primaryCta: 'Start collaboration',
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
        title: 'Novax Price Alert',
        description: 'A production Telegram bot and rich TWA for real-time price alerts on Iranian markets with explicit staged flows and reliability hardening.',
        role: 'Full-stack product engineering: architecture, backend, TWA, and operations.',
        technologies: ['FastAPI', 'Telegram'],
        label: 'View case study',
        href: '/case-studies/novax-price-alert',
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
