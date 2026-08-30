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
| R0-03A incident diagnosis | run `33303771900` compared with successful same-host path in `33298314611` | transient VPS resolver-path incident; exact sublayer unobservable | relevant network/workflow evidence changes |
| R0-04 independent review | report and exact-SHA evidence carried by draft PR #21 | reusable; governance guard acceptance is separate | reviewed SHA/material inputs change |
| V3.1 public primitives | real portrait, `VisualFrame`, `SectionHeading`, `ProjectShowcase`, `ProofStrip`, Hero CTAs, base analytics, URL-backed Discover, visual matrix and reduced-motion media behavior | reuse/extend; do not rebuild | a task proves a specific contract gap |

## Verified governance truth

| Item | Evidence | Meaning |
|---|---|---|
| PR #19 | merge `4a02127bfdc2ed37956803c113b635700a930efe` | workflow-fix branch inherited V3.1 candidate ancestry and carried it into `main`; governance incident |
| Current observed `main` | `39c686d4b977e7122a6a2ca889878a43fea3f1f9` | semantic-release v1.1.0 source state; not proof of production deployment |
| `main` protection API | `404 Branch not protected` | classic branch-protection endpoint remains unused; ruleset enforcement is the active control |
| repository ruleset | `protect-main-release-governance`, ID `21861412`, `target=branch`, `enforcement=active`, empty ref include/exclude (therefore includes `main`) | active repository ruleset targets `main`; current user bypass is `never`; bypass actors `[]` |
| PR #18 | canonical V3.2 documentation PR; original head `48eb38afe66ab80bbd1767e5240f06bd81d7450a` | supporting docs source; must not become a competing roadmap |
| immersive documentation branch | `docs/v3-2-immersive-interaction-spec` | isolated docs-only continuation from PR #18 head |
| PR #20 | draft, CI-green, bounded three-file staging-smoke change | existing R0-03B implementation; review/accept it instead of reimplementing |
| PR #21 | draft governance guard + R0-04 report | R0-04 evidence reusable; amended head `dc77060afea987bdfde45538b43ca5fef1feaf8e` has all hosted checks green and the guard now covers sensitive paths, declarations, ancestry and fail-closed categories | remains draft during incident freeze; repository settings are a separate admin gate |
| Public production sample | Home content did not match `main@39c686d4...`; `/discover`, `/blog`, and flagship samples returned `502` during review | exact production identity and current route health are unresolved until fresh R0-05 observation |

## Active task registry

| Task | Status | Owner | Base/head | Primary evidence | Blocker / next valid action |
|---|---|---|---|---|---|
| R0-01 | `REUSED-DONE` | ORCH/SRE | exact candidate context | run `33298314611`; staging release `20260830T070559Z`; artifact `9728655284` | reuse evidence |
| R0-02 | `REUSED-DONE` | QA/SRE | workflow fix + exact candidate deployment | compressed archive contract proved by run `33303771900` | reuse; do not redesign transport |
| R0-03 | `DONE-FAILED-SAFE` | SRE/QA | exact candidate `41a80235...` | deploy/health PASS; public smoke DNS resolution timeout; live verification skipped; exact rollback PASS | feeds R0-03A; do not classify as app failure |
| R0-03A | `REUSED-DONE` | SRE/QA | runs `33303771900` + `33298314611` | transient VPS resolver-path incident; exact sublayer absent from instrumentation | no repeat diagnosis; preserve uncertainty |
| R0-03B | `BLOCKED — EXISTS-UNMERGED` | SRE/QA/REVIEW | draft PR #20 | bounded same-VPS smoke correction; CI green | R0-05B, then scope/contract review and governed acceptance of existing PR |
| R0-03C | `BLOCKED` | SRE/QA | exact accepted R0-03B head | none yet | literal `APPROVE_PHASE_2_STAGING_DEPLOY`; one governed rerun only |
| R0-04 | `REUSED-DONE` | REVIEW | exact app SHA `41a80235...` | existing exact-SHA evidence + PR #21 report | do not repeat unless inputs change |
| R0-05 | `BLOCKED` | ORCH/SRE | actual public release truth | source/main and public observation disagree | R0-03C; observe exact production identity/release path rather than infer |
| R0-05A | `READY — EXISTS-UNMERGED` | ORCH/QA | `main@39c686d4...` → PR #21 `dc77060afea987bdfde45538b43ca5fef1feaf8e` | six-file bounded diff; hosted Router, quality, smoke, Lighthouse, security and CodeQL checks green; local focused 7/7, type-check and lint 0 errors | remains draft during incident freeze; no merge or settings mutation |
| R0-05B | `BLOCKED — ADMIN GATE` | ORCH | repository settings | active ruleset `21861412` enforces pull request, one approval, deletion/non-fast-forward blocks and no bypass; however required contexts include `CI Router`, `Security Audit`, and `Code scanning results`, which do not match actual PR check names | administrator must correct required contexts to actual checks (`safe-checks`, `CI`, `E2E Smoke`, `lighthouse`, `Dependency review (PR)`, `pnpm audit (high/critical gate)`, `Secret scan (repo)`, `CodeQL` as applicable), then re-verify merge feasibility |
| R0-06 | `BLOCKED` | ORCH | actual accepted post-release base | none yet | R0-05 |
| S1-* | `BLOCKED BY R0` | UX/EVID/FE/QA | post-R0 base | roadmap/spec ready | R0-06 |
| S2-* | `BLOCKED BY S1` | EVID/UX/FE/QA | accepted S1 head | roadmap/spec ready | S1 exit gate |
| S3-* | `BLOCKED BY S1` | FE/UX/QA | accepted S1 head | roadmap/spec ready | S1 contracts |
| S4-* | `BLOCKED BY S1–S3` | UX/FE/QA | accepted product head | roadmap + immersive spec ready | S1–S3 exit gates; Gate A only initially |
| S5-* | `BLOCKED BY S1–S4` | QA/REVIEW/SRE/ORCH | final candidate | roadmap ready | S1–S4 |

