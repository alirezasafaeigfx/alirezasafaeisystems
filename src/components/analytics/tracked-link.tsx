'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import type { Locale } from '@/lib/locale-utils'

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, 'onClick'> & {
  eventName: string
  eventCategory: 'conversion' | 'engagement'
  locale: Locale
}

export function TrackedLink({ eventName, eventCategory, locale, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={() => {
        void trackEvent({ name: eventName, category: eventCategory, locale })
      }}
    />
  )
}
