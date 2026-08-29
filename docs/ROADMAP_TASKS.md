# نقشه راه و تسک‌بندی اولویت‌بندی‌شده

**تاریخ به‌روزرسانی:** 2026-08-29
**وضعیت:** `V3 PRODUCTION COMPLETE` — release closed and frozen
**Objectives:** `docs/ROADMAP_OBJECTIVES.md`

**Spec/Planهای مرجع:**
- Homepage: `docs/product/PERSONAL_BRAND_HOMEPAGE_V3.md`
- Discover Spec: `docs/superpowers/specs/2026-08-27-discover-hub-v3-design.md`
- Discover Plan: `docs/superpowers/plans/2026-08-27-discover-hub-v3.md`
- Admin Spec: `docs/superpowers/specs/2026-08-27-admin-control-center-v3-design.md`
- Admin Plan: `docs/superpowers/plans/2026-08-27-admin-control-center-v3.md`
- Blog Spec: `docs/superpowers/specs/2026-08-27-blog-insights-v1-design.md`
- Blog Plan: `docs/superpowers/plans/2026-08-27-blog-insights-v1.md`

> این فایل backlog فعال را نشان می‌دهد. جزئیات قدیمی تکمیل‌شده در Git history باقی می‌ماند و نباید دوباره به‌عنوان کار فعال اجرا شود.

## وضعیت نهایی Release Closure — 2026-08-29

- V3 در `IRAN_PROD_SERVER` با release `20260829T044320Z` و SHA `14501b25c20292c90c33f888eb40227e042b3bfd` تکمیل شد.
- workflow production `33234404337`، migration، smoke و دو live browser verification متوالی PASS هستند.
- backup و rollback readiness PASS هستند؛ target بازگشت `20260829T041652Z` باقی مانده است.
- PR #15 verifier hotfix merged شد. `GITHUB_MAIN` فقط commit semantic-release پس از source deploy را افزوده است.
- این milestone frozen است؛ هیچ feature، refactor، cleanup، upgrade یا production mutation دیگری بخشی از V3 نیست.

## اصول اجرا

- **P0:** foundation، identity، migration safety، Admin control plane.
- **P1:** Discover/Blog public product، SEO، analytics، A11y، performance.
- **P2:** evidence، content growth، CRO و قابلیت‌های غیرضروری برای launch.
- هر تسک باید test/evidence/acceptance criteria داشته باشد.
- هیچ metric/testimonial/client/content/portrait جعلی ساخته نشود.
- database migration فقط additive و با backup/rollback باشد.
- production فقط از release/deploy موجود پروژه تغییر کند.
- timeout یا not-run هرگز PASS محسوب نشود.

---

# P0 — Personal Brand Foundation

## [ ] `P0-PBH-1` — Canonical identity alignment

**مالک:** Product + FE + SEO  
**وابستگی:** ندارد

تمام source-of-truthها را با این identity همسو کن:

- FA: `علیرضا صفایی — مهندس نرم‌افزار`
- EN: `Alireza Safaei — Software Engineer`
- specialization: Web Systems, Software Architecture, Production Reliability

**پذیرش:** UI، metadata، Person schema، brand config و docs تناقض نداشته باشند؛ repo reference قدیمی باقی نماند.

## [ ] `P0-PBH-2` — Personal Hero V3

**مالک:** FE + Product + QA  
**وابستگی:** `P0-PBH-1`

Hero شخصی با portrait واقعی/placeholder خنثی، H1 جدید، value proposition کوتاه و دقیقاً دو CTA dominant:

1. `شروع همکاری`
2. `مشاهده پروژه‌ها`

**پذیرش:** intent-router/page-roadmap/product CTAهای رقیب از first viewport حذف؛ FA/EN و RTL/LTR و desktop/mobile سالم.

## [ ] `P0-PBH-3` — Homepage IA simplification

**مالک:** Product + FE  
**وابستگی:** `P0-PBH-2`

IA هدف:

