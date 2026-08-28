# Blog / Insights V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch a first-party bilingual engineering Blog/Insights surface with safe Markdown, SEO-correct article pages, Admin publishing and internal links to Discover, services and case studies.

**Architecture:** Extend the existing `BlogPost` model additively. Store article bodies as Markdown in SQLite, render them server-side with raw HTML disabled, expose locale-aware public landing/detail routes, and manage drafts/publishing through the authenticated Admin Control Center.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma/SQLite, Zod, `react-markdown`, `remark-gfm`, Tailwind, Playwright, Vitest, Axe.

**Spec:** `docs/superpowers/specs/2026-08-27-blog-insights-v1-design.md`

## Global Constraints

- No comments, newsletter, paywall, multi-author system, external CMS or AI auto-publishing.
- English article routes are indexable only when title/excerpt/content EN are complete.
- Raw HTML in Markdown remains disabled; do not add `rehype-raw`.
- Author identity is sourced from canonical brand configuration, not duplicated in database records.
- Target WCAG 2.2 AA.
- Seed content must be real and approved; do not fabricate technical experience, metrics or case-study evidence.

---

### Task 1: Extend BlogPost and create migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_blog_insights_v1/migration.sql`
- Test: `src/__tests__/blog/blog-model.test.ts`

**Interfaces:**
- Produces Blog V1 persisted fields consumed by Admin/public routes.

- [ ] **Step 1: Add a failing application-contract test**

The later validation schema must support default category `engineering`, default featured `false`, optional EN/SEO fields and optional publish/review dates.

- [ ] **Step 2: Add fields additively**

Extend the existing model with:

```prisma
  titleEn          String?
  excerptEn        String?
  contentEn        String?
  category         String    @default("engineering")
  featured         Boolean   @default(false)
  publishedAt      DateTime?
  lastReviewedAt   DateTime?
  seoTitle         String?
  seoDescription   String?
  seoTitleEn       String?
  seoDescriptionEn String?

  @@index([published, featured, publishedAt])
  @@index([category, published])
```

Keep existing fields and unique slug.

- [ ] **Step 3: Generate safe SQLite migration and Prisma client**

```bash
pnpm prisma generate
pnpm run type-check
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add prisma src/__tests__/blog/blog-model.test.ts
git commit -m "feat(blog): add insights v1 fields"
```

---

### Task 2: Add Blog validation, Markdown and read-time utilities

