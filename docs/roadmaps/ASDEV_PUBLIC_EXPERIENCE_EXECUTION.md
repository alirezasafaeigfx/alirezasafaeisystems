# ASDEV Public Experience — Canonical Execution Roadmap

**Model:** dependency-driven, evidence-led, minimal-change execution  
**Status:** ACTIVE — R0 release/governance reconciliation  
**Updated:** 2026-08-30  
**Canonical rule:** this is the only task-selection roadmap for the ASDEV public-experience program.

## 1. Source of truth

This file is the single canonical roadmap for R0 → S1 → S2 → S3 → S4 → S5.

All other planning documents are subordinate references only. They may explain design, implementation, evidence, or agent behavior, but they MUST NOT create a competing queue of work.

Authority order:

1. `docs/strategy/FOCUS_POLICY.md`
2. `docs/strategy/ASDEV_AUDIT_MASTER_ROADMAP.md`
3. `AGENTS.md`
4. **this roadmap**
5. design/spec documents
6. implementation plans
7. `docs/execution/V3_2_WORK_LEDGER.md`
8. execution prompts

Supporting specifications:

- `docs/superpowers/specs/2026-08-30-v3-2-evidence-conversion-design.md`
- `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md`

Supporting plans and prompts MUST be reconciled back to this roadmap before agents select work.

---

## 2. Non-negotiable execution policy

### 2.1 No duplicate work

Before claiming any task, ORCH MUST inspect:

- current code;
- tests;
- Git history and ancestry;
- open and merged PRs;
- workflow runs and artifacts;
- existing screenshots/reports;
- `V3_2_WORK_LEDGER.md`;
- exact SHA and inputs attached to existing evidence.

If the required outcome already exists and the evidence is valid for the same SHA/inputs, the task is marked `REUSED-DONE`. It MUST NOT be reimplemented merely because an old checkbox is unchecked or another plan describes the same work differently.

### 2.2 Smallest safe delta

The default implementation strategy is **modify the smallest surface capable of satisfying the acceptance criteria**.

Agents MUST NOT:

- rewrite a component that can be fixed locally;
- replace an established primitive when extension is sufficient;
- rename or reorganize unrelated files while completing a feature;
- convert architecture, state management, styling, persistence, routing, auth, or deployment patterns merely for consistency;
- perform opportunistic cleanup outside the touched concern;
- introduce a new dependency when the existing stack can meet the requirement within the defined performance/accessibility contract.

### 2.3 Refactor budget

Default refactor budget is **zero unrelated refactor**.

A refactor is allowed only when at least one of these is proven:

1. the requested feature cannot be safely implemented without it;
2. a failing test or production incident identifies the existing structure as the cause;
3. security, accessibility, data integrity, reliability, or performance evidence requires it;
4. duplicated implementation would otherwise be introduced inside the same bounded concern.

Even then, the refactor MUST be bounded to the minimum dependency cone of the task.

A broad refactor requires its own roadmap item, explicit evidence of necessity, a migration/rollback strategy, and independent review. Broad refactors MUST NOT be hidden inside feature PRs.

### 2.4 One concern per integration unit

Every implementation branch/PR MUST have one primary concern and a bounded changed-path set.

Before integration ORCH checks:

- branch ancestry;
- base SHA;
- commit count;
- changed files;
- changed-path category;
- unexpected application/UI/content/deployment crossover.

If scope is wider than the roadmap task, integration fails closed until the branch is split or the scope is explicitly reclassified.

### 2.5 No speculative architecture churn

No framework migration, dependency-stack rewrite, rendering-engine replacement, design-system replacement, database migration strategy rewrite, or deployment architecture redesign is permitted unless a roadmap gate specifically authorizes it.

In particular, immersive work does NOT authorize Three.js, GSAP, Anime.js, WebGL, or WebGPU by default. Gate A must first prove the interaction model with the existing platform and semantic DOM/SVG/CSS approach.

### 2.6 Evidence reuse beats re-validation

Tests, screenshots, audits, approvals, and release evidence are reusable when all material inputs are unchanged.

Agents MUST regenerate evidence only when:

- the relevant code changed;
- the relevant configuration changed;
- the environment/input set materially changed;
- the evidence is incomplete, invalid, or tied to a different SHA.

---

## 3. Task admission gate

A task may enter `IN_PROGRESS` only after ORCH records:

