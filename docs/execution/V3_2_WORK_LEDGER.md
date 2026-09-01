# V3.2 work ledger — reconciled state

Updated: 2026-09-01. Single writer: ORCH. Task authority: [canonical roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md). This ledger records evidence and uncertainty; it cannot lower acceptance criteria.

## Current verdict

### Implementation complete / performance acceptance failed — 2026-09-01T16:17:30Z

- Task: `EC-01` Three.js connection continuity; executor/session: Codex coordinator with bounded implementation worker.
- Base/candidate: existing PR #26 branch `feat/v3-2-admitted-implementation`, start `72e634bc403c3038b546de10a2ebfca37db8ca2e`; current candidate `589112862e5ad0fcb82238e945614eb4b8656608` on base `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`.
- Proven gap: Three.js `0.185.1` reuses the initial four-vertex `position` buffer in `BufferGeometry.setFromPoints`; six/eight-vertex route states are truncated with a warning and reverse transitions can retain stale vertices.
- Changed paths: deferred Three route geometry/helper and tests; Home initial-chunk artifact verifier/build hook; candidate-bound three-run performance workflow/harness/tests. PR #27 and GR-01 remain separate.
- Reused evidence: PR #26 focused CI-contract tests passed 15/15 at the start SHA; existing topology/lifecycle tests remain regression inputs but do not prove buffer contents.
- Acceptance evidence: actual-Three `4→6→8→4` buffer/draw-range/exact bounds tests; stable buffer/bounds identities; paused/resumed label continuity; fresh build scans all 13 Home initial candidates and excludes deferred Three attribution; performance evidence binds immutable base/candidate SHAs, rejects dirty sources, uses three runs and writes PASS/FAIL/UNVERIFIED JSON. Focused 23/23, type check, lint (0 errors/3 pre-existing warnings), build and independent review PASS. Full suite is PARTIAL: all scoped tests pass; unrelated backup/deploy contract timed out twice at 15 seconds and was not rerun unchanged.
- Hosted performance witness: run `33530073463`, artifact `9809470836`, base `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`, candidate `e5cace271f5bc78aa31508ef601cd65af832b734`. Three-run JSON recorded JS delta `-4142` gzip bytes, candidate median LCP `1136ms`, max lab interaction `33.2ms`, frame p95 `16.8ms`, and nine attributable long-animation frames with blocking duration above `50ms` (maximum `181.734ms`). Verdict remains `FAIL` for the long-animation-frame budget; the frozen base lacks the new scene controls, so candidate `589112862e5ad0fcb82238e945614eb4b8656608` corrects that false `UNVERIFIED` classification without lowering the long-task budget. PR #26 is open and unmerged; no deploy/live claim.

### 2026-08-31 current-state overlay

Rechecked GitHub: main is `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`; DOCS-01/PR #18 is merged. PR #26 is open at `72e634bc403c3038b546de10a2ebfca37db8ca2e`, with substantial new implementation, not accepted/deployed proof. The paired docs PR #28 began this extension at `f7abc0d9041ee0d085cdd1ea8d7b998d07418faa`; companion Audit PR #1 began at `415e9b371aa9721626d46967aaa0f07ed94e9cc1`, both Draft. Fetch current successors before execution.

The source findings and S rows below describe the earlier frozen baseline unless explicitly reconciled to the PR #26 successor. **Do not restart those implementations from the old next-action text.** Retain accepted code/evidence, repair remaining criteria and keep merge/runtime identity separate. This docs update makes no new app-fix, deployment, performance, user-test or ranking claim.

| Current scope | State | Next action |
|---|---|---|
| DOCS-01 | INTEGRATED — PR #18 | Reuse; do not wait or implement again |
| S1–S4 / S5 tooling | PR #26 IMPLEMENTED IN PART / ACCEPTANCE OPEN | Compare actual code/artifacts to criteria; repair only demonstrated gaps |
| EC-01…05 | OPEN — paired implementation/acceptance | Follow current roadmap; preserve #26/#27 and Audit ownership |
| GR-01…06 | OPEN — quality/SEO/content/measurement extension | First current baseline/criteria, then dependency-ready implementation; growth observation later |
| Pair release / search outcomes | UNVERIFIED for new candidates | No inference from main, CI or earlier release |

Task claim/checkpoint fields: ID, executor/session, base and candidate, owned paths, missing criterion, reused evidence and equivalence, exact next action, commands/results, artifacts/hashes, independent review, blockers/retry trigger, merge/runtime/observation status separately. One coordinator writes this ledger. Update only for real state changes; after two identical failed attempts without new evidence, block that action and continue independent ready work.

**Historical Production release: successful. Complete requested public experience: not accepted; implementation and evidence gaps remain.** This documentation revision does not implement animations, install dependencies, benchmark a new candidate or deploy anything.

