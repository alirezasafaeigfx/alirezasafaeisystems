# Admin Control Center V3 — Design Specification

**Date:** 2026-08-27  
**Status:** Approved for implementation  
**Owner:** Product + FE + Backend + Security + QA  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`  
**Primary route:** `/admin`

---

## 1. Product Goal

Replace the current tab-heavy single client dashboard with a production-grade, route-based **ASDEV Control Center** that is easier to maintain, loads only the data needed for the active module, and can safely manage leads, messages, portfolio projects, Discover content, Blog/Insights content and analytics.

The objective is not to introduce a third-party admin framework or a new authentication system. Existing admin session protection, API security helpers, rate limiting and database remain the baseline unless a verified security defect requires change.

---

## 2. Current-State Findings

The current Admin already provides real functionality:

- protected `/admin` route;
- authenticated login/logout flow;
- Leads management and status changes;
- Contact Messages management;
- Projects management;
- Discover CRUD + upload;
- lightweight analytics cards;
- shared API security helpers and rate limiting.

Primary architecture problems:

- `admin-dashboard.tsx` owns multiple unrelated domains in one large client component;
- Leads and Messages are fetched together when the dashboard initializes, even if only one module is used;
- active module state is local tab state instead of route state;
- URL/history/back/refresh do not represent the active module;
- table/filter/editor logic is tightly coupled to dashboard presentation;
- Discover manager is itself a large all-in-one component;
- there is no first-class Blog/Insights manager;
- responsive behavior for large tables and editor surfaces is limited;
- analytics are descriptive counters rather than a deliberately scoped operational overview.

---

## 3. Architecture Decision

Use **route-based module boundaries** under the existing Next.js App Router.

Target route tree:

```text
/admin
/admin/leads
/admin/messages
/admin/projects
/admin/discover
/admin/blog
/admin/analytics
/admin/login
```

Recommended App Router structure:

```text
src/app/admin/
  login/
    page.tsx
  (control)/
    layout.tsx
    page.tsx
    leads/page.tsx
    messages/page.tsx
    projects/page.tsx
    discover/page.tsx
    blog/page.tsx
    analytics/page.tsx
