# Decision Log

Append-only. Newest first.

---

## 2026-08-30 — Final V3.2 architecture and execution reconciliation

- **Decision:** V3.2 is an **Engineering Editorial + Operational Interface** under the promise **Operational systems made visible**.
- **Home:** `Header → Hero + Operational Scene → Verified Proof → Flagship → Services → Selected Work / Discover → Founder → Audit CTA → Footer`.
- **Flagship:** establish only `infrastructure-localization-rescue` as the reference technical documentary. Reuse evidence, table, diagram, timeline, verification/provenance and CTA primitives; keep incident facts and trade-offs case-specific.
- **Claims:** remove fixed `−58%` and `0/30d` from the program contract. `180→55` and `0 rollback / 21d` remain candidates only after typed provenance review.
- **Immersive:** Gate A is the only active implementation direction. Former S4-08/S4-09 are removed from the active queue; Gate B/C require new evidence-backed roadmap admission.
- **Refactor ruling:** no broad refactor is admitted. Extend existing portrait, visual/evidence components, CTA/analytics and URL-backed Discover primitives with the smallest safe delta.

## 2026-08-30 — R0 order and existing PR reuse are authoritative

- **Decision:** Immediate dependency order is `R0-05A → R0-05B → R0-03B → R0-03C → R0-05 → R0-06`.
- **Reused terminal work:** R0-01, R0-02, R0-03A and R0-04 are `REUSED-DONE`; unchanged evidence must not be repeated.
- **PR #20:** existing bounded R0-03B implementation; review/accept it rather than build a parallel fix. Same-VPS smoke may be DNS-independent only because the required public browser passes still exercise the real public hostname and DNS path.
- **PR #21:** amend the existing guard rather than replace it. Admission requires sensitive-path triggering, execution on its own PR, intended-base/ancestry verification, declared task/scope and fail-closed unexpected categories.
- **External gates:** repository ruleset mutation requires explicit admin authorization; staging rerun requires literal `APPROVE_PHASE_2_STAGING_DEPLOY`.
- **Production truth:** Git/semantic-release membership is not deployment proof. R0-05 must freshly observe exact public identity, route health and rollback target.

## 2026-08-30 — Hard branch and PR scope contract

- **Decision:** Every branch/PR declares intended base SHA, canonical task ID, primary concern and expected changed-path categories before integration.
- **Automation:** sensitive workflow/release path changes trigger the guard regardless of branch name. The guard verifies merge-base/ancestry, commit range, changed categories and declaration; unexpected crossover fails closed.
- **Why:** PR #19 proved naming convention and human memory cannot prevent an ostensibly narrow workflow fix from carrying application history.
- **Effect:** Broad or cross-category scope must be split or explicitly admitted as a separate roadmap task; green unrelated CI cannot waive this contract.

## 2026-08-30 — One canonical ASDEV public-experience roadmap

- **Decision:** `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md` is the only task-selection roadmap for the R0 → S1 → S2 → S3 → S4 → S5 public-experience program.
- **Why:** Multiple plans, sprint files, prompts, and stale checkboxes can create duplicate execution, contradictory sequencing, and agent loops.
- **Effect:** Specs, implementation plans, ledgers, prompts, and legacy roadmaps are subordinate references. They may add detail but cannot create a competing queue. Agent work must be reconciled to the canonical roadmap before execution.
- **Execution model:** dependency-driven, evidence-led, minimal-change; no calendar promises and no task selection from stale legacy queues.

## 2026-08-30 — Zero unrelated-refactor budget and evidence reuse

- **Decision:** Default unrelated-refactor budget is zero; every task must use the smallest safe delta and reuse valid same-SHA/same-input evidence.
- **Why:** Broad refactors and repeat verification create risk, invalidate good evidence, consume agent capacity, and make release truth harder to audit.
- **Effect:** Before task admission ORCH checks current implementation, tests, history/ancestry, PRs, workflows/artifacts, screenshots/reports, ledger state, bounded changed paths, and existing evidence.
- **`REUSED-DONE`:** If the outcome already exists and evidence is valid for the relevant unchanged inputs, the task is complete without reimplementation.
- **Broad refactor rule:** Any genuinely necessary broad refactor must have its own roadmap item, proof of necessity, bounded dependency cone, migration/rollback strategy, and independent review. It cannot be hidden inside a feature PR.

## 2026-08-30 — Immersive interaction is a gated progressive enhancement

