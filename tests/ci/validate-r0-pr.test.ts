import { describe, expect, it } from 'vitest'
import { validateR0PullRequest } from '../../scripts/ci/validate-r0-pr.mjs'

const sha = (character: string) => character.repeat(40)
const declaration = {
  taskId: 'R0-05A',
  intendedBaseSha: sha('a'),
  primaryConcern: 'bounded ancestry and scope guard',
  expectedCategories: ['workflow', 'ci', 'governance', 'report'],
}

describe('R0 bounded PR preflight', () => {
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

  it('does not apply the bounded guard to non-R0 scopes', () => {
    expect(validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('c'),
      scope: 'product',
      changedFiles: ['src/app/page.tsx'],
    })).toEqual([])
  })
})
