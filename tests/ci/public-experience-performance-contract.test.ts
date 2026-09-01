import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const harness = readFileSync('scripts/ci/measure-public-experience-budget.mjs', 'utf8')
const workflow = readFileSync('.github/workflows/e2e-smoke.yml', 'utf8')
const runner = readFileSync('scripts/ci/run-public-experience-comparison.mjs', 'utf8')

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

  it('waits for throttled script transfers before calculating initial JavaScript', () => {
    expect(harness).toContain("page.goto(url, { waitUntil: 'networkidle' })")
    expect(harness).not.toContain("page.goto(url, { waitUntil: 'domcontentloaded' })")
  })

  it('records immutable base and candidate identities in the raw report', () => {
    expect(harness).toContain("--baseline-sha")
    expect(harness).toContain("--candidate-sha")
    expect(harness).toContain('baseSha:')
    expect(harness).toContain('candidateSha:')
  })

  it('runs the comparison only where a truthful pull-request base exists', () => {
    expect(workflow).toContain("github.event_name == 'pull_request'")
    expect(workflow).toContain('PUBLIC_EXPERIENCE_BASE_SHA: ${{ github.event.pull_request.base.sha }}')
    expect(workflow).toContain('PUBLIC_EXPERIENCE_CANDIDATE_SHA: ${{ github.event.pull_request.head.sha }}')
    expect(workflow).toContain('run-public-experience-comparison.mjs')
    expect(workflow).toContain('if-no-files-found: error')
  })

  it('builds both immutable revisions in isolated worktrees and uses three-run profiling', () => {
    expect(runner).toContain("['worktree', 'add', '--detach'")
    expect(runner).toContain("'--baseline-url'")
    expect(runner).toContain("'--candidate-url'")
    expect(harness).toContain('for (let index = 0; index < 3; index += 1)')
  })
})