- **Decision:** Adopt the design direction `Operational systems made visible`, but only through progressive gates subordinate to the canonical V3.2 roadmap.
- **Gate A:** existing stack + semantic DOM/SVG/CSS/code-native operational diagrams.
- **Gate B:** advanced motion runtime only when Gate A proves a concrete interaction requirement that the existing approach cannot satisfy safely.
- **Gate C:** Three.js/WebGL/WebGPU/GPU signature scene only when a measured prototype demonstrates material narrative value while meeting performance, accessibility, mobile, reduced-motion, and reliability budgets.
- **Why:** Technology adoption is not a product outcome. The interaction must explain systems/evidence rather than become decorative complexity.
- **Effect:** Three.js, GSAP, Anime.js, WebGL, and WebGPU are not implicitly authorized. Stopping at Gate A or Gate B is a valid successful outcome.
- **Spec:** `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md`.

## 2026-08-30 — R0 release-governance incident is historical truth, not a graph-cleanup task

- **Decision:** Treat PR #19 merge `4a02127bfdc2ed37956803c113b635700a930efe` as an R0 release-governance incident because its workflow-fix branch inherited the complete approved V3.1 candidate ancestry and therefore carried that candidate into `main`.
- **Observed source state:** `main` later advanced to semantic-release commit `39c686d4b977e7122a6a2ca889878a43fea3f1f9` / v1.1.0.
- **Governance evidence:** latest read showed `main` protection disabled and repository rulesets empty.
- **Why:** Repository history must reflect what actually happened. Cosmetic history repair can create more risk than the original sequencing error.
- **Effect:** No force-push, history rewrite, cosmetic revert, repeated PR #17 merge attempt, or production mutation merely to restore intended ordering. R0-05 is governance + release-identity reconciliation, not a second application merge.
- **Prevention:** Add branch/base ancestry preflight and bounded changed-path/scope guards; prepare the smallest enforceable repository protection/ruleset controls.

## 2026-08-30 — Run 33303771900 closed failed-safe; next work is bounded DNS/public-route diagnosis

- **Decision:** Record staging run `33303771900` as terminal `DONE-FAILED-SAFE`, not queued, not a generic application failure, and not a reason for broad deployment refactor.
- **Exact application target:** `41a80235c83ec6949d518bd7fa034814d6e43fef`.
- **Reusable evidence:** Quality gate succeeded; Git-produced `.tar.gz` upload succeeded; archive SHA-256 `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd` matched remotely; candidate built and internal staging health passed on port 3003.
- **Failure:** Post-deploy smoke failed because resolving `staging.alirezasafaeisystems.ir` from the VPS timed out (`curl` exit 28).
- **Live verification:** skipped after smoke failure; no live-verification artifact produced.
- **Safety:** automatic rollback restored the database snapshot and exact staging release `20260830T070559Z`.
- **Effect:** R0-03A owns DNS/public-route smoke root-cause analysis. Only the smallest proven correction may proceed to R0-03B. Do not repeat application work or redesign the release pipeline without primary evidence.

## 2026-07-09 — Autonomous Loop Governance installed in GitHub

- **Decision:** Official policy path `docs/automation/ASDEV_AUTONOMOUS_LOOP_POLICY.md`; AGENTS.md + control-plane README + agent rules point here.  
- **Why:** Chat-only loop instructions caused stop-after-task behavior.  
- **Effect:** Agents must continue safe high-ROI work after every completion.

## 2026-07-09 — No 10/10 claim without public edge

- **Decision:** Continue product quality on GitHub; do **not** declare 10/10 or public deploy complete until edge+uptime+depth proven.
- **Why:** External audit 502 + honest scoring; app-layer alone is not public quality.
- **Product commits:** `bc1068c`, `0c16bec` on persiantoolbox main.

## 2026-07-08 — No 10/10 or public-edge claim until proven

- **Decision:** Do **not** claim 10/10 product/site quality or production **public** deploy (edge live) until **public edge + depth + uptime** are proven.  
- **Why:** App-layer prod on `:3100` + product quality packs (`bc1068c` + SEO factory) improve the product, but public edge is still OFF; score trajectory is ~7.5 not 10.  
- **Not doing yet:** Marketing 10/10 claims, edge cutover, or treating app-layer-only as full public launch.

## 2026-07-08 — OS Build Loop v2

- **Decision:** Build ASDEV Engineering Operating Model before more site handwork.  
- **Why:** Multi-project + multi-agent growth needs factory, not one-off ops.  
- **Not doing yet:** public edge / live timers / migrations without phrases.

## 2026-07-08 — Autonomous Productivity Mode

- **Decision:** Agents must continue safe high-value work; stop only on real gates.  
- **Why:** Over-gating created a conservative waiter, not an OS builder.

## 2026-07-08 — First CRITICAL_SITE production = app-layer only

- **Decision:** Option A — `127.0.0.1:3100` only.  
- **Why:** Blast radius; edge separate phrase.

## 2026-07-08 — Port isolation 3100/3200

- **Decision:** Registry prod/staging ports never equal.  
- **Why:** Co-host safety.

## 2026-07-08 — Remote build on IRAN for product pin

- **Decision:** Build on IRAN (heap + swap) instead of huge SCP.  
- **Why:** Transfer instability / OOM.