## Immediate dependency order

`R0-05A → R0-05B → R0-03B → R0-03C → R0-05 → R0-06 → S1`

- R0-01, R0-02, R0-03A and R0-04 are terminal/reusable and must not be dispatched again.
- PR #20 and PR #21 are `EXISTS-UNMERGED`, not `DONE`; continue the existing work rather than create parallel implementations.
- R0-05B repository settings and R0-03C staging are external side effects with separate literal gates.

## R0-05B read-only protection verification

- Verified at `2026-08-30T14:16:05Z` through the GitHub API; no repository settings were mutated.
- Active rule: repository ruleset `protect-main-release-governance` (`21861412`), `target=branch`, `enforcement=active`, empty ref include/exclude. GitHub’s empty ref filters apply the rule broadly, including `main`; the rule is not limited to `main`.
- Direct-change control: pull-request rule is active with `required_approving_review_count=1`; direct pushes are therefore not an allowed governed merge path for a protected matching ref.
- Review control: one approving review required; stale reviews dismissed on push; `bypass_actors=[]`, `current_user_can_bypass=never`.
- Destructive-history controls: `deletion` and `non_fast_forward` rules active, blocking branch deletion and force-push/non-fast-forward updates.
- Required checks configured by the ruleset: `CI Router`, `lighthouse` (GitHub Actions integration `15368`), `Security Audit`, `CodeQL` (integration `57789`), `CI`, `E2E Smoke`, and `Code scanning results`.
- Actual PR #21 head `dc77060afea987bdfde45538b43ca5fef1feaf8e` check contexts: `safe-checks`, `lighthouse`, `Hosted quality gate`, `smoke`, `pnpm audit (high/critical gate)`, `Secret scan (repo)`, `analyze (javascript-typescript)`, `CodeQL`, and `CodeRabbit` (draft skip). PR #20 head `b39e354cc39934b153bbc690bf6e0ff4ccf46921` exposes the same workflow-specific names, with its accepted same-SHA checks already recorded.
- Effectiveness verdict: **incomplete / merge-blocking configuration**. `CI Router`, `Security Audit`, and `Code scanning results` are not exact contexts on the governed PRs; the ruleset therefore cannot be accepted as a legitimate governed merge contract until the administrator aligns required contexts with the actual check-run names or changes workflows to emit the required names.
- PR #21 remains `OPEN`, `DRAFT`, `MERGEABLE`, `CLEAN`, with no approving review. PR #20 remains `OPEN`, `DRAFT`, `MERGEABLE`, with no approving review. Neither was merged or bypassed.

## R0-05A admission and acceptance evidence

- Task ID: `R0-05A`.
- Intended base: `main@39c686d4b977e7122a6a2ca889878a43fea3f1f9`.
- Primary concern: bounded ancestry and scope guard.
- Expected path categories: `workflow,ci,report,plan`.
- Allowed paths: `.github/workflows/**`, `scripts/ci/**`, `tests/ci/**`, `docs/reports/**`, and `docs/superpowers/plans/**` for this existing bounded PR; no application, content, deployment, release or other paths.
- Reused evidence: R0-04 report and existing PR #21 implementation/tests; no V3.1 application behavior was reimplemented.
- TDD evidence: new declaration/category crossover tests were observed red before implementation and are green at 7/7 on the accepted candidate.
- Acceptance: sensitive changed-path detection replaced the branch-name trigger; PR event declarations provide canonical task/base/concern/categories; the CLI verifies full-SHA inputs, merge-base, ancestry and complete `base...head` file range; undeclared or forbidden categories fail closed; the guard runs on its own PR.
- Fresh checks at head `dc77060afea987bdfde45538b43ca5fef1feaf8e`: hosted CI Router, quality, smoke, Lighthouse, security, dependency review, audit and CodeQL all passed; local `pnpm type-check` passed, `pnpm lint` had 0 errors, and full `pnpm test` reproduced the pre-existing Windows-sensitive backup-contract timeout (401 passed, 1 timed out, outside this diff).
- Rollback/safe failure: one focused PR revert restores the prior guard; no production, staging, repository-settings or history mutation was performed.

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
4. If Gate A proves a concrete insufficiency, request a new roadmap admission for one bounded Gate B experiment.
5. Gate C remains disabled unless Gate B evidence earns another explicit roadmap admission.

Former S4-08/S4-09 are removed from the active queue. Stopping at Gate A or B is a valid success outcome. No technology adoption is a roadmap goal by itself.

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
