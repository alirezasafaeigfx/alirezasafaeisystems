import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

describe('V3.1 visual evidence contract', () => {
  it('captures the required public screenshot matrix under the stable evidence directory', () => {
    const visual = read('e2e/public-v31-visual.spec.ts')

    for (const file of [
      'home-fa-mobile-390.png',
      'home-en-desktop-1440.png',
      'discover-mobile-390.png',
      'discover-desktop-1440.png',
      'blog-landing-desktop.png',
      'blog-article-desktop.png',
      'admin-dashboard-desktop.png',
    ]) {
      expect(visual).toContain(`test-results/v31-evidence/${file}`)
    }
  })

  it('uploads screenshot evidence for every SHA even when visual verification fails', () => {
    const workflow = read('.github/workflows/e2e-smoke.yml')

    expect(workflow).toContain('actions/upload-artifact@v4')
    expect(workflow).toContain('if: always()')
    expect(workflow).toContain('test-results/v31-evidence')
    expect(workflow).toContain('v31-visual-evidence-${{ github.sha }}')
    expect(workflow).toContain('if-no-files-found: error')
  })

  it('never hardcodes an admin credential in the visual evidence test', () => {
    const visual = read('e2e/public-v31-visual.spec.ts')

    expect(visual).toContain('process.env.ADMIN_USERNAME')
    expect(visual).toContain('process.env.ADMIN_PASSWORD')
    expect(visual).not.toMatch(/ADMIN_PASSWORD\s*=\s*['"][^'"]+['"]/)
  })
})
