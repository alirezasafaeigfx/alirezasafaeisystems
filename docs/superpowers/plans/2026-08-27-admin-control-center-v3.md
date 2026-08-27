# Admin Control Center V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the monolithic tab-based Admin with a secure route-based ASDEV Control Center that loads only the active module and adds production-grade Discover and Blog content management.

**Architecture:** Preserve the existing proxy/session and secure mutation Route Handlers. Introduce a route-group Admin shell, server-render initial module data directly from Prisma, keep focused client components for filters/editors/dialogs, and delete the old dashboard only after parity tests pass.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma/SQLite, Zod, Tailwind, existing shadcn-style primitives, Playwright, Vitest, Axe.

**Spec:** `docs/superpowers/specs/2026-08-27-admin-control-center-v3-design.md`

## Global Constraints

- `/admin/login` remains public; all control routes remain authenticated.
- Admin pages remain `noindex,nofollow` and `no-store`.
- Existing `enforceAdminAccess`, rate limiting, structured logging and session cookie contract stay authoritative unless a verified security flaw requires a shared fix.
- Do not fetch unrelated module data.
- Do not add a global client state store or heavyweight chart package.
- Target WCAG 2.2 AA and practical 375/768/1024/1440 layouts.

---

### Task 1: Establish route-group Admin shell without breaking current dashboard

**Files:**
- Create: `src/app/admin/(control)/layout.tsx`
- Move/replace: `src/app/admin/page.tsx` into `src/app/admin/(control)/page.tsx` while preserving `/admin`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/admin-sidebar.tsx`
- Create: `src/components/admin/admin-mobile-nav.tsx`
- Create: `src/components/admin/admin-page-header.tsx`
- Test: `e2e/admin-v3.spec.ts`

**Interfaces:**
- Produces common route shell and navigation consumed by all later Admin modules.

- [ ] **Step 1: Write failing E2E navigation test**

Unauthenticated access to `/admin`, `/admin/leads` and `/admin/discover` must redirect to `/admin/login`.

Authenticated fixture/session should see navigation links with hrefs:

```text
/admin
/admin/leads
/admin/messages
/admin/projects
/admin/discover
/admin/blog
/admin/analytics
```

- [ ] **Step 2: Create server layout metadata**

Export metadata with:

```ts
robots: { index: false, follow: false }
```

Do not duplicate auth logic in the layout if proxy already guarantees the route boundary.

- [ ] **Step 3: Build responsive shell**

Desktop sidebar + mobile menu, current route indication, `View site`, logout control. Use semantic `nav` and visible focus states.

- [ ] **Step 4: Keep old dashboard reachable only as temporary internal implementation if needed**

Do not delete `src/components/admin/admin-dashboard.tsx` yet.

- [ ] **Step 5: Run targeted E2E and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts
git add src/app/admin src/components/admin e2e/admin-v3.spec.ts
git commit -m "feat(admin): add route based control center shell"
```

---

### Task 2: Implement server-first Overview

**Files:**
- Modify: `src/app/admin/(control)/page.tsx`
- Create: `src/components/admin/admin-stat-card.tsx`
- Create: `src/lib/admin/overview.ts`
- Test: `src/__tests__/admin/overview.test.ts`

**Interfaces:**
- Produces `getAdminOverview()` returning bounded counts and recent content updates.

- [ ] **Step 1: Write failing query-helper test**

Expected shape:

```ts
type AdminOverview = {
  leads: { total: number; new: number; qualified: number }
  messages: { total: number }
  discover: { published: number; draft: number }
  blog: { published: number; draft: number }
}
```

- [ ] **Step 2: Implement direct Prisma aggregation**

Use `count()` calls in parallel. Do not call internal HTTP APIs from the Server Component.

- [ ] **Step 3: Render actionable overview**

Show counts and quick links only. Do not invent unread-message semantics or meaningless charts.

- [ ] **Step 4: Run test and commit**

```bash
pnpm vitest run src/__tests__/admin/overview.test.ts
git add src/app/admin src/components/admin src/lib/admin src/__tests__/admin/overview.test.ts
git commit -m "feat(admin): add server rendered overview"
```

---

### Task 3: Extract Leads and Messages into independent routes

**Files:**
- Create: `src/app/admin/(control)/leads/page.tsx`
- Create: `src/app/admin/(control)/messages/page.tsx`
- Create: `src/components/admin/leads/leads-table.tsx`
- Create: `src/components/admin/leads/lead-filters.tsx`
- Create: `src/components/admin/leads/lead-detail-dialog.tsx`
- Create: `src/components/admin/messages/messages-list.tsx`
- Create: `src/components/admin/messages/message-detail-dialog.tsx`
- Create: `src/lib/admin/leads.ts`
- Create: `src/lib/admin/messages.ts`
- Extend: `e2e/admin-v3.spec.ts`

