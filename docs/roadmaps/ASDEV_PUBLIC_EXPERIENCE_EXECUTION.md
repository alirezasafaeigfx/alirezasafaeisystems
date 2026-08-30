# ASDEV Public Experience Execution Roadmap

**Model:** Dependency-driven sprints; no calendar promises  
**Status:** Active planning; V3.1 release reconciliation first  
**Updated:** 2026-08-30  
**Primary ASDEV goals:** trusted reports, qualified leads, Audit conversion, production reliability

## Source of truth

This file is the canonical public-experience execution roadmap. It supersedes task selection from `roadmap/TODAY.md`, `roadmap/THIS_WEEK.md`, `roadmap/THIS_MONTH.md`, `roadmap/QUARTER.md`, and their `docs/roadmaps/` mirrors.

Strategic authority remains:

1. `docs/strategy/FOCUS_POLICY.md`
2. `docs/strategy/ASDEV_AUDIT_MASTER_ROADMAP.md`
3. `AGENTS.md`
4. this roadmap
5. `docs/execution/V3_2_AGENT_SPRINTS.md`
6. `docs/execution/V3_2_WORK_LEDGER.md`

Design: `docs/superpowers/specs/2026-08-30-v3-2-evidence-conversion-design.md`  
Implementation plan: `docs/superpowers/plans/2026-08-30-v3-2-evidence-conversion.md`  
Execution prompt: `prompts/codex/V3_2_YOLO_LOOP.md`

## State reconciliation

| Item | Evidence | Roadmap meaning |
|---|---|---|
| V3 production baseline | `main@ac08d123` | Frozen reference; do not rewrite |
| V3.1 candidate | PR `#17` at `41a80235` | Owner-approved exact-head candidate |
| V3.1 visual artifact | `9721029344`, digest `d48839…` | Tasks 1–10 are not repeat work |
| V3.1 governed staging | release `20260830T070559Z`; run `33298314611` | Deploy/health/smoke/pass-1 green; pass-2 cancelled by 45-minute job timeout |
| V3.2 | separate branch after R0 | Evidence and conversion program |

## Sprint status

| Sprint | Outcome | Status | Exit gate |
|---|---|---|---|
| R0 — Release truth | Repair the verified staging workflow timeout, then close merge/release state without changing the application candidate | `IN_PROGRESS — PIPELINE REPAIR` | Two live passes on exact candidate plus release state recorded |
| S1 — Positioning & conversion | Make value, proof, and Audit path clear in three seconds | `QUEUED` | H1, proof, IA, CTA and analytics tests pass |
| S2 — Evidence documentary | Ship one world-class flagship Case Study and reusable evidence contract | `QUEUED` | Provenance, diagrams, impact table, RTL/LTR and visual review pass |
| S3 — Surface integrity | Make Discover useful on slow networks and stop empty Blog from weakening IA | `QUEUED` | Slow-network evidence and Blog readiness rule pass |
| S4 — Editorial system | Reduce Carditis, improve typography/mobile rhythm, add purposeful motion | `QUEUED` | Cross-width screenshots and reduced-motion gate pass |
| S5 — Release confidence | Independent review, full CI, staging, two-pass live verification | `BLOCKED BY S1–S4` | Exact-SHA release evidence and required approvals |

## R0 — V3.1 Release Truth

**Owners:** ORCH, QA, SRE  
**Constraint:** do not change `41a80235` to update documentation.

| ID | Task | Dependency | Done when |
|---|---|---|---|
| R0-01 | Record run `33298314611`: release deployed, health/smoke/pass-1 green, pass-2 cancelled by the 45-minute job timeout | none | Exact log lines, release and artifact are in the ledger |
| R0-02 | Add a tested compressed-source archive contract to `deploy-vps.yml` on a separate workflow-fix branch | R0-01 | Archive transfer is compressed; candidate app SHA remains unchanged |
| R0-03 | Re-run governed staging exactly once on `41a80235` and require both live passes | R0-02 | Staging deployment and live-verification statuses are green |
| R0-04 | Independently review the 41-file application PR for truth, security, accessibility, performance, and scope | R0-01 | Findings resolved or recorded without duplicate implementation |
| R0-05 | Complete governed merge/release progression only when all repository gates and approvals are valid | R0-03, R0-04 | Exact merge/release identity recorded |
| R0-06 | Establish the post-release V3.2 base branch/worktree | R0-05 | Clean branch from the actual accepted base |

## S1 — Positioning and Conversion

**Owners:** UX, FE, QA; ORCH integrates.

