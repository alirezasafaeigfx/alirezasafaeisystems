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
  const scripts = []
  await page.addInitScript(() => {
    window.__budgetLongTasks = []
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
  const attributableLongTask = candidate.longTasks.some((task) => task.duration > 50 && task.attribution.some((item) => item.containerName || item.containerSrc))
  if (attributableLongTask) process.exitCode = 1
} finally {
  await browser.close()
}
