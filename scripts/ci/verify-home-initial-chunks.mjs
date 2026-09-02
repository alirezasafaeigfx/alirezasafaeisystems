import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import vm from 'node:vm'

const DEFERRED_THREE_MODULE = /\[project\]\/((node_modules\/(?:.*\/)?three\/)|(src\/(?:lib\/system-route-geometry|components\/public\/system-core-3d)(?:\.[cm]?[jt]sx?|\/)))/
const DEFERRED_MOTION_RUNTIME = /\[project\]\/node_modules\/(?:.*\/)?animejs\//
const REQUIRED_HOME_ENTRIES = ['[project]/src/app/layout', '[project]/src/app/error', '[project]/src/app/page']

export function verifyHomeInitialChunks(rootDir = process.cwd()) {
  const manifestPath = resolve(rootDir, '.next/server/app/page_client-reference-manifest.js')
  if (!existsSync(manifestPath)) throw new Error(`Home client-reference manifest not found: ${manifestPath}`)
  const buildManifestPath = resolve(rootDir, '.next/server/app/page/build-manifest.json')
  if (!existsSync(buildManifestPath)) throw new Error(`Home build manifest not found: ${buildManifestPath}`)
  const context = {}
  context.globalThis = context
  vm.runInNewContext(readFileSync(manifestPath, 'utf8'), context, { filename: manifestPath })
  const manifest = context.__RSC_MANIFEST?.['/page']
  const entryJSFiles = manifest?.entryJSFiles
  if (!entryJSFiles || typeof entryJSFiles !== 'object') throw new Error('Home client-reference manifest entryJSFiles are missing')
  const pageEntries = REQUIRED_HOME_ENTRIES.flatMap((entry) => {
    const files = entryJSFiles[entry]
    if (!Array.isArray(files) || files.length === 0 || files.some((file) => typeof file !== 'string')) {
      throw new Error(`required Home entry is missing or malformed: ${entry}`)
    }
    return files
  })
  const rootMainFiles = JSON.parse(readFileSync(buildManifestPath, 'utf8')).rootMainFiles
  if (!Array.isArray(rootMainFiles) || rootMainFiles.length === 0 || rootMainFiles.some((file) => typeof file !== 'string')) {
    throw new Error('Home build manifest rootMainFiles are missing or malformed')
  }
  const chunks = [...new Set([...rootMainFiles, ...pageEntries])]
  if (!Array.isArray(chunks) || chunks.length === 0) throw new Error('Home initial entry chunks are missing from the client-reference manifest')
  const sources = chunks.map((chunk) => ({ chunk, source: readFileSync(resolve(rootDir, '.next', chunk), 'utf8') }))
  const threeOffenders = sources.filter(({ source }) => DEFERRED_THREE_MODULE.test(source)).map(({ chunk }) => chunk)
  if (threeOffenders.length) throw new Error(`Home initial entry includes deferred Three route code: ${threeOffenders.join(', ')}`)
  const motionOffenders = sources.filter(({ source }) => DEFERRED_MOTION_RUNTIME.test(source)).map(({ chunk }) => chunk)
  if (motionOffenders.length) throw new Error(`Home initial entry includes deferred motion runtime: ${motionOffenders.join(', ')}`)
  return chunks
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const chunks = verifyHomeInitialChunks()
  process.stdout.write(`Home initial chunks contain no deferred Three route code or motion runtime (${chunks.length} chunks).\n`)
}
