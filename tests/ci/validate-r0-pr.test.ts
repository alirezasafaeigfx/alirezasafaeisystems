import { describe, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { isGitAncestor, validateR0PullRequest } from '../../scripts/ci/validate-r0-pr.mjs'

const sha = (character: string) => character.repeat(40)
const declaration = {
  taskId: 'R0-05A',
  intendedBaseSha: sha('a'),
  primaryConcern: 'bounded ancestry and scope guard',
  expectedCategories: ['workflow', 'ci', 'governance', 'report'],
}

describe('R0 bounded PR preflight', () => {
  it('evaluates real git ancestry as text in the CLI path', () => {
    expect(isGitAncestor('HEAD', 'HEAD')).toBe(true)
  })

  it('requires a canonical task declaration and expected path categories', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/ci-router.yml'],
      taskId: '',
      intendedBaseSha: '',
      primaryConcern: '',
      expectedCategories: [],
    })
    expect(errors).toEqual(expect.arrayContaining([
      'canonical task ID is required',
      'intended base SHA is required',
      'primary concern is required',
      'expected changed-path categories are required',
    ]))
  })

  it('rejects a declared scope that omits a changed category', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/ci-router.yml', 'scripts/ci/validate-r0-pr.mjs'],
      taskId: 'R0-05A',
      intendedBaseSha: sha('a'),
      primaryConcern: 'bounded ancestry and scope guard',
      expectedCategories: ['workflow'],
    })
    expect(errors).toContain('changed path category "ci" is not declared in expected categories')
  })

  it('fails closed when application, content, workflow, or deployment scope crosses the declaration', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/ci-router.yml', 'src/app/page.tsx', 'ops/deploy/release.sh'],
      taskId: 'R0-05A',
      intendedBaseSha: sha('a'),
      primaryConcern: 'bounded ancestry and scope guard',
      expectedCategories: ['workflow'],
    })
    expect(errors).toEqual(expect.arrayContaining([
      'application path category is forbidden in R0 infrastructure PR: src/app/page.tsx',
      'deployment path category is forbidden in R0 infrastructure PR: ops/deploy/release.sh',
      'changed path category "application" is not declared in expected categories',
      'changed path category "deployment" is not declared in expected categories',
    ]))
  })

  it('rejects a stale base even when the changed files look infrastructural', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('c'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/deploy-vps.yml'],
      ...declaration,
    })
    expect(errors).toContain(`R0 infrastructure PR must be based on current main ${sha('c')}; received ${sha('a')}`)
  })

  it('fails closed when an infrastructure PR contains application/UI/content paths', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/deploy-vps.yml', 'src/app/page.tsx', 'public/images/proof.png'],
      ...declaration,
    })
    expect(errors).toEqual(expect.arrayContaining([
      'application path category is forbidden in R0 infrastructure PR: src/app/page.tsx',
      'application path category is forbidden in R0 infrastructure PR: public/images/proof.png',
    ]))
  })

  it('rejects oversized bounded fixes and paths outside the allowlist', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: Array.from({ length: 13 }, (_, index) => `docs/other/file-${index}.md`),
      ...declaration,
    })
    expect(errors).toContain('R0 infrastructure PR changes 13 files; maximum is 12')
    expect(errors[1]).toContain('path is outside the bounded R0 infrastructure allowlist')
  })

  it('does not apply the bounded guard to unrelated non-sensitive scopes', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('c'),
      scope: 'product',
      changedFiles: ['src/app/page.tsx'],
    })).toEqual([])
  })

  it('admits the bounded Network Smoke ownership contract', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: [
        '.github/workflows/network-smoke-nightly.yml',
        'scripts/enterprise-network-audit.mjs',
        'scripts/network-smoke-matrix.mjs',
        'scripts/lib/network-smoke-summary.mjs',
        'scripts/lib/network-smoke-target-policy.mjs',
        'scripts/network/README.md',
        'tests/ci/network-smoke-summary.test.ts',
      ],
      taskId: 'NET-SMOKE-OWNERSHIP',
      intendedBaseSha: sha('a'),
      primaryConcern: 'per-target Network Smoke release ownership',
      expectedCategories: ['workflow', 'ci', 'guide'],
      mergeBaseSha: sha('a'),
      headIsDescendant: true,
    })).toEqual([])
  })
})

