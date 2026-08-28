# Discover Hub V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve `/discover` into a bilingual, search-first, server-backed ASDEV Resource Hub with scalable taxonomy, shareable filters, strong SEO rules and zero-deploy Admin publishing.

**Architecture:** Keep the current Next.js 16 App Router + Prisma/SQLite stack. Extend `DiscoverItem` additively, centralize validation/query logic, keep public pages server-first, keep mutation APIs protected by existing admin security, and move interactive filtering to a small URL-state client component.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Prisma 6/SQLite, Zod 4, Tailwind CSS 4, Playwright, Vitest, Axe.

**Spec:** `docs/superpowers/specs/2026-08-27-discover-hub-v3-design.md`

## Global Constraints

- Keep existing admin authentication, API security, attribution and Telegram/Instagram behavior unless a verified defect requires change.
- No external CMS, search SaaS, carousel library, global client store or fake popularity sort.
- English detail pages are public/indexable only when `titleEn`, `descriptionEn` and `contentEn` are all present.
- Filter/search result states are URL-backed and `noindex,follow`.
- Target WCAG 2.2 AA.
- `pnpm run verify`, smoke, a11y, Lighthouse and secret scan must be executed; timeout/not-run is not green.

---

### Task 1: Add Discover V3 data fields and migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_discover_hub_v3/migration.sql`
- Test: `src/__tests__/discover/discover-model.test.ts`

**Interfaces:**
- Produces optional translation/SEO fields and controlled taxonomy fields consumed by all later Discover tasks.

- [ ] **Step 1: Write a failing schema-contract test**

Create a test that imports Prisma-generated types only after generation and asserts the application validation defaults instead of coupling to generated internals. The test target introduced in Task 2 must expect:

```ts
expect(parsed.resourceType).toBe('tool')
expect(parsed.pricingModel).toBe('unknown')
expect(parsed.platforms).toEqual([])
```

- [ ] **Step 2: Extend `DiscoverItem` additively**

Add exactly these fields:

```prisma
  titleEn           String?
  descriptionEn     String?
  contentEn         String?
  resourceType      String    @default("tool")
  platforms         String    @default("")
  pricingModel      String    @default("unknown")
  seoTitle          String?
  seoDescription    String?
  seoTitleEn        String?
  seoDescriptionEn  String?
  lastReviewedAt    DateTime?
```

Keep all existing fields and indexes.

- [ ] **Step 3: Generate a real additive SQLite migration**

Use the project migration workflow. The SQL must use additive `ALTER TABLE` operations or Prisma's safe table-copy strategy; it must not drop existing Discover data.

- [ ] **Step 4: Regenerate Prisma client and run type-check**

Run:

```bash
pnpm prisma generate
pnpm run type-check
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma src/__tests__/discover/discover-model.test.ts
git commit -m "feat(discover): add v3 content fields"
```

---

### Task 2: Extend Discover validation and normalization

**Files:**
- Modify: `src/lib/discover.ts`
- Create: `src/__tests__/discover/discover-validation.test.ts`

**Interfaces:**
- Produces: `DISCOVER_RESOURCE_TYPES`, `DISCOVER_PRICING_MODELS`, `discoverPlatformsSchema`, `hasCompleteDiscoverTranslation(item)`.

- [ ] **Step 1: Write failing tests for controlled taxonomy and EN completeness**

Cover:

```ts
expect(hasCompleteDiscoverTranslation({ titleEn: 'A', descriptionEn: 'B', contentEn: 'C' })).toBe(true)
expect(hasCompleteDiscoverTranslation({ titleEn: 'A', descriptionEn: null, contentEn: 'C' })).toBe(false)
```

Also reject unknown `resourceType` and `pricingModel` values.

- [ ] **Step 2: Add controlled values**

```ts
export const DISCOVER_RESOURCE_TYPES = [
  'ai-tool', 'app', 'web-service', 'developer-tool',
  'productivity', 'guide', 'resource', 'other',
] as const

export const DISCOVER_PRICING_MODELS = [
  'free', 'freemium', 'paid', 'open-source', 'unknown',
] as const
```

Add platform parsing using the same dedupe/trim pattern as tags, max 12 values, max 40 chars each.

- [ ] **Step 3: Extend `discoverFieldsSchema` and update schema**

Add nullable EN/SEO values with length limits, resource type, pricing model, platforms, and optional `lastReviewedAt` represented as ISO input at the API boundary.

- [ ] **Step 4: Add translation helper**

