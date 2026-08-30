# V3.2 execution cards and sprint ownership

Updated: 2026-08-30. Companion to the [single roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md), not a separate queue. Follow [AGENTS.md](../../AGENTS.md), [engineering guide](../engineering/PUBLIC_EXPERIENCE_ENGINEERING.md) and [report verification](../governance/CODEX_REPORT_REVIEW.md).

## Claim and delivery contract

Before touching a task, ORCH records its actual base SHA, proven missing outcome, dependencies, exact allowed files, reused evidence, acceptance criteria, responsible role and rollback. Paths below are allowed concerns, not permission for unrelated edits. Proposed paths are labeled; choose an existing equivalent where possible. One concern may contain several tightly coupled cards in one PR; do not create a micro-PR per bullet.

Roles are capabilities, not assumed installed agents: UX (copy/design), EVID (facts), FE (implementation), QA/PERF (verification), SRE (runtime) and independent REVIEW. ORCH alone updates the ledger and integrates. Give workers non-overlapping paths only; never call a self-review independent. Use current available tools and the owner's autonomy, not hardcoded model/provider commands.

For every behavior change: establish a meaningful failing case → implement → verify real behavior → inspect actual route → repair → review. Styling/copy-only changes use visual/content checks, not meaningless tests of CSS strings. Final integration uses current required checks. All cards inherit keyboard, RTL/LTR, reduced-motion, data safety and truthful evidence requirements.

## Sprint 1 — clarity, truth and conversion

### S1-08 — plain-language public content

- Gap: Persian proof currently exposes English specialist labels; ordinary visitors should not need a technical dictionary.
- Paths: `src/lib/home-content.ts`, existing public/Discover locale content; proposed `src/lib/public-copy.ts` only if a genuinely shared contract is needed; relevant component tests.
- Implement: first-viewport problem/help/action, short service explanations, assessment CTA, localized provenance disclosure, unknown/loading/error wording, equivalent English. Preserve meaning and real brand names; no fake free service or inflated reliability claim.
- Acceptance: inspect Hero/navigation/proof/CTA and sample Discover/detail in FA/EN. A plain-language reviewer explains who the site helps, what it offers and what the main button does from visible content. Record reviewer/type and unresolved terms; do not fabricate participant tests. No untranslated implementation enums or required jargon in primary copy.
- Reject: just translating headings while leaving error states, evidence labels and service paragraphs technical.

### S1-01 / S1-03 — trustworthy evidence and proof strip

- Paths: `src/lib/evidence.ts`, `src/lib/home-content.ts`, `src/components/public/proof-strip.tsx`, flagship claim data, `src/__tests__/lib/evidence.test.ts` and relevant component tests.
- Red cases: numeric claim with missing source/period/method/date; rejected/unreviewed source; generic “accepted evidence record”; unsupported 180→55/0-over-period; malformed/conflicting periods. Tests may use explicit synthetic fixtures, never public evidence.
- Implement: auditable source references and publication gating. Audit existing numbers against retrievable sanitized primary evidence. If absent, remove quantitative publication and show an honest qualitative fact or no claim; retain internal reason without manufacturing facts.
- Acceptance: every public number maps to inspected source and review; source links resolve and are safe to publish. Proof is legible on mobile, follows Hero and offers optional human-readable explanation. An `accepted` enum alone cannot pass.
- Rollback: code/content revert, no database migration or deletion.

### S1-02 / S1-04 / S1-05 / S1-07 — positioning, navigation and action

- Paths: `src/components/sections/homepage-v3.tsx`, `src/lib/home-content.ts`, existing header/footer, analytics client/events and related tests. Inspect actual file locations before assigning.
- Implement: one understandable H1, consistent «درخواست بررسی سایت», truthful existing destination, simple nav, bilingual menu parity; preserve current analytics transport and consent/privacy behavior.
- Verify: real keyboard/touch link activation, locale preservation, selected navigation and back behavior; local analytics spy checks event name/attribution once without real lead submission. Check disabled/slow/error handling where applicable. Existing working behavior is reused, not rebuilt.
- Reject: a button with no destination, an untranslated “Audit” as the only explanation, a mobile CTA hidden below a tall portrait, double-fired events, or live synthetic conversion claims.

## Sprint 2 — visible composition and mobile

