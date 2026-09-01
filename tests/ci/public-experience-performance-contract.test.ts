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

  it('fails closed for dirty sources, missing metrics, and unready child processes', () => {
    expect(runner).toContain("['status', '--porcelain']")
    expect(runner).toContain('candidate worktree must be clean')
    expect(runner).toContain('server exited before readiness')
    expect(harness).toContain('sourceDirty: false')
    expect(harness).toContain('process.exitCode = 2')
    expect(harness).toContain('requiredMetricsAvailable')
  })

  it('waits for the complete animation-frame sample before collecting metrics', () => {
    expect(harness).toContain('new Promise((resolve)')
    expect(harness).toContain('await frameSample')
  })

  it('uses isolated dynamic ports and the built standalone servers', () => {
    expect(runner).toContain("server.listen(0, '127.0.0.1'")
    expect(runner).toContain("resolve(cwd, '.next/standalone')")
    expect(runner).toContain("spawn(process.execPath, ['server.js']")
    expect(runner).not.toContain('3101')
    expect(runner).not.toContain('3102')
  })

  it('persists an explicit PASS, FAIL, or UNVERIFIED verdict', () => {
    expect(harness).toContain("const verdict = unsupportedReasons.length ? 'UNVERIFIED' : failedBudgets.length ? 'FAIL' : 'PASS'")
    expect(harness).toContain("requiredControlsAvailable")
    expect(harness).toContain("runs.every((run) => run.requiredControlsAvailable)")
    expect(harness).toContain("runs.every((run) => run.lcp > 0 && run.frameTimes.length > 0 && run.loafSupported)")
    expect(harness).toContain("required-run-metrics-unavailable")
    expect(harness).toContain("required-scene-controls-missing")
    expect(harness).toContain('unsupportedReasons')
    expect(harness).toContain('failedBudgets')
    expect(harness).toContain('cacheProfile')
  })
})