| Check | Required verdict |
|---|---|
| Duplicate scan | no equivalent completed implementation/evidence exists |
| Dependency check | all blocking predecessor tasks are terminal |
| Scope check | exact bounded files/concerns identified |
| Refactor check | no unrelated refactor required |
| Evidence plan | acceptance criteria can be proven |
| Rollback/safety | no hidden destructive or production risk |
| Branch ancestry | branch starts from the intended accepted base |

If any row is unknown, investigate first. Do not start implementation by guessing.

---

## 4. Current repository and release truth

| Item | Verified evidence | Roadmap meaning |
|---|---|---|
| Approved V3.1 application content | exact SHA `41a80235c83ec6949d518bd7fa034814d6e43fef` | immutable reference for V3.1 review/release evidence |
| PR #19 merge | merge `4a02127bfdc2ed37956803c113b635700a930efe` | carried V3.1 ancestry into `main` together with R0-02; treat as governance incident |
| Current `main` | `39c686d4b977e7122a6a2ca889878a43fea3f1f9` | semantic-release v1.1.0 source state; not proof of production deployment |
| Main protection | branch protection disabled; repository rulesets empty | governance hardening required before normal release flow resumes |
| Prior staging release | `20260830T070559Z` | known rollback target preserved |
| R0-03 run | `33303771900` | terminal failed-safe staging attempt |
| R0-03 quality | PASS on exact `41a80235...` | application verification remains reusable |
| R0-03 upload | compressed `.tar.gz`, checksum verified | R0-02 transport contract proved operational |
| R0-03 deploy | release `20260830T0937xxZ`, internal health PASS on port 3003 | candidate built/deployed successfully to staging before external smoke |
| R0-03 failure | external staging hostname resolution timed out during post-deploy smoke (`curl` exit 28) | classify as DNS/public-route smoke failure, not application build/health failure |
| R0-03 rollback | exact rollback completed to `20260830T070559Z` | failed-safe behavior proven; no live-browser passes produced |
| R0-03A diagnosis | run `33303771900` plus successful same-host path in `33298314611` | transient VPS resolver-path incident; exact resolver sublayer was unobservable |
| PR #20 | draft, CI-green, three-file bounded staging-smoke correction | existing work to review/accept; do not reimplement R0-03B |
| PR #21 | draft governance guard/report | R0-04 evidence is reusable; R0-05A guard needs a bounded trigger/allowlist correction before acceptance |
| Public production observation | public Home did not match `main@39c686d4...`; sampled `/discover`, `/blog`, and flagship routes returned `502` during review | production identity remains unproven; re-observe in R0-05 rather than inferring from Git/semantic-release |

`33303771900` produced no live-verification artifact because live browser verification was skipped after smoke failure.

---

## 5. Sprint sequence

No sprint is calendar-driven. A sprint begins only when its dependency gate is satisfied.

| Sprint | Outcome | Status | Exit gate |
|---|---|---|---|
| R0 — Release & governance truth | establish truthful release identity, fix only proven delivery/governance defects, close V3.1 safely | `IN_PROGRESS` | staging/release truth + independent review + governance recurrence controls |
| S1 — Positioning & conversion | make value, proof, and Audit path clear within three seconds | `BLOCKED BY R0` | positioning, proof, IA, CTA, analytics green |
| S2 — Evidence documentary | ship reusable evidence primitives and one flagship technical documentary | `BLOCKED BY S1` | provenance + architecture + impact + accessibility green |
| S3 — Surface integrity | strengthen Discover and honest Blog behavior without broad redesign | `BLOCKED BY S1` | slow-network, URL state, SEO, publication-gate evidence green |
| S4 — Engineering editorial + interaction | reduce Carditis, author responsive composition, add one purposeful operational interaction system | `BLOCKED BY S1–S3` | visual hierarchy + motion/reduced-motion + Gate A evidence green |
| S5 — Verification & governed release | exact-SHA independent verification, staging, production and post-release closure | `BLOCKED BY S1–S4` | all required hosted/human/release gates terminal green |

---

# R0 — Release & Governance Truth

**Owners:** ORCH, SRE, QA, REVIEW  
**Application constraint:** do not modify approved V3.1 application semantics merely to clean history or make the release sequence look nicer.

