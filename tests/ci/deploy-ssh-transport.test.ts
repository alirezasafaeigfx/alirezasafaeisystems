import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Deploy VPS SSH transport contract', () => {
  it('uses an explicitly expanded SSH config path for rsync transport', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('-e "ssh -F $HOME/.ssh/config"')
    expect(workflow).not.toContain('-e "ssh -F ~/.ssh/config"')
  })

  it('triggers production verification when the deploy workflow itself changes', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy-vps.yml'), 'utf8')

    expect(workflow).toContain('- ".github/workflows/deploy-vps.yml"')
  })
})