- [ ] **Step 1: Write failing E2E flow tests**

Cover lead search/status update/detail, message inspection/delete, browser refresh retaining route.

- [ ] **Step 2: Move initial reads server-side**

Each route queries only its own model. If pagination threshold is implemented, validate `page/q/status` from search params.

- [ ] **Step 3: Reuse existing secure mutation endpoints**

Keep `/api/admin/leads` and `/api/admin/messages` for mutations unless targeted tests prove a shared change is needed.

- [ ] **Step 4: Build responsive list/table behavior**

Desktop semantic table; narrow view uses labeled stacked rows/cards instead of forced horizontal overflow where practical.

- [ ] **Step 5: Run tests and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts
git add src/app/admin src/components/admin/leads src/components/admin/messages src/lib/admin e2e/admin-v3.spec.ts
git commit -m "feat(admin): split leads and messages modules"
```

---

### Task 4: Extract Projects module and preserve CRUD parity

**Files:**
- Create: `src/app/admin/(control)/projects/page.tsx`
- Refactor: `src/components/admin/project-manager.tsx` into `src/components/admin/projects/project-list.tsx` and `project-editor.tsx`
- Preserve/modify: `src/app/api/admin/projects/route.ts` only as required
- Extend: `e2e/admin-v3.spec.ts`

- [ ] **Step 1: Write parity test**

Create/edit/publish or equivalent existing Project lifecycle must behave exactly as before.

- [ ] **Step 2: Split list and editor responsibilities**

The route owns initial data. Editor owns form state and mutations. Library/list owns filtering, status and edit selection.

- [ ] **Step 3: Preserve public contract**

Do not silently rename or reinterpret `contentType`, `featured`, `published` or `order`.

- [ ] **Step 4: Run parity test and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts --grep "Projects"
git add src/app/admin src/components/admin/projects src/app/api/admin/projects e2e/admin-v3.spec.ts
git commit -m "refactor(admin): isolate projects management"
```

---

### Task 5: Implement Discover V3 Admin module

**Files:**
- Create: `src/app/admin/(control)/discover/page.tsx`
- Refactor/replace: `src/components/admin/discover-manager.tsx`
- Create: `src/components/admin/discover/discover-library.tsx`
- Create: `src/components/admin/discover/discover-editor.tsx`
- Create: `src/components/admin/discover/discover-publish-panel.tsx`
- Create: `src/components/admin/confirm-action-dialog.tsx`
- Extend: `e2e/admin-v3.spec.ts`

**Interfaces:**
- Consumes Discover V3 API/data contract from `2026-08-27-discover-hub-v3.md`.

- [ ] **Step 1: Write failing authenticated CRUD E2E**

Create a draft with FA fields, add EN fields, set taxonomy/media, publish, preview, unpublish, edit and delete.

- [ ] **Step 2: Build library surface**

Search/filter by published state/category/type. Show translation completeness and featured state without color-only meaning.

- [ ] **Step 3: Build grouped editor**

Sections: Basic, Persian, English, Taxonomy, Media, Links, SEO, Publishing. Preserve form values after failed save.

- [ ] **Step 4: Replace `window.confirm` delete**

Use shared accessible confirmation dialog containing item title and irreversible action copy.

