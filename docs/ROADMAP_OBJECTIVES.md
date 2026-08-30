# Roadmap & Objectives — AlirezaSafaeiSystems

**Last Updated:** 2026-08-29  
**Status:** `V3 PRODUCTION COMPLETE` — Release closed and frozen  
**Priority:** P0/P1 — positioning, conversion, content operations, SEO, reliability  
**Homepage Spec:** `docs/product/PERSONAL_BRAND_HOMEPAGE_V3.md`  
**Discover Spec:** `docs/superpowers/specs/2026-08-27-discover-hub-v3-design.md`  
**Admin Spec:** `docs/superpowers/specs/2026-08-27-admin-control-center-v3-design.md`  
**Blog Spec:** `docs/superpowers/specs/2026-08-27-blog-insights-v1-design.md`

---

## Release closure

V3 was verified in production on `IRAN_PROD_SERVER` as release `20260829T044320Z` from immutable SHA `14501b25c20292c90c33f888eb40227e042b3bfd`. Production workflow `33234404337` passed migration, smoke, backup/rollback gates, and two consecutive live browser verification passes. This milestone is closed; future work is a separate post-release task.

---

## 1. Strategic Direction

AlirezaSafaeiSystems is evolving from a dense multi-offer portfolio into a **personal-brand-first software engineering platform with an owned content and resource ecosystem**.

The platform has four coordinated surfaces:

1. **Homepage / Personal Brand** — establish Alireza Safaei as a Software Engineer, show proof and start collaboration.
2. **Discover Hub** — a public, searchable, scalable resource hub for tools, apps, AI products, services and practical guides; also the primary Instagram-bio destination.
3. **Admin Control Center** — a secure route-based internal operating surface for Leads, Messages, Projects, Discover, Blog and bounded first-party Analytics.
4. **Blog / Insights** — a high-signal engineering publication for topical authority, education, internal linking and organic acquisition.

The project is not being rebuilt from scratch. Next.js App Router, React, Prisma/SQLite, current auth/security, deployment and rollback mechanisms remain the baseline unless a verified defect requires targeted change.

---

## 2. 2026 Strategic Objectives

### O1 — Personal brand clarity

A new visitor must understand within the first viewport:

- `علیرضا صفایی / Alireza Safaei`;
- `مهندس نرم‌افزار / Software Engineer`;
- specialization in Web Systems, Software Architecture and Production Reliability;
- one concise value proposition;
- exactly two dominant hero actions.

**Success:** identity/title are consistent across UI, metadata, Person schema, docs and brand configuration.

### O2 — Reduce homepage decision friction

**Success:**

- materially shorter homepage, target 30–40% reduction from the previous composition;
- no intent-router/page-roadmap competing in first viewport;
- exactly 3 core service surfaces and maximum 3 selected projects;
- qualification is a second-stage funnel;
- products such as Audit/Discover/PersianToolbox support proof/ecosystem rather than competing with the personal identity.

### O3 — Evidence-oriented trust

**Success:**

- strongest live/external proof prioritized;
- no unsupported metric/testimonial/client claim;
- measurable claims include source/methodology when available;
- self-referential portfolio case study is not the flagship proof.

### O4 — Discover as a durable public hub

Transform `/discover` into a search-first Resource Hub while preserving social acquisition.

**Success:**

- server-backed search/filter/pagination;
- URL-backed state;
- scalable resource taxonomy;
- FA/EN publication integrity;
- featured/latest discovery without fake popularity;
- internal resource profile pages with official links, practical guide and related content;
- Admin can manage all Discover content without deployment.

### O5 — Admin as a real Control Center

Replace tab-local monolithic Admin architecture with route-based modules.

**Success:**

- `/admin`, `/admin/leads`, `/admin/messages`, `/admin/projects`, `/admin/discover`, `/admin/blog`, `/admin/analytics`;
- each module loads only its own data/code;
- server-first initial reads where practical;
- existing session protection, no-store/noindex and secure mutation boundary preserved or strengthened;
- old `admin-dashboard.tsx` removed only after full parity verification.

### O6 — First-party Blog / Insights

Build an owned engineering publication using the existing `BlogPost` domain.

**Success:**

- `/blog` and locale-aware article routes;
- safe Markdown rendering with raw HTML disabled;
- Admin draft/publish workflow;
- BlogPosting/Breadcrumb structured data;
- sitemap/canonical/hreflang correctness;
- contextual internal links to Discover, services and case studies;
- no thin/mass AI content.

