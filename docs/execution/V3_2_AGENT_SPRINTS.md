# V3.2 Agent Sprints and Ownership

**Authority:** Execution companion to `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`  
**Mode:** YOLO + LOOP inside safety and approval gates

## Role map

Persistent environment ownership in `AGENTS.md` remains unchanged. The roles below are temporary Codex execution lanes, not replacements for MiMo, OpenCode, Hermes, or OpenClaw.

| Role | Responsibility | Writes | Must not do |
|---|---|---|---|
| `ORCH` — Codex root | Truth reconciliation, dependency selection, task claims, integration, final verdict | roadmap ledger, integration branch | delegate final judgment or accept agent self-reports as proof |
| `UX` — Positioning/IA | FA/EN positioning, navigation, CTA hierarchy, editorial composition | assigned copy/config/UI files | invent claims, metrics, testimonials, or new product scope |
| `EVID` — Evidence/Case Study | Claim provenance, diagrams, impact tables, technical documentary | case-study data/components/docs | sanitize by fabrication or publish unverifiable evidence |
| `FE` — Public implementation | Focused components, performance, responsive behavior, analytics wiring | assigned source/tests | overlap another worker's paths or refactor unrelated systems |
| `QA` — Quality/A11y/SEO/Visual | TDD, E2E, slow-network, RTL/LTR, accessibility, SEO, screenshot matrix | test/evidence paths | weaken assertions to make failures disappear |
| `SRE` — CI/Release | Workflow truth, staging, health, live verification, rollback identity | release evidence only when authorized | deploy, migrate, reload, rollback, or mutate production without valid gate |
| `REVIEW` — Independent reviewer | Scope, truth, security, performance, and visual review | review report only | implement its own findings before ORCH accepts them |

## Concurrency contract

- ORCH is the only ledger writer and integration owner.
- Use isolated worktrees/branches for product writes.
- Maximum useful concurrency is four workers; fewer is preferred when files overlap.
- Two workers never own the same file or component family simultaneously.
- Research/review lanes may run in parallel with implementation only when they are read-only.
- A worker receives one bounded task ID, exact base SHA, allowed paths, expected evidence, and forbidden actions.
- When a worker finishes, ORCH inspects the diff and runs fresh verification before accepting it.
- Follow-up fixes go back to the same worker/task context when possible; do not spawn a duplicate implementer.

## Claim protocol

Before dispatching any task, ORCH records:

```text
TASK_ID:
BASE_SHA:
OWNER_ROLE:
ALLOWED_PATHS:
DEPENDENCIES:
EXPECTED_TESTS:
EXPECTED_EVIDENCE:
FORBIDDEN:
```

The task is dispatchable only if:

1. no newer code/PR/workflow already satisfies it;
2. no other worker owns overlapping paths;
3. its dependency sprint gate is satisfied;
4. it supports at least one valid ASDEV Audit goal.

## Sprint allocation

### R0 — Release Truth

1. `SRE` records the verified run state: staging release deployed, health/smoke/pass-1 green, pass-2 cancelled by the 45-minute workflow budget after a roughly 40-minute uncompressed source transfer.
2. `QA` writes the failing workflow contract for compressed source packaging before the workflow patch.
3. `FE/SRE` applies only the source-archive workflow repair on a separate branch; it does not touch the approved application candidate.
4. `REVIEW` independently reviews both the 41-file application candidate and the bounded workflow fix.
5. `ORCH` runs governed staging once after the fix and requires both live passes.

No V3.2 product worker starts until R0 establishes the accepted base.

### S1 — Positioning and Conversion

- `UX`: S1-02, S1-04, S1-05 copy/IA contract.
- `EVID`: S1-01 and the provenance of S1-03.
- `FE`: S1-02 through S1-07 after contracts are fixed.
- `QA`: tests analytics, one-H1 semantics, mobile menu parity, and links.
- `REVIEW`: verifies three-second clarity and no unsupported claim.

### S2 — Evidence Documentary

- `EVID`: S2-01, S2-03, S2-04, S2-05.
- `UX`: editorial hierarchy and bilingual narrative.
- `FE`: reusable primitives and page integration.
- `QA`: table/diagram semantics, RTL/LTR, visual captures, print/static behavior.
- `REVIEW`: independent claim-by-claim provenance review.

### S3 — Surface Integrity

- `FE`: Discover loading/skeleton implementation and Blog nav gating.
- `UX`: Blog drafts only from existing evidence; no publication.
- `QA`: throttled-network, layout-shift, query, SEO, and locale tests.
- `REVIEW`: verifies no test fixture, placeholder, or empty promoted surface remains.

### S4 — Editorial System

- `UX`: card inventory, typography, mobile composition, operational visual direction.
- `FE`: focused presentation changes and CSS-only motion.
- `QA`: width matrix, reduced motion, focus, overflow, and performance.
- `REVIEW`: visual rubric and anti-template review.

### S5 — Verification and Release

- `QA`: one stable full local/hosted verification pass and exact-SHA evidence matrix.
- `REVIEW`: independent final code/truth/visual review.
- `SRE`: governed staging, two live passes, release/rollback evidence.
- `ORCH`: only role allowed to declare the final verdict after reading primary evidence.

## Worker mission template

```text
ROLE: <UX|EVID|FE|QA|SRE|REVIEW>
TASK: <exact task ID and outcome>
REPO/BASE: <repo, branch, full SHA>
READ FIRST: AGENTS.md + spec + roadmap + ledger
ALLOWED PATHS: <exact non-overlapping paths>
VERIFY: <exact commands/evidence>
FORBIDDEN: unrelated refactor, duplicate work, fake evidence, secrets, main push, deploy/migration/destructive action
END: changed files, commands/results, remaining risk, exact commit; do not claim PASS without primary evidence
```

## Loop contract

After each accepted task, ORCH:

1. updates the ledger;
2. checks the next dependency gate;
3. selects the highest-value safe task;
4. dispatches or executes it;
5. continues until a genuine stop condition.

Micro-cleanup, dependency churn, speculative abstraction, and repeated green checks are not valid loop work.
