'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { transitionScene, SYSTEM_SCENE_STATES, type SystemSceneState } from '@/lib/system-scene'
import { SystemCore3dLauncher } from './system-core-3d-launcher'

type OperationalSceneProps = { isFa: boolean }

const sceneData: Record<SystemSceneState, { path: string; activeNodes: number[] }> = {
  pressure: { path: 'M48 56 H190 M240 56 H410 M460 56 H592', activeNodes: [0, 2] },
  diagnosis: { path: 'M48 56 H229 M229 56 C286 56 314 26 370 26', activeNodes: [1, 2] },
  intervention: { path: 'M48 56 C170 56 164 22 286 22 S410 56 592 56', activeNodes: [1, 2, 3] },
  stable: { path: 'M48 56 H592', activeNodes: [0, 1, 2, 3] },
  evidence: { path: 'M48 56 H500 M516 56 l14 14 30 -32', activeNodes: [0, 1, 2, 3] },
}

export function OperationalScene({ isFa }: OperationalSceneProps) {
  const [state, setState] = useState<SystemSceneState>('pressure')
  const interactive = useSyncExternalStore(() => () => undefined, () => true, () => false)
  const copy = isFa
    ? {
        label: 'نمونهٔ آموزشی مسیر تحویل',
        title: 'مشکل را می‌بینیم، مسیر درست را پیدا می‌کنیم',
        next: 'مرحله بعد',
        previous: 'مرحله قبل',
        states: ['سایت به مشکل خورده', 'مشکل رو پیدا می‌کنیم', 'مسیر درست رو جایگزین می‌کنیم', 'سایت دوباره درست کار می‌کنه', 'ببین چه چیزی بهتر شده'],
        descriptions: ['یک مسیر مهم به مانع خورده است.', 'بخش گرفتار را جدا می‌کنیم تا علت روشن شود.', 'مسیر جایگزین را با دلیل مشخص به کار می‌گیریم.', 'مسیر پایدار شده و محدودیت باقی‌مانده را می‌بینیم.', 'همین نقشه را با شواهد قابل بررسی ادامه می‌دهیم.'],
        topology: ['ورودی', 'بررسی', 'انتشار', 'شواهد'],
        noScript: 'این نمونهٔ آموزشی بدون تعامل هم کامل است؛ پنج مرحلهٔ مسیر در ادامه آمده‌اند.',
      }
    : {
        label: 'Educational delivery-path example',
        title: 'See the problem, then follow the repair',
        next: 'Next state',
        previous: 'Previous state',
        states: ['The system is under pressure', 'We isolate the cause', 'We replace the risky route', 'The path is stable again', 'Inspect the evidence'],
        descriptions: ['A critical route is constrained before users can continue.', 'We isolate the part causing the failure.', 'A visible, explainable route replaces the risky path.', 'The system is stable, with its remaining limits visible.', 'The same topology continues into reviewable evidence.'],
        topology: ['Input', 'Diagnosis', 'Release', 'Evidence'],
        noScript: 'This educational example remains complete without interaction; all five stages are listed below.',
      }

  const currentIndex = SYSTEM_SCENE_STATES.indexOf(state)
  const data = sceneData[state]
  const motionPathRef = useRef<SVGPathElement>(null)
  const hasInteractedRef = useRef(false)
  const move = (event: Parameters<typeof transitionScene>[1]) => {
    hasInteractedRef.current = true
    setState((current) => transitionScene(current, event))
  }

  useEffect(() => {
    const motionPath = motionPathRef.current
    if (!motionPath || !hasInteractedRef.current) return
    if (typeof motionPath.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let disposed = false
    let motion: { cancel: () => unknown } | undefined
    void import('animejs/waapi')
      .then(({ waapi }) => {
        if (disposed) return
        motion = waapi.animate(motionPath, {
          opacity: [0.42, 1],
          duration: 320,
          ease: 'ease-out',
        })
      })
      .catch(() => undefined)

    return () => {
      disposed = true
      motion?.cancel()
    }
  }, [data.path])

  return (
    <figure className="operational-scene scroll-mt-20 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4 sm:p-5" aria-labelledby="operational-scene-title" data-testid="operational-scene" data-state={state} data-scene-mode="native" data-motion-engine="animejs" data-motion-mode="deferred-waapi" data-topology="delivery-network">
      <figcaption>
        <p className="public-kicker">{copy.label}</p>
        <h2 id="operational-scene-title" className="mt-2 text-lg font-black sm:text-xl">{copy.title}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy.descriptions[currentIndex]}</p>
      </figcaption>

      <div hidden={!interactive} className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" role="group" aria-label={isFa ? 'انتخاب مرحلهٔ مسیر' : 'Choose a delivery-path state'}>
        {SYSTEM_SCENE_STATES.map((sceneState, index) => (
          <button
            key={sceneState}
            type="button"
            className="min-h-11 rounded-xl border border-border/70 px-3 text-xs font-bold leading-5 transition-colors last:col-span-2 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground sm:rounded-full"
            data-selected={state === sceneState}
            aria-pressed={state === sceneState}
            onClick={() => move({ type: 'select', state: sceneState })}
          >
            <span className="me-1 opacity-60">0{index + 1}</span>{copy.states[index]}
          </button>
        ))}
      </div>

      <div hidden={interactive} data-testid="operational-scene-fallback" className="mt-4 rounded-xl border border-border/70 bg-background/70 p-4">
          <p className="text-sm font-semibold">{copy.noScript}</p>
          <ol className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {copy.states.map((label, index) => <li key={label}><span className="font-bold text-primary">0{index + 1}.</span> {label} — {copy.descriptions[index]}</li>)}
          </ol>
      </div>

      <svg className={`${interactive ? '' : 'hidden '}mt-5 h-auto w-full overflow-visible`} viewBox="0 0 640 112" role="img" aria-labelledby="operational-scene-title operational-scene-description">
        <desc id="operational-scene-description">{copy.topology.join(' → ')} · {copy.states[currentIndex]}</desc>
        <path data-testid="operational-scene-path" className="operational-scene__path opacity-0" d={data.path} pathLength="1" />
        <path ref={motionPathRef} aria-hidden="true" className="operational-scene__path" d={data.path} pathLength="1" />
        {copy.topology.map((node, index) => {
          const x = 48 + index * 181.3
          const active = data.activeNodes.includes(index)
          return (
            <g key={node} className={`operational-scene__node${active ? ' is-active' : ''}`} data-active={active}>
              <circle cx={x} cy="56" r={active && state === 'pressure' ? 22 : 18} />
              <text x={x} y="96" textAnchor="middle">{node}</text>
            </g>
          )
        })}
      </svg>

      <div hidden={!interactive} className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-muted-foreground" aria-live="polite">{copy.states[currentIndex]}</p>
        <div className="flex gap-2">
          <button type="button" className="min-h-11 rounded-lg border border-border/70 px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => move({ type: 'previous' })} disabled={currentIndex === 0}>{copy.previous}</button>
          <button type="button" className="min-h-11 rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => move({ type: 'next' })} disabled={currentIndex === SYSTEM_SCENE_STATES.length - 1}>{copy.next}</button>
        </div>
      </div>
      {interactive && <SystemCore3dLauncher state={state} isFa={isFa} />}
    </figure>
  )
}
