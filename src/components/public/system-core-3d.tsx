'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { SYSTEM_CORE_ROUTE_CAPACITY, SYSTEM_CORE_STATE_LAYOUTS, SYSTEM_CORE_STATE_TOPOLOGIES, syncRouteGeometry } from '@/lib/system-route-geometry'
import type { SystemSceneState } from '@/lib/system-scene'

type SystemCore3dProps = {
  state: SystemSceneState
  isFa: boolean
  onFailure: () => void
}

const stateLabels: Record<SystemSceneState, { fa: string; en: string }> = {
  pressure: { fa: 'سایت به مشکل خورده', en: 'The system is under pressure' },
  diagnosis: { fa: 'مشکل را پیدا می‌کنیم', en: 'We isolate the cause' },
  intervention: { fa: 'مسیر درست را جایگزین می‌کنیم', en: 'We replace the risky route' },
  stable: { fa: 'سایت دوباره درست کار می‌کند', en: 'The path is stable again' },
  evidence: { fa: 'نتیجه را با شواهد بررسی می‌کنیم', en: 'We inspect the evidence' },
}

export function SystemCore3d({ state, isFa, onFailure }: SystemCore3dProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const stateRef = useRef(state)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch {
      onFailure()
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 2.1, 10)
    camera.lookAt(0, 0, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace

    scene.add(new THREE.AmbientLight(0xffffff, 1.8))
    const keyLight = new THREE.DirectionalLight(0x68d8ff, 3.4)
    keyLight.position.set(2, 5, 5)
    scene.add(keyLight)

    const geometries: THREE.BufferGeometry[] = [
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.CylinderGeometry(0.5, 0.5, 1.05, 20),
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.TorusGeometry(0.52, 0.17, 12, 28),
    ]
    const colors = [0x4fd1c5, 0xffcf5c, 0xff7a90, 0x8b7cff]
    const nodes = geometries.map((geometry, index) => {
      const material = new THREE.MeshStandardMaterial({ color: colors[index], roughness: 0.35, metalness: 0.12 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.set(index * 0.18, index * 0.32, 0)
      scene.add(mesh)
      return mesh
    })
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x6aa9bb, transparent: true, opacity: 0.7 })
    const route = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(route)

    let frame = 0
    let animationStart = 0
    let intersecting = true
    let documentVisible = document.visibilityState !== 'hidden'
    let settledState: SystemSceneState | null = null
    const projectedLabelPosition = new THREE.Vector3()

    const pauseReason = () => documentVisible ? (intersecting ? null : 'offscreen') : 'hidden'
    const setPaused = () => {
      const reason = pauseReason()
      cancelAnimationFrame(frame)
      canvas.dataset.renderActive = 'false'
      if (reason) canvas.dataset.renderPaused = reason
    }

    const render = () => {
      renderer.render(scene, camera)
    }
    const renderLabels = () => {
      nodes.forEach((node, index) => {
        const label = labelRefs.current[index]
        if (!label) return
        projectedLabelPosition.copy(node.position).project(camera)
        label.style.left = `${(projectedLabelPosition.x * 0.5 + 0.5) * canvas.clientWidth}px`
        label.style.top = `${(-projectedLabelPosition.y * 0.5 + 0.5) * canvas.clientHeight}px`
      })
    }
    const resize = () => {
      const width = Math.max(canvas.clientWidth, 1)
      const height = Math.max(canvas.clientHeight, 1)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      render()
      renderLabels()
    }
    const updateRoute = (routeState: SystemSceneState) => {
      const topology = SYSTEM_CORE_STATE_TOPOLOGIES[routeState]
      syncRouteGeometry(lineGeometry, nodes, topology.edges, SYSTEM_CORE_ROUTE_CAPACITY)
      canvas.dataset.sceneTopology = topology.signature
    }
    const placeImmediately = () => {
      nodes.forEach((node, index) => node.position.set(...SYSTEM_CORE_STATE_LAYOUTS[stateRef.current][index]))
      updateRoute(stateRef.current)
      render()
      renderLabels()
      canvas.dataset.renderActive = 'false'
      canvas.dataset.renderPaused = 'none'
      canvas.dataset.sceneState = stateRef.current
      settledState = stateRef.current
    }
    const animateState = () => {
      if (pauseReason()) {
        settledState = null
        setPaused()
        return
      }

      cancelAnimationFrame(frame)
      const from = nodes.map((node) => node.position.clone())
      const targetState = stateRef.current
      const target = SYSTEM_CORE_STATE_LAYOUTS[targetState].map(([x, y, z]) => new THREE.Vector3(x, y, z))
      animationStart = performance.now()
      canvas.dataset.renderActive = 'true'
      canvas.dataset.renderPaused = 'none'
      settledState = null
      const step = (now: number) => {
        if (pauseReason()) {
          setPaused()
          return
        }
        const progress = Math.min((now - animationStart) / 420, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        nodes.forEach((node, index) => {
          node.position.lerpVectors(from[index], target[index], eased)
          node.rotation.y += 0.012
        })
        updateRoute(targetState)
        render()
        if (progress < 1) frame = requestAnimationFrame(step)
        else {
          renderLabels()
          canvas.dataset.renderActive = 'false'
          canvas.dataset.sceneState = targetState
          settledState = targetState
        }
      }
      frame = requestAnimationFrame(step)
    }
    const resume = () => {
      if (pauseReason()) {
        setPaused()
        return
      }
      canvas.dataset.renderPaused = 'none'
      if (settledState !== stateRef.current) animateState()
      else render()
    }
    const onContextLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      onFailure()
    }
    const onVisibilityChange = () => {
      documentVisible = document.visibilityState !== 'hidden'
      if (documentVisible) resume()
      else setPaused()
    }

    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('systemstatechange', animateState)
    document.addEventListener('visibilitychange', onVisibilityChange)
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? false
      if (intersecting) resume()
      else setPaused()
    })
    intersectionObserver.observe(canvas)
    placeImmediately()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('systemstatechange', animateState)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      geometries.forEach((geometry) => geometry.dispose())
      nodes.forEach((node) => (node.material as THREE.Material).dispose())
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.setAnimationLoop(null)
      renderer.dispose()
      renderer.forceContextLoss()
    }
  }, [onFailure])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    stateRef.current = state
    canvas.dispatchEvent(new CustomEvent('systemstatechange'))
  }, [state])

  return (
    <figure className="relative overflow-hidden rounded-xl border border-primary/20 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.16),_transparent_65%)]" data-testid="system-core-3d">
      <canvas ref={canvasRef} className="block h-64 w-full sm:h-72" aria-label={isFa ? `نمای فضایی مسیر: ${stateLabels[state].fa}` : `Spatial delivery path: ${stateLabels[state].en}`} data-render-active="false" />
      {(isFa ? ['ورودی', 'بررسی', 'انتشار', 'شواهد'] : ['Input', 'Diagnosis', 'Release', 'Evidence']).map((label, index) => (
        <span
          key={label}
          ref={(element) => { labelRefs.current[index] = element }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/40 bg-background/78 px-2 py-1 text-[10px] font-bold text-foreground shadow-sm backdrop-blur-sm"
        >
          {label}
        </span>
      ))}
      <figcaption className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg bg-background/80 px-3 py-2 text-xs font-semibold backdrop-blur-sm">
        {isFa ? `مرحله فعلی: ${stateLabels[state].fa}` : `Current state: ${stateLabels[state].en}`}
      </figcaption>
    </figure>
  )
}
