import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const harness = readFileSync('scripts/ci/measure-public-experience-budget.mjs', 'utf8')

describe('V3.2 controlled performance contract', () => {
  it('uses the documented mobile network in CDP bytes per second', () => {
    expect(harness).toContain('latency: 150')
    expect(harness).toContain('downloadThroughput: 200_000')
    expect(harness).toContain('uploadThroughput: 93_750')
    expect(harness).toContain("connectionType: 'cellular3g'")
    expect(harness).toContain('downloadMbitPerSecond: 1.6')
    expect(harness).toContain('uploadKbitPerSecond: 750')
  })

  it('evaluates over-budget work across every candidate run', () => {
    expect(harness).toContain('allRunOverBudgetLongTasks')
    expect(harness).toContain('allRunAttributableLongAnimationFrames')
    expect(harness).toContain('candidate.allRunOverBudgetLongTasks')
    expect(harness).not.toContain('candidate.interactionLongTasks.some')
  })
})
