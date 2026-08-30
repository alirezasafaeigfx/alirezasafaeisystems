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
| R0-01 | Preserve evidence from run `33298314611` | none | documentation only | release, health, smoke, pass-1 and timeout truth recorded |
| R0-02 | Repair archive transport using git-produced `.tar.gz` and checksum | R0-01 | workflow/test only | compressed transfer proved in real staging run |
| R0-03 | Execute the single governed staging attempt on exact `41a80235...` | R0-02 | no app changes | terminal truth recorded: internal deploy PASS, external DNS smoke FAIL, exact rollback PASS |
| R0-03A | Diagnose staging public-route/DNS smoke failure from primary evidence | R0-03 | investigate DNS/smoke path only; no app refactor | root cause classified and smallest safe correction identified |
| R0-03B | Apply only the proven bounded correction and re-verify staging according to release policy | R0-03A | no second unrelated workflow redesign | staging health/smoke plus required live verification evidence green |
| R0-04 | Complete independent exact-SHA review | R0-01 | reuse existing exact-SHA evidence | truth/security/a11y/SEO/performance/scope verdict recorded |
| R0-05 | Reconcile accidental source merge, production identity, and release governance | R0-03B, R0-04 | no history rewrite, no cosmetic revert | real history, current production release identity and authorized release path recorded |
| R0-05A | Add branch/base ancestry and bounded-PR scope guard | incident evidence | isolated tests + minimal governance code only | contaminated workflow-fix PR class fails closed |
| R0-05B | Establish repository protection/ruleset policy | R0-05A | smallest enforceable repository control set | required checks/review/merge constraints active or explicit admin blocker recorded |
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
| S1-03 | quantitative proof strip | `180→55`, `−58%`, `0/30d` | reuse existing proof primitives where possible | every metric has verifiable provenance |
| S1-04 | ASDEV Audit primary CTA | attributed conversion path | reuse existing CTA primitives/routes | one dominant primary action across Home/Header/Footer |
| S1-05 | simplify primary IA | Work / Services / Discover / About | navigation-only scope | Blog removed from primary nav until publication gate |
| S1-06 | route Audit proof correctly | evidence → Audit hierarchy | route/content patch only | no generic evidence dead-end |
| S1-07 | conversion analytics verification | inspectable funnel | reuse existing analytics transport/events when valid | view → CTA → Audit attribution inspectable |

S1 MUST NOT trigger a general Home redesign. Only surfaces required by these acceptance criteria may change.

---

# S2 — Flagship Evidence Documentary

**Owners:** EVID, FE, QA; REVIEW validates claims.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S2-01 | reusable evidence types/primitives | evidence components | extend existing primitives before replacement | interfaces documented/tested |
| S2-02 | flagship `infrastructure-localization-rescue` | technical documentary | redesign this case study first; do not refactor all cases | before/after/timeline/impact/decisions clear |
| S2-03 | semantic Before/After impact table | legible evidence | no generic table-system rewrite | mobile + screen-reader semantics pass |
| S2-04 | code-native architecture diagrams | operational storytelling | SVG/DOM first; no GPU dependency | RTL/LTR/reduced-motion/static fallback pass |
| S2-05 | claim provenance review | truth ledger | remove/downgrade rather than invent | independent evidence review passes |
| S2-06 | case-study index hierarchy | flagship-first index | change index composition only | fewer equal-weight cards; flagship dominant |

S2 MUST NOT rebuild every case study. The flagship becomes the reference implementation; broader migration happens only if later evidence shows it is valuable.

---

# S3 — Discover & Blog Surface Integrity

**Owners:** FE, UX, QA.

| ID | Task | Output | Reuse/minimal-change rule | Done when |
|---|---|---|---|---|
| S3-01 | first-row priority media | useful first viewport | preserve current query/data architecture | later media remains lazy |
| S3-02 | stable media skeleton/fallback/dimensions | no blank media void | extend current card/media primitive | slow-network evidence passes |
| S3-03 | preserve URL search/filter/pagination | no regression | no query architecture rewrite | existing 15-resource contract + E2E green |
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
| S4-04 | one operational visualization | ASDEV visual signature | semantic SVG/DOM; understandable statically | concept understood without animation |
| S4-05 | purposeful CSS/WAAPI motion vocabulary | coherent motion | no dedicated animation dependency yet | reduced-motion and keyboard behavior pass |
| S4-06 | Gate A Scene Logic prototype | Hero → System → Evidence continuity | existing stack only; no Canvas/GPU runtime | measurable narrative gain without CWV/a11y regression |
| S4-07 | Gate A decision | evidence-based GO/STOP | STOP is valid success | either freeze at Gate A or authorize one bounded Gate B experiment |
| S4-08 | Optional Gate B advanced-motion experiment | one interaction only | dependency allowed only after S4-07 GO | value > complexity; bundle/perf/a11y budgets pass |
| S4-09 | Optional Gate C GPU signature prototype | one isolated signature scene | only after explicit Gate B evidence and roadmap re-approval | graceful Tier 0 fallback + measurable value + budgets pass |

### S4 immersive rule

The site must never become dependent on Canvas, WebGL, WebGPU, pointer physics, or scroll animation for comprehension, navigation, conversion, or evidence access.

Gate progression is:

```text
S4-04 semantic visualization
        ↓
S4-05 motion vocabulary
        ↓
S4-06 Gate A Scene Logic
        ↓
     benchmark
      ↙     ↘
   STOP     GO
             ↓
       optional Gate B
             ↓
         benchmark
          ↙     ↘
       STOP     GO
                 ↓
           optional Gate C
```

No Gate B/C work may be pre-built “for later”.

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
R0-03 → R0-03A → R0-03B ─┐
  └────────→ R0-04 ────────┼→ R0-05 → R0-05A → R0-05B → R0-06
                            │
                            └───────────────────────────────────────┐
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

---

## 8. Definition of Done for every task

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

## 9. Replanning rule

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

## 10. Global stop conditions

Agents do not stop for routine ambiguity; they investigate and choose the safest bounded interpretation.

They stop only for:

1. a genuinely missing exact approval gate;
2. a security/privacy/data-loss/destructive-operation risk;
3. an external credential/access/service blocker that cannot be safely resolved;
4. a required broad refactor that has not been explicitly admitted as its own roadmap task;
5. proof that no safe, non-duplicate, dependency-valid work remains.

---

## 11. Program success

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
