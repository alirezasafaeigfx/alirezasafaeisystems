# Roadmap & Objectives — AlirezaSafaeiSystems

**Last Updated:** 2026-08-27  
**Status:** Live / Personal Brand V3 in implementation planning  
**Priority:** P0 — Revenue, positioning, conversion, SEO  
**Primary Spec:** `docs/product/PERSONAL_BRAND_HOMEPAGE_V3.md`

---

## 1. Strategic Direction

AlirezaSafaeiSystems is moving from a dense multi-offer systems/agency-style homepage to a **personal-brand-first software engineering portfolio and conversion surface**.

The homepage must establish, in the first viewport:

1. **Identity:** علیرضا صفایی / Alireza Safaei
2. **Role:** مهندس نرم‌افزار / Software Engineer
3. **Specialization:** Web Systems, Software Architecture & Production Reliability
4. **Proof:** real projects and evidence-backed outcomes
5. **Action:** Start collaboration or view projects

The product is not being rebuilt from scratch. This roadmap prioritizes focused UX, IA, copy, proof, SEO architecture, accessibility, performance, and conversion improvements on top of the existing production-safe platform.

---

## 2. 2026 Strategic Objectives

### O1 — Personal brand clarity

**Goal:** A new visitor understands who Alireza is and what he does within the first viewport.

**Success criteria:**
- real approved portrait in the hero, or only a clearly documented final asset swap remains
- one H1: `مهندس نرم‌افزار` / `Software Engineer`
- canonical name/title consistent across UI, metadata, schema, docs, and brand configuration
- exactly two dominant hero actions

### O2 — Reduce decision friction

**Goal:** Reduce homepage cognitive load and competing conversion paths.

**Success criteria:**
- homepage content is materially shorter, target 30–40% reduction versus current composition
- obsolete hero intent router/page-roadmap/duplicated CTA surfaces removed from primary prominence
- qualification becomes a second-stage funnel rather than the conceptual first step
- core homepage IA follows the approved V3 spec

### O3 — Stronger proof and trust

**Goal:** Move from capability claims to evidence-oriented professional credibility.

**Success criteria:**
- maximum three strongest selected projects on homepage
- external/live/product proof prioritized over the self-referential portfolio case study
- no unsupported public metrics
- measurable outcomes include source/methodology where available
- real testimonials may be added only when attributable or NDA-approved

### O4 — Search intent architecture

**Goal:** Separate personal/entity SEO from service-demand SEO.

**Success criteria:**
- homepage metadata centered on Alireza Safaei + Software Engineer + core specialization
- Person schema uses canonical software-engineer role
- service landing pages target distinct commercial intents
- canonical/hreflang/inLanguage remain correct for FA/EN
- internal linking forms a clear path: homepage → services → case studies → collaboration

### O5 — Production-quality UX

**Goal:** Improve presentation without regressing reliability, accessibility, or performance.

**Success criteria:**
- responsive parity at desktop/mobile
- WCAG AA visual contrast and no Critical/Serious Axe issues
- portrait introduces no measurable layout shift
- no unnecessary heavyweight dependency added
- Lighthouse targets remain: Performance >=95 where environment is stable, Accessibility >=95, Best Practices >=95, SEO target 100

### O6 — Measurable conversion

**Goal:** Simplify analytics around meaningful user actions and establish a usable CRO baseline.

**Primary conversion:** collaboration start  
**Secondary conversion:** selected-project engagement

Minimum event set:
- `hero_impression`
- `hero_primary_cta_click`
- `hero_projects_cta_click`
- `project_card_click`
- `contact_cta_click`
- `qualification_start`
- `qualification_submit_success`

---

## 3. Execution Roadmap

### Phase A — Baseline & simplification — P0

- inspect current homepage composition, analytics, routes, and experiments
- capture baseline screenshots and available performance/A11y evidence
- identify obsolete duplicated hero paths
- align brand source of truth with `Software Engineer`

**Exit gate:** current behavior and rollback path are documented before UI changes.