- [ ] **Step 5: Run E2E and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts --grep "Discover"
git add src/app/admin src/components/admin/discover src/components/admin/confirm-action-dialog.tsx e2e/admin-v3.spec.ts
git commit -m "feat(admin): add discover v3 authoring workspace"
```

---

### Task 6: Implement Blog Admin module

**Files:**
- Create: `src/app/admin/(control)/blog/page.tsx`
- Create: `src/components/admin/blog/blog-library.tsx`
- Create: `src/components/admin/blog/blog-editor.tsx`
- Create: `src/components/admin/blog/blog-publish-panel.tsx`
- Create/modify secure Blog API files defined in Blog plan
- Extend: `e2e/admin-v3.spec.ts`

**Interfaces:**
- Consumes Blog V1 data/API contract from `2026-08-27-blog-insights-v1.md`.

- [ ] **Step 1: Write failing Blog CRUD E2E**

Cover create draft, Markdown preview, publish, public preview, edit, unpublish, safe delete.

- [ ] **Step 2: Build library and editor**

Use same form language as Discover where appropriate but do not force a generic CMS abstraction.

- [ ] **Step 3: Add translation/publish status**

Clearly indicate whether EN content is complete enough for EN publication.

- [ ] **Step 4: Run E2E and commit**

```bash
pnpm exec playwright test e2e/admin-v3.spec.ts --grep "Blog"
git add src/app/admin src/components/admin/blog e2e/admin-v3.spec.ts
git commit -m "feat(admin): add blog authoring workspace"
```

---

### Task 7: Add bounded Analytics module

**Files:**
- Create: `src/app/admin/(control)/analytics/page.tsx`
- Create: `src/lib/admin/analytics.ts`
- Create: `src/components/admin/analytics/metric-list.tsx`
- Test: `src/__tests__/admin/analytics.test.ts`

- [ ] **Step 1: Write failing aggregation tests**

Only aggregate events that can be queried accurately from the current schema. Start with exact `name`/`category` counts and lead qualification metrics.

- [ ] **Step 2: Implement bounded queries**

Use time windows with explicit defaults, e.g. 7/30 days, and indexed fields where possible. Avoid parsing arbitrary JSON metadata in application loops for large histories.

- [ ] **Step 3: Render decision-oriented metrics**

No chart dependency. Use compact tables/cards and labels showing period and denominator.

- [ ] **Step 4: Run tests and commit**

```bash
pnpm vitest run src/__tests__/admin/analytics.test.ts
git add src/app/admin src/lib/admin/analytics.ts src/components/admin/analytics src/__tests__/admin/analytics.test.ts
git commit -m "feat(admin): add bounded first party analytics"
```

---

### Task 8: Security and CSRF posture audit

**Files:**
- Inspect/modify: `src/lib/api-security.ts`
- Inspect/modify: `src/lib/admin-auth.ts`
- Test: `src/__tests__/security/admin-mutations.test.ts`
- Create: `docs/security/ADMIN_CONTROL_CENTER_V3_SECURITY.md`

- [ ] **Step 1: Write negative tests before shared security changes**

Cover no session, invalid session, wrong content type, malformed Origin/Host case if the project security policy requires origin enforcement, and rate-limit response.

- [ ] **Step 2: Audit cookie SameSite/Secure/HttpOnly and mutation origin protections**

Document the actual existing posture. Do not invent a vulnerability.

- [ ] **Step 3: If a real shared gap exists, fix it once in the common security layer**

Do not add inconsistent endpoint-local CSRF logic.

- [ ] **Step 4: Run tests and commit**

```bash
pnpm vitest run src/__tests__/security/admin-mutations.test.ts
git add src/lib/api-security.ts src/lib/admin-auth.ts src/__tests__/security/admin-mutations.test.ts docs/security/ADMIN_CONTROL_CENTER_V3_SECURITY.md
git commit -m "security(admin): verify control center mutation boundary"
```

---

### Task 9: Remove legacy dashboard only after parity

**Files:**
- Delete: `src/components/admin/admin-dashboard.tsx`
- Delete/refactor obsolete manager files only when no imports remain
- Modify: `src/app/admin/(control)/page.tsx` if legacy references remain
- Extend: `e2e/admin-v3.spec.ts`

- [ ] **Step 1: Search for legacy imports**

```bash
git grep -n "AdminDashboard\|discover-manager\|project-manager"
```

Expected before deletion: only intentional migration references.

- [ ] **Step 2: Run full Admin E2E before deletion**

All module parity tests must pass.

- [ ] **Step 3: Delete obsolete monolith and unused code**

Remove only code proven unused by route modules.

- [ ] **Step 4: Run type-check/lint/Admin E2E**

```bash
pnpm run type-check
pnpm run lint
pnpm exec playwright test e2e/admin-v3.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/admin src/app/admin e2e/admin-v3.spec.ts
git commit -m "refactor(admin): retire legacy dashboard monolith"
```

---

### Task 10: Final Control Center verification and production evidence

**Files:**
- Create: `docs/reports/live-verification/<timestamp>-admin-control-center-v3.md`
- Update: `docs/ROADMAP_TASKS.md`

- [ ] **Step 1: Run complete quality gate**

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run scan:secrets
```

- [ ] **Step 2: Run authenticated Admin E2E at desktop and mobile widths**

Verify navigation, Leads, Messages, Projects, Discover, Blog, Analytics and Logout.

- [ ] **Step 3: Verify response policy**

Confirm `/admin*` remains no-store/noindex and unauthenticated requests redirect correctly.

- [ ] **Step 4: Deploy only through established pipeline**

No direct server file replacement.

- [ ] **Step 5: Record live evidence**

Record exact SHA, authenticated module checks, one Discover cycle, one Blog cycle, security response checks and rollback reference.
