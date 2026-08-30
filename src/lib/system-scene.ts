export type SystemSceneState = 'pressure' | 'diagnosis' | 'intervention' | 'stable' | 'evidence'
export type SceneEvent =
  | { type: 'select'; state: SystemSceneState }
  | { type: 'next' }
  | { type: 'previous' }

export const SYSTEM_SCENE_STATES: SystemSceneState[] = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']

export function transitionScene(current: SystemSceneState, event: SceneEvent): SystemSceneState {
  if (event.type === 'select') return event.state
  const index = SYSTEM_SCENE_STATES.indexOf(current)
  const nextIndex = event.type === 'next' ? index + 1 : index - 1
  return SYSTEM_SCENE_STATES[Math.max(0, Math.min(SYSTEM_SCENE_STATES.length - 1, nextIndex))] ?? SYSTEM_SCENE_STATES[0]
}