### Phase B — Personal Hero — P0

- implement portrait-first personal identity
- name + Software Engineer title
- concise value proposition
- exactly two primary CTA choices
- remove first-viewport intent routing and competing product offers
- preserve FA/EN and RTL/LTR parity

**Exit gate:** desktop/mobile hero passes targeted E2E and accessibility checks.

### Phase C — Homepage IA & Proof — P0

- reduce homepage length/density by approximately 30–40%
- exactly three core service cards
- exactly three selected project/proof cards
- compact engineering-principles/trust section
- short personal/about section
- simple contact CTA
- reposition qualification as second stage

**Exit gate:** primary homepage journey can be understood without domain/product architecture knowledge.

### Phase D — SEO & Analytics — P1

- update page title/description and Person schema
- validate canonical/hreflang/inLanguage
- rationalize internal linking and commercial service intents
- remove obsolete hero experiment/intent-router events
- update event taxonomy documentation

**Exit gate:** SEO and analytics contracts match the new IA.

### Phase E — Service Search Surfaces — P1

Strengthen/create dedicated landing intent for:

1. web/software system development
2. project rescue and completion
3. website/system stabilization
4. technical SEO/audit where commercially relevant
5. infrastructure/localization only if it remains a real sellable service

**Exit gate:** homepage is no longer expected to rank for every service query.

### Phase F — Evidence & Content Growth — P2

- enrich case studies with traceable measurement methodology
- add real testimonials when available
- create/strengthen first-party Insights content around software/web-system expertise
- use Search Console/analytics evidence for subsequent CRO/SEO iterations

**Exit gate:** growth work is evidence-driven, not cosmetic iteration.

---

## 4. Quality & Release Gates

Minimum pre-merge verification:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Also required:
- targeted desktop/mobile homepage Playwright verification
- no console errors in primary flow
- visual evidence/screenshots attached to implementation report/PR where supported
- no secret, private credential, database, archive, or unapproved personal image committed

### Release rules

- use established branch/PR workflow
- do not bypass quality gates
- do not mutate public edge/Nginx/TLS as part of this initiative unless a separate production-edge change is actually required and approved
- use existing deployment workflow and rollback mechanism
- production verification must include apex + www HTTPS, homepage, key inner routes, sitemap, robots, and `/api/ready`

---

## 5. KPI Framework

### UX / Conversion

- hero primary CTA click-through rate
- projects CTA click-through rate
- project-card engagement
- qualification start rate
- qualification completion rate
- contact CTA conversion

### SEO

- branded and non-branded impressions
- non-brand clicks to service landing pages
- average ranking for priority service intents
- indexed canonical pages
- CTR by landing page/query cluster

### Performance / Quality

- LCP / INP / CLS
- Lighthouse scores
- Axe violations
- JS/client footprint of first viewport
- deployment/live-verification pass rate

### Reliability

- uptime target remains >=99.95%
- public error rate target <0.05%
- `/api/ready` remains a release verification gate

---

## 6. Explicit Non-goals

This roadmap does not authorize:

- a framework migration
- a database rewrite
- a new CMS
- a full visual identity replacement
- fabricated testimonials, metrics, clients, credentials, or portrait imagery
- bypassing the existing deployment/release controls

---

## 7. Immediate Priority Order

1. Canonical identity and source-of-truth cleanup
2. Personal hero + portrait contract + two CTAs
3. Homepage IA reduction and selected work
4. Contact/qualification simplification
5. SEO metadata/schema/internal-link alignment
6. Analytics event cleanup
7. Accessibility/performance verification
8. Dedicated service intent pages
9. Evidence/testimonial enrichment
10. Insights/content moat and CRO iteration

---

## 8. Definition of Strategic Success

The redesign is successful when the site stops feeling like a collection of technical capabilities and starts functioning as a clear, credible, search-friendly personal portfolio for a software engineer: **identity first, proof second, action third, technical depth available when the visitor asks for it.**