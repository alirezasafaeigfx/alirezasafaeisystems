import { Box3, Float32BufferAttribute, Sphere, type BufferGeometry, type Vector3 } from 'three'
import type { SystemSceneState } from './system-scene'

export type TopologyEdge = [number, number]

export const SYSTEM_CORE_STATE_LAYOUTS: Record<SystemSceneState, Array<[number, number, number]>> = {
  pressure: [[-2.7, 0.7, 0], [-0.8, -0.5, 0.4], [1.1, 0.65, -0.2], [2.8, -0.65, 0]],
  diagnosis: [[-2.7, 0, 0], [-0.8, 1.05, 0.8], [1.1, 0.15, -0.7], [2.8, 0, 0]],
  intervention: [[-2.7, -0.35, 0], [-0.8, 0.7, -0.5], [1.1, 0.7, 0.5], [2.8, -0.35, 0]],
  stable: [[-2.7, 0, 0], [-0.8, 0, 0], [1.1, 0, 0], [2.8, 0, 0]],
  evidence: [[-2.7, 0, 0], [-0.8, 0, 0], [1.1, 0, 0], [2.8, 0.7, 0.7]],
}

export const SYSTEM_CORE_STATE_TOPOLOGIES: Record<SystemSceneState, { edges: TopologyEdge[]; signature: string }> = {
  pressure: { edges: [[0, 1], [1, 2]], signature: 'input-diagnosis|diagnosis-release' },
  diagnosis: { edges: [[0, 1], [1, 3]], signature: 'input-diagnosis|diagnosis-evidence' },
  intervention: { edges: [[0, 1], [1, 3], [3, 2]], signature: 'input-diagnosis|diagnosis-evidence|evidence-release' },
  stable: { edges: [[0, 1], [1, 2], [2, 3]], signature: 'input-diagnosis|diagnosis-release|release-evidence' },
  evidence: { edges: [[0, 1], [1, 2], [2, 3], [3, 1]], signature: 'input-diagnosis|diagnosis-release|release-evidence|evidence-diagnosis' },
}

export const SYSTEM_CORE_ROUTE_CAPACITY = 8

export function syncRouteGeometry(geometry: BufferGeometry, points: readonly Vector3[], capacity = points.length): void {
  const vertexCount = points.length
  const current = geometry.getAttribute('position')
  if (!current || current.count < vertexCount || current.count < capacity) {
    const attribute = new Float32BufferAttribute(Math.max(vertexCount, capacity) * 3, 3)
    points.forEach((point, index) => attribute.setXYZ(index, point.x, point.y, point.z))
    attribute.needsUpdate = true
    geometry.setAttribute('position', attribute)
  } else {
    points.forEach((point, index) => current.setXYZ(index, point.x, point.y, point.z))
    current.needsUpdate = true
  }
  geometry.setDrawRange(0, vertexCount)
  geometry.boundingBox = new Box3().setFromPoints([...points])
  geometry.boundingSphere = new Sphere().setFromPoints([...points])
}
