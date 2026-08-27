# Blog / Insights V1 — Design Specification

**Date:** 2026-08-27  
**Status:** Approved for implementation  
**Owner:** Product + SEO + Content + FE + Admin/CMS  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`  
**Public routes:** `/blog`, `/en/blog`, `/blog/[slug]`, `/en/blog/[slug]`  
**Admin route:** `/admin/blog`

---

## 1. Product Goal

Add a first-party editorial surface to alirezasafaeisystems.ir that grows topical authority, demonstrates engineering judgment, supports Discover resources with deeper context, and creates internal search journeys toward services, case studies and collaboration.

The Blog is not a publishing-volume project. It is a high-signal engineering publication attached to the personal brand of **Alireza Safaei — Software Engineer**.

Primary themes:

- software engineering and architecture;
- web systems and production readiness;
- reliability/performance;
- rescuing incomplete projects;
- technical SEO where engineering intersects search;
- infrastructure/local-first decisions under operational constraints;
- practical analysis of tools/resources already present in Discover when editorial depth adds value.

---

## 2. Current-State Finding

The Prisma schema already contains a `BlogPost` model, but there is no complete public Blog/Insights product or Admin authoring flow.

This is an opportunity to evolve the existing model additively instead of creating a second competing content model.

---

## 3. Editorial Principles

1. **Expertise-first.** Every article must have a clear reader problem, engineering insight or useful decision framework.
2. **No thin AI content.** Do not mass-produce generic posts to inflate page count.
3. **Experience and evidence.** Real project lessons, measurements, diagrams and reproducible technical reasoning are preferred.
4. **Personal author entity.** The visible author is Alireza Safaei when that is factually correct.
5. **Internal linking is editorial, not spam.** Link to services/Discover/case studies only where relevant.
6. **Updateability.** Technical articles need a visible updated date and Admin workflow for review.
7. **Bilingual integrity.** English routes only index when the English article is complete.

---

## 4. Information Architecture

### 4.1 Blog landing

Target structure:

1. title + short publication statement;
2. featured article (maximum 1 prominent feature);
3. category filter;
4. article list/grid;
5. pagination;
6. compact author/expertise block;
7. contextual CTA to relevant work/services.

### 4.2 Article detail

Target structure:

1. breadcrumbs;
2. category + title + excerpt;
3. author/date/update/read-time metadata;
4. cover image when useful;
5. article body;
6. inline headings with sensible hierarchy;
7. optional table of contents for long posts only;
8. related Discover resources when relevant;
9. related articles;
10. contextual service/case-study CTA;
11. author card.

Avoid intrusive popups and newsletter gates in V1.

---

## 5. Data Model Evolution

Keep the existing `BlogPost` model and make an additive migration.

Recommended target:

```prisma
model BlogPost {
  id              String   @id @default(cuid())
  title           String
  slug            String   @unique
  excerpt         String
  content         String
  coverImage      String?
  published       Boolean  @default(false)
  tags            String
  readTime        Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  titleEn         String?
  excerptEn       String?
  contentEn       String?

  category        String   @default("engineering")
  featured        Boolean  @default(false)
  publishedAt     DateTime?
  lastReviewedAt  DateTime?

  seoTitle        String?
  seoDescription  String?
  seoTitleEn      String?
  seoDescriptionEn String?

  @@index([published, featured, publishedAt])
  @@index([category, published])
}
```

Do not introduce a separate Author table in V1 because the publication has one canonical author identity. Author metadata comes from the existing brand source of truth.

---

## 6. Content Format

Store article bodies as **Markdown** in the database.

Rendering requirements:

- use a well-maintained React Markdown renderer;
- GitHub-flavored Markdown support is acceptable;
- raw HTML execution/rendering must remain disabled by default;
- code blocks must be escaped/safe and visually readable;
- heading hierarchy must be normalized so article content cannot create a second page H1;
- external links receive safe rel semantics;
- typography works in FA RTL and EN LTR.

Recommended implementation dependency if the repository does not already provide equivalent capability:

- `react-markdown`;
- `remark-gfm`.

Do not add `rehype-raw` in V1.

---

## 7. Translation Completeness

An English article is publishable/indexable only when all of these exist:

- `titleEn`;
- `excerptEn`;
- `contentEn`.

English listing excludes incomplete English articles. English detail returns `notFound()` for incomplete translation.

Persian content remains independently publishable.

---

## 8. Categories and Tags

Initial controlled category values at application level:

- `software-engineering`
- `web-systems`
- `architecture`
- `production-reliability`
- `performance`
- `technical-seo`
- `devops-infrastructure`
- `project-rescue`
- `tools-workflows`

Tags remain comma-separated in V1 to align with current persistence conventions. Centralize parsing/normalization helpers.

Do not create taxonomy tables until there is a demonstrated editorial need.

---

## 9. SEO Architecture

### 9.1 Metadata

Each article uses:

- locale-aware title/description;
- canonical URL;
- Open Graph title/description/image;
- publish/update dates;
- author identity;
- FA/EN hreflang only when translation completeness passes.

SEO override fields are optional. Default title/excerpt remain authoritative when overrides are blank.

### 9.2 Structured data

Use visible-content-backed:

- `BlogPosting` / `Article`;
- `BreadcrumbList`;
- Person author reference aligned with site-level Person entity.

Include factual values only:

- headline;
- description;
- datePublished;
- dateModified;
- author;
- image when present;
- mainEntityOfPage/canonical.

### 9.3 Sitemap

Include:

- `/blog`;
- `/en/blog`;
- published Persian articles;
- English article routes only when complete.

Use `updatedAt`/`publishedAt`, not build time, for modification dates.

### 9.4 Pagination/filter indexing

- base category landing may become indexable later if content depth justifies it;
- V1 search/filter query states canonicalize to `/blog` and should not create index bloat;
- paginated pages use stable canonical/self behavior appropriate to their actual content.

---

## 10. Internal Linking Strategy

Every article may link to:

- relevant service page;
- relevant case study;
- relevant Discover resource;
- another article.

Rules:

- links must be contextually relevant;
- no forced minimum number of links;
- avoid sitewide exact-match keyword stuffing;
- article CTA should reflect reader intent, not always push `Start collaboration`.

Example paths:

- production-readiness article → stabilization service + relevant case study;
- tool workflow article → Discover item;
- rescue article → project-rescue service + rescue case study.

---

## 11. Home / Discover Integration

Homepage V3 may show a compact `Latest Insights` section with at most 3 articles if it does not reintroduce homepage density.

Discover detail may show up to 3 related Blog articles when relation can be inferred safely from tags/category or explicit editorial mapping.

V1 should not add a complex many-to-many relation table solely for recommendations. Deterministic tag/category matching is sufficient initially.

---

## 12. Read Time

`readTime` is persisted but should be calculated/recalculated by shared application logic from the source Markdown rather than manually trusted.

Use separate approximate word-rate constants for Persian and English if practical; otherwise use one documented conservative rate. The value is informational, not a precision metric.

---

## 13. Admin Authoring UX

Admin Blog editor groups:

1. Basic: slug, category, featured;
2. Persian: title, excerpt, Markdown content;
3. English: title, excerpt, Markdown content;
4. Media: cover image;
5. Taxonomy: tags;
6. SEO overrides;
7. Publish/review: draft/published, publishedAt, lastReviewedAt;
8. Preview.

Requirements:

- autosave is not required in V1;
- failed save preserves entered content;
- visible Markdown preview is strongly preferred;
- publication action displays translation completeness state;
- slug uniqueness validated server-side;
- safe delete confirmation;
- preview draft is authenticated/private; public route must never expose drafts.

---

## 14. Security

- all Admin Blog mutation APIs use existing admin access enforcement and rate limits;
- Markdown raw HTML is disabled;
- user-controlled Markdown cannot inject executable script;
- URLs/images are validated;
- drafts are never selected by public pages;
- preview route, if created, requires admin authentication;
- uploads follow shared media validation policy.

---

## 15. Performance

- article page is server-rendered;
- Markdown conversion occurs on server where possible;
- do not ship Markdown parser/editor logic to every public article if avoidable;
- syntax highlighting, if added, must not require a large client runtime; V1 may use plain semantic code styling;
- paginate article landing;
- image dimensions must avoid CLS.

---

## 16. Accessibility

Target **WCAG 2.2 AA**.

Article-specific requirements:

- one page H1;
- body heading order does not skip unpredictably;
- links are distinguishable beyond color alone;
- code blocks scroll without breaking page width;
- Persian punctuation/inline code remains readable in RTL;
- focus styles visible;
- cover image alt text meaningful when informational;
- table overflow remains operable on small screens.

---

## 17. Analytics

Minimum events:

- `blog_landing_view`
- `blog_article_open`
- `blog_article_view`
- `blog_related_article_click`
- `blog_discover_click`
- `blog_service_cta_click`
- `blog_case_study_click`

Do not use scroll depth as a success metric until the event can be collected reliably without noisy implementation.

Primary content KPIs:

- organic impressions/clicks;
- article views;
- related-content navigation;
- service/case-study assisted clicks;
- indexed valid article count;
- article freshness/review coverage.

---

## 18. Testing

Required targeted tests:

- Blog schema validation;
- slug uniqueness behavior;
- Markdown safety (raw HTML not rendered);
- read-time calculation;
- publish/unpublish lifecycle;
- incomplete EN translation behavior;
- canonical/hreflang/BlogPosting schema;
- sitemap inclusion/exclusion;
- Admin Blog CRUD;
- public landing/detail FA/EN E2E;
- representative Axe scans;
- mobile Markdown/code/table rendering checks.

Global gate:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

---

## 19. Initial Editorial Launch Set

Do not launch an empty blog if avoidable. Target 3–5 high-quality seed posts derived from real expertise, not generic fillers.

Recommended initial topics:

1. Production readiness checklist for real web products;
2. How to rescue an incomplete web project without rewriting everything;
3. Practical reliability/performance decisions for Iranian web infrastructure;
4. Technical SEO mistakes that are actually software engineering problems;
5. How to reduce fragile external dependencies in production systems.

Content publication is separate from software completion; if seed articles are not approved, launch the product with drafts but do not fabricate expertise claims or project evidence.

---

## 20. Rollout Sequence

1. additive BlogPost migration;
2. shared validation/read-time/Markdown utilities;
3. authenticated Admin Blog CRUD;
4. public Blog landing;
5. public article detail;
6. SEO/schema/sitemap integration;
7. Discover/Home related-content integration;
8. E2E/A11y/performance verification;
9. deploy through existing release pipeline;
10. live verification and indexing checks.

---

## 21. Non-goals

- comments;
- user accounts;
- newsletter platform;
- subscriptions/paywall;
- multi-author RBAC;
- WYSIWYG page builder;
- AI auto-publishing;
- imported/scraped content;
- headless CMS migration.

---

## 22. Definition of Done

Blog / Insights V1 is complete when:

- public FA Blog and article routes exist;
- EN routes follow translation completeness rules;
- Admin can create/edit/preview/publish/unpublish/delete posts without deployment;
- Markdown rendering is safe and accessible;
- metadata, BlogPosting schema, canonical/hreflang and sitemap are correct;
- related Discover/service/case-study journeys work without spammy linking;
- performance/A11y/security gates pass;
- production SHA and live verification are recorded.
