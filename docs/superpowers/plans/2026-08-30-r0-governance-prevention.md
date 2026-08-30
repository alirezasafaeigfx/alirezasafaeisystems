# R0 Governance Prevention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent bounded R0 infrastructure PRs from silently carrying application content or stale-base ancestry.

**Architecture:** A pure Node validation module receives full base/head/main SHAs and changed paths. CI invokes it only for `fix/r0-*` pull requests; it fails closed on stale bases, oversized diffs, and application/UI/content paths.

**Tech Stack:** Node.js ESM, Vitest, GitHub Actions.

**Spec:** `docs/reports/R0_GOVERNANCE_INCIDENT_2026-08-30.md`

## Global Constraints

- Do not rewrite history, force-push, merge to `main`, deploy, or change GitHub protection settings from this branch.
- R0 infrastructure paths are limited to `.github/workflows/`, `scripts/ci/`, `tests/ci/`, `docs/governance/`, and `docs/automation/`.
- Reject more than 12 changed files and all application/UI/content paths.

### Task 1: Guard module and tests

**Files:** `scripts/ci/validate-r0-pr.mjs`, `tests/ci/validate-r0-pr.test.ts`

- [x] Add pure validation tests for stale base, mixed application content, oversized/out-of-scope changes, and non-R0 scope.
- [x] Implement the minimum validator and CLI adapter.
- [x] Run focused assertions and `git diff --check`.
- [x] Commit as `3790e0e`.

### Task 2: CI integration

**Files:** `.github/workflows/ci-router.yml`

- [x] Fetch current `origin/main` and pass the pull request base/head/current-main SHAs to the validator for `fix/r0-*` branches.
- [x] Preserve existing safe checks and permissions.
- [x] Verify the isolated branch is one commit ahead of `GITHUB_MAIN@39c686d4...` with no worktree changes.