describe('public-experience dependency preflight', () => {
  const publicDeclaration = {
    taskId: 'S4-10,S4-11',
    intendedBaseSha: sha('a'),
    primaryConcern: 'public experience advanced motion and GPU prototype',
    expectedCategories: ['workflow', 'ci', 'governance', 'release', 'application', 'guide'],
  }

  it('accepts the declared bounded dependency and UI unit', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'public-experience-dependencies',
      changedFiles: [
        '.github/workflows/ci-router.yml',
        '.github/pull_request_template.md',
        'scripts/ci/validate-r0-pr.mjs',
        'tests/ci/validate-r0-pr.test.ts',
        'package.json',
        'pnpm-lock.yaml',
        'src/components/public/system-core-3d.tsx',
        'src/components/public/operational-scene.tsx',
        'src/lib/system-scene.ts',
        'src/generated/sitemap-manifest.json',
        'src/app/loading.tsx',
        'src/app/case-studies/page.tsx',
        'e2e/a11y.spec.ts',
        'e2e/public-experience.spec.mjs',
        'e2e/system-core-3d-lifecycle.spec.mjs',
        'docs/engineering/PUBLIC_EXPERIENCE_ENGINEERING.md',
      ],
      mergeBaseSha: sha('a'),
      headIsDescendant: true,
      ...publicDeclaration,
    })).toEqual([])
  })

  it('accepts the bounded V3.2 evidence workflow and measurement harness', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'public-experience-dependencies',
      changedFiles: [
        '.github/workflows/e2e-smoke.yml',
        '.github/workflows/lighthouse.yml',
        'scripts/ci/create-public-experience-evidence-draft.mjs',
        'scripts/ci/validate-public-experience-evidence-trusted.mjs',
        'scripts/ci/inspect-public-experience-build.mjs',
        'scripts/ci/measure-public-experience-budget.mjs',
        'scripts/ci/public-experience-attribution.mjs',
        'scripts/ci/run-lighthouse-budget.mjs',
        'scripts/ci/run-public-experience-comparison.mjs',
        'scripts/ci/verify-home-initial-chunks.mjs',
        'scripts/test/seed-playwright-discover.mjs',
        'tests/ci/lighthouse-budget-runner.test.ts',
        'tests/ci/playwright-discover-fixture.test.ts',
        'tests/ci/public-experience-long-task-attribution.test.ts',
        'tests/ci/public-experience-performance-contract.test.ts',
        'tests/ci/public-experience-review-provenance.test.ts',
        'tests/ci/public-experience-review-scope-cli.test.ts',
        'tests/ci/home-initial-chunks.test.ts',
        'tests/ci/inspect-public-experience-build.test.ts',
        'src/lib/system-route-geometry.ts',
        'src/components/analytics/tracked-link.tsx',
        'e2e/homepage-hydration.spec.mjs',
      ],
      mergeBaseSha: sha('a'),
      headIsDescendant: true,
      ...publicDeclaration,
      taskId: 'S4-10,S4-11,S4-12,S5-01',
      expectedCategories: ['workflow', 'ci', 'application'],
    })).toEqual([])
  })

  it('rejects missing or forged declarations and ancestry', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('d'),
      scope: 'public-experience-dependencies',
      changedFiles: ['package.json'],
      taskId: 'S4-99',
      intendedBaseSha: sha('c'),
      primaryConcern: 'dependency update',
      expectedCategories: ['release'],
      mergeBaseSha: sha('c'),
      headIsDescendant: false,
    })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('S4-10, S4-11, or S4-12'),
      expect.stringContaining('declared intended base SHA'),
      expect.stringContaining('current main'),
      expect.stringContaining('merge-base'),
      expect.stringContaining('must descend'),
    ]))
  })

  it('rejects auth, database, deployment, similarly named CI files, and undeclared categories', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'public-experience-dependencies',
      changedFiles: [
        'package.json',
        'src/app/api/admin/auth/login/route.ts',
        'src/lib/db.ts',
        'prisma/schema.prisma',
        'scripts/deploy/release.sh',
        'scripts/ci/public-experience-attribution-extra.mjs',
        'scripts/ci/run-lighthouse-budget-extra.mjs',
        'e2e/a11y-extra.spec.ts',
        'docs/engineering/PUBLIC_EXPERIENCE_ENGINEERING.md',
      ],
      ...publicDeclaration,
      expectedCategories: ['release'],
    })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('outside the bounded public-experience allowlist'),
      expect.stringContaining('deployment path category is forbidden'),
      expect.stringContaining('not declared in expected categories'),
    ]))
  })
})

