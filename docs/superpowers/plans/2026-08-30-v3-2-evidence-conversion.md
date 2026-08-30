# V3.2 Evidence and Conversion — Execution Reference

**Status:** Reconciled supporting plan; not a task-selection roadmap  
**Canonical task selector:** `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`  
**Specs:** `docs/superpowers/specs/2026-08-30-v3-2-evidence-conversion-design.md` and `docs/superpowers/specs/2026-08-30-v3-2-immersive-interaction-system.md`  
**Ledger:** `docs/execution/V3_2_WORK_LEDGER.md`

## Authority and use

This file gives implementation detail only after ORCH admits a task from the canonical roadmap. It does not create a queue, preserve stale checkboxes, or authorize implementation, merge, repository-settings mutation, staging, production, migration or publication.

The former local Tasks 0–8 are superseded as a task-selection mechanism. Their useful interfaces and verification intent are reconciled below against canonical IDs.

## Current continuation

Terminal/reusable and not dispatchable on unchanged inputs:

- R0-01 — run `33298314611` evidence;
- R0-02 — compressed `.tar.gz` transport;
- R0-03A — transient VPS resolver-path diagnosis;
- R0-04 — independent exact-SHA review evidence;
- V3.1 visual, reduced-motion, URL-backed Discover and existing public primitive evidence recorded in the ledger.

Execute only in this dependency order:

1. **R0-05A:** amend existing draft PR #21; do not create a parallel guard.
2. **R0-05B:** mutate repository rulesets only with explicit admin authority; otherwise record the exact blocker.
3. **R0-03B:** review/accept existing draft PR #20; do not reimplement the staging-smoke correction.
4. **R0-03C:** run one governed staging attempt only with literal `APPROVE_PHASE_2_STAGING_DEPLOY`.
5. **R0-05:** observe exact public production identity, route health, release path and rollback target.
6. **R0-06:** create the clean V3.2 base from the accepted release truth.

S1 remains blocked until R0-06.

## Task admission routine

Before writing code, ORCH records:

```text
TASK_ID:
INTENDED_BASE_SHA:
PRIMARY_CONCERN:
EXPECTED_CHANGED_PATH_CATEGORIES:
ALLOWED_PATHS:
DEPENDENCIES:
REUSED_EVIDENCE:
RED_TEST_OR_ACCEPTANCE_PROOF:
ROLLBACK_OR_SAFE_FAILURE:
```

Reject admission when equivalent code/PR/evidence exists, the base/ancestry is wrong, changed-path ownership overlaps, a broad refactor is hidden, or the acceptance result is not measurable.

## R0 implementation envelopes

### R0-05A — PR ancestry/scope guard

Continue PR #21. The accepted guard must:

- trigger from sensitive workflow/release changed paths, never only a branch-name convention;
- run on the PR that introduces or changes the guard;
- require intended base SHA, canonical task ID, primary concern and expected changed-path categories;
- verify merge-base/ancestry and the complete commit/file category range;
- fail closed on undeclared application/content/workflow/deployment crossover;
- allow the bounded test/report paths required by the declared governance task;
- include targeted red/green contract tests.

It must not rewrite history, force-push, change application behavior or silently change repository settings.

### R0-05B — repository enforcement

Use the smallest ruleset/protection configuration that enforces the accepted guard, required checks and review/merge constraints. Settings mutation is a separately gated external action. If authorization is absent, record `BLOCKED — ADMIN GATE`; do not simulate completion with documentation.

### R0-03B — existing staging-smoke correction

Continue PR #20. Same-VPS smoke may be made DNS-independent only because two later public browser passes still exercise the real public hostname and DNS path. Verify bounded changed paths, TLS/host semantics, fail-closed behavior and related deployment contracts. Do not build a second fix or widen into DNS/Nginx/application redesign.

### R0-03C — governed staging

Deploy the exact immutable candidate once, only after the literal approval gate. Require:

- quality/archive/checksum/build/Prisma/startup/internal health;
- bounded same-VPS smoke;
- two consecutive public live-browser passes through real DNS;
- exact candidate/release identity;
- artifact/report upload;
- exact rollback target and failed-safe behavior.

A terminal failed-safe result is recorded honestly and does not authorize broad refactoring.

## Product implementation envelopes

Likely paths are candidates, not pre-authorized writes. Inspect current code first and extend existing primitives.