### S4-01 — Home and flagship hierarchy

- Paths: `src/components/sections/homepage-v3.tsx`, existing public primitives, `src/lib/home-content.ts`, `src/app/public-v31.css`; proposed `src/components/public/flagship-preview.tsx` if composition warrants it.
- Implement the complete roadmap order, move the real portrait into Founder, make one flagship preview dominant using real architecture/facts, make services and secondary work support it. Maintain working navigation and CTA.
- Acceptance: before/after full-page captures from the actual Home route, FA/EN at 390/768/1440; DOM reading order matches visual intent; title/action visible without animation wait; no equal-weight-card wall. Explain remaining cards by purpose, not an arbitrary count.
- Reject: only reordering array items while the portrait still dominates mobile, or generic placeholder graphics instead of the flagship's actual story.

### S4-02 / S4-03 — typography and authored responsive composition

- Paths: same Home/public styles, typography/spacing tokens and affected public components only; relevant browser tests.
- Implement: Persian/English type hierarchy, line measure, clear captions, editorial spacing; dedicated compact mobile scene area, touch controls, ordered proof and readable founder section. Keep existing font/theme stack.
- Acceptance: both themes, core widths plus 360/1024/1728 edges, zoom/reflow, long labels, no overflow/clipping/dead-height or essential hover-only content. Inspect screenshot crops and full-page continuity. Report visual findings and fixes, not only screenshot filenames.
- Reject: desktop columns simply stacked unchanged or text shrunk until it fits. Rollback is one bounded presentation revert.

## Sprint 3 — actual native scene and coherent motion

### S4-05 / S4-06 — finite motion and five meaningful states

- Paths: `src/components/public/operational-scene.tsx`, Home integration/public CSS; proposed `src/lib/system-scene.ts`, `src/components/public/system-scene-controls.tsx`; existing scene tests; proposed `e2e/public-experience.spec.ts`.
- Red cases: deterministic next/previous boundaries, direct selection/backtracking, geometry/path changes for each state, control semantics, keyboard/touch selection, preserving selected meaning when mode changes, no animation after settle/unmount/hidden; no infinite CSS animation.
- Implement the guide's state model, native SVG/DOM scene and real controls. Show a comprehensible causal change and preserve anchors/topology into a readable evidence diagram. Label conceptual illustration visibly; do not call it live telemetry or a client fact.
- Acceptance: actual route recording of all states, forward/back and evidence link; FA/EN controls; touch and keyboard; no-JS complete content; reduced-motion equivalent states; focus remains sensible; no lost navigation. Interaction tests must fail if changing state only swaps labels/colors while the diagram stays meaningless.
- Reject: four static nodes, animated dashed line, unrelated fade to a second diagram, automated scrolling that blocks manual reading, or treating an SVG title assertion as full coverage.

### S4-07 — native baseline and advanced needs

- Paths: task evidence/performance harness only unless fixing proven scene defects.
- Measure actual production build against frozen baseline with same toolchain: initial gzip JS, controlled LCP/CLS/latency, long tasks, frame timing while active and idle/hidden behavior; record three runs/profile and raw results.
- Deliver: native scene recording, measurements, concrete advanced-motion needs and remaining visual defects. This gate rejects a deficient native baseline; it does not terminate the owner's requested advanced/GPU evaluation.
- No speculative renderer, new dependency, dummy benchmark or score inferred from source. Repair baseline first; retain evidence.

## Sprint 4 — advanced motion and spatial signature

### S4-10 — dependency-scope guard and advanced motion