```

Route groups must not change public URLs.

The control layout owns:

- admin navigation;
- page shell;
- responsive sidebar/drawer;
- logout action;
- global admin metadata/noindex policy;
- optional breadcrumbs;
- module-level loading/error boundaries.

Each page owns only its domain data and UI.

---

## 4. Server/Client Boundary

Follow a server-first model:

- page/layout components are Server Components by default;
- initial list/count data is read server-side directly from Prisma when practical;
- client components are introduced only for interactive filters, editor forms, dialogs and mutation feedback;
- existing secure Route Handlers remain the mutation boundary during V3 unless a specific action is demonstrably cleaner as a Server Action.

This avoids a risky wholesale mutation/auth rewrite while reducing unnecessary client fetching and bundle size.

Do not migrate every API endpoint to Server Actions merely because the framework supports them.

---

## 5. Admin Shell UX

Desktop target:

```text
┌───────────────────────────────────────────────────────┐
│ ASDEV Control Center                      View site   │
├───────────────┬───────────────────────────────────────┤
│ Overview      │                                       │
│ Leads         │  Page title / actions                 │
│ Messages      │                                       │
│ Projects      │  Active module                        │
│ Discover      │                                       │
│ Blog          │                                       │
│ Analytics     │                                       │
│               │                                       │
│ Logout        │                                       │
└───────────────┴───────────────────────────────────────┘
```

Mobile target:

- compact top bar;
- navigation in accessible drawer/menu;
- no horizontally unusable layout;
- tables degrade into responsive card/list presentation when columns no longer fit;
- primary actions remain reachable without hover.

---

## 6. Module Specifications

### 6.1 Overview `/admin`

Purpose: operational entry point, not a vanity analytics dashboard.

Show only actionable summaries:

- new leads;
- qualified leads;
- unread/recent messages if such state exists; otherwise recent message count without pretending unread semantics;
- published/draft Discover counts;
- published/draft Blog counts;
- recent content updates;
- quick links: New Discover item, New Blog post, View site.

Do not add charts without a decision they help make.

### 6.2 Leads `/admin/leads`

Capabilities:

- list leads;
- search;
- status filter;
- status update;
- detail view;
- preserve UTM/source context;
- pagination if record count warrants it;
- URL-backed filters where practical.

Do not automatically fetch unrelated messages/projects/content.

### 6.3 Messages `/admin/messages`

Capabilities:

- list messages;
- inspect full message;
- safe delete;
- optional search by name/email/subject;
- pagination when needed.

Do not introduce fake read/unread state unless persisted in the data model.

### 6.4 Projects `/admin/projects`

Preserve current CRUD and evolve toward:

- clear draft/published state;
- featured/order controls;
- image/live/GitHub links;
- preview when a public route exists;
- consistent editor structure with Discover/Blog.

### 6.5 Discover `/admin/discover`

Implement the authoring contract defined by:

`docs/superpowers/specs/2026-08-27-discover-hub-v3-design.md`

Separate:

- library/list surface;
- resource editor form;
- preview/publishing controls.

The editor may be route-driven (`/admin/discover/new`, `/admin/discover/[id]`) in a later phase, but V3 may use an in-page/drawer editor if maintainability and accessibility remain strong. Route-driven editor is preferred if implementation complexity is reasonable.

### 6.6 Blog `/admin/blog`

Implement the authoring contract defined by:

`docs/superpowers/specs/2026-08-27-blog-insights-v1-design.md`

Required capabilities:

- create/edit;
- draft/publish;
- featured;
- cover image;
- category/tags;
- FA/EN content;
- SEO overrides;
- preview;
- publish date;
- safe delete.

### 6.7 Analytics `/admin/analytics`

Scope is first-party operational analytics already supported by the project.

Initial useful views:

- lead counts and qualification rate;
- traffic/conversion event counts by meaningful event name;
- Discover landing/item/external-click counts;
- Blog article views and CTA clicks after Blog launches;
- top content by internal event counts only when queryable accurately.

Do not create misleading charts from incomplete data.

---

## 7. Shared Component Architecture

Recommended focused components:

```text
src/components/admin/
  admin-shell.tsx
  admin-sidebar.tsx
  admin-mobile-nav.tsx
  admin-page-header.tsx
  admin-stat-card.tsx
  empty-state.tsx
  status-badge.tsx
  confirm-action-dialog.tsx

  leads/
    leads-table.tsx
    lead-filters.tsx
    lead-detail-dialog.tsx

  messages/
    messages-list.tsx
    message-detail-dialog.tsx

  projects/
    project-list.tsx
    project-editor.tsx

  discover/
    discover-library.tsx
    discover-editor.tsx
    discover-publish-panel.tsx

  blog/
    blog-library.tsx
    blog-editor.tsx
    blog-publish-panel.tsx
