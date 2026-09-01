# ASDEV + Audit Systems — paired experience contract v2

Date: 2026-08-31. Owner-requested scope: `alirezasafaeigfx/alirezasafaeisystems` and `alirezasafaeigfx/auditsystems` only.

This is a supporting design/acceptance contract. The [public-experience roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md) remains this repository's only public-experience task selector. Audit has its own implementation queue. Neither agent may silently mark the other product complete. These documents prepare work; they do not claim new UI or runtime changes.

Version 2 adds the [quality and search leadership contract](../strategy/PAIRED_QUALITY_GROWTH_CONTRACT.md) without changing the route/attribution wire contract below. Read its quality matrix, intent ownership, honest ranking/measurement rules and resumption boundaries. GR-01…06/AU-08…13 are local extensions; existing EC/AU/S work is reused. Final paired implementation acceptance includes applicable new quality criteria; later search observation is separate from release acceptance.

## Product relationship and non-goals

ASDEV explains the service, demonstrates credible work and accepts implementation enquiries. Audit checks websites, explains findings and accepts specialist assessment requests. Together they support: understand the problem → request the appropriate check → understand the result → request help fixing it.

Use one visual family and clear navigation between two independent products. Keep ASDEV's authored editorial/spatial narrative; give Audit a focused, readable working interface. Do not duplicate an immersive scene inside every Audit form/report or make users complete an animation before starting.

No repository/DB merger, shared authentication rollout, framework migration, paid tool requirement, tracking activation, bulk dependency upgrade or change to a third product is included. Keep ASDEV SQLite and Audit PostgreSQL. Separate releases must remain backwards compatible; no simultaneous-deploy dependency.

## Observed baseline, not acceptance

| Surface | Observed 2026-08-31 | What this proves |
|---|---|---|
| ASDEV main | `2fe4988841a36c7f4eaf1da47fb5bffe22d00547` | PR #18 contract integrated; not new UI deployed |
| ASDEV PR #26 | `72e634bc403c3038b546de10a2ebfca37db8ca2e`, open | Real Anime.js transitions and deferred Three.js implementation exist; retain this work |
| PR #26 evidence | Actions artifact `9766254690`, SHA-256 `a22c63973d5e7e102ae0addf280882163f9604bf85ea84ba419eaf0d6c7b945f` retrieved and matched | Contains real screenshots/recordings; draft manifest has empty commands/criteria/artifacts/reviews and fails its validator |
| ASDEV security | PR #27 open; PR #26 audit job logged `unknown=30` with success | Green legacy dependency audit is insufficient; do not bypass remediation |
| Audit main | `0fb6edcc483a701b0904c5d0aa38a8b3ab9dbf9a` | Source baseline only; latest main-gate `33386286948` queued and main unprotected at inspection |
| Public health | Both sites returned 200 for GET health/readiness | Reachability at observation time, not release identity, correct scoring, payment/worker E2E or rollback proof |

PR #26 remains implementation/acceptance work, not a reason to restart S1–S4. Exact deployed SHAs were not established by the public health responses. Do not infer them from main. Private access-control review details are deliberately not reproduced in public documentation; the isolated regression/remediation scope is in Audit's safety task.

## Route and ownership contract

These are target behaviors, not assertions that the current routes implement them.

| Intent | User-facing Persian | Owning surface | Required behavior |
|---|---|---|---|
| Quick automated check | بررسی خودکار سایت | Audit `/audit`, EN `/en/audit` | URL input → real queue state → result/error; clarify limited scope. Keep free claims only with verified entitlement |
| Specialist assessment | درخواست بررسی تخصصی سایت | Audit `/qualification`, EN `/en/qualification` | One form; disclose what is stored and that a person reviews the request |
| Help with implementation | برای رفع مشکل کمک می‌خواهم | ASDEV `/qualification?offer=implementation`, EN equivalent | Reuse ASDEV enquiry form for implementation, not a second competing assessment form |
| Inspect an example | نمونه گزارش را ببین | Audit `/sample-report`, EN equivalent | Clearly labeled fictional example; never preload a fictional target as the visitor's real website |
| Inspect actual work | نمونه کارها | ASDEV case studies | Link to a matching documentary; do not label a generic index as a specific Audit case study |

