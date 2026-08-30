# V3.2 Work Ledger

**Single writer:** ORCH  
**Rule:** Evidence, not unchecked boxes, determines state.  
**Canonical task selector:** `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`  
**Updated:** 2026-08-30

This ledger records state and evidence. It does not create work independently. If this file, an implementation plan, an agent prompt, or an older roadmap conflicts with the canonical roadmap, the canonical roadmap wins after repository truth is reconciled.

## Immutable/reusable evidence — do not repeat without invalidation

| Scope | Exact evidence | State | Reopen only if |
|---|---|---|---|
| V3 historical production baseline | `main@ac08d1232ee4edfcdbe029a5f636d68b9e8861cc` | frozen historical reference | incident analysis requires comparison |
| V3.1 application candidate | exact SHA `41a80235c83ec6949d518bd7fa034814d6e43fef` | owner-approved application content | relevant application source changes |
| V3.1 visual contract | 37/37; artifact `9721029344`; digest `sha256:d48839e8fc326610e2c146b70996eed914f20688afcf002a53ed39ea91d64602` | reusable exact-SHA evidence | relevant visual inputs or SHA change |
| V3.1 hosted pre-staging gates | six terminal-success workflows previously recorded on exact candidate | reusable where inputs unchanged | relevant workflow/config/input changes |
| R0-01 staging evidence | run `33298314611`; release `20260830T070559Z`; artifact `9728655284` | recorded | never rerun merely to satisfy documentation |
| R0-02 compressed transport | `git archive --format=tar.gz`, checksum comparison, remote `tar -xzf`; targeted tests previously green | implemented and real-run proven | transport contract changes/regresses |
| R0-03 quality gate | run `33303771900`, exact target `41a80235...`, Quality gate SUCCESS | reusable | candidate or verification inputs change |
| R0-03 archive upload | `.tar.gz` source `79,731,634` bytes; SHA-256 `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd`; transfer completed and checksum matched | PASS | transport implementation changes |
| R0-03 internal staging deploy | candidate built; Prisma schema current; staging process started; internal health passed on port `3003` | PASS before public smoke | app/deploy inputs change |
| R0-03 rollback safety | failed attempt rolled back exactly to staging release `20260830T070559Z`; DB snapshot restored | PASS | rollback implementation changes |

## Verified governance truth

| Item | Evidence | Meaning |
|---|---|---|
| PR #19 | merge `4a02127bfdc2ed37956803c113b635700a930efe` | workflow-fix branch inherited V3.1 candidate ancestry and carried it into `main`; governance incident |
| Current observed `main` | `39c686d4b977e7122a6a2ca889878a43fea3f1f9` | semantic-release v1.1.0 source state; not proof of production deployment |
| `main` protection | disabled in latest read | process-only controls are insufficient |
| repository rulesets | `[]` in latest read | no ruleset enforcement observed |
| PR #18 | canonical V3.2 documentation PR; original head `48eb38afe66ab80bbd1767e5240f06bd81d7450a` | supporting docs source; must not become a competing roadmap |
| immersive documentation branch | `docs/v3-2-immersive-interaction-spec` | isolated docs-only continuation from PR #18 head |

## Active task registry

| Task | Status | Owner | Base/head | Primary evidence | Blocker / next valid action |
|---|---|---|---|---|---|
| R0-01 | `DONE` | ORCH/SRE | exact candidate context | run `33298314611`; staging release `20260830T070559Z`; artifact `9728655284` | reuse evidence |
| R0-02 | `DONE` | QA/SRE | workflow fix + exact candidate deployment | compressed archive contract proved by run `33303771900` | reuse; do not redesign transport |
| R0-03 | `DONE-FAILED-SAFE` | SRE/QA | exact candidate `41a80235...` | deploy/health PASS; public smoke DNS resolution timeout; live verification skipped; exact rollback PASS | feeds R0-03A; do not classify as app failure |
| R0-03A | `QUEUED` | SRE/QA | current release workflow | `curl: (28) Resolving timed out after 10000 milliseconds` while accessing `staging.alirezasafaeisystems.ir` from VPS | diagnose DNS/public-route smoke path only; identify smallest safe correction |
| R0-03B | `BLOCKED` | SRE/QA | bounded correction from R0-03A | none yet | R0-03A root cause/correction |
| R0-04 | `QUEUED` | REVIEW | exact app SHA `41a80235...` | existing exact-SHA code/check/visual evidence | finish independent truth/security/a11y/SEO/perf/scope review without duplicate implementation |
| R0-05 | `BLOCKED` | ORCH/SRE | actual repository/release truth | governance incident + source-main state recorded | R0-03B and R0-04; production identity/release path must be reconciled |
| R0-05A | `QUEUED` | ORCH/QA | isolated governance branch | PR #19 ancestry/scope incident evidence | add TDD ancestry + bounded-PR scope guard; no main merge while R0 freeze applies |
| R0-05B | `BLOCKED` | ORCH | repository settings | `main` unprotected; rulesets empty | R0-05A design/test evidence and any explicit admin gate |
| R0-06 | `BLOCKED` | ORCH | actual accepted post-release base | none yet | R0-05 |
| S1-* | `BLOCKED BY R0` | UX/EVID/FE/QA | post-R0 base | roadmap/spec ready | R0-06 |
| S2-* | `BLOCKED BY S1` | EVID/UX/FE/QA | accepted S1 head | roadmap/spec ready | S1 exit gate |
| S3-* | `BLOCKED BY S1` | FE/UX/QA | accepted S1 head | roadmap/spec ready | S1 contracts |
| S4-* | `BLOCKED BY S1–S3` | UX/FE/QA | accepted product head | roadmap + immersive spec ready | S1–S3 exit gates; Gate A only initially |
| S5-* | `BLOCKED BY S1–S4` | QA/REVIEW/SRE/ORCH | final candidate | roadmap ready | S1–S4 |

