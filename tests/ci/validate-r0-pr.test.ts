import { describe, expect, it } from 'vitest'
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
    expect(isGitAncestor('HEAD~1', 'HEAD')).toBe(true)
    expect(isGitAncestor('HEAD', 'HEAD~1')).toBe(false)
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
        'scripts/ci/measure-public-experience-budget.mjs',
        'tests/ci/playwright-discover-fixture.test.ts',
        'tests/ci/public-experience-performance-contract.test.ts',
      ],
      mergeBaseSha: sha('a'),
      headIsDescendant: true,
      ...publicDeclaration,
      taskId: 'S4-10,S4-11,S4-12,S5-01',
      expectedCategories: ['workflow', 'ci'],
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

  it('rejects auth, database, deployment, and undeclared categories', () => {
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
