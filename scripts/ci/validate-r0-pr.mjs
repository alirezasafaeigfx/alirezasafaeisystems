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

const PATH_CATEGORIES = [
  ['workflow', /^\.github\/workflows\//],
  ['ci', /^(scripts|tests)\/ci\//],
  ['governance', /^docs\/(governance|automation)\//],
  ['report', /^docs\/reports\//],
  ['plan', /^docs\/superpowers\/plans\//],
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
  taskId,
  intendedBaseSha,
  primaryConcern,
  expectedCategories,
  mergeBaseSha,
  headIsDescendant = true,
}) {
  const errors = []
  if (!/^[0-9a-f]{40}$/.test(baseSha) || !/^[0-9a-f]{40}$/.test(headSha) || !/^[0-9a-f]{40}$/.test(mainSha)) {
    errors.push('base, head, and main SHAs must be full 40-character hexadecimal commit IDs')
  }
  if (scope !== 'r0-infrastructure') return errors

  if (!taskId?.trim()) errors.push('canonical task ID is required')
  if (!intendedBaseSha?.trim()) errors.push('intended base SHA is required')
  if (!primaryConcern?.trim()) errors.push('primary concern is required')
  if (!expectedCategories?.length) errors.push('expected changed-path categories are required')
  if (intendedBaseSha && intendedBaseSha !== baseSha) {
    errors.push(`declared intended base SHA must match PR base ${baseSha}; received ${intendedBaseSha}`)
  }

  if (baseSha !== mainSha) {
    errors.push(`R0 infrastructure PR must be based on current main ${mainSha}; received ${baseSha}`)
  }
  if (mergeBaseSha && mergeBaseSha !== baseSha) {
    errors.push(`R0 infrastructure PR merge-base must equal its declared base ${baseSha}; received ${mergeBaseSha}`)
  }
  if (!headIsDescendant) errors.push('R0 infrastructure PR head must descend from its declared base')
  if (!changedFiles.length) errors.push('R0 infrastructure PR must contain at least one changed file')
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
  const errors = validateR0PullRequest({
    baseSha,
    headSha,
    mainSha,
    changedFiles: changedFilesFromGit(baseSha, headSha),
    scope,
    ...declaration,
    taskId: declaration.taskId ?? readOption('--task-id'),
    intendedBaseSha: declaration.intendedBaseSha ?? readOption('--intended-base-sha'),
    primaryConcern: declaration.primaryConcern ?? readOption('--primary-concern'),
    expectedCategories: declaration.expectedCategories ?? readOption('--expected-categories').split(',').map((item) => item.trim()).filter(Boolean),
    mergeBaseSha: execFileSync('git', ['merge-base', baseSha, headSha], { encoding: 'utf8' }).trim(),
    headIsDescendant: execFileSync('git', ['merge-base', '--is-ancestor', baseSha, headSha], { encoding: 'utf8' }) === '',
  })
  if (errors.length) {
    for (const error of errors) console.error(`::error::${error}`)
    process.exit(1)
  }
  console.log(`R0 ${scope} preflight passed: base=${baseSha} head=${headSha} files=bounded`)
}
