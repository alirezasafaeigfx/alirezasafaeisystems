import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Discover production verification hotfix contracts', () => {
  it('treats an empty published Discover catalog as a warning instead of a deployment failure', () => {
    const verifier = readFileSync(resolve(process.cwd(), 'scripts/deploy/live-verify.mjs'), 'utf8')

    expect(verifier).toContain("warnings.push(`${discoverPath}: no published Discover detail link; detail verification skipped`)")
    expect(verifier).toContain('if (detailCount < 1) {')
    expect(verifier).not.toContain('if (detailCount < 1) throw new Error(`${discoverPath} has no published Discover detail link`)')
  })

  it('passes the request CSP nonce into next-themes so its inline bootstrap script is permitted', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')

    expect(layout).toContain('<ThemeProvider')
    expect(layout).toContain('nonce={nonce}')
  })

  it('clips the Discover aurora decoration so it cannot expand the mobile document width', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/discover/page.tsx'), 'utf8')

    expect(page).toContain('section-surface aurora-shell overflow-hidden')
  })
})