## R0-03 terminal evidence — run `33303771900`

- Target environment: `staging`.
- Immutable application target: `41a80235c83ec6949d518bd7fa034814d6e43fef`.
- Quality gate: `SUCCESS`.
- Upload source: compressed `.tar.gz` generated by Git; `79,731,634` bytes.
- Source SHA-256: `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd`.
- Upload/checksum/extract: `SUCCESS`.
- Remote build: `SUCCESS`.
- Prisma: 11 migrations found; no pending migrations; schema up to date.
- Internal staging health: `PASS` on port `3003`.
- Post-deploy public smoke: `FAIL` because hostname resolution timed out (`curl` exit `28`) while checking `https://staging.alirezasafaeisystems.ir` from the VPS.
- Live browser verification: `SKIPPED` because smoke failed; zero live-verification artifacts were produced.
- Rollback: `SUCCESS`; database snapshot restored and exact staging release rolled back to `/var/www/my-portfolio/releases/staging/20260830T070559Z`.
- Classification: **delivery/public-route DNS smoke failure after a healthy internal deployment; not evidence of an application build or internal-health failure.**

## Canonical anti-duplication / anti-refactor contract

Before claiming any task, ORCH must answer all of the following with repository evidence:

1. Is the requested outcome already implemented?
2. Is there valid evidence for the same SHA and material inputs?
3. What exact bounded files/concerns need to change?
4. Can the acceptance criteria be satisfied by extending existing primitives?
5. Does the task require any unrelated refactor? If yes, reject/split it by default.
6. Is branch ancestry based on the intended accepted SHA?
7. Does the branch contain unexpected application/UI/content/deployment crossover?
8. What fresh evidence will prove completion?

### State `REUSED-DONE`

Use `REUSED-DONE` when the desired outcome and valid evidence already exist for the same relevant SHA/inputs. Do not rerun implementation or expensive verification merely because another plan has an unchecked box.

### Refactor budget

- Default unrelated-refactor budget: **zero**.
- Bounded refactor is allowed only when a feature is otherwise unsafe/impossible, a failing test/incident proves structural causality, a security/a11y/data/reliability/performance gate demands it, or same-concern duplication would otherwise be introduced.
- Broad refactor requires a dedicated roadmap task, proven necessity, migration/rollback strategy, bounded ownership, and independent review.
- Cleanup, renaming, directory reorganization, abstraction churn, dependency churn, framework migration, and design-system replacement are not implicit feature work.

## Immersive interaction state

The immersive direction is documented, not authorized for implementation beyond the canonical roadmap.

Reference: `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md`.

Execution order is fixed:

1. S1–S3 product/evidence prerequisites.
2. S4 Gate A with existing stack: semantic DOM/SVG/CSS and code-native diagrams.
3. Measure narrative value, performance, accessibility, mobile, and reduced-motion evidence.
4. Gate B advanced motion only if Gate A proves a concrete insufficiency.
5. Gate C GPU/Three.js/WebGL/WebGPU only if a measured prototype proves material value within budgets.

Stopping at Gate A or B is a valid success outcome. No technology adoption is a roadmap goal by itself.

## Update format

Append/update only on meaningful state changes; do not log micro-steps.

```text
UTC:
TASK_ID:
OLD_STATE -> NEW_STATE:
OWNER:
BASE_SHA:
RESULT_SHA:
FILES:
PRIMARY_EVIDENCE:
FAILURES/RISKS:
NEXT_DEPENDENCY:
```

## State definitions

- `QUEUED`: dependencies satisfied; unclaimed.
- `CLAIMED`: one owner and non-overlapping paths recorded.
- `IN_PROGRESS`: bounded work has started after admission checks.
- `BLOCKED`: exact dependency/gate/external blocker recorded.
- `REVIEW`: implementation complete; independent verification pending.
- `DONE`: primary evidence and ORCH acceptance recorded.
- `DONE-FAILED-SAFE`: attempted operation reached a terminal failure but safety/rollback behavior worked and the truth is fully recorded; follow-up task owns correction.
- `REUSED-DONE`: exact existing implementation/evidence satisfies the task; no repeat work permitted.
- `SUPERSEDED`: a newer task/evidence replaces it; link required.

## Anti-loop checks

Do not execute a task when any answer is unknown:

1. What exact user/Audit outcome does it support?
2. What evidence proves it is not already done?
3. Which files does it own exclusively?
4. What fresh command/artifact proves completion?
5. Which higher-value safe task would be displaced?

If the task is cleanup without measurable value, duplicate verification on an unchanged SHA, speculative abstraction, unrelated dependency churn, or broad refactor hidden inside a feature task, reject it.