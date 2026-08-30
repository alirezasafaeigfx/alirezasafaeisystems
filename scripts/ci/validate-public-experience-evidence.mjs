import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'

const SHA = /^[0-9a-f]{40}$/i
const HASH = /^[0-9a-f]{64}$/i
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

/** @typedef {{command:string,workingDirectory:string,runtime:string,startedAt:string,endedAt:string,exitCode:number,status:string,counts:{passed:number,failed:number,skipped:number}}} PublicExperienceCommand */
/** @typedef {{id:string,verdict:string,evidenceRefs:string[]}} PublicExperienceCriterion */
/** @typedef {{id:string,relativePath:string,sha256:string,locale:string,viewport:string,state:string,captureConditions:string}} PublicExperienceArtifact */
/** @typedef {{author:string,type:string,scopeSha:string,findings:unknown[],disposition:string}} PublicExperienceReview */
/** @typedef {{schemaVersion:number,taskIds:string[],repository:string,baseSha:string,candidateSha:string,environment:string,capturedAt:string,sourceDirty:boolean,commands:PublicExperienceCommand[],criteria:PublicExperienceCriterion[],artifacts:PublicExperienceArtifact[],reviews:PublicExperienceReview[],release:Record<string, unknown>|null,limitations:string[]}} PublicExperienceEvidenceManifest */

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0

