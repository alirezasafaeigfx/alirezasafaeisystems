import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('post-cutover production rollback contract', () => {
  it('persists exact release rollback state before migration/cutover', () => {
    const deploy = readFileSync(resolve(process.cwd(), 'ops/deploy/deploy.sh'), 'utf8')

    const snapshotIndex = deploy.indexOf('echo "[deploy] database snapshot created for release $RELEASE_ID"')
    const stateWriteIndex = deploy.indexOf('DEPLOY_STATE_FILE=')
    const migrationIndex = deploy.indexOf('pnpm exec prisma migrate deploy')

    expect(stateWriteIndex).toBeGreaterThan(snapshotIndex)
    expect(migrationIndex).toBeGreaterThan(stateWriteIndex)
    expect(deploy).toContain('DEPLOY_STATE_DIR="$SHARED_DIR/deploy-state/$ENVIRONMENT"')
    expect(deploy).toContain('PREVIOUS_RELEASE')
    expect(deploy).toContain('SNAPSHOT_DIR')
    expect(deploy).toContain('DB_PATH')
    expect(deploy).toContain('APP_WAS_RUNNING')
  })

  it('provides an exact-release rollback command that restores DB before previous app startup', () => {
    const rollbackPath = resolve(process.cwd(), 'ops/deploy/rollback-release.sh')
    expect(existsSync(rollbackPath)).toBe(true)

    const rollback = readFileSync(rollbackPath, 'utf8')
    const deleteIndex = rollback.indexOf('pm2 delete "$APP_NAME"')
    const restoreIndex = rollback.indexOf('if ! restore_database_snapshot', deleteIndex)
    const previousStartIndex = rollback.indexOf('pm2 start ecosystem.config.cjs --only "$APP_NAME" --update-env', restoreIndex)
    const readyIndex = rollback.indexOf('/api/ready', previousStartIndex)
    const linkIndex = rollback.indexOf('ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_LINK"', readyIndex)

    expect(rollback).toContain('shared/deploy-state')
    expect(deleteIndex).toBeGreaterThan(-1)
    expect(restoreIndex).toBeGreaterThan(deleteIndex)
    expect(previousStartIndex).toBeGreaterThan(restoreIndex)
    expect(readyIndex).toBeGreaterThan(previousStartIndex)
    expect(linkIndex).toBeGreaterThan(readyIndex)
  })

  it('rolls back only when post-deploy smoke or live browser verification fails', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('id: remote_deploy')
    expect(workflow).toContain('id: post_deploy_smoke')
    expect(workflow).toContain('name: Roll back failed production verification')
    expect(workflow).toContain("steps.remote_deploy.outcome == 'success'")
    expect(workflow).toContain("steps.post_deploy_smoke.outcome == 'failure'")
    expect(workflow).toContain("steps.live_verify.outcome == 'failure'")
    expect(workflow).toContain('bash ops/deploy/rollback-release.sh')
    expect(workflow).toContain("--release-id '$RELEASE_ID'")
  })
})