**Files:**
- Create: `src/lib/blog.ts`
- Create: `src/lib/blog-markdown.tsx`
- Create: `src/__tests__/blog/blog-validation.test.ts`
- Create: `src/__tests__/blog/blog-markdown.test.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces:

```ts
export const BLOG_CATEGORIES: readonly string[]
export const blogCreateSchema: z.ZodType<...>
export const blogUpdateSchema: z.ZodType<...>
export function hasCompleteBlogTranslation(post: ...): boolean
export function estimateReadTime(markdown: string, locale: 'fa' | 'en'): number
export function BlogMarkdown({ content, locale }: { content: string; locale: 'fa' | 'en' }): JSX.Element
```

- [ ] **Step 1: Install minimal Markdown dependencies**

```bash
pnpm add react-markdown remark-gfm
```

Do not add raw-HTML plugins.

- [ ] **Step 2: Write failing validation/read-time tests**

Test slug normalization rules, controlled category, tags parsing, EN completeness, minimum/maximum content limits and deterministic positive read time.

- [ ] **Step 3: Implement validation**

Use the existing Discover validation style: lowercase hyphen slug, bounded text lengths, deduped comma/array tags, safe optional image URL policy.

- [ ] **Step 4: Implement safe Markdown renderer**

Use `react-markdown` + `remark-gfm`. Do not enable raw HTML. Map `h1` from stored Markdown to `h2` or reject H1 in validation so article page owns the only H1.

- [ ] **Step 5: Test raw HTML safety**

A Markdown string containing `<script>alert(1)</script>` must not render executable script or raw HTML node.

- [ ] **Step 6: Run tests and commit**

```bash
pnpm vitest run src/__tests__/blog/blog-validation.test.ts src/__tests__/blog/blog-markdown.test.tsx
git add package.json pnpm-lock.yaml src/lib/blog.ts src/lib/blog-markdown.tsx src/__tests__/blog
git commit -m "feat(blog): add safe markdown content contract"
```

---

### Task 3: Add secure Admin Blog API

**Files:**
- Create: `src/app/api/admin/blog/route.ts`
- Create: `src/app/api/admin/blog/upload/route.ts` only if shared media endpoint cannot be reused safely
- Test: `src/__tests__/api/admin-blog.test.ts`

**Interfaces:**
- Consumes Blog schemas from Task 2.
- Produces authenticated CRUD API consumed by Admin Blog editor.

- [ ] **Step 1: Write failing API tests**

Cover unauthenticated rejection, create draft, publish timestamp, partial update, slug conflict, invalid category/content, delete and draft exclusion assumptions.

- [ ] **Step 2: Implement GET**

Require admin access, rate limit, support bounded `published/category/q` filters, order by featured/publishedAt/updatedAt.

- [ ] **Step 3: Implement POST/PATCH**

Sanitize bounded strings, persist tags as comma-separated values, calculate `readTime` from the relevant primary Markdown, set `publishedAt` only on first publish unless explicitly supported by admin input policy.

- [ ] **Step 4: Implement DELETE**

Require valid ID and admin access; return normalized response and structured logs.

- [ ] **Step 5: Reuse shared upload behavior when possible**

If a separate endpoint is required, enforce JPEG/PNG/WebP, max size and generated filename; reject SVG.

- [ ] **Step 6: Run tests and commit**

```bash
pnpm vitest run src/__tests__/api/admin-blog.test.ts
git add src/app/api/admin/blog src/__tests__/api/admin-blog.test.ts
git commit -m "feat(blog): add secure admin publishing API"
```

---

### Task 4: Implement Blog Admin authoring surface

**Files:**
- Create: `src/app/admin/(control)/blog/page.tsx`
- Create: `src/components/admin/blog/blog-library.tsx`
- Create: `src/components/admin/blog/blog-editor.tsx`
- Create: `src/components/admin/blog/blog-publish-panel.tsx`
- Create: `src/components/admin/blog/blog-markdown-preview.tsx`
- Extend: `e2e/admin-v3.spec.ts`

- [ ] **Step 1: Write failing authenticated Blog CRUD E2E**

Create draft → preview → add EN translation → publish → edit → unpublish → delete.

- [ ] **Step 2: Build library**

Search/filter by draft/published/category and show featured, translation completeness and last update.

- [ ] **Step 3: Build grouped editor**

Sections: Basic, Persian, English, Media, Taxonomy, SEO, Publish/Review. Save failure must preserve content.

- [ ] **Step 4: Add safe Markdown preview**

Use the same renderer as public article so preview does not diverge from production behavior.

- [ ] **Step 5: Add safe delete confirmation**

Use the shared Admin confirmation dialog.

- [ ] **Step 6: Run E2E and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts --grep "Blog"
git add src/app/admin src/components/admin/blog e2e/admin-v3.spec.ts
git commit -m "feat(blog): add admin insights workspace"
```

---

### Task 5: Build public Blog landing

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/components/blog/blog-card.tsx`
- Create: `src/components/blog/blog-filters.tsx`
- Create: `src/components/blog/blog-pagination.tsx`
- Create: `src/lib/blog-query.ts`
- Test: `src/__tests__/blog/blog-query.test.ts`
- Create: `e2e/blog-v1.spec.ts`

**Interfaces:**
- Produces server-backed listing with page/category state.

- [ ] **Step 1: Write failing query tests**

Validate page/category and EN translation filtering. Page size: 12 unless real layout/testing supports another explicit value.

- [ ] **Step 2: Implement server query helper**

Published only. EN locale requires complete EN fields. Order featured then publishedAt/updatedAt descending.

- [ ] **Step 3: Build landing RSC**

One optional featured article, category filter, paginated cards, author/expertise context. Do not render drafts.

- [ ] **Step 4: Add metadata**

Locale-aware title/description/canonical/hreflang. Filter/page states should not create uncontrolled index surfaces.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm vitest run src/__tests__/blog/blog-query.test.ts
pnpm exec playwright test e2e/blog-v1.spec.ts
git add src/app/blog src/components/blog src/lib/blog-query.ts src/__tests__/blog/blog-query.test.ts e2e/blog-v1.spec.ts
git commit -m "feat(blog): add public insights landing"
```

