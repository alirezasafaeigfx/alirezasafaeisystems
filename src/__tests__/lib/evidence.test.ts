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
}

describe('typed public evidence', () => {
  it('publishes accepted evidence only when every provenance field is present', () => {
    expect(isPublishableEvidence(acceptedEvidence)).toBe(true)
  })

  it('rejects unreviewed or incomplete evidence', () => {
    expect(isPublishableEvidence({ ...acceptedEvidence, reviewState: 'draft' })).toBe(false)
    expect(isPublishableEvidence({ ...acceptedEvidence, method: '' })).toBe(false)
  })
})