```

Do not create abstraction-only components unless at least two real consumers benefit.

---

## 8. Data Fetching Rules

1. A module fetches only its own data.
2. Initial reads happen on the server where possible.
3. Mutation responses return the authoritative updated record.
4. After mutation, update/revalidate only the affected module route.
5. Avoid a global admin client store.
6. No polling unless a real use case exists.
7. Query/page/filter state belongs in URL where it improves refresh/share/history behavior.

For server-rendered Admin reads, direct Prisma queries are preferred over server-to-self HTTP calls.

---

## 9. Authentication & Security

Preserve existing proxy/session model unless the security audit finds a blocker.

Required guarantees:

- every `/admin/*` control route except `/admin/login` remains session-protected;
- all admin metadata is `noindex,nofollow`;
- admin responses remain `no-store`;
- mutation Route Handlers continue to call `enforceAdminAccess`;
- rate limiting remains enabled;
- server-side validation remains authoritative;
- login endpoint keeps brute-force/rate-limit protections already present;
- logout invalidates the session cookie;
- no secret/session token is exposed to client JavaScript.

### 9.1 CSRF posture

Before implementation, audit every state-changing admin endpoint for same-site cookie semantics, Origin/Host checking and any existing CSRF helper.

If a gap exists, fix it in the shared API security layer rather than adding one-off checks per module.

### 9.2 Destructive actions

Replace `window.confirm` patterns with an accessible explicit confirmation dialog where practical. Confirmation must include the target record name and destructive consequence.

---

## 10. Form & Validation UX

Every editor follows a consistent contract:

- visible labels;
- server-side Zod validation;
- client hints mirror server constraints but never replace them;
- field-level errors where feasible;
- form-level error summary for multi-field failure;
- pending/saving state;
- success feedback;
- unsaved-change protection for long editors where browser navigation would cause meaningful data loss;
- keyboard-operable controls;
- no status conveyed only by color.

A failed save must preserve the user's entered content.

---

## 11. Media Uploads

Shared media policy for Project/Discover/Blog:

- accept JPEG/PNG/WebP initially;
- server verifies MIME and size;
- safe generated filename;
- deterministic public storage path convention;
- image preview before/after save;
- alt text is content-specific on public pages; decorative images use empty alt;
- remove orphan-cleanup automation from V3 unless current storage volume proves it necessary.

Do not allow SVG upload in this scope.

---

## 12. Accessibility

Target: **WCAG 2.2 AA**.

Admin-specific requirements:

- visible focus states;
- skip/navigation landmarks;
- sidebar state announced correctly;
- dialogs trap/restore focus correctly;
- table headers and relationships semantic;
- mobile list alternatives do not lose labels;
- status chips include textual meaning;
- target sizes meet modern touch expectations;
- error text is programmatically associated with fields;
- loading states are announced when needed;
- motion is reduced for users requesting reduced motion.

---

## 13. Performance

- split the current monolithic dashboard into route-level chunks;
- do not load Discover editor code while viewing Leads;
- do not fetch Messages while viewing Projects;
- keep analytics queries bounded;
- paginate large tables;
- avoid large chart libraries in V3;
- prefer CSS/native layout and existing component primitives.

---

## 14. Error Handling

Each module should have:

- route-level loading state where useful;
- route-level error boundary or predictable error UI;
- empty state distinct from error state;
- actionable retry for failed reads;
- mutation error feedback containing a user-safe message;
- structured server logging with existing request IDs.

Do not report empty data as an error.

---

## 15. Testing Strategy

Required tests:

### Unit/integration

- module data query helpers;
- Zod editor schemas;
- auth rejection for admin mutation endpoints;
- invalid filter/input handling;
- publish-state transitions;
- delete behavior;
- upload validation.

### E2E

- unauthenticated `/admin/*` redirects to login;
- authenticated navigation preserves route state;
- Leads filter/status update;
- Discover create/edit/publish/preview cycle;
- Blog create/edit/publish/preview cycle;
- logout;
- mobile admin navigation;
- no critical/serious accessibility violations on representative modules.

Global gate:

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm run scan:secrets
```

Admin routes are not a public Lighthouse SEO target, but accessibility and responsive checks are mandatory.

---

## 16. Migration / Rollout Strategy

Implement incrementally so current admin remains recoverable until replacement is proven.

Sequence:

1. add shared Admin shell and route group;
2. move Overview to `/admin`;
3. extract Leads;
4. extract Messages;
5. extract Projects;
6. implement Discover V3 manager;
7. implement Blog manager;
8. implement bounded Analytics page;
9. delete old monolithic dashboard only after equivalent flows pass E2E;
10. production deploy and authenticated live smoke test.

Do not delete `admin-dashboard.tsx` at the beginning of the migration.

---

## 17. Non-goals

- replacing auth with a new SaaS/provider;
- multi-user RBAC in V3;
- organization/team admin accounts;
- websocket/live dashboard;
- generic low-code page builder;
- arbitrary plugin system;
- heavyweight charting package;
- new external CMS.

---

## 18. Definition of Done

Admin Control Center V3 is complete when:

- module navigation is route-based;
- each module loads only its own data/code path;
- existing Leads/Messages/Projects/Discover functionality has no regression;
- Blog management is operational;
- authenticated security behavior remains intact or stronger;
- old dashboard monolith is removed only after replacement verification;
- responsive and keyboard use are practical at 375/768/1024/1440 widths;
- representative Admin pages pass Axe checks;
- state-changing endpoints pass auth/validation/security tests;
- exact migration/deploy/live-verification evidence is documented.
