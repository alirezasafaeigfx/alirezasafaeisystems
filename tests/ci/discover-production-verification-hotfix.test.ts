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

  it('passes the request CSP nonce on the ThemeProvider opening tag so its inline bootstrap script is permitted', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')

    expect(layout).toMatch(/<ThemeProvider[\s\S]*?nonce=\{nonce\}[\s\S]*?>/)
  })

  it('keeps the redesigned Discover landing free of the legacy aurora overflow risk', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/discover/page.tsx'), 'utf8')

    expect(page).not.toContain('aurora-shell')
    expect(page).not.toContain('subtle-grid')
    expect(page).toContain('mx-auto max-w-6xl')
  })

  it('waits for the current route network to settle before intentional navigation can abort its own chunks', () => {
    const verifier = readFileSync(resolve(process.cwd(), 'scripts/deploy/live-verify.mjs'), 'utf8')

    expect(verifier).toContain("waitUntil: 'networkidle'")
  })

  it('keeps page, console, HTTP 500, and non-benign request diagnostics fatal', () => {
    const verifier = readFileSync(resolve(process.cwd(), 'scripts/deploy/live-verify.mjs'), 'utf8')

    expect(verifier).toContain("if (message.type() === 'error')")
    expect(verifier).toContain("page.on('pageerror'")
    expect(verifier).toContain('response.status() >= 500')
    expect(verifier).toContain('if (isBenignNextRscAbort(request, baseOrigin))')
    expect(verifier).toContain('warnings.push(')
    expect(verifier).toContain('recordFailure(scope, `request failed:')
  })
})
