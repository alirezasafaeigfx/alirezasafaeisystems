import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const ALLOWED_R0_PATHS = [
  /^\.github\/workflows\//,
  /^scripts\/ci\//,
  /^tests\/ci\//,
  /^docs\/governance\//,
  /^docs\/automation\//,
  /^docs\/reports\//,
  /^docs\/superpowers\/plans\//,
]

const ALLOWED_PUBLIC_EXPERIENCE_PATHS = [
  /^\.github\/workflows\/(ci-router|e2e-smoke|lighthouse)\.yml$/,
  /^\.github\/pull_request_template\.md$/,
  /^scripts\/ci\/(validate-(r0-pr|public-experience-evidence)|measure-public-experience-budget|public-experience-attribution|run-public-experience-comparison|verify-home-initial-chunks|create-public-experience-evidence-draft|inspect-public-experience-build|run-lighthouse-budget)\.mjs$/,
  /^scripts\/test\/seed-playwright-discover\.mjs$/,
  /^tests\/ci\/(home-initial-chunks|inspect-public-experience-build|playwright-discover-fixture|public-experience-long-task-attribution|public-experience-performance-contract|public-experience-remote-artifact|public-experience-review-copy-contract|lighthouse-budget-runner|validate-(r0-pr|public-experience-evidence))\.test\.ts$/,
  /^(package\.json|pnpm-lock\.yaml|next\.config\.ts)$/,
  /^src\/components\/(public|sections|discover|layout)\//,
  /^src\/components\/analytics\/tracked-link\.tsx$/,
  /^src\/lib\/(system-scene|system-route-geometry|home-content|evidence|discover-labels)\.ts$/,
  /^src\/generated\/sitemap-manifest\.json$/,
  /^src\/app\/(globals\.css|loading\.tsx|audit-readiness\/page\.tsx|services\/page\.tsx|thank-you\/page\.tsx|discover\/\[slug\]\/page\.tsx|case-studies\/page\.tsx|case-studies\/[^/]+\/page\.tsx)$/,
  /^src\/__tests__\/(components|discover|lib)\//,
  /^e2e\/(a11y|public-experience|system-core-3d-lifecycle|homepage-hydration|smoke)\.spec\.(?:ts|mjs)$/,
  /^docs\/(engineering|execution|governance|roadmaps)\//,
]

