import { createHash } from 'node:crypto'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const SHA = /^[0-9a-f]{40}$/i
const HASH = /^[0-9a-f]{64}$/i
const REQUIRED_CRITERIA = {
  'S1-01': ['S1-01-evidence-gating'],
  'S1-08': ['S1-08-plain-language-fa', 'S1-08-plain-language-en'],
  'S2-01': ['S2-01-accessible-primitives'],
  'S2-02': ['S2-02-flagship-documentary'],
  'S2-05': ['S2-05-provenance-verdict'],
  'S2-06': ['S2-06-flagship-index'],
  'S3-01': ['S3-01-slow-network-media'],
  'S3-03': ['S3-03-query-regression'],
  'S3-04': ['S3-04-blog-readiness'],
  'S3-05': ['S3-05-publication-contract'],
  'S3-06': ['S3-06-localized-seo'],
  'S4-01': ['S4-01-home-hierarchy'],
  'S4-02': ['S4-02-bilingual-composition'],
  'S4-03': ['S4-03-mobile-resilience'],
  'S4-05': ['S4-05-finite-motion'],
  'S4-06': ['S4-06-five-state-scene'],
  'S4-07': ['S4-07-measured-native-baseline'],
  'S4-10': ['S4-10-dependency-scope', 'S4-10-advanced-motion'],
  'S4-11': ['S4-11-gpu-deferred', 'S4-11-gpu-fallback', 'S4-11-gpu-budget'],
  'S4-12': ['S4-12-comparison-inspection'],
  'S5-01': ['S5-01-behavioral-suite', 'S5-01-visual-matrix', 'S5-01-performance-budgets', 'S5-01-independent-review'],
}

/** @typedef {{command:string,workingDirectory:string,runtime:string,startedAt:string,endedAt:string,exitCode:number,status:string,counts:{passed:number,failed:number,skipped:number}}} PublicExperienceCommand */
/** @typedef {{id:string,verdict:string,evidenceRefs:string[]}} PublicExperienceCriterion */
/** @typedef {{id:string,relativePath:string,durableUrl:string,sha256:string,locale:string,viewport:string,theme:string,state:string,captureConditions:string}} PublicExperienceArtifact */
/** @typedef {{author:string,type:string,scopeSha:string,findings:unknown[],disposition:string}} PublicExperienceReview */
/** @typedef {{schemaVersion:number,taskIds:string[],repository:string,baseSha:string,candidateSha:string,environment:string,capturedAt:string,sourceDirty:boolean,commands:PublicExperienceCommand[],criteria:PublicExperienceCriterion[],artifacts:PublicExperienceArtifact[],reviews:PublicExperienceReview[],release:Record<string, unknown>|null,limitations:string[]}} PublicExperienceEvidenceManifest */

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0

const validTimestamp = (value) => {
  const match = typeof value === 'string' ? value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?Z$/) : null
  if (!match) return false
  const [, year, month, day, hour, minute, second] = match.map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day && date.getUTCHours() === hour && date.getUTCMinutes() === minute && date.getUTCSeconds() === second
}

const isInside = (rootDir, target) => {
  const pathFromRoot = relative(rootDir, target)
  return pathFromRoot === '' || (!pathFromRoot.startsWith('..') && !isAbsolute(pathFromRoot))
}

