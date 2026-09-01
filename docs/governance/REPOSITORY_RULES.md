# Project rules — ASDEV public experience

Updated: 2026-08-31. Scope: this repository's public website and its paired quality/growth delivery contract.

## 1. Purpose and precedence

The owner wants a visually distinctive, professionally engineered, interactive site that ordinary Iranian visitors can understand. Quality, clarity, correctness and performance are simultaneous requirements. Technology novelty and small diffs are not outcomes by themselves.

The [shared quality/growth contract](../strategy/PAIRED_QUALITY_GROWTH_CONTRACT.md) adds complete utility, SEO, substantive Persian content, reliability and evidence-based category leadership. The canonical roadmap alone admits GR tasks. Aesthetic distinction and search rank cannot be certified by green CI; rank one is not guaranteed. Do not count one reused deliverable as two implementations.

[AGENTS.md](../../AGENTS.md) is the entry point. The [canonical roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md) selects work; the [engineering guide](../engineering/PUBLIC_EXPERIENCE_ENGINEERING.md) defines technical choices; the [sprint cards](../execution/V3_2_AGENT_SPRINTS.md) specify execution; the [ledger](../execution/V3_2_WORK_LEDGER.md) records evidence, not authority to redefine requirements.

This owner-requested revision supersedes older public-experience instructions requiring only CSS, treating Gate A as a terminal quality ceiling, prioritizing automation housekeeping over admitted UI work, or requiring human approval for every eligible PR. It does not waive runtime authorization, security checks, database safety or repository protection. Existing strategic focus on trust, acquisition and assessment conversion remains in force.

## 2. Complete scope, bounded implementation

The required minimum is **all acceptance criteria**, not a minimum number of lines or components. Reorganizing the approved Home composition, authoring mobile layouts, moving the portrait, drawing meaningful diagrams, designing motion and refining typography are legitimate task work. Do not hide those omissions behind “zero refactor.”

No unrelated framework/database/auth/Admin/router rewrite, bulk dependency upgrade, copied template, invented abstraction, or parallel design system. Reuse useful primitives; replace or restructure a primitive only where the accepted outcome requires it and the diff explains why.

## 3. Visitor language contract

Primary audience: a Persian-speaking business owner or ordinary visitor without programming knowledge. Secondary audience: a technical buyer who can open more detail.

| Rule | Required behavior |
|---|---|
| First viewport | Say what help is offered, for whom, and what to do next |
| Tone | Natural conversational Persian; respectful, concise, no bureaucratic prose or forced slang |
| Information order | Problem → benefit → example → action; technical explanation is optional |
| Navigation | «نمونه کارها»، «خدمات»، «ابزارها و آموزش‌ها»، «درباره من»; preserve existing routes |
| Primary CTA | «درخواست بررسی سایت»; never imply a free service or instant result without evidence |
| Motion labels | «سایت به مشکل خورده»، «مشکل رو پیدا می‌کنیم»، «برطرفش می‌کنیم»، «نتیجه رو ببین» where appropriate |
| Unknown content | Localized honest wording or omit a nonessential unknown badge; never guess data |
| English | Equivalent meaning and quality, not untranslated FA or broken literal translation |

Avoid unexplained “Audit”, “Production”, “fallback”, “MTTR”, “حاکمیت انتشار” and similar jargon in primary copy. Necessary technical terms can appear inside labeled details with a plain explanation. Brand/product names may remain in their real spelling. Numbers, costs and promises require substantiation.

Comprehension review is not an invented user study. Record whether evidence is an expert plain-language review, owner feedback or consented nontechnical-user observation. Do not fabricate participants, quotes or conversion improvements.

## 4. Experience contract

Home order: Header → Hero and system narrative → Verified proof → dominant flagship preview → Services → Selected work/Discover → Founder → final assessment CTA → Footer.

- Show a system changing for a comprehensible reason. Five labels attached to a static picture are not five implemented states.
- Narrative stages: pressure/problem, diagnosis, intervention, stable result, evidence. A hypothetical example is clearly labeled and never presented as live monitoring or client history.
- The same recognizable topology continues into proof/documentary; do not substitute an unrelated diagram at the end.
- Use user-directed or finite viewport-triggered motion. No infinite ambient loops, autoplay sound, scroll hijacking or cursor replacement.
- Content and the main CTA never wait for animation, asset downloads or a full-screen loader.
- Mobile requires deliberate reading order, cropping, touch controls and compact narrative; shrinking desktop art is insufficient.
- Reduced motion preserves each state's meaning through immediate state replacement or restrained transitions; no content removal.
- Specialist details, optional 3D and motion must not block navigation, evidence or assessment.

## 5. Technology admission

Keep the verified stack. Native DOM/SVG/CSS/WAAPI is the semantic foundation. The engineering guide names Anime.js v4 as the preferred bounded advanced-motion candidate and Three.js as the bounded GPU scene candidate, with explicit roadmap tasks and budgets. Neither is installed by this documentation change.

An admitted candidate is not a claim that a library is needed, licensed for every asset, installed, compatible or accepted. Before addition: read official documentation and license, select and pin an exact version, inspect current vulnerability/compatibility information, measure the relevant cost, and satisfy the scoped CI path. Do not install competing animation runtimes or copy third-party site source/assets without permission.

