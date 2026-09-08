import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('audit high/critical wrapper', () => {
  it('validates provider output even when pnpm exits zero', () => {
    const bin = mkdtempSync(join(tmpdir(), 'audit-wrapper-'))
    const pnpm = join(bin, 'pnpm')
    writeFileSync(pnpm, '#!/usr/bin/env bash\nprintf \'%s\\n\' \'{"unsupported":true}\'\nexit 0\n')
    chmodSync(pnpm, 0o755)
    const result = spawnSync('bash', ['scripts/audit-high-critical.sh'], {
      cwd: process.cwd(), env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, encoding: 'utf8',
    })
    expect(result.status).not.toBe(0)
    expect(`${result.stdout}${result.stderr}`).toContain('unsupported pnpm audit payload')
  })
})
