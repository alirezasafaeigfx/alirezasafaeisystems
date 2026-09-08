import { describe, expect, it } from 'vitest'
import { describeBlockingFindings, summarizeAuditReport } from '../../scripts/ci/parse-pnpm-audit.mjs'

const zeroCounts = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 }

function legacyAdvisory(id: number, severity: string) {
  return { id, module_name: `package-${id}`, severity, title: `Advisory ${id}`, url: `https://github.com/advisories/GHSA-${id}`, findings: [] }
}

function npmVulnerability(name: string, severity: string) {
  return { name, severity, via: [], effects: [], range: '*', nodes: [], fixAvailable: false }
}

describe('pnpm audit parser', () => {
  it('reads a complete pnpm legacy report', () => {
    expect(summarizeAuditReport({ metadata: { vulnerabilities: { ...zeroCounts, moderate: 1 } }, advisories: { 1: legacyAdvisory(1, 'moderate') } }))
      .toEqual({ ...zeroCounts, moderate: 1, unknown: 0 })
  })

  it('accepts npm audit v2 totals including total', () => {
    expect(summarizeAuditReport({ auditReportVersion: 2, metadata: { vulnerabilities: { ...zeroCounts, moderate: 1, total: 1 } }, vulnerabilities: { alpha: npmVulnerability('alpha', 'moderate') } }))
      .toEqual({ ...zeroCounts, moderate: 1, unknown: 0 })
  })

  it.each([
    ['unsupported schema version', { auditReportVersion: 3, metadata: { vulnerabilities: zeroCounts }, vulnerabilities: {} }],
    ['both finding containers', { metadata: { vulnerabilities: zeroCounts }, vulnerabilities: {}, advisories: {} }],
    ['empty metadata', { metadata: {}, advisories: {} }],
    ['unknown zero-count severity', { metadata: { vulnerabilities: { ...zeroCounts, emergency: 0 } }, advisories: {} }],
    ['contradictory total', { auditReportVersion: 2, metadata: { vulnerabilities: { ...zeroCounts, total: 1 } }, vulnerabilities: {} }],
    ['incomplete finding', { metadata: { vulnerabilities: { ...zeroCounts, high: 1 } }, advisories: { 1: { severity: 'high' } } }],
    ['contradictory metadata', { metadata: { vulnerabilities: zeroCounts }, advisories: { 1: legacyAdvisory(1, 'critical') } }],
  ])('fails closed for %s', (_name, report) => {
    expect(() => summarizeAuditReport(report)).toThrow(/unsupported|contradictory/)
  })

  it('fails closed when an unknown finding severity is present', () => {
    expect(summarizeAuditReport({ metadata: { vulnerabilities: zeroCounts }, advisories: { 1: legacyAdvisory(1, 'emergency') } }))
      .toEqual({ ...zeroCounts, unknown: 1 })
  })

  it('lists blocking and unknown advisory details without dumping the report', () => {
    expect(describeBlockingFindings({ advisories: { 1: legacyAdvisory(1, 'critical'), 2: legacyAdvisory(2, 'high'), 3: legacyAdvisory(3, 'emergency') } })).toEqual([
      'critical package-1 — Advisory 1 — https://github.com/advisories/GHSA-1',
      'high package-2 — Advisory 2 — https://github.com/advisories/GHSA-2',
      'unknown package-3 — Advisory 3 — https://github.com/advisories/GHSA-3',
    ])
  })
})
