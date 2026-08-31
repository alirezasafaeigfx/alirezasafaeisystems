import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const publicActionFiles = [
  'src/components/layout/header.tsx',
  'src/components/layout/footer.tsx',
  'src/components/sections/hero.tsx',
  'src/app/thank-you/page.tsx',
  'src/app/services/page.tsx',
  'src/app/audit-readiness/page.tsx',
  'src/app/case-studies/novax-price-alert/page.tsx',
  'src/app/case-studies/asdev-persiantoolbox-platform/page.tsx',
  'src/app/case-studies/infrastructure-localization-rescue/page.tsx',
  'src/app/case-studies/legacy-nextjs-replatform/page.tsx',
  'src/app/case-studies/alirezasafaeidev-portfolio/page.tsx',
  'src/app/case-studies/ci-cd-governance-hardening/page.tsx',
]

describe('public assessment copy', () => {
  it('uses one truthful action and does not promise a free audit', () => {
    const copy = publicActionFiles.map((path) => readFileSync(resolve(process.cwd(), path), 'utf8')).join('\n')
    expect(copy).not.toMatch(/Start Free Audit|Audit رایگان|Request an ASDEV Audit|درخواست ارزیابی Audit/)
    expect(copy).toContain('Request a website review')
    expect(copy).toContain('درخواست بررسی سایت')
  })

  it('keeps Persian case-study claims plain and marks unaccepted outcomes as pending', () => {
    const publicCaseStudyFiles = [
      'src/app/case-studies/page.tsx',
      'src/app/case-studies/infrastructure-localization-rescue/page.tsx',
      'src/app/case-studies/ci-cd-governance-hardening/page.tsx',
    ]
    const copy = publicCaseStudyFiles.map((path) => readFileSync(resolve(process.cwd(), path), 'utf8')).join('\n')

    expect(copy).toContain('تا پایان بازبینی مستقل، نتیجه‌ای به‌عنوان دستاورد منتشر نمی‌شود.')
    expect(copy).toContain('برای همهٔ موارد، شواهد پذیرفته‌شده در دسترس نیست')
    expect(copy).not.toMatch(/صفر rollback اضطراری|کاهش میانگین lead-time انتشار به میزان ۳۴٪/)
    expect(copy).not.toMatch(/تصمیم‌های استقرار ad-hoc|بررسی blast radius|معماری localization-first|fallback کنترل‌شده|rollout چک‌لیست/)
  })
})
