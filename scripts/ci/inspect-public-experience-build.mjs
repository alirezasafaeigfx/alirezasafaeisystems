import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'
import { classifyModules } from './public-experience-attribution.mjs'

const values = (name) => process.argv.flatMap((value, index) => value === name ? [process.argv[index + 1]] : []).filter(Boolean)
const value = (name) => values(name).at(-1)
const buildDir = value('--build-dir')
const output = value('--output')
const reportPath = value('--report')
const explicitWitnesses = values('--chunk')

if (!buildDir || !output || (!reportPath && explicitWitnesses.length === 0)) {
  throw new Error('Usage: --build-dir DIR --output FILE (--report FILE | --chunk FILE [--chunk FILE])')
}

const report = reportPath ? JSON.parse(await readFile(reportPath, 'utf8')) : null
const reportWitnesses = report?.candidate?.allRunAttributableLongAnimationFrames
  ?.flatMap((frame) => frame.scripts ?? [])
  .map((script) => script.sourceURL)
  .filter((sourceURL) => sourceURL?.includes('/_next/static/chunks/'))
  .map((sourceURL) => new URL(sourceURL).pathname) ?? []
const diagnosticWitnesses = report?.candidate?.diagnosticCpuHotspots
  ?.map((hotspot) => hotspot.url)
  .filter((sourceURL) => sourceURL?.includes('/_next/static/chunks/'))
  .map((sourceURL) => new URL(sourceURL).pathname) ?? []
const witnesses = [...new Set([...explicitWitnesses, ...reportWitnesses, ...diagnosticWitnesses])]

const manifestPath = join(buildDir, 'server', 'app', 'page', 'build-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const candidates = [...new Set(Object.values(manifest).flatMap((files) => Array.isArray(files) ? files : []))]

const chunks = []
const unresolvedChunks = []
for (const witness of witnesses) {
  const witnessName = basename(witness)
  const file = candidates.find((candidate) => basename(candidate) === witnessName)
  if (!file) {
    unresolvedChunks.push(witnessName)
    continue
  }
  const body = await readFile(join(buildDir, file), 'utf8')
  const manifestRoles = Object.entries(manifest)
    .filter(([, files]) => Array.isArray(files) && files.includes(file))
    .map(([role]) => role)
  chunks.push({
    file: relative(buildDir, join(buildDir, file)).replaceAll('\\', '/'),
    bytes: Buffer.byteLength(body),
    manifestRoles,
    sourceModules: classifyModules(body),
  })
}

await mkdir(dirname(output), { recursive: true })
await writeFile(output, `${JSON.stringify({
  schemaVersion: 1,
  manifest: relative(buildDir, manifestPath).replaceAll('\\', '/'),
  chunks,
  unresolvedChunks: [...new Set(unresolvedChunks)],
}, null, 2)}\n`)