/** @param {PublicExperienceEvidenceManifest} manifest @param {{rootDir?:string,verifyGitIdentity?:boolean}} [options] */
export function validatePublicExperienceEvidence(manifest, options = {}) {
  const errors = []
  if (!manifest || typeof manifest !== 'object') return ['manifest must be an object']
  if (manifest.schemaVersion !== 1) errors.push('schemaVersion must be 1')
  if (!Array.isArray(manifest.taskIds) || manifest.taskIds.length === 0 || manifest.taskIds.some((id) => !nonEmpty(id))) errors.push('taskIds must be a non-empty list')
  if (manifest.repository !== 'alirezasafaeigfx/alirezasafaeisystems') errors.push('repository must identify alirezasafaeigfx/alirezasafaeisystems')
  if (!SHA.test(manifest.baseSha ?? '') || !SHA.test(manifest.candidateSha ?? '')) errors.push('baseSha and candidateSha must be full SHA-1 commit IDs')
  if (!nonEmpty(manifest.environment) || !validTimestamp(manifest.capturedAt)) errors.push('environment and capturedAt must be present with a valid ISO UTC timestamp')
  if (manifest.sourceDirty !== false) errors.push('sourceDirty must be false')

  if (!Array.isArray(manifest.commands) || manifest.commands.length === 0) errors.push('commands must be non-empty')
  for (const [index, command] of (manifest.commands ?? []).entries()) {
    if (!nonEmpty(command?.command) || !nonEmpty(command?.workingDirectory) || !nonEmpty(command?.runtime)) errors.push(`command ${index} is missing command, workingDirectory, or runtime`)
    const timestampsValid = validTimestamp(command?.startedAt) && validTimestamp(command?.endedAt)
    if (!timestampsValid || (timestampsValid && Date.parse(command.startedAt) > Date.parse(command.endedAt))) errors.push(`command ${index} has invalid timestamps or ends before it starts`)
    if (!Number.isInteger(command?.exitCode) || !['pass', 'fail', 'skip'].includes(command?.status)) errors.push(`command ${index} needs an integer exitCode and pass/fail/skip status`)
    if (!command?.counts || !['passed', 'failed', 'skipped'].every((key) => Number.isInteger(command.counts[key]) && command.counts[key] >= 0)) errors.push(`command ${index} has invalid result counts`)
    else {
      const total = command.counts.passed + command.counts.failed + command.counts.skipped
      if (total === 0) errors.push(`command ${index} must report at least one result`)
      if (command.status === 'pass' && (command.exitCode !== 0 || command.counts.failed !== 0)) errors.push(`command ${index} reports pass with a failing exit code or failed results`)
      if (command.status === 'fail' && command.exitCode === 0 && command.counts.failed === 0) errors.push(`command ${index} reports fail without a failing exit code or failed results`)
      if (command.status === 'skip' && (command.counts.passed !== 0 || command.counts.failed !== 0)) errors.push(`command ${index} reports skip with executed results`)
    }
  }

  if (!Array.isArray(manifest.criteria) || manifest.criteria.length === 0) errors.push('criteria must be non-empty')
  for (const [index, criterion] of (manifest.criteria ?? []).entries()) {
    if (!nonEmpty(criterion?.id) || !['PASS', 'FAIL', 'SKIP'].includes(criterion?.verdict)) errors.push(`criterion ${index} has an invalid id or verdict`)
    if (criterion?.verdict !== 'PASS') errors.push(`criterion ${criterion?.id ?? index} is not a passing criterion`)
    if (!Array.isArray(criterion?.evidenceRefs) || criterion.evidenceRefs.length === 0 || criterion.evidenceRefs.some((ref) => !nonEmpty(ref))) errors.push(`criterion ${criterion?.id ?? index} must reference evidence`)
  }
  const criterionIds = new Set((manifest.criteria ?? []).map((criterion) => criterion?.id))
  for (const taskId of manifest.taskIds ?? []) {
    const required = REQUIRED_CRITERIA[taskId]
    if (!required) errors.push(`task ${taskId} has no registered evidence criteria`)
    else for (const criterionId of required) if (!criterionIds.has(criterionId)) errors.push(`task ${taskId} is missing required criterion ${criterionId}`)
  }

  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) errors.push('artifacts must be non-empty')
  const rootDir = realpathSync(resolve(options.rootDir ?? process.cwd()))
  const artifactIds = new Set()
  for (const [index, artifact] of (manifest.artifacts ?? []).entries()) {
    if (!nonEmpty(artifact?.id) || artifactIds.has(artifact?.id)) errors.push(`artifact ${index} must have a unique id`)
    artifactIds.add(artifact?.id)
    const relativePathValid = nonEmpty(artifact?.relativePath) && !isAbsolute(artifact.relativePath) && !artifact.relativePath.split(/[\\/]/).includes('..')
    if (!relativePathValid) errors.push(`artifact ${artifact?.id ?? index} must use a relative path without traversal`)
    const durableUrl = artifact?.durableUrl ?? ''
    const expiringActionsUrl = /https:\/\/(?:api\.)?github\.com\/(?:repos\/)?[^\s/]+\/[^\s/]+\/actions\/(?:runs|artifacts)\//i.test(durableUrl) || /[?&](?:X-Amz-|Expires=|token=|sig(?:nature)?=)/i.test(durableUrl)
    if (!nonEmpty(durableUrl) || !/^https:\/\/[^\s]+$/i.test(durableUrl) || expiringActionsUrl) errors.push(`artifact ${artifact?.id ?? index} must include a durable HTTPS URL`)
    if (!HASH.test(artifact?.sha256 ?? '')) errors.push(`artifact ${artifact?.id ?? index} has an invalid SHA-256`)
    if (!['fa', 'en'].includes(artifact?.locale) || !/^\d+x\d+$/.test(artifact?.viewport ?? '') || !['light', 'dark'].includes(artifact?.theme) || !nonEmpty(artifact?.state) || !nonEmpty(artifact?.captureConditions)) errors.push(`artifact ${artifact?.id ?? index} is missing locale, viewport, theme, state, or capture conditions`)
    const artifactPath = resolve(rootDir, relativePathValid ? artifact.relativePath : '__invalid_artifact__')
    if (!isInside(rootDir, artifactPath) || !existsSync(artifactPath)) {
      errors.push(`artifact ${artifact?.id ?? index} is not retrievable from rootDir`)
    } else if (HASH.test(artifact.sha256)) {
      const realArtifactPath = realpathSync(artifactPath)
      if (!isInside(rootDir, realArtifactPath)) errors.push(`artifact ${artifact?.id ?? index} resolves outside rootDir`)
      else {
        const actual = createHash('sha256').update(readFileSync(realArtifactPath)).digest('hex')
        if (actual !== artifact.sha256.toLowerCase()) errors.push(`artifact ${artifact.id} SHA-256 does not match its file`)
      }
    }
  }
  for (const criterion of manifest.criteria ?? []) {
    for (const ref of criterion?.evidenceRefs ?? []) if (!artifactIds.has(ref)) errors.push(`criterion ${criterion?.id ?? 'unknown'} references missing artifact ${ref}`)
  }
  if ((manifest.taskIds ?? []).includes('S5-01')) {
    const expected = new Set(['fa', 'en'].flatMap((locale) => ['390', '768', '1440'].flatMap((width) => ['light', 'dark'].map((theme) => `${locale}:${width}:${theme}`))))
    const visualRefs = new Set((manifest.criteria ?? []).find((criterion) => criterion?.id === 'S5-01-visual-matrix')?.evidenceRefs ?? [])
    const actual = new Set((manifest.artifacts ?? []).filter((artifact) => visualRefs.has(artifact?.id)).map((artifact) => {
      const width = String(artifact?.viewport ?? '').split('x')[0]
      return `${artifact?.locale}:${width}:${artifact?.theme}`
    }))
    for (const key of expected) if (!actual.has(key)) errors.push(`S5-01 visual matrix is missing ${key}`)
    const behavioralRefs = new Set((manifest.criteria ?? []).find((criterion) => criterion?.id === 'S5-01-behavioral-suite')?.evidenceRefs ?? [])
    const states = new Set((manifest.artifacts ?? []).filter((artifact) => behavioralRefs.has(artifact?.id)).map((artifact) => artifact?.state))
    for (const state of ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']) if (!states.has(state)) errors.push(`S5-01 behavioral evidence is missing state ${state}`)
  }

  if (!Array.isArray(manifest.reviews) || manifest.reviews.length === 0) errors.push('reviews must be non-empty')
  for (const [index, review] of (manifest.reviews ?? []).entries()) {
    const genericAuthor = /^(?:independent reviewer|reviewer|agent|codex|self|unknown)$/i.test(review?.author?.trim?.() ?? '')
    if (!nonEmpty(review?.author) || genericAuthor || !['human', 'independent-agent', 'self'].includes(review?.type) || review?.scopeSha !== manifest.candidateSha || !Array.isArray(review?.findings) || !['accepted', 'changes_requested', 'pending'].includes(review?.disposition)) errors.push(`review ${index} must identify a non-generic reviewer, candidate scope, findings, and disposition`)
  }
  if (!(manifest.reviews ?? []).some((review) => ['human', 'independent-agent'].includes(review?.type) && review?.disposition === 'accepted' && review?.scopeSha === manifest.candidateSha)) errors.push('manifest requires an accepted independent review for candidateSha')
  if ((manifest.reviews ?? []).some((review) => review?.disposition === 'changes_requested')) errors.push('manifest cannot pass with a changes_requested review')

  if (manifest.release !== null && (!manifest.release || !SHA.test(manifest.release.applicationSha ?? '') || manifest.release.applicationSha !== manifest.candidateSha || !nonEmpty(manifest.release.workflowRun) || !(Number.isInteger(manifest.release.workflowAttempt) || nonEmpty(manifest.release.workflowAttempt)) || !nonEmpty(manifest.release.releaseId) || !nonEmpty(manifest.release.priorRelease) || typeof manifest.release.rollbackExercised !== 'boolean')) errors.push(manifest.release?.applicationSha !== manifest.candidateSha ? 'release applicationSha must match candidateSha' : 'release must be null or contain applicationSha, workflow run, workflow attempt, releaseId, prior release, and rollback exercised state')
  if (!Array.isArray(manifest.limitations)) errors.push('limitations must be a list')

  if (options.verifyGitIdentity !== false && SHA.test(manifest.baseSha ?? '') && SHA.test(manifest.candidateSha ?? '')) {
    try {
      const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim()
      if (head !== manifest.candidateSha) errors.push('candidateSha must equal the checked-out commit')
      execFileSync('git', ['cat-file', '-e', `${manifest.baseSha}^{commit}`], { cwd: rootDir, stdio: 'ignore' })
      execFileSync('git', ['merge-base', '--is-ancestor', manifest.baseSha, manifest.candidateSha], { cwd: rootDir, stdio: 'ignore' })
    } catch {
      errors.push('baseSha and candidateSha must resolve in rootDir with baseSha as an ancestor')
    }
  }
  return errors
}

