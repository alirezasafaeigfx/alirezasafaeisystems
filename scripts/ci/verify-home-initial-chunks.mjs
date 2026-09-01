import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import vm from 'node:vm'

const FORBIDDEN = /WebGLRenderer|Float32BufferAttribute|system-route-geometry|syncRouteGeometry|THREE\./

export function verifyHomeInitialChunks(rootDir = process.cwd()) {
  const manifestPath = resolve(rootDir, '.next/server/app/page_client-reference-manifest.js')
  if (!existsSync(manifestPath)) throw new Error(`Home client-reference manifest not found: ${manifestPath}`)
  const context = {}
  context.globalThis = context
  vm.runInNewContext(readFileSync(manifestPath, 'utf8'), context, { filename: manifestPath })
  const manifest = context.__RSC_MANIFEST?.['/page']
  const chunks = manifest?.entryJSFiles?.['[project]/src/app/page']
  if (!Array.isArray(chunks) || chunks.length === 0) throw new Error('Home initial entry chunks are missing from the client-reference manifest')
  const offenders = chunks.map((chunk) => ({ chunk, source: readFileSync(resolve(rootDir, '.next', chunk), 'utf8') }))
    .filter(({ source }) => FORBIDDEN.test(source))
    .map(({ chunk }) => chunk)
  if (offenders.length) throw new Error(`Home initial entry includes deferred Three route code: ${offenders.join(', ')}`)
  return chunks
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chunks = verifyHomeInitialChunks()
  process.stdout.write(`Home initial chunks contain no deferred Three route code (${chunks.length} chunks).\n`)
}
