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

export function syncRouteGeometry(geometry: BufferGeometry, nodes: readonly { position: Vector3 }[], edges: readonly TopologyEdge[], capacity = edges.length * 2): void {
  const vertexCount = edges.length * 2
  const current = geometry.getAttribute('position')
  if (!current || current.count < vertexCount || current.count < capacity) {
    const attribute = new Float32BufferAttribute(Math.max(vertexCount, capacity) * 3, 3)
    geometry.setAttribute('position', attribute)
  }
  const position = geometry.getAttribute('position')
  let vertexIndex = 0
  let minX = Infinity
  let minY = Infinity
  let minZ = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  let maxZ = -Infinity
  for (const [from, to] of edges) {
    for (let endpoint = 0; endpoint < 2; endpoint += 1) {
      const nodeIndex = endpoint === 0 ? from : to
      const point = nodes[nodeIndex].position
      position.setXYZ(vertexIndex, point.x, point.y, point.z)
      vertexIndex += 1
      minX = Math.min(minX, point.x); minY = Math.min(minY, point.y); minZ = Math.min(minZ, point.z)
      maxX = Math.max(maxX, point.x); maxY = Math.max(maxY, point.y); maxZ = Math.max(maxZ, point.z)
    }
  }
  position.needsUpdate = true
  const boundingBox = geometry.boundingBox ?? new Box3()
  geometry.boundingBox = boundingBox
  boundingBox.min.set(minX, minY, minZ)
  boundingBox.max.set(maxX, maxY, maxZ)
  const boundingSphere = geometry.boundingSphere ?? new Sphere()
  geometry.boundingSphere = boundingSphere
  const center = boundingSphere.center
  center.set((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2)
  let radiusSq = 0
  for (const [from, to] of edges) {
    for (let endpoint = 0; endpoint < 2; endpoint += 1) {
      const nodeIndex = endpoint === 0 ? from : to
      radiusSq = Math.max(radiusSq, center.distanceToSquared(nodes[nodeIndex].position))
    }
  }
  boundingSphere.radius = Math.sqrt(radiusSq)
  geometry.setDrawRange(0, vertexCount)
}
