import { Float32BufferAttribute, type BufferGeometry, type Vector3 } from 'three'

export type SystemSceneState = 'pressure' | 'diagnosis' | 'intervention' | 'stable' | 'evidence'
export type SceneEvent =
  | { type: 'select'; state: SystemSceneState }
  | { type: 'next' }
  | { type: 'previous' }

export const SYSTEM_SCENE_STATES: SystemSceneState[] = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']

/** Keep a route line's position buffer, draw range, and bounds in sync as topology changes. */
export function syncRouteGeometry(geometry: BufferGeometry, points: readonly Vector3[]): void {
  const vertexCount = points.length
  const current = geometry.getAttribute('position')

  if (!current || current.count !== vertexCount) {
    const attribute = new Float32BufferAttribute(vertexCount * 3, 3)
    points.forEach((point, index) => attribute.setXYZ(index, point.x, point.y, point.z))
    geometry.setAttribute('position', attribute)
  } else {
    points.forEach((point, index) => current.setXYZ(index, point.x, point.y, point.z))
    current.needsUpdate = true
  }

  geometry.setDrawRange(0, vertexCount)
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
}

export function transitionScene(current: SystemSceneState, event: SceneEvent): SystemSceneState {
  if (event.type === 'select') return event.state
  const index = SYSTEM_SCENE_STATES.indexOf(current)
  const nextIndex = event.type === 'next' ? index + 1 : index - 1
  return SYSTEM_SCENE_STATES[Math.max(0, Math.min(SYSTEM_SCENE_STATES.length - 1, nextIndex))] ?? SYSTEM_SCENE_STATES[0]
}
