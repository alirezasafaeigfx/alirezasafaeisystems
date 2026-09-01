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
  const names = Object.keys(chunks)
  writeFileSync(join(root, '.next/server/app/page/build-manifest.json'), JSON.stringify({ rootMainFiles: names.filter((name) => name.includes('root')) }))
  writeFileSync(join(root, '.next/server/app/page_client-reference-manifest.js'), `globalThis.__RSC_MANIFEST = { '/page': { entryJSFiles: { '[project]/src/app/layout': ${JSON.stringify(names.filter((name) => name.includes('layout')))}, '[project]/src/app/error': ${JSON.stringify(names.filter((name) => name.includes('error')))}, '[project]/src/app/page': ${JSON.stringify(names.filter((name) => name.includes('page')))} } } };`)
  for (const [chunk, source] of Object.entries(chunks)) writeFileSync(join(root, '.next', chunk), source)
  return root
}

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })))

describe('Home initial chunk boundary', () => {
  it('rejects an attributed Three module in a root, layout, error, or page initial candidate', () => {
    for (const name of ['root', 'layout', 'error', 'page']) {
      expect(() => verifyHomeInitialChunks(fixture({ [`static/chunks/${name}.js`]: '"[project]/node_modules/three/src/renderers/WebGLRenderer.js"' }))).toThrow('deferred Three route code')
    }
  })

  it('accepts benign prose that mentions Three without module attribution', () => {
    expect(verifyHomeInitialChunks(fixture({ 'static/chunks/page.js': 'const note = "THREE.js is optional"' }))).toEqual(['static/chunks/page.js'])
  })

  it('rejects an indirectly attributed route helper in an initial candidate', () => {
    expect(() => verifyHomeInitialChunks(fixture({ 'static/chunks/layout.js': '"[project]/src/lib/system-route-geometry.ts"' }))).toThrow('deferred Three route code')
  })
})
