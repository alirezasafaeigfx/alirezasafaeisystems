import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

const FRAMEWORK_RUNTIME_MODULES = new Set([
  'next-app-hydration',
  'react-dom',
  'browser-polyfills',
  'next-error-boundary',
])

export function classifyModules(body) {
  const modules = []
  if (body.includes('hydrateRoot')) modules.push('next-app-hydration')
  if (body.includes('rendererPackageName:"react-dom"') || body.includes("rendererPackageName:'react-dom'")) modules.push('react-dom')
  if (body.includes('String.prototype.trimStart') && body.includes('Promise.prototype.finally')) modules.push('browser-polyfills')
  if (body.includes('var(--next-error-title)')) modules.push('next-error-boundary')
  if (body.includes('animejs')) modules.push('animejs')
  if (body.includes('WebGLRenderer')) modules.push('three')
  return modules
}

export async function loadChunkOwnership(buildDir) {
  const manifestPath = join(buildDir, 'server', 'app', 'page', 'build-manifest.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const files = [...new Set(Object.values(manifest).flatMap((value) => Array.isArray(value) ? value : []))]
  const ownership = {}
  for (const file of files) {
    if (typeof file !== 'string' || !file.endsWith('.js')) continue
    const body = await readFile(join(buildDir, file), 'utf8')
    ownership[basename(file)] = {
      manifestRoles: Object.entries(manifest)
        .filter(([, candidates]) => Array.isArray(candidates) && candidates.includes(file))
        .map(([role]) => role),
      sourceModules: classifyModules(body),
    }
  }
  return ownership
}

function frameworkOnly(ownership) {
  return Boolean(
    ownership
    && ownership.manifestRoles?.includes('rootMainFiles')
    && ownership.sourceModules?.length
    && ownership.sourceModules.every((moduleName) => FRAMEWORK_RUNTIME_MODULES.has(moduleName)),
  )
}

function chunkName(sourceURL) {
  if (!sourceURL?.includes('/_next/static/chunks/')) return null
  try {
    return basename(new URL(sourceURL).pathname)
  } catch {
    return null
  }
}

export function classifyLongAnimationFrames(frames, chunkOwnership, taskBudgetMs = 50) {
  const scriptOverBudgetFrames = []
  const candidateAttributableFrames = []
  const frameworkBootstrapFrames = []
  const renderDominatedFrames = []

  for (const frame of frames) {
    if (!(frame.blockingDuration > taskBudgetMs)) continue
    const overBudgetScripts = (frame.scripts ?? []).filter((script) => Number(script.duration) > taskBudgetMs)
    if (overBudgetScripts.length === 0) {
      renderDominatedFrames.push(frame)
      continue
    }

    scriptOverBudgetFrames.push(frame)
    const onlyFrameworkBootstrap = overBudgetScripts.every((script) => {
      const name = chunkName(script.sourceURL)
      return name ? frameworkOnly(chunkOwnership[name]) : false
    })

    if (onlyFrameworkBootstrap) frameworkBootstrapFrames.push(frame)
    else candidateAttributableFrames.push(frame)
  }

  return {
    scriptOverBudgetFrames,
    candidateAttributableFrames,
    frameworkBootstrapFrames,
    renderDominatedFrames,
  }
}
