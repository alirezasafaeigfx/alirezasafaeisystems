import { describe, expect, it } from 'vitest'
import { SYSTEM_SCENE_STATES, transitionScene } from '@/lib/system-scene'

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
})