describe('security dependency remediation preflight', () => {
  const securityDeclaration = {
    taskId: 'SEC-DEPENDENCY-20260912',
    intendedBaseSha: sha('a'),
    primaryConcern: 'security dependency remediation for a high advisory',
    expectedCategories: ['release', 'ci', 'governance'],
  }

  it('accepts a bounded dependency remediation with its guard and declaration', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'security-dependency-remediation',
      changedFiles: [
        'package.json',
        'pnpm-lock.yaml',
        'scripts/ci/validate-r0-pr.mjs',
        'tests/ci/validate-r0-pr.test.ts',
        '.github/pull_request_template.md',
      ],
      mergeBaseSha: sha('a'),
      headIsDescendant: true,
      ...securityDeclaration,
    })).toEqual([])
  })

  it('rejects forged security declarations and unrelated paths', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'security-dependency-remediation',
      changedFiles: ['package.json', 'src/app/page.tsx', 'scripts/deploy/release.sh'],
      ...securityDeclaration,
      taskId: 'S4-10',
      primaryConcern: 'public experience dependency update',
      expectedCategories: ['release', 'application', 'deployment'],
    })
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('SEC-'),
      expect.stringContaining('security dependency'),
      expect.stringContaining('outside the bounded security dependency allowlist'),
      expect.stringContaining('application path category is forbidden'),
      expect.stringContaining('deployment path category is forbidden'),
    ]))
  })

  it('fails the sensitive CLI preflight when the PR omits its scope', () => {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    const temp = mkdtempSync(join(tmpdir(), 'asdev-scope-preflight-'))
    try {
      const eventPath = join(temp, 'event.json')
      writeFileSync(eventPath, JSON.stringify({ pull_request: { body: [
        'ASDEV-TASK-ID: SEC-DEPENDENCY-20260912',
        `ASDEV-INTENDED-BASE-SHA: ${head}`,
        'ASDEV-PRIMARY-CONCERN: security dependency remediation',
        'ASDEV-EXPECTED-PATH-CATEGORIES: release',
      ].join('\n') } }))
      const result = spawnSync(process.execPath, [
        resolve('scripts/ci/validate-r0-pr.mjs'),
        '--base', head, '--head', head, '--main', head,
        '--scope', 'r0-infrastructure', '--event', eventPath,
      ], { encoding: 'utf8' })
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('must contain at least one changed file')
    } finally {
      rmSync(temp, { recursive: true, force: true })
    }
  })

  it('rejects an unknown declared scope instead of silently treating it as R0', () => {
    const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    const temp = mkdtempSync(join(tmpdir(), 'asdev-scope-preflight-'))
    try {
      const eventPath = join(temp, 'event.json')
      writeFileSync(eventPath, JSON.stringify({ pull_request: { body: [
        'ASDEV-SCOPE: product',
        'ASDEV-TASK-ID: SEC-DEPENDENCY-20260912',
        `ASDEV-INTENDED-BASE-SHA: ${head}`,
        'ASDEV-PRIMARY-CONCERN: security dependency remediation',
        'ASDEV-EXPECTED-PATH-CATEGORIES: release',
      ].join('\n') } }))
      const result = spawnSync(process.execPath, [
        resolve('scripts/ci/validate-r0-pr.mjs'),
        '--base', head, '--head', head, '--main', head,
        '--scope', 'r0-infrastructure', '--event', eventPath,
      ], { encoding: 'utf8' })
      expect(result.status).toBe(1)
      expect(result.stderr).toContain('unsupported ASDEV-SCOPE: product')
    } finally {
      rmSync(temp, { recursive: true, force: true })
    }
  })
})
