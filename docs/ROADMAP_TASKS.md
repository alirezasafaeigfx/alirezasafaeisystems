# Active Roadmap Tasks

**Updated:** 2026-08-30  
**Canonical task definitions:** `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`  
**Live state:** `docs/execution/V3_2_WORK_LEDGER.md`

This file is an index, not a duplicate backlog. Detailed acceptance criteria, dependencies, owners, tests, and evidence live in the canonical roadmap and implementation plan.

| Priority | Range | Outcome | Current state |
|---|---|---|---|
| P0 | `R0-01…R0-06` | Repair V3.1 staging pipeline timeout and close exact release truth | `R0-01 DONE; R0-02 QUEUED` |
| P0 | `S1-01…S1-07` | Specific positioning, sourced proof, Audit-first conversion, focused IA | queued after R0 |
| P0/P1 | `S2-01…S2-06` | Flagship technical-documentary Case Study and provenance | queued after S1 |
| P1 | `S3-01…S3-06` | Discover slow-network integrity and honest Blog readiness | queued after S1 contracts |
| P1 | `S4-01…S4-05` | Engineering Editorial system, card reduction, mobile, motion | queued after S2/S3 |
| P0 release | `S5-01…S5-07` | Independent review, full CI, staging, live verification, release | blocked by S1–S4 and gates |

## Current exact blocker

Staging run `33298314611` deployed release `20260830T070559Z`; health, smoke, and live-verification pass 1 succeeded. Pass 2 was cancelled because the uncompressed `123,883,520`-byte source transfer consumed roughly 40 minutes of the 45-minute deployment job budget.

Next task: `R0-02` — write the failing compressed-source workflow contract, apply the bounded `.tar.gz` workflow fix on a separate branch, verify it, and rerun governed staging once against unchanged application head `41a80235c83ec6949d518bd7fa034814d6e43fef`.

## Do-not-repeat ledger

V3.1 Tasks 1–10, the 37/37 visual contract, owner visual approval, and six pre-staging hosted gates are already evidenced on `41a80235`. Stale unchecked plan boxes do not make them active tasks.

## Execution prompt

Use `prompts/codex/V3_2_YOLO_LOOP.md` for autonomous execution. Routine ambiguity is resolved with the safest high-value assumption; exact approvals, security/data-loss risk, unavoidable access blockers, and honest zero-work remain the only stop conditions.