1. Header
2. Personal Hero
3. 3 Core Services
4. 3 Selected Projects
5. Proof/Outcomes
6. Engineering Principles
7. Short About
8. Simple Contact CTA
9. Footer

**پذیرش:** Home materially کوتاه‌تر، target 30–40% کاهش density؛ qualification second-stage.

## [ ] `P0-PBH-4` — Evidence-first selected work

**مالک:** Product + FE  
**وابستگی:** `P0-PBH-3`

حداکثر 3 پروژه؛ اولویت PersianToolbox / Novax / Audit Systems یا proof واقعی بهتر. Metric بدون source/methodology حذف یا qualitative شود.

---

# P0 — Admin Control Plane Foundation

## [ ] `P0-ADM-1` — Baseline + security + rollback audit

**مالک:** Backend + Security + DevOps + QA  
**وابستگی:** ندارد

قبل از schema/UI changes:

- snapshot/backup DB؛
- audit session/auth/rate-limit/no-store/noindex؛
- audit state-changing admin endpoint CSRF/Origin posture؛
- capture current Leads/Messages/Projects/Discover CRUD behavior؛
- document rollback path.

**پذیرش:** baseline و rollback evidence ثبت شده؛ vulnerability فقط در صورت evidence گزارش شود.

## [ ] `P0-ADM-2` — Route-based Admin shell

**مالک:** FE + Backend  
**وابستگی:** `P0-ADM-1`

ایجاد routeهای واقعی:

- `/admin`
- `/admin/leads`
- `/admin/messages`
- `/admin/projects`
- `/admin/discover`
- `/admin/blog`
- `/admin/analytics`

**پذیرش:** auth boundary حفظ؛ route state با refresh/back درست؛ responsive shell؛ module isolation.

## [ ] `P0-ADM-3` — Server-first Overview / Leads / Messages

**مالک:** FE + Backend + QA  
**وابستگی:** `P0-ADM-2`

- Overview فقط bounded/actionable counts؛
- Leads فقط Leads data؛
- Messages فقط Messages data؛
- initial reads server-side where practical؛
- existing secure mutation endpoints reused unless defect.

**پذیرش:** cross-module fetch حذف؛ E2E parity green.

## [ ] `P0-ADM-4` — Projects extraction

**مالک:** FE + Backend  
**وابستگی:** `P0-ADM-2`

ProjectManager از dashboard monolith جدا شود؛ CRUD/state/order/contentType contract regress نکند.

---

# P0/P1 — Discover Hub V3

## [ ] `P0-DISC-1` — Additive Discover schema migration

**مالک:** Backend + Data + QA  
**وابستگی:** `P0-ADM-1`

Additive fields:

- `titleEn`, `descriptionEn`, `contentEn`
- `resourceType`, `platforms`, `pricingModel`
- FA/EN SEO override fields
- `lastReviewedAt`

**پذیرش:** existing rows/data preserved؛ migration/restore tested؛ Prisma type-check green.

## [ ] `P0-DISC-2` — Discover validation/API V3

**مالک:** Backend + Security  
**وابستگی:** `P0-DISC-1`

- controlled taxonomy via Zod؛
- translation completeness helper؛
- secure CRUD persists new fields؛
- upload validation verified/hardened؛
- no SVG in this scope.

**پذیرش:** auth/rate-limit/validation/slug conflict/upload tests green.

## [ ] `P1-DISC-1` — Server-backed search/filter/pagination

**مالک:** FE + Backend  
**وابستگی:** `P0-DISC-2`

URL state:

- `q`
- `category`
- `type`
- `platform`
- `sort=featured|latest`
- `page`

**پذیرش:** refresh/share/back state stable؛ fixed page size 24؛ no client copy of all records needed.

## [ ] `P1-DISC-2` — Discover landing redesign

**مالک:** Product + FE + UI/UX + QA  
**وابستگی:** `P1-DISC-1`

Structure:

1. search-first hero
2. featured resources <=4
3. filters/sort
4. cards
5. pagination
6. disclosure/trust
7. contextual ASDEV CTA

