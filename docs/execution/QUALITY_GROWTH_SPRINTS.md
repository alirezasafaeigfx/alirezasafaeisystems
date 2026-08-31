# ASDEV quality and growth — execution cards

> For agentic workers: execute the existing plan task by task with the available executing-plans workflow; use independent review when available as required by AGENTS.md. Do not start another brainstorming cycle or install an unavailable agent to read this file.

Goal: extend the real ASDEV public experience into a useful, discoverable Persian service site with measurable progress toward category leadership.

Architecture: retain the current application, content and analytics systems; complete S/EC tasks and add only proven SEO/content/utility/measurement gaps. Audit has separate AU tasks and releases.

Tech stack: current locked Next.js/React/TypeScript, Tailwind, Prisma/SQLite, Vitest, Playwright/axe and existing analytics. No framework/DB/CMS replacement.

Spec: [shared quality/growth contract](../strategy/PAIRED_QUALITY_GROWTH_CONTRACT.md). Task selector: [canonical roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md). Status: [existing ledger](V3_2_WORK_LEDGER.md). These cards are not another queue.

## Global execution rules

Every card inherits the shared matrix and existing engineering budgets. For a code change: identify the missing behavior, establish a failing case, make the complete correction, run focused tests, inspect the built route, repair, review and integrate through required checks. Style/copy uses real visual/content verification; do not add tests that only mirror CSS or text strings. Docs/baseline work uses source, link and consistency checks, not a pretend app test.

Before starting, bind the task to exact existing files at the selected candidate. Paths marked **new if absent** are proposed artifacts, not claims that tools/tests already exist. Preserve a better existing equivalent and record its mapping once. Complete deliverables and tests are part of each task, not deferred to a final cleanup sprint. One coherent PR can cover tightly coupled mapped tasks.

## GR-01 — Reconcile, benchmark and make the new criteria enforceable

Owner: Codex coordinator with QA/SEO capability. Dependency: current paired docs accepted or explicitly used as the owner's working spec; no deployment dependency. Paired reference: Audit AU-08.

Files: existing ledger; `scripts/ci/validate-public-experience-evidence.mjs` and its `tests/ci/` tests **when present in the actual PR #26 successor**; scope preflight only if the new IDs require explicit admission. **New if absent:** `docs/quality/BASELINE.md` and `docs/quality/SEARCH_INTENTS.md`.

- [ ] Fetch actual main/open PRs; map each S/EC/GR criterion to merged, implemented-unaccepted, missing or blocked evidence. DOCS-01 is PR #18, not a new implementation task. Preserve the existing PR #26/#27 work and historical release; verify the current head before reusing a result.
- [ ] Record baseline routes, same-task reference comparisons (three relevant Persian + three international), source dates, missing measurements and 12 priority intent groups under the shared contract. The route owner map must agree with Audit AU-08. No keyword volumes or rank claims without sources.
- [ ] Translate each applicable new criterion into the current evidence schema and validator. Reject unknown task IDs, missing criteria, fake/expired artifact references, mismatched candidate, self-review as independent, lab INP as field and missing growth sources labeled PASS. Separate implementation/release acceptance from field-observation status; do not require future ranking data to accept a code-only unit.
- [ ] If the current scope guard rejects a necessary admitted concern, add a separately bounded explicit allowlist and negative tests; preserve unrelated-path/security/deployment protections. Do not use fake S4 task IDs, disable validation or broaden R0. Most SEO/copy work uses existing dependencies and needs no package change.
- [ ] Run the actual validator tests and validate both a deliberately invalid fixture and a valid scoped fixture. A synthetic schema fixture is labeled synthetic and is never the product's acceptance record. Inspect the diff and reviewer findings.

Exit: reconciled current queue, bounded real baseline and strict criteria validation. Benchmarking is one initial pass; start the next proven implementation gap in the same run when safe. Rollback: docs/validator revert with tests; no runtime or schema change.

## GR-02 — Crawlable, coherent technical SEO

Owner: SEO/FE. Dependencies: GR-01 route/intent inventory; reuse S3-06. Audit owns AU-09 separately.

