import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('public experience build attribution', () => {
  it('maps observed chunk witnesses to their manifest role and source modules', () => {
    const root = mkdtempSync(join(tmpdir(), 'asdev-build-attribution-'))
    const buildDir = join(root, '.next')
    const chunkDir = join(buildDir, 'static', 'chunks')
    const manifestDir = join(buildDir, 'server', 'app', 'page')
    mkdirSync(chunkDir, { recursive: true })
    mkdirSync(manifestDir, { recursive: true })
    writeFileSync(join(manifestDir, 'build-manifest.json'), JSON.stringify({
      rootMainFiles: ['static/chunks/react-runtime.js'],
      polyfillFiles: ['static/chunks/polyfill.js'],
    }))
    writeFileSync(join(chunkDir, 'react-runtime.js'), 'hydrateRoot rendererPackageName:"react-dom"')
    writeFileSync(join(chunkDir, 'polyfill.js'), 'String.prototype.trimStart Promise.prototype.finally var(--next-error-title)')
    const report = join(root, 'performance.json')
    writeFileSync(report, JSON.stringify({ candidate: { allRunAttributableLongAnimationFrames: [
      { scripts: [{ sourceURL: 'http://127.0.0.1/_next/static/chunks/react-runtime.js' }] },
      { scripts: [{ sourceURL: 'http://127.0.0.1/_next/static/chunks/polyfill.js' }] },
    ] } }))

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
      ],
    })
  })
})
