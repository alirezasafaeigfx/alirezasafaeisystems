import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (path: string) => readFileSync(path, 'utf8')

describe('public experience review copy regressions', () => {
  it('uses the approved English website-review CTA everywhere in the hero intent routes', () => {
    const hero = read('src/components/sections/hero.tsx')
    expect(hero.match(/cta: 'Request a website review'/g)).toHaveLength(2)
    expect(hero).not.toContain("cta: 'Request Audit assessment'")
    expect(hero).not.toContain("cta: 'Request Assessment'")
  })

  it('keeps case-study metadata and governance proof pending until independent acceptance', () => {
    const ciCd = read('src/app/case-studies/ci-cd-governance-hardening/page.tsx')
    const infra = read('src/app/case-studies/infrastructure-localization-rescue/page.tsx')
    const collection = read('src/app/case-studies/page.tsx')

    expect(ciCd).toContain('independent evidence review remains pending')
    expect(ciCd).not.toContain('were shared in weekly governance reviews')
    expect(ciCd).not.toContain('removed far larger post-release firefighting costs')
    expect(infra).toContain('بازبینی مستقل شواهد عمومی هنوز در انتظار است')
    expect(infra).not.toContain('با معماری بومی و دروازه‌های حکمرانی پایدار شد')
    expect(collection).toContain('independent acceptance is pending for some cases')
    expect(collection).toContain('پذیرش مستقل برای برخی موارد هنوز در انتظار است')
    expect(collection).not.toContain('with measurable outcomes, constraints, and operational evidence')
    expect(collection).not.toContain('با خروجی‌های قابل اندازه‌گیری، محدودیت‌ها و شواهد عملیاتی')
  })

  it('uses locale-neutral deterministic Discover fixture content in both create and update paths', () => {
    const seed = read('scripts/test/seed-playwright-discover.mjs')
    expect(seed.match(/title: 'Playwright Fixture 01'/g)).toHaveLength(2)
    expect(seed.match(/description: 'fixture-description-01'/g)).toHaveLength(2)
    expect(seed.match(/content: 'fixture-content-01'/g)).toHaveLength(2)
    expect(seed.match(/category: 'test-fixture'/g)).toHaveLength(2)
    expect(seed).not.toContain("title: 'منبع آزمایشی Playwright'")
    expect(seed).not.toContain("category: 'آزمایش'")
  })

  it('keeps active scene nodes emphasized at radius 22 regardless of state', () => {
    const enhancer = read('src/components/public/operational-scene-enhancer.tsx')
    expect(enhancer).toContain("setAttribute('r', String(active ? 22 : 18))")
    expect(enhancer).not.toContain("active && state === 'pressure' ? 22 : 18")
  })
})
