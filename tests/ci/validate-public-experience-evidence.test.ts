import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { validatePublicExperienceEvidence, type PublicExperienceEvidenceManifest } from '@/../scripts/ci/validate-public-experience-evidence.mjs'

const sha = 'a'.repeat(40)

function fixture(overrides: Partial<PublicExperienceEvidenceManifest> = {}): PublicExperienceEvidenceManifest {
  return {
    schemaVersion: 1,
    taskIds: ['S5-01'],
    repository: 'alirezasafaeigfx/alirezasafaeisystems',
    baseSha: sha,
    candidateSha: 'b'.repeat(40),
    environment: 'REVIEW_WORKSPACE',
    capturedAt: '2026-08-30T22:00:00Z',
    sourceDirty: false,
    commands: [{ command: 'pnpm test', workingDirectory: '.', runtime: 'Node 22', startedAt: '2026-08-30T21:00:00Z', endedAt: '2026-08-30T21:01:00Z', exitCode: 0, status: 'pass', counts: { passed: 1, failed: 0, skipped: 0 } }],
    criteria: [{ id: 'S5-01-manifest', verdict: 'PASS', evidenceRefs: ['artifact-1'] }],
    artifacts: [{ id: 'artifact-1', relativePath: 'evidence.png', sha256: '3f786850e387550fdab836ed7e6dc881de23001b', locale: 'fa', viewport: '390x844', state: 'pressure', captureConditions: 'reduced-motion' }],
    reviews: [{ author: 'Independent reviewer', type: 'independent-agent', scopeSha: 'b'.repeat(40), findings: [], disposition: 'accepted' }],
    release: null,
    limitations: [],
    ...overrides,
  }
}

describe('public experience evidence manifest validator', () => {
  it('accepts a complete manifest with a matching artifact hash', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({ artifacts: [{ ...fixture().artifacts[0], sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' }] })
    expect(validatePublicExperienceEvidence(manifest, { rootDir })).toEqual([])
  })

  it('rejects a wrong artifact hash and a skipped critical criterion', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({
      artifacts: [{ ...fixture().artifacts[0], sha256: '0'.repeat(64) }],
      criteria: [{ id: 'S5-01-critical', verdict: 'SKIP', evidenceRefs: [] }],
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('artifact-1'),
      expect.stringContaining('S5-01-critical'),
    ]))
  })
})

