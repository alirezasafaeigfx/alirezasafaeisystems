import { writeFile } from 'node:fs/promises'
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
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 1_600_000, uploadThroughput: 750_000, connectionType: 'wifi' })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  const scripts = []
  await page.addInitScript(() => {
    window.__budgetLongTasks = []
    window.__budgetLongAnimationFrames = []
    window.__budgetFrameTimes = []
    window.__budgetLayoutShift = 0
    window.__budgetLcp = 0
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
    if (PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
      new PerformanceObserver((list) => {
        window.__budgetLongAnimationFrames.push(...list.getEntries().map((entry) => ({
          startTime: entry.startTime,
          duration: entry.duration,
          blockingDuration: entry.blockingDuration,
          scripts: entry.scripts?.map((script) => ({ sourceURL: script.sourceURL, functionName: script.functionName, duration: script.duration })) ?? [],
        })))
      }).observe({ type: 'long-animation-frame', buffered: true })
    }
    window.__startBudgetFrameSample = (durationMs) => {
      window.__budgetFrameTimes = []
      let previous
      const started = performance.now()
      const sample = (now) => {
        if (previous !== undefined) window.__budgetFrameTimes.push(now - previous)
        previous = now
        if (now - started < durationMs) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    }
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
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await page.locator('main').waitFor()
  await page.waitForTimeout(750)
  let interactionMs = null
  const stateButtons = page.locator('[data-testid="operational-scene"] [role="group"] button')
  if (await stateButtons.count() >= 2) {
    await stateButtons.nth(1).scrollIntoViewIfNeeded()
    await page.evaluate(() => window.__startBudgetFrameSample(700))
    const startedAt = await page.evaluate(() => performance.now())
    await stateButtons.nth(1).click()
    await page.locator('[data-testid="operational-scene"]').waitFor({ state: 'visible' })
    const endedAt = await page.evaluate(() => performance.now())
    interactionMs = endedAt - startedAt
    await page.waitForTimeout(500)
  }
  const performance = await page.evaluate(() => ({
    lcp: window.__budgetLcp,
    cls: window.__budgetLayoutShift,
    longTasks: window.__budgetLongTasks,
    longAnimationFrames: window.__budgetLongAnimationFrames,
    frameTimes: window.__budgetFrameTimes,
  }))
  const result = {
    url,
    scripts,
    gzipBytes: scripts.reduce((sum, script) => sum + (script.gzipBytes ?? 0), 0),
    missingBodies: scripts.filter((script) => script.bytes === null).length,
    ...performance,
    interactionMs,
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
  return {
    url,
    runs,
    gzipBytes: median(runs.map((run) => run.gzipBytes)),
    medianLcp: median(runs.map((run) => run.lcp)),
    maxCls: Math.max(...runs.map((run) => run.cls)),
    maxInteractionMs: interactionRuns.length ? Math.max(...interactionRuns) : null,
    missingBodies: runs.reduce((sum, run) => sum + run.missingBodies, 0),
    longTasks: runs.flatMap((run, runIndex) => run.longTasks.map((task) => ({ run: runIndex + 1, ...task }))),
    longAnimationFrames: runs.flatMap((run, runIndex) => run.longAnimationFrames.map((frame) => ({ run: runIndex + 1, ...frame }))),
    frameTimeMedianMs: median(runs.flatMap((run) => run.frameTimes)),
    frameTimeP95Ms: percentile(runs.flatMap((run) => run.frameTimes), 0.95),
    profile: { cpuSlowdownMultiplier: 4, latencyMs: 40, downloadBytesPerSecond: 1_600_000, uploadBytesPerSecond: 750_000 },
  }
}

const baselineUrl = readArgument('--baseline-url')
const candidateUrl = readArgument('--candidate-url')
const output = readArgument('--output')
if (!baselineUrl || !candidateUrl || !output) {
  throw new Error('Usage: --baseline-url URL --candidate-url URL --output FILE')
}

const browser = await chromium.launch({ headless: true })
try {
  const baseline = await measureProfile(browser, baselineUrl)
  const candidate = await measureProfile(browser, candidateUrl)
  const report = {
    baseline,
    candidate,
    initialJavaScriptDeltaGzipBytes: candidate.gzipBytes - baseline.gzipBytes,
    budgetGzipBytes: 30 * 1024,
  }
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`)
  if (baseline.missingBodies || candidate.missingBodies) process.exitCode = 2
  if (report.initialJavaScriptDeltaGzipBytes > report.budgetGzipBytes) process.exitCode = 1
  if (candidate.medianLcp > 2500 || candidate.maxCls > 0.1 || (candidate.maxInteractionMs !== null && candidate.maxInteractionMs > 200)) process.exitCode = 1
  const attributableLongFrame = candidate.longAnimationFrames.some((frame) => frame.blockingDuration > 50 && frame.scripts.some((script) => script.sourceURL))
  if (attributableLongFrame || (candidate.frameTimeP95Ms !== null && candidate.frameTimeP95Ms > 50)) process.exitCode = 1
  const unattributedLongTask = candidate.longTasks.some((task) => task.duration > 50 && !task.attribution.some((item) => item.containerName || item.containerSrc))
  if (unattributedLongTask && candidate.longAnimationFrames.length === 0 && !process.exitCode) process.exitCode = 2
} finally {
  await browser.close()
}
