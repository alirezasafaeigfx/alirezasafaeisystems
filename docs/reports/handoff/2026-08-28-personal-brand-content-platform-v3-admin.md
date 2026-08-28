# Personal Brand + Content Platform V3 — Continuation Handoff

Date: 2026-08-28
Environment: LOCAL_PC
Repository: `alirezasafaeigfx/alirezasafaeisystems`
Branch: `feat/personal-brand-content-platform-v3`
HEAD/origin: `0fd6a49c528a7957e02cd57dadcb06d787a114f9`
Homepage regression baseline: `f58ce975d2da66896fdf7adc1245820aa4623315`

## Verified state

- Working tree was clean after the Projects milestone.
- Branch tracks the matching origin branch.
- `IRAN_PROD_SERVER` was not changed.
- `GITHUB_MAIN` was not changed.
- Legacy `src/components/admin/admin-dashboard.tsx` and `project-manager.tsx` remain intentionally recoverable.
- No schema migration was made during Admin V3 work.

## Delivered Admin milestones

- Route-based Admin Control Center shell with desktop sidebar, mobile dialog navigation, focus targets, loading/error boundaries and admin noindex metadata.
- Server-first Overview with bounded direct Prisma counts.
- Independent server-first Leads and Messages routes with URL-backed filters, responsive tables/cards, detail dialogs, mutation feedback and destructive confirmation dialog.
- Projects route with server-first portfolio read, CRUD/publish/delete UI and existing API contract preservation.
- Local Playwright-only credentials are configured in `playwright.config.mjs`; they are synthetic and must never be reused outside tests.

## Evidence

- Admin focused Vitest before Projects: `9/9` passed.
- Projects focused Vitest plus existing lifecycle integration: `5/5` passed.
- Type-check and targeted ESLint passed after the Projects type fix.
- Admin unauthenticated route E2E: `7/7` passed.
- Admin authenticated shell route-state E2E: `1/1` passed.
- Projects mocked lifecycle E2E: `1/1` passed with `--retries=0`.
- Node warning remains: LOCAL_PC is running Node `v24.19.0`, while package engines require `>=20 <23`.

## Required next work

1. Complete Projects component split into list/editor responsibilities and add stronger real API CRUD regression coverage.
2. Implement Discover V3 Admin workspace strictly from the dated Discover spec/plan; preserve existing security and API boundaries.
3. Implement additive Blog schema, safe Markdown contract (raw HTML disabled), API and Admin workspace.
4. Add bounded Analytics route and tests.
5. Run shared CSRF/auth/security audit, accessibility and responsive regression.
6. Generate and commit real Homepage evidence: FA desktop, FA mobile, EN desktop, EN mobile.
7. Remove legacy Admin monolith only after full parity E2E is green.
8. Run final gates: `pnpm run verify`, `pnpm run test:e2e:smoke`, `pnpm run test:e2e:a11y`, `pnpm run lighthouse:ci`, `pnpm run scan:secrets`.
9. Create PR/release evidence with exact SHA; do not deploy or mutate `IRAN_PROD_SERVER` without the governed approval gate.

## Continuation command

Start by checking `git status --short`, `git rev-parse HEAD`, and this handoff. Continue from Admin Task 4/5; do not rebuild Homepage or reconstruct any missing spec/plan.