| ID | Task | Dependency | Minimal-change rule | Done when |
|---|---|---|---|---|
| R0-01 | `REUSED-DONE` — preserve evidence from run `33298314611` | none | documentation only | release, health, smoke, pass-1 and timeout truth recorded |
| R0-02 | `REUSED-DONE` — compressed `.tar.gz` transport | R0-01 | no redesign | implementation and real staging transfer remain valid |
| R0-03 | Execute the single governed staging attempt on exact `41a80235...` | R0-02 | no app changes | terminal truth recorded: internal deploy PASS, external DNS smoke FAIL, exact rollback PASS |
| R0-03A | `REUSED-DONE` — classify DNS/public-route incident | R0-03 | evidence only; no app/DNS/Nginx refactor | transient VPS resolver-path incident recorded; unobservable sublayer not guessed |
| R0-03B | Review and accept the existing bounded correction in PR #20 | R0-05B, R0-03A | reuse PR #20; no duplicate implementation or wider workflow redesign | diff proves same-VPS smoke is DNS-independent while public browser passes still exercise real DNS; targeted contracts green |
| R0-03C | Execute one governed staging rerun | R0-03B + literal staging approval | exact immutable candidate; one attempt | internal health, bounded smoke, and two public live-browser passes green, or terminal failed-safe truth + exact rollback recorded |
| R0-04 | `REUSED-DONE` — independent exact-SHA review | R0-01 | reuse PR #21 report/evidence; do not repeat valid V3.1 checks | truth/security/a11y/SEO/performance/scope verdict recorded |
| R0-05 | Observe and reconcile production identity and authorized release truth | R0-03C, R0-04 | no history rewrite, no semantic-release inference | exact public production release identity, route health, rollback target and authorized release path recorded |
| R0-05A | Correct and accept the existing ancestry/scope guard in PR #21 | incident evidence | amend existing work only; no replacement implementation | guard triggers from sensitive changed paths, runs on its own PR, verifies intended base/ancestry + declared task/scope, and fails closed on unexpected categories |
| R0-05B | Establish repository protection/ruleset policy | R0-05A + explicit repository-admin authorization | smallest enforceable control set; settings mutation is separately gated | required checks/review/merge constraints active or exact admin blocker recorded |
| R0-06 | Establish clean V3.2 base/worktree from actual accepted release base | R0-05 | branch creation only | base SHA recorded; worktree clean; no stale branch ancestry |

### R0 refactor prohibition

R0 is an incident/release sprint, not an application modernization sprint. No UI refactor, component cleanup, dependency upgrade, Next.js upgrade, Prisma upgrade, architecture rewrite, or design-system restructuring is allowed unless primary incident evidence proves it is required.

---

# S1 — Positioning & Conversion

**Owners:** UX, FE, QA; ORCH integrates.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S1-01 | typed evidence registry | evidence contract + tests | extend existing data/types before creating parallel registry | metrics cannot render without provenance |
| S1-02 | specific FA/EN Hero positioning | three-second positioning | modify copy/composition only; do not rebuild Hero foundation without evidence | generic job-title H1 gone; one semantic H1 |
| S1-03 | provenance-approved quantitative proof strip | only claims admitted by typed evidence registry | reuse existing `ProofStrip`; do not hard-code campaign numbers in the roadmap | every rendered metric has source, period, method, and review state |
| S1-04 | ASDEV Audit primary CTA + evidence routing | attributed evidence → Audit path | reuse existing CTA primitives/routes and absorb former S1-06 | one dominant primary action across Home/Header/Footer; no generic evidence dead-end |
| S1-05 | simplify primary IA | Work / Services / Discover / About | navigation-only scope | Blog removed from primary nav until publication gate |
| S1-07 | conversion analytics verification | inspectable funnel | reuse existing analytics transport/events when valid | view → CTA → Audit attribution inspectable |

S1 MUST NOT trigger a general Home redesign. Only surfaces required by these acceptance criteria may change.

---

# S2 — Flagship Evidence Documentary

**Owners:** EVID, FE, QA; REVIEW validates claims.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S2-01 | reusable evidence primitives, impact table, and code-native Before/After diagram | evidence components | extend existing primitives; absorbs former S2-03/S2-04 | semantic mobile/screen-reader/RTL/LTR/static/reduced-motion contracts documented and tested |
| S2-02 | flagship `infrastructure-localization-rescue` | technical documentary | redesign this case study first; do not refactor all cases | before/after/timeline/impact/decisions clear |
| S2-05 | claim provenance review | truth ledger | remove/downgrade rather than invent | independent evidence review passes |
| S2-06 | case-study index hierarchy | flagship-first index | change index composition only | fewer equal-weight cards; flagship dominant |

