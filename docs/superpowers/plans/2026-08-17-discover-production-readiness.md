# Discover Production Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Make the production Discover surface locale-correct and restore failing deploy/release gates without weakening checks.

**Architecture:** Preserve the existing Next.js proxy rewrite model. Carry the trusted internal locale context across the second middleware invocation, add a regression test for the rewrite boundary, and diagnose/fix only concrete deploy and release failures observed on GITHUB_MAIN.

**Tech Stack:** Next.js 16, TypeScript, Vitest, pnpm, Bash deployment scripts, GitHub Actions, semantic-release.

## Global Constraints

- Work only from `origin/main` in isolated branch `fix/discover-production-readiness`.
- Preserve unrelated dirty changes in the original LOCAL_PC checkout.
- No production mutation, migration, edge cutover, or deploy without the repository approval gate.
- No bypassed, disabled, weakened, or skipped test/security/CI checks.
- Follow TDD: each behavior fix starts with a failing regression test.

---

### Task 1: Lock the internal locale rewrite contract

**Files:** `src/__tests__/lib/proxy-locale.test.ts`, `src/proxy.ts`

- [ ] Add a failing test for an internal `/discover` request carrying `x-asdev-locale-context=1`, `x-site-locale=en`, and `x-asdev-locale=en`; assert locale `en`, pathname `/discover`, and no redirect.
- [ ] Run the focused Vitest file and confirm the test fails because the proxy resolves `fa`.
- [ ] Make internal locale resolution trust only the propagated context headers; keep ordinary client requests on path/cookie/default rules.
- [ ] Re-run the focused file and full locale tests.
- [ ] Commit `fix(i18n): preserve locale across internal rewrites`.

### Task 2: Repair concrete production gate failures

**Files:** only the failing workflow/script files under `.github/workflows/`, `ops/deploy/`, `scripts/release/`, or `tests/ci/`.

- [ ] Reproduce each current GitHub failure from run metadata and deterministic local contracts.
- [ ] Add a focused failing test or local reproduction before each fix.
- [ ] Apply the smallest root-cause fix without changing approval gates or secret handling.
- [ ] Run focused CI/deploy tests and shell syntax checks.
- [ ] Commit independently verified fixes.

### Task 3: Full verification and handoff

- [ ] Run `pnpm lint`, `pnpm type-check`, `pnpm test`, and `pnpm build`.
- [ ] Run security scans and Discover smoke/a11y checks.
- [ ] Verify local production HTML differs correctly for `/en/discover` and `/discover`.
- [ ] Push branch, open/update Draft PR, and inspect all CI checks.
- [ ] Perform live verification only after the exact production approval gate; otherwise report deployment as gated.
