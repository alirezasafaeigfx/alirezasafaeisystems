import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  evaluateLighthouseAssertions,
  metricValueFromReport,
  selectOptimisticValue,
} from '../../scripts/ci/run-lighthouse-budget.mjs'

type Report = {
  categories: Record<string, { score: number | null }>
  audits: Record<string, { numericValue?: number }>
}

function report({ performance = 0.8, accessibility = 0.95, lcp = 3200 }: {
  performance?: number
  accessibility?: number
  lcp?: number
} = {}): Report {
  return {
    categories: {
      performance: { score: performance },
      accessibility: { score: accessibility },
      'best-practices': { score: 0.95 },
      seo: { score: 0.98 },
    },
    audits: {
      'first-contentful-paint': { numericValue: 1800 },
      'largest-contentful-paint': { numericValue: lcp },
      'cumulative-layout-shift': { numericValue: 0.05 },
      interactive: { numericValue: 3500 },
      'speed-index': { numericValue: 3000 },
    },
  }
}

describe('Lighthouse budget runner contract', () => {
  it('preserves the existing Lighthouse budget thresholds and severities', () => {
    const config = JSON.parse(readFileSync('lighthouserc.json', 'utf8'))
    expect(config.ci.collect.numberOfRuns).toBe(3)
    expect(config.ci.assert.assertions).toEqual({
      'categories:performance': ['warn', { minScore: 0.75 }],
      'categories:accessibility': ['error', { minScore: 0.92 }],
      'categories:best-practices': ['error', { minScore: 0.93 }],
      'categories:seo': ['error', { minScore: 0.96 }],
      'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
      'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
      'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
      interactive: ['warn', { maxNumericValue: 5000 }],
      'speed-index': ['warn', { maxNumericValue: 4500 }],
    })
  })

  it('uses optimistic aggregation: maximum score for minimum-score gates and minimum duration for maximum-value gates', () => {
    expect(selectOptimisticValue([0.74, 0.8, 0.77], 'minScore')).toBe(0.8)
    expect(selectOptimisticValue([4100, 3600, 3900], 'maxNumericValue')).toBe(3600)
  })

  it('reads category scores and audit numeric values without conflating the two namespaces', () => {
    const sample = report({ performance: 0.82, lcp: 3100 })
    expect(metricValueFromReport(sample, 'categories:performance')).toBe(0.82)
    expect(metricValueFromReport(sample, 'largest-contentful-paint')).toBe(3100)
  })

  it('fails only error-level assertions while retaining warning-level budget misses as warnings', () => {
    const result = evaluateLighthouseAssertions(
      [
        report({ performance: 0.7, accessibility: 0.9, lcp: 4500 }),
        report({ performance: 0.72, accessibility: 0.91, lcp: 4300 }),
        report({ performance: 0.73, accessibility: 0.9, lcp: 4200 }),
      ],
      {
        'categories:performance': ['warn', { minScore: 0.75 }],
        'categories:accessibility': ['error', { minScore: 0.92 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
      },
    )

    expect(result.warnings).toEqual(expect.arrayContaining([
      expect.stringContaining('categories:performance'),
      expect.stringContaining('largest-contentful-paint'),
    ]))
    expect(result.failures).toEqual([
      expect.stringContaining('categories:accessibility'),
    ])
  })

  it('fails closed when a configured metric is absent from every report', () => {
    const result = evaluateLighthouseAssertions(
      [report(), report(), report()],
      { 'total-blocking-time': ['error', { maxNumericValue: 300 }] },
    )
    expect(result.failures).toEqual([
      expect.stringContaining('total-blocking-time'),
    ])
  })
})
