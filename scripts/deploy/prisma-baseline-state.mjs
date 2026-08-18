import { pathToFileURL } from 'node:url'
import { PrismaClient } from '@prisma/client'

const BASELINE_MIGRATION = '20260617000000_baseline_legacy_portfolio'
const OVERLAPPING_SNAPSHOT_MIGRATION = '20260618141730_add_analytics_funnel_tracking'
const PROJECT_LIFECYCLE_MIGRATION = '20260815120000_add_project_content_lifecycle'
const DISCOVER_MIGRATION = '20260815190000_add_discover_items'
const LEAD_MIGRATION = '20260816000000_add_leads'
const LEAD_UTM_MIGRATION = '20260816155000_add_lead_utm_content'
const ANALYTICS_RECONCILIATION_MIGRATION = '20260818230000_reconcile_analytics_schema'

const CORE_COLUMNS = {
  Project: ['id', 'title', 'description', 'longDescription', 'imageUrl', 'githubUrl', 'liveUrl', 'tags', 'featured', 'order', 'createdAt', 'updatedAt'],
  Skill: ['id', 'name', 'category', 'level', 'icon', 'order', 'createdAt', 'updatedAt'],
  Experience: ['id', 'title', 'company', 'location', 'startDate', 'endDate', 'description', 'current', 'order', 'createdAt', 'updatedAt'],
  BlogPost: ['id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 'published', 'tags', 'readTime', 'createdAt', 'updatedAt'],
  ContactMessage: ['id', 'name', 'email', 'subject', 'message', 'createdAt'],
}

const DISCOVER_COLUMNS = ['id', 'slug', 'title', 'description', 'content', 'externalUrl', 'category', 'tags', 'imageUrl', 'instagramUrl', 'featured', 'published', 'order', 'publishedAt', 'createdAt', 'updatedAt']
const LEAD_COLUMNS = ['id', 'status', 'source', 'contactName', 'organizationName', 'organizationType', 'email', 'phone', 'teamSize', 'currentStack', 'criticalRisk', 'timeline', 'budgetRange', 'preferredContact', 'notes', 'attachmentPath', 'utmSource', 'utmMedium', 'utmCampaign', 'createdAt', 'updatedAt']
const ANALYTICS_OLD_COLUMNS = ['id', 'site', 'event', 'properties', 'sessionId', 'userId', 'timestamp', 'ip', 'userAgent', 'createdAt']
const ANALYTICS_CURRENT_COLUMNS = [...ANALYTICS_OLD_COLUMNS.slice(0, -1), 'name', 'category', 'path', 'locale', 'variant', 'value', 'metadata', 'createdAt']
const FUNNEL_COLUMNS = ['id', 'sessionId', 'entryPoint', 'visitedToolbox', 'visitedPortfolio', 'visitedAudit', 'contacted', 'converted', 'conversionValue', 'createdAt', 'updatedAt']

function normalizedNames(tableNames) {
  return new Set(
    tableNames.filter((name) => typeof name === 'string' && !name.startsWith('sqlite_')),
  )
}

function columnSet(columnsByTable, tableName) {
  return new Set(Array.isArray(columnsByTable[tableName]) ? columnsByTable[tableName] : [])
}

function containsAll(actual, required) {
  return required.every((column) => actual.has(column))
}

function assertCompleteTable(names, columnsByTable, tableName, requiredColumns) {
  if (!names.has(tableName)) {
    throw new Error(`legacy schema missing required core table ${tableName}`)
  }
  const actual = columnSet(columnsByTable, tableName)
  if (!containsAll(actual, requiredColumns)) {
    throw new Error(`partial ${tableName} schema detected; refusing automatic migration resolution`)
  }
  return actual
}

export function classifyPrismaBaselineState({ tableNames, migrations }) {
  const names = normalizedNames(tableNames)
  const userTables = [...names].filter((name) => name !== '_prisma_migrations')
  const hasMigrationTable = names.has('_prisma_migrations')

  if (!hasMigrationTable) {
    return userTables.length === 0 ? 'fresh-empty' : 'legacy-needs-baseline'
  }

  const baselineRows = migrations.filter((row) => row.migration_name === BASELINE_MIGRATION)
  if (baselineRows.some((row) => row.rolled_back_at)) {
    throw new Error('baseline migration was rolled back; refusing automatic baseline recovery')
  }

  const baselineApplied = baselineRows.some((row) => row.finished_at && !row.rolled_back_at)
  if (baselineApplied) return 'migration-managed'

  if (migrations.length > 0) {
    throw new Error('inconsistent migration history: records exist without a completed baseline migration')
  }

  return userTables.length === 0 ? 'fresh-empty' : 'legacy-needs-baseline'
}

export function planLegacyMigrationResolution({ tableNames, columnsByTable }) {
  const names = normalizedNames(tableNames)

  for (const [tableName, requiredColumns] of Object.entries(CORE_COLUMNS)) {
    assertCompleteTable(names, columnsByTable, tableName, requiredColumns)
  }

  const plan = [BASELINE_MIGRATION, OVERLAPPING_SNAPSHOT_MIGRATION]
  const projectColumns = columnSet(columnsByTable, 'Project')
  const hasContentType = projectColumns.has('contentType')
  const hasPublished = projectColumns.has('published')
  if (hasContentType !== hasPublished) {
    throw new Error('partial Project lifecycle schema detected; refusing automatic migration resolution')
  }
  if (hasContentType && hasPublished) {
    plan.push(PROJECT_LIFECYCLE_MIGRATION)
  }

  if (names.has('DiscoverItem')) {
    assertCompleteTable(names, columnsByTable, 'DiscoverItem', DISCOVER_COLUMNS)
    plan.push(DISCOVER_MIGRATION)
  }

  if (names.has('Lead')) {
    const leadColumns = assertCompleteTable(names, columnsByTable, 'Lead', LEAD_COLUMNS)
    plan.push(LEAD_MIGRATION)
    if (leadColumns.has('utmContent')) {
      plan.push(LEAD_UTM_MIGRATION)
    }
  }

  let analyticsShape = 'absent'
  if (names.has('AnalyticsEvent')) {
    const analyticsColumns = columnSet(columnsByTable, 'AnalyticsEvent')
    if (containsAll(analyticsColumns, ANALYTICS_CURRENT_COLUMNS)) {
      analyticsShape = 'current'
    } else if (containsAll(analyticsColumns, ANALYTICS_OLD_COLUMNS)) {
      analyticsShape = 'historical'
    } else {
      throw new Error('partial AnalyticsEvent schema detected; refusing automatic migration resolution')
    }
  }

  if (names.has('FunnelConversion')) {
    assertCompleteTable(names, columnsByTable, 'FunnelConversion', FUNNEL_COLUMNS)
  }

  if (analyticsShape === 'current') {
    if (!names.has('FunnelConversion')) {
      throw new Error('current AnalyticsEvent exists without FunnelConversion; refusing automatic migration resolution')
    }
    plan.push(ANALYTICS_RECONCILIATION_MIGRATION)
  }

  return plan
}

async function inspectDatabase() {
  const prisma = new PrismaClient()
  try {
    const tableRows = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    )
    const tableNames = tableRows.map((row) => row.name).filter((name) => typeof name === 'string')
    const columnsByTable = {}

    for (const tableName of tableNames) {
      if (tableName === '_prisma_migrations' || tableName.startsWith('sqlite_')) continue
      const escaped = tableName.replaceAll('"', '""')
      const columnRows = await prisma.$queryRawUnsafe(`PRAGMA table_info("${escaped}")`)
      columnsByTable[tableName] = columnRows
        .map((row) => row.name)
        .filter((name) => typeof name === 'string')
    }

    let migrations = []
    if (tableNames.includes('_prisma_migrations')) {
      migrations = await prisma.$queryRawUnsafe(
        'SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations" ORDER BY started_at ASC',
      )
    }

    return { tableNames, columnsByTable, migrations }
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  try {
    const inspection = await inspectDatabase()
    const state = classifyPrismaBaselineState(inspection)

    if (process.argv.includes('--legacy-resolve-plan')) {
      if (state !== 'legacy-needs-baseline') {
        throw new Error(`legacy resolution plan requested for non-legacy state: ${state}`)
      }
      const plan = planLegacyMigrationResolution(inspection)
      process.stdout.write(`${plan.join('\n')}\n`)
      return
    }

    process.stdout.write(`${state}\n`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    process.stderr.write(`[prisma-baseline-state] ${message}\n`)
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
