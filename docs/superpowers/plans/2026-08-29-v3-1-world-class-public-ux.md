# V3.1 World-Class Public UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the public site into a globally competitive, premium, personal and evidence-led portfolio while preserving V3's production-safe architecture.

**Architecture:** Keep the current Next.js App Router, Prisma/Admin/release architecture and semantic tokens. Refactor the public presentation layer in focused components, move Discover filter state back to server-backed URL state, add screenshot-led project presentation, and introduce a hard visual-evidence gate before merge. Public content stays server-rendered wherever possible; client components are limited to navigation, URL-backed filtering and real interactions.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, existing shadcn/Radix primitives, Lucide, Next Image, Prisma/SQLite, Vitest/Testing Library, Playwright, Axe, Lighthouse.

**Spec:** `docs/superpowers/specs/2026-08-29-v3-1-world-class-public-ux-design.md`

## Global Constraints

- V3 production is frozen while V3.1 is implemented.
- No fake clients, partner logos, metrics, testimonials, awards, contact data or credentials.
- No AI-generated face may ship as Alireza Safaei's identity.
- Final RC requires an owner-approved real portrait and real project screenshots.
- Preserve existing Admin, Prisma persistence, auth/security and governed deploy architecture unless a proven defect requires a scoped change.
- Use existing local fonts and dependency set where possible; no external font dependency is required.
- WCAG 2.2 AA remains mandatory.
- Respect `prefers-reduced-motion`.
- Visual merge bar: no rubric category below 4/5, average >= 4.4/5, screenshot matrix complete, owner visual approval.
- Automated CI/Lighthouse/Axe passing is necessary but never substitutes for visual approval.

---

## File Structure

### Public visual foundation

- Modify `src/app/globals.css` — V3.1 spacing, color application, typography and motion primitives.
- Create `src/components/public/section-heading.tsx` — reusable editorial section heading.
- Create `src/components/public/visual-frame.tsx` — controlled media frame for portrait/project visuals.
- Create `src/components/public/project-showcase.tsx` — screenshot-led project module.
- Create `src/components/public/proof-strip.tsx` — real credibility/product proof only.

### Global shell

- Modify `src/components/layout/header.tsx` — premium compact navigation and collaboration CTA.
- Modify `src/components/layout/footer.tsx` — intentional dark closing surface.
- Modify `src/components/layout/bottom-nav.tsx` — remove from general portfolio shell or narrow to evidence-backed contexts.
- Modify `src/app/layout.tsx` — remove mobile bottom padding if bottom nav is retired.

### Homepage

- Modify `src/components/sections/homepage-v3.tsx` — compose the new signature homepage.
- Modify `src/lib/home-content.ts` — concise bilingual content contract plus project media metadata.
- Modify `src/app/page.tsx` only if metadata/composition import naming changes.

### Discover

- Modify `src/app/discover/page.tsx` — server-backed query/result composition and pagination metadata.
- Replace/refactor `src/components/discover/discover-grid.tsx` — presentation only, no private local copy of server filter truth.
- Create `src/components/discover/discover-controls.tsx` — URL-backed client controls.
- Create `src/components/discover/discover-pagination.tsx` — accessible shareable pagination.
- Reuse `src/lib/discover-query.ts` — canonical parser/where/order source.

### Blog

- Modify `src/app/blog/page.tsx` — publication-grade landing.
- Modify `src/app/blog/[slug]/page.tsx` — article chrome and metadata presentation.
- Modify `src/lib/blog-markdown.tsx` and/or public CSS only where needed for reading/code/table presentation.

### Assets

- Add approved files under `public/images/portfolio/` only when source/ownership is known.

### Tests/evidence

- Create `src/__tests__/components/public-shell-v31.test.tsx`.
- Modify `src/__tests__/components/homepage-v3.test.tsx`.
- Create `src/__tests__/discover/discover-controls-v31.test.tsx`.
- Create `src/__tests__/blog/blog-presentation-v31.test.tsx`.
- Create `e2e/public-v31-visual.spec.ts` for deterministic screenshot capture and key interaction assertions.
- Create `docs/reports/v3-1-visual-review.md` only after real implementation screenshots exist.

---

