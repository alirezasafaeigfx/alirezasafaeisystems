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
      description: 'سیستم‌ها و محصولات وبی می‌سازم که سریع، پایدار، امن و آماده استفاده واقعی در Production باشند.',
      detail: 'از طراحی معماری و توسعه نرم‌افزار تا بهینه‌سازی، استقرار و نجات پروژه‌های نیمه‌کاره.',
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
        label: 'مشاهده مطالعه موردی',
        href: '/case-studies',
      },
    ],
    proof: {
      title: 'شواهد به‌جای ادعا',
      description: 'هر همکاری با زمینه مسئله، تصمیم‌های فنی و خروجی قابل بررسی توضیح داده می‌شود.',
    },
    principles: [
      'تصمیم‌های معماری بر اساس مسئله واقعی کسب‌وکار',
      'کیفیت و قابلیت نگهداری از ابتدای مسیر توسعه',
      'تحویل شفاف با شواهد قابل بررسی',
    ],
    about: {
      title: 'درباره من',
      description: 'علیرضا صفایی، مهندس نرم‌افزار و سازنده سیستم‌های وب در ASDEV است.',
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
      description: 'I design and build web systems that are fast, reliable, secure, and ready for real production use.',
      detail: 'From software architecture and development to optimization, deployment, and rescuing incomplete projects.',
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
        label: 'View case study',
        href: '/case-studies',
      },
    ],
    proof: {
      title: 'Evidence over claims',
      description: 'Each engagement is explained through its problem context, technical decisions, and reviewable outcome.',
    },
    principles: [
      'Architecture decisions grounded in the real business problem',
      'Quality and maintainability from the start of delivery',
      'Clear handover with reviewable evidence',
    ],
    about: {
      title: 'About me',
      description: 'Alireza Safaei is a Software Engineer and web systems builder at ASDEV.',
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
