import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import { SYSTEM_SCENE_STATES, syncRouteGeometry, transitionScene } from '@/lib/system-scene'

describe('system scene state model', () => {
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
    const points = (count: number) => Array.from({ length: count }, (_, index) => new THREE.Vector3(index + 0.25, index * 2, -index))

    syncRouteGeometry(geometry, points(4))
    const initialAttribute = geometry.getAttribute('position')
    expect(initialAttribute.count).toBe(4)
    expect(Array.from(initialAttribute.array)).toEqual(points(4).flatMap((point) => [point.x, point.y, point.z]))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 4 })

    syncRouteGeometry(geometry, points(4).map((point) => point.clone().addScalar(0.5)))
    expect(geometry.getAttribute('position')).toBe(initialAttribute)

    syncRouteGeometry(geometry, points(6))
    const expandedAttribute = geometry.getAttribute('position')
    expect(expandedAttribute.count).toBe(6)
    expect(Array.from(expandedAttribute.array)).toEqual(points(6).flatMap((point) => [point.x, point.y, point.z]))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 6 })
    expect(geometry.boundingBox?.max.toArray()).toEqual([5.25, 10, -0])
    expect(Number.isFinite(geometry.boundingSphere?.radius ?? Number.NaN)).toBe(true)

    syncRouteGeometry(geometry, points(8))
    const finalAttribute = geometry.getAttribute('position')
    expect(finalAttribute.count).toBe(8)
    expect(Array.from(finalAttribute.array)).toEqual(points(8).flatMap((point) => [point.x, point.y, point.z]))
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 8 })

    syncRouteGeometry(geometry, points(4))
    const shortenedValues = Array.from(geometry.getAttribute('position').array)
    expect(geometry.getAttribute('position').count).toBe(4)
    expect(shortenedValues).toEqual(points(4).flatMap((point) => [point.x, point.y, point.z]))
    expect(shortenedValues).not.toContain(7.25)
    expect(geometry.drawRange).toMatchObject({ start: 0, count: 4 })
    expect(geometry.boundingBox?.max.toArray()).toEqual([3.25, 6, -0])
    geometry.dispose()
  })
})
