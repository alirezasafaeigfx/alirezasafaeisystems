import { describe, expect, it } from 'vitest'
import { resolveGitHubUrl } from '@/lib/brand'

describe('brand GitHub URL', () => {
  it('migrates the retired repository owner from a persisted public environment value', () => {
    expect(
      resolveGitHubUrl('https://github.com/parsairaniiidev/alirezasafaeisystems'),
    ).toBe('https://github.com/alirezasafaeigfx/alirezasafaeisystems')
    expect(
      resolveGitHubUrl('https://github.com/parsairaniiidev/alirezasafaeisystems/'),
    ).toBe('https://github.com/alirezasafaeigfx/alirezasafaeisystems')
  })

  it('preserves an explicitly configured non-legacy repository URL', () => {
    expect(resolveGitHubUrl('https://github.com/example/custom-repository')).toBe(
      'https://github.com/example/custom-repository',
    )
  })
})
