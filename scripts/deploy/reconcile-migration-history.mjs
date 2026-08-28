import { PrismaClient } from '@prisma/client'

const LOCALIZATION_MIGRATION = '20260820135055_discover_v2_localization'
const V3_MIGRATION = '20260828000000_add_discover_v3_fields'
const REQUIRED_COLUMNS = ['titleEn', 'descriptionEn', 'contentEn', 'publishedEn']

const prisma = new PrismaClient()

try {
  const migrations = await prisma.$queryRawUnsafe(
    'SELECT migration_name, finished_at, rolled_back_at FROM "_prisma_migrations"',
  )
  const names = new Set(
    migrations
      .filter((row) => row.finished_at && !row.rolled_back_at)
      .map((row) => row.migration_name),
  )

  if (names.has(LOCALIZATION_MIGRATION) || !names.has(V3_MIGRATION)) {
    process.exitCode = 0
  } else {
    const columns = await prisma.$queryRawUnsafe('PRAGMA table_info("DiscoverItem")')
    const actual = new Set(columns.map((row) => row.name))
    if (!REQUIRED_COLUMNS.every((column) => actual.has(column))) {
      throw new Error('DiscoverItem localization schema is incomplete; refusing history reconciliation')
    }
    process.stdout.write(`${LOCALIZATION_MIGRATION}\n`)
  }
} finally {
  await prisma.$disconnect()
}