### O7 — Search intent architecture

Separate personal/entity SEO, resource discovery SEO and service-demand SEO.

**Success:**

- Home: Alireza Safaei + Software Engineer + core specialization;
- service pages: distinct commercial intents;
- Discover: resource/tool discovery intent;
- Blog: informational/engineering intent;
- canonical/hreflang/inLanguage are correct;
- filtered/faceted search states do not create index bloat;
- sitemap includes only valid canonical public pages.

### O8 — Production-quality UX and accessibility

Target **WCAG 2.2 AA** and preserve performance.

**Success:**

- representative public/Admin pages have no Critical/Serious Axe violations;
- 375/768/1024/1440 layouts are practical;
- keyboard/focus/reduced-motion behavior is correct;
- fixed media dimensions avoid layout shift;
- no unnecessary heavyweight UI/search/chart dependency;
- public Lighthouse targets remain Performance >=95 where environment is stable, Accessibility >=95, Best Practices >=95 and SEO target 100.

### O9 — Measurable growth

Simplify analytics around useful product decisions.

Primary outcomes:

- collaboration start/completion;
- selected project engagement;
- Discover search/resource/external-link engagement;
- Blog article/related-content/service-assisted engagement;
- non-brand organic clicks and indexed canonical growth.

No metric is treated as valid unless its collection and denominator are understood.

---

## 3. Architecture Baseline

Current technology is already modern and remains preferred:

- Next.js 16 App Router;
- React 19;
- TypeScript;
- Tailwind CSS 4;
- Prisma 6 with SQLite;
- Zod validation;
- Playwright + Axe + Vitest;
- current deployment, rollback and live-verification tooling.

### Engineering direction

- React Server Components by default for public pages and Admin initial reads;
- Client Components only for actual interactivity;
- existing secure Route Handlers remain mutation boundaries during incremental migration;
- additive database migrations;
- no framework/database/CMS migration without demonstrated need;
- no dependency upgrade solely to be “latest”; upgrade only when compatibility/security/value is verified.

---

## 4. Execution Roadmap

### Phase A — Governance & baseline — P0

- lock canonical brand identity;
- merge/approve specs and implementation plans;
- capture baseline screenshots, routes, SEO/A11y/performance and existing CRUD behavior;
- verify database backup/rollback before schema changes;
- audit current Admin mutation security/CSRF posture.

**Exit:** rollback path and current behavior are documented before implementation.

### Phase B — Personal Homepage V3 — P0

Implement:

- personal portrait contract;
- Software Engineer H1;
- two dominant CTAs;
- reduced IA;
- three services;
- three selected projects;
- simplified contact/qualification flow;
- aligned metadata/entity analytics.

**Plan source:** existing Homepage V3 spec/backlog.

### Phase C — Admin Control Center foundation — P0/P1

Implement route shell and independently migrate:

1. Overview;
2. Leads;
3. Messages;
4. Projects;
5. Discover;
6. Blog;
7. Analytics.

**Plan:** `docs/superpowers/plans/2026-08-27-admin-control-center-v3.md`

### Phase D — Discover Hub V3 — P1

Implement:

- additive schema migration;
- bilingual/taxonomy content contract;
- secure Admin editing;
- server query/filter/pagination;
- landing/detail redesign;
- SEO/sitemap/analytics/A11y integration.

**Plan:** `docs/superpowers/plans/2026-08-27-discover-hub-v3.md`

### Phase E — Blog / Insights V1 — P1

Implement:

- additive BlogPost schema;
- safe Markdown layer;
- secure Blog Admin CRUD;
- public landing/article pages;
- structured data and sitemap;
- Discover/Home/service/case-study integration.

**Plan:** `docs/superpowers/plans/2026-08-27-blog-insights-v1.md`

### Phase F — Service Search Surfaces — P1

Strengthen/create only real commercial-intent surfaces:

1. software/web-system development;
2. project rescue/completion;
3. system stabilization/performance;
4. technical SEO/audit where commercially relevant;
5. infrastructure/localization only if it remains a sellable service.

### Phase G — Evidence & Content Growth — P2

- enrich case studies with traceable evidence;
- add real testimonials only with permission/evidence;
- publish 3–5 high-signal seed Blog articles;
- grow Discover editorial quality;
- use Search Console and first-party analytics for subsequent iteration.