```ts
export function hasCompleteDiscoverTranslation(item: {
  titleEn?: string | null
  descriptionEn?: string | null
  contentEn?: string | null
}): boolean {
  return Boolean(item.titleEn?.trim() && item.descriptionEn?.trim() && item.contentEn?.trim())
}
```

- [ ] **Step 5: Run targeted tests**

```bash
pnpm vitest run src/__tests__/discover/discover-validation.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/discover.ts src/__tests__/discover/discover-validation.test.ts
git commit -m "feat(discover): validate v3 taxonomy and translations"
```

---

### Task 3: Upgrade secure Admin Discover API

**Files:**
- Modify: `src/app/api/admin/discover/route.ts`
- Modify: `src/app/api/admin/discover/upload/route.ts` if validation gaps are found
- Test: `src/__tests__/api/admin-discover-v3.test.ts`

**Interfaces:**
- Consumes extended schemas from Task 2.
- Produces authoritative CRUD records used by Admin editor.

- [ ] **Step 1: Write failing API tests**

Test authenticated create/update for new fields, invalid taxonomy rejection, unique slug conflict, and unauthenticated rejection.

- [ ] **Step 2: Map new create fields**

Persist sanitized translation/SEO strings, `platforms.join(',')`, controlled strings and `lastReviewedAt`.

- [ ] **Step 3: Map new patch fields**

Preserve the current partial-update behavior. Never overwrite unspecified fields with null/default values.

- [ ] **Step 4: Audit upload validation**

Confirm server-side MIME/type/size/generated-name checks. If any are missing, enforce JPEG/PNG/WebP only and reject SVG. Keep the existing `/media/discover/...webp` public-path contract if already production-backed.

- [ ] **Step 5: Run tests**

```bash
pnpm vitest run src/__tests__/api/admin-discover-v3.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/discover src/__tests__/api/admin-discover-v3.test.ts
git commit -m "feat(discover): extend secure admin content API"
```

---

### Task 4: Add server-side public Discover query module

**Files:**
- Create: `src/lib/discover-query.ts`
- Create: `src/__tests__/discover/discover-query.test.ts`

**Interfaces:**
- Produces:

```ts
export type DiscoverPublicQuery = {
  q: string
  category: string
  type: string
  platform: string
  sort: 'featured' | 'latest'
  page: number
}

export function parseDiscoverPublicQuery(input: Record<string, string | string[] | undefined>): DiscoverPublicQuery
export function buildDiscoverWhere(query: DiscoverPublicQuery, locale: 'fa' | 'en'): Prisma.DiscoverItemWhereInput
export function buildDiscoverOrderBy(query: DiscoverPublicQuery): Prisma.DiscoverItemOrderByWithRelationInput[]
export const DISCOVER_PAGE_SIZE = 24
```

- [ ] **Step 1: Write failing parser tests**

Cover invalid page, unknown sort/type, whitespace query and array-valued params.

- [ ] **Step 2: Implement parser with Zod or explicit normalization**

Unknown filter values must fall back to neutral values rather than throw a public 500.

- [ ] **Step 3: Implement Prisma query builders**

For English locale require non-null/non-empty EN fields. Search Persian records across `title`, `description`, `category`, `tags`, `platforms`; English records additionally search EN title/description.

- [ ] **Step 4: Run tests and commit**

```bash
pnpm vitest run src/__tests__/discover/discover-query.test.ts
git add src/lib/discover-query.ts src/__tests__/discover/discover-query.test.ts
git commit -m "feat(discover): add server query contract"
```

---

### Task 5: Rebuild Discover landing server-first

**Files:**
- Modify: `src/app/discover/page.tsx`
- Replace/refactor: `src/components/discover/discover-grid.tsx`
- Create: `src/components/discover/discover-filters.tsx`
- Create: `src/components/discover/discover-card.tsx`
- Create: `src/components/discover/discover-pagination.tsx`
- Test: `e2e/discover-v3.spec.ts`

**Interfaces:**
- Consumes query module from Task 4.

- [ ] **Step 1: Write failing E2E assertions**

Assert:

- H1/search visible;
- URL updates after category/type filter;
- page refresh preserves filter state;
- cards link to internal profile;
- EN landing excludes untranslated records.

- [ ] **Step 2: Move filtering to the server page**

Read validated `searchParams`, query `findMany` with `skip/take`, query `count()`, and select only card fields.

- [ ] **Step 3: Build small client filter control**

Use `useRouter`, `useSearchParams`, `useTransition`; update params with `router.replace`. Reset page to 1 when a filter changes.

