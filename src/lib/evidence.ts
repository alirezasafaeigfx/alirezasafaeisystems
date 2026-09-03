export type EvidenceReviewState = 'draft' | 'accepted' | 'rejected'

export type EvidenceRecord = {
  id: string
  label: string
  value: string
  source: string
  period: string
  method: string
  verificationDate: string
  reviewState: EvidenceReviewState
  sourceUrl?: string
  reviewedBy?: string
  reviewedAt?: string
  quantitativeSourceUrl?: string
  reviewProvider?: 'github-pull-request-review'
  reviewArtifactUrl?: string
  reviewArtifactSha256?: string
  reviewArtifactReviewer?: string
  reviewerIdentityUrl?: string
  reviewedCandidateSha?: string
  reviewedEvidenceId?: string
}

export type EvidenceApprovalLocator = {
  reviewUrl: string
  candidateSha: string
}

export type VerifiedEvidenceApproval = {
  evidenceId: string
  evidenceSha256: string
  candidateSha: string
  reviewer: string
  reviewerIdentityUrl: string
  reviewedAt: string
  reviewUrl: string
}

type StoredVerifiedEvidenceApproval = VerifiedEvidenceApproval & {
  evidencePayload: string
}

type GithubReviewResponse = {
  id?: number
  html_url?: string
  user?: { login?: string; html_url?: string }
  body?: string | null
  state?: string
  commit_id?: string
  submitted_at?: string
}

