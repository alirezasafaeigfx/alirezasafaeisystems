import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'

const SUPPORTED_THRESHOLD_TYPES = new Set(['minScore', 'maxNumericValue'])
const SUPPORTED_LEVELS = new Set(['warn', 'error'])

/**
 * Select the value LHCI's optimistic aggregation would use for a threshold.
 * Minimum-score assertions select the best/highest score; maximum-value
 * assertions select the best/lowest numeric value.
 */
export function selectOptimisticValue(values, thresholdType) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error('optimistic aggregation requires finite metric values')
  }
  if (thresholdType === 'minScore') return Math.max(...values)
  if (thresholdType === 'maxNumericValue') return Math.min(...values)
  throw new Error(`unsupported Lighthouse threshold type: ${thresholdType}`)
}

/**
 * Direct Lighthouse CLI collection does not inherit LHCI's headless launcher
 * behavior. Preserve every configured Chrome flag while ensuring Hosted CI does
 * not try to launch a display-backed browser.
 */
export function ensureHeadlessChromeFlags(flags = '') {
  const normalized = typeof flags === 'string' ? flags.trim() : ''
  if (/(?:^|\s)--headless(?:=[^\s]+)?(?:\s|$)/.test(normalized)) return normalized
  return normalized ? `${normalized} --headless` : '--headless'
}

/**
 * Read one configured metric from a Lighthouse Result. Category assertions use
 * `categories:<id>` while audit assertions use the audit's numericValue.
 */
export function metricValueFromReport(report, metricId) {
  if (!report || typeof report !== 'object') return undefined
  if (metricId.startsWith('categories:')) {
    const categoryId = metricId.slice('categories:'.length)
    const score = report.categories?.[categoryId]?.score
    return Number.isFinite(score) ? score : undefined
  }
  const numericValue = report.audits?.[metricId]?.numericValue
  return Number.isFinite(numericValue) ? numericValue : undefined
}

function assertionDefinition(metricId, definition) {
  if (!Array.isArray(definition) || definition.length !== 2) {
    throw new Error(`unsupported assertion definition for ${metricId}`)
  }
  const [level, options] = definition
  if (!SUPPORTED_LEVELS.has(level) || !options || typeof options !== 'object' || Array.isArray(options)) {
    throw new Error(`unsupported assertion definition for ${metricId}`)
  }
  const thresholdEntries = Object.entries(options).filter(([key]) => SUPPORTED_THRESHOLD_TYPES.has(key))
  if (thresholdEntries.length !== 1 || Object.keys(options).length !== 1) {
    throw new Error(`unsupported assertion options for ${metricId}`)
  }
  const [thresholdType, threshold] = thresholdEntries[0]
  if (!Number.isFinite(threshold)) throw new Error(`invalid assertion threshold for ${metricId}`)
  return { level, thresholdType, threshold }
}

/**
 * Evaluate a set of Lighthouse reports using the repository's bounded LHCI
 * compatibility contract. Missing metrics and unsupported assertion shapes are
 * failures regardless of severity because the budget gate must fail closed.
 */
export function evaluateLighthouseAssertions(reports, assertions) {
  const failures = []
  const warnings = []
  const results = []

  if (!Array.isArray(reports) || reports.length === 0) {
    return { failures: ['no Lighthouse reports were supplied'], warnings, results }
  }
  if (!assertions || typeof assertions !== 'object' || Array.isArray(assertions)) {
    return { failures: ['Lighthouse assertions must be an object'], warnings, results }
  }

  for (const [metricId, definition] of Object.entries(assertions)) {
    let parsed
    try {
      parsed = assertionDefinition(metricId, definition)
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error))
      continue
    }

    const values = reports.map((report) => metricValueFromReport(report, metricId))
    if (values.some((value) => !Number.isFinite(value))) {
      failures.push(`${metricId}: configured metric missing from one or more Lighthouse reports`)
      continue
    }

    const selected = selectOptimisticValue(values, parsed.thresholdType)
    const passed = parsed.thresholdType === 'minScore'
      ? selected >= parsed.threshold
      : selected <= parsed.threshold
    const detail = `${metricId}: optimistic=${selected} ${parsed.thresholdType}=${parsed.threshold}`
    results.push({ metricId, level: parsed.level, thresholdType: parsed.thresholdType, threshold: parsed.threshold, selected, passed, values })
    if (!passed) {
      if (parsed.level === 'error') failures.push(detail)
      else warnings.push(detail)
    }
  }

  return { failures, warnings, results }
}