---

### Task 6: Build article detail, structured data and related content

**Files:**
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/blog/article-header.tsx`
- Create: `src/components/blog/article-related.tsx`
- Create: `src/components/blog/article-author.tsx`
- Modify: `src/lib/seo.ts`
- Test: `src/__tests__/seo/blog-v1-seo.test.ts`
- Extend: `e2e/blog-v1.spec.ts`

- [ ] **Step 1: Write failing publication/locale tests**

Unpublished article returns notFound. Incomplete EN article returns notFound on EN route. Complete translation uses EN title/excerpt/content.

- [ ] **Step 2: Render article server-side**

One H1 from localized title, safe Markdown body, dates/read time, cover image, author card and contextually related content.

- [ ] **Step 3: Add BlogPosting + Breadcrumb structured data**

Use visible factual values: headline, description, datePublished, dateModified, author, canonical, image when present.

- [ ] **Step 4: Add deterministic related content**

Use category/tag matching with strict limits; do not create a new relation schema in V1.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm vitest run src/__tests__/seo/blog-v1-seo.test.ts
pnpm exec playwright test e2e/blog-v1.spec.ts
git add src/app/blog src/components/blog src/lib/seo.ts src/__tests__/seo/blog-v1-seo.test.ts e2e/blog-v1.spec.ts
git commit -m "feat(blog): add seo ready article pages"
```

---

### Task 7: Integrate sitemap, navigation, Home and Discover

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: relevant header/footer/navigation config
- Modify: Homepage V3 composition only if the compact Insights block fits approved density
- Modify: `src/app/discover/[slug]/page.tsx` or related component
- Create: `src/__tests__/seo/sitemap-blog-v1.test.ts`

- [ ] **Step 1: Add sitemap tests**

Published FA articles included; drafts excluded; EN article included only when translation-complete; modification date from content timestamps.

- [ ] **Step 2: Add Blog to site navigation without crowding primary CTA**

Use label `بلاگ` / `Blog` or approved localized equivalent.

- [ ] **Step 3: Add compact Latest Insights to Home only if Homepage V3 remains within density target**

Maximum 3 cards. If it violates the Home simplification target, link Blog from navigation/footer and defer home block.

- [ ] **Step 4: Add related Blog links from Discover details**

Maximum 3, based on deterministic category/tag relevance.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm vitest run src/__tests__/seo/sitemap-blog-v1.test.ts
pnpm exec playwright test e2e/blog-v1.spec.ts
git add src/app/sitemap.ts src/app/discover src/app src/components src/__tests__/seo/sitemap-blog-v1.test.ts
git commit -m "feat(blog): integrate insights across site"
```

---

### Task 8: Analytics, A11y and final verification

**Files:**
- Modify: `docs/EVENT_TAXONOMY.md`
- Modify: `e2e/a11y.spec.ts`
- Create: `docs/reports/live-verification/<timestamp>-blog-insights-v1.md`
- Update: `docs/ROADMAP_TASKS.md`

- [ ] **Step 1: Add Blog event contract**

Document and emit:

```text
blog_landing_view
blog_article_open
blog_article_view
blog_related_article_click
blog_discover_click
blog_service_cta_click
blog_case_study_click
```

- [ ] **Step 2: Add representative Blog pages to Axe coverage**

Include FA landing/article and EN article fixture when translation exists.

- [ ] **Step 3: Run full quality gate**

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

- [ ] **Step 4: Run mobile content checks**

At 375px verify headings, code blocks, tables, images, links and RTL/LTR behavior.

- [ ] **Step 5: Deploy through established release workflow**

No direct production file edit.

- [ ] **Step 6: Record live evidence**

Record exact SHA, public FA Blog, one published article, EN translation case if available, Admin create/edit/publish cycle, canonical/schema/sitemap samples and rollback reference.

- [ ] **Step 7: Mark roadmap complete only from evidence**

Do not mark content-seed publication complete unless real approved articles exist.
