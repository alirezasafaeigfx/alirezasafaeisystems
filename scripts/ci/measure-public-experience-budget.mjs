import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from '@playwright/test'
import { classifyLongAnimationFrames, loadChunkOwnership } from './public-experience-attribution.mjs'

const REQUIRED_SCENE_STATES = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']
const REQUIRED_SCENE_TRANSITION_TARGETS = ['diagnosis', 'intervention', 'stable', 'evidence', 'pressure']

function readArgument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

function summarizeCpuProfile(profile) {
  const nodes = new Map(profile.nodes.map((node) => [node.id, node.callFrame]))
  const selfTimeByNode = new Map()
  for (let index = 0; index < (profile.samples?.length ?? 0); index += 1) {
    const nodeId = profile.samples[index]
    selfTimeByNode.set(nodeId, (selfTimeByNode.get(nodeId) ?? 0) + (profile.timeDeltas?.[index] ?? 0))
  }
  return [...selfTimeByNode]
    .map(([nodeId, selfTimeMicroseconds]) => ({
      nodeId,
      selfTimeMicroseconds,
      functionName: nodes.get(nodeId)?.functionName ?? '',
      url: nodes.get(nodeId)?.url ?? '',
      lineNumber: nodes.get(nodeId)?.lineNumber ?? -1,
      columnNumber: nodes.get(nodeId)?.columnNumber ?? -1,
    }))
    .filter((sample) => sample.selfTimeMicroseconds > 0)
    .sort((left, right) => right.selfTimeMicroseconds - left.selfTimeMicroseconds)
    .slice(0, 40)
}

