import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const SHA = /^[0-9a-f]{40}$/i

const git = (args, rootDir) => execFileSync('git', args, { cwd: rootDir, encoding: 'utf8' }).trim()

export function createPublicExperienceEvidenceDraft({ rootDir = process.cwd(), baseSha, candidateSha, taskIds }) {
  if (!SHA.test(baseSha ?? '') || !SHA.test(candidateSha ?? '')) throw new Error('baseSha and candidateSha must be full SHA-1 commit IDs')
  if (!Array.isArray(taskIds) || taskIds.length === 0 || taskIds.some((taskId) => typeof taskId !== 'string' || taskId.trim() === '')) throw new Error('taskIds must be a non-empty list')
  const manifestPath = resolve(rootDir, 'test-results/public-experience', candidateSha, 'manifest.json')
  mkdirSync(dirname(manifestPath), { recursive: true })
  writeFileSync(manifestPath, `${JSON.stringify({
    schemaVersion: 1,
    taskIds,
    repository: 'alirezasafaeigfx/alirezasafaeisystems',
    baseSha,
    candidateSha,
    environment: 'GITHUB_ACTIONS_DRAFT',
    capturedAt: new Date().toISOString(),
    sourceDirty: false,
    commands: [],
    criteria: [],
    artifacts: [],
    reviews: [],
    release: null,
    limitations: ['Draft only: replace every empty evidence field and publish durable non-Actions URLs before validation.'],
  }, null, 2)}\n`, 'utf8')
  return manifestPath
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const rootDir = process.cwd()
  const candidateSha = process.env.PUBLIC_EXPERIENCE_CANDIDATE_SHA || git(['rev-parse', 'HEAD'], rootDir)
  const requestedBaseSha = process.env.PUBLIC_EXPERIENCE_BASE_SHA
  const baseSha = SHA.test(requestedBaseSha ?? '') ? requestedBaseSha : git(['rev-parse', `${candidateSha}^`], rootDir)
  const taskIds = process.argv.slice(2)
  const manifestPath = createPublicExperienceEvidenceDraft({ rootDir, baseSha, candidateSha, taskIds })
  process.stdout.write(`public experience evidence draft created: ${manifestPath}\n`)
}