ASDEV's primary «درخواست بررسی سایت» action must reach Audit's specialist path directly, with a short destination explanation where helpful. Existing ASDEV `/qualification` links without `offer=implementation` become a backwards-compatible, clear assessment bridge; do not remove the historical route or show two indistinguishable forms. Existing implementation API/data remain intact. The audit-to-ASDEV return goes to the implementation enquiry, never home followed by another compulsory trip to Audit. Preserve direct implementation enquiries without requiring a report first.

### Safe attribution and language

- Reuse `source`, `placement`, `offer` fields plus locale-appropriate paths. Add a validated paired adapter, not a new analytics system: current handlers mainly length-bound strings and interpret UTM aliases differently. Pair-generated values use `source=portfolio|audit`, `offer=request_assessment|implementation|sample_report`; allow placements `header|header_mobile|hero|footer|final|qualification|report|sample_report|case_study|thank_you|services|audit_readiness`. Retain legacy `direct` source when no origin is known; do not relabel it as a referral.
- Preserve valid origin/placement across the bridge instead of overwriting every visitor as `placement=qualification`. Explicit valid `source`/`placement`/`offer` take precedence. Normalize legacy `utm_source` to source; use recognized `utm_content` as placement first, then recognized `utm_medium` (Main previously used medium, Audit content). Ignore unrecognized/oversized values and fall back to the actual current surface. Existing third-product consumers keep their existing validation/behavior outside this paired adapter; no expansion of this mission to those products. Add tests for both legacy schemes and precedence before replacing callers.
- No email, phone, private target URL, report content, report access token, password or session identifier in cross-domain URLs/events. Do not invent an unauthenticated report lookup to pass context. Contact/report attachment remains explicit and consented.
- Reject unexpected destinations, schemes, enum values and oversized values. Never support arbitrary `returnUrl` redirects as part of this change.
- FA and EN stay in the selected language through entry, form, errors, success and return. External links must not all hardcode Persian destinations. Stay in the same tab by default; label any intentional new tab.
- Reuse consent behavior. No new live tracking or production form submission to demonstrate a funnel. Test attribution against local/disposable endpoints and count navigation separately from successful submission.

## Shared UI/UX and plain-language system

| Shared principle | ASDEV application | Audit application |
|---|---|---|
| Identity | Existing AS mark, owner identity, restrained blue/ink palette | Clearly show Audit as the website-checking product from the same maker |
| Typography | Existing self-hosted Vazirmatn, editorial hierarchy | Same Persian family; readable report/body density and equivalent EN typography |
| Tokens | Extend current Tailwind/CSS variables | Map matching color, spacing, radius, focus and motion roles to existing CSS variables; no Tailwind migration |
| Composition | Signature narrative and dominant flagship | One primary action, short three-step explanation, useful report preview; remove duplicate same-destination CTAs |
| Motion | Existing five-state scene + admitted spatial prototype | Finite state feedback for validation/progress/result and disclosure; no fake percent-complete, ambient loop or mandatory WebGL |
| Report reading | Credible real-world documentary | First: what is wrong, why it matters, what to do next; optional technical evidence below |
| Accessibility | Keyboard, reduced-motion and semantic fallback | One main landmark, labeled inputs, error focus, live status, visible focus, clear retry; severity never color-only |

Do not standardize styles by copying whole components across incompatible stacks. A versioned token-role mapping and same acceptance checklist are sufficient until actual duplication warrants a shared package.