Files: `src/lib/seo.ts`, `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, existing service/case-study/Discover/blog metadata; `src/__tests__/seo/sitemap.test.ts`, `src/__tests__/seo/service-schema.test.ts`. **New if absent:** `e2e/seo-public-contract.spec.ts`.

- [ ] Establish a route matrix for root, service detail, flagship, Discover list/detail/query variants, published blog and utility/private/admin routes. Record expected HTTP status, canonical, robots, alternate locale, sitemap membership and structured-data type. Reuse current slug/query behavior; do not mass-redirect working URLs.
- [ ] Add negative cases for localhost/staging canonical, missing translated page, unpublished item in sitemap, fabricated modification date, query duplicate, broken internal link, soft 404 and schema facts not visible on the page. Test the HTTP/rendered output as well as helpers.
- [ ] Repair only demonstrated gaps using current SEO helpers. Important text/actions stay in server-rendered semantic HTML without 3D/JS. Distinct ASDEV/Audit jobs keep distinct canonicals; reciprocal alternates reference only actual equivalent translations.
- [ ] Run `pnpm exec vitest run src/__tests__/seo/sitemap.test.ts src/__tests__/seo/service-schema.test.ts`, build and the new browser test after creating it. Inspect built sitemap, robots, response headers and rendered metadata on all route templates. Keep a crawl report with checked URLs and failures; do not claim Google indexed a route from this local pass.

Exit: every intended public template passes its route policy, no private/draft leak or unexplained orphan, appropriate visible schema and no broken critical internal navigation. Rollback: bounded metadata/content revert preserving URLs; verify robots/sitemap again.

## GR-03 — Persian answers and service content worth finding

Owner: UX/copy with factual review. Dependencies: GR-01 intent map; align with S1-08, S2-05, S3-05 and EC-03. Publication uses GR-02 readiness and normal content/release gates.

Files: `src/lib/home-content.ts`, `src/lib/project-content.ts`, existing `src/app/services/**`, flagship route, `src/lib/blog.ts`, existing blog/Admin content flow only as needed. **New if absent:** `docs/quality/CONTENT_REGISTER.md`.

- [ ] Inventory each existing primary page and classify keep, improve, consolidate or do not publish, with the user's question and evidence. Start with slow/broken websites and unfinished projects using current services; do not create near-identical pages for each spelling or city.
- [ ] Fully improve the current service index, two relevant existing service-detail pages and the flagship; count an existing satisfactory page as reused with evidence. Explain fit, concrete deliverables, limits, examples, what happens after clicking and any known cost/process accurately. Unknown pricing/capacity stays unstated, not invented.
- [ ] Prepare two substantive supporting Persian answers through the existing content path, selected from the validated intent gaps. Each must provide a usable check/action and verified example, name its factual reviewer and avoid cannibalizing Audit educational owners. A draft may stay unpublished when evidence/permission is missing; say so.
- [ ] Review all main headings, nav/buttons, evidence labels, empty/loading/errors and alternate EN meaning. Remove jargon from required reading; retain technical depth in optional details. Verify Persian shaping, نیم‌فاصله, punctuation, URL/code direction and mobile line breaks.
- [ ] Inspect actual rendered pages and source links. Apply the shared nontechnical task script when consented users are available; otherwise report expert review separately and retain the ready protocol. Never invent a customer example, participant or quote.

Exit: complete, source-reviewed primary content and two real useful drafts or accurately identified source blockers; published readiness is separate. Rollback: existing content version/code revert, no bulk database edits.

## GR-04 — Demonstrable utility and useful conversion

Owner: FE/UX/QA. Dependencies: EC-03/04 and relevant S2/S3 work; GR-01 baseline. Reuses working search/filters and lead handling.

Files: existing Discover routes/components/query helpers, flagship, services, `src/components/sections/infrastructure-lead-form.tsx`, existing lead API tests and the EC-03 journey harness. **New if absent:** `e2e/paired-journey.spec.mjs` for EC-03 and `e2e/service-discover-utility.spec.ts` only if its new cases cannot fit an existing focused suite.

- [ ] Define three complete visitor tasks: choose the correct service and request help; find a relevant Discover item and understand its limits/action; inspect real work and reach the appropriate specialist or implementation path. Follow EC-03 intent ownership rather than creating another form.
- [ ] Prove behavior with actual built routes and disposable data: empty search, no result, stale/broken external destination, slow image, Back/forward, long Persian query, disabled submit, 429/5xx and retry preserving input. Preserve valid current URL-query semantics.
- [ ] Correct dead ends, misleading free/unlimited claims, hidden mobile actions and missing failure recovery. Test a local acceptance response versus rejection; never log a button click as a successful lead. No new payment/entitlement mechanism or generalized form rewrite.
- [ ] Check both candidate apps for the round trip; stubs may aid development but cannot close paired integration. Inspect screenshots/recordings and independent copy/usability findings.

Exit: the three tasks work with honest outcomes and recovery across locales, no duplicate submission or sensitive attribution. Rollback: coherent component/route revert, backwards-compatible links retained.

## GR-05 — Privacy-safe measurement that actually works

Owner: FE/QA with existing analytics capability. Dependencies: GR-01 definitions; reuse S1-07 and EC-03 transport. Collection deployment needs its real authorization.

Files: `src/lib/analytics/client.ts`, `src/components/analytics/web-vitals.tsx`, `src/app/api/analytics/events/route.ts`, `src/app/api/analytics/web-vitals/route.ts`, existing analytics Admin view and tests. **New if absent:** `docs/quality/MEASUREMENT.md`; a local export/report adapter only if existing one cannot do the job.

- [ ] Map the existing events to entry, meaningful CTA navigation, successful accepted request and errors. Record precise numerator/denominator; no persistent cross-domain identity or sensitive query payload. Distinguish source=direct from referrals.
- [ ] Test consent denied, duplicate events, failed requests, unknown source/placement, PII/token/URL exclusion and inaccessible measurement source. Reuse transport and dashboards; do not add an analytics vendor or require a new schema to count navigation.
- [ ] Produce a reusable scorecard from authorized Search Console/analytics exports where available. Verify fields/date/device/country/query handling with labeled fixtures, then report real data only when present. Missing credentials/traffic is AWAITING_OBSERVATION, not fabricated zero activity.
- [ ] Run `pnpm exec vitest run src/__tests__/lib/analytics-client.test.ts src/__tests__/api/analytics-events.integration.test.ts` in a disposable environment; inspect the browser's actual network payloads locally. Preserve no live lead generation and no secret/trace upload.

Exit: measurement definitions, tested existing collection path and reproducible report/export handling; live activation and observed business results are separately labeled. Rollback: disable only the scoped new collection change using existing controls; preserve old consent/data behavior.

## GR-06 — Evidence-led search and product improvement

Owner: coordinator/SEO. Dependencies: GR-02…05 implementation; a deployed candidate and actual comparable observations for outcome claims. This task is bounded and never gates earlier implementation on future traffic.

Files: existing content/SEO files selected from one measured gap; `docs/quality/BASELINE.md`, `SEARCH_INTENTS.md`, `MEASUREMENT.md`, and **new if absent** `docs/quality/GROWTH_REVIEW.md`.

- [ ] Compare the fixed 12-intent cohort, non-brand clicks/CTR, qualified completion and quality guardrails using dated available sources. Keep missing/private/anonymized data explicit. Do not mix country/device/locale windows or infer search rank from a build/Lighthouse score.
- [ ] Choose one demonstrated high-impact gap, write hypothesis/affected URLs/metric/guardrail/observation window and implement the complete safe correction. Prefer substantive content, navigation or usability improvements over speculative features or cosmetic churn.
- [ ] Verify the change's local behavior/content and normal release criteria. If enough later evidence already exists, document keep/revert with limitations; otherwise record the exact next observation date/condition and stop this lane as AWAITING_OBSERVATION. Continue other ready tasks.
- [ ] No bought links, mass articles, fake reviews, unsupported “#1”, spam outreach, unauthorized analytics activation or automatic recurring scheduler. A search-leadership claim needs the shared contract's repeated scoped evidence.

Exit: one real evidence-based review/improvement, or a precise observation/access blocker and reproducible measurement path. It does not promise that Google will grant a rank. Rollback: the individual changed page/behavior, with the hypothesis and contrary evidence retained.

## Shared outcome batches

The canonical roadmap maps these cards into the current sprints. GR-01/02/05 can begin while PR #26 acceptance is repaired if paths do not overlap. GR-03/04 reuse S/EC outcomes; do not rebuild them. GR-06 is observation work after readiness, not a perpetual source of tasks. Only the coordinator claims tasks, integrates changes and updates the ledger.
