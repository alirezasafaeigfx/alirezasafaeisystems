import { describe, expect, it } from 'vitest'
import { validateR0PullRequest } from '../../scripts/ci/validate-r0-pr.mjs'

const sha = (character: string) => character.repeat(40)

describe('R0 bounded PR preflight', () => {
  it('rejects a stale base even when the changed files look infrastructural', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('c'),
      scope: 'r0-infrastructure',
      changedFiles: ['.github/workflows/deploy-vps.yml'],
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
    })
    expect(errors).toEqual(expect.arrayContaining([
      'application/UI/content path is forbidden in R0 infrastructure PR: src/app/page.tsx',
      'application/UI/content path is forbidden in R0 infrastructure PR: public/images/proof.png',
    ]))
  })

  it('rejects oversized bounded fixes and paths outside the allowlist', () => {
    const errors = validateR0PullRequest({
      baseSha: sha('a'),
      headSha: sha('b'),
      mainSha: sha('a'),
      scope: 'r0-infrastructure',
      changedFiles: Array.from({ length: 13 }, (_, index) => `docs/other/file-${index}.md`),
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
