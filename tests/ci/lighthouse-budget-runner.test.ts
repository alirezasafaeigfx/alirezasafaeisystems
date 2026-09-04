import { spawn } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  ensureHeadlessChromeFlags,
  evaluateLighthouseAssertions,
  metricValueFromReport,
  selectOptimisticValue,
  waitForServer,
} from '../../scripts/ci/run-lighthouse-budget.mjs'

type Report = {
  categories: Record<string, { score: number | null }>
  audits: Record<string, { numericValue?: number }>
}

function report({ performance = 0.8, accessibility = 0.95, lcp = 3200 }: {
  performance?: number
  accessibility?: number
  lcp?: number
} = {}): Report {
  return {
    categories: {
      performance: { score: performance },
      accessibility: { score: accessibility },
      'best-practices': { score: 0.95 },
      seo: { score: 0.98 },
    },
    audits: {
      'first-contentful-paint': { numericValue: 1800 },
      'largest-contentful-paint': { numericValue: lcp },
      'cumulative-layout-shift': { numericValue: 0.05 },
      interactive: { numericValue: 3500 },
      'speed-index': { numericValue: 3000 },
    },
  }
}

function fakeServerProcess() {
  const processEmitter = new EventEmitter() as EventEmitter & { exitCode: number | null }
  processEmitter.exitCode = null
  return processEmitter
}

async function closeServer(server: ReturnType<typeof createServer>) {
  await new Promise<void>((resolvePromise, rejectPromise) => {
    server.close((error) => error ? rejectPromise(error) : resolvePromise())
  })
}

async function reservePort() {
  const server = createServer()
  await new Promise<void>((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise)
    server.listen(0, '127.0.0.1', resolvePromise)
  })
  const address = server.address()
  if (!address || typeof address === 'string') {
    await closeServer(server)
    throw new Error('failed to reserve an ephemeral TCP port')
  }
  const port = address.port
  await closeServer(server)
  return port
}

async function runNodeScript(args: string[], env: NodeJS.ProcessEnv) {
  return await new Promise<{ code: number | null, stderr: string }>((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      env,
      stdio: ['ignore', 'ignore', 'pipe'],
    })
    let stderr = ''
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk
    })
    child.once('error', rejectPromise)
    child.once('exit', (code) => resolvePromise({ code, stderr }))
  })
}