Primary language is simple, respectful conversational Persian. Examples: «بررسی هنوز تموم نشده»، «این بخش بررسی نشده»، «درخواست ثبت نشد؛ دوباره تلاش کن»، «برای رفع مشکل کمک می‌خواهی؟». Avoid raw `SUCCEEDED`, `EXCELLENT`, `qualification`, internal workflow labels and technical English in primary Persian. Put technical codes, headers, measurement methods and severity rationale behind «جزئیات فنی». Keep real product names when needed.

No static “99% uptime”, “complete security”, guaranteed two-minute completion, unsupported conversion numbers or promises based on fictional reports. State measured results with period/method; when coverage is absent, say not measured rather than 100/100. A missing defensive header is not by itself proof of an exploitable vulnerability.

## Coordinated execution units

These EC IDs extend the existing roadmap; they do not renumber S1–S5 or supersede the existing security PR.

### EC-01 — Reconcile current candidates and real blockers

Main owner: existing PR #26/#27 executors. Audit owner: AU-01/AU-02 in its own roadmap. Review this contract's baseline against current GitHub before editing.

- [ ] Preserve PR #26 changes; produce corrected dependency audit and an exact-candidate accepted evidence package. Review the still-technical qualification page under S1-08/S1-04.
- [ ] Repair `system-core-3d.tsx` connection geometry when states change vertex counts; test actual rendered edges/buffer content and renderer warnings, not only `data-scene-topology`. The inspected evidence-state image leaves its evidence node disconnected.
- [ ] Connect the controlled three-run performance comparison to the actual acceptance workflow and retain raw baseline/candidate output. Current hosted absolute-byte measurements and loose Lighthouse warnings do not prove the required budgets. Carry the recognizable diagram into the flagship; stage labels alone do not satisfy S2-02 continuity.
- [ ] Audit fixes its verified access/scoring/coverage defects and establishes a running quality gate. No live probing of customer reports or runtime settings changes through this docs PR.
- [ ] Record source SHA, CI result, runtime identity and acceptance independently. No blanket DONE or guessed test count.

Exit: named blockers fixed with behavioral evidence, or precisely marked BLOCKED/UNVERIFIED. This does not block independent design/copy preparation.

### EC-02 — Implement one coherent visual family

Main paths: `src/components/sections/homepage-v3.tsx`, `src/components/layout/`, `src/app/public-v31.css`, `src/lib/home-content.ts`; reuse S1-08 and S4-01/02/03/12. Audit paths are mapped in its engineering guide.

- [ ] Produce a side-by-side real-route preview for Home, specialist request and representative report at FA/EN 390/768/1440 in light/dark themes.
- [ ] Keep authored ASDEV composition and improve spatial art direction from the existing prototype; several basic solids alone are not acceptance of the intended signature.
- [ ] Audit gets the same family, concise navigation, one primary CTA and readable outcome-first reports. Check 360px edge width and touch/keyboard interaction.
- [ ] Inspect screenshots and interaction recordings; repair overlap, clipping, RTL order and motion/fallback errors before requesting owner visual disposition.

Exit: reviewed real previews, not a moodboard, mockup, source-string check or newly approved snapshots without inspection. Final artistic approval remains an owner disposition after a complete reviewable result.

### EC-03 — Complete the round trip without duplicate forms

Main paths: `src/app/qualification/page.tsx`, `src/components/sections/infrastructure-lead-form.tsx`, `src/components/layout/header.tsx`, `footer.tsx`, `src/components/sections/homepage-v3.tsx`, existing analytics helpers. Tests: extend relevant component tests; add `e2e/paired-journey.spec.mjs` as needed.

- [ ] Write behavior tests for assessment entry, implementation entry, legacy bridge, FA/EN preservation, allowed origin fields and rejected unsafe destinations. Demonstrate each missing behavior before fixing it.
- [ ] Implement the route table with the existing locale and tracking helpers. Preserve working API/data contracts and existing form consumers.
- [ ] Run the paired journey locally against both built apps or deterministic companion stubs; additionally inspect actual companion routes without submitting live forms. A stub-only pass is not final integration acceptance.
- [ ] Test direct links, browser Back, unavailable destination, consent denied, invalid/oversized attribution and failure/retry. Do not expose tokens in screenshots/traces.

