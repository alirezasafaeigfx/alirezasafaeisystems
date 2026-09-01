import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import * as THREE from 'three'
import { SYSTEM_SCENE_STATES, transitionScene } from '@/lib/system-scene'
import { SYSTEM_CORE_ROUTE_CAPACITY, SYSTEM_CORE_STATE_LAYOUTS, SYSTEM_CORE_STATE_TOPOLOGIES, syncRouteGeometry } from '@/lib/system-route-geometry'

describe('system scene state model', () => {
  it('keeps the native scene state module free of runtime Three imports', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/lib/system-scene.ts'), 'utf8')
    expect(source).not.toMatch(/from ['"]three['"]|require\(['"]three['"]\)/)
  })

  it('moves forward and backward without leaving the five-state boundaries', () => {
    expect(SYSTEM_SCENE_STATES).toHaveLength(5)
    expect(transitionScene('pressure', { type: 'previous' })).toBe('pressure')
    expect(transitionScene('pressure', { type: 'next' })).toBe('diagnosis')
    expect(transitionScene('evidence', { type: 'next' })).toBe('evidence')
    expect(transitionScene('evidence', { type: 'previous' })).toBe('stable')
  })

  it('supports deterministic direct selection for backtracking', () => {
    expect(transitionScene('stable', { type: 'select', state: 'diagnosis' })).toBe('diagnosis')
  })

  it('synchronizes route geometry across changing vertex counts without stale positions', () => {
    const geometry = new THREE.BufferGeometry()
    const nodes = SYSTEM_CORE_STATE_LAYOUTS.pressure.map(([x, y, z]) => ({ position: new THREE.Vector3(x, y, z) }))
    const points = (state: keyof typeof SYSTEM_CORE_STATE_LAYOUTS) => SYSTEM_CORE_STATE_TOPOLOGIES[state].edges.flatMap(([from, to]) => [from, to]).map((index) => {
      const [x, y, z] = SYSTEM_CORE_STATE_LAYOUTS[state][index]
      return new THREE.Vector3(x, y, z)
    })
    const values = (state: keyof typeof SYSTEM_CORE_STATE_LAYOUTS) => points(state).flatMap((point) => [point.x, point.y, point.z]).map((value) => Number(value.toFixed(4)))
    const activeValues = (state: keyof typeof SYSTEM_CORE_STATE_LAYOUTS) => Array.from(geometry.getAttribute('position').array).slice(0, points(state).length * 3).map((value) => Number(value.toFixed(4)))
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    const sync = (state: keyof typeof SYSTEM_CORE_STATE_LAYOUTS) => {
      nodes.forEach((node, index) => node.position.set(...SYSTEM_CORE_STATE_LAYOUTS[state][index]))
      syncRouteGeometry(geometry, nodes, SYSTEM_CORE_STATE_TOPOLOGIES[state].edges, SYSTEM_CORE_ROUTE_CAPACITY)
    }
    sync('pressure')
    const initialAttribute = geometry.getAttribute('position')
    expect(initialAttribute.count).toBe(8)
    expect(activeValues('pressure')).toEqual(values('pressure'))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 4 })
    const bounds = geometry.boundingBox
    const sphere = geometry.boundingSphere
    expect(bounds?.min.toArray()).toEqual([-2.7, -0.5, -0.2])
    expect(bounds?.max.toArray()).toEqual([1.1, 0.7, 0.4])

    sync('intervention')
    const expandedAttribute = geometry.getAttribute('position')
    expect(expandedAttribute.count).toBe(8)
    expect(activeValues('intervention')).toEqual(values('intervention'))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 6 })
    expect(geometry.boundingBox?.max.toArray()).toEqual([2.8, 0.7, 0.5])
    expect(geometry.boundingBox).toBe(bounds)
    expect(geometry.boundingSphere).toBe(sphere)
    expect(Number.isFinite(geometry.boundingSphere?.radius ?? Number.NaN)).toBe(true)

    sync('evidence')
    const finalAttribute = geometry.getAttribute('position')
    expect(finalAttribute.count).toBe(8)
    expect(activeValues('evidence')).toEqual(values('evidence'))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 8 })
    expect(geometry.boundingBox?.min.toArray()).toEqual([-2.7, 0, 0])
    expect(geometry.boundingBox?.max.toArray()).toEqual([2.8, 0.7, 0.7])

    sync('pressure')
    const shortenedValues = Array.from(geometry.getAttribute('position').array)
    expect(geometry.getAttribute('position').count).toBe(8)
    expect(shortenedValues.slice(0, 12).map((value) => Number(value.toFixed(4)))).toEqual(values('pressure'))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 4 })
    expect(geometry.boundingBox?.min.toArray()).toEqual([-2.7, -0.5, -0.2])
    expect(geometry.boundingBox?.max.toArray()).toEqual([1.1, 0.7, 0.4])
    expect(warn).not.toHaveBeenCalled()
    const stableAttribute = geometry.getAttribute('position')
    for (let cycle = 0; cycle < 5; cycle += 1) {
      sync('intervention')
      sync('evidence')
      sync('pressure')
    }
    expect(geometry.getAttribute('position')).toBe(stableAttribute)
    geometry.dispose()
    warn.mockRestore()
  })
})