async function measure(browser, url, { profileCpu = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750, connectionType: 'cellular3g' })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  if (profileCpu) {
    await cdp.send('Profiler.enable')
    await cdp.send('Profiler.start')
  }
  const scripts = []
  const pendingScriptBodies = new Set()
  await page.addInitScript(() => {
    window.__budgetLongTasks = []
    window.__budgetLongAnimationFrames = []
    window.__budgetFrameTimes = []
    window.__budgetInteractionWindow = null
    window.__budgetInteractionWindows = []
    window.__budgetPhaseTimeline = [{ name: 'instrumentation-ready', at: performance.now() }]
    window.__recordBudgetPhase = (name, detail = {}) => window.__budgetPhaseTimeline.push({ name, at: performance.now(), ...detail })
    document.addEventListener('DOMContentLoaded', () => window.__recordBudgetPhase('dom-content-loaded'), { once: true })
    window.addEventListener('load', () => window.__recordBudgetPhase('window-load'), { once: true })
    window.__budgetLayoutShift = 0
    window.__budgetLcp = 0
    window.__budgetLoafSupported = PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
    new PerformanceObserver((list) => {
      window.__budgetLongTasks.push(...list.getEntries().map((entry) => ({
        startTime: entry.startTime,
        duration: entry.duration,
        attribution: entry.attribution?.map((item) => ({
          containerType: item.containerType,
          containerName: item.containerName,
          containerSrc: item.containerSrc,
        })) ?? [],
      })))
    }).observe({ type: 'longtask', buffered: true })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__budgetLayoutShift += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((list) => {
      window.__budgetLcp = list.getEntries().at(-1)?.startTime ?? window.__budgetLcp
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    if (window.__budgetLoafSupported) {
      new PerformanceObserver((list) => {
        window.__budgetLongAnimationFrames.push(...list.getEntries().map((entry) => ({
          startTime: entry.startTime,
          duration: entry.duration,
          blockingDuration: entry.blockingDuration,
          renderStart: entry.renderStart,
          styleAndLayoutStart: entry.styleAndLayoutStart,
          firstUIEventTimestamp: entry.firstUIEventTimestamp,
          scripts: entry.scripts?.map((script) => ({
            sourceURL: script.sourceURL,
            sourceFunctionName: script.sourceFunctionName,
            sourceCharPosition: script.sourceCharPosition,
            invoker: script.invoker,
            invokerType: script.invokerType,
            windowAttribution: script.windowAttribution,
            executionStart: script.executionStart,
            forcedStyleAndLayoutDuration: script.forcedStyleAndLayoutDuration,
            pauseDuration: script.pauseDuration,
            duration: script.duration,
          })) ?? [],
        })))
      }).observe({ type: 'long-animation-frame', buffered: true })
    }
    window.__startBudgetFrameSample = (durationMs) => new Promise((resolve) => {
      const frameTimes = []
      let previous
      const started = performance.now()
      const sample = (now) => {
        if (previous !== undefined) frameTimes.push(now - previous)
        previous = now
        if (now - started < durationMs) requestAnimationFrame(sample)
        else {
          window.__budgetFrameTimes.push(...frameTimes)
          resolve(frameTimes)
        }
      }
      requestAnimationFrame(sample)
    })
  })
  page.on('response', (response) => {
    if (response.request().resourceType() !== 'script') return
    const pending = (async () => {
      try {
        const body = await response.body()
        scripts.push({ url: response.url(), bytes: body.byteLength, gzipBytes: gzipSync(body).byteLength })
      } catch {
        scripts.push({ url: response.url(), bytes: null, gzipBytes: null })
      }
    })()
    pendingScriptBodies.add(pending)
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await Promise.allSettled([...pendingScriptBodies])
  await page.locator('main').waitFor()
  const scene = page.locator('[data-testid="operational-scene"]')
  await scene.waitFor({ state: 'visible' })
  await page.evaluate(() => window.__recordBudgetPhase('scene-ready'))
  await page.waitForTimeout(750)
  await page.evaluate(() => window.__recordBudgetPhase('scene-settled'))
  const transitionSamples = []
  const stateButtons = page.locator('[data-testid="operational-scene"] [role="group"] button')
  const requiredControlsAvailable = await stateButtons.count() === REQUIRED_SCENE_STATES.length
  if (requiredControlsAvailable) {
    await stateButtons.nth(0).scrollIntoViewIfNeeded()
    await page.evaluate(() => { window.__budgetInteractionWindow = { start: performance.now(), end: null } })
    for (const [sequenceIndex, expectedState] of REQUIRED_SCENE_TRANSITION_TARGETS.entries()) {
      const index = REQUIRED_SCENE_STATES.indexOf(expectedState)
      const previousState = await scene.getAttribute('data-state')
      const startedAt = await page.evaluate(({ state, sequence }) => {
        const at = performance.now()
        window.__recordBudgetPhase('transition-start', { state, sequence })
        return at
      }, { state: expectedState, sequence: sequenceIndex + 1 })
      const frameSample = page.evaluate(() => window.__startBudgetFrameSample(700))
      const clickToNextFrameMs = await stateButtons.nth(index).evaluate((button) => new Promise((resolve) => {
        const clickedAt = performance.now()
        button.click()
        requestAnimationFrame(() => resolve(performance.now() - clickedAt))
      }))
      await page.waitForFunction((state) => document.querySelector('[data-testid="operational-scene"]')?.getAttribute('data-state') === state, expectedState)
      await page.waitForTimeout(500)
      const frameTimes = await frameSample
      const endedAt = await page.evaluate(({ state, sequence }) => {
        const at = performance.now()
        window.__budgetInteractionWindows.push({ state, sequence, start: window.__budgetPhaseTimeline.findLast((item) => item.name === 'transition-start' && item.state === state && item.sequence === sequence)?.at ?? at, end: at })
        window.__recordBudgetPhase('transition-end', { state, sequence })
        return at
      }, { state: expectedState, sequence: sequenceIndex + 1 })
      transitionSamples.push({
        sequence: sequenceIndex + 1,
        previousState,
        state: expectedState,
        start: startedAt,
        end: endedAt,
        duration: endedAt - startedAt,
        clickToNextFrameMs,
        frameTimes,
      })
    }
    await page.evaluate(() => { window.__budgetInteractionWindow.end = performance.now() })
  }
  await Promise.allSettled([...pendingScriptBodies])
  const cpuHotspots = profileCpu
    ? summarizeCpuProfile((await cdp.send('Profiler.stop')).profile)
    : []
  const performance = await page.evaluate(() => ({
    lcp: window.__budgetLcp,
    loafSupported: window.__budgetLoafSupported,
    cls: window.__budgetLayoutShift,
    longTasks: window.__budgetLongTasks,
    longAnimationFrames: window.__budgetLongAnimationFrames,
    frameTimes: window.__budgetFrameTimes,
    interactionWindow: window.__budgetInteractionWindow,
    interactionWindows: window.__budgetInteractionWindows,
    phaseTimeline: window.__budgetPhaseTimeline,
    navigationTiming: (() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      return navigation ? {
        startTime: navigation.startTime,
        responseStart: navigation.responseStart,
        responseEnd: navigation.responseEnd,
        domInteractive: navigation.domInteractive,
        domContentLoadedEventStart: navigation.domContentLoadedEventStart,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
        loadEventStart: navigation.loadEventStart,
        loadEventEnd: navigation.loadEventEnd,
      } : null
    })(),
  }))
  const interactionMs = transitionSamples.length ? Math.max(...transitionSamples.map((sample) => sample.clickToNextFrameMs)) : null
  const result = {
    url,
    scripts,
    gzipBytes: scripts.reduce((sum, script) => sum + (script.gzipBytes ?? 0), 0),
    missingBodies: scripts.filter((script) => script.bytes === null).length,
    ...performance,
    interactionMs,
    transitionSamples,
    cpuHotspots,
    requiredControlsAvailable,
  }
  await context.close()
  return result
}

const median = (values) => {
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.floor(sorted.length / 2)]
}

const percentile = (values, fraction) => {
  if (!values.length) return null
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)]
}

