# ASDEV V3.2 Program Checkpoint — 2026-08-30

**Purpose:** exact handoff/checkpoint for continuing the ASDEV public-experience program without duplicate work, scope drift, or speculative refactoring.  
**Status:** documentation checkpoint only; no application, dependency, database, workflow, deployment, content-publication, or production mutation is authorized by this file.  
**Canonical task selector:** `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`

## 1. Operating rule

There is one execution roadmap.

`docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md` is the only document from which ORCH/agents select tasks for R0 → S1 → S2 → S3 → S4 → S5.

Other files are supporting material only:

- `docs/superpowers/specs/2026-08-30-v3-2-evidence-conversion-design.md`
- `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md`
- `docs/execution/V3_2_WORK_LEDGER.md`
- implementation plans
- agent sprint files
- Codex prompts
- legacy day/week/month/quarter roadmaps

No supporting file may create an independent task queue.

## 2. Anti-duplication contract

Before any task starts, ORCH must inspect current code, tests, Git history/ancestry, PRs, workflow evidence/artifacts, screenshots/reports, ledger state, exact SHA, and relevant inputs.

If the requested outcome already exists and its evidence is valid for the same material inputs, mark it `REUSED-DONE` and do not implement or re-verify it merely because an old checkbox is open.

## 3. Minimal-change / refactor contract

Default unrelated-refactor budget is zero.

Every task must use the smallest safe delta. Extend existing primitives before replacing them. Do not bundle cleanup, renaming, reorganization, architecture churn, framework migration, dependency churn, design-system replacement, persistence changes, routing rewrites, auth rewrites, or deployment redesign into ordinary feature tasks.

A broad refactor requires its own canonical-roadmap task, evidence of necessity, bounded ownership/dependency cone, migration/rollback strategy, and independent review.

Every branch/PR must have one primary concern, intended base ancestry, and a bounded changed-path set. Unexpected cross-category changes fail closed before integration.

## 4. Current repository truth

- Approved V3.1 application reference: `41a80235c83ec6949d518bd7fa034814d6e43fef`.
- PR #19 merged as `4a02127bfdc2ed37956803c113b635700a930efe` but its branch inherited the complete V3.1 candidate ancestry; this is an R0 release-governance incident.
- Observed `main`: `39c686d4b977e7122a6a2ca889878a43fea3f1f9` (`semantic-release` v1.1.0 source state). Main membership/release metadata is not proof of production deployment.
- Latest repository-settings read: `main` protection disabled and repository rulesets empty.
- Do not rewrite history, force-push, cosmetically revert, or attempt to merge PR #17 again merely to restore the intended sequence.
- Draft PR #20 contains the existing bounded R0-03B staging-smoke correction; it is not accepted/merged and must not be reimplemented in parallel.
- Draft PR #21 contains reusable R0-04 review evidence and a partial R0-05A guard. Its guard is not accepted: branch-name triggering misses its own `chore/r0-*` branch and can be bypassed; its allowlist does not cover its own report scope.
- Public observation during final review did not match `main@39c686d4...`; sampled `/discover`, `/blog`, and flagship routes returned `502`. This is an observation to re-verify in R0-05, not an inferred production SHA.

## 5. R0-03 terminal truth — GitHub Actions run `33303771900`

Target: exact application SHA `41a80235c83ec6949d518bd7fa034814d6e43fef` to `staging`.

### Passed

- Quality gate: SUCCESS.
- Compressed transport: `git archive --format=tar.gz` path executed successfully.
- Archive size: `79,731,634` bytes.
- Archive SHA-256: `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd`.
- Remote checksum comparison: PASS.
- Remote extract: PASS.
- Dependency install/build: PASS.
- Prisma: 11 migrations found, no pending migrations, schema current.
- Staging process startup: PASS.
- Internal health: PASS on port `3003`.

### Failed

Post-deploy smoke attempted the public staging hostname from the VPS and failed with:

`curl: (28) Resolving timed out after 10000 milliseconds`

This occurred while resolving/accessing `https://staging.alirezasafaeisystems.ir`.

### Consequence

- Live browser verification was skipped.
- No live-verification artifact was produced for this run.
- Automatic rollback restored the database snapshot.
- Exact rollback completed to staging release `20260830T070559Z`.

### Classification

`R0-03 = DONE-FAILED-SAFE`.

The run proves the compressed transport and internal application deployment path. The observed failure is currently classified as a public-route/DNS smoke failure, not evidence of an application build/internal-health failure.

Do not trigger broad application or deployment refactors from this evidence.

## 6. Immediate R0 task order

Only canonical-roadmap dependencies determine execution order.

Terminal/reused: `R0-01`, `R0-02`, `R0-03A`, `R0-04`. Do not dispatch them again.

1. `R0-05A` — amend and accept the existing PR #21 guard: trigger from sensitive changed paths, cover its own PR, verify intended base/ancestry plus declared task/scope, and fail closed on unexpected categories.
2. `R0-05B` — activate the smallest enforceable ruleset only with explicit repository-admin authorization; otherwise record the exact blocker.
3. `R0-03B` — review and accept the existing PR #20 bounded correction; do not implement a second version.
4. `R0-03C` — with literal `APPROVE_PHASE_2_STAGING_DEPLOY`, run one governed staging attempt and require two public browser passes or exact failed-safe rollback truth.
5. `R0-05` — freshly observe exact production identity, route health, release path and rollback target; never infer deployment from Git membership or semantic-release.
6. `R0-06` — create the clean V3.2 base from the actual accepted release base.

