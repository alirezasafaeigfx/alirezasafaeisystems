import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from '@playwright/test'

function readArgument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

async function measure(browser, url) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750, connectionType: 'cellular3g' })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  const scripts = []
  await page.addInitScript(() => {
    window.__budgetLongTasks = []
    window.__budgetLongAnimationFrames = []
    window.__budgetFrameTimes = []
    window.__budgetInteractionWindow = null
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
          scripts: entry.scripts?.map((script) => ({ sourceURL: script.sourceURL, functionName: script.functionName, duration: script.duration })) ?? [],
        })))
      }).observe({ type: 'long-animation-frame', buffered: true })
    }
    window.__startBudgetFrameSample = (durationMs) => new Promise((resolve) => {
      window.__budgetFrameTimes = []
      let previous
      const started = performance.now()
      const sample = (now) => {
        if (previous !== undefined) window.__budgetFrameTimes.push(now - previous)
        previous = now
        if (now - started < durationMs) requestAnimationFrame(sample)
        else resolve()
      }
      requestAnimationFrame(sample)
    })
  })
  page.on('response', async (response) => {
    if (response.request().resourceType() !== 'script') return
    try {
      const body = await response.body()
      scripts.push({ url: response.url(), bytes: body.byteLength, gzipBytes: gzipSync(body).byteLength })
    } catch {
      scripts.push({ url: response.url(), bytes: null, gzipBytes: null })
    }
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.locator('main').waitFor()
  await page.waitForTimeout(750)
  let interactionMs = null
  const stateButtons = page.locator('[data-testid="operational-scene"] [role="group"] button')
  const requiredControlsAvailable = await stateButtons.count() >= 2
  if (requiredControlsAvailable) {
    await stateButtons.nth(1).scrollIntoViewIfNeeded()
    const frameSample = page.evaluate(() => window.__startBudgetFrameSample(700))
    await page.evaluate(() => { window.__budgetInteractionWindow = { start: performance.now(), end: null } })
    interactionMs = await stateButtons.nth(1).evaluate((button) => new Promise((resolve) => {
      const startedAt = performance.now()
      button.click()
      requestAnimationFrame(() => resolve(performance.now() - startedAt))
    }))
    await page.locator('[data-testid="operational-scene"]').waitFor({ state: 'visible' })
    await page.waitForTimeout(500)
    await frameSample
    await page.evaluate(() => { window.__budgetInteractionWindow.end = performance.now() })
  }
  const performance = await page.evaluate(() => ({
    lcp: window.__budgetLcp,
    loafSupported: window.__budgetLoafSupported,
    cls: window.__budgetLayoutShift,
    longTasks: window.__budgetLongTasks,
    longAnimationFrames: window.__budgetLongAnimationFrames,
    frameTimes: window.__budgetFrameTimes,
    interactionWindow: window.__budgetInteractionWindow,
  }))
  const result = {
    url,
    scripts,
    gzipBytes: scripts.reduce((sum, script) => sum + (script.gzipBytes ?? 0), 0),
    missingBodies: scripts.filter((script) => script.bytes === null).length,
    ...performance,
    interactionMs,
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

async function measureProfile(browser, url) {
  const runs = []
  for (let index = 0; index < 3; index += 1) runs.push(await measure(browser, url))
  const interactionRuns = runs.map((run) => run.interactionMs).filter((value) => value !== null)
  const longTasks = runs.flatMap((run, runIndex) => run.longTasks.map((task) => ({ run: runIndex + 1, ...task })))
  const longAnimationFrames = runs.flatMap((run, runIndex) => run.longAnimationFrames.map((frame) => ({ run: runIndex + 1, ...frame })))
  return {
    url,
    runs,
    gzipBytes: median(runs.map((run) => run.gzipBytes)),
    medianLcp: median(runs.map((run) => run.lcp)),
    maxCls: Math.max(...runs.map((run) => run.cls)),
    maxInteractionMs: interactionRuns.length ? Math.max(...interactionRuns) : null,
    missingBodies: runs.reduce((sum, run) => sum + run.missingBodies, 0),
    requiredControlsAvailable: runs.every((run) => run.requiredControlsAvailable),
    requiredMetricsAvailable: runs.every((run) => run.lcp > 0 && run.frameTimes.length > 0 && run.loafSupported),
    longTasks,
    longAnimationFrames,
    allRunOverBudgetLongTasks: longTasks.filter((task) => task.duration > 50),
    allRunAttributableLongAnimationFrames: longAnimationFrames.filter((frame) => frame.blockingDuration > 50 && frame.scripts.some((script) => script.sourceURL)),
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
const output = readArgument('--output')
if (!baselineUrl || !candidateUrl || !/^[0-9a-f]{40}$/i.test(baselineSha ?? '') || !/^[0-9a-f]{40}$/i.test(candidateSha ?? '') || !output) {
  throw new Error('Usage: --baseline-url URL --candidate-url URL --baseline-sha SHA --candidate-sha SHA --output FILE')
}

const browser = await chromium.launch({ headless: true })
try {
  const baseline = await measureProfile(browser, baselineUrl)
  const candidate = await measureProfile(browser, candidateUrl)
  const unsupportedReasons = []
  if (baseline.missingBodies || candidate.missingBodies) unsupportedReasons.push('script-response-body-missing')
  if (!baseline.requiredControlsAvailable || !candidate.requiredControlsAvailable) unsupportedReasons.push('required-scene-controls-missing')
  if (!baseline.requiredMetricsAvailable || !candidate.requiredMetricsAvailable) unsupportedReasons.push('required-run-metrics-unavailable')
  if (candidate.allRunOverBudgetLongTasks.length && candidate.allRunAttributableLongAnimationFrames.length === 0) unsupportedReasons.push('long-task-attribution-unavailable')
  const failedBudgets = []
  if (candidate.gzipBytes - baseline.gzipBytes > 30 * 1024) failedBudgets.push('initial-javascript-delta')
  if (candidate.medianLcp > 2500) failedBudgets.push('lcp')
  if (candidate.maxCls > 0.1) failedBudgets.push('cls')
  if (candidate.maxInteractionMs === null || candidate.maxInteractionMs > 200) failedBudgets.push('interaction')
  if (candidate.allRunAttributableLongAnimationFrames.length) failedBudgets.push('long-animation-frame')
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