/** @param {PublicExperienceEvidenceManifest} manifest @param {{rootDir?:string}} [options] */
export function validatePublicExperienceEvidence(manifest, options = {}) {
  const errors = []
  if (!manifest || typeof manifest !== 'object') return ['manifest must be an object']
  if (manifest.schemaVersion !== 1) errors.push('schemaVersion must be 1')
  if (!Array.isArray(manifest.taskIds) || manifest.taskIds.length === 0 || manifest.taskIds.some((id) => !nonEmpty(id))) errors.push('taskIds must be a non-empty list')
  if (manifest.repository !== 'alirezasafaeigfx/alirezasafaeisystems') errors.push('repository must identify alirezasafaeigfx/alirezasafaeisystems')
  if (!SHA.test(manifest.baseSha ?? '') || !SHA.test(manifest.candidateSha ?? '')) errors.push('baseSha and candidateSha must be full SHA-1 commit IDs')
  if (!nonEmpty(manifest.environment) || !ISO.test(manifest.capturedAt ?? '') || Number.isNaN(Date.parse(manifest.capturedAt))) errors.push('environment and capturedAt must be present with an ISO UTC timestamp')
  if (manifest.sourceDirty !== false) errors.push('sourceDirty must be false')

  if (!Array.isArray(manifest.commands) || manifest.commands.length === 0) errors.push('commands must be non-empty')
  for (const [index, command] of (manifest.commands ?? []).entries()) {
    if (!nonEmpty(command?.command) || !nonEmpty(command?.workingDirectory) || !nonEmpty(command?.runtime)) errors.push(`command ${index} is missing command, workingDirectory, or runtime`)
    if (!ISO.test(command?.startedAt ?? '') || !ISO.test(command?.endedAt ?? '')) errors.push(`command ${index} has invalid timestamps`)
    if (!Number.isInteger(command?.exitCode) || !['pass', 'fail', 'skip'].includes(command?.status)) errors.push(`command ${index} needs an integer exitCode and pass/fail/skip status`)
    if (!command?.counts || !['passed', 'failed', 'skipped'].every((key) => Number.isInteger(command.counts[key]) && command.counts[key] >= 0)) errors.push(`command ${index} has invalid result counts`)
  }

  if (!Array.isArray(manifest.criteria) || manifest.criteria.length === 0) errors.push('criteria must be non-empty')
  for (const [index, criterion] of (manifest.criteria ?? []).entries()) {
    if (!nonEmpty(criterion?.id) || !['PASS', 'FAIL', 'SKIP'].includes(criterion?.verdict)) errors.push(`criterion ${index} has an invalid id or verdict`)
    if (criterion?.verdict !== 'PASS') errors.push(`criterion ${criterion?.id ?? index} is not a passing criterion`)
    if (!Array.isArray(criterion?.evidenceRefs) || criterion.evidenceRefs.length === 0 || criterion.evidenceRefs.some((ref) => !nonEmpty(ref))) errors.push(`criterion ${criterion?.id ?? index} must reference evidence`)
  }

  if (!Array.isArray(manifest.artifacts) || manifest.artifacts.length === 0) errors.push('artifacts must be non-empty')
  const rootDir = resolve(options.rootDir ?? process.cwd())
  const artifactIds = new Set()
  for (const [index, artifact] of (manifest.artifacts ?? []).entries()) {
    if (!nonEmpty(artifact?.id) || artifactIds.has(artifact?.id)) errors.push(`artifact ${index} must have a unique id`)
    artifactIds.add(artifact?.id)
    if (!nonEmpty(artifact?.relativePath) || isAbsolute(artifact.relativePath) || artifact.relativePath.includes('..')) errors.push(`artifact ${artifact?.id ?? index} must use a relative path without traversal`)
    if (!HASH.test(artifact?.sha256 ?? '')) errors.push(`artifact ${artifact?.id ?? index} has an invalid SHA-256`)
    if (!['fa', 'en'].includes(artifact?.locale) || !/^\d+x\d+$/.test(artifact?.viewport ?? '') || !nonEmpty(artifact?.state) || !nonEmpty(artifact?.captureConditions)) errors.push(`artifact ${artifact?.id ?? index} is missing locale, viewport, state, or capture conditions`)
    const artifactPath = resolve(rootDir, artifact?.relativePath ?? '')
    if (relative(rootDir, artifactPath).startsWith('..') || !existsSync(artifactPath)) {
      errors.push(`artifact ${artifact?.id ?? index} is not retrievable from rootDir`)
    } else if (HASH.test(artifact.sha256)) {
      const actual = createHash('sha256').update(readFileSync(artifactPath)).digest('hex')
      if (actual !== artifact.sha256.toLowerCase()) errors.push(`artifact ${artifact.id} SHA-256 does not match its file`) 
    }
  }

  if (!Array.isArray(manifest.reviews) || manifest.reviews.length === 0) errors.push('reviews must be non-empty')
  for (const [index, review] of (manifest.reviews ?? []).entries()) {
    if (!nonEmpty(review?.author) || !['human', 'independent-agent'].includes(review?.type) || review?.scopeSha !== manifest.candidateSha || !Array.isArray(review?.findings) || !['accepted', 'changes_requested', 'pending'].includes(review?.disposition)) errors.push(`review ${index} must identify an independent author, candidate scope, findings, and disposition`)
  }

  if (manifest.release !== null && (!manifest.release || !SHA.test(manifest.release.applicationSha ?? '') || !nonEmpty(manifest.release.workflowRun) || !nonEmpty(manifest.release.releaseId))) errors.push('release must be null or contain applicationSha, workflowRun, and releaseId')
  if (!Array.isArray(manifest.limitations)) errors.push('limitations must be a list')
  return errors
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll('\\', '/')}`) {
  const manifestIndex = process.argv.indexOf('--manifest')
  const rootIndex = process.argv.indexOf('--root')
  if (manifestIndex < 0 || !process.argv[manifestIndex + 1]) throw new Error('usage: node validate-public-experience-evidence.mjs --manifest <path> [--root <dir>]')
  const manifestPath = resolve(process.argv[manifestIndex + 1])
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const errors = validatePublicExperienceEvidence(manifest, { rootDir: rootIndex >= 0 ? process.argv[rootIndex + 1] : undefined })
  if (errors.length) {
    for (const error of errors) console.error(`::error::${error}`)
    process.exitCode = 1
  } else {
    process.stdout.write(`public experience evidence manifest valid: ${manifestPath}\n`)
  }
}