### Task 1: Establish the V3.1 Visual Foundation

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/public/section-heading.tsx`
- Create: `src/components/public/visual-frame.tsx`
- Test: `src/__tests__/components/public-shell-v31.test.tsx`

**Interfaces:**
- Produces: `SectionHeading`, `VisualFrame`, V3.1 CSS variables/classes used by later homepage/Discover/Blog tasks.
- Consumes: existing semantic color tokens and local font declarations.

- [ ] **Step 1: Write the failing visual-foundation tests**

Create `src/__tests__/components/public-shell-v31.test.tsx` with concrete component behavior:

```tsx
import { render, screen } from '@testing-library/react'
import { SectionHeading } from '@/components/public/section-heading'
import { VisualFrame } from '@/components/public/visual-frame'

describe('V3.1 public visual primitives', () => {
  it('renders one labelled editorial section heading', () => {
    render(<SectionHeading eyebrow="Selected work" title="Systems I have shipped" description="Real product proof." />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Systems I have shipped' })).toBeInTheDocument()
    expect(screen.getByText('Real product proof.')).toBeInTheDocument()
  })

  it('reserves media dimensions and exposes semantic content', () => {
    render(<VisualFrame ariaLabel="PersianToolbox product preview"><span>preview</span></VisualFrame>)
    expect(screen.getByLabelText('PersianToolbox product preview')).toHaveClass('public-visual-frame')
    expect(screen.getByText('preview')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx
```

Expected: FAIL because the new components do not exist.

- [ ] **Step 3: Implement focused visual primitives**

Create `SectionHeading` with `eyebrow`, `title`, `description`, optional alignment; keep it server-compatible.

Create `VisualFrame` as a plain semantic wrapper with a stable aspect-ratio hook; do not add client state.

In `globals.css`:

- introduce one canonical public section rhythm (for example `--public-section-y` and `--public-section-y-compact`);
- introduce `--public-ink`, `--public-cobalt`, `--public-surface`, `--public-surface-dark` mapped through accessible semantic tokens;
- add `.public-section`, `.public-section-compact`, `.public-visual-frame`, `.public-kicker`, `.public-display`;
- remove the need to stack `.section-block` plus inner `py-12/py-16` in redesigned sections;
- do not delete legacy classes until their callers are migrated.

- [ ] **Step 4: Run the targeted test and verify GREEN**

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Run lint/type-check for changed files**

```bash
pnpm run type-check
pnpm run lint
```

Expected: PASS except documented pre-existing warnings.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/public src/__tests__/components/public-shell-v31.test.tsx
git commit -m "feat(ui): establish V3.1 visual foundation"
```

---

### Task 2: Redesign the Global Header, Mobile Navigation and Footer

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/layout/bottom-nav.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/__tests__/components/public-shell-v31.test.tsx`

**Interfaces:**
- Produces: unified public shell used by Home/Discover/Blog.
- Consumes: current i18n context, locale routing, brand URLs, existing `Button` primitive.

- [ ] **Step 1: Add failing shell behavior tests**

Extend `public-shell-v31.test.tsx` by mocking i18n/pathname as existing component tests do and assert:

```tsx
expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument()
expect(screen.getByRole('link', { name: /start collaboration|شروع همکاری/i })).toBeInTheDocument()
expect(screen.getAllByRole('link').filter((link) => link.closest('[data-primary-nav]'))).toHaveLength(5)
```

Also assert that the global mobile bottom-tab navigation is no longer rendered by the root layout path if the redesign decision is removal.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx
```

Expected: FAIL against current header/footer/bottom-nav behavior.

- [ ] **Step 3: Implement the header**

Required structure:

- compact identity mark/name;
- maximum five primary navigation items: Home, Services, Work/Case Studies, Discover, Insights;
- language switch;
- one visually dominant collaboration CTA;
- mobile sheet with the same hierarchy;
- subtle scrolled state; no heavy glassmorphism.

Keep active-route semantics and keyboard behavior.

- [ ] **Step 4: Retire generic fixed bottom navigation**

Remove `BottomNav` from the global portfolio layout unless a targeted evidence-backed exception is implemented. If fully retired:

- remove `<BottomNav />` from `src/app/layout.tsx`;
- remove `pb-20 md:pb-0` compensation from `<main>`;
- leave the component file only if another route imports it; otherwise delete it in this task.

- [ ] **Step 5: Implement the footer as a designed closing surface**

Use a dark high-contrast surface with:

- one collaboration question;
- one primary CTA;
- real email/contact path from `brand`;
- compact nav;
- social links;
- no `shine-effect` loop;
- no fake phone/client data.

- [ ] **Step 6: Verify tests and accessibility semantics**

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx
pnpm run type-check
pnpm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/app/layout.tsx src/__tests__/components/public-shell-v31.test.tsx
git commit -m "feat(ui): redesign public navigation and footer"
```

---

### Task 3: Build the Signature Personal Hero

**Files:**
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/lib/home-content.ts`
- Modify: `src/__tests__/components/homepage-v3.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading`, `VisualFrame`, locale helpers, analytics.
- Produces: the primary personal-brand first viewport.

- [ ] **Step 1: Rewrite homepage hero tests first**

The tests must assert the real structure, not aesthetics only:

```tsx
const hero = screen.getByRole('region', { name: 'معرفی علیرضا صفایی' })
expect(within(hero).getByRole('heading', { level: 1, name: 'مهندس نرم‌افزار' })).toBeInTheDocument()
const actions = within(hero).getByRole('group', { name: 'اقدام‌های اصلی' })
expect(within(actions).getAllByRole('link')).toHaveLength(2)
expect(within(actions).getByRole('link', { name: 'شروع همکاری' })).toBeInTheDocument()
expect(within(actions).getByRole('link', { name: 'مشاهده پروژه‌ها' })).toBeInTheDocument()
expect(within(hero).getByTestId('owner-portrait-frame')).toBeInTheDocument()
```

Also assert there is no empty `aria-hidden` portrait placeholder serving as the only visual.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/homepage-v3.test.tsx
```

Expected: FAIL because current hero still uses the empty neutral placeholder.

- [ ] **Step 3: Implement the hero composition**

Required desktop structure:

```text
Hero
├── copy column (~55–58%)
│   ├── name eyebrow
│   ├── large role H1
│   ├── concise value proposition
│   ├── supporting sentence
│   └── exactly two CTAs
└── visual column (~42–45%)
    ├── stable 4:5 portrait frame
    ├── restrained orbit/grid accents
    └── at most one truthful status/evidence annotation
```

On mobile, portrait/visual precedes copy.

Until the real portrait asset is delivered, the frame may use an explicit neutral **development-only visual placeholder**, but the PR remains Draft and cannot pass Task 9/final visual gate.

Do not restore hero intent-router cards, page roadmap widgets, or competing product CTAs.

- [ ] **Step 4: Preserve analytics semantics**

Keep `hero_primary_cta_click` and add/retain `hero_projects_cta_click` for the secondary project CTA. Do not revive obsolete intent-router events.

- [ ] **Step 5: Verify tests**

```bash
pnpm exec vitest run src/__tests__/components/homepage-v3.test.tsx
pnpm run type-check
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/homepage-v3.tsx src/lib/home-content.ts src/__tests__/components/homepage-v3.test.tsx
git commit -m "feat(home): build signature personal hero"
```

---

### Task 4: Replace Generic Homepage Cards with Editorial Services, Project Proof and Personal Trust

**Files:**
- Create: `src/components/public/project-showcase.tsx`
- Create: `src/components/public/proof-strip.tsx`
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/lib/home-content.ts`
- Modify: `src/__tests__/components/homepage-v3.test.tsx`

**Interfaces:**
- Produces: exactly three differentiated services, visual project showcases, real proof strip, About and final handoff to footer CTA.
- Consumes: verified project metadata and approved image paths when available.

- [ ] **Step 1: Add failing structural tests**

Assert:

```tsx
expect(within(screen.getByLabelText('خدمات اصلی')).getAllByRole('article')).toHaveLength(3)
expect(within(screen.getByLabelText('پروژه‌های منتخب')).getAllByRole('article')).toHaveLength(3)
expect(screen.getByLabelText('شواهد واقعی')).toBeInTheDocument()
expect(screen.getByLabelText('درباره علیرضا صفایی')).toBeInTheDocument()
```

For each project article assert one media frame hook exists, not only text.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/homepage-v3.test.tsx
```

- [ ] **Step 3: Implement three editorial service modules**

Keep exactly three services but stop rendering three identical default cards. Use:

- one section intro;
- `01/02/03` index;
- controlled iconography;
- asymmetric/progressive layout;
- concise outcome language;
- one understated detail link each.

- [ ] **Step 4: Implement `ProjectShowcase`**

Define a focused interface:

```ts
export type ProjectShowcaseProps = {
  title: string
  description: string
  role: string
  technologies: string[]
  href: string
  imageSrc?: string
  imageAlt?: string
  tone: 'cobalt' | 'ink' | 'violet'
  outcome?: string
}
```

If `imageSrc` is absent during development, render a labelled neutral project-media frame, not decorative fake product UI. Final RC requires real screenshots in Task 9.

- [ ] **Step 5: Implement proof and About**

`ProofStrip` accepts only facts present in `home-content.ts` that are traceable to live owned products or documented evidence. Do not create numerical metrics unless their source is recorded.

Expand About into first-person working philosophy with a real-person tone; keep it concise.

- [ ] **Step 6: Remove duplicate spacing**

As each homepage section moves to `.public-section`/`.public-section-compact`, remove nested full `py-12/py-16` wrappers that duplicate vertical section spacing.

- [ ] **Step 7: Run tests/type-check**

```bash
pnpm exec vitest run src/__tests__/components/homepage-v3.test.tsx src/__tests__/components/public-shell-v31.test.tsx
pnpm run type-check
pnpm run lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/public src/components/sections/homepage-v3.tsx src/lib/home-content.ts src/__tests__/components/homepage-v3.test.tsx
git commit -m "feat(home): add editorial services and visual project proof"
```

---

### Task 5: Restore Discover's URL-Backed Server Query Contract

**Files:**
- Create: `src/components/discover/discover-controls.tsx`
- Create: `src/components/discover/discover-pagination.tsx`
- Modify: `src/components/discover/discover-grid.tsx`
- Modify: `src/app/discover/page.tsx`
- Reuse/modify only if needed: `src/lib/discover-query.ts`
- Create: `src/__tests__/discover/discover-controls-v31.test.tsx`
- Modify: `src/__tests__/discover/discover-query.test.ts`

**Interfaces:**
- `DiscoverControls` consumes `DiscoverPublicQuery`, category/type/platform option arrays and locale; produces URL changes through `router.replace`/`router.push`.
- `DiscoverGrid` consumes already-filtered server result items; it must not maintain its own private filter truth.
- `DiscoverPagination` consumes `currentPage`, `total`, `pageSize`, canonical query and locale.

- [ ] **Step 1: Write failing controls tests**

Mock `next/navigation` and assert that changing search/category writes normalized params:

```tsx
expect(routerReplace).toHaveBeenCalledWith('/discover?q=gemini&sort=featured&page=1')
```

Assert changing a filter resets `page` to 1 and preserves unrelated supported params.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/discover/discover-controls-v31.test.tsx src/__tests__/discover/discover-query.test.ts
```

Expected: FAIL because current grid uses local `useState` filter/search truth.

- [ ] **Step 3: Implement `DiscoverControls`**

Use `useRouter`, `usePathname`, `useSearchParams`, `useTransition`.

Canonical update helper:

```ts
function setParams(updates: Record<string, string | null>) {
  const next = new URLSearchParams(searchParams.toString())
  for (const [key, value] of Object.entries(updates)) {
    if (!value) next.delete(key)
    else next.set(key, value)
  }
  next.set('page', '1')
  router.replace(`${pathname}?${next.toString()}`, { scroll: false })
}
```

Do not store a second authoritative list filter in local state.

- [ ] **Step 4: Refactor `DiscoverGrid` to presentation-only**

Remove `query`, `category`, `filteredItems` local filtering. Render only server-provided `items`.

- [ ] **Step 5: Implement accessible pagination**

Derive `totalPages = Math.ceil(total / DISCOVER_PAGE_SIZE)` and create previous/next plus compact page links preserving supported search params.

Use semantic `<nav aria-label>` and locale-aware labels.

- [ ] **Step 6: Wire page server state**

`src/app/discover/page.tsx` already parses `searchParams` and queries Prisma. Pass the parsed query and taxonomy options to `DiscoverControls`, pass records to `DiscoverGrid`, and render `DiscoverPagination` after results.

- [ ] **Step 7: Verify tests**

```bash
pnpm exec vitest run src/__tests__/discover/discover-controls-v31.test.tsx src/__tests__/discover/discover-query.test.ts src/__tests__/discover/discover-v3-contract.test.ts
pnpm run type-check
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/discover src/app/discover/page.tsx src/lib/discover-query.ts src/__tests__/discover
git commit -m "fix(discover): restore URL-backed server discovery state"
```

---

### Task 6: Redesign Discover as a Premium Curated Resource Library

**Files:**
- Modify: `src/app/discover/page.tsx`
- Modify: `src/components/discover/discover-grid.tsx`
- Modify/Create focused Discover presentation components only as needed
- Modify: relevant Discover E2E coverage

**Interfaces:**
- Consumes: Task 5's canonical server query/controls/pagination.
- Produces: search-first visual hierarchy with featured distinction and strong resource media.

- [ ] **Step 1: Add failing presentation assertions**

Add component/E2E assertions for:

- one prominent search control before results;
- active filter state reflected in URL;
- featured resource semantics only when `featured === true`;
- pagination link state;
- one clear internal resource CTA per card.

- [ ] **Step 2: Implement search-first hierarchy**

Target order:

```text
compact context label
large search-first heading
search input
compact filters/sort
optional bounded featured resources
results count
result grid
pagination
trust/disclosure block
```

Remove decorative heading volume that pushes search below the useful first interaction.

- [ ] **Step 3: Improve result cards**

Use consistent media ratio, stronger title hierarchy and compact type/category/platform signals. Avoid a chip cloud and avoid multiple equal-weight external actions.

Use real database `imageUrl` where safe; keep existing controlled image policy.

- [ ] **Step 4: Validate mobile interaction**

At 390px ensure search remains immediately reachable and filters wrap/scroll without horizontal page overflow.

- [ ] **Step 5: Run targeted tests**

```bash
pnpm exec vitest run src/__tests__/discover
pnpm run type-check
pnpm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/app/discover src/components/discover src/__tests__/discover e2e
git commit -m "feat(discover): redesign curated resource experience"
```

---

### Task 7: Upgrade Blog/Insights to Publication-Grade Presentation

**Files:**
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/lib/blog-markdown.tsx` only where needed
- Create: `src/__tests__/blog/blog-presentation-v31.test.tsx`

**Interfaces:**
- Consumes: existing `BlogPost`, translation completeness, `BlogMarkdown`, SEO schema.
- Produces: editorial landing and article shell without changing persistence contracts.

- [ ] **Step 1: Write failing Blog presentation tests**

Test the pure/renderable pieces by extracting small display components if needed. Assert:

- featured post has distinct semantic treatment when present;
- landing still renders only published and locale-complete items;
- article has one H1;
- metadata/category is subordinate;
- content wrapper exposes a stable `article-prose` class.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/blog/blog-presentation-v31.test.tsx
```

- [ ] **Step 3: Refactor Blog landing**

Replace the compressed one-line JSX with readable server-rendered structure.

If a real featured post exists, show one larger lead story; otherwise render the normal editorial list without fake featured content.

- [ ] **Step 4: Refactor article shell**

Add:

- quiet category/date/read-time row;
- strong title/excerpt hierarchy;
- bounded reading measure (~60–75 Latin chars, comfortable Persian measure);
- article author identity;
- related/back-to-blog navigation.

Do not enable raw HTML.

- [ ] **Step 5: Style Markdown for reading**

Use CSS/semantic classes for heading rhythm, code blocks, blockquotes, links and horizontally operable tables on narrow screens.

- [ ] **Step 6: Verify**

```bash
pnpm exec vitest run src/__tests__/blog
pnpm run type-check
pnpm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/app/blog src/lib/blog-markdown.tsx src/__tests__/blog
git commit -m "feat(blog): add publication-grade public presentation"
```

---

### Task 8: Add Controlled Motion, Focus Polish and Responsive Authorship

**Files:**
- Modify: `src/app/globals.css`
- Modify: redesigned public components only where interaction classes are needed
- Modify: `e2e/a11y.spec.ts` if required for new routes/states
- Create/Modify: `e2e/public-v31-visual.spec.ts`

**Interfaces:**
- Consumes: finished Home/Discover/Blog layouts.
- Produces: consistent hover/focus/reduced-motion/responsive behavior.

- [ ] **Step 1: Add E2E assertions before motion polish**

In `public-v31-visual.spec.ts`, create viewport cases for 390 and 1440 and assert:

```ts
await expect(page.locator('body')).not.toHaveCSS('overflow-x', 'scroll')
await page.keyboard.press('Tab')
await expect(page.locator(':focus-visible')).toBeVisible()
```

Add reduced-motion context:

```ts
const context = await browser.newContext({ reducedMotion: 'reduce' })
```

and verify essential content is immediately available without animation dependencies.

- [ ] **Step 2: Verify current test fails where expected**

```bash
pnpm exec playwright test e2e/public-v31-visual.spec.ts --project=chromium
```

- [ ] **Step 3: Implement controlled interaction polish**

Allowed motions:

- 150–320ms color/opacity/transform transitions;
- 2–4px hover lift for project media where appropriate;
- subtle image scale <= ~1.02;
- header state transition;
- restrained accent-line movement.

Under `prefers-reduced-motion: reduce`, disable transforms/animated decoration that are not essential.

- [ ] **Step 4: Tune all required widths manually and in E2E**

Validate at:

`360, 390, 768, 1024, 1280, 1440, 1728`.

Correct composition rather than only hiding overflow.

- [ ] **Step 5: Run a11y and E2E**

```bash
pnpm run test:e2e:a11y
pnpm exec playwright test e2e/public-v31-visual.spec.ts --project=chromium
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components e2e
git commit -m "feat(ui): polish responsive motion and accessibility"
```

---

### Task 9: Finalize Real Visual Assets and Remove Every Primary Placeholder

**Files:**
- Add: `public/images/portfolio/alireza-safaei-portrait.*` from owner-approved real source
- Add: `public/images/portfolio/persiantoolbox-*`
- Add: `public/images/portfolio/novax-*`
- Add: `public/images/portfolio/audit-systems-*`
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/lib/home-content.ts`
- Create: `src/__tests__/assets/public-v31-assets.test.ts`

**Interfaces:**
- Produces: final real media contract required by visual acceptance.

- [ ] **Step 1: Inspect and document asset provenance before commit**

For each file record source/owner/license in the PR body or `docs/reports/v3-1-visual-review.md`. Do not commit confidential or unlicensed files.

- [ ] **Step 2: Add an asset contract test**

Use Node filesystem checks:

```ts
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

expect(existsSync(resolve('public/images/portfolio/alireza-safaei-portrait.webp'))).toBe(true)
expect(existsSync(resolve('public/images/portfolio/persiantoolbox-showcase.webp'))).toBe(true)
expect(existsSync(resolve('public/images/portfolio/novax-showcase.webp'))).toBe(true)
expect(existsSync(resolve('public/images/portfolio/audit-systems-showcase.webp'))).toBe(true)
```

Use the actual committed extensions/paths consistently if source format differs.

- [ ] **Step 3: Verify RED before assets are wired**

```bash
pnpm exec vitest run src/__tests__/assets/public-v31-assets.test.ts
```

- [ ] **Step 4: Wire `next/image` with explicit dimensions/sizes**

Hero portrait must have truthful alt text identifying Alireza Safaei. Product screenshots need descriptive alt text when informative.

- [ ] **Step 5: Verify no primary placeholder remains**

Search the redesigned public components for development placeholder markers/classes and remove them.

- [ ] **Step 6: Run tests**

```bash
pnpm exec vitest run src/__tests__/assets/public-v31-assets.test.ts src/__tests__/components/homepage-v3.test.tsx
pnpm run type-check
```

- [ ] **Step 7: Commit**

```bash
git add public/images/portfolio src/components/sections/homepage-v3.tsx src/lib/home-content.ts src/__tests__/assets
git commit -m "feat(brand): add approved portfolio visual assets"
```

---

### Task 10: Build the Visual Evidence Matrix and Human Review Gate

**Files:**
- Modify/Create: `e2e/public-v31-visual.spec.ts`
- Create: `docs/reports/v3-1-visual-review.md`
- Update: PR #17 body with screenshot/evidence links when artifacts exist

**Interfaces:**
- Produces: deterministic screenshots and review rubric used before ready-for-review.

- [ ] **Step 1: Capture required screenshots from the actual app**

Use Playwright viewport/device configuration, not browser zoom.

Required minimum files/artifacts:

```text
home-fa-1440.png
home-fa-390.png
home-en-1440.png
home-en-390.png
discover-fa-1440.png
discover-fa-390.png
discover-detail.png
blog-landing.png
blog-article.png (when a real article exists)
focus-state.png
```

- [ ] **Step 2: Add screenshot assertions to E2E only where stable**

Prefer screenshot evidence for human review; use pixel-threshold regression only for deterministic areas to avoid brittle CI.

- [ ] **Step 3: Write `v3-1-visual-review.md`**

Include a 1–5 table for:

- first impression;
- identity/memorability;
- typography;
- composition;
- spacing/density;
- project proof;
- interaction polish;
- mobile;
- FA/EN parity;
- consistency.

Do not mark PASS unless every category >= 4 and average >= 4.4.

- [ ] **Step 4: Compare explicitly against V3 baseline**

Record what improved in first viewport, content density, project visual proof, navigation coherence and mobile composition.

- [ ] **Step 5: Human visual approval**

Keep PR #17 Draft until the owner reviews the actual screenshots/rendered staging UI. Automated PASS is not authority to mark ready.

- [ ] **Step 6: Commit review evidence**

```bash
git add e2e/public-v31-visual.spec.ts docs/reports/v3-1-visual-review.md
git commit -m "test(ui): add V3.1 visual acceptance evidence"
```

---

### Task 11: Full Verification, Hosted CI and Governed Staging

**Files:**
- No new feature files unless a verified defect is discovered.
- Update: PR #17 evidence/body only.

**Interfaces:**
- Consumes: completed implementation and visual approval.
- Produces: release candidate evidence; does not authorize production by itself.

- [ ] **Step 1: Run complete local verification**

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Expected: all required gates PASS; no timeout/unexecuted test counts as pass.

- [ ] **Step 2: Push and pin exact SHA**

Record the exact PR head SHA. Do not describe a moving branch as the RC.

- [ ] **Step 3: Verify hosted gates on exact SHA**

Required hosted checks remain the repository's governed set (CI, CI Router, Security Audit, CodeQL, E2E Smoke, Lighthouse where configured).

- [ ] **Step 4: Deploy to official staging only after existing staging approval gate**

Use the governed workflow; do not manually bypass it.

- [ ] **Step 5: Re-capture/verify live staging visual evidence**

Confirm the screenshot-approved composition survives the real deployed environment, local fonts, images, RTL/LTR and responsive behavior.

- [ ] **Step 6: Two-pass live verification**

Require two consecutive browser verification passes plus `/api/ready`, Home, Discover, Blog and critical public navigation.

- [ ] **Step 7: Only after owner visual approval mark PR ready for review**

Do not merge from Draft solely because CI is green.

- [ ] **Step 8: Production remains separately governed**

Follow the existing backup/migration/deploy/rollback approval process. No V3.1 plan step weakens those controls.

---

## Plan Self-Review

### Spec coverage

- Personal hero + real portrait: Tasks 3, 9.
- Premium typography/spacing/color: Task 1.
- Unified header/footer/mobile shell: Task 2.
- Three services + screenshot-led work + proof + About: Task 4.
- Discover URL-backed/server-backed behavior + pagination: Task 5.
- Discover premium presentation: Task 6.
- Blog publication presentation: Task 7.
- Motion/accessibility/responsive: Task 8.
- Real asset provenance: Task 9.
- Hard screenshot/human visual gate: Task 10.
- CI/staging/release safety: Task 11.

### Placeholder scan

No `TBD`, generic "implement later", fake content or invented metrics are permitted. Missing real media is treated as an explicit Draft-state dependency in Task 9, not as release-ready content.

### Type/interface consistency

- `SectionHeading` and `VisualFrame` are created in Task 1 and consumed after Task 1.
- `ProjectShowcase` and `ProofStrip` are created in Task 4.
- `DiscoverControls` and `DiscoverPagination` are created in Task 5 and consumed in Task 6.
- Existing `DiscoverPublicQuery` remains canonical from `src/lib/discover-query.ts`.

## Execution Recommendation

Use **superpowers:subagent-driven-development** task-by-task. Require review after every task, with an additional visual checkpoint after Tasks 4, 6, 7 and 9. Do not batch the full redesign into one giant commit.