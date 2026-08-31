import { describe, expect, it } from 'vitest'
import { summarizeAuditReport } from '../../scripts/ci/parse-pnpm-audit.mjs'

describe('pnpm audit high and critical parser', () => {
  it('reads current pnpm metadata counts and blocks high or critical findings', () => {
    expect(summarizeAuditReport({
      advisories: { one: { severity: 'high' } },
      metadata: { vulnerabilities: { info: 0, low: 4, moderate: 18, high: 42, critical: 1 } },
    })).toEqual({ info: 0, low: 4, moderate: 18, high: 42, critical: 1, unknown: 0 })
  })

  it('supports advisory and npm vulnerability maps when metadata is absent', () => {
    expect(summarizeAuditReport({ advisories: { one: { severity: 'high' }, two: { severity: 'moderate' } } })).toMatchObject({ high: 1, moderate: 1 })
    expect(summarizeAuditReport({ vulnerabilities: { effect: { severity: 'high' } } })).toMatchObject({ high: 1 })
  })

  it('fails closed for empty or unsupported payloads', () => {
    expect(() => summarizeAuditReport({})).toThrow('unsupported pnpm audit payload')
    expect(() => summarizeAuditReport(null)).toThrow('unsupported pnpm audit payload')
  })
})