async function measureProfile(browser, url, chunkOwnership = {}) {
  const runs = []
  for (let index = 0; index < 3; index += 1) runs.push(await measure(browser, url))
  const diagnosticRun = await measure(browser, url, { profileCpu: true })
  const interactionRuns = runs.map((run) => run.interactionMs).filter((value) => value !== null)
  const longTasks = runs.flatMap((run, runIndex) => run.longTasks.map((task) => ({ run: runIndex + 1, ...task })))
  const longAnimationFrames = runs.flatMap((run, runIndex) => run.longAnimationFrames.map((frame) => ({ run: runIndex + 1, ...frame })))
  const transitionSamples = runs.flatMap((run, runIndex) => run.transitionSamples.map((sample) => ({ run: runIndex + 1, ...sample })))
  const phaseAttributedLongAnimationFrames = runs.flatMap((run, runIndex) => run.longAnimationFrames.map((frame) => {
    const transition = run.interactionWindows.find((window) => frame.startTime + frame.duration >= window.start && frame.startTime <= window.end)
    const sceneReady = run.phaseTimeline.find((item) => item.name === 'scene-ready')?.at ?? Number.POSITIVE_INFINITY
    return { run: runIndex + 1, phase: transition ? `transition:${transition.state}` : frame.startTime <= sceneReady ? 'before-scene-ready' : 'post-scene-ready', ...frame }
  }))
  const taskAttribution = classifyLongAnimationFrames(longAnimationFrames, chunkOwnership)
  return {
    url,
    runs,
    gzipBytes: median(runs.map((run) => run.gzipBytes)),
    medianLcp: median(runs.map((run) => run.lcp)),
    maxCls: Math.max(...runs.map((run) => run.cls)),
    maxInteractionMs: interactionRuns.length ? Math.max(...interactionRuns) : null,
    missingBodies: runs.reduce((sum, run) => sum + run.missingBodies, 0),
    requiredControlsAvailable: runs.every((run) => run.requiredControlsAvailable),
    requiredTransitionMatrixAvailable: runs.every((run) => run.transitionSamples.length === REQUIRED_SCENE_STATES.length && REQUIRED_SCENE_STATES.every((state) => run.transitionSamples.some((sample) => sample.state === state))),
    requiredMetricsAvailable: runs.every((run) => run.lcp > 0 && run.frameTimes.length > 0 && run.loafSupported),
    longTasks,
    longAnimationFrames,
    phaseAttributedLongAnimationFrames,
    transitionSamples,
    diagnosticCpuHotspots: diagnosticRun.cpuHotspots,
    diagnosticPhaseTimeline: diagnosticRun.phaseTimeline,
    diagnosticLongAnimationFrames: diagnosticRun.longAnimationFrames,
    allRunOverBudgetLongTasks: longTasks.filter((task) => task.duration > 50),
    allRunScriptOverBudgetLongAnimationFrames: taskAttribution.scriptOverBudgetFrames,
    candidateAttributableLongAnimationFrames: taskAttribution.candidateAttributableFrames,
    frameworkBootstrapLongAnimationFrames: taskAttribution.frameworkBootstrapFrames,
    renderDominatedLongAnimationFrames: taskAttribution.renderDominatedFrames,
    allRunAttributableLongAnimationFrames: taskAttribution.candidateAttributableFrames,
    interactionLongAnimationFrames: runs.flatMap((run, runIndex) => run.longAnimationFrames.filter((frame) => run.interactionWindow && frame.startTime + frame.duration >= run.interactionWindow.start && frame.startTime <= run.interactionWindow.end).map((frame) => ({ run: runIndex + 1, ...frame }))),
    interactionLongTasks: runs.flatMap((run, runIndex) => run.longTasks.filter((task) => run.interactionWindow && task.startTime + task.duration >= run.interactionWindow.start && task.startTime <= run.interactionWindow.end).map((task) => ({ run: runIndex + 1, ...task }))),
    frameTimeMedianMs: runs.flatMap((run) => run.frameTimes).length ? median(runs.flatMap((run) => run.frameTimes)) : null,
    frameTimeP95Ms: percentile(runs.flatMap((run) => run.frameTimes), 0.95),
    profile: { cpuSlowdownMultiplier: 4, latencyMs: 150, downloadBytesPerSecond: 200_000, uploadBytesPerSecond: 93_750, downloadMbitPerSecond: 1.6, uploadKbitPerSecond: 750 },
  }
}