### Phase H — CRO & operational refinement — P2

Only after a valid V3 baseline:

- measure hero/project/contact funnel;
- measure Discover search-to-resource-to-outbound journeys;
- measure Blog-to-related/service/case-study journeys;
- introduce experiments only with explicit hypothesis and success metric.

---

## 5. Data Evolution Policy

### Discover

Add optional EN fields, resource taxonomy, pricing/platform metadata, SEO overrides and `lastReviewedAt` without deleting existing fields/data.

### Blog

Extend existing `BlogPost` with EN content, category, featured, publish/review timestamps and SEO overrides.

### Translation rule

EN detail pages are indexable only when all required EN body fields are complete. Do not publish an English shell around Persian primary content.

### Taxonomy rule

Use application-level Zod controlled values and existing comma-separated persistence conventions initially. Do not create normalized taxonomy relation tables until actual editorial scale demonstrates the need.

---

## 6. Security Requirements

- preserve session-protected `/admin/*` boundary;
- keep Admin no-store/noindex;
- every mutation remains authenticated and rate-limited;
- validate Origin/CSRF posture centrally if a real gap is found;
- validate media server-side, reject SVG in this scope;
- no raw database Markdown HTML execution;
- drafts never leak through public routes;
- secrets, DB files and unapproved personal media never enter Git.

---

## 7. SEO & Content Quality Policy

- use Next Metadata API and route-specific canonical/hreflang;
- use visible-content-backed structured data only;
- no schema spam;
- filter/search URLs are not index targets;
- sitemap uses content timestamps, not build time;
- no bulk auto-generated pages/posts;
- Blog and Discover content must satisfy real user/search intent;
- internal links are contextual, not keyword-stuffed.

---

## 8. Quality & Release Gates

Minimum pre-merge verification:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Additional targeted suites:

- Homepage V3 desktop/mobile;
- `e2e/discover-v3.spec.ts`;
- `e2e/admin-v3.spec.ts`;
- `e2e/blog-v1.spec.ts`.

Rules:

- timeout/not-run is never green;
- database backup exists before production migration;
- production changes use existing release/deploy pipeline;
- exact SHA is recorded;
- live verification covers apex/www plus affected routes;
- rollback reference is recorded.

---

## 9. KPI Framework

### Personal brand / conversion

- hero primary CTA CTR;
- project CTA/card engagement;
- qualification start/completion;
- contact conversion.

### Discover

- landing views;
- search/filter usage;
- item opens;
- official/Telegram/Instagram outbound engagement;
- organic landing clicks;
- published/translated resource count and freshness.

### Blog

- valid indexed articles;
- organic impressions/clicks;
- article views;
- related-content navigation;
- assisted service/case-study clicks;
- last-reviewed coverage.

### Admin

- module load correctness;
- CRUD success/error rates from logs where available;
- no unauthorized access regression;
- no unnecessary cross-module fetches.

### Quality

- LCP/INP/CLS;
- Lighthouse;
- Axe violations;
- JS/client footprint;
- deployment/live-verification pass rate.

---

## 10. Explicit Non-goals

This roadmap does not authorize:

- framework migration;
- database engine rewrite;
- external/headless CMS;
- generic page builder;
- search SaaS at current scale;
- comments/user ratings;
- multi-user Admin RBAC;
- mass AI publishing;
- fake popularity metrics;
- fabricated testimonials/metrics/clients/credentials/portrait imagery.

---

## 11. Immediate Priority Order

1. Homepage canonical identity + Hero V3.
2. Admin route shell/foundation.
3. Discover additive data/validation/API migration.
4. Discover public Hub V3.
5. Blog additive data + safe Markdown/API.
6. Blog public/Admin V1.
7. Admin legacy-monolith retirement after parity.
8. SEO/sitemap/analytics integration across all surfaces.
9. Full A11y/performance/security/release verification.
10. Service SEO, evidence enrichment, seed content and CRO.

---

## 12. Definition of Strategic Success

V3 is strategically successful when the site functions as one coherent system:

- **identity first** on Home;
- **proof and services** for commercial trust;
- **Discover** for resource acquisition and owned utility;
- **Blog** for deep expertise and organic authority;
- **Admin** as a maintainable control plane for zero-deploy content operations;
- all of it production-safe, measurable, accessible and search-correct.
