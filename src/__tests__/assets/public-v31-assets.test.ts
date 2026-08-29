import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const asset = (relativePath: string) => resolve(process.cwd(), relativePath)

describe('V3.1 public visual assets', () => {
  it('keeps the real owner portrait and project screenshot assets committed', () => {
    expect(existsSync(asset('public/images/portrait/alireza-safaei.svg'))).toBe(true)
    expect(existsSync(asset('public/images/portfolio/persiantoolbox-showcase.png'))).toBe(true)
    expect(existsSync(asset('public/images/portfolio/audit-systems-home.png'))).toBe(true)
  })
})