**پذیرش:** 375/768/1024/1440 usable؛ keyboard focus؛ no heavy carousel/search dependency.

## [ ] `P1-DISC-3` — Resource Profile redesign

**مالک:** Product + FE + SEO  
**وابستگی:** `P1-DISC-2`

Detail:

- localized identity/summary/body
- why useful / use cases
- official primary action
- optional Telegram/Instagram
- related Discover
- related Blog when available
- disclosure
- contextual ASDEV path

**پذیرش:** EN incomplete item does not expose/index English shell.

## [ ] `P1-DISC-4` — Discover SEO/sitemap/analytics

**مالک:** SEO + FE + Analytics  
**وابستگی:** `P1-DISC-3`

- base canonical locale routes؛
- faceted/search states noindex,follow + canonical base؛
- EN hreflang only for complete translations؛
- sitemap only canonical/published routes؛
- structured data conservative؛
- normalized Discover event taxonomy.

**پذیرش:** metadata/schema/sitemap unit tests + E2E/Axe green.

## [ ] `P1-ADM-DISC-1` — Discover Admin workspace

**مالک:** FE + Backend + Product  
**وابستگی:** `P0-DISC-2`, `P0-ADM-2`

Editor groups:

1. Basic
2. Persian
3. English
4. Taxonomy
5. Media
6. Links
7. SEO
8. Publishing

**پذیرش:** create/edit/publish/unpublish/preview/delete + translation status + safe confirmation fully operational.

---

# P0/P1 — Blog / Insights V1

## [ ] `P0-BLOG-1` — Additive BlogPost migration

**مالک:** Backend + Data  
**وابستگی:** `P0-ADM-1`

Extend existing BlogPost with:

- EN title/excerpt/content
- category
- featured
- publishedAt/lastReviewedAt
- FA/EN SEO overrides
- indexes

**پذیرش:** migration additive, current DB safe, Prisma/type-check green.

## [ ] `P0-BLOG-2` — Safe Markdown/content contract

**مالک:** FE + Backend + Security  
**وابستگی:** `P0-BLOG-1`

- `react-markdown` + `remark-gfm` if no equivalent already exists؛
- raw HTML disabled؛
- heading hierarchy protected؛
- deterministic read-time helper؛
- Zod schemas/categories/tags/translation completeness.

**پذیرش:** script/raw-HTML safety tests + validation tests green.

## [ ] `P0-BLOG-3` — Secure Blog Admin API

**مالک:** Backend + Security  
**وابستگی:** `P0-BLOG-2`

Authenticated CRUD + draft/publish lifecycle + slug conflict + media policy + calculated readTime.

**پذیرش:** unauthenticated rejection, draft, publish, edit, delete tests green.

## [ ] `P1-ADM-BLOG-1` — Blog Admin workspace

**مالک:** FE + Product  
**وابستگی:** `P0-BLOG-3`, `P0-ADM-2`

Library/editor/preview/publish panel with FA/EN, Markdown preview, cover, tags/category, SEO, translation completeness and safe delete.

**پذیرش:** authenticated Blog CRUD E2E green.

## [ ] `P1-BLOG-1` — Public Blog landing

**مالک:** FE + SEO  
**وابستگی:** `P0-BLOG-2`

- `/blog`, `/en/blog`
- featured article max 1
- category filter
- pagination
- author/expertise context

**پذیرش:** published only؛ EN incomplete excluded؛ route metadata correct.

## [ ] `P1-BLOG-2` — Article detail + BlogPosting

**مالک:** FE + SEO + QA  
**وابستگی:** `P1-BLOG-1`

- one H1
- safe server-rendered Markdown
- author/date/update/readTime
- related article/Discover
- contextual service/case-study CTA
- BlogPosting + BreadcrumbList

**پذیرش:** draft/incomplete EN notFound؛ schema backed by visible facts.

## [ ] `P1-BLOG-3` — Sitemap/site integration

**مالک:** SEO + FE  
**وابستگی:** `P1-BLOG-2`

- sitemap published/translated routes;
- Blog navigation;
- optional Home latest <=3 only if Homepage density budget remains valid;
- related Blog links on Discover detail.

