# Personal Brand Homepage V3 — Product, UX, SEO & Implementation Spec

**Status:** Approved direction / ready for implementation  
**Date:** 2026-08-27  
**Owner:** Product + FE + SEO + QA  
**Primary surface:** `https://alirezasafaeisystems.ir/`  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`

---

## 1. Decision

The homepage is being repositioned from a dense multi-offer systems/agency-style landing page into a **personal-brand-first software engineering portfolio and conversion surface**.

The first viewport must answer, in order:

1. Who is this person?
2. What is his professional title?
3. What kind of problems does he solve?
4. What proof exists?
5. What should I click next?

Canonical public identity:

- **FA name:** علیرضا صفایی
- **EN name:** Alireza Safaei
- **Primary title FA:** مهندس نرم‌افزار
- **Primary title EN:** Software Engineer
- **Specialization line:** Web Systems, Software Architecture & Production Reliability

The homepage must include a real professional portrait of Alireza in the hero. Until the approved real portrait asset exists, implementation must use a deliberate neutral placeholder and must not generate or substitute an AI face.

---

## 2. Product Goal

Convert the homepage from “broad capability documentation” into a focused personal portfolio that establishes trust quickly and routes visitors toward either:

- viewing real projects/case studies, or
- starting a collaboration request.

### Primary conversion goal

`Start collaboration / درخواست همکاری`

### Secondary conversion goal

`View projects / مشاهده پروژه‌ها`

No other CTA may compete visually with these two in the hero.

---

## 3. Positioning

### Persian hero direction

**Eyebrow / identity**

`علیرضا صفایی`

**H1**

`مهندس نرم‌افزار`

**Supporting line**

`سیستم‌ها و محصولات وبی می‌سازم که سریع، پایدار، امن و آماده استفاده واقعی در Production باشند.`

**Detail**

`از طراحی معماری و توسعه نرم‌افزار تا بهینه‌سازی، استقرار و نجات پروژه‌های نیمه‌کاره.`

### English hero direction

**Eyebrow**

`Alireza Safaei`

**H1**

`Software Engineer`

**Supporting line**

`I design and build web systems that are fast, reliable, secure, and ready for real production use.`

**Detail**

`From software architecture and development to optimization, deployment, and rescuing incomplete projects.`

### Copy principle

Business language first; engineering terminology second.

Avoid presenting unexplained jargon such as `rollback`, `governance`, `local-first`, `quality gate`, `MTTR`, or `production-grade` as primary marketing copy. Technical terms are allowed in project details and supporting proof.

---

## 4. Homepage Information Architecture

Target homepage sequence:

1. **Header**
2. **Personal Hero**
3. **Core Services / What I Do**
4. **Selected Projects / Case Studies**
5. **Measured Proof / Outcomes**
6. **Engineering Principles / Why Work With Me**
7. **Short About / Personal Trust**
8. **Simple Contact CTA**
9. **Footer**

The homepage should be approximately **30–40% shorter** than the current version.

### Remove from first-page prominence

- hero intent router
- page roadmap widget
- competing Audit Systems CTA
- PersianToolbox CTA in the hero
- Qualification-first funnel as the primary first interaction
- duplicated capability and workflow explanations
- repeated “production / stability / sanctions / localization” messaging
- excessive badges and trust chips

These may remain deeper in the site where context justifies them.

---

## 5. Hero UX Specification

### Desktop

Use a two-column hero, approximately 55/45:

- content column: name, title, description, two CTAs, compact social links
- image column: approved portrait

### Mobile

Order:

1. portrait
2. name
3. title
4. value proposition
5. CTA group
6. optional social links

### Visual requirements

- Portrait must have stable dimensions to avoid CLS.
- Use `next/image` with explicit width/height or `fill` inside a fixed-ratio container.
- Hero copy must remain readable at 320px width.
- One H1 only.
- No autoplay video or heavy motion in first viewport.
- Respect `prefers-reduced-motion`.
- Maintain WCAG AA contrast.

### CTA hierarchy

Primary:

`شروع همکاری` → `/qualification` or the existing canonical collaboration entry route.

Secondary:

`مشاهده پروژه‌ها` → `/case-studies`

If analytics experiment infrastructure remains, it must not change the CTA meaning or introduce alternate hero flows.

---

## 6. Core Services

Show exactly three primary service cards on the homepage:

1. **توسعه محصول و سیستم وب**  
   طراحی و توسعه سیستم‌ها و محصولات وب با معماری قابل نگهداری و مقیاس‌پذیر.

2. **پایدارسازی و بهینه‌سازی**  
   بهبود سرعت، reliability، کیفیت فنی و آمادگی واقعی برای production.

3. **نجات پروژه‌های نیمه‌کاره**  
   تحلیل، بازطراحی و تکمیل پروژه‌هایی که متوقف، ناپایدار یا دشوار برای ادامه شده‌اند.

Each card must link to a relevant service/detail route when one exists. Do not create dead-end cards.

---

## 7. Selected Work

The homepage should feature **3 strongest proof items maximum**.

Priority order should favor external/live/product proof over self-referential portfolio work.

Recommended candidates:

- PersianToolbox
- Novax
- Audit Systems

The `alirezasafaeisystems.ir` self-case-study should not be the flagship proof card.

Each project card should expose:

- project name
- one-line business/problem context
- role
- 1–2 important technologies only
- one evidence-backed outcome when available
- `View case study` CTA

Do not surface fabricated or untraceable metrics.

---

## 8. Proof & Trust Rules

Any metric shown publicly must be traceable to one of:

- production logs
- analytics
- CI/deployment records
- issue/incident records
- client-approved evidence
- clearly documented measurement methodology

If a metric cannot be validated, replace it with qualitative proof.

Preferred proof format:

- Before
- After
- Measurement window
- Data source / methodology

Add testimonials only when they are real and attributable or explicitly marked anonymous/NDA-approved.

---

## 9. Contact / Conversion UX

The homepage should not force deep qualification before establishing intent.

Preferred flow:

- short CTA section
- primary collaboration button
- direct contact options where already approved
- Qualification remains available after the user chooses to proceed

Keep the existing qualification system, but reposition it as a **second-stage funnel**, not the conceptual center of the homepage.

---

## 10. SEO Architecture

### Homepage search intent

The homepage is primarily an **entity + professional service landing page**, centered on:

- علیرضا صفایی
- مهندس نرم‌افزار
- Software Engineer
- توسعه سیستم وب
- معماری نرم‌افزار
- پایدارسازی پروژه وب

Do not attempt to make the homepage rank for every service keyword.

### Required service landing architecture

Create or strengthen dedicated intent pages for:

- web/software system development
- project rescue / completion
- website/system stabilization
- technical SEO / technical audit where commercially relevant
- infrastructure/localization only if it remains a real sellable service

### Metadata

Homepage title should include name + Software Engineer / مهندس نرم‌افزار and one differentiating specialization, without keyword stuffing.

Example direction:

`علیرضا صفایی | مهندس نرم‌افزار و سیستم‌های وب`

English:

`Alireza Safaei | Software Engineer — Web Systems & Production`

### Structured data

Preserve and validate:

- Person
- WebSite
- Organization only where semantically justified
- BreadcrumbList on inner pages
- Article/CreativeWork/SoftwareApplication as appropriate for case studies/products

Person schema must use the canonical professional title `Software Engineer` / `مهندس نرم‌افزار`.

### Internal linking

Homepage → service pages → case studies → contact/qualification.

Avoid creating multiple near-identical conversion routes that compete for the same intent.

---

## 11. Performance Requirements

The portrait and redesign must not regress current performance budgets.

Required:

- optimized portrait formats (`avif`/`webp` generated by Next Image)
- correct responsive `sizes`
- no layout shift from portrait
- no unnecessary client-side state in static hero content
- remove hero JS that exists only for obsolete intent routing/experiments when safe
- avoid adding new heavy dependencies

Targets:

- Lighthouse Performance >= 95 where environment is stable
- Accessibility >= 95
- Best Practices >= 95
- SEO = 100 target
- no Critical/Serious Axe violations
- no console errors on primary homepage flow

---

## 12. Analytics

Preserve useful historical analytics, but simplify homepage events.

Minimum events:

- `hero_impression`
- `hero_primary_cta_click`
- `hero_projects_cta_click`
- `project_card_click`
- `contact_cta_click`
- `qualification_start`
- `qualification_submit_success`

Retire or stop emitting obsolete hero intent-router experiment events once the old component path is removed.

Update `docs/EVENT_TAXONOMY.md` if event contracts change.

---

## 13. Accessibility

Acceptance requirements:

- semantic heading hierarchy
- one H1
- portrait alt text should identify the person, not describe decorative styling
- keyboard reachable CTAs
- visible focus states
- minimum 44x44 interactive targets where practical
- no color-only meaning
- correct `lang` / `dir` for FA and EN
- reduced motion support
- test with existing Axe/Playwright gates

---

## 14. Implementation Guidance

Likely impacted areas include, but are not limited to:

- `src/components/sections/hero.tsx`
- home composition/page sections
- `src/lib/home-content.*`
- `src/lib/brand.*`
- metadata/SEO helpers
- analytics event definitions
- homepage E2E and accessibility tests
- visual snapshots if applicable
- `public/` portrait asset

Codex must inspect the current code before editing and use the repository's actual abstractions rather than blindly following path assumptions in this document.

### Client/server boundary

The hero should become server-renderable/static wherever possible. Keep client behavior only for interactions that truly require it.

---

## 15. Portrait Asset Contract

Required final asset:

- real photo of Alireza Safaei approved by the owner
- source should be sufficiently large for retina desktop usage
- crop should work in ~4:5 or 1:1 responsive container
- no embedded text
- no AI-generated replacement face

Suggested canonical path after owner supplies image:

`public/images/alireza-safaei-portrait.*`

If the real image is not available during implementation, finish the entire layout with a neutral placeholder and clearly document the one remaining asset swap. Do not block unrelated work.

---

## 16. Execution Phases

### Phase A — Baseline & simplification

- capture current screenshots and route behavior
- baseline Lighthouse/A11y where available
- identify current homepage conversion components/events
- remove obsolete duplicated hero paths safely

### Phase B — Personal hero

- implement portrait layout
- canonical name/title
- simplified copy
- exactly two hero CTAs
- responsive + RTL/LTR parity

### Phase C — Homepage IA refactor

- reduce sections by 30–40%
- three service cards
- three selected projects
- compact proof section
- short personal/about trust section
- simpler contact CTA

### Phase D — SEO & analytics

- update metadata and Person schema
- validate canonical/hreflang
- update internal links
- simplify event taxonomy

### Phase E — Verification

Run at minimum:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Also run targeted homepage Playwright tests in desktop + mobile viewports.

### Phase F — Release

- PR with screenshots/evidence
- no direct production mutation outside existing deployment workflow
- deploy only through established release path
- verify apex + www HTTPS
- verify `/`, `/case-studies`, primary services, qualification/contact, sitemap, robots, `/api/ready`
- preserve rollback target

---

## 17. Definition of Done

This initiative is complete only when:

- real personal identity is immediately visible on the homepage
- H1 is `مهندس نرم‌افزار` / `Software Engineer`
- approved portrait is present, or only an explicitly documented final asset swap remains
- hero has exactly two primary user choices
- homepage content density is materially reduced
- selected projects are evidence-oriented
- qualification is no longer the first conceptual barrier
- metadata/schema match the new professional identity
- FA/EN remain consistent
- responsive, A11y, SEO and CI gates pass
- no secrets or private assets enter the public repository
- production live verification passes with rollback available

---

## 18. Non-goals

This is **not**:

- a full visual rebrand
- a framework migration
- a database rewrite
- a new CMS project
- a replacement of the existing deployment system
- permission to invent testimonials, client names, metrics, or credentials

The priority is focused product/UX/SEO refactoring on top of the existing production-safe platform.