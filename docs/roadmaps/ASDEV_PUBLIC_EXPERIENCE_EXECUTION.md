# ASDEV public experience — canonical execution roadmap

Revision: 2026-08-31.2, owner-requested paired quality and search leadership. This is the **only task selector for this public-experience/quality/growth mission**. [Existing task cards](../execution/V3_2_AGENT_SPRINTS.md) and [quality/growth cards](../execution/QUALITY_GROWTH_SPRINTS.md) explain execution; [ledger](../execution/V3_2_WORK_LEDGER.md) records actual state; [engineering guide](../engineering/PUBLIC_EXPERIENCE_ENGINEERING.md) defines implementation and measurement.

## 1. Outcome, not a release checklist

### Shared objective and measurable quality

Both sites must aim at the best international quality in UI/UX, plain Persian, useful complete behavior, accessibility, speed, trust and SEO, and become leading choices for their actual Iranian audiences. The [shared quality/growth contract](../strategy/PAIRED_QUALITY_GROWTH_CONTRACT.md) makes these outcomes testable and separates code acceptance, verified release and observed market/search results. Rank #1 is an ambition for named relevant queries, never a guarantee or a build acceptance claim.

This revision extends existing work; it does not reset S/EC tasks. Preserve the separate Audit product/queue, the existing frameworks/data stores and the owner's art direction. The complete quality matrix applies to changed product surfaces; a docs or harness unit is assessed for its own scope.

### 2026-08-31 paired-product extension

The owner has explicitly included `alirezasafaeigfx/auditsystems` as the complementary product. Apply [paired experience contract v2](../engineering/PAIRED_PRODUCT_EXPERIENCE.md) without replacing S1–S5. At this revision's GitHub recheck, main remains `2fe4988`; implementation PR #26 is open at `72e634b`, with real but not fully accepted evidence. PR #27 addresses the unreliable dependency audit. Paired docs are the existing ASDEV #28/Audit #1 drafts, not another implementation. Reconcile current state before continuing; no restart of completed implementation and no claim it is already deployed.

| ID | Outcome | Dependency / ownership |
|---|---|---|
| EC-01 | Reconcile both candidates, security/truth blockers and CI | Existing #26/#27 + Audit AU-01/AU-02; safe design work may proceed |
| EC-02 | Shared visual family, simple Persian, focused Audit UI | Reuse S1-08 and S4; Audit AU-03; does not wait for deployment |
| EC-03 | One form owner per intent and language-safe round trip | EC-02; S1-04/07; Audit AU-04 |
| EC-04 | Trustworthy report and clear implementation handoff | Audit AU-02/AU-05/AU-06; main S1-01/S2-05 |
| EC-05 | Exact paired acceptance and separate governed releases | EC-01…04 plus existing S5 conditions; Audit AU-07 |

### Quality and growth extension — no duplicate task IDs

| ID | Complete outcome | Dependencies / reuse |
|---|---|---|
| GR-01 | Current-state reconciliation, bounded reference/intent baseline, enforceable new criteria | Current paired working spec; reuse PR #26/S5-01 tooling; Audit AU-08 |
| GR-02 | Crawl/index, canonical/locale, metadata/schema and internal-link integrity | GR-01 inventory; reuse S3-06; Audit AU-09 |
| GR-03 | Substantive plain Persian service/flagship content and two useful supporting drafts | GR-01; reuse S1-08/S2-05/S3-05; publication after GR-02 |
| GR-04 | Complete service/Discover/case-study visitor tasks with failure recovery | GR-01, EC-03/04; reuse S2/S3; Audit AU-11 |
| GR-05 | Existing analytics verified; reproducible privacy-safe measurement/scorecard | GR-01, EC-03 semantics; reuse S1-07; Audit AU-12 |
| GR-06 | One evidence-based search/product improvement and an honest observation checkpoint | GR-02…05 implementation; actual release/data for outcome claims; Audit AU-13 |

New task implementation status: OPEN. Detailed paths, steps, negative cases, commands, ownership and rollback are in the quality/growth cards. GR-01 explicitly admits bounded criteria-validator/scope-guard extensions where necessary, with negative tests and unchanged safety boundaries; it does not authorize false S4 IDs or a blanket package upgrade.