const baselineUrl = readArgument('--baseline-url')
const candidateUrl = readArgument('--candidate-url')
const baselineSha = readArgument('--baseline-sha')
const candidateSha = readArgument('--candidate-sha')
const candidateBuildDir = readArgument('--candidate-build-dir')
const output = readArgument('--output')
if (!baselineUrl || !candidateUrl || !/^[0-9a-f]{40}$/i.test(baselineSha ?? '') || !/^[0-9a-f]{40}$/i.test(candidateSha ?? '') || !candidateBuildDir || !output) {
  throw new Error('Usage: --baseline-url URL --candidate-url URL --baseline-sha SHA --candidate-sha SHA --candidate-build-dir DIR --output FILE')
}

const candidateChunkOwnership = await loadChunkOwnership(candidateBuildDir)
const browser = await chromium.launch({ headless: true })
try {
  const baseline = await measureProfile(browser, baselineUrl)
  const candidate = await measureProfile(browser, candidateUrl, candidateChunkOwnership)
  const candidateControlsAvailable = candidate.runs.every((run) => run.requiredControlsAvailable)
  const candidateTransitionMatrixAvailable = candidate.runs.every((run) => run.transitionSamples.length === REQUIRED_SCENE_STATES.length)
  const baselineMetricsAvailable = baseline.runs.every((run) => run.lcp > 0 && run.loafSupported)
  const candidateMetricsAvailable = candidate.runs.every((run) => run.lcp > 0 && run.frameTimes.length > 0 && run.loafSupported)
  const unsupportedReasons = []
  if (baseline.missingBodies || candidate.missingBodies) unsupportedReasons.push('script-response-body-missing')
  if (!candidateControlsAvailable) unsupportedReasons.push('required-scene-controls-missing')
  if (!candidateTransitionMatrixAvailable || !candidate.requiredTransitionMatrixAvailable) unsupportedReasons.push('required-transition-matrix-unavailable')
  if (!baselineMetricsAvailable || !candidateMetricsAvailable) unsupportedReasons.push('required-run-metrics-unavailable')
  if (candidate.allRunOverBudgetLongTasks.length && candidate.allRunScriptOverBudgetLongAnimationFrames.length === 0) unsupportedReasons.push('long-task-attribution-unavailable')
  const failedBudgets = []
  if (candidate.gzipBytes - baseline.gzipBytes > 30 * 1024) failedBudgets.push('initial-javascript-delta')
  if (candidate.medianLcp > 2500) failedBudgets.push('lcp')
  if (candidate.maxCls > 0.1) failedBudgets.push('cls')
  if (candidate.maxInteractionMs === null || candidate.maxInteractionMs > 200) failedBudgets.push('interaction')
  if (candidate.candidateAttributableLongAnimationFrames.length) failedBudgets.push('long-animation-frame')
  if (candidate.frameTimeP95Ms !== null && candidate.frameTimeP95Ms > 50) failedBudgets.push('frame-time-p95')
  const verdict = unsupportedReasons.length ? 'UNVERIFIED' : failedBudgets.length ? 'FAIL' : 'PASS'
  const report = {
    schemaVersion: 1,
    baseSha: baselineSha,
    candidateSha: candidateSha,
    baseline,
    candidate,
    initialJavaScriptDeltaGzipBytes: candidate.gzipBytes - baseline.gzipBytes,
    budgetGzipBytes: 30 * 1024,
    attributionPolicy: {
      taskBudgetMs: 50,
      frameworkBootstrap: 'reported-separately-when-proven-root-runtime-only',
      renderDominatedFrames: 'diagnostic-not-task-budget',
      unknownOverBudgetScriptSource: 'candidate-attributable-fail-closed',
    },
    capturedAt: new Date().toISOString(),
    browser: { name: 'chromium', version: browser.version() },
    runner: { platform: process.platform, arch: process.arch, cpus: await import('node:os').then(({ cpus }) => cpus().length), memoryBytes: (await import('node:os')).totalmem() },
    toolchain: { node: process.version },
    cacheProfile: { browserContext: 'new-per-run', httpCache: 'empty-context-default' },
    sourceDirty: false,
    verdict,
    unsupportedReasons,
    failedBudgets,
  }
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  if (verdict === 'UNVERIFIED') process.exitCode = 2
  else if (verdict === 'FAIL') process.exitCode = 1
} finally {
  await browser.close()
}
