import { describe, expect, it } from 'vitest'
import { isPublishableEvidence, type EvidenceRecord } from '@/lib/evidence'

const acceptedEvidence: EvidenceRecord = {
  id: 'release-governance',
  label: 'Release governance path',
  value: 'Reviewable release path',
  source: 'ASDEV Systems deployment workflow and live verification report',
  period: '2026-08-30 staging run',
  method: 'Governed workflow, internal smoke, and two public browser passes',
  verificationDate: '2026-08-30',
  reviewState: 'accepted',
  sourceUrl: 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/actions/runs/33332174608',
  reviewedBy: 'coderabbitai',
  reviewedAt: '2026-08-30',
}

const approval = {
  reviewProvider: 'github-pull-request-review' as const,
  reviewArtifactUrl: 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/pull/26#pullrequestreview-1234567890',
  reviewArtifactSha256: 'a'.repeat(64),
  reviewArtifactReviewer: acceptedEvidence.reviewedBy,
  reviewerIdentityUrl: `https://github.com/${acceptedEvidence.reviewedBy}`,
  reviewedCandidateSha: 'b'.repeat(40),
  reviewedEvidenceId: acceptedEvidence.id,
}

describe('typed public evidence', () => {
  it('does not publish accepted evidence from manifest-controlled approval fields alone', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval })).toBe(false)
    expect(isPublishableEvidence(acceptedEvidence)).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedEvidenceId: 'different-evidence' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedCandidateSha: 'not-a-sha' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactSha256: 'not-a-hash' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactUrl: '' })).toBe(false)
  })

  it('binds the approval artifact to a trusted provider and the same reviewer identity', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewProvider: undefined })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactUrl: 'https://example.com/review.json' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactReviewer: 'different-reviewer' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewerIdentityUrl: 'https://github.com/different-reviewer' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedBy: 'Review agent Banach' })).toBe(false)
  })

  it('rejects unreviewed or incomplete evidence', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewState: 'draft' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, method: '' })).toBe(false)
  })

  it('rejects an accepted claim without a retrievable source or independent review identity', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, sourceUrl: '' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedBy: '' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedAt: 'not-a-date' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedAt: '2026-02-31' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, verificationDate: '2026-99-99' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedBy: 'Independent public-content reviewer' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, source: 'Accepted infrastructure rescue evidence record' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, source: 'رکورد پذیرفته‌شده شواهد عمومی' })).toBe(false)
  })

  it('rejects unsupported quantitative claims with malformed or conflicting periods', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, value: '180m → 55m', period: 'Published reference' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, value: '0 in final 21 days', period: 'Six-week intervention window' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, value: '55m', period: 'before: 2026-08-30; after: 2026-08-01' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, value: '55m', period: 'before: 2026-02-31; after: 2026-03-02', quantitativeSourceUrl: acceptedEvidence.sourceUrl })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, value: '۱۸۰ دقیقه', period: 'بررسی عمومی' })).toBe(false)
  })
})
