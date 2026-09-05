import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  validatePublicExperienceEvidence,
  validateRemoteArtifacts,
} from './validate-public-experience-evidence.mjs'

const SHA = /^[0-9a-f]{40}$/i
const GITHUB_PR_REVIEW_URL = /^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/pull\/(\d+)#pullrequestreview-(\d+)$/i
const PROVIDER_TIMEOUT_MS = 5_000
const TRUSTED_REPOSITORY = 'alirezasafaeigfx/alirezasafaeisystems'

const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0

async function fetchGithubJson(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) return { status: 'unavailable' }
    return { status: 'ok', value: await response.json() }
  } catch {
    return { status: 'unavailable' }
  } finally {
    clearTimeout(timeout)
  }
}

async function verifyGithubReview(review, manifest) {
  if (review?.provider !== 'github-pull-request-review') return 'invalid'
  const match = typeof review?.providerUrl === 'string' ? review.providerUrl.match(GITHUB_PR_REVIEW_URL) : null
  if (!match || !SHA.test(manifest?.candidateSha ?? '') || review?.scopeSha !== manifest.candidateSha) return 'invalid'

  const [, owner, repo, pullNumberRaw, reviewIdRaw] = match
  const repository = `${owner}/${repo}`
  if (repository.toLowerCase() !== TRUSTED_REPOSITORY.toLowerCase()) return 'invalid'
  if (String(manifest.repository ?? '').toLowerCase() !== TRUSTED_REPOSITORY.toLowerCase()) return 'invalid'

  const pullNumber = Number(pullNumberRaw)
  const reviewId = Number(reviewIdRaw)
  if (!Number.isSafeInteger(pullNumber) || !Number.isSafeInteger(reviewId)) return 'invalid'

  const apiBase = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${pullNumber}`
  const [reviewResult, pullResult] = await Promise.all([
    fetchGithubJson(`${apiBase}/reviews/${reviewId}`),
    fetchGithubJson(apiBase),
  ])
  if (reviewResult.status !== 'ok' || pullResult.status !== 'ok') return 'unavailable'

  const providerReview = reviewResult.value
  const pullRequest = pullResult.value
  const providerReviewer = providerReview.user?.login?.trim() ?? ''
  const pullAuthor = pullRequest.user?.login?.trim() ?? ''
  const declaredReviewer = String(review.author ?? '').trim()

  const verified = providerReview.id === reviewId
    && providerReview.html_url === review.providerUrl
    && providerReview.state === 'APPROVED'
    && providerReview.commit_id === manifest.candidateSha
    && pullRequest.number === pullNumber
    && pullRequest.head?.sha === manifest.candidateSha
    && nonEmpty(providerReviewer)
    && nonEmpty(declaredReviewer)
    && providerReviewer.toLowerCase() === declaredReviewer.toLowerCase()
    && nonEmpty(pullAuthor)
    && providerReviewer.toLowerCase() !== pullAuthor.toLowerCase()

  return verified ? 'verified' : 'invalid'
}

/**
 * Provider-verifies the independent review used by S5 acceptance.
 * Manifest-controlled reviewer fields are never sufficient on their own.
 */
export async function validateIndependentReviewProvenance(manifest) {
  const acceptedReviews = (manifest?.reviews ?? []).filter((review) =>
    ['human', 'independent-agent'].includes(review?.type)
      && review?.disposition === 'accepted'
      && review?.scopeSha === manifest?.candidateSha,
  )

  if (acceptedReviews.length === 0) {
    return ['manifest requires a provider-verified independent review for candidateSha']
  }

  let providerUnavailable = false
  for (const review of acceptedReviews) {
    const result = await verifyGithubReview(review, manifest)
    if (result === 'verified') return []
    if (result === 'unavailable') providerUnavailable = true
  }

  return [providerUnavailable
    ? 'independent review provider unavailable; provider-verified independent review required'
    : 'manifest requires a provider-verified independent review for candidateSha']
}

/** Final fail-closed S5 validation path used by the acceptance workflow. */
export async function validatePublicExperienceEvidenceTrusted(manifest, options = {}) {
  const errors = validatePublicExperienceEvidence(manifest, options)
  errors.push(...await validateIndependentReviewProvenance(manifest))
  errors.push(...await validateRemoteArtifacts(manifest))
  return errors
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const manifestIndex = process.argv.indexOf('--manifest')
  const rootIndex = process.argv.indexOf('--root')
  if (manifestIndex < 0 || !process.argv[manifestIndex + 1]) {
    console.error('::error::usage: node validate-public-experience-evidence-trusted.mjs --manifest <path> [--root <dir>]')
    process.exitCode = 1
  } else {
    const manifestPath = resolve(process.argv[manifestIndex + 1])
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
      const errors = await validatePublicExperienceEvidenceTrusted(manifest, {
        rootDir: rootIndex >= 0 ? process.argv[rootIndex + 1] : undefined,
      })
      if (errors.length) {
        for (const error of errors) console.error(`::error::${error}`)
        process.exitCode = 1
      } else {
        process.stdout.write(`trusted public experience evidence manifest valid: ${manifestPath}\n`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`::error::unable to load evidence manifest: ${message}`)
      process.exitCode = 1
    }
  }
}
