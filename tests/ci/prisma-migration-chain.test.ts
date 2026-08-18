import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'

const tempDirs: string[] = []

function createDatabaseUrl() {
  const directory = mkdtempSync(join(tmpdir(), 'asdev-prisma-migrations-'))
  tempDirs.push(directory)
  return `file:${join(directory, 'database.sqlite')}`
}

function runPrisma(args: string[], databaseUrl: string) {
  const prismaCli = resolve(process.cwd(), 'node_modules/prisma/build/index.js')
  return execFileSync(process.execPath, [prismaCli, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    encoding: 'utf8',
    stdio: 'pipe',
  })
}

afterEach(() => {
  for (const directory of tempDirs.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('Prisma migration history', () => {
  it('replays from an empty SQLite database and matches the runtime Prisma schema', async () => {
    const databaseUrl = createDatabaseUrl()

    expect(() =>
      runPrisma(['migrate', 'deploy', '--schema', 'prisma/schema.prisma'], databaseUrl),
    ).not.toThrow()
    expect(() =>
      runPrisma(['migrate', 'status', '--schema', 'prisma/schema.prisma'], databaseUrl),
    ).not.toThrow()

    const db = new PrismaClient({ datasourceUrl: databaseUrl })
    try {
      await expect(db.project.findMany({ take: 1 })).resolves.toBeDefined()
      await expect(db.discoverItem.findMany({ take: 1 })).resolves.toBeDefined()
      await expect(db.lead.findMany({ take: 1 })).resolves.toBeDefined()
      await expect(db.analyticsEvent.findMany({ take: 1 })).resolves.toBeDefined()
      await expect(db.funnelConversion.findMany({ take: 1 })).resolves.toBeDefined()
    } finally {
      await db.$disconnect()
    }
  })
})
