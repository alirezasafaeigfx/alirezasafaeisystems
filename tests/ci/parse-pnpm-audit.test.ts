import { describe, expect, it } from 'vitest'
import { describeBlockingFindings, summarizeAuditReport } from '../../scripts/ci/parse-pnpm-audit.mjs'

describe('pnpm audit parser', () => {
  it('reads pnpm metadata vulnerability totals', () => {
    expect(summarizeAuditReport({
      metadata: {
        vulnerabilities: { info: 0, low: 4, moderate: 21, high: 44, critical: 1 },
      },
    })).toEqual({ info: 0, low: 4, moderate: 21, high: 44, critical: 1, unknown: 0 })
  })

  it('falls back to npm-style vulnerability objects', () => {
    expect(summarizeAuditReport({
      vulnerabilities: {
        alpha: { severity: 'high' },
        beta: { severity: 'critical' },
        gamma: { severity: 'moderate' },
      },
    })).toEqual({ info: 0, low: 0, moderate: 1, high: 1, critical: 1, unknown: 0 })
  })

  it('fails closed for an unsupported schema', () => {
    expect(() => summarizeAuditReport({ unexpected: true })).toThrow('unsupported pnpm audit payload')
  })

  it('counts unrecognized severities as unknown', () => {
    expect(summarizeAuditReport({
      advisories: {
        one: { severity: 'mystery' },
      },
    })).toEqual({ info: 0, low: 0, moderate: 0, high: 0, critical: 0, unknown: 1 })
  })

  it('requires complete non-negative metadata counts', () => {
    expect(() => summarizeAuditReport({
      metadata: {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 1 },
      },
    })).toThrow('unsupported pnpm audit payload')
  })

  it('lists blocking advisory package, severity, title, and provider URL without dumping the raw report', () => {
    expect(describeBlockingFindings({
      metadata: {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 2, critical: 1 },
      },
      advisories: {
        '1001': {
          module_name: '@hono/node-server',
          severity: 'critical',
          title: 'Path traversal in static middleware',
          url: 'https://github.com/advisories/GHSA-example-critical',
        },
        '1002': {
          module_name: 'effect',
          severity: 'high',
          title: 'Async context isolation issue',
          url: 'https://github.com/advisories/GHSA-example-high',
        },
        '1003': {
          module_name: 'lodash',
          severity: 'moderate',
          title: 'Non-blocking advisory',
          url: 'https://github.com/advisories/GHSA-example-moderate',
        },
      },
    })).toEqual([
      'critical @hono/node-server — Path traversal in static middleware — https://github.com/advisories/GHSA-example-critical',
      'high effect — Async context isolation issue — https://github.com/advisories/GHSA-example-high',
    ])
  })

  it('lists npm-style blocking vulnerabilities when advisory records are unavailable', () => {
    expect(describeBlockingFindings({
      vulnerabilities: {
        alpha: { name: 'alpha', severity: 'high', via: ['GHSA-alpha'] },
        beta: { name: 'beta', severity: 'moderate', via: ['GHSA-beta'] },
      },
    })).toEqual(['high alpha — GHSA-alpha'])
  })
})