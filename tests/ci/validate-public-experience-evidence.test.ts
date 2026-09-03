import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { validatePublicExperienceEvidence, validateRemoteArtifacts, type PublicExperienceEvidenceManifest } from '@/../scripts/ci/validate-public-experience-evidence.mjs'
import { createPublicExperienceEvidenceDraft } from '@/../scripts/ci/create-public-experience-evidence-draft.mjs'

const sha = 'a'.repeat(40)

function fixture(overrides: Partial<PublicExperienceEvidenceManifest> = {}): PublicExperienceEvidenceManifest {
  const states = ['pressure', 'diagnosis', 'intervention', 'stable', 'evidence']
  const matrix = ['fa', 'en'].flatMap((locale) =>
    ['390x844', '768x1024', '1440x1000'].flatMap((viewport) =>
      ['light', 'dark'].map((theme) => ({ id: `artifact-${locale}-${viewport}-${theme}`, relativePath: 'evidence.png', durableUrl: 'https://example.com/evidence.png', sha256: '3f786850e387550fdab836ed7e6dc881de23001b', locale, viewport, theme, state: states.shift() ?? 'evidence', captureConditions: `theme:${theme}` })),
    ),
  )
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
    criteria: [
      { id: 'S5-01-behavioral-suite', verdict: 'PASS', evidenceRefs: matrix.map((artifact) => artifact.id) },
      { id: 'S5-01-visual-matrix', verdict: 'PASS', evidenceRefs: matrix.map((artifact) => artifact.id) },
      { id: 'S5-01-performance-budgets', verdict: 'PASS', evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S5-01-independent-review', verdict: 'PASS', evidenceRefs: ['artifact-fa-390x844-light'] },
    ],
    artifacts: matrix,
    reviews: [{ author: 'Goodall', type: 'independent-agent', scopeSha: 'b'.repeat(40), findings: [], disposition: 'accepted' }],
    release: null,
    limitations: [],
    ...overrides,
  }
}

