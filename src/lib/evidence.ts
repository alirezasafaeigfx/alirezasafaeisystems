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

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const sha1Pattern = /^[0-9a-f]{40}$/i
const sha256Pattern = /^[0-9a-f]{64}$/i
const githubLoginPattern = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/
const githubPullReviewPattern = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/pull\/\d+#pullrequestreview-\d+$/i

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

function hasTrustedReviewerIdentity(record: EvidenceRecord): boolean {
  const reviewer = record.reviewedBy?.trim() ?? ''
  if (!githubLoginPattern.test(reviewer)) return false
  if (record.reviewArtifactReviewer?.trim() !== reviewer) return false
  return record.reviewerIdentityUrl?.trim() === `https://github.com/${reviewer}`
}

function hasImmutableApproval(record: EvidenceRecord): boolean {
  return (
    record.reviewProvider === 'github-pull-request-review' &&
    githubPullReviewPattern.test(record.reviewArtifactUrl?.trim() ?? '') &&
    sha256Pattern.test(record.reviewArtifactSha256?.trim() ?? '') &&
    sha1Pattern.test(record.reviewedCandidateSha?.trim() ?? '') &&
    record.reviewedEvidenceId?.trim() === record.id.trim() &&
    hasTrustedReviewerIdentity(record)
  )
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

export function isPublishableEvidence(record: EvidenceRecord): boolean {
  return (
    record.reviewState === 'accepted' &&
    isRetrievableSource(record.sourceUrl?.trim() ?? '') &&
    isValidIsoDate(record.reviewedAt?.trim() ?? '') &&
    isValidIsoDate(record.verificationDate.trim()) &&
    hasImmutableApproval(record) &&
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
