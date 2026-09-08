import { createHash } from 'node:crypto'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const marker = 'ASDEV-PUBLIC-EXPERIENCE-EVIDENCE-SHA256'

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

function expectedScopeSha256(manifest: Record<string, unknown>): string {
  const scope = {
    schemaVersion: manifest.schemaVersion,
    taskIds: manifest.taskIds,
    repository: manifest.repository,
    baseSha: manifest.baseSha,
    candidateSha: manifest.candidateSha,
    environment: manifest.environment,
    capturedAt: manifest.capturedAt,
    sourceDirty: manifest.sourceDirty,
    commands: manifest.commands,
    criteria: manifest.criteria,
    artifacts: manifest.artifacts,
    limitations: manifest.limitations,
  }
  return createHash('sha256').update(stableJson(scope)).digest('hex')
}

describe('public experience review-scope CLI', () => {
  it('prints the deterministic evidence attestation marker without requiring an existing review', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-review-scope-cli-'))
    const manifestPath = join(rootDir, 'manifest.json')
    const manifest = {
      schemaVersion: 1,
      taskIds: ['S5-01'],
      repository: 'alirezasafaeigfx/alirezasafaeisystems',
      baseSha: 'a'.repeat(40),
      candidateSha: 'b'.repeat(40),
      environment: 'REVIEW_WORKSPACE',
      capturedAt: '2026-09-08T14:00:00Z',
      sourceDirty: false,
      commands: [],
      criteria: [],
      artifacts: [],
      reviews: [],
      release: null,
      limitations: ['awaiting independent review'],
    }
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

    const result = spawnSync(process.execPath, [
      'scripts/ci/validate-public-experience-evidence-trusted.mjs',
      '--manifest',
      manifestPath,
      '--print-review-scope-sha256',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })

    expect(result.status).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toBe(`${marker}: ${expectedScopeSha256(manifest)}\n`)
  })

  it('does not interpret an option value as the print flag', () => {
    const result = spawnSync(process.execPath, [
      'scripts/ci/validate-public-experience-evidence-trusted.mjs',
      '--manifest',
      'package.json',
      '--root',
      '--print-review-scope-sha256',
    ], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })

    expect(result.status).toBe(1)
    expect(result.stdout).not.toContain(marker)
  })
})
