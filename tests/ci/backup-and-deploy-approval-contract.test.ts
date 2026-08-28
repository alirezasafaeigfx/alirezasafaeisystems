import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const temporaryDirectories: string[] = []
const shellCommand = process.platform === 'win32' ? 'C:\\WINDOWS\\system32\\bash.exe' : 'bash'

function shellPath(filePath: string): string {
  if (process.platform !== 'win32') return filePath
  return filePath.replace(/^([A-Za-z]):\\/, (_, drive: string) => `/mnt/${drive.toLowerCase()}/`).replaceAll('\\', '/')
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`
}

function createTemporaryDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), 'asdev-backup-contract-'))
  temporaryDirectories.push(directory)
  return directory
}

function runBackup(baseDir: string, backupRoot: string, sqliteBinary: string, dryRun = false) {
  return spawnSync(shellCommand, [
    '-lc',
    [
      `SQLITE_BIN=${shellQuote(shellPath(sqliteBinary))}`,
      `bash ${shellQuote(shellPath(resolve(process.cwd(), 'scripts/deploy/backup-onsite.sh')))}`,
      '--frequency daily',
      '--env production',
      `--base-dir ${shellQuote(shellPath(baseDir))}`,
      `--backup-root ${shellQuote(shellPath(backupRoot))}`,
      `--nginx-dir ${shellQuote(shellPath(join(baseDir, 'nginx')))}`,
      `--systemd-dir ${shellQuote(shellPath(join(baseDir, 'systemd')))}`,
      ...(dryRun ? ['--dry-run'] : []),
    ].join(' '),
  ], { encoding: 'utf8' })
}

function createSqliteWrapper(root: string): string {
  const wrapperPath = join(root, 'sqlite3-wrapper')
  writeFileSync(wrapperPath, `#!/usr/bin/env bash
set -euo pipefail
if [[ "\${1:-}" == "-readonly" ]]; then shift; fi
database="$1"
command="$2"
python3 - "$database" "$command" <<'PY'
import sqlite3
import sys

database, command = sys.argv[1:]
if command.startswith('.backup '):
    target = command[len('.backup '):].strip().strip("'")
    source = sqlite3.connect(database)
    destination = sqlite3.connect(target)
    source.backup(destination)
    destination.close()
    source.close()
elif command == 'PRAGMA integrity_check;':
    connection = sqlite3.connect(database)
    print(connection.execute('PRAGMA integrity_check').fetchone()[0])
    connection.close()
else:
    raise SystemExit(f'unsupported sqlite command: \${command}')
PY
`)
  chmodSync(wrapperPath, 0o755)
  return wrapperPath
}

function archivePath(backupRoot: string): string {
  return join(backupRoot, 'daily', readdirSync(join(backupRoot, 'daily')).find((name) => name.endsWith('.tar.gz')) as string)
}

function archiveEntries(backupRoot: string): string[] {
  return execFileSync(shellCommand, ['-lc', `tar -tzf ${shellQuote(shellPath(archivePath(backupRoot)))}`], {
    encoding: 'utf8',
  }).trim().split('\n')
}

function archiveEntry(filePath: string): string {
  return shellPath(filePath).replace(/^\//, '')
}

function mode(filePath: string): string {
  return execFileSync(shellCommand, ['-lc', `stat -c '%a' ${shellQuote(shellPath(filePath))}`], { encoding: 'utf8' }).trim()
}

function createWalDatabase(databasePath: string) {
  const script = "import sqlite3,sys;connection=sqlite3.connect(sys.argv[1]);connection.execute('PRAGMA journal_mode=WAL').fetchone();connection.execute('CREATE TABLE records (value TEXT NOT NULL)');connection.execute(\"INSERT INTO records (value) VALUES ('committed-through-wal')\");connection.commit();connection.close()"
  execFileSync(shellCommand, ['-lc', `python3 -c ${JSON.stringify(script)} ${shellQuote(shellPath(databasePath))}`])
}

function inspectSqlite(databasePath: string): { integrity: string; value: string } {
  const script = "import sqlite3,sys;connection=sqlite3.connect(sys.argv[1]);print(connection.execute('PRAGMA integrity_check').fetchone()[0]);print(connection.execute('SELECT value FROM records').fetchone()[0])"
  const [integrity, value] = execFileSync(shellCommand, ['-lc', `python3 -c ${JSON.stringify(script)} ${shellQuote(shellPath(databasePath))}`], {
    encoding: 'utf8',
  }).trim().split('\n')
  return { integrity, value }
}

function evaluateDeployGate(workflow: string, inputs: Record<string, string>): boolean {
  const condition = workflow.match(/needs: quality-gate\s+if: \$\{\{\s*([\s\S]*?)\s*\}\}/)?.[1]
  expect(condition).toBeDefined()
  return Function('inputs', `return Boolean(${condition})`)(inputs) as boolean
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

describe('onsite backup contract', () => {
  it('backs up a coherent SQLite WAL snapshot under a stable name with Discover media and env/config coverage', () => {
    const root = createTemporaryDirectory()
    const sqliteBinary = createSqliteWrapper(root)
    const baseDir = join(root, 'site')
    const backupRoot = join(root, 'backups')
    const persistentDatabase = join(baseDir, 'shared', 'data', 'production.db')
    const discoverUploads = join(baseDir, 'shared', 'data', 'uploads', 'discover')
    mkdirSync(join(baseDir, 'shared', 'env'), { recursive: true })
    mkdirSync(join(baseDir, 'shared', 'data'), { recursive: true })
    mkdirSync(join(baseDir, 'nginx'), { recursive: true })
    mkdirSync(join(baseDir, 'systemd'), { recursive: true })
    mkdirSync(discoverUploads, { recursive: true })
    writeFileSync(join(baseDir, 'shared', 'env', 'production.env'), 'SECRET_BACKUP_CONTRACT_VALUE')
    writeFileSync(join(discoverUploads, 'discover.webp'), 'image')
    writeFileSync(join(baseDir, 'systemd', 'my-portfolio-production.service'), '[Service]')

    createWalDatabase(persistentDatabase)
    const result = runBackup(baseDir, backupRoot, sqliteBinary)
    expect(result.status, result.stderr).toBe(0)

    const entries = archiveEntries(backupRoot)
    const restoredDatabase = join(root, 'restored.sqlite')

    expect(entries, entries.join('\n')).toContain('persistent.sqlite')
    expect(entries).not.toContain(archiveEntry(persistentDatabase))
    expect(entries).toContain(`${archiveEntry(discoverUploads)}/`)
    expect(entries).toContain(`${archiveEntry(join(baseDir, 'shared', 'env'))}/`)
    execFileSync(shellCommand, ['-lc', `tar -xOf ${shellQuote(shellPath(archivePath(backupRoot)))} persistent.sqlite > ${shellQuote(shellPath(restoredDatabase))}`])
    expect(inspectSqlite(restoredDatabase)).toEqual({ integrity: 'ok', value: 'committed-through-wal' })
    const backupScript = readFileSync(resolve(process.cwd(), 'scripts/deploy/backup-onsite.sh'), 'utf8')
    expect(backupScript).toContain('umask 077')
    expect(backupScript).toContain('chmod 700 "$BACKUP_ROOT" "$snapshot_parent"')
    expect(backupScript).toContain('chmod 700 "$target_dir"')
    expect(backupScript).toContain('chmod 600 "$archive_path" "$sha_path"')
    if (process.platform !== 'win32') {
      expect(mode(backupRoot)).toBe('700')
      expect(mode(join(backupRoot, 'daily'))).toBe('700')
      expect(mode(archivePath(backupRoot))).toBe('600')
    }
  }, 15_000)

  it('fails closed when the required production persistent database is missing', () => {
    const root = createTemporaryDirectory()
    const sqliteBinary = createSqliteWrapper(root)
    const baseDir = join(root, 'site')
    mkdirSync(join(baseDir, 'shared', 'env'), { recursive: true })
    mkdirSync(join(baseDir, 'nginx'), { recursive: true })
    mkdirSync(join(baseDir, 'systemd'), { recursive: true })

    const result = runBackup(baseDir, join(root, 'backups'), sqliteBinary)

    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('Missing persistent database')
  })

  it('does not write a snapshot or archive during a dry-run', () => {
    const root = createTemporaryDirectory()
    const sqliteBinary = createSqliteWrapper(root)
    const baseDir = join(root, 'site')
    const backupRoot = join(root, 'backups')
    mkdirSync(join(baseDir, 'shared', 'env'), { recursive: true })
    mkdirSync(join(baseDir, 'nginx'), { recursive: true })
    mkdirSync(join(baseDir, 'systemd'), { recursive: true })

    const result = runBackup(baseDir, backupRoot, sqliteBinary, true)

    expect(result.status, result.stderr).toBe(0)
    expect(existsSync(backupRoot)).toBe(false)
  })

  it('succeeds when the optional Discover media directory is absent', () => {
    const root = createTemporaryDirectory()
    const sqliteBinary = createSqliteWrapper(root)
    const baseDir = join(root, 'site')
    const backupRoot = join(root, 'backups')
    const databasePath = join(baseDir, 'shared', 'data', 'production.db')
    mkdirSync(join(baseDir, 'shared', 'env'), { recursive: true })
    mkdirSync(join(baseDir, 'shared', 'data'), { recursive: true })
    mkdirSync(join(baseDir, 'nginx'), { recursive: true })
    mkdirSync(join(baseDir, 'systemd'), { recursive: true })

    createWalDatabase(databasePath)
    const result = runBackup(baseDir, backupRoot, sqliteBinary)
    expect(result.status, result.stderr).toBe(0)
    expect(existsSync(join(backupRoot, 'daily'))).toBe(true)
  })
})

describe('VPS deployment approval contract', () => {
  it('binds deploy and status to the quality job immutable SHA and rejects incomplete approval combinations', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).not.toMatch(/^\s*push:/m)
    expect(workflow).toMatch(/outputs:\s+resolved_sha: \$\{\{ steps\.resolve_ref\.outputs\.sha \}\}/)
    expect(workflow).toMatch(/git rev-parse HEAD[\s\S]*GITHUB_OUTPUT/)
    expect(workflow).toMatch(/TARGET_REF: \$\{\{ needs\.quality-gate\.outputs\.resolved_sha \}\}/)
    expect(workflow).toMatch(/ref: \$\{\{ needs\.quality-gate\.outputs\.resolved_sha \}\}/)

    const productionInputs = {
      environment: 'production',
      staging_confirmation: '',
      production_confirmation: 'APPROVE_CRITICAL_SITE_PRODUCTION_DEPLOY',
      migration_confirmation: 'APPROVE_CRITICAL_SITE_MIGRATION',
    }
    expect(evaluateDeployGate(workflow, productionInputs)).toBe(true)
    expect(evaluateDeployGate(workflow, { ...productionInputs, migration_confirmation: '' })).toBe(false)
    expect(evaluateDeployGate(workflow, { ...productionInputs, production_confirmation: '' })).toBe(false)
    expect(evaluateDeployGate(workflow, { ...productionInputs, production_confirmation: 'DEPLOY' })).toBe(false)
    expect(evaluateDeployGate(workflow, {
      ...productionInputs,
      environment: 'staging',
      staging_confirmation: 'APPROVE_PHASE_2_STAGING_DEPLOY',
      production_confirmation: '',
      migration_confirmation: '',
    })).toBe(true)
    expect(evaluateDeployGate(workflow, { ...productionInputs, environment: 'staging', staging_confirmation: '' })).toBe(false)
  })
})