S2 MUST NOT rebuild every case study. The flagship becomes the reference implementation; broader migration happens only if later evidence shows it is valuable.

---

# S3 — Discover & Blog Surface Integrity

**Owners:** FE, UX, QA.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S3-01 | first-row priority media + stable dimensions/skeleton/fallback | useful, stable first viewport | extend current media primitive; absorbs former S3-02 | first row is prioritized, later media remains lazy, and slow-network evidence has no blank void/layout jump |
| S3-03 | `REUSED-DONE` — URL search/filter/pagination | regression constraint only | preserve existing 15-resource URL-backed contract; no query rewrite | existing code/E2E evidence remains valid for unchanged inputs |
| S3-04 | remove Blog from primary navigation while unready | honest IA | navigation-only | direct route remains functional |
| S3-05 | Blog publication re-entry gate | explicit readiness contract | docs/content policy only | no filler content |
| S3-06 | SEO/hreflang/schema/sitemap/empty state | search integrity | patch only failing contracts | FA/EN SEO tests green |

S3 MUST NOT rewrite Discover or Blog persistence/admin architecture.

---

# S4 — Engineering Editorial & Interaction System

**Owners:** UX, FE, QA, PERF; optional FE-MOTION/FE-GPU only after gates.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S4-01 | remove unnecessary equal-weight cards | stronger hierarchy | edit affected Home/Case Study surfaces only | before/after inventory proves reduction |
| S4-02 | bilingual typography/measure system | editorial rhythm | token-level changes before component rewrites | 390/768/1440 visual review passes |
| S4-03 | authored mobile composition | progressive mobile narrative | modify only sections that fail composition | no overflow/dead-height/repeated stacking |
| S4-05 | purposeful CSS/WAAPI motion vocabulary | coherent motion | no dedicated animation dependency yet | reduced-motion and keyboard behavior pass |
| S4-06 | Gate A operational scene + Scene Logic | Hero → system → verified evidence continuity | semantic DOM/SVG/CSS; absorbs former S4-04; no Canvas/GPU runtime | concept is understandable statically and measurable narrative gain has no CWV/a11y regression |
| S4-07 | Gate A decision | evidence-based GO/STOP | STOP is valid success | either freeze at Gate A or authorize one bounded Gate B experiment |

### S4 immersive rule

The site must never become dependent on Canvas, WebGL, WebGPU, pointer physics, or scroll animation for comprehension, navigation, conversion, or evidence access.

Gate progression is an admission rule, not a pre-populated task queue:

```text
S4-05 motion vocabulary
        ↓
S4-06 Gate A Scene Logic
        ↓
     benchmark
      ↙     ↘
   STOP     GO
             ↓
       new roadmap admission: one bounded Gate B experiment
             ↓
         benchmark
          ↙     ↘
       STOP     GO
                 ↓
           new roadmap admission: one isolated Gate C prototype
```

Former S4-08/S4-09 are removed from the active queue. Gate B/C require a new evidence-backed roadmap admission after the preceding gate; no dependency, prototype, abstraction, or asset may be pre-built “for later”.

---

# S5 — Verification & Governed Release

**Owners:** QA, REVIEW, SRE; ORCH owns final verdict.

| ID | Task | Output | Minimal-change rule | Done when |
|---|---|---|---|---|
| S5-01 | targeted red/green tests + final full local verification | local evidence | do not rerun expensive suites after every unrelated micro-change | required tests green on final SHA |
| S5-02 | FA/EN visual matrix at 390/768/1440 + focus/reduced motion | visual evidence | capture only final accepted candidate | artifacts tied to exact SHA |
| S5-03 | independent truth/security/a11y/SEO/scope review | review report | findings only; no cleanup wishlist | all P0/P1 resolved |
| S5-04 | hosted CI/E2E/a11y/Lighthouse/security/secret scan | hosted evidence | reuse unchanged green jobs where policy allows | required checks terminal green |
| S5-05 | exact candidate → governed staging → two live passes | staging evidence | deploy exact immutable SHA | two consecutive live-browser passes |
| S5-06 | production gate and exact release | release evidence | no unrelated release-time refactor | production identity recorded |
| S5-07 | post-release smoke/visual/analytics + closure | closure | verification only | rollback target known; no fresh P0/P1 |