| Canonical IDs | Outcome | Reuse-first surfaces | Minimum evidence |
|---|---|---|---|
| S1-01/S1-03 | typed claim provenance and admitted proof | existing data/types and `ProofStrip` | uniqueness, source, period, method, verification date, review-state tests |
| S1-02 | specific FA/EN Hero positioning | existing Home content/Hero | one H1, three-second comprehension, 390/768/1440 FA/EN |
| S1-04/S1-05/S1-07 | Audit-first CTA, evidence routing, focused IA, attribution | existing CTA, Header/Footer, analytics | route/event contract, keyboard/mobile menu parity |
| S2-01 | evidence primitives including impact table and Before/After diagram | `VisualFrame`, `SectionHeading`, existing case-study components | semantic table/diagram, static, print, RTL/LTR, screen-reader tests |
| S2-02/S2-05/S2-06 | one flagship documentary, provenance review and flagship-first index | `infrastructure-localization-rescue`, `ProjectShowcase` | claim-by-claim review, documentary sequence, no all-case migration |
| S3-01 | first-row priority plus stable skeleton/fallback/dimensions | current Discover media/card primitive | throttled network, stable layout, later-media lazy behavior |
| S3-04/S3-05/S3-06 | honest Blog IA/publication gate and failing SEO contracts only | existing route/Admin architecture | direct route preserved; no filler publication |
| S4-01/S4-02/S4-03 | editorial hierarchy, bilingual type and authored mobile | focused Home/case/global tokens only | before/after surface inventory and 390/768/1440 composition |
| S4-05/S4-06/S4-07 | shared motion vocabulary + one Gate A operational scene + verdict | semantic DOM/SVG/CSS/WAAPI | static/reduced-motion/touch/keyboard/no-JS, CWV and narrative review |
| S5-* | exact-SHA verification and governed release | existing CI/release policies | terminal checks, two staging live passes, release and rollback identity |

S3-03 is `REUSED-DONE`; preserve the existing 15-resource URL-backed query/filter/pagination contract.

## Evidence interface

The exact code shape is chosen after repository inspection, but every rendered metric must carry equivalent fields:

```ts
type EvidenceMetric = {
  id: string
  value: string
  label: { fa: string; en: string }
  scope: { fa: string; en: string }
  sourceHref: string
  period: string
  method: { fa: string; en: string }
  verifiedAt: string
  reviewState: 'draft' | 'verified' | 'rejected' | 'expired'
}
```

No metric renders unless `reviewState === 'verified'`. The earlier fixed claims `−58%` and `0/30d` are rejected from the program contract. `180→55` and `0 rollback / 21d` remain candidates until their provenance is accepted.

## Home and flagship composition

Home:

`Header → Hero + Operational Scene → Verified Proof → Flagship → Services → Selected Work / Discover → Founder → Audit CTA → Footer`.

Flagship `infrastructure-localization-rescue`:

`Incident → Constraint → Architecture Before → Diagnosis → Intervention → Architecture After → Evidence → Trade-offs → Verification → Audit CTA`.

Reusable: registry, impact table, Before/After diagram shell, timeline, verification/provenance and CTA. Case-specific: facts, constraints, diagnosis, intervention and trade-offs.

## Motion, accessibility and performance

Canonical Gate A vocabulary:

`enter`, `exit`, `reveal`, `shift`, `focus`, `systemPulse`, `evidenceReveal`, `stateTransition`.

Use CSS/WAAPI and explicit inspectable states. Gate A adds no dedicated animation/GPU dependency, no texture/model/video/Canvas asset, no autoplay/background loop, no LCP/CTA dependency on hydration, no route-specific initial JS delta above `30 KiB` gzip and no attributable long task above `50ms` on the acceptance profile.

Keep LCP `≤2.5s`, INP `≤200ms`, CLS `≤0.1` at p75 where field data exists, with controlled lab evidence otherwise. Reduced motion uses explicit state replacement, not content removal. Mobile is authored, not desktop stacking. Gate B/C are outside the active queue.

## Verification and integration

For every admitted task:

1. record base SHA and complete expected path categories;
2. write/identify the failing acceptance proof;
3. implement the smallest delta;
4. run targeted tests and inspect the complete diff;
5. run only related regression gates invalidated by the change;
6. commit one primary concern atomically;
7. obtain independent scope/truth/a11y/performance review as applicable;
8. update the ledger once with exact SHA/evidence;
9. recompute canonical dependencies.

At S5, run the repository-standard full verification, FA/EN visual matrix, a11y, E2E, Lighthouse/performance, security/secret scan and exact-SHA hosted checks. Existing unchanged evidence is reused where policy permits.

## Stop conditions

Stop only for a missing literal approval/admin gate, security/privacy/data-loss risk, unavoidable external access blocker, an unadmitted necessary broad refactor, or zero safe dependency-valid work. Never use routine ambiguity as a reason to create a second plan or repeat proven work.

