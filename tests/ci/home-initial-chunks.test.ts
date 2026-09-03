import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { verifyHomeInitialChunks } from '../../scripts/ci/verify-home-initial-chunks.mjs'

const roots: string[] = []
const fixture = (chunks: Record<string, string>) => {
  const root = mkdtempSync(join(tmpdir(), 'asdev-home-chunks-'))
  roots.push(root)
  mkdirSync(join(root, '.next/server/app/page'), { recursive: true })
  mkdirSync(join(root, '.next/static/chunks'), { recursive: true })
  const completeChunks = {
    'static/chunks/root-fixture.js': 'root fixture',
    'static/chunks/layout-fixture.js': 'layout fixture',
    'static/chunks/error-fixture.js': 'error fixture',
    'static/chunks/page-fixture.js': 'page fixture',
    ...chunks,
  }
  const names = Object.keys(completeChunks)
  writeFileSync(join(root, '.next/server/app/page/build-manifest.json'), JSON.stringify({ rootMainFiles: names.filter((name) => name.includes('root')) }))
  writeFileSync(join(root, '.next/server/app/page_client-reference-manifest.js'), `globalThis.__RSC_MANIFEST = { '/page': { entryJSFiles: { '[project]/src/app/layout': ${JSON.stringify(names.filter((name) => name.includes('layout')))}, '[project]/src/app/error': ${JSON.stringify(names.filter((name) => name.includes('error')))}, '[project]/src/app/page': ${JSON.stringify(names.filter((name) => name.includes('page')))} } } };`)
  for (const [chunk, source] of Object.entries(completeChunks)) writeFileSync(join(root, '.next', chunk), source)
  return root
}

const removeEntry = (root: string, entry: string) => {
  const path = join(root, '.next/server/app/page_client-reference-manifest.js')
  const entries = ['layout', 'error', 'page'].filter((name) => name !== entry)
    .map((name) => `'[project]/src/app/${name}': ['static/chunks/${name}.js']`).join(', ')
  writeFileSync(path, `globalThis.__RSC_MANIFEST = { '/page': { entryJSFiles: { ${entries} } } };`)
}

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })))

describe('Home initial chunk boundary', () => {
  it('rejects an attributed Three module in a root, layout, error, or page initial candidate', () => {
    for (const name of ['root', 'layout', 'error', 'page']) {
      expect(() => verifyHomeInitialChunks(fixture({ [`static/chunks/${name}.js`]: '"[project]/node_modules/three/src/renderers/WebGLRenderer.js"' }))).toThrow('deferred Three route code')
    }
  })

  it('rejects Anime.js runtime from the initial Home entry', () => {
    expect(() => verifyHomeInitialChunks(fixture({
      'static/chunks/page.js': '"[project]/node_modules/animejs/dist/modules/animation/index.js"',
    }))).toThrow('deferred motion runtime')
  })

  it('rejects the hydration-heavy OperationalScene shell from the initial Home entry', () => {
    expect(() => verifyHomeInitialChunks(fixture({
      'static/chunks/page.js': '"[project]/src/components/public/operational-scene.tsx"',
    }))).toThrow('hydration-heavy scene shell')
  })

  it('accepts a bounded client enhancer for the server-rendered scene', () => {
    expect(verifyHomeInitialChunks(fixture({
      'static/chunks/page.js': '"[project]/src/components/public/operational-scene-enhancer.tsx"',
    }))).toContain('static/chunks/page.js')
  })

  it('accepts benign prose that mentions Three without module attribution', () => {
    expect(verifyHomeInitialChunks(fixture({ 'static/chunks/page.js': 'const note = "THREE.js is optional"' }))).toContain('static/chunks/page.js')
  })

  it('rejects an indirectly attributed route helper in an initial candidate', () => {
    expect(() => verifyHomeInitialChunks(fixture({ 'static/chunks/layout.js': '"[project]/src/lib/system-route-geometry.ts"' }))).toThrow('deferred Three route code')
  })

  it('fails closed when a required Home entry is absent', () => {
    const root = fixture({
      'static/chunks/root.js': 'root',
      'static/chunks/layout.js': 'layout',
      'static/chunks/error.js': 'error',
      'static/chunks/page.js': 'page',
    })
    removeEntry(root, 'error')
    expect(() => verifyHomeInitialChunks(root)).toThrow('required Home entry is missing')
  })

  it('does not reject similarly named non-route modules', () => {
    expect(verifyHomeInitialChunks(fixture({
      'static/chunks/page.js': '"[project]/src/lib/system-route-geometry-not-three.ts";"[project]/src/components/public/system-core-3d-placeholder.tsx"',
    }))).toContain('static/chunks/page.js')
  })
})