---

## 6. Dependency graph

```text
R0-01
  ↓
R0-02
  ↓
R0-01 → R0-02 → R0-03 → R0-03A ───────────────────────────┐
  └────────────────────────→ R0-04 (REUSED-DONE) ──────────┤
incident → R0-05A → R0-05B → R0-03B → R0-03C ─────────────┤
                                                           ↓
                                                        R0-05 → R0-06
                                                                    │
                                                                    ↓
S1 ────────────────┐                                              V3.2 BASE
                   ├→ S2 ─┐
                   └→ S3 ─┼→ S4 → S5
                          ┘
```

Within a sprint, agents may parallelize only tasks whose dependency cones and changed-path ownership do not overlap.

---

## 7. Agent ownership and anti-collision rules

- **ORCH:** only integrator, roadmap state owner, ledger writer, dependency resolver.
- **UX:** information hierarchy, copy structure, interaction intent; no infrastructure edits.
- **EVID:** provenance, metrics, case-study truth; no presentation-system rewrites.
- **FE:** bounded implementation of accepted UX/evidence contracts.
- **FE-MOTION:** only S4 motion tasks explicitly admitted by Gate A/B.
- **FE-GPU:** disabled until Gate C is explicitly admitted.
- **QA:** tests/evidence; does not rewrite implementation unless assigned a specific fix.
- **PERF:** budgets/measurement; performance wishlist is not automatic refactor authorization.
- **SRE:** deployment/release/governance only.
- **REVIEW:** independent verdict; suggestions below P1 do not automatically become roadmap tasks.

Two agents MUST NOT modify the same file set concurrently without ORCH explicitly splitting ownership.

### Lane contracts

| Lane | Owned concern / allowed surface | Required output and evidence | Stop/escalate when |
|---|---|---|---|
| ORCH | task admission, integration, roadmap/ledger, dependency rulings | exact base/head, bounded diff, terminal evidence; sole ledger writes | destructive/external gate, security risk, or no safe admitted work |
| UX | IA, bilingual content hierarchy, mobile composition, interaction intent | annotated contract + width/reduced-motion states | implementation would require an unadmitted system change |
| EVID | claim registry, provenance, documentary facts | source/method/period/review state; downgrade unsupported claims | primary evidence is absent or contradictory |
| FE | bounded semantic implementation | targeted tests + changed-surface evidence | scope crosses task ownership or needs broad refactor |
| FE-MOTION | S4-05/S4-06 only after admission | motion-state matrix + static/reduced-motion/touch equivalents | Gate A cannot meet budgets or a new runtime is requested |
| FE-GPU | disabled | none until a new Gate C roadmap admission | always, unless Gate C is explicitly admitted |
| QA | functional, a11y, responsive, slow-network, no-JS/reduced-motion evidence | exact-SHA commands/artifacts; no implementation ownership by default | evidence cannot be tied to exact inputs |
| PERF | budgets and before/after measurement | CWV, JS, long-task, asset, memory/idle report | proposed interaction exceeds budget or measurement is inconclusive |
| SRE | workflow, staging, release identity, rollback, rulesets | run/commit/release IDs and rollback proof | approval/credential/admin gate is missing |
| REVIEW | independent scope/truth/security/a11y/perf verdict | severity-ranked verdict against exact diff/SHA | reviewer would need to implement its own finding |

---

## 8. Home and flagship architecture contract

Home V3.2 follows one evidence narrative:

`Header → Hero + Operational Scene → Verified Proof → Flagship Documentary → Services → Selected Work / Discover → Founder Credibility → ASDEV Audit CTA → Footer`.

- Scene Logic is allowed only across Hero → system state → verified proof; it must explain `constraint → diagnosis → intervention → evidence`, not create a decorative dashboard.
- The existing founder portrait moves to the founder/About credibility moment; it is not a reason to rebuild the Hero foundation.
- Header, Services, Discover, Founder and Footer are changed only where positioning, comprehension, proof, conversion or credibility measurably improves.
- The reference flagship is only `infrastructure-localization-rescue`: Incident → Constraint → Architecture Before → Diagnosis → Intervention → Architecture After → Evidence → Trade-offs → Verification → Audit CTA.
- Reusable: evidence registry, impact table, Before/After diagram shell, timeline, verification/provenance blocks and Audit CTA. Case-specific: incident facts, constraints, diagnosis, intervention narrative and trade-offs.
- Do not migrate every case study during S2.