function cliOption(name, fallback) {
  const index = process.argv.indexOf(name)
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

function safeReportName(url, runIndex) {
  const parsed = new URL(url)
  const route = parsed.pathname.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-') || 'home'
  return `${parsed.hostname}-${route}-run-${runIndex + 1}.json`
}

function runCommand(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })
    child.once('error', rejectPromise)
    child.once('exit', (code, signal) => {
      if (code === 0) resolvePromise()
      else rejectPromise(new Error(`${command} exited with ${code ?? `signal ${signal}`}`))
    })
  })
}

async function waitForServer(url, timeoutMs, serverProcess) {
  const deadline = Date.now() + timeoutMs
  let lastError = 'server not ready'
  while (Date.now() < deadline) {
    if (serverProcess.exitCode !== null) throw new Error(`start server command exited early with ${serverProcess.exitCode}`)
    try {
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(5000) })
      if (response.status < 500) return
      lastError = `HTTP ${response.status}`
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 1000))
  }
  throw new Error(`start server readiness timed out after ${timeoutMs}ms: ${lastError}`)
}

function terminateProcessTree(child) {
  if (!child || child.exitCode !== null || !child.pid) return
  try {
    if (process.platform !== 'win32') process.kill(-child.pid, 'SIGTERM')
    else child.kill('SIGTERM')
  } catch {
    child.kill('SIGTERM')
  }
}

async function runLighthouseBudgetCli() {
  const configPath = resolve(cliOption('--config', 'lighthouserc.json'))
  const outDir = resolve(cliOption('--out-dir', 'artifacts/lighthouse'))
  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const collect = config?.ci?.collect
  const assertions = config?.ci?.assert?.assertions

  if (!collect || !Array.isArray(collect.url) || collect.url.length === 0) throw new Error('Lighthouse config must define ci.collect.url')
  if (!Number.isInteger(collect.numberOfRuns) || collect.numberOfRuns < 1) throw new Error('Lighthouse config must define a positive ci.collect.numberOfRuns')
  if (!collect.startServerCommand || typeof collect.startServerCommand !== 'string') throw new Error('Lighthouse config must define ci.collect.startServerCommand')
  if (!assertions || typeof assertions !== 'object' || Array.isArray(assertions)) throw new Error('Lighthouse config must define ci.assert.assertions')
  if (!process.env.CHROME_PATH) throw new Error('CHROME_PATH must point to the Hosted Chromium executable')

  mkdirSync(outDir, { recursive: true })
  const serverProcess = spawn(collect.startServerCommand, [], {
    shell: true,
    detached: process.platform !== 'win32',
    stdio: 'inherit',
    env: process.env,
  })

  const summary = {
    schemaVersion: 1,
    config: basename(configPath),
    aggregationMethod: 'optimistic',
    numberOfRuns: collect.numberOfRuns,
    urls: [],
    warnings: [],
    failures: [],
  }

  try {
    await waitForServer(collect.url[0], Number(collect.startServerReadyTimeout ?? 120000), serverProcess)
    for (const url of collect.url) {
      const reports = []
      const reportPaths = []
      for (let runIndex = 0; runIndex < collect.numberOfRuns; runIndex += 1) {
        const outputPath = resolve(outDir, safeReportName(url, runIndex))
        const chromeFlags = ensureHeadlessChromeFlags(collect.settings?.chromeFlags)
        const args = ['exec', 'lighthouse', url, '--output=json', `--output-path=${outputPath}`, '--quiet', `--chrome-flags=${chromeFlags}`]
        await runCommand('pnpm', args, { env: process.env })
        reports.push(JSON.parse(readFileSync(outputPath, 'utf8')))
        reportPaths.push(outputPath)
      }

      const evaluation = evaluateLighthouseAssertions(reports, assertions)
      summary.urls.push({ url, reports: reportPaths.map((path) => basename(path)), results: evaluation.results })
      summary.warnings.push(...evaluation.warnings.map((warning) => `${url} — ${warning}`))
      summary.failures.push(...evaluation.failures.map((failure) => `${url} — ${failure}`))
    }
  } finally {
    terminateProcessTree(serverProcess)
  }

  writeFileSync(resolve(outDir, 'budget-summary.json'), `${JSON.stringify(summary, null, 2)}\n`)
  for (const warning of summary.warnings) console.warn(`Lighthouse budget warning: ${warning}`)
  for (const failure of summary.failures) console.error(`Lighthouse budget failure: ${failure}`)
  console.log(`Lighthouse budget summary: urls=${summary.urls.length} runs=${collect.numberOfRuns} warnings=${summary.warnings.length} failures=${summary.failures.length}`)
  if (summary.failures.length) process.exitCode = 1
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined
if (invokedPath && import.meta.url === invokedPath) {
  runLighthouseBudgetCli().catch((error) => {
    console.error(error instanceof Error ? error.stack ?? error.message : String(error))
    process.exitCode = 1
  })
}