/** @param {PublicExperienceEvidenceManifest} manifest */
export async function validateRemoteArtifacts(manifest) {
  const errors = []
  for (const artifact of manifest?.artifacts ?? []) {
    if (!/^https:\/\/[^\s]+$/i.test(artifact?.durableUrl ?? '') || !HASH.test(artifact?.sha256 ?? '')) continue
    try {
      const response = await fetch(artifact.durableUrl, { redirect: 'follow' })
      if (!response.ok) {
        errors.push(`artifact ${artifact.id} remote retrieval returned HTTP ${response.status}`)
        continue
      }
      const actual = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex')
      if (actual !== artifact.sha256.toLowerCase()) errors.push(`artifact ${artifact.id} remote SHA-256 does not match its file`)
    } catch {
      errors.push(`artifact ${artifact?.id ?? 'unknown'} remote retrieval failed`)
    }
  }
  return errors
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const manifestIndex = process.argv.indexOf('--manifest')
  const rootIndex = process.argv.indexOf('--root')
  if (manifestIndex < 0 || !process.argv[manifestIndex + 1]) throw new Error('usage: node validate-public-experience-evidence.mjs --manifest <path> [--root <dir>]')
  const manifestPath = resolve(process.argv[manifestIndex + 1])
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const errors = validatePublicExperienceEvidence(manifest, { rootDir: rootIndex >= 0 ? process.argv[rootIndex + 1] : undefined })
  errors.push(...await validateRemoteArtifacts(manifest))
  if (errors.length) {
    for (const error of errors) console.error(`::error::${error}`)
    process.exitCode = 1
  } else {
    process.stdout.write(`public experience evidence manifest valid: ${manifestPath}\n`)
  }
}
