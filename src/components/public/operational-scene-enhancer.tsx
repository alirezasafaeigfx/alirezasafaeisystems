'use client'

import { useEffect } from 'react'

export function OperationalSceneEnhancer() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-testid="operational-scene"]')
    if (!root) return

    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-scene-select]')]
    const previous = root.querySelector<HTMLButtonElement>('[data-scene-previous]')
    const next = root.querySelector<HTMLButtonElement>('[data-scene-next]')
    const description = root.querySelector<HTMLElement>('[data-scene-description]')
    const live = root.querySelector<HTMLElement>('[data-scene-live]')
    const visiblePath = root.querySelector<SVGPathElement>('[data-testid="operational-scene-path"]')
    const motionPath = root.querySelector<SVGPathElement>('[data-scene-motion-path]')
    const svgDescription = root.querySelector<SVGDescElement>('[data-scene-svg-description]')
    const nodes = [...root.querySelectorAll<SVGGElement>('[data-scene-node]')]

    if (!buttons.length || !previous || !next || !description || !live || !visiblePath || !motionPath || !svgDescription) return

    let currentIndex = Math.max(0, buttons.findIndex((button) => button.dataset.sceneState === root.dataset.state))
    let motion: { cancel: () => unknown } | undefined
    let disposed = false
    let motionSequence = 0

    const animatePath = async () => {
      if (typeof motionPath.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const sequence = ++motionSequence
      try {
        const { waapi } = await import('animejs/waapi')
        if (disposed || sequence !== motionSequence) return
        motion?.cancel()
        motion = waapi.animate(motionPath, {
          opacity: [0.42, 1],
          duration: 320,
          ease: 'ease-out',
        })
      } catch {
        // The state transition is complete without optional motion.
      }
    }

    const applyState = (requestedIndex: number, animate = true) => {
      const index = Math.max(0, Math.min(buttons.length - 1, requestedIndex))
      const button = buttons[index]
      if (!button) return

      currentIndex = index
      const state = button.dataset.sceneState ?? 'pressure'
      const path = button.dataset.scenePath ?? visiblePath.getAttribute('d') ?? ''
      const activeNodes = new Set(
        (button.dataset.sceneActiveNodes ?? '')
          .split(',')
          .filter(Boolean)
          .map((value) => Number(value)),
      )
      const label = button.dataset.sceneLabel ?? ''

      root.dataset.state = state
      buttons.forEach((item, itemIndex) => {
        const selected = itemIndex === currentIndex
        item.dataset.selected = String(selected)
        item.setAttribute('aria-pressed', String(selected))
      })
      description.textContent = button.dataset.sceneDescription ?? ''
      live.textContent = label
      visiblePath.setAttribute('d', path)
      motionPath.setAttribute('d', path)
      svgDescription.textContent = `${svgDescription.dataset.sceneTopology ?? ''} · ${label}`
      nodes.forEach((node, nodeIndex) => {
        const active = activeNodes.has(nodeIndex)
        node.dataset.active = String(active)
        node.classList.toggle('is-active', active)
        node.querySelector('circle')?.setAttribute('r', String(active && state === 'pressure' ? 22 : 18))
      })
      previous.disabled = currentIndex === 0
      next.disabled = currentIndex === buttons.length - 1
      root.dispatchEvent(new CustomEvent('asdev:scene-state', { detail: { state } }))
      if (animate) void animatePath()
    }

    const selectHandlers = buttons.map((button, index) => {
      const handler = () => applyState(index)
      button.addEventListener('click', handler)
      return { button, handler }
    })
    const onPrevious = () => applyState(currentIndex - 1)
    const onNext = () => applyState(currentIndex + 1)
    previous.addEventListener('click', onPrevious)
    next.addEventListener('click', onNext)

    return () => {
      disposed = true
      motionSequence += 1
      motion?.cancel()
      selectHandlers.forEach(({ button, handler }) => button.removeEventListener('click', handler))
      previous.removeEventListener('click', onPrevious)
      next.removeEventListener('click', onNext)
    }
  }, [])

  return null
}
