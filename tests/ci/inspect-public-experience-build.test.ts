import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('public experience build attribution', () => {
  it('maps observed LoAF and diagnostic CPU chunk witnesses to their manifest role and source modules', () => {
    const root = mkdtempSync(join(tmpdir(), 'asdev-build-attribution-'))
    const buildDir = join(root, '.next')
    const chunkDir = join(buildDir, 'static', 'chunks')
    const manifestDir = join(buildDir, 'server', 'app', 'page')
    mkdirSync(chunkDir, { recursive: true })
    mkdirSync(manifestDir, { recursive: true })
    writeFileSync(join(manifestDir, 'build-manifest.json'), JSON.stringify({
      rootMainFiles: ['static/chunks/react-runtime.js'],
      polyfillFiles: ['static/chunks/polyfill.js'],
      lowPriorityFiles: ['static/chunks/anime-runtime.js'],
    }))
    writeFileSync(join(chunkDir, 'react-runtime.js'), 'hydrateRoot rendererPackageName:"react-dom"')
    writeFileSync(join(chunkDir, 'polyfill.js'), 'String.prototype.trimStart Promise.prototype.finally var(--next-error-title)')
    writeFileSync(join(chunkDir, 'anime-runtime.js'), 'animejs animation runtime')
    const report = join(root, 'performance.json')
    writeFileSync(report, JSON.stringify({
      candidate: {
        allRunAttributableLongAnimationFrames: [
          { scripts: [{ sourceURL: 'http://127.0.0.1/_next/static/chunks/react-runtime.js' }] },
          { scripts: [{ sourceURL: 'http://127.0.0.1/_next/static/chunks/polyfill.js' }] },
        ],
        diagnosticCpuHotspots: [
          { url: 'http://127.0.0.1/_next/static/chunks/anime-runtime.js', selfTimeMicroseconds: 82_000 },
        ],
      },
    }))

    const output = join(root, 'attribution.json')
    execFileSync(process.execPath, [
      'scripts/ci/inspect-public-experience-build.mjs',
      '--build-dir', buildDir,
      '--output', output,
      '--report', report,
    ])

    expect(JSON.parse(readFileSync(output, 'utf8'))).toMatchObject({
      chunks: [
        {
          file: 'static/chunks/react-runtime.js',
          manifestRoles: ['rootMainFiles'],
          sourceModules: ['next-app-hydration', 'react-dom'],
        },
        {
          file: 'static/chunks/polyfill.js',
          manifestRoles: ['polyfillFiles'],
          sourceModules: ['browser-polyfills', 'next-error-boundary'],
        },
        {
          file: 'static/chunks/anime-runtime.js',
          manifestRoles: ['lowPriorityFiles'],
          sourceModules: ['animejs'],
        },
      ],
    })
  })

  it('records an unresolved witness without inventing or reading a missing chunk path', () => {
    const root = mkdtempSync(join(tmpdir(), 'asdev-build-attribution-missing-'))
    const buildDir = join(root, '.next')
    const manifestDir = join(buildDir, 'server', 'app', 'page')
    mkdirSync(manifestDir, { recursive: true })
    writeFileSync(join(manifestDir, 'build-manifest.json'), JSON.stringify({
      rootMainFiles: ['static/chunks/react-runtime.js'],
    }))
    const chunkDir = join(buildDir, 'static', 'chunks')
    mkdirSync(chunkDir, { recursive: true })
    writeFileSync(join(chunkDir, 'react-runtime.js'), 'hydrateRoot rendererPackageName:"react-dom"')

    const report = join(root, 'performance.json')
    writeFileSync(report, JSON.stringify({
      candidate: {
        allRunAttributableLongAnimationFrames: [
          { scripts: [{ sourceURL: 'http://127.0.0.1/_next/static/chunks/not-in-manifest.js' }] },
        ],
        diagnosticCpuHotspots: [],
      },
    }))

    const output = join(root, 'attribution.json')
    expect(() => execFileSync(process.execPath, [
      'scripts/ci/inspect-public-experience-build.mjs',
      '--build-dir', buildDir,
      '--output', output,
      '--report', report,
    ])).not.toThrow()

    expect(JSON.parse(readFileSync(output, 'utf8'))).toMatchObject({
      unresolvedChunks: ['not-in-manifest.js'],
      chunks: [],
    })
  })
})
