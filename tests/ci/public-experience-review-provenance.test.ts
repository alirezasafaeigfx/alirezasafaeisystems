import { createHash } from 'node:crypto'
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
const evidenceMarker = 'ASDEV-PUBLIC-EXPERIENCE-EVIDENCE-SHA256'

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

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}

function expectedReviewScopeSha256(manifest: ReturnType<typeof providerBackedManifest>): string {
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

function attestationBody(manifest: ReturnType<typeof providerBackedManifest>): string {
  return `${evidenceMarker}: ${expectedReviewScopeSha256(manifest)}`
}

function stubGithubProvider({
  headSha = candidateSha,
  baseSha: providerBaseSha = baseSha,
  baseRepository = 'alirezasafaeigfx/alirezasafaeisystems',
  available = true,
  reviewBody = '',
  reviewer = 'TrustedReviewer',
  pullAuthor = 'alirezasafaeigfx',
  commitAuthor: providerCommitAuthor = 'ImplementationAuthor',
  commitCommitter: providerCommitCommitter = 'TrustedCommitter',
  includeChangesRequested = false,
} = {}) {
  vi.stubGlobal('fetch', vi.fn(async (input: unknown) => {
    if (!available) return { ok: false }
    const url = String(input)
    if (url.endsWith('/pulls/123/reviews/456')) return {
      ok: true,
      json: async () => ({
        id: 456,
        html_url: providerUrl,
        state: 'APPROVED',
        commit_id: candidateSha,
        body: reviewBody,
        submitted_at: '2026-09-08T14:00:00Z',
        user: { login: reviewer },
      }),
    }
    if (url.includes('/pulls/123/reviews?')) {
      return {
        ok: true,
        headers: new Headers(),
        json: async () => [{
          id: 456,
          html_url: providerUrl,
          state: 'APPROVED',
          commit_id: candidateSha,
          body: reviewBody,
          submitted_at: '2026-09-08T14:00:00Z',
          user: { login: reviewer },
        }, ...(includeChangesRequested ? [{
          id: 457,
          state: 'CHANGES_REQUESTED',
          commit_id: candidateSha,
          submitted_at: '2026-09-08T14:01:00Z',
          user: { login: 'BlockingReviewer' },
        }] : [])],
      }
    }
    if (url.includes('/pulls/123/commits?')) return {
      ok: true,
      headers: new Headers(),
      json: async () => [{
        author: providerCommitAuthor ? { login: providerCommitAuthor } : null,
        committer: providerCommitCommitter ? { login: providerCommitCommitter } : null,
      }],
    }
    if (url.endsWith('/pulls/123')) {
      return {
        ok: true,
        json: async () => ({
          number: 123,
          head: { sha: headSha },
          base: { sha: providerBaseSha, repo: { full_name: baseRepository } },
          user: { login: pullAuthor },
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

  it('accepts an approved provider review bound to the exact candidate, evidence scope, and an independent reviewer', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).toEqual([])
  })

  it('rejects an otherwise valid approved provider review when evidence-scope attestation is missing', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ reviewBody: '' })

    expect(await validateIndependentReviewProvenance(manifest)).toEqual([
      'manifest requires a provider-verified independent review for candidateSha and evidence scope',
    ])
  })

  it('rejects a provider review when the pull-request head no longer matches candidateSha', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ headSha: 'c'.repeat(40), reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).toEqual([
      'manifest requires a provider-verified independent review for candidateSha',
    ])
  })

  it.each([
    ['base SHA', { baseSha: 'c'.repeat(40) }],
    ['base repository', { baseRepository: 'attacker/fork' }],
  ])('rejects a provider review with mismatched %s', async (_name, options) => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ ...options, reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).not.toEqual([])
  })

  it('fails closed when a commit author identity is unavailable', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ commitAuthor: '', reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).not.toEqual([])
  })

  it('fails closed when a commit committer identity is unavailable', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ commitCommitter: '', reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).not.toEqual([])
  })

  it('rejects an approval from an implementation author', async () => {
    const manifest = providerBackedManifest()
    manifest.reviews[0].author = 'ImplementationAuthor'
    stubGithubProvider({ reviewer: 'ImplementationAuthor', reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).not.toEqual([])
  })

  it('rejects an outstanding provider changes-requested disposition omitted from the manifest', async () => {
    const manifest = providerBackedManifest()
    stubGithubProvider({ includeChangesRequested: true, reviewBody: attestationBody(manifest) })

    expect(await validateIndependentReviewProvenance(manifest)).not.toEqual([])
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
    expect(workflow).toMatch(/evidence_manifest:\s*[\s\S]*?required: true/)
    expect(workflow).not.toContain("inputs.evidence_manifest != ''")
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
