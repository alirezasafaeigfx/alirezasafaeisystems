import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { verifyHomeInitialChunks } from '../../scripts/ci/verify-home-initial-chunks.mjs'

const roots: string[] = []
const fixture = (source: string) => {
  const root = mkdtempSync(join(tmpdir(), 'asdev-home-chunks-'))
  roots.push(root)
  const chunk = 'static/chunks/home-entry.js'
  mkdirSync(join(root, '.next/server/app'), { recursive: true })
  mkdirSync(join(root, '.next/static/chunks'), { recursive: true })
  writeFileSync(join(root, '.next/server/app/page_client-reference-manifest.js'), `globalThis.__RSC_MANIFEST = { '/page': { entryJSFiles: { '[project]/src/app/page': ['${chunk}'] } } };`)
  writeFileSync(join(root, '.next', chunk), source)
  return root
}

afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })))

describe('Home initial chunk boundary', () => {
  it('rejects deferred Three route code in a manifest-selected initial chunk', () => {
    expect(() => verifyHomeInitialChunks(fixture('function WebGLRenderer() {}'))).toThrow('deferred Three route code')
  })

  it('accepts a hash-independent initial entry free of deferred Three route code', () => {
    expect(verifyHomeInitialChunks(fixture('export const home = true'))).toEqual(['static/chunks/home-entry.js'])
  })
})