The roadmap now admits one advanced-motion evaluation and one isolated 3D signature prototype after their dependencies. There is no blanket permission for site-wide GPU rendering, WebGPU-only output, game mechanics or a new framework. Rejection of a prototype must retain its measurements and must not be mislabeled delivery of a 3D feature.

## 6. Evidence and truthful completion

Each task has an acceptance matrix: criterion → implementation path → command or observation → artifact → exact SHA → verdict. Missing evidence means `UNVERIFIED`; observed failure means `FAIL`; incomplete implementation means `PARTIAL`. Do not hide them under warnings.

A build, successful deployment, HTTP 200, screenshot capture, component existence test or Lighthouse aggregate score is insufficient to certify the whole experience.

Quantitative claims require an actual retrievable source, period, method, verification date and accepted review. Generic text such as “accepted evidence record” is not a source. Preserve confidentiality via a reviewed sanitized artifact; do not publish private logs. Never publish unsupported `−58%` or `0/30d`; `180→55` and `0/21d` are also inadmissible without real provenance.

Required program-level acceptance:

- Every applicable roadmap criterion satisfied on the submitted candidate.
- Real route interaction, full-page visuals and motion recordings inspected at FA/EN 390/768/1440; edge widths checked separately.
- Keyboard, touch, reduced motion, no-JS, blocked GPU and slow-network behavior verified as applicable.
- Project performance budgets measured, not inferred from default CI settings.
- Independent implementation/design review identifies the actual reviewer and links their findings. Self-review cannot fulfill this requirement.
- Owner visual feedback incorporated. Never record owner acceptance that did not occur; pending owner feedback is distinct from implementation progress and can be requested after preparing the complete reviewable result.
- Governed release verification remains separate from design acceptance.

Use [CODEX_REPORT_REVIEW.md](CODEX_REPORT_REVIEW.md) for each incoming completion claim.

## 7. Git, review and autonomy

One coherent PR per acceptance unit, not one PR per tiny file. Docs/rules/roadmap alignment is one coherent unit. Keep the complete diff bounded and explain every changed path. Never force-push or erase history; incorporate current main through a normal merge when updating a published branch.

Use actual repository checks, not guessed workflow names. Do not use admin bypass. The last observed policy has zero required human approvals, PRs/checks required, and force-push/deletion protection. Re-read live policy before merging; documentation is not permission to change settings.

No automatic posts to email, Slack, Telegram or issue command buses without an explicit communication authorization. A user-facing PR and requested file edits are in scope; unrelated messaging and timers are not.

## 8. Data, runtime and test safety

- Database: Prisma SQLite in this application's current schema. No PostgreSQL migration is part of this mission.
- Test only disposable data. `playwright.config.mjs` seeds its local test DB; some existing visual tests log in and create content. NEVER point that full suite at Production.
- Separate read-only public smoke from fixture-writing local/staging tests. Do not submit lead forms or mutate analytics/content on live systems merely to claim coverage.
- Preserve secrets, CSP, authentication, secure cookies, rate limiting, validation, backups, rollback and actual deployment gates.
- Inspect applicable workflow inputs before runtime actions. Reuse explicit valid session authorizations; do not infer database migration permission from UI work or approval-token examples.
- Keep staging/Production runs non-overlapping. Capture exact release identity and rollback truth. A docs-only merge does not require deployment.

## 9. Validation proportional to change

Behavior changes: focused red/green tests, browser exercise, type-check and lint; full relevant suite and build on the integration candidate. Reuse unchanged evidence with a written equivalence rationale; do not call earlier-SHA evidence exact-current-SHA evidence.

Docs-only changes: inspect complete diff, links, path existence, task/dependency consistency, contradictory rules, safety boundaries and secrets. Report local app tests as not run/not applicable, not passed. Actual required hosted checks remain mandatory; report their observed results separately.

Expired artifacts, inaccessible local paths and unavailable tools are explicit evidence gaps. Store deliverable evidence durably as CI artifacts or an approved persistent location, with commit-bound manifest and hashes. Do not upload secrets, cookies, customer data or unredacted authenticated traces.

## 10. Search, content and autonomous progress

Use appropriate visible, truthful metadata/schema and public route policies. Keep private/draft/utility pages out of intended indexing without weakening access. Do not mass-publish AI filler, buy links, fabricate testimonials/metrics, hide failing pages, or duplicate Audit's primary search intent. A valid technical SEO report is not proof of indexing, traffic or rank.

Distinguish independent copy review from consented user testing and lab measurements from field data. Record source/window/cohort/denominator for growth. Future observation may remain pending after implementation/release; do not label it PASS or loop indefinitely waiting for traffic.

The [paired loop prompt](../../prompts/codex/PAIRED_SITES_YOLO_LOOP.md) governs resumption, task claims, unchanged-evidence reuse and bounded retries. Existing authorizations apply within their scope. No routine permission questions; no silent expansion of authorization, repeated deterministic failures, scheduler creation or fabricated completion.
