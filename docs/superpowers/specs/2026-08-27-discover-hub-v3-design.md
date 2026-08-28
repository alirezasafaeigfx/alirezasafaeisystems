# Discover Hub V3 — Design Specification

**Date:** 2026-08-27  
**Status:** Approved for implementation  
**Owner:** Product + FE + SEO + Admin/CMS  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`  
**Public routes:** `/discover`, `/en/discover`, `/discover/[slug]`, `/en/discover/[slug]`

---

## 1. Product Goal

Transform Discover from a social-link directory into a durable, searchable, indexable **ASDEV Resource Hub** for tools, apps, AI products, services, guides and curated resources, while preserving its role as the primary Instagram-bio destination.

Discover must serve four jobs:

1. help a social visitor quickly find a resource mentioned by ASDEV;
2. let organic-search visitors discover useful curated resources;
3. create an owned content surface that strengthens the Alireza Safaei / ASDEV entity and topical authority;
4. convert relevant visitors toward case studies, technical services, collaboration or the ASDEV ecosystem without turning the page into an ad wall.

The redesign is an evolution of the existing production data model and admin CRUD, not a rewrite or new external CMS.

---

## 2. Current-State Findings

The current implementation already has valuable production foundations:

- `DiscoverItem` persisted through Prisma/SQLite;
- publish/unpublish, featured flag, ordering and publish timestamp;
- image upload and preview;
- official URL, Instagram URL and Telegram guide URL;
- public list/detail routes;
- analytics attribution and click telemetry;
- FA/EN route framework;
- admin CRUD protected by existing admin auth, rate limiting and API security.

Primary gaps:

- content records are effectively single-language while both FA and EN routes exist;
- public discovery state is client-only and not shareable in URL;
- grid is visually serviceable but not a scalable information architecture;
- resource taxonomy is too thin for long-term discovery;
- admin editor mixes authoring, upload, status and library management in one large component;
- no explicit content completeness/publishing policy for English;
- no faceted SEO/indexing policy;
- no editorial freshness fields beyond `updatedAt`;
- no first-class relation to blog/editorial content.

---

## 3. Design Principles

1. **Search-first, not card-first.** Visitors arriving from social should be able to find a named resource immediately.
2. **Server-first discovery.** Public list/detail pages remain React Server Component driven; client JavaScript is limited to interactive filters/search controls.
3. **URL is state.** Search, category, type, platform, sort and page must be shareable through search parameters.
4. **Editorial trust over directory scale.** No mass-imported or thin AI-generated resource pages.
5. **One canonical source of truth.** Admin writes database records; public pages render database records.
6. **Bilingual integrity.** English pages are indexed only when English content is complete enough to be useful.
7. **Evidence-based structured data.** Do not add schema types whose required factual properties are unavailable.
8. **Performance budget first.** No carousel library, animation framework or client-side search dependency is required.

---

## 4. Public Information Architecture

### 4.1 Discover landing

Target structure:

1. compact brand-aware header context;
2. search-first hero;
3. featured resources (maximum 4);
4. filter/sort bar;
5. result grid/list;
6. pagination;
7. compact editorial trust/disclosure block;
8. contextual ASDEV CTA;
9. footer.

### 4.2 Search/filter controls

Supported state:

- `q` — text query;
- `category` — exact category slug/value;
- `type` — resource type;
- `platform` — platform filter;
- `sort` — `featured` or `latest` initially;
- `page` — positive integer.

Example:

`/discover?q=gemini&type=ai-tool&platform=android&page=1`

Do not implement a fake `popular` sort until a reliable popularity signal exists.

### 4.3 Result card hierarchy

Each card should present, in order:

1. image/logo;
2. resource type + category;
3. title;
4. short description;
5. up to 3 compact tags/platform indicators;
6. `Featured` / `New` state only when true and meaningful;
7. single clear CTA to the internal resource profile.

The card itself may be clickable if keyboard/focus semantics remain correct. Avoid multiple equal-weight external CTAs inside the card.

### 4.4 Resource detail profile

Target sections:

1. breadcrumb/back to Discover;
2. resource identity hero;
3. short editorial summary;
4. `Why it is useful / مناسب چه کاری است`;
5. practical guide/body content;
6. official destination primary action;
7. optional Telegram full guide/file;
8. optional Instagram source/reel;
9. related Discover resources;
10. related blog/Insights articles when available;
11. transparent ownership/disclosure;
12. contextual ASDEV next step.

---

## 5. Data Model Evolution

Keep `DiscoverItem` and perform an additive migration. Do not normalize taxonomy into multiple relation tables in V3 unless actual scale requires it.

Recommended additive fields:

```prisma
model DiscoverItem {
  // existing fields remain

  titleEn           String?
  descriptionEn     String?
  contentEn         String?

  resourceType      String   @default("tool")
  platforms         String   @default("")
  pricingModel      String   @default("unknown")

  seoTitle          String?
  seoDescription    String?
  seoTitleEn        String?
  seoDescriptionEn  String?

  lastReviewedAt    DateTime?
}
```

### 5.1 Controlled values

Use Zod validation as the authoritative application-level contract instead of a database enum so SQLite migration remains low-risk.

Initial `resourceType` values:

- `ai-tool`
- `app`
- `web-service`
- `developer-tool`
- `productivity`
- `guide`
- `resource`
- `other`

Initial `pricingModel` values:

- `free`
- `freemium`
- `paid`
- `open-source`
- `unknown`

`platforms` stays comma-separated for this phase because the current project already uses that persistence pattern for tags. Public/admin helpers must parse/normalize values in one shared module.

### 5.2 Translation completeness

A Discover item is English-publishable only when all of these exist:

- `titleEn`;
- `descriptionEn`;
- `contentEn`.

English listing must exclude incomplete records. English detail route returns `notFound()` for an incomplete English record.

Do not index a translated shell around Persian body content.

---

## 6. Public Query Architecture

The landing page remains a Server Component and reads validated `searchParams`.

Recommended shared query module:

`src/lib/discover-query.ts`

Responsibilities:

- parse and normalize public query params;
- produce Prisma `where` / `orderBy` inputs;
- enforce a fixed page size;
- derive canonical filter state;
- expose allowed taxonomy values.

Suggested page size: **24**.

The server should query only the required fields for cards and issue a separate `count()` for pagination.

Interactive controls may be a small client component that calls `router.replace()`/`router.push()` with normalized params inside a transition. No global state library is required.

---

## 7. SEO Architecture

### 7.1 Canonical policy

- base Persian hub canonical: `/discover`;
- base English hub canonical: `/en/discover`;
- item canonical is locale-specific detail route;
- query/filter/search result states canonicalize to the base locale hub;
- filtered/search states should be `noindex,follow` to avoid faceted index bloat.

### 7.2 Hreflang

- listing pages always provide FA/EN alternates;
- detail pages provide EN alternate only when English translation completeness passes;
- Persian detail remains canonical and indexable regardless of English completeness;
- `x-default` points to Persian canonical.

### 7.3 Sitemap

Include:

- base Discover routes;
- published Persian items;
- translated English item routes only when translation completeness passes.

Do not include query/filter URLs.

### 7.4 Structured data

Use:

- `BreadcrumbList` on landing/detail;
- `Article` only when the page genuinely functions as an editorial guide and visible content supports that representation.

Do not mark every external product as `SoftwareApplication` unless all required public facts are present and visible.

---

## 8. UX / Visual System

Discover should inherit the same Personal Brand V3 design tokens, typography and component language as the homepage.

Visual direction:

- light, high-contrast, premium technical editorial surface;
- restrained brand accent;
- strong search affordance;
- compact chips and badges;
- imagery with consistent aspect ratio;
- no gratuitous glassmorphism or heavy gradient layers;
- no horizontal carousel required for core content;
- all interactive states visible on keyboard focus;
- `prefers-reduced-motion` respected.

Responsive validation widths:

- 375 px;
- 768 px;
- 1024 px;
- 1440 px.

Target WCAG: **2.2 AA**.

---

## 9. Analytics Contract

Preserve existing attribution helpers but normalize event names.

Minimum events:

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

Do not collect raw search queries if they may contain sensitive user data without an explicit retention policy. If queries are stored, truncate and sanitize them.

---

## 10. Admin Authoring Requirements

The Admin V3 implementation owns the editor UX, but Discover defines its content contract.

Required editor groups:

1. Basic information;
2. Persian content;
3. English content;
4. Taxonomy;
5. Media;
6. External/social links;
7. SEO override;
8. Publishing/review state.

Required authoring capabilities:

- create;
- edit;
- preview;
- publish/unpublish;
- featured toggle;
- ordering;
- search/filter library;
- safe delete confirmation;
- image upload;
- translation completeness indicator;
- last-reviewed timestamp control.

Bulk actions are P2, not a blocker for V3 launch.

---

## 11. Security & Content Safety

- reuse existing `enforceAdminAccess`, rate-limit and API response headers;
- keep server-side Zod validation authoritative;
- validate public/external URLs;
- upload endpoint must verify MIME type, allowed extension/encoding, file size and generated filename server-side;
- SVG uploads remain disallowed unless a separate sanitization design is approved;
- never render arbitrary HTML from database content;
- external links use safe target/rel semantics;
- destructive actions require explicit confirmation.

---

## 12. Performance Requirements

- default public content rendered server-side;
- images use `next/image` where technically compatible with source policy; if remote hosts are unbounded, use a controlled image-proxy/allowlist strategy before converting;
- fixed image dimensions/aspect ratios to avoid CLS;
- no client-side copy of the entire Discover record body on landing;
- pagination prevents unbounded DOM growth;
- no new search SaaS or client search index for the current scale.

---

## 13. Testing & Verification

Required targeted tests:

- query parser unit tests;
- translation completeness unit tests;
- public landing FA/EN smoke tests;
- detail route published/unpublished tests;
- EN incomplete translation behavior;
- search/filter URL-state Playwright test;
- keyboard filter/search navigation;
- Axe scan on landing and representative detail;
- admin CRUD regression tests;
- upload validation tests;
- sitemap/canonical/hreflang tests.

Global gate:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

A timeout or unexecuted test is not a pass.

---

## 14. Rollout Sequence

1. additive Prisma migration + shared validation/helpers;
2. backfill existing records with safe defaults;
3. Admin editor support for new fields;
4. public server-query/filter architecture;
5. landing redesign;
6. detail redesign;
7. SEO/sitemap integration;
8. analytics normalization;
9. E2E/A11y/performance verification;
10. production deploy through existing pipeline;
11. live verification and rollback evidence.

---

## 15. Non-goals

Not in V3:

- external headless CMS;
- Elasticsearch/Algolia/Meilisearch;
- user accounts, ratings or comments;
- automated web scraping/import;
- AI-generated bulk content;
- fake popularity ranking;
- arbitrary user-submitted resources.

---

## 16. Definition of Done

Discover V3 is complete when:

- the page works as both social destination and general public resource hub;
- filters/search are shareable and server-backed;
- FA/EN indexing follows translation completeness rules;
- cards and detail pages follow the approved information hierarchy;
- admin can manage every required field without deployment;
- no existing attribution, official-link or Telegram functionality regresses;
- SEO, accessibility, security and performance gates pass;
- migration and rollback procedure are documented and verified;
- exact production SHA and live verification evidence are recorded.
