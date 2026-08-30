import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

function postDeploySmoke(workflow: string): string {
  const section = workflow.match(/- name: Post-deploy smoke check[\s\S]*?(?=\n\s+- name: Live browser production verification)/)?.[0]
  expect(section).toBeDefined()
  return section as string
}

describe('VPS post-deploy smoke network contract', () => {
  it('bypasses VPS DNS only for same-host edge smoke while preserving the canonical HTTPS host', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')
    const smoke = postDeploySmoke(workflow)

    expect(smoke).toContain('BASE_HOST="alirezasafaeisystems.ir"')
    expect(smoke).toContain('BASE_HOST="staging.alirezasafaeisystems.ir"')
    expect(smoke).toContain('BASE_URL="https://${BASE_HOST}"')

    const edgeResolveUses = smoke.match(/--resolve '\$\{BASE_HOST\}:443:127\.0\.0\.1'/g) ?? []
    expect(edgeResolveUses.length).toBeGreaterThanOrEqual(6)

    expect(smoke).toContain("--resolve '${BASE_HOST}:443:127.0.0.1' '${BASE_URL}/api/ready'")
    expect(smoke).toContain("--resolve '${BASE_HOST}:443:127.0.0.1' -o /tmp/portfolio-home.html '${BASE_URL}/'")
    expect(smoke).toContain("--resolve '${BASE_HOST}:443:127.0.0.1' -o /tmp/portfolio-discover-en.html '${BASE_URL}/en/discover'")

    // The browser verifier must still consume BASE_URL normally so its two passes
    // exercise public DNS/routing independently from this same-host smoke check.
    expect(workflow).toContain('LIVE_VERIFY_BASE_URL="$BASE_URL"')
  })
})