- Proven blocker: current `.github/workflows/ci-router.yml` classifies package/lockfile changes as sensitive and invokes the R0 infrastructure-only guard. `scripts/ci/validate-r0-pr.mjs` rejects application/release categories. Do not submit a false R0 declaration or bypass it.
- First bounded unit paths: those CI files, related `tests/ci/**`, PR declaration documentation if required. Add an explicit public-experience dependency scope with task/base/ancestry/complete-diff verification and bounded app/dependency/test/guide paths. Keep the old R0 allowlist and fail-closed behavior intact; no repository settings changes.
- Guard negative tests: undeclared scope, forged task/base, unrelated deployment/auth/database changes, unexpected ancestry, mismatched file categories, and mixed infrastructure/application work without proper admission all fail. Existing R0 valid/invalid fixtures retain outcomes. Normal PR policy must permit the correctly declared UI dependency unit.
- Second unit paths: `package.json`, `pnpm-lock.yaml`, existing scene/motion components/tests. Inspect official Anime.js v4 APIs/license/current advisories, pin an exact compatible version, import only used modules, and implement a visible advanced interaction that the native baseline could not cleanly express. Compare native and advanced behavior with recordings and byte/CPU cost.
- Acceptance: working bounded implementation/evaluation, documented version/license/security decision, finite lifecycle, complete reduced-motion path and measured budgets. Rejection must include an actual experiment and evidence; replacing a dependency evaluation with “not needed” prose is insufficient.
- Rollback: revert dependency/motion unit independently; retain a valid fail-closed CI correction. Do not relax checks to install packages.

### S4-11 — actual GPU signature prototype

- Paths: package/lockfile under the accepted scope; proposed `src/components/public/system-core-3d.tsx`; existing scene host and tests; procedural scene assets only if needed, with documented rights.
- Implement: pinned verified Three.js, deferred island, one recognizable engineered system with meaningful camera/depth, same five-state model, projected anchors for a continuous spatial-to-flat diagram transition. Not a default cube and not CSS-only perspective mislabeled WebGL.
- Red/failure cases: blocked WebGL2, context loss, failed dynamic import/asset request, reduced motion, no JS, route leave/return, offscreen/hidden, low capability, state selection during loading, rapid backtracking, resize/orientation. Semantic view remains complete; cleanup frees owned resources and cancels work.
- Acceptance: real route native/GPU captures and motion comparison at desktop/mobile; actual network proves no GPU bytes before activation; code/assets within guide budgets; trace proves no idle loop and acceptable active pacing; no essential canvas-only copy. Hardware availability/limitations disclosed.
- Rollback: remove island/import/dependency and retain complete native scene. No Production rollout just to benchmark an unaccepted prototype.

### S4-12 — adopt the complete direction

- Compare native, advanced and GPU candidates using same story/profile: visual distinction, causal clarity, spatial continuity, touch/reduced-motion, byte/CPU/asset cost and maintenance burden. Give exact candidate SHAs and inspect actual recordings, not just stills.
- Repair the signature implementation until it meets the admitted contract; then integrate the measured direction. If no GPU design meets budgets, retain comparison and state `CHANGES_REQUESTED`/`BLOCKED` for that outcome; complete other safe tasks and present the reviewable trade-off to the owner. Only explicit owner scope change accepts a native-only final direction. Do not mark a rejected 3D experiment “3D delivered.”
- Owner comparison/visual feedback is final-result review, not repeated permission for routine coding. No subjective “10/10” certificate.

## Sprint 5 — documentary, discovery and integrity

### S2-01 / S2-02 / S2-05 / S2-06 — flagship documentary

- Paths: `src/app/case-studies/infrastructure-localization-rescue/page.tsx`, `src/app/case-studies/page.tsx`, actual evidence data and necessary shared public primitives/tests.
- Implement the full incident/constraint/before/diagnosis/intervention/after/evidence/trade-offs/verification/action narrative. Start each section in simple Persian; reveal specialist details optionally. Architecture comparisons reuse the scene's meaningful topology while respecting real case facts. Mobile diagrams remain readable; tables have headers and text equivalents.
- Acceptance: independent claim audit, accessible static/reduced-motion/print reading, real FA/EN page recordings and before/after states, clear trade-offs and no unsupported numbers. Index favors this flagship; no migration of all other case studies.
- Reject: ten headings with generic filler, a fabricated case, links to nonexistent sources, or promotional assertions substituted for evidence.

### S3-01 / S3-03 / S3-04 / S3-05 / S3-06 — honest discovery and search

- Paths: existing Discover components/query helpers/routes, nav, metadata/sitemap and focused tests. Preserve schema/Admin/content pipeline and URL-backed query implementation.
- Verify existing search/filter/sort/pagination/back/forward and locale behavior before changing it. Localize raw taxonomy/unknown values truthfully; meaningful empty/error/loading states; stable first-row dimensions/priority and lazy later media under slow network. Do not guess missing data.
- Blog remains directly reachable but is not promoted until actual publication readiness; do not write/publish filler or test content. Verify canonical/hreflang/structured data and sitemap reflect actual public routes/content.
- Acceptance: browser query/navigation regressions, network-failure layout captures, FA/EN copy/SEO checks. Reuse S3-03 as regression-only if still correct. No unnecessary routing or Admin rebuild.

