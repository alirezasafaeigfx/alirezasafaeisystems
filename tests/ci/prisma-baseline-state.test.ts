import { describe, expect, it } from 'vitest'

type MigrationRow = {
  migration_name: string
  finished_at: string | null
  rolled_back_at: string | null
}

type LegacyShape = {
  tableNames: string[]
  columnsByTable: Record<string, string[]>
}

type ClassifierModule = {
  classifyPrismaBaselineState(input: { tableNames: string[]; migrations: MigrationRow[] }): string
  planLegacyMigrationResolution(input: LegacyShape): string[]
}

async function loadClassifier(): Promise<ClassifierModule> {
  return (await import('../../scripts/deploy/prisma-baseline-state.mjs')) as unknown as ClassifierModule
}

const CORE_TABLES = ['Project', 'Skill', 'Experience', 'BlogPost', 'ContactMessage']
const CORE_COLUMNS: Record<string, string[]> = {
  Project: ['id', 'title', 'description', 'longDescription', 'imageUrl', 'githubUrl', 'liveUrl', 'tags', 'featured', 'order', 'createdAt', 'updatedAt'],
  Skill: ['id', 'name', 'category', 'level', 'icon', 'order', 'createdAt', 'updatedAt'],
  Experience: ['id', 'title', 'company', 'location', 'startDate', 'endDate', 'description', 'current', 'order', 'createdAt', 'updatedAt'],
  BlogPost: ['id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 'published', 'tags', 'readTime', 'createdAt', 'updatedAt'],
  ContactMessage: ['id', 'name', 'email', 'subject', 'message', 'createdAt'],
}
const DISCOVER_COLUMNS = ['id', 'slug', 'title', 'description', 'content', 'externalUrl', 'category', 'tags', 'imageUrl', 'instagramUrl', 'featured', 'published', 'order', 'publishedAt', 'createdAt', 'updatedAt']
const LEAD_COLUMNS = ['id', 'status', 'source', 'contactName', 'organizationName', 'organizationType', 'email', 'phone', 'teamSize', 'currentStack', 'criticalRisk', 'timeline', 'budgetRange', 'preferredContact', 'notes', 'attachmentPath', 'utmSource', 'utmMedium', 'utmCampaign', 'createdAt', 'updatedAt']
const ANALYTICS_CURRENT_COLUMNS = ['id', 'site', 'event', 'properties', 'sessionId', 'userId', 'timestamp', 'ip', 'userAgent', 'name', 'category', 'path', 'locale', 'variant', 'value', 'metadata', 'createdAt']
const FUNNEL_COLUMNS = ['id', 'sessionId', 'entryPoint', 'visitedToolbox', 'visitedPortfolio', 'visitedAudit', 'contacted', 'converted', 'conversionValue', 'createdAt', 'updatedAt']

function legacyShape(extra: Record<string, string[]> = {}): LegacyShape {
  return {
    tableNames: [...CORE_TABLES, ...Object.keys(extra)],
    columnsByTable: { ...CORE_COLUMNS, ...extra },
  }
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

describe('legacy migration resolution planning', () => {
  it('resolves only the baseline marker and malformed historical snapshot for the core legacy schema', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    expect(planLegacyMigrationResolution(legacyShape())).toEqual([
      '20260617000000_baseline_legacy_portfolio',
      '20260618141730_add_analytics_funnel_tracking',
    ])
  })

  it('recognizes complete Project lifecycle effects but rejects partial lifecycle drift', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()
    const complete = legacyShape({
      Project: [...CORE_COLUMNS.Project, 'contentType', 'published'],
    })

    expect(planLegacyMigrationResolution(complete)).toContain('20260815120000_add_project_content_lifecycle')
    expect(() =>
      planLegacyMigrationResolution(legacyShape({
        Project: [...CORE_COLUMNS.Project, 'contentType'],
      })),
    ).toThrow(/partial.*Project lifecycle/i)
  })

  it('recognizes only a complete DiscoverItem table as an already-applied Discover migration', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    expect(
      planLegacyMigrationResolution(legacyShape({ DiscoverItem: DISCOVER_COLUMNS })),
    ).toContain('20260815190000_add_discover_items')
    expect(() =>
      planLegacyMigrationResolution(legacyShape({ DiscoverItem: DISCOVER_COLUMNS.slice(0, -1) })),
    ).toThrow(/partial.*DiscoverItem/i)
  })

  it('recognizes complete Lead creation and UTM extension independently', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    const baseLeadPlan = planLegacyMigrationResolution(legacyShape({ Lead: LEAD_COLUMNS }))
    expect(baseLeadPlan).toContain('20260816000000_add_leads')
    expect(baseLeadPlan).not.toContain('20260816155000_add_lead_utm_content')

    const utmPlan = planLegacyMigrationResolution(legacyShape({ Lead: [...LEAD_COLUMNS, 'utmContent'] }))
    expect(utmPlan).toContain('20260816000000_add_leads')
    expect(utmPlan).toContain('20260816155000_add_lead_utm_content')
  })

  it('fails closed on a partial Lead table', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    expect(() =>
      planLegacyMigrationResolution(legacyShape({ Lead: LEAD_COLUMNS.slice(0, -1) })),
    ).toThrow(/partial.*Lead/i)
  })

  it('resolves analytics reconciliation only when the complete current analytics schema is already present', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    const currentPlan = planLegacyMigrationResolution(legacyShape({
      AnalyticsEvent: ANALYTICS_CURRENT_COLUMNS,
      FunnelConversion: FUNNEL_COLUMNS,
    }))
    expect(currentPlan).toContain('20260818230000_reconcile_analytics_schema')

    const oldAnalyticsColumns = ANALYTICS_CURRENT_COLUMNS.filter(
      (column) => !['name', 'category', 'path', 'locale', 'variant', 'value', 'metadata'].includes(column),
    )
    const oldPlan = planLegacyMigrationResolution(legacyShape({
      AnalyticsEvent: oldAnalyticsColumns,
      FunnelConversion: FUNNEL_COLUMNS,
    }))
    expect(oldPlan).not.toContain('20260818230000_reconcile_analytics_schema')
  })

  it('fails closed on incompatible partial analytics state', async () => {
    const { planLegacyMigrationResolution } = await loadClassifier()

    expect(() =>
      planLegacyMigrationResolution(legacyShape({ AnalyticsEvent: ['id', 'site'] })),
    ).toThrow(/partial.*AnalyticsEvent/i)
    expect(() =>
      planLegacyMigrationResolution(legacyShape({ FunnelConversion: ['id', 'sessionId'] })),
    ).toThrow(/partial.*FunnelConversion/i)
  })
})
