import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Deploy VPS SSH transport contract', () => {
  it('uses an explicitly expanded SSH config path for rsync transport', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('-e "ssh -F $HOME/.ssh/config -o ConnectTimeout=30')
    expect(workflow).not.toContain('-e "ssh -F ~/.ssh/config"')
  })

  it('requires an explicit manual dispatch instead of auto-deploying on source changes', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).not.toMatch(/^\s*push:/m)
  })

  it('transfers an immutable compressed SHA archive with resumable checksum verification', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('git archive --format=tar.gz HEAD')
    expect(workflow).toContain('.tar.gz')
    expect(workflow).toContain('--partial --inplace --timeout=60 --info=progress2')
    expect(workflow).not.toContain('--contimeout=30')
    expect(workflow).toContain('-o ConnectTimeout=30')
    expect(workflow).toContain('-o ServerAliveInterval=30')
    expect(workflow).toContain('-o ServerAliveCountMax=6')
    expect(workflow).toContain('sha256sum "$SOURCE_ARCHIVE"')
    expect(workflow).toContain('test "$REMOTE_SHA256" = "$SOURCE_SHA256"')
    expect(workflow).toContain("tar -xzf '$REMOTE_ARCHIVE'")
  })

  it('does not reintroduce the explicit gzip pipeline dependency', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).not.toContain('gzip -n')
    expect(workflow).not.toContain('rsync -az')
    expect(workflow).not.toContain('--compress')
  })
})
