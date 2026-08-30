import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type VisualFrameProps = {
  ariaLabel: string
  children: ReactNode
  className?: string
  ratio?: 'portrait' | 'landscape' | 'square'
}

const ratios = {
  portrait: 'aspect-[4/5]',
  landscape: 'aspect-[16/10]',
  square: 'aspect-square',
} as const

export function VisualFrame({
  ariaLabel,
  children,
  className,
  ratio = 'landscape',
}: VisualFrameProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn('public-visual-frame', ratios[ratio], className)}
    >
      {children}
    </div>
  )
}