describe('public experience evidence manifest validator', () => {
  it('accepts a complete manifest with a matching artifact hash', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({ artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' })) })
    expect(validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })).toEqual([])
  })

  it('rejects a wrong artifact hash and a skipped critical criterion', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({
      artifacts: [{ ...fixture().artifacts[0], sha256: '0'.repeat(64) }],
      criteria: [{ id: 'S5-01-critical', verdict: 'SKIP', evidenceRefs: [] }],
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('artifact-fa-390x844-light'),
      expect.stringContaining('S5-01-critical'),
    ]))
  })

  it('rejects missing evidence references, contradictory command results, and invalid timestamps', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({
      capturedAt: '2026-02-31T22:00:00Z',
      commands: [{ ...fixture().commands[0], startedAt: '2026-08-30T22:00:00Z', endedAt: '2026-08-30T21:00:00Z', exitCode: 99, status: 'pass', counts: { passed: 1, failed: 1, skipped: 0 } }],
      criteria: [{ id: 'S5-01-critical', verdict: 'PASS', evidenceRefs: ['missing'] }],
      artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' })),
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('capturedAt'),
      expect.stringContaining('command 0'),
      expect.stringContaining('missing'),
    ]))
  })

  it('requires an accepted independent review and the complete release contract', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({
      artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' })),
      reviews: [{ ...fixture().reviews[0], disposition: 'pending' }],
      release: { applicationSha: 'b'.repeat(40), workflowRun: '123', releaseId: 'release-1' },
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('accepted independent review'),
      expect.stringContaining('workflow attempt'),
    ]))
  })

  it('verifies candidate identity and base ancestry when enforcement is enabled', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-git-'))
    execFileSync('git', ['init'], { cwd: rootDir })
    execFileSync('git', ['config', 'user.email', 'evidence@example.com'], { cwd: rootDir })
    execFileSync('git', ['config', 'user.name', 'Evidence Test'], { cwd: rootDir })
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    execFileSync('git', ['add', 'evidence.png'], { cwd: rootDir })
    execFileSync('git', ['commit', '-m', 'base'], { cwd: rootDir })
    const baseSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim()
    writeFileSync(join(rootDir, 'second.txt'), 'second')
    execFileSync('git', ['add', 'second.txt'], { cwd: rootDir })
    execFileSync('git', ['commit', '-m', 'candidate'], { cwd: rootDir })
    const candidateSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim()
    const manifest = fixture({
      baseSha,
      candidateSha,
      artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' })),
      reviews: [{ ...fixture().reviews[0], scopeSha: candidateSha }],
    })
    expect(validatePublicExperienceEvidence(manifest, { rootDir })).toEqual([])
    expect(validatePublicExperienceEvidence({ ...manifest, candidateSha: 'c'.repeat(40) }, { rootDir })).toEqual(expect.arrayContaining([expect.stringContaining('checked-out commit')]))
  })

  it('executes the CLI entrypoint on Windows-style relative argv paths', () => {
    const result = spawnSync(process.execPath, ['scripts/ci/validate-public-experience-evidence.mjs', '--manifest', 'missing.json'], { cwd: process.cwd(), encoding: 'utf8' })
    expect(result.status).not.toBe(0)
    expect(`${result.stderr}${result.stdout}`).toContain('missing.json')
  })

  it('rejects missing task criteria and malformed locale, viewport, state, and path fields without throwing', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({
      taskIds: ['S4-11'],
      artifacts: [{
        ...fixture().artifacts[0],
        relativePath: 42 as unknown as string,
        locale: 'unknown',
        viewport: 'mobile',
        theme: 'unknown',
        state: '',
        sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      }],
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('S4-11-gpu-deferred'),
      expect.stringContaining('relative path'),
      expect.stringContaining('locale, viewport, theme, state'),
    ]))
  })

  it('registers every claimed S2, S3, and S4 task so a complete exact-candidate manifest has no unregistered task error', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const validHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    const taskIds = ['S2-01', 'S2-02', 'S2-05', 'S2-06', 'S3-01', 'S3-03', 'S3-04', 'S3-05', 'S3-06', 'S4-01', 'S4-02', 'S4-03', 'S4-05', 'S4-06', 'S4-07', 'S4-10', 'S4-11', 'S4-12']
    const criteria = [
      ...['S2-01-accessible-primitives', 'S2-02-flagship-documentary', 'S2-05-provenance-verdict', 'S2-06-flagship-index', 'S3-01-slow-network-media', 'S3-03-query-regression', 'S3-04-blog-readiness', 'S3-05-publication-contract', 'S3-06-localized-seo', 'S4-01-home-hierarchy', 'S4-02-bilingual-composition', 'S4-03-mobile-resilience', 'S4-05-finite-motion', 'S4-06-five-state-scene', 'S4-07-measured-native-baseline'].map((id) => ({ id, verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] })),
      { id: 'S4-10-dependency-scope', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S4-10-advanced-motion', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S4-11-gpu-deferred', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S4-11-gpu-fallback', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S4-11-gpu-budget', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
      { id: 'S4-12-comparison-inspection', verdict: 'PASS' as const, evidenceRefs: ['artifact-fa-390x844-light'] },
    ]
    const manifest = fixture({
      taskIds,
      criteria,
      artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: validHash })),
    })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors.filter((error) => error.includes('has no registered evidence criteria') || error.includes('is missing required criterion'))).toEqual([])
  })

  it('creates a candidate-identified hosted draft that remains invalid until durable evidence and review are supplied', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-draft-'))
    const candidateSha = 'b'.repeat(40)
    const manifestPath = createPublicExperienceEvidenceDraft({ rootDir, baseSha: sha, candidateSha, taskIds: ['S2-01', 'S3-01', 'S4-12'] })
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PublicExperienceEvidenceManifest
    expect(manifest.candidateSha).toBe(candidateSha)
    expect(manifest.taskIds).toEqual(['S2-01', 'S3-01', 'S4-12'])
    expect(validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })).toEqual(expect.arrayContaining([
      'commands must be non-empty',
      'criteria must be non-empty',
      'artifacts must be non-empty',
      'reviews must be non-empty',
    ]))
  })

  it('requires the complete fa/en light/dark visual matrix at 390, 768, and 1440 widths', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const manifest = fixture({ artifacts: fixture().artifacts.filter((artifact) => artifact.id === 'artifact-fa-390x844-light').map((artifact) => ({ ...artifact, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' })) })
    expect(validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })).toEqual(expect.arrayContaining([expect.stringContaining('visual matrix')]))
  })

  it('rejects generic reviewer identities and expiring GitHub Actions URLs', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const validHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    const manifest = fixture({ artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: validHash, durableUrl: 'https://api.github.com/repos/example/repo/actions/artifacts/456/zip' })), reviews: [{ ...fixture().reviews[0], author: 'Independent reviewer' }] })
    const errors = validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })
    expect(errors.some((error) => error.includes('non-generic reviewer'))).toBe(true)
    expect(errors.some((error) => error.includes('durable'))).toBe(true)
  })

  it('requires release.applicationSha to match candidateSha', () => {
    const rootDir = mkdtempSync(join(tmpdir(), 'asdev-evidence-'))
    writeFileSync(join(rootDir, 'evidence.png'), 'hello')
    const validHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
    const manifest = fixture({ artifacts: fixture().artifacts.map((artifact) => ({ ...artifact, sha256: validHash })), release: { applicationSha: 'c'.repeat(40), workflowRun: '123', workflowAttempt: 1, releaseId: 'release-1', priorRelease: 'release-0', rollbackExercised: false } })
    expect(validatePublicExperienceEvidence(manifest, { rootDir, verifyGitIdentity: false })).toEqual(expect.arrayContaining([expect.stringContaining('applicationSha must match candidateSha')]))
  })

  it('retrieves remote artifacts and verifies their bytes', async () => {
    const response = new Response('hello', { status: 200 })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
    const manifest = fixture({ artifacts: [{ ...fixture().artifacts[0], sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' }] })
    await expect(validateRemoteArtifacts(manifest)).resolves.toEqual([])
    vi.unstubAllGlobals()
  })
})
