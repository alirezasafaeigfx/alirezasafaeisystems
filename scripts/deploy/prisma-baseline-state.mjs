import { pathToFileURL } from 'node:url'
import { PrismaClient } from '@prisma/client'

const BASELINE_MIGRATION = '20260617000000_baseline_legacy_portfolio'

export function classifyPrismaBaselineState({ tableNames, migrations }) {
  const names = new Set(
    tableNames.filter((name) => typeof name === 'string' && !name.startsWith('sqlite_')),
  )
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

async function inspectDatabase() {
  const prisma = new PrismaClient()
  try {
    const tableRows = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    )
    const tableNames = tableRows.map((row) => row.name).filter((name) => typeof name === 'string')

    let migrations = []
    if (tableNames.includes('_prisma_migrations')) {
      migrations = await prisma.$queryRawUnsafe(
        'SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations" ORDER BY started_at ASC',
      )
    }

    return classifyPrismaBaselineState({ tableNames, migrations })
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  try {
    const state = await inspectDatabase()
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
