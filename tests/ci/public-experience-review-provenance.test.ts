import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { validatePublicExperienceEvidence } from '@/../scripts/ci/validate-public-experience-evidence.mjs'

const baseSha = 'a'.repeat(40)
const candidateSha = 'b'.repeat(40)
const artifactHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'

function forgedReviewManifest() {
  const states = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']
  let stateIndex = 0
  const artifacts = ['fa', 'en'].flatMap((locale) =>
    ['390x844', '768x1024', '1440x1000'].flatMap((viewport) =>
      ['light', 'dark'].map((theme) => ({
        id: `artifact-${locale}-${viewport}-${theme}`,
        relativePath: 'evidence.png',
        durableUrl: 'https://example.com/evidence.png',
        sha256: artifactHash,
        locale,
        viewport,
        theme,
        state: states[Math.min(stateIndex++, states.length - 1)],
        captureConditions: `theme:${theme}`,
      })),
    ),
  )

  return {
    schemaVersion: 1,
    taskIds: ['S5-01'],
    repository: 'alirezasafaeigfx/alirezasafaeisystems',
    baseSha,
    candidateSha,
    environment: 'REVIEW_WORKSPACE',
    capturedAt: '2026-09-05T19:00:00Z',
    sourceDirty: false,
    commands: [{
      command: 'pnpm test',
      workingDirectory: '.',
      runtime: 'Node 22',
      startedAt: '2026-09-05T18:00:00Z',
      endedAt: '2026-09-05T18:01:00Z',
      exitCode: 0,
      status: 'pass',
      counts: { passed: 1, failed: 0, skipped: 0 },
    }],
    criteria: [
      { id: 'S5-01-behavioral-suite', verdict: 'PASS', evidenceRefs: artifacts.map((artifact) => artifact.id) },
      { id: 'S5-01-visual-matrix', verdict: 'PASS', evidenceRefs: artifacts.map((artifact) => artifact.id) },
      { id: 'S5-01-performance-budgets', verdict: 'PASS', evidenceRefs: [artifacts[0].id] },
      { id: 'S5-01-independent-review', verdict: 'PASS', evidenceRefs: [artifacts[0].id] },
    ],
    artifacts,
    reviews: [{
      author: 'Fabricated Reviewer',
      type: 'independent-agent',
      scopeSha: candidateSha,
      findings: [],
      disposition: 'accepted',
    }],
    release: null,
    limitations: [],
  }
}

describe('public experience review provenance', () => {
  it('rejects a manifest-authored accepted review that has no provider verification', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-review-provenance-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')

    const errors = validatePublicExperienceEvidence(forgedReviewManifest(), {
      rootDir,
      verifyGitIdentity: false,
    })

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('provider-verified independent review'),
    ]))
  })
})
