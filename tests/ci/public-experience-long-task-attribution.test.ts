import { describe, expect, it } from 'vitest'
import { classifyLongAnimationFrames } from '../../scripts/ci/public-experience-attribution.mjs'

const frame = (blockingDuration: number, scripts: Array<{ sourceURL: string; duration: number }>) => ({
  startTime: 100,
  duration: blockingDuration + 50,
  blockingDuration,
  scripts,
})

const ownership = {
  'runtime.js': {
    manifestRoles: ['rootMainFiles'],
    sourceModules: ['next-app-hydration', 'react-dom', 'browser-polyfills'],
  },
  'app.js': {
    manifestRoles: ['pages'],
    sourceModules: [],
  },
}

describe('public experience long-task attribution', () => {
  it('does not call a render-heavy frame an attributable task when every script stays within 50ms', () => {
    const result = classifyLongAnimationFrames([
      frame(178, [{ sourceURL: 'http://candidate/', duration: 12 }]),
    ], ownership)

    expect(result.candidateAttributableFrames).toHaveLength(0)
    expect(result.frameworkBootstrapFrames).toHaveLength(0)
    expect(result.renderDominatedFrames).toHaveLength(1)
  })

  it('keeps an over-budget application script attributable', () => {
    const result = classifyLongAnimationFrames([
      frame(80, [{ sourceURL: 'http://candidate/_next/static/chunks/app.js', duration: 71 }]),
    ], ownership)

    expect(result.candidateAttributableFrames).toHaveLength(1)
    expect(result.frameworkBootstrapFrames).toHaveLength(0)
  })

  it('reports a framework-only root bootstrap separately from candidate-attributable work', () => {
    const result = classifyLongAnimationFrames([
      frame(82, [{ sourceURL: 'http://candidate/_next/static/chunks/runtime.js', duration: 74 }]),
    ], ownership)

    expect(result.candidateAttributableFrames).toHaveLength(0)
    expect(result.frameworkBootstrapFrames).toHaveLength(1)
  })

  it('fails closed when an over-budget script source cannot be mapped to a proven framework-only chunk', () => {
    const result = classifyLongAnimationFrames([
      frame(90, [{ sourceURL: 'http://candidate/_next/static/chunks/unknown.js', duration: 76 }]),
    ], ownership)

    expect(result.candidateAttributableFrames).toHaveLength(1)
    expect(result.frameworkBootstrapFrames).toHaveLength(0)
  })
})