| ID | Task | Main output | Done when |
|---|---|---|---|
| S1-01 | Create a typed evidence registry for sourced metrics | evidence contract + tests | no metric can render without provenance |
| S1-02 | Replace generic hero H1 and supporting copy in FA/EN | three-second positioning | job-title H1 absent; semantic H1 remains one |
| S1-03 | Render `180→55`, `−58%`, `0/30d` above the fold or immediately after Hero | quantitative proof strip | every value links to scoped evidence |
| S1-04 | Make ASDEV Audit the primary CTA and evidence the secondary CTA | attributed conversion path | one primary action across Home/Header/Footer |
| S1-05 | Simplify primary IA to Work, Services, Discover, About | focused navigation | Blog absent until readiness gate; mobile parity passes |
| S1-06 | Route the Audit Systems proof slot to the real Audit/case evidence path | correct product hierarchy | no generic `/case-studies` dead-end |
| S1-07 | Verify conversion analytics names and attribution | measurable funnel | view → CTA → Audit destination is inspectable |

## S2 — Flagship Evidence Documentary

**Owners:** EVID, FE, QA; REVIEW validates claims.

| ID | Task | Main output | Done when |
|---|---|---|---|
| S2-01 | Define reusable Case Study evidence types and presentation primitives | isolated evidence components | interfaces are documented and tested |
| S2-02 | Rebuild Infrastructure Localization Rescue as the flagship | before/after, timeline, impact, decisions | no stacked text-card narrative remains |
| S2-03 | Convert metrics to a clear Before/After table | legible impact | mobile and screen-reader semantics pass |
| S2-04 | Add code-native architecture diagrams | operational storytelling | RTL/LTR, reduced-motion and print/static fallback pass |
| S2-05 | Record claim provenance and remove/downgrade unverifiable claims | truth ledger | independent evidence review passes |
| S2-06 | Redesign Case Studies index around one flagship and selected evidence | editorial hierarchy | fewer equal-weight cards; flagship dominates |

## S3 — Discover and Blog Surface Integrity

**Owners:** FE, UX, QA.

| ID | Task | Main output | Done when |
|---|---|---|---|
| S3-01 | Give only first-row Discover media eager/high-priority loading | useful first viewport | later media remains lazy |
| S3-02 | Add stable media skeleton/fallback and dimensions | no white image void | slow-network visual evidence passes |
| S3-03 | Preserve URL-backed search/filter/pagination and 15 real resources | no regression | query contract and E2E pass |
| S3-04 | Remove Blog from primary navigation while publication gate is unmet | honest IA | direct Blog route remains functional and truthful |
| S3-05 | Record the Blog publication re-entry gate and evidence-source checklist | explicit readiness contract | no thin filler; publishing remains separately gated |
| S3-06 | Verify hreflang, metadata, article schema, sitemap behavior, and empty state | search integrity | SEO tests pass in FA/EN |

## S4 — Engineering Editorial System

**Owners:** UX, FE, QA.

| ID | Task | Main output | Done when |
|---|---|---|---|
| S4-01 | Audit all equal-weight surfaces and remove roughly 40–50% of unnecessary cards | stronger hierarchy | before/after inventory recorded |
| S4-02 | Establish typography and reading-measure targets | distinctive bilingual rhythm | 390/768/1440 review passes |
| S4-03 | Author mobile composition instead of stacking desktop sections | progressive storytelling | no overflow, dead height, or repeated pattern |
| S4-04 | Add one meaningful operational visualization where it explains the work | ASDEV visual signature | understandable without animation |
| S4-05 | Add CSS-only state/motion polish with full reduced-motion behavior | purposeful motion | no decorative infinite motion or content dependency |

## S5 — Verification and Governed Release

**Owners:** QA, REVIEW, SRE; ORCH owns verdict.

| ID | Task | Main output | Done when |
|---|---|---|---|
| S5-01 | Run targeted red/green tests per task and full local verification once stable | test evidence | no partial or fake pass |
| S5-02 | Capture FA/EN full-page matrix at 390/768/1440 plus focus/reduced motion | visual evidence | every required file is tied to exact SHA |
| S5-03 | Run independent truth, security, accessibility, SEO, and scope review | review report | all P0/P1 findings resolved |
| S5-04 | Run hosted CI, E2E, a11y, Lighthouse, security, and secret scan | hosted evidence | all required checks terminal green |
| S5-05 | Deploy exact candidate to governed staging and verify twice | staging evidence | two consecutive live browser passes |
| S5-06 | Obtain any still-required exact approval and complete production release | release evidence | post-deploy policy verdict recorded |
| S5-07 | Run post-release smoke/visual/analytics verification and close roadmap state | closure | rollback target known; no fresh P0/P1 |

## Global stop conditions

Agents do not stop for routine ambiguity. They choose the safest high-value interpretation, record it, and continue. They stop only for:

1. an exact approval gate that is genuinely absent;
2. a security, privacy, data-loss, or destructive-operation risk;
3. an external access/credential/service blocker that cannot be resolved safely;
4. honest proof that no safe valuable work remains.

## Anti-duplication rule

Before claiming a task, the orchestrator checks current code, tests, Git history, PR/Issue state, workflow evidence, and `V3_2_WORK_LEDGER.md`. Green evidence is reused when the exact SHA and relevant inputs are unchanged. A stale unchecked box is not evidence that work is missing.
