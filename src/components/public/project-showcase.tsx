import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpLeft } from 'lucide-react'
import { VisualFrame } from '@/components/public/visual-frame'
import { cn } from '@/lib/utils'

export type ProjectShowcaseProps = {
  title: string
  description: string
  role: string
  technologies: string[]
  href: string
  imageSrc?: string
  imageAlt?: string
  tone: 'cobalt' | 'ink' | 'violet'
  outcome?: string
  locale: 'fa' | 'en'
  index: string
}

const tones = {
  cobalt: 'from-blue-600/18 via-blue-500/8 to-transparent',
  ink: 'from-slate-950/18 via-slate-700/8 to-transparent dark:from-white/12',
  violet: 'from-violet-600/18 via-violet-500/8 to-transparent',
} as const

export function ProjectShowcase({
  title,
  description,
  role,
  technologies,
  href,
  imageSrc,
  imageAlt,
  tone,
  outcome,
  locale,
  index,
}: ProjectShowcaseProps) {
  const isFa = locale === 'fa'
  const mediaLabel = imageAlt ?? (isFa ? `تصویر پروژه ${title}` : `${title} project visual`)

  return (
    <article className="group grid min-w-0 gap-6 border-t border-border/70 py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-10 md:py-10">
      <div className="min-w-0 md:order-2">
        <VisualFrame ariaLabel={mediaLabel} ratio="landscape" className="public-project-media min-w-0">
          <div className={cn('absolute inset-0 bg-gradient-to-br', tones[tone])} aria-hidden="true" />
          {imageSrc ? (
            <Image src={imageSrc} alt={imageAlt ?? title} fill sizes="(min-width: 768px) 52vw, 100vw" className="object-cover" />
          ) : (
            <div
              className="relative z-10 flex h-full min-w-0 flex-col justify-between p-6 sm:p-8"
              data-asset-status="pending-project-screenshot"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <span className="shrink-0 text-xs font-black tracking-[0.16em] text-primary">{index}</span>
                <span className="max-w-[76%] rounded-full border border-border/80 bg-background/70 px-3 py-1 text-center text-[11px] font-semibold leading-5 text-muted-foreground backdrop-blur-sm">
                  {isFa ? 'اسکرین‌شات واقعی در RC نهایی' : 'Real screenshot required for final RC'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="break-words text-3xl font-black leading-tight text-foreground sm:text-4xl">{title}</p>
                <p className="mt-2 break-words text-sm font-medium text-muted-foreground">{technologies.slice(0, 2).join(' • ')}</p>
              </div>
            </div>
          )}
        </VisualFrame>
      </div>

      <div className="min-w-0 md:order-1">
        <p className="text-xs font-black tracking-[0.16em] text-primary">{index}</p>
        <h3 className="mt-3 break-words text-2xl font-black leading-tight md:text-3xl">{title}</h3>
        <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">{description}</p>
        <p className="mt-4 max-w-xl text-sm font-semibold leading-7 text-foreground/80">{role}</p>
        {outcome ? <p className="mt-4 border-s-2 border-primary ps-4 text-sm leading-7 text-muted-foreground">{outcome}</p> : null}
        <ul className="mt-5 flex min-w-0 flex-wrap gap-2" aria-label={`${title} technologies`}>
          {technologies.slice(0, 3).map((technology) => (
            <li key={technology} className="max-w-full break-words rounded-full border border-border/75 bg-background/65 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {technology}
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg font-bold text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isFa ? 'مشاهده مطالعه موردی' : 'View case study'}
          <ArrowUpLeft aria-hidden="true" className={isFa ? 'public-link-arrow size-4' : 'public-link-arrow size-4 rotate-90'} />
        </Link>
      </div>
    </article>
  )
}
