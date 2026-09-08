import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  validateIndependentReviewProvenance,
  validatePublicExperienceEvidenceTrusted,
} from '@/../scripts/ci/validate-public-experience-evidence-trusted.mjs'

const baseSha = 'a'.repeat(40)
const candidateSha = 'b'.repeat(40)
const artifactHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
const providerUrl = 'https://github.com/alirezasafaeigfx/alirezasafaeisystems/pull/123#pullrequestreview-456'

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

function providerBackedManifest() {
  const manifest = forgedReviewManifest()
  return {
    ...manifest,
    reviews: [{
      ...manifest.reviews[0],
      author: 'TrustedReviewer',
      provider: 'github-pull-request-review',
      providerUrl,
    }],
  }
}

function stubGithubProvider({ headSha = candidateSha, available = true } = {}) {
  vi.stubGlobal('fetch', vi.fn(async (input: unknown) => {
    if (!available) return { ok: false }
    const url = String(input)
    if (url.endsWith('/pulls/123/reviews/456')) {
      return {
        ok: true,
        json: async () => ({
          id: 456,
          html_url: providerUrl,
          state: 'APPROVED',
          commit_id: candidateSha,
          user: { login: 'TrustedReviewer' },
        }),
      }
    }
    if (url.endsWith('/pulls/123')) {
      return {
        ok: true,
        json: async () => ({
          number: 123,
          head: { sha: headSha },
          user: { login: 'alirezasafaeigfx' },
        }),
      }
    }
    return { ok: false }
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('public experience review provenance', () => {
  it('rejects a manifest-authored accepted review that has no provider verification', async () => {
    const errors = await validateIndependentReviewProvenance(forgedReviewManifest())

    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('provider-verified independent review'),
    ]))
  })

  it('accepts an approved provider review bound to the exact candidate and an independent reviewer', async () => {
    stubGithubProvider()

    expect(await validateIndependentReviewProvenance(providerBackedManifest())).toEqual([])
  })

  it('rejects a provider review when the pull-request head no longer matches candidateSha', async () => {
    stubGithubProvider({ headSha: 'c'.repeat(40) })

    expect(await validateIndependentReviewProvenance(providerBackedManifest())).toEqual([
      'manifest requires a provider-verified independent review for candidateSha',
    ])
  })

  it('fails closed when the review provider is unavailable', async () => {
    stubGithubProvider({ available: false })

    expect(await validateIndependentReviewProvenance(providerBackedManifest())).toEqual([
      'independent review provider unavailable; provider-verified independent review required',
    ])
  })

  it('keeps final workflow-dispatch acceptance on the trusted provider-backed validator', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/e2e-smoke.yml'), 'utf8')

    expect(workflow).toContain('pull-requests: read')
    expect(workflow).toContain('GITHUB_TOKEN: ${{ github.token }}')
    expect(workflow).toContain('node scripts/ci/validate-public-experience-evidence-trusted.mjs')
  })

  it('keeps the trusted wrapper fail-closed for structural and remote evidence checks', async () => {
    const manifest = forgedReviewManifest()
    manifest.artifacts = []

    const errors = await validatePublicExperienceEvidenceTrusted(manifest, {
      rootDir: process.cwd(),
      verifyGitIdentity: false,
    })

    expect(errors).toEqual(expect.arrayContaining([
      'artifacts must be non-empty',
      expect.stringContaining('provider-verified independent review'),
    ]))
  })
})
