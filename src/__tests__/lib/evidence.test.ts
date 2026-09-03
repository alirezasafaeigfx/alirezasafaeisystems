import { createHash } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

function canonicalEvidencePayload(record: EvidenceRecord) {
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

function evidenceDigest(record: EvidenceRecord) {
  return createHash('sha256').update(canonicalEvidencePayload(record)).digest('hex')
}

afterEach(() => vi.unstubAllGlobals())

describe('typed public evidence', () => {
  it('does not publish accepted evidence from manifest-controlled approval fields alone', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval })).toBe(false)
    expect(isPublishableEvidence(acceptedEvidence)).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedEvidenceId: 'different-evidence' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewedCandidateSha: 'not-a-sha' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactSha256: 'not-a-hash' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, ...approval, reviewArtifactUrl: '' })).toBe(false)
  })

  it('publishes only after GitHub binds an independent approval to the exact candidate and evidence digest', async () => {
    const record = { ...acceptedEvidence }
    const candidateSha = 'b'.repeat(40)
    const reviewUrl = 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/pull/26#pullrequestreview-1234567890'
    const review = {
      id: 1234567890,
      html_url: reviewUrl,
      user: { login: 'trusted-reviewer', html_url: 'https://github.com/trusted-reviewer' },
      body: `ASDEV-EVIDENCE-ID: ${record.id}\nASDEV-EVIDENCE-SHA256: ${evidenceDigest(record)}`,
      state: 'APPROVED',
      commit_id: candidateSha,
      submitted_at: '2026-09-03T10:00:00Z',
    }
    const pullRequest = {
      number: 26,
      user: { login: 'implementation-author' },
      head: { sha: candidateSha },
    }

    vi.stubGlobal('fetch', vi.fn(async (input: string | URL | Request) => {
      const url = String(input)
      if (url.endsWith('/pulls/26/reviews/1234567890')) return new Response(JSON.stringify(review), { status: 200 })
      if (url.endsWith('/pulls/26')) return new Response(JSON.stringify(pullRequest), { status: 200 })
      return new Response('not found', { status: 404 })
    }))

    const evidenceModule = await import('@/lib/evidence')
    const verifyEvidenceApproval = (evidenceModule as unknown as {
      verifyEvidenceApproval?: (evidence: EvidenceRecord, locator: { reviewUrl: string; candidateSha: string }) => Promise<unknown>
    }).verifyEvidenceApproval
    const verifiedApproval = await verifyEvidenceApproval?.(record, { reviewUrl, candidateSha })
    const publishable = (evidenceModule as unknown as {
      isPublishableEvidence: (evidence: EvidenceRecord, approval?: unknown) => boolean
    }).isPublishableEvidence

    expect(verifiedApproval).toBeTruthy()
    expect(publishable(record, verifiedApproval)).toBe(true)
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
