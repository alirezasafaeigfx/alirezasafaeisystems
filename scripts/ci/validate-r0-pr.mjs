import { execFileSync } from 'node:child_process'

const ALLOWED_R0_PATHS = [
  /^\.github\/workflows\//,
  /^scripts\/ci\//,
  /^tests\/ci\//,
  /^docs\/governance\//,
  /^docs\/automation\//,
]

const APPLICATION_PATHS = [
  /^(src|app|pages|public|prisma|e2e)\//,
  /^(package\.json|pnpm-lock\.yaml|next\.config\.)/,
]

export function validateR0PullRequest({ baseSha, headSha, mainSha, changedFiles, scope }) {
  const errors = []
  if (!/^[0-9a-f]{40}$/.test(baseSha) || !/^[0-9a-f]{40}$/.test(headSha) || !/^[0-9a-f]{40}$/.test(mainSha)) {
    errors.push('base, head, and main SHAs must be full 40-character hexadecimal commit IDs')
  }
  if (scope !== 'r0-infrastructure') return errors

  if (baseSha !== mainSha) {
    errors.push(`R0 infrastructure PR must be based on current main ${mainSha}; received ${baseSha}`)
  }
  if (!changedFiles.length) errors.push('R0 infrastructure PR must contain at least one changed file')
  if (changedFiles.length > 12) errors.push(`R0 infrastructure PR changes ${changedFiles.length} files; maximum is 12`)

  for (const file of changedFiles) {
    if (APPLICATION_PATHS.some((pattern) => pattern.test(file))) {
      errors.push(`application/UI/content path is forbidden in R0 infrastructure PR: ${file}`)
    } else if (!ALLOWED_R0_PATHS.some((pattern) => pattern.test(file))) {
      errors.push(`path is outside the bounded R0 infrastructure allowlist: ${file}`)
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

const invokedPath = process.argv[1]?.replaceAll('\\', '/')

if (invokedPath && import.meta.url === `file://${invokedPath}`) {
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
  })
  if (errors.length) {
    for (const error of errors) console.error(`::error::${error}`)
    process.exit(1)
  }
  console.log(`R0 ${scope} preflight passed: base=${baseSha} head=${headSha} files=bounded`)
}