The updated final product-candidate matrix (`S5-02`/`EC-05`) also requires applicable GR-01…05 implementation evidence and Audit AU-08…12. GR-06/AU-13 field observation follows readiness/release and does **not** create a circular dependency or hold technical acceptance hostage to future traffic. Report pending owner/user/field observations explicitly.

Cross-repository task references identify required peer implementation inputs or paired ownership, not a mutual release gate: local S5 candidate/release can proceed on compatible accepted inputs without waiting for AU-07 closure; AU-07 does not wait for EC-05 closure. EC-05 is the final aggregate of both release receipts and the working round trip.

The supporting contract contains task cards, paths, acceptance and four outcome batches. Audit executes its local queue. EC-05 is required for paired-program closure; it does not retroactively erase historically verified single-site releases. Do not mutate existing work-ledger evidence merely to reflect this planning revision.

Create a distinctive, polished interactive site that makes engineering understandable to an ordinary Iranian visitor. Within the first viewport the visitor can understand what help is available and take the next step. The visual signature is a system under pressure becoming understandable, repaired and supported by evidence. Technical depth is optional; primary Persian is simple, natural and respectful.

The owner's references inform authored typography, spatial continuity, purposeful motion and dedicated mobile behavior. Awards, “world-class” and numerical design scores are aspirations, not verifiable deliverables or guarantees. Do not copy reference sites or hide essential information behind a game/loader.

**Smallest complete solution** means satisfying every accepted outcome while avoiding unrelated work. It never means delivering a token SVG, a hover effect or only infrastructure checks.

## 2. Baseline and acceptance correction

