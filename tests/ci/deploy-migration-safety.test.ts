import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('production database migration safety', () => {
  it('backs up persistent SQLite state and verifies structural baseline state before migration', () => {
    const deploy = readFileSync(resolve(process.cwd(), 'ops/deploy/deploy.sh'), 'utf8')

    const buildIndex = deploy.indexOf('pnpm run build')
    const baselineStateIndex = deploy.indexOf('node scripts/deploy/prisma-baseline-state.mjs')
    const preflightStatusIndex = deploy.indexOf('pnpm exec prisma migrate status 2>&1')
    const migrationIndex = deploy.indexOf('pnpm exec prisma migrate deploy', preflightStatusIndex)
    const postMigrationStatusIndex = deploy.indexOf('if ! pnpm exec prisma migrate status; then', migrationIndex)
    const replaceAppIndex = deploy.indexOf('pm2 delete "$APP_NAME"', postMigrationStatusIndex)
    const publishLinkIndex = deploy.indexOf('ln -sfn "$RELEASE_DIR" "$CURRENT_LINK"', replaceAppIndex)

    expect(deploy).toContain('20260617000000_baseline_legacy_portfolio')
    expect(deploy).toContain('The database schema is not empty')
    expect(deploy).toContain('Following migrations have not yet been applied')
    expect(deploy).toContain('legacy-needs-baseline')
    expect(deploy).toContain('ASDEV_BUILD_SKIP_DYNAMIC_DB=1 pnpm run build')
    expect(deploy).toContain('DATABASE_URL must use an absolute SQLite file URL')
    expect(deploy).toContain('DB_PATH="${DATABASE_URL#file:}"')
    expect(deploy).toContain('BACKUP_DIR="$BASE_DIR/shared/backups/$ENVIRONMENT"')
    expect(deploy).toContain('PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK" 2>/dev/null || true)"')
    expect(deploy).toContain('pm2 stop "$APP_NAME"')
    expect(deploy).toContain('snapshot_database')
    expect(deploy).toContain('restore_database_snapshot')
    expect(deploy).toContain('rollback_previous_release')
    expect(deploy).toContain('pm2 restart "$APP_NAME" --update-env')
    expect(buildIndex).toBeGreaterThan(-1)
    expect(baselineStateIndex).toBeGreaterThan(buildIndex)
    expect(preflightStatusIndex).toBeGreaterThan(baselineStateIndex)
    expect(migrationIndex).toBeGreaterThan(preflightStatusIndex)
    expect(postMigrationStatusIndex).toBeGreaterThan(migrationIndex)
    expect(replaceAppIndex).toBeGreaterThan(postMigrationStatusIndex)
    expect(publishLinkIndex).toBeGreaterThan(replaceAppIndex)
  })

  it('restores service availability when structural preflight, migration preflight, or baseline resolution fails', () => {
    const deploy = readFileSync(resolve(process.cwd(), 'ops/deploy/deploy.sh'), 'utf8')

    const structuralFailureIndex = deploy.indexOf('Prisma baseline state inspection failed; refusing rollout')
    const structuralRestartIndex = deploy.indexOf('restart_previous_app || true', structuralFailureIndex)
    const structuralExitIndex = deploy.indexOf('exit 1', structuralFailureIndex)
    const preflightFailureIndex = deploy.indexOf('Prisma migration preflight failed; refusing rollout')
    const preflightRestartIndex = deploy.indexOf('restart_previous_app || true', preflightFailureIndex)
    const preflightExitIndex = deploy.indexOf('exit 1', preflightFailureIndex)
    const baselineGuardIndex = deploy.indexOf(
      'if ! pnpm exec prisma migrate resolve --applied 20260617000000_baseline_legacy_portfolio; then',
    )
    const baselineFailureIndex = deploy.indexOf('baseline migration resolution failed; restoring pre-migration snapshot')
    const baselineRestoreIndex = deploy.indexOf('restore_database_snapshot', baselineFailureIndex)
    const baselineRestartIndex = deploy.indexOf('restart_previous_app || true', baselineFailureIndex)
    const baselineExitIndex = deploy.indexOf('exit 1', baselineFailureIndex)

    expect(structuralFailureIndex).toBeGreaterThan(-1)
    expect(structuralRestartIndex).toBeGreaterThan(structuralFailureIndex)
    expect(structuralExitIndex).toBeGreaterThan(structuralRestartIndex)
    expect(preflightFailureIndex).toBeGreaterThan(-1)
    expect(preflightRestartIndex).toBeGreaterThan(preflightFailureIndex)
    expect(preflightExitIndex).toBeGreaterThan(preflightRestartIndex)
    expect(baselineGuardIndex).toBeGreaterThan(-1)
    expect(baselineFailureIndex).toBeGreaterThan(baselineGuardIndex)
    expect(baselineRestoreIndex).toBeGreaterThan(baselineFailureIndex)
    expect(baselineRestartIndex).toBeGreaterThan(baselineRestoreIndex)
    expect(baselineExitIndex).toBeGreaterThan(baselineRestartIndex)
  })
})
