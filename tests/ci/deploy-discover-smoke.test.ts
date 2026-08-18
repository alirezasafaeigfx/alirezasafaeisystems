import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Discover production rollout contract', () => {
  it('smoke-checks the public Discover route after VPS deployment', () => {
    const workflow = readFileSync(
      resolve(process.cwd(), '.github/workflows/deploy-vps.yml'),
      'utf8'
    )

    const servicesCheck = workflow.indexOf("curl --connect-timeout 10 --max-time 30 -fsS '${BASE_URL}/services' >/dev/null")
    const discoverCheck = workflow.indexOf("curl --connect-timeout 10 --max-time 30 -fsS '${BASE_URL}/discover' >/dev/null")
    const discoverEnglishCheck = workflow.indexOf("curl --connect-timeout 10 --max-time 30 -fsS '${BASE_URL}/en/discover' | grep -q 'lang=\\\"en\\\"'")
    const discoverEnglishDirectionCheck = workflow.indexOf("curl --connect-timeout 10 --max-time 30 -fsS '${BASE_URL}/en/discover' | grep -q 'dir=\\\"ltr\\\"'")
    const profileCheck = workflow.indexOf("curl --connect-timeout 10 --max-time 30 -fsS '${BASE_URL}/profile' | grep -q 'alireza_safaei_network'")

    expect(servicesCheck).toBeGreaterThan(-1)
    expect(discoverCheck).toBeGreaterThan(servicesCheck)
    expect(discoverEnglishCheck).toBeGreaterThan(discoverCheck)
    expect(discoverEnglishDirectionCheck).toBeGreaterThan(discoverEnglishCheck)
    expect(profileCheck).toBeGreaterThan(discoverCheck)
  })

  it('runs real-browser production verification and records exact release evidence', () => {
    const workflow = readFileSync(
      resolve(process.cwd(), '.github/workflows/deploy-vps.yml'),
      'utf8'
    )

    expect(workflow).toContain('statuses: write')
    expect(workflow).toContain('pnpm exec playwright install --with-deps chromium')
    expect(workflow).toContain('node scripts/deploy/live-verify.mjs')
    expect(workflow).toContain('LIVE_VERIFY_BASE_URL="$BASE_URL"')
    expect(workflow).toContain('LIVE_VERIFY_RELEASE_SHA="$TARGET_REF"')
    expect(workflow).toContain('LIVE_VERIFY_REPORT_PATH="$GITHUB_WORKSPACE/live-verification-report.md"')
    expect(workflow).toContain('actions/upload-artifact@v4')
    expect(workflow).toContain('live-verification-report.md')
    expect(workflow).toContain('/statuses/$TARGET_REF')
    expect(workflow).toContain('production/live-verification')
    expect(workflow).toContain('steps.live_verify.outcome')
  })
})