type GithubPullResponse = {
  number?: number
  user?: { login?: string }
  head?: { sha?: string }
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const sha1Pattern = /^[0-9a-f]{40}$/i
const githubPullReviewPattern = /^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/pull\/(\d+)#pullrequestreview-(\d+)$/i
const trustedRepository = 'alirezasafaeigfx/alirezasafaeisystems'
const providerRequestTimeoutMs = 5_000
const verifiedEvidenceApprovals = new WeakMap<EvidenceRecord, StoredVerifiedEvidenceApproval>()

function isValidIsoDate(value: string): boolean {
  if (!isoDatePattern.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function isRetrievableSource(sourceUrl: string): boolean {
  if (sourceUrl.startsWith('/')) return !sourceUrl.startsWith('//')
  try {
    const url = new URL(sourceUrl)
    return url.protocol === 'https:' && url.hostname.length > 0
  } catch {
    return false
  }
}

function canonicalEvidencePayload(record: EvidenceRecord): string {
  return JSON.stringify({
    id: record.id,
    label: record.label,
    value: record.value,
    source: record.source,
    period: record.period,
    method: record.method,
    verificationDate: record.verificationDate,
    sourceUrl: record.sourceUrl ?? null,
    quantitativeSourceUrl: record.quantitativeSourceUrl ?? null,
  })
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function markerValue(body: string, marker: string): string | null {
  const prefix = `${marker}:`
  const line = body.split(/\r?\n/).find((candidate) => candidate.trimStart().startsWith(prefix))
  return line ? line.trimStart().slice(prefix.length).trim() : null
}

async function fetchGithubJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), providerRequestTimeoutMs)
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
      signal: controller.signal,
    })
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export async function verifyEvidenceApproval(
  record: EvidenceRecord,
  locator: EvidenceApprovalLocator,
): Promise<VerifiedEvidenceApproval | null> {
  const match = locator.reviewUrl.trim().match(githubPullReviewPattern)
  if (!match || !sha1Pattern.test(locator.candidateSha)) return null

  const [, owner, repo, pullNumberRaw, reviewIdRaw] = match
  const repository = `${owner}/${repo}`
  if (repository.toLowerCase() !== trustedRepository.toLowerCase()) return null

  const pullNumber = Number(pullNumberRaw)
  const reviewId = Number(reviewIdRaw)
  if (!Number.isSafeInteger(pullNumber) || !Number.isSafeInteger(reviewId)) return null

  const apiBase = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pulls/${pullNumber}`
  const [review, pullRequest] = await Promise.all([
    fetchGithubJson<GithubReviewResponse>(`${apiBase}/reviews/${reviewId}`),
    fetchGithubJson<GithubPullResponse>(apiBase),
  ])
  if (!review || !pullRequest) return null

  const reviewer = review.user?.login?.trim() ?? ''
  const reviewerIdentityUrl = review.user?.html_url?.trim() ?? ''
  const pullAuthor = pullRequest.user?.login?.trim() ?? ''
  const reviewBody = review.body ?? ''
  const reviewedAt = review.submitted_at?.slice(0, 10) ?? ''
  const evidencePayload = canonicalEvidencePayload(record)
  const evidenceSha256 = await sha256(evidencePayload)

  if (
    review.id !== reviewId ||
    review.html_url !== locator.reviewUrl ||
    review.state !== 'APPROVED' ||
    review.commit_id !== locator.candidateSha ||
    pullRequest.number !== pullNumber ||
    pullRequest.head?.sha !== locator.candidateSha ||
    !reviewer ||
    !reviewerIdentityUrl.startsWith('https://github.com/') ||
    !pullAuthor ||
    reviewer.toLowerCase() === pullAuthor.toLowerCase() ||
    !isValidIsoDate(reviewedAt) ||
    markerValue(reviewBody, 'ASDEV-EVIDENCE-ID') !== record.id ||
    markerValue(reviewBody, 'ASDEV-EVIDENCE-SHA256')?.toLowerCase() !== evidenceSha256
  ) {
    return null
  }

  const approval: StoredVerifiedEvidenceApproval = {
    evidenceId: record.id,
    evidenceSha256,
    candidateSha: locator.candidateSha,
    reviewer,
    reviewerIdentityUrl,
    reviewedAt,
    reviewUrl: locator.reviewUrl,
    evidencePayload,
  }
  verifiedEvidenceApprovals.set(record, approval)
  return approval
}

function hasSupportedPeriod(record: EvidenceRecord): boolean {
  if (/published reference|accepted .*record|رکورد پذیرفته[‌ -]?شده|مرجع منتشر[‌ -]?شده/i.test(`${record.source} ${record.period}`)) return false
  if (!/[0-9۰-۹]/.test(record.value)) return true
  if (!record.quantitativeSourceUrl || record.quantitativeSourceUrl !== record.sourceUrl || !isRetrievableSource(record.quantitativeSourceUrl)) return false
  if (!/(day|week|month|window|روز|هفته|ماه|بازه|20\d{2})/i.test(record.period)) return false

  const before = record.period.match(/before\s*:\s*(\d{4}-\d{2}-\d{2})/i)?.[1]
  const after = record.period.match(/after\s*:\s*(\d{4}-\d{2}-\d{2})/i)?.[1]
  if (before && !isValidIsoDate(before)) return false
  if (after && !isValidIsoDate(after)) return false
  return !(before && after && before >= after)
}

export function isPublishableEvidence(record: EvidenceRecord): boolean
export function isPublishableEvidence(record: EvidenceRecord, approval: VerifiedEvidenceApproval): boolean
export function isPublishableEvidence(
  record: EvidenceRecord,
  approval?: VerifiedEvidenceApproval,
): boolean {
  const verifiedApproval = verifiedEvidenceApprovals.get(record)
  return (
    approval !== undefined &&
    verifiedApproval === approval &&
    verifiedApproval.evidencePayload === canonicalEvidencePayload(record) &&
    record.reviewState === 'accepted' &&
    isRetrievableSource(record.sourceUrl?.trim() ?? '') &&
    isValidIsoDate(record.verificationDate.trim()) &&
    hasSupportedPeriod(record) &&
    !/accepted .*evidence .*record|رکورد پذیرفته[‌ -]?شده.*شواهد/i.test(record.source) &&
    [
      record.id,
      record.label,
      record.value,
      record.source,
      record.period,
      record.method,
      record.verificationDate,
    ].every((field) => field.trim().length > 0)
  )
}