Exit: one clear owner per intent and complete language-safe round trip, verified against both candidate SHAs. Audit can be deployed first because it preserves its current entry routes; ASDEV then changes links after destination verification.

### EC-04 — Trustworthy result and understandable next step

Audit owns AU-02/AU-05; ASDEV owns honest case-study/CTA alignment under existing S1-01/S2-05. No score redesign in this repository.

- [ ] Display measured, uncertain and not-checked findings distinctly; report/PDF/comparison agree. Additional failures cannot improve the score.
- [ ] Put the top issues and a useful next action before detailed technical output. Sample and actual report use the same conceptual layout but never share fictional facts.
- [ ] Report-to-implementation CTA uses the safe route table; no private data in query strings.

Exit: representative empty/partial/failed/completed reports, authorization states and next actions exercised with disposable fixtures; independent truth/copy review.

### EC-05 — Paired acceptance and independent release

Depends on EC-01…04 acceptance plus existing main S5 conditions and Audit's applicable release gates. Files: current evidence manifest, release runbooks and per-product ledgers only.

For the updated candidate, include GR-01…05 and AU-08…12 criteria where applicable. Do not require future GR-06/AU-13 ranking observations for a code/release verdict, and do not report those observations as passed when unavailable.

Dependency interpretation: local candidate acceptance uses the peer's required **implementation/API/route inputs**, not the peer's completed release/closure task. AU-07 does not wait for EC-05 to finish, and ASDEV staging/production does not wait for Audit program closure. Each product may release an accepted backwards-compatible candidate under its own gates; EC-05 records final pair closure only after both release receipts and round-trip evidence exist. No circular EC-05↔AU-07 gate.

- [ ] Record both exact candidates and both deployed identities. Preserve distinct source/build/workflow/runtime SHAs.
- [ ] Verify FA/EN 390/768/1440, 360px edge, keyboard, reduced motion, no-JS essential path, slow/error states and dark/light contrast. No full mutating E2E suite against Production.
- [ ] Measure LCP ≤2.5s, CLS ≤0.1 and field INP p75 ≤200ms when available; otherwise label lab interaction proxy. ASDEV retains its stricter current JS/GPU budgets. Audit publishes baseline/current transfer size; no new graphics runtime for routine form/report UI.
- [ ] Store non-expiring sanitized evidence with hashes and accepted independent review. A 14-day Actions artifact is useful working evidence, not durable final closure.
- [ ] Release each product only through its applicable authorization and checks, with previous release identified and rollback status stated honestly. Verify the round trip after each release and after both; if counterpart is unavailable, show a clear fallback without duplicate submission.

Exit: acceptance matrix passes for both products. One site's green CI/health cannot close the other site's task. Retained release is not a tested rollback.

## Existing sprint grouping and resumption

1. Safety/truth: EC-01; Audit AU-01/AU-02. Start safe EC-02 copy/design work concurrently without modifying overlapping paths.
2. Paired visible experience: EC-02 and Audit AU-03, building on PR #26 instead of starting over.
3. Usable journey and reports: EC-03/04 and Audit AU-04/05/06.
4. Acceptance/release: EC-05 and existing S5, with exact pair evidence and owner visual disposition.

These are outcome batches, not delivery-date promises. Every implementation report names applicable task IDs, changed paths, actual commands/counts, artifacts, independent review, gaps and next ready action. This coordination revision alone does not mark any EC/AU implementation task complete.

For the owner's expanded quality/SEO/content mission, the canonical roadmap's six current paired batches extend this original grouping. Use [the paired execution prompt](../../prompts/codex/PAIRED_SITES_YOLO_LOOP.md); do not replay a completed batch or create an infinite traffic-wait loop.
