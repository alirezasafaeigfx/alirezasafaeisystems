'use client'

import dynamic from 'next/dynamic'
import { Component, useCallback, useState, type ErrorInfo, type ReactNode } from 'react'
import type { SystemSceneState } from '@/lib/system-scene'

const SystemCore3d = dynamic(
  () => import('./system-core-3d').then((module) => module.SystemCore3d),
  { ssr: false },
)

type SystemCore3dLauncherProps = {
  state: SystemSceneState
  isFa: boolean
}

type PrototypeStatus = 'idle' | 'active' | 'reduced-motion' | 'unsupported' | 'failed'

class PrototypeErrorBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onFailure()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function SystemCore3dLauncher({ state, isFa }: SystemCore3dLauncherProps) {
  const [status, setStatus] = useState<PrototypeStatus>('idle')
  const handleFailure = useCallback(() => setStatus('failed'), [])
  const copy = isFa
    ? {
        activate: 'مشاهده نمونه سه‌بعدی',
        retry: 'تلاش دوباره',
        close: 'بستن نمونه سه‌بعدی',
        reduced: 'حالت حرکت کمتر فعال است؛ نمونه سه‌بعدی بارگیری نشد.',
        unsupported: 'WebGL2 در این دستگاه در دسترس نیست؛ نسخه دوبعدی بالا کامل می‌ماند.',
        failed: 'نمای سه‌بعدی متوقف شد؛ نسخه دوبعدی بالا همچنان قابل استفاده است.',
        note: 'اختیاری؛ فقط پس از انتخاب شما بارگیری می‌شود.',
      }
    : {
        activate: 'Try the spatial prototype',
        retry: 'Try again',
        close: 'Close 3D prototype',
        reduced: 'Reduced motion is enabled, so the 3D prototype was not loaded.',
        unsupported: 'WebGL2 is unavailable on this device; the complete 2D version remains above.',
        failed: 'The 3D view stopped; the complete 2D version remains available above.',
        note: 'Optional; loaded only after you choose it.',
      }

  const activate = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus('reduced-motion')
      return
    }

    const probe = document.createElement('canvas')
    const context = probe.getContext('webgl2')
    if (!context) {
      setStatus('unsupported')
      return
    }
    context.getExtension('WEBGL_lose_context')?.loseContext()
    setStatus('active')
  }

  const message = status === 'reduced-motion'
    ? copy.reduced
    : status === 'unsupported'
      ? copy.unsupported
      : copy.failed

  return (
    <section className="mt-5 rounded-xl border border-border/70 bg-background/70 p-3" data-gpu-status={status}>
      {status === 'active' ? (
        <>
          <PrototypeErrorBoundary onFailure={handleFailure}>
            <SystemCore3d state={state} isFa={isFa} onFailure={handleFailure} />
          </PrototypeErrorBoundary>
          <button type="button" className="mt-3 min-h-11 rounded-lg border border-border/70 px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => setStatus('idle')}>
            {copy.close}
          </button>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {status !== 'idle' && <p role="status" className="max-w-xl text-xs leading-6 text-muted-foreground">{message}</p>}
            {status === 'idle' && <p className="text-xs text-muted-foreground">{copy.note}</p>}
          </div>
          <button type="button" className="min-h-11 rounded-lg bg-foreground px-4 text-xs font-bold text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={activate}>
            {status === 'idle' ? copy.activate : copy.retry}
          </button>
        </div>
      )}
    </section>
  )
}