**پذیرش:** no index bloat; Home simplification does not regress.

---

# P1 — Shared SEO / Analytics / Quality

## [ ] `P1-SHARED-1` — Metadata/entity/hreflang alignment

**مالک:** SEO + FE

Across Home/Discover/Blog:

- canonical locale strategy;
- Person/author entity alignment;
- x-default policy;
- content-timestamp sitemap dates;
- no duplicate English shells.

## [ ] `P1-SHARED-2` — Event taxonomy V3

**مالک:** Analytics + FE

Minimum groups:

### Home
- `hero_impression`
- `hero_primary_cta_click`
- `hero_projects_cta_click`
- `project_card_click`
- `contact_cta_click`
- `qualification_start`
- `qualification_submit_success`

### Discover
- `discover_landing_view`
- `discover_search_submit`
- `discover_filter_change`
- `discover_item_open`
- `discover_item_view`
- `discover_external_click`
- `discover_telegram_guide_click`
- `discover_instagram_click`
- `discover_related_item_click`
- `discover_asdev_cta_click`

### Blog
- `blog_landing_view`
- `blog_article_open`
- `blog_article_view`
- `blog_related_article_click`
- `blog_discover_click`
- `blog_service_cta_click`
- `blog_case_study_click`

**پذیرش:** duplicate/obsolete event path حذف/مستند؛ sensitive query retention policy رعایت.

## [ ] `P1-SHARED-3` — Full responsive/A11y/performance gate

**مالک:** QA + FE

Run:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Plus targeted:

- Homepage V3 desktop/mobile;
- `e2e/admin-v3.spec.ts`;
- `e2e/discover-v3.spec.ts`;
- `e2e/blog-v1.spec.ts`.

**پذیرش:** no Critical/Serious Axe; public Lighthouse targets preserved where environment stable; no console errors; no secret/private DB/media leakage.

## [ ] `P1-SHARED-4` — Production release + live verification

**مالک:** DevOps + QA

- backup DB before migration؛
- deploy via established pipeline؛
- verify apex + www؛
- verify Home, Discover, representative item, Blog/article, `/api/ready`؛
- authenticated Admin smoke؛
- exact SHA + migration + rollback evidence.

---

# P2 — Growth After Stable Launch

## [ ] `P2-1` — Case-study evidence enrichment

Before/After + measurement window + source/methodology. Unsupported claims removed/qualified.

## [ ] `P2-2` — Seed Blog content

Publish 3–5 real high-signal articles. Suggested themes:

1. production readiness;
2. project rescue without rewrite;
3. reliability/performance for Iranian infrastructure;
4. technical SEO as engineering;
5. reducing fragile external dependencies.

## [ ] `P2-3` — Discover editorial growth

Add reviewed high-quality resources, keep `lastReviewedAt` current, avoid bulk scraping/import.

## [ ] `P2-4` — CRO baseline and experiments

Only after stable analytics baseline. Each experiment needs hypothesis + metric + stop condition.

## [ ] `P2-5` — Optional Admin bulk actions

Only after single-item workflows are stable and real content volume justifies bulk publish/feature/reorder.

---

# Release / Completion Gate

Content Platform V3 is **Done** only when all four surfaces satisfy their acceptance gates:

1. **Home** — personal identity + simplified conversion path;
2. **Discover** — general public Resource Hub + social destination;
3. **Admin** — route-based maintainable control center;
4. **Blog** — safe first-party editorial platform.

Global completion requires:

- FA/EN policy correct;
- additive migrations verified;
- old Admin monolith removed only after parity;
- quality gates actually executed;
- security posture not regressed;
- production SHA documented;
- live verification recorded;
- rollback path recorded;
- no fabricated proof/content.

## Historical note

Existing production capabilities such as route-first navigation, locale metadata, sitemap manifest, design-token governance, A11y testing, secure Admin auth/API helpers, Discover attribution and qualification flow are baseline guarantees. V3 must preserve or improve them, never silently regress them.
