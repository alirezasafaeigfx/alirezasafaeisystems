'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/logger'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error('Admin module render failed', { message: error.message, digest: error.digest })
  }, [error])

  return (
    <section role="alert" className="rounded-lg border border-destructive/40 p-6">
      <h1 className="text-xl font-semibold">This module could not be loaded</h1>
      <p className="mt-2 text-sm text-muted-foreground">No data was changed. Retry the read when you are ready.</p>
      <Button className="mt-4" onClick={reset}>Retry</Button>
    </section>
  )
}
