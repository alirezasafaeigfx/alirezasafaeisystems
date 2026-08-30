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
}

export function isPublishableEvidence(record: EvidenceRecord): boolean {
  return (
    record.reviewState === 'accepted' &&
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