- [ ] **Step 4: Build card and pagination components**

Keep one internal primary action per card. Limit visible tags/platforms to compact counts defined in spec.

- [ ] **Step 5: Implement metadata for faceted states**

Base landing: indexable. Any active `q/category/type/platform/page>1` state: `robots: { index: false, follow: true }` and canonical to locale base Discover route.

- [ ] **Step 6: Run targeted E2E**

```bash
pnpm exec playwright test e2e/discover-v3.spec.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/discover src/components/discover e2e/discover-v3.spec.ts
git commit -m "feat(discover): rebuild resource hub landing"
```

---

### Task 6: Rebuild Discover detail and locale SEO

**Files:**
- Modify: `src/app/discover/[slug]/page.tsx`
- Create: `src/components/discover/discover-resource-header.tsx`
- Create: `src/components/discover/discover-related.tsx`
- Modify: `src/lib/seo.ts` only if a reusable Article helper is justified
- Test: `src/__tests__/seo/discover-v3-seo.test.ts`
- Extend: `e2e/discover-v3.spec.ts`

- [ ] **Step 1: Write failing tests for EN completeness and metadata**

English incomplete record must not render/index. English complete record must use EN title/description/body and hreflang pair.

- [ ] **Step 2: Select locale-specific content explicitly**

Do not display Persian body inside English detail route. Use a helper that returns localized fields only after completeness checks.

- [ ] **Step 3: Apply profile information hierarchy**

Implement editorial summary, practical body, official link, optional Telegram/Instagram, related Discover items, disclosure and contextual ASDEV CTA.

- [ ] **Step 4: Add structured data conservatively**

Keep BreadcrumbList. Add Article only if visible guide content/date/author facts satisfy the helper contract; do not emit SoftwareApplication by default.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm vitest run src/__tests__/seo/discover-v3-seo.test.ts
pnpm exec playwright test e2e/discover-v3.spec.ts
git add src/app/discover src/components/discover src/lib/seo.ts src/__tests__/seo/discover-v3-seo.test.ts e2e/discover-v3.spec.ts
git commit -m "feat(discover): rebuild localized resource profiles"
```

---

### Task 7: Integrate sitemap, analytics and accessibility

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/discover.ts` or analytics helper location
- Modify: `docs/EVENT_TAXONOMY.md`
- Modify: `e2e/a11y.spec.ts`
- Test: `src/__tests__/seo/sitemap-discover-v3.test.ts`

- [ ] **Step 1: Add sitemap tests**

Assert Persian published items are included; unpublished are excluded; EN item is included only when translation-complete; no filter URLs appear.

- [ ] **Step 2: Update sitemap query and dates**

Use real `updatedAt`/`publishedAt` values, not build time.

- [ ] **Step 3: Normalize event taxonomy**

Document and emit the minimum events from the spec. Do not duplicate legacy click events for the same action.

- [ ] **Step 4: Add Discover landing/detail to Axe coverage**

Cover FA and EN representative pages when fixtures permit.

- [ ] **Step 5: Run targeted checks and commit**

```bash
pnpm vitest run src/__tests__/seo/sitemap-discover-v3.test.ts
pnpm run test:e2e:a11y
git add src/app/sitemap.ts src/lib docs/EVENT_TAXONOMY.md e2e/a11y.spec.ts src/__tests__/seo/sitemap-discover-v3.test.ts
git commit -m "test(discover): enforce seo analytics and a11y contracts"
```

---

### Task 8: Final Discover V3 verification

**Files:**
- Create: `docs/reports/live-verification/<timestamp>-discover-v3.md`
- Update: `docs/ROADMAP_TASKS.md`

- [ ] **Step 1: Run full local quality gate**

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

- [ ] **Step 2: Run desktop/mobile Discover E2E**

Verify 375 and 1440 viewport journeys, FA and EN, search/filter/detail/external link.

- [ ] **Step 3: Review migration safety**

Back up the production SQLite database through the existing deployment process before migration. Confirm rollback can restore the pre-migration database and release.

- [ ] **Step 4: Deploy only through existing release workflow**

Do not hand-edit production files.

- [ ] **Step 5: Record live evidence**

Record exact SHA, migration applied, endpoint status, canonical/hreflang sample, one FA item, one EN-complete item, one admin create/edit/publish cycle, and rollback reference.

- [ ] **Step 6: Mark roadmap tasks complete only from evidence**

A skipped or timed-out gate remains open.
