import { describe, expect, it } from 'vitest'

async function loadClassifier() {
  // @ts-expect-error Deployment helper is intentionally plain ESM so Node can run it on the VPS.
  return import('../../scripts/deploy/prisma-baseline-state.mjs')
}

describe('Prisma production baseline classification', () => {
  it('keeps a fresh empty database eligible for the real baseline migration', async () => {
    const { classifyPrismaBaselineState } = await loadClassifier()

    expect(classifyPrismaBaselineState({ tableNames: [], migrations: [] })).toBe('fresh-empty')
  })

  it('baselines only a legacy non-empty database with no migration history', async () => {
    const { classifyPrismaBaselineState } = await loadClassifier()

    expect(
      classifyPrismaBaselineState({
        tableNames: ['Project', 'Skill', 'ContactMessage'],
        migrations: [],
      }),
    ).toBe('legacy-needs-baseline')
  })

  it('recognizes a database whose baseline is already applied', async () => {
    const { classifyPrismaBaselineState } = await loadClassifier()

    expect(
      classifyPrismaBaselineState({
        tableNames: ['Project', '_prisma_migrations'],
        migrations: [
          {
            migration_name: '20260617000000_baseline_legacy_portfolio',
            finished_at: '2026-08-18T00:00:00.000Z',
            rolled_back_at: null,
          },
        ],
      }),
    ).toBe('migration-managed')
  })

  it('fails closed when migration history exists without a valid baseline record', async () => {
    const { classifyPrismaBaselineState } = await loadClassifier()

    expect(() =>
      classifyPrismaBaselineState({
        tableNames: ['Project', '_prisma_migrations'],
        migrations: [
          {
            migration_name: '20260815190000_add_discover_items',
            finished_at: '2026-08-18T00:00:00.000Z',
            rolled_back_at: null,
          },
        ],
      }),
    ).toThrow(/inconsistent migration history/i)
  })

  it('fails closed when the baseline was rolled back', async () => {
    const { classifyPrismaBaselineState } = await loadClassifier()

    expect(() =>
      classifyPrismaBaselineState({
        tableNames: ['Project', '_prisma_migrations'],
        migrations: [
          {
            migration_name: '20260617000000_baseline_legacy_portfolio',
            finished_at: '2026-08-18T00:00:00.000Z',
            rolled_back_at: '2026-08-18T01:00:00.000Z',
          },
        ],
      }),
    ).toThrow(/baseline.*rolled back/i)
  })
})