## Sprint 6 — enforceable acceptance and governed release

### S5-01 — harness and evidence manifest

- Start early; final run follows completed applicable S1–S4 tasks. Paths: existing focused tests and Playwright config, proposed `e2e/public-experience.spec.ts`, `e2e/public-experience-live.spec.ts`, `scripts/ci/validate-public-experience-evidence.mjs`, related `tests/ci/**`, bounded LHCI/workflow changes if necessary and admitted under proper scope.
- Build local behavioral tests for scene/fallbacks, actual route visual matrix and a separate **read-only** live spec. Existing `public-v31-visual.spec.ts` writes fixtures/content; never run it against Production. No lead-form submission in live verification.
- Implement the report protocol manifest validator: required criteria by task, full candidate/base identities, valid timestamps/results, retrievable artifact references and local SHA-256, missing/failed/skipped criteria rejection, release fields when applicable. Do not treat self-declared PASS as proof. Negative tests reject mismatched SHA, missing artifact, wrong hash, absent state/locale evidence, skipped critical test and failed criterion disguised as PASS. Record remote retrieval limitations explicitly.
- Strengthen required acceptance measurements to the engineering budgets; baseline LHCI warn-only LCP4s/CLS0.2 is insufficient. Keep actual main-thread/JS/interaction measurement, not just aggregate Lighthouse score. Changes to CI follow scope checks; never lower unrelated security gates.
- Validator checks evidence structure/integrity, not aesthetic truth, actual user comprehension or field INP. Independent inspection remains required. No schema example counts as evidence.

### S5-02 / S5-03 / S5-04 — exact candidate verification and review

- Fresh production build using locked toolchain and disposable data; focused regressions, relevant full tests, type-check/lint/build, required hosted checks. Record true commands/exits/counts/failures; reuse evidence only with identity/input rationale.
- Actual FA/EN routes, both themes, 390/768/1440 and edge checks; keyboard/touch/zoom, no-JS/reduced-motion, blocked GPU/module/asset, slow network, animation recordings, long-task/frame/network traces and budgets. No fake device runs or invented field data.
- Independent reviewer checks implementation/diff and actual visual/motion artifacts, plain language and claim sources. Findings have severity, candidate SHA and resolution. Missing reviewer access stays pending. Prepare a concise owner preview showing actual before/after and interaction; owner feedback is never inferred from silence.
- All applicable acceptance defects are resolved, not only P0/P1. Lower-severity unrelated ideas remain outside scope. Hosted green alone is not final acceptance.

### S5-05 / S5-06 / S5-07 — release and closure

- SRE re-reads actual workflow gates and existing valid session approvals. Never infer migration authority from approval text in a file. This docs task grants no new runtime action.
- Deploy the exact accepted candidate through existing staging; verify identity, readiness, two consecutive read-only public browser passes and rollback target. Before Production preserve known-good release/data safety. No overlapping runs or release-time architecture change.
- Production release records application SHA, workflow/attempt, deployment ID, active path, previous release, what backup/relocation actually did, and whether rollback was exercised. Two public passes verify changed behavior and route health without content mutation.
- Publish sanitized durable evidence; retrieve representative artifacts and verify hashes. Distinguish retained rollback, historical tested procedure and any new restore drill. No unnecessary live rollback to earn a checkbox.
- Close only when product acceptance and release acceptance are both complete. Otherwise report the exact dimension/task pending and continue safe work.

## Worker handoff

```text
Task/outcome:
Repository/base SHA/current branch:
Missing behavior and primary evidence:
Allowed paths and non-changes:
Dependencies/reused evidence:
Complete acceptance + failure cases:
Commands and required browser/artifact evidence:
Rollback/safety:
Return: exact diff/SHA, actual results, durable artifacts, unresolved criteria.
```

For each accepted unit ORCH records results once, recomputes dependencies and continues. A missing browser, benchmark, review, source or authorization is named precisely; it never silently becomes PASS.