const PATH_CATEGORIES = [
  ['workflow', /^\.github\/workflows\//],
  ['ci', /^(?:(scripts|tests)\/ci\/|scripts\/test\/seed-playwright-discover\.mjs$)/],
  ['governance', /^(docs\/(governance|automation)\/|\.github\/pull_request_template\.md$)/],
  ['report', /^docs\/reports\//],
  ['plan', /^docs\/superpowers\/plans\//],
  ['guide', /^docs\/(engineering|execution|roadmaps)\//],
  ['content', /^(content|data|copy)\//],
  ['application', /^(src|app|pages|public|prisma|e2e)\//],
  ['deployment', /^(scripts\/(deploy|ops)|ops\/deploy)\//],
  ['release', /^(package\.json|pnpm-lock\.yaml|next\.config\.|Dockerfile|docker-compose)/],
]

function pathCategory(file) {
  return PATH_CATEGORIES.find(([, pattern]) => pattern.test(file))?.[0] ?? 'other'
}

export function validateR0PullRequest({
  baseSha,
  headSha,
  mainSha,
  changedFiles,
  scope,
  taskId = '',
  intendedBaseSha = '',
  primaryConcern = '',
  expectedCategories = /** @type {string[]} */ ([]),
  mergeBaseSha = '',
  headIsDescendant = true,
}) {
  const errors = []
  if (!/^[0-9a-f]{40}$/.test(baseSha) || !/^[0-9a-f]{40}$/.test(headSha) || !/^[0-9a-f]{40}$/.test(mainSha)) {
    errors.push('base, head, and main SHAs must be full 40-character hexadecimal commit IDs')
  }
  if (!['r0-infrastructure', 'public-experience-dependencies'].includes(scope)) return errors

  if (!taskId?.trim()) errors.push('canonical task ID is required')
  if (!intendedBaseSha?.trim()) errors.push('intended base SHA is required')
  if (!primaryConcern?.trim()) errors.push('primary concern is required')
  if (!expectedCategories?.length) errors.push('expected changed-path categories are required')
  if (intendedBaseSha && intendedBaseSha !== baseSha) {
    errors.push(`declared intended base SHA must match PR base ${baseSha}; received ${intendedBaseSha}`)
  }

  const scopeLabel = scope === 'r0-infrastructure' ? 'R0 infrastructure' : 'public-experience dependency'
  if (baseSha !== mainSha) {
    errors.push(`${scopeLabel} PR must be based on current main ${mainSha}; received ${baseSha}`)
  }
  if (mergeBaseSha && mergeBaseSha !== baseSha) {
    errors.push(`${scopeLabel} PR merge-base must equal its declared base ${baseSha}; received ${mergeBaseSha}`)
  }
  if (!headIsDescendant) errors.push(`${scopeLabel} PR head must descend from its declared base`)
  if (!changedFiles.length) errors.push(`${scopeLabel} PR must contain at least one changed file`)

  if (scope === 'public-experience-dependencies') {
    const tasks = taskId.split(/[,/]/).map((item) => item.trim()).filter(Boolean)
    if (!tasks.some((task) => ['S4-10', 'S4-11', 'S4-12'].includes(task)) || tasks.some((task) => !/^S[1-5]-\d{2}$/.test(task))) errors.push('public-experience dependency scope must declare admitted task IDs including S4-10, S4-11, or S4-12')
    if (!/public experience/i.test(primaryConcern)) errors.push('public-experience dependency primary concern must identify public experience work')
    if (changedFiles.length > 80) errors.push(`public-experience dependency PR changes ${changedFiles.length} files; maximum is 80`)
    const declared = new Set(expectedCategories ?? [])
    for (const file of changedFiles) {
      const category = pathCategory(file)
      if (!ALLOWED_PUBLIC_EXPERIENCE_PATHS.some((pattern) => pattern.test(file))) errors.push(`path is outside the bounded public-experience allowlist: ${file}`)
      if (['deployment', 'content', 'other'].includes(category)) errors.push(`${category} path category is forbidden in public-experience dependency PR: ${file}`)
      if (!declared.has(category)) errors.push(`changed path category "${category}" is not declared in expected categories`)
    }
    return errors
  }

  if (changedFiles.length > 12) errors.push(`R0 infrastructure PR changes ${changedFiles.length} files; maximum is 12`)

  const declared = new Set(expectedCategories ?? [])
  for (const file of changedFiles) {
    const category = pathCategory(file)
    if (!ALLOWED_R0_PATHS.some((pattern) => pattern.test(file))) {
      errors.push(`path is outside the bounded R0 infrastructure allowlist: ${file}`)
    }
    if (['application', 'content', 'deployment', 'release', 'other'].includes(category)) {
      errors.push(`${category} path category is forbidden in R0 infrastructure PR: ${file}`)
    }
    if (!declared.has(category)) {
      errors.push(`changed path category "${category}" is not declared in expected categories`)
    }
  }
  return errors
}

export function isGitAncestor(baseSha, headSha) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', baseSha, headSha], { encoding: 'utf8' })
    return true
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) return false
    throw error
  }
}

function changedFilesFromGit(baseSha, headSha) {
  return execFileSync('git', ['diff', '--name-only', `${baseSha}...${headSha}`], { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((file) => file.trim())
    .filter(Boolean)
}

function readOption(name) {
  const index = process.argv.indexOf(name)
  if (index === -1 || !process.argv[index + 1]) throw new Error(`missing ${name}`)
  return process.argv[index + 1]
}

function readDeclaration(eventPath) {
  if (!eventPath) return {}
  const event = JSON.parse(readFileSync(eventPath, 'utf8'))
  const body = event.pull_request?.body ?? ''
  const value = (label) => body.match(new RegExp(`^${label}:\\s*(.+)$`, 'mi'))?.[1]?.trim()
  return {
    scope: value('ASDEV-SCOPE'),
    taskId: value('ASDEV-TASK-ID'),
    intendedBaseSha: value('ASDEV-INTENDED-BASE-SHA'),
    primaryConcern: value('ASDEV-PRIMARY-CONCERN'),
    expectedCategories: value('ASDEV-EXPECTED-PATH-CATEGORIES')?.split(',').map((item) => item.trim()).filter(Boolean),
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined

if (invokedPath && import.meta.url === invokedPath) {
  const declaration = readDeclaration(process.argv.includes('--event') ? readOption('--event') : undefined)
  const baseSha = readOption('--base')
  const headSha = readOption('--head')
  const mainSha = readOption('--main')
  const scope = readOption('--scope')
  const declaredScope = ['r0-infrastructure', 'public-experience-dependencies'].includes(declaration.scope) ? declaration.scope : undefined
  const errors = validateR0PullRequest({
    baseSha,
    headSha,
    mainSha,
    changedFiles: changedFilesFromGit(baseSha, headSha),
    scope: declaredScope ?? scope,
    ...declaration,
    taskId: declaration.taskId ?? readOption('--task-id'),
    intendedBaseSha: declaration.intendedBaseSha ?? readOption('--intended-base-sha'),
    primaryConcern: declaration.primaryConcern ?? readOption('--primary-concern'),
    expectedCategories: declaration.expectedCategories ?? readOption('--expected-categories').split(',').map((item) => item.trim()).filter(Boolean),
    mergeBaseSha: execFileSync('git', ['merge-base', baseSha, headSha], { encoding: 'utf8' }).trim(),
    headIsDescendant: isGitAncestor(baseSha, headSha),
  })
  if (errors.length) {
    for (const error of errors) console.error(`::error::${error}`)
    process.exit(1)
  }
  console.log(`R0 ${scope} preflight passed: base=${baseSha} head=${headSha} files=bounded`)
}