Application baseline: `39c09b43191822d70c30f7fa8ae51dadb36d37b7`. Production workflow [33332174608](https://github.com/alirezasafaeigfx/alirezasafaeisystems/actions/runs/33332174608) succeeded; release `20260830T195659Z`. Preserve it while developing the next candidate.

The previous ledger's S1–S5 blanket DONE claim is superseded **for product acceptance**, not erased from history. Actual source shows a static four-node scene plus an infinite dashed-line animation, no five-state interaction, mismatched Home order, English technical proof labels in Persian, and evidence records without retrievable primary sources. Successful live smoke does not establish composition, motion, comprehension, accessibility or performance.

Keep R0 governance/transport/staging work and PRs #20–#25 as historical implemented/reusable work. Do not repeat R0 or redeploy the old candidate to manufacture activity. [Ledger](../execution/V3_2_WORK_LEDGER.md) separates observed facts, reported history and remaining evidence gaps.

## 3. Current admission decisions

- Native DOM/SVG/CSS/WAAPI is the complete semantic foundation, **not the final quality ceiling**.
- `S4-10` now admits a bounded Anime.js v4 evaluation and necessary dependency-scope CI correction. `S4-11` admits one deferred Three.js signature prototype. These are authorized roadmap tasks, not speculative future preparation. Exact dependency versions are selected from official compatibility/license/security evidence during implementation.
- `S4-12` decides adoption from working prototypes, inspected recordings and measured budgets. No library installation or production adoption is claimed by these documents. If 3D fails, record what failed and repair/simplify; do not silently rename the missing outcome DONE. A native-only final direction requires an explicit owner scope decision on the prepared comparison.
- Former `S4-04` remains absorbed into `S4-06`; `S4-08`/`S4-09` remain historical IDs, not repurposed tasks. This revision introduces distinct IDs `S4-10` through `S4-12`.
- No site-wide GPU/game architecture, WebGPU-only path, framework/database/auth/deployment migration, paid dependency or broad refactor is admitted.
- Owner review happens on complete reviewable results, not at every routine implementation step. Continue independent ready tasks while final feedback is pending.

## 4. Required composition and behavior

Home: Header → Hero + system narrative → Verified proof → dominant flagship → Services → Selected work/Discover → Founder → assessment CTA → Footer.

Move the portrait to Founder. Give the flagship `infrastructure-localization-rescue` a strong preview and a complete documentary: Incident → Constraint → Before → Diagnosis → Intervention → After → Evidence → Trade-offs → Verification → assessment CTA. Real facts and conceptual explanations must be visibly distinguishable.

Scene states: pressure → diagnosis → intervention → stable → evidence. Each state changes meaningful geometry/path/emphasis and explanatory copy; the same topology continues from the scene into the evidence diagram. Keyboard/touch controls, backtracking and optional pointer exploration work without hijacking scroll. Mobile has its own reading order, compact art and controls. Reduced motion, no JS and blocked GPU preserve the narrative and action.

Primary CTA: «درخواست بررسی سایت». Do not imply free/instant service without authority. Main copy explains problem, benefit and next action; jargon and raw taxonomy are not primary labels. FA/EN have equal content quality.

## 5. Active task registry

Status at this revision is recorded in the ledger. The table defines scope/dependencies; it does not assert future work passed. Original `DOCS-01` was integrated by PR #18 at `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`; do not treat it as waiting or repeat it. These original dependencies remain satisfied where verified; paired extensions use the current owner-requested working spec and normal integration policy. Existing task IDs retain their concern.

| ID | Complete outcome | Dependencies |
|---|---|---|
| S1-01 | Evidence registry rejects unsupported quantitative publication; retrievable sources and review | DOCS-01 |
| S1-02 | Clear bilingual Hero positioning and one H1 | S1-08 |
| S1-03 | Proof strip contains only substantiated facts; optional localized detail | S1-01, S1-08 |
| S1-04 | One clear assessment route and truthful CTA through Home/header/footer | S1-02 |
| S1-05 | Simple public navigation; no premature Blog promotion | S1-08 |
| S1-07 | Existing analytics funnel verified without live test submissions | S1-04 |
| S1-08 | New: plain-language FA/EN content contract applied to primary surfaces | DOCS-01 |
| S2-01 | Readable, accessible before/after, timeline and evidence primitives | S1-01, S1-03 |
| S2-02 | Flagship documentary integrated with the scene's truthful narrative | S2-01, S4-06 |
| S2-05 | Independent claim-by-claim provenance verdict | S2-02 |
| S2-06 | Flagship-first case index, supporting projects secondary | S2-02 |
| S3-01 | Useful stable media at slow network; meaningful loading/error states | S1-08 |
| S3-03 | Preserve URL query/filter/pagination; regression only | DOCS-01 |
| S3-04 | Blog nav honestly follows readiness | S1-05 |
| S3-05 | Blog publication readiness contract; no filler publishing | DOCS-01 |
| S3-06 | Localized taxonomy/empty/error states, metadata/hreflang/schema/sitemap integrity | S1-08, S3-03 |
| S4-01 | Approved Home order, editorial hierarchy and dominant flagship preview | S1-02, S1-03, S1-04 |
| S4-02 | Bilingual typography/measure/spacing and coherent visual vocabulary | S4-01 |
| S4-03 | Authored mobile/tablet composition and edge-width resilience | S4-02 |
| S4-05 | Finite, meaningful motion vocabulary and complete reduced-motion states | S4-03 |
| S4-06 | Real five-state scene, controls, continuity and lifecycle | S4-05, S1-01 |
| S4-07 | Measured native-scene baseline and identified advanced-motion needs | S4-06 |
| S4-10 | Scoped CI/dependency admission and bounded advanced-motion implementation/evaluation | S4-07 |
| S4-11 | One actual Three.js signature prototype with the same semantic model | S4-10 |
| S4-12 | Inspected native/advanced/GPU comparison; adopt complete measured direction | S4-11 |
| S5-01 | Real acceptance harness, evidence validator and strict performance enforcement | DOCS-01; final run after S1–S4 applicable tasks |
| S5-02 | Exact-candidate FA/EN visual, motion, a11y, fallback and performance matrix | S5-01, S2-05, S2-06, S3-01, S3-04, S3-05, S3-06, S4-12, S1-07 |
| S5-03 | Independent code/truth/design review and owner visual disposition | S5-02 |
| S5-04 | Required hosted checks on actual final integration candidate | S5-03 |
| S5-05 | Exact candidate governed staging + two read-only public passes | S5-04 |
| S5-06 | Governed Production release, identity, prior release and rollback truth | S5-05 |
| S5-07 | Two Production passes, final evidence retrieval and honest closure | S5-06 |

Absorbed historical IDs: S1-06→S1-04; S2-03/S2-04→S2-01; S3-02→S3-01. Do not revive them as duplicate implementations. Existing satisfactory outcomes may be marked `REUSED-DONE` only after checking actual scope and valid evidence.

## 6. Execution sprints

These are outcome batches, not new task IDs, schedules or invented duration estimates. Tests and evidence are produced inside each batch, not postponed to the last sprint.

| Sprint | Tasks / work | Exit evidence |
|---|---|---|
| 1 — clarity and truth | S1 tasks; start S5-01 harness | Actual first viewport, plain-language review, supported proof, functional assessment path |
| 2 — art direction and mobile | S4-01/02/03 | Real route before/after, FA/EN at 390/768/1440, portrait moved, flagship hierarchy |
| 3 — meaningful native motion | S4-05/06/07 | Five-state recording, state/keyboard/touch tests, reduced/no-JS, idle/performance baseline |
| 4 — advanced motion and spatial signature | S4-10/11/12 | Version/license decisions, guard negative tests, measured real GPU prototype and comparison |
| 5 — documentary and discovery | S2/S3 remaining tasks | Honest narrative/diagrams, mobile detail, localized discovery, route/query/SEO checks |
| 6 — acceptance and release | Finish S5-01 then S5-02…07 | Full candidate evidence, independent/owner disposition, governed exact release and rollback |

The six rows above preserve the original implementation breakdown and completed evidence, not a command to replay it. For the **current paired run**, use these outcome batches:

| Current batch | ASDEV work | Audit counterpart | Exit |
|---|---|---|---|
| 1 — real state, safety and truth | Reconcile #26/#27, EC-01; GR-01 | AU-01/02/08; AU-06 failure reproduction where independent | Proven fixes, current criteria/baseline, no invented PASS |
| 2 — clear identity and visitor paths | Remaining S1/S4 composition, EC-02/03; GR-02 preparation | AU-03/04/06; AU-09 | Real coherent FA/EN pages and non-looping journey |
| 3 — distinctive and useful product | Complete admitted motion/flagship/Discover; EC-04; GR-03/04 | AU-05/10/11 | Complete useful content/results, inspected interaction and recovery |
| 4 — measurement and acceptance | GR-02/05, final S5-01…04 | AU-09/12 and AU-07 candidate checks | Raw measurements, SEO/privacy/truth matrix, independent review and prepared owner preview |
| 5 — independent governed release | S5-05…07, EC-05 | AU-07 release | Exact identities, compatible round trip and honest rollback status |
| 6 — observed improvement | GR-06 | AU-13 | Bounded evidence-based improvement or AWAITING_OBSERVATION |

These are complete outcome batches, not date promises. GR-02/05 and non-overlapping design/content may start early; existing satisfactory outcomes are reused. ORCH alone integrates and writes the ledger. Do not create another daily backlog or make security fixes wait for SEO research.

## 7. Acceptance and stopping

Use project budgets in the engineering guide: LCP ≤2.5s, CLS ≤0.1, field INP p75 ≤200ms when available (otherwise explicit lab proxy), Gate A initial JS delta ≤30 KiB gzip, no attributable >50ms long task and no idle rendering. Every advanced/GPU task also meets its deferred-code/asset budgets. A green legacy Lighthouse warning is not proof.

Final acceptance requires actual routes, meaningful interaction/recordings, readable copy, durable artifacts, exact identities, accessible fallbacks, independent review and owner visual disposition. Report implementation, experience, copy, a11y, performance, provenance and release separately. Never call retained rollback “tested,” lab latency “field INP,” or a listed screenshot “inspected.”

Continue automatically through safe ready work. Stop only the affected lane for unavailable access, a genuinely missing applicable runtime authorization, destructive/security/data risk, unavoidable unadmitted architecture, or no remaining safe admitted work. Do not invent new maintenance queues when finished. An acceptance failure is a repair task within its existing concern, not permission to weaken the requirement.