---

## 9. Performance and accessibility contract

Gate A and every later conditional experiment must keep:

- LCP `≤ 2.5s`, INP `≤ 200ms`, CLS `≤ 0.1` at p75 where field data exists, with controlled lab evidence otherwise;
- no new long task over `50ms` attributable to the changed interaction on the acceptance profile;
- route-specific new initial JS budget `≤ 30 KiB gzip` for Gate A; any larger delta requires a new roadmap admission with before/after proof;
- no autoplay/continuous background rendering, no idle animation loop, and no LCP/H1/primary CTA dependency on animation or client hydration;
- responsive image/SVG assets with declared dimensions; no texture/video/GPU asset in Gate A;
- complete keyboard, screen-reader, focus, zoom, forced-colors where applicable, no-JS/static and `prefers-reduced-motion` paths;
- authored 390/768/1440 FA/EN compositions with touch targets, no horizontal overflow, no dead scroll zones and no desktop-only stacking;
- reduced motion as explicit state replacement, never content removal;
- low-capability fallback selected before initializing optional work; content/navigation/evidence remain Tier 0 accessible.

Performance failure rejects or simplifies the interaction; it does not authorize a broad refactor.

---

## 10. Definition of Done for every task

A task is `DONE` only when all applicable items are true:

1. acceptance criteria are satisfied;
2. targeted tests/evidence are fresh or validly reused;
3. no unrelated files changed;
4. no hidden dependency/refactor churn occurred;
5. accessibility/security/performance regressions are absent for the changed surface;
6. exact commit SHA is recorded;
7. ledger is updated once by ORCH;
8. downstream dependencies are recomputed.

“Code written” is not Done.

---

## 11. Replanning rule

New ideas do not immediately become implementation tasks.

Every new proposal must be classified as one of:

- `REJECTED — outside current goals`;
- `REFERENCE — useful design/research input`;
- `BACKLOG — valuable but not dependency-critical`;
- `ROADMAP — required to satisfy an existing sprint outcome`;
- `INCIDENT — blocks safety/release correctness`.

Only `ROADMAP` and `INCIDENT` items enter active execution.

This prevents research, inspiration, cleanup ideas, and agent suggestions from continuously expanding scope.

---

## 12. Global stop conditions

Agents do not stop for routine ambiguity; they investigate and choose the safest bounded interpretation.

They stop only for:

1. a genuinely missing exact approval gate;
2. a security/privacy/data-loss/destructive-operation risk;
3. an external credential/access/service blocker that cannot be safely resolved;
4. a required broad refactor that has not been explicitly admitted as its own roadmap task;
5. proof that no safe, non-duplicate, dependency-valid work remains.

---

## 13. Final roadmap review disposition

| Disposition | Tasks / work |
|---|---|
| `REUSED-DONE` | R0-01, R0-02, R0-03A, R0-04, S3-03 and unchanged V3.1 primitives/evidence |
| `MODIFY` | R0-03B, R0-05, R0-05A, R0-05B, S1-03, S1-04, S3-01, S4-06/S4-07 |
| `MERGE` | S1-06→S1-04; S2-03/S2-04→S2-01; S3-02→S3-01; S4-04→S4-06 |
| `REMOVE FROM ACTIVE QUEUE` | former S4-08/S4-09, unsupported fixed metrics `−58%` and `0/30d`, all-case-study migration, broad Home rewrite, Discover query/admin rewrite, speculative dependency/refactor work |
| `KEEP` | all remaining tasks, subject to their updated dependencies and exit gates |

---

## 14. Program success

The roadmap is complete only when:

- repository/release governance is truthful and repeatable;
- V3.2 positioning and Audit conversion are clear;
- quantitative proof is provenance-backed;
- the flagship case study behaves as a technical documentary;
- Discover and Blog surfaces are honest and resilient;
- the editorial/interaction system is distinctive without becoming performance-heavy or inaccessible;
- immersive technology is used only where measured value justifies its complexity;
- exact-SHA verification and governed production release are complete;
- no major rewrite was performed merely to achieve visual novelty or code cleanliness.