S1 implementation remains blocked until R0-06.

## 7. V3.2 product sequence

After R0 closes:

- **S1 — Positioning & Conversion:** specific FA/EN positioning, provenance-backed proof, Audit primary CTA, focused IA, analytics. No broad Home rewrite.
- **S2 — Evidence Documentary:** reusable evidence primitives + one flagship technical documentary (`infrastructure-localization-rescue`) before touching all case studies.
- **S3 — Surface Integrity:** Discover slow-network/media integrity, URL state, honest Blog publication gate, SEO. No Admin/persistence redesign.
- **S4 — Engineering Editorial + Interaction:** reduce Carditis, improve typography and authored mobile composition, then Gate A operational interaction.
- **S5 — Verification & Governed Release:** exact-SHA reviews, full hosted gates, governed staging, required live passes, authorized production release, post-release verification.

## 8. Immersive interaction decision

Direction: **Operational systems made visible.**

The immersive system is progressive enhancement, not a technology migration.

### Gate A — default authorized design direction

Use existing platform capabilities first:

- semantic DOM;
- SVG;
- CSS;
- code-native diagrams;
- static/reduced-motion fallbacks;
- authored mobile composition.

Prove the narrative and interaction value before adding an animation/GPU runtime.

### Gate B — conditional and outside the active queue

A dedicated advanced-motion runtime may be considered only if Gate A evidence demonstrates a specific interaction that cannot be achieved safely and maintainably with the existing approach.

### Gate C — conditional, disabled and outside the active queue

Three.js/WebGL/WebGPU/GPU scene may be considered only if a measured prototype demonstrates material storytelling value while respecting performance, accessibility, mobile, reduced-motion, memory, and reliability budgets.

Former S4-08/S4-09 are removed from the active queue. Gate B or C can exist only after a new evidence-backed canonical-roadmap admission. Stopping at Gate A or Gate B is a valid successful outcome.

## 9. Final architecture decisions

- Identity: **Engineering Editorial + Operational Interface**; promise: **Operational systems made visible.**
- Home: `Header → Hero + Operational Scene → Verified Proof → Flagship → Services → Selected Work / Discover → Founder → Audit CTA → Footer`.
- Scene Logic is limited to explaining `constraint → diagnosis → intervention → evidence`; no decorative dashboard, game layer, Awwwards imitation or 3D prerequisite.
- Reference flagship: only `infrastructure-localization-rescue`. Reusable primitives are evidence registry, impact table, Before/After diagram shell, timeline, verification/provenance and Audit CTA; incident/constraint/diagnosis/intervention/trade-off narrative stays case-specific.
- Fixed claims `−58%` and `0/30d` are removed from the program contract. `180→55` and `0 rollback / 21d` may render only after provenance admission.
- Existing portrait, display/evidence primitives, Hero CTAs, analytics foundation, URL-backed Discover, V3.1 visual matrix and reduced-motion media behavior are reuse targets, not rebuild tasks.
- Unrelated-refactor budget remains zero. No broad application, design-system, routing, admin/persistence, deployment or animation-stack refactor is admitted.

## 10. Explicit non-goals at this checkpoint

Do not:

- implement immersive code before its canonical dependency gate;
- install Three.js, GSAP, Anime.js, or another animation/GPU dependency merely because it appears in a design reference;
- refactor the application during R0 incident work;
- repeat V3.1 visual work on unchanged application inputs;
- rerun completed evidence without invalidation;
- redesign all case studies at once;
- rewrite Home while implementing narrow S1 acceptance criteria;
- redesign Admin/Prisma/auth/deployment architecture as part of V3.2 public experience;
- mutate production to make Git history appear cleaner;
- force-push or rewrite history;
- create a second roadmap/queue.

## 11. Documentation state on this branch

Branch: `docs/v3-2-immersive-interaction-spec`.

This branch is an isolated documentation continuation from the V3.2 documentation head and contains no intended application/runtime mutation.

Key checkpoint documents:

1. `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md` — single canonical roadmap.
2. `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md` — immersive interaction design specification.
3. `docs/execution/V3_2_WORK_LEDGER.md` — current task/evidence registry.
4. `docs/memory/DECISION_LOG.md` — durable architectural/governance decisions.
5. `docs/execution/2026-08-30-v3-2-program-checkpoint.md` — this restart-safe handoff.

## 12. Restart protocol for any future agent/session

1. Read the canonical roadmap first.
2. Read this checkpoint and `V3_2_WORK_LEDGER.md`.
3. Reconcile fresh GitHub truth for any state that may have changed since this checkpoint.
4. Select only the highest-priority admitted task whose dependencies are satisfied.
5. Perform duplicate/evidence/scope/ancestry/refactor admission checks.
6. Implement the smallest safe delta using isolated ownership.
7. Verify fresh evidence.
8. Update the ledger once for the meaningful state change.
9. Recompute dependencies and continue.

Never infer current workflow/deployment/production state solely from this historical checkpoint; verify time-sensitive facts before acting.
