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
  reviewedBy: 'Review agent Banach',
  reviewedAt: '2026-08-30',
}

describe('typed public evidence', () => {
  it('publishes accepted evidence only when every provenance field is present', () => {
    expect(isPublishableEvidence(acceptedEvidence)).toBe(true)
  })

  it('rejects unreviewed or incomplete evidence', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewState: 'draft' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, method: '' })).toBe(false)
  })

  it('rejects an accepted claim without a retrievable source or independent review identity', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, sourceUrl: '' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewedBy: '' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewedAt: 'not-a-date' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewedAt: '2026-02-31' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, verificationDate: '2026-99-99' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewedBy: 'Independent public-content reviewer' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, source: 'Accepted infrastructure rescue evidence record' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, source: 'رکورد پذیرفته‌شده شواهد عمومی' })).toBe(false)
  })

  it('rejects unsupported quantitative claims with malformed or conflicting periods', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, value: '180m → 55m', period: 'Published reference' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, value: '0 in final 21 days', period: 'Six-week intervention window' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, value: '55m', period: 'before: 2026-08-30; after: 2026-08-01' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, value: '۱۸۰ دقیقه', period: 'بررسی عمومی' })).toBe(false)
  })
})