describe('Lighthouse budget runner contract', () => {
  it('preserves the existing Lighthouse budget thresholds and severities', () => {
    const config = JSON.parse(readFileSync('lighthouserc.json', 'utf8'))
    expect(config.ci.collect.numberOfRuns).toBe(3)
    expect(config.ci.assert.assertions).toEqual({
      'categories:performance': ['warn', { minScore: 0.75 }],
      'categories:accessibility': ['error', { minScore: 0.92 }],
      'categories:best-practices': ['error', { minScore: 0.93 }],
      'categories:seo': ['error', { minScore: 0.96 }],
      'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
      'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
      'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
      interactive: ['warn', { maxNumericValue: 5000 }],
      'speed-index': ['warn', { maxNumericValue: 4500 }],
    })
  })

  it('adds headless mode for direct Lighthouse CLI collection without changing the configured Chrome flags', () => {
    const configured = '--no-sandbox --disable-dev-shm-usage --no-proxy-server --allow-insecure-localhost'
    expect(ensureHeadlessChromeFlags(configured)).toBe(`${configured} --headless`)
    expect(ensureHeadlessChromeFlags(`${configured} --headless`)).toBe(`${configured} --headless`)
    expect(ensureHeadlessChromeFlags(`${configured} --headless=new`)).toBe(`${configured} --headless=new`)
  })

  it('uses optimistic aggregation: maximum score for minimum-score gates and minimum duration for maximum-value gates', () => {
    expect(selectOptimisticValue([0.74, 0.8, 0.77], 'minScore')).toBe(0.8)
    expect(selectOptimisticValue([4100, 3600, 3900], 'maxNumericValue')).toBe(3600)
  })

  it('reads category scores and audit numeric values without conflating the two namespaces', () => {
    const sample = report({ performance: 0.82, lcp: 3100 })
    expect(metricValueFromReport(sample, 'categories:performance')).toBe(0.82)
    expect(metricValueFromReport(sample, 'largest-contentful-paint')).toBe(3100)
  })

  it('fails only error-level assertions while retaining warning-level budget misses as warnings', () => {
    const result = evaluateLighthouseAssertions(
      [
        report({ performance: 0.7, accessibility: 0.9, lcp: 4500 }),
        report({ performance: 0.72, accessibility: 0.91, lcp: 4300 }),
        report({ performance: 0.73, accessibility: 0.9, lcp: 4200 }),
      ],
      {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.92 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
      },
    )

    expect(result.warnings).toEqual(expect.arrayContaining([
      expect.stringContaining('categories:performance'),
      expect.stringContaining('largest-contentful-paint'),
    ]))
    expect(result.failures).toEqual([
      expect.stringContaining('categories:accessibility'),
    ])
  })

  it('fails closed when a configured metric is absent from every report', () => {
    const result = evaluateLighthouseAssertions(
      [report(), report(), report()],
      { 'total-blocking-time': ['error', { maxNumericValue: 300 }] },
    )
    expect(result.failures).toEqual([
      expect.stringContaining('total-blocking-time'),
    ])
  })

  it('requires a successful 2xx response before declaring the start server ready', async () => {
    let requests = 0
    const server = createServer((_request, response) => {
      requests += 1
      response.statusCode = requests === 1 ? 404 : 204
      response.end()
    })
    await new Promise<void>((resolvePromise, rejectPromise) => {
      server.once('error', rejectPromise)
      server.listen(0, '127.0.0.1', resolvePromise)
    })
    const address = server.address()
    if (!address || typeof address === 'string') {
      await closeServer(server)
      throw new Error('test server did not expose a TCP port')
    }

    try {
      await waitForServer(`http://127.0.0.1:${address.port}/`, 2500, fakeServerProcess())
      expect(requests).toBeGreaterThanOrEqual(2)
    } finally {
      await closeServer(server)
    }
  })

  it('propagates start-server spawn errors through the readiness promise', async () => {
    const serverProcess = fakeServerProcess()
    serverProcess.on('error', () => {})
    const readiness = waitForServer('http://127.0.0.1:9/', 1200, serverProcess)
    setTimeout(() => serverProcess.emit('error', new Error('intentional spawn failure')), 20)

    await expect(readiness).rejects.toThrow('intentional spawn failure')
  })

  it('persists budget-summary.json when Lighthouse collection rejects', async () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'asdev-lighthouse-runner-'))
    try {
      const port = await reservePort()
      const serverScript = join(tempRoot, 'server.cjs')
      const configPath = join(tempRoot, 'lighthouserc.json')
      const outDir = join(tempRoot, 'artifacts')
      const binDir = join(tempRoot, 'bin')
      const fakePnpmJs = join(tempRoot, 'fake-pnpm.cjs')
      mkdirSync(binDir, { recursive: true })
      writeFileSync(serverScript, `const http = require('node:http')\nconst server = http.createServer((_req, res) => { res.statusCode = 204; res.end() })\nserver.listen(${port}, '127.0.0.1')\n`)
      writeFileSync(fakePnpmJs, `process.stderr.write('intentional fake Lighthouse failure\\n')\nprocess.exit(42)\n`)
      writeFileSync(configPath, `${JSON.stringify({
        ci: {
          collect: {
            url: [`http://127.0.0.1:${port}/`],
            numberOfRuns: 1,
            startServerCommand: `"${process.execPath}" "${serverScript}"`,
            startServerReadyTimeout: 5000,
            settings: { chromeFlags: '--no-sandbox' },
          },
          assert: {
            assertions: {
              'categories:accessibility': ['error', { minScore: 0.92 }],
            },
          },
        },
      }, null, 2)}\n`)

      if (process.platform === 'win32') {
        writeFileSync(join(binDir, 'pnpm.cmd'), `@echo off\r\n"${process.execPath}" "${fakePnpmJs}" %*\r\n`)
      } else {
        const fakePnpm = join(binDir, 'pnpm')
        writeFileSync(fakePnpm, `#!/usr/bin/env node\nrequire(${JSON.stringify(fakePnpmJs)})\n`)
        chmodSync(fakePnpm, 0o755)
      }

      const result = await runNodeScript([
        resolve('scripts/ci/run-lighthouse-budget.mjs'),
        '--config', configPath,
        '--out-dir', outDir,
      ], {
        ...process.env,
        CHROME_PATH: process.execPath,
        PATH: `${binDir}${delimiter}${process.env.PATH ?? ''}`,
      })

      expect(result.code).toBe(1)
      expect(result.stderr).toContain('intentional fake Lighthouse failure')
      expect(existsSync(join(outDir, 'budget-summary.json'))).toBe(true)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  })
})
