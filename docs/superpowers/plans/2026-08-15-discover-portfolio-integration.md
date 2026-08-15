# Discover Portfolio Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Discover to the existing personal portfolio app and complete the existing Project Admin surface without creating parallel infrastructure.

**Architecture:** Extend the existing Prisma `Project` model with `contentType` and `published`, add a server-rendered Discover route, and upgrade the current `/api/admin/projects` plus Admin Projects tab to full lifecycle management.

**Tech Stack:** Next.js App Router, React, TypeScript, Prisma, Zod, existing UI primitives, Vitest, Playwright, pnpm.

## Global Constraints

- Work only in the clean feature worktree created from `origin/main`.
- Preserve the dirty source directory and do not reset, stash, or overwrite its changes.
- Reuse existing layout, i18n, auth, Prisma, validation, rate limiting, logger, and deployment contracts.
- Do not add a second database, service, auth system, CDN, or PersianToolbox runtime dependency.
- Never commit `.env`, database files, credentials, `.next`, reports, or private infrastructure data.
- Required gates: `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`, focused Playwright smoke/a11y checks.

---

### Task 1: Schema and compatibility

**Files:** `prisma/schema.prisma`, `prisma/migrations/`, project type/test files.

- [ ] Add failing tests proving old Project rows default to `portfolio` and `published=true`.
- [ ] Add the two fields with backward-compatible defaults and generate the Prisma migration.
- [ ] Run `pnpm exec prisma validate`, `pnpm db:generate`, and the focused tests.
- [ ] Inspect the migration for destructive changes and commit the schema unit.

### Task 2: Authenticated Project CRUD API

**Files:** `src/app/api/admin/projects/route.ts`, shared schema/validator files, API tests.

- [ ] Add failing tests for auth rejection, filters, create, patch, delete, publish/unpublish, featured, order, malformed JSON, invalid HTTPS and credential-bearing URLs.
- [ ] Implement PATCH and DELETE beside the existing GET/POST contract using existing auth, rate limit, Zod, sanitizer and common API headers.
- [ ] Keep response shapes compatible with existing Admin callers.
- [ ] Run focused and existing Admin API tests.

### Task 3: Public Discover route

**Files:** `src/app/discover/page.tsx`, optional `src/components/discover/`, sitemap/SEO tests.

- [ ] Add failing tests for published/content-type filtering, deterministic order, metadata, canonical, locale, empty state and no private-field leakage.
- [ ] Implement server-side query and route using existing page shell, cards, i18n, SEO and breadcrumb helpers.
- [ ] Register both locale routes in the existing sitemap source of truth.
- [ ] Run focused tests and build.

### Task 4: Existing Admin Projects manager

**Files:** `src/components/admin/admin-dashboard.tsx`, optional focused editor component, translations, component/E2E tests.

- [ ] Add failing tests for list/filter, create/edit/delete, confirmation, publication, featured, order, validation, loading/error/empty and keyboard flow.
- [ ] Replace the current read-only panel with the editor and API calls while preserving Leads, Messages, Analytics and logout behavior.
- [ ] Use existing Dialog, Input, Textarea, Button, Badge and toast components.
- [ ] Run focused UI tests and existing Admin tests.

### Task 5: Windows local runbook and gates

**Files:** `docs/operations/DISCOVER_LOCAL_RUNBOOK.md`, docs index/roadmap references, E2E/Lighthouse route lists.

- [ ] Document Node 22, pnpm, environment setup, Prisma generation/migration, local Admin configuration and cleanup without secrets.
- [ ] Run `pnpm install --frozen-lockfile` where supported, `pnpm db:generate`, lint, type-check, test and build.
- [ ] Run local smoke/a11y checks for `/discover`, `/en/discover` and `/admin`.
- [ ] Execute and record the real local CRUD lifecycle with a temporary record, then verify deletion.
- [ ] Review git status and diff for unrelated or sensitive files.

### Task 6: PR and release handoff

- [ ] Commit docs, schema, API, route, Admin and tests as focused commits.
- [ ] Push the feature branch and open a focused PR with exact evidence and limitations.
- [ ] Monitor CI and fix feature-caused failures without weakening checks.
- [ ] Do not deploy production until local and protected CI gates are green and the release is explicitly approved.
