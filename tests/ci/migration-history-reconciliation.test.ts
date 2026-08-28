import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('migration history reconciliation safety contract', () => {
  it('reconciles only a structurally verified historical localization migration', () => {
    const script = readFileSync(resolve(process.cwd(), 'scripts/deploy/reconcile-migration-history.mjs'), 'utf8')
    expect(script).toContain('20260820135055_discover_v2_localization')
    expect(script).toContain('20260828000000_add_discover_v3_fields')
    expect(script).toContain("['titleEn', 'descriptionEn', 'contentEn', 'publishedEn']")
    expect(script).toContain('refusing history reconciliation')
    expect(script).toContain('ADD COLUMN "publishedEn" BOOLEAN NOT NULL DEFAULT false')
    expect(script).toContain('process.stdout.write(`${LOCALIZATION_MIGRATION}')
  })

  it('runs reconciliation before migration status and deploy', () => {
    const deploy = readFileSync(resolve(process.cwd(), 'ops/deploy/deploy.sh'), 'utf8')
    const reconcile = deploy.indexOf('reconcile-migration-history.mjs')
    const migrateStatus = deploy.indexOf('prisma migrate status')
    const migrateDeploy = deploy.indexOf('prisma migrate deploy')
    expect(reconcile).toBeGreaterThan(-1)
    expect(reconcile).toBeLessThan(migrateStatus)
    expect(reconcile).toBeLessThan(migrateDeploy)
    expect(deploy).toContain('prisma migrate resolve --applied "$MIGRATION_RECONCILE"')
  })
})