The [previous ledger at 3c61310](https://github.com/alirezasafaeigfx/alirezasafaeisystems/blob/3c61310acb0253aee537892143a023b8fd2f365c/docs/execution/V3_2_WORK_LEDGER.md) is immutable historical evidence of earlier reports. It contains contradictory task states (including already merged PRs labeled unmerged), an old Gate-A-only ceiling and a blanket S5 DONE. Do not execute that stale queue. The reconciled state below supersedes those operational instructions without erasing the historical record.

## Verified baseline and reusable work

| Item | Evidence / identity | Treatment |
|---|---|---|
| Current application/main baseline | `39c09b43191822d70c30f7fa8ae51dadb36d37b7` | Frozen comparison baseline; re-fetch current main before work |
| R0 scope guard | PR #21 merge `308c2753eabab74d1dc0031fd0e2b76a4fabee39` | Reuse; do not repeat R0 |
| R0 staging smoke correction | PR #20 merge `d1592ac749ad5113f72655c78622e67cbc86516e` | Reuse |
| S1 existing implementation | PR #22 `a7dc295c93efafbf1f37248009283b3dab5bc365` | Extend; reopen only demonstrated acceptance gaps |
| S2 existing flagship | PR #23 `7d331132fc019a63772a5ce7094fb3d1a8c8853b` | Reuse facts/primitives that pass source review |
| S3 existing Discover work | PR #24 `23edc4fb7bd506125127c1eba577996cabe44ec1` | Preserve query/content architecture |
| S4 existing scene | PR #25 `39c09b43191822d70c30f7fa8ae51dadb36d37b7` | Incomplete interaction; retain useful semantic/style foundations |
| Previous successful staging | run `33329913543`, deployment `6170189078`, release `20260830T190829Z` | Historical reported staging receipt; not acceptance of future code |
| Production workflow | [run 33332174608](https://github.com/alirezasafaeigfx/alirezasafaeisystems/actions/runs/33332174608), deployment `6170617220` | Terminal success and two LIVE_VERIFICATION_PASS log markers inspected |
| Production identity | application `39c09b43191822d70c30f7fa8ae51dadb36d37b7`, release `20260830T195659Z`, `/var/www/my-portfolio/releases/production/20260830T195659Z` | Verified workflow release evidence; do not infer later state from main |
| Retained rollback target | `/var/www/my-portfolio/releases/production/20260829T044320Z` | Retained target; not a newly exercised rollback |
| Live verification artifact | ID `9738465513`, expiry recorded `2026-11-28` | Reports artifact, not proof that all owner screenshots were uploaded |

Previous failed-safe staging/rollback and transport evidence remains in the immutable historical ledger. R0-01/02/03A/04 and accepted R0-03B/03C/05A/05B/06 are reuse-only unless a relevant regression is proved. Do not diagnose the formerly slow upload again.

## Audit findings that reopen product acceptance

| Finding | Primary source / observation | Consequence |
|---|---|---|
| Four static nodes; no real five-state scene | `src/components/public/operational-scene.tsx` at baseline; PR #25 | S4-05/06 incomplete |
| Infinite dashed-path motion | `src/app/public-v31.css`: `operational-path 3.2s linear infinite` | Violates finite/no-idle-motion contract; remove in S4-05 |
| Home hierarchy differs from approved order; portrait dominates early | `src/components/sections/homepage-v3.tsx` | Reopen S4-01/02/03 |
| English technical proof labels inside FA UI | `src/components/public/proof-strip.tsx` and related public copy | S1-08 and localized proof required |
| Quantitative record has generic source/review string | `src/lib/evidence.ts` and flagship data, e.g. accepted evidence record | Re-open S1-01/03 and S2-05; obtain real sources or remove claim |
| Discover raw taxonomy/unknown presentation | Current Discover content/components | S3-06 plain-language integrity required |
| Scene test primarily checks presence | `src/__tests__/components/operational-scene.test.tsx` | Not proof of interaction/lifecycle/visual quality |
| Live verifier is route smoke | Workflow reports at desktop/mobile, JS enabled | No full no-JS/a11y/performance/motion acceptance established |
| LHCI uses weaker warning thresholds | `lighthouserc.json`, LCP4s, CLS0.2, performance0.75 | Green job insufficient for product budgets; S5-01 enforcement |
| Existing visual suite mutates content | `e2e/public-v31-visual.spec.ts` | New read-only live suite needed; never run full suite on Production |
| Package edits always enter R0 guard | `.github/workflows/ci-router.yml`, `scripts/ci/validate-r0-pr.mjs` | S4-10 bounded scope correction before runtime dependency PR |

These are source/report findings, not a claim that this review workspace completed a fresh visual browser matrix. Unavailable visual evidence remains unverified.

## Important evidence limits

- The owner reported FA/EN desktop/mobile screenshots in `C:\Users\ASDEV\AppData\Local\Temp\asdev-v3-2-production-ui-39c09b4`. That folder is not independently retrievable here; no claim is made that its images were inspected. Future evidence needs durable links and hashes.
- The production workflow log says `[sqlite-relocation] DATABASE_URL is already absolute; no relocation required`. That proves a no-op at this step, not the separately reported earlier relocation. The backup SHA-256 `62548e9e7d952cd30c6fb547109d3c204f689d9edf7625f03dd1835e21c536fc` remains an owner/executor-reported value until the corresponding restricted verification evidence is retrieved. Do not expose the database to prove it.
- The non-required semantic-release TLS timeout is recorded history, not a visual blocker and not an excuse to rerun Production.
- No claim of field INP, real-device performance, human comprehension testing, complete independent design acceptance or actual new rollback drill is established by the pasted S5 report.

## Earlier baseline state registry — current overlay takes precedence

| Scope | State | Next action |
|---|---|---|
| DOCS-01 | INTEGRATED — PR #18 | Verified merged at `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`; reuse |
| S1-01/03 | REOPENED — provenance gap | Inspect real sources, strengthen publication contract |
| S1-08 | PENDING — DOCS-01 integration | Plain-language FA/EN public surfaces |
| S1-02/04/05/07 | IMPLEMENTED / ACCEPTANCE REVIEW REQUIRED | Reuse satisfactory parts; close copy/action/analytics evidence gaps |
| S2-01/02/05/06 | IMPLEMENTED / PARTIAL ACCEPTANCE | Verify facts and complete documentary/hierarchy after dependencies |
| S3-01/04/05/06 | IMPLEMENTED / ACCEPTANCE REVIEW REQUIRED | Test actual media/copy/publication/SEO behavior; repair proven gaps |
| S3-03 | REUSE CANDIDATE — query regression constraint | Confirm current implementation/evidence before REUSED-DONE |
| S4-01/02/03/05/06 | REOPENED — incomplete required experience | Complete visible composition and meaningful native interaction |
| S4-07 | PENDING | Native benchmark after real implementation |
| S4-10/11/12 | ADMITTED / DEPENDENCY-BLOCKED | Scoped advanced/GPU implementation and measured comparison |
| S5-01 | PENDING — DOCS-01 integration | Early harness; final run after applicable implementation |
| S5-02/03/04 | UNVERIFIED for completed experience | Full candidate matrix, review and current checks |
| S5-05/06/07 | HISTORICAL RELEASE DONE / FUTURE CANDIDATE PENDING | Preserve old release; new release only after product acceptance |

Do not overwrite all S1–S5 rows with DONE based on one release. The current overlay, roadmap dependencies and verified evidence determine ready tasks. The old S1-08/S1-01 starting sequence is historical: reconcile PR #26/#27, reuse its work and repair the first ready missing criterion instead.

## DOCS-01 historical bounded change record — integrated by PR #18

- Base: main `39c09b43191822d70c30f7fa8ae51dadb36d37b7`.
- Proven gap: old agent/rules contradict actual SQLite/tooling/autonomy; roadmap treats Gate A as terminal; ledger confuses release success with experience acceptance; no complete stack/skills/report-inspection contract.
- Scope: root agent contract, project rules/engineering/report review, canonical roadmap/sprints/ledger/prompt, and scoped pointers in existing automation/strategy/memory docs. No application, package, schema, workflow or server changes.
- Existing mission PR: #18, original head `48eb38afe66ab80bbd1767e5240f06bd81d7450a`. Its stale ancestry must be reconciled against current main through a normal merge, preserving main's entire application tree; do not merge old draft files blindly or force-push.
- Reused evidence: actual main/source/workflow/PR metadata; prior reports explicitly labeled where not independently reproduced.
- Acceptance: complete diff limited to intended docs; internal links/actual source paths and task dependencies checked; contradiction/permission review; independent reviewer findings addressed; current hosted checks and remote readback. Actual results belong in PR evidence, not invented here before execution.
- Rollback: normal revert of the coherent documentation integration; no runtime rollback or data operation.

## Update protocol

For a meaningful change record: UTC; task IDs; prior/new state; owner; exact base/candidate/merge SHAs; paths; acceptance matrix; real commands/exits/counts; artifact URLs/hashes; reviewer/type; failures/limitations; rollback; next dependency.

`READY` means dependencies are satisfied, `IN_PROGRESS` means implementation started, `REVIEW` means verification/disposition pending, `DONE` requires every applicable criterion, `REUSED-DONE` requires valid existing implementation/evidence, `PARTIAL`/`FAIL`/`UNVERIFIED` state the actual gap, and `BLOCKED` names the precise unavailable prerequisite. Program acceptance and release status remain separate.
