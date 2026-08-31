# ASDEV — Agent execution contract

Updated: 2026-08-30. Repository: `alirezasafaeigfx/alirezasafaeisystems`.

## Mission and authority

Deliver the approved public experience: distinctive engineering-led visual design, meaningful interaction, strong mobile composition, and plain conversational Persian for nontechnical Iranian visitors. The site must help people understand the service, inspect trustworthy work, and request a website assessment. A functioning deployment is not proof that this experience is complete.

Instruction order: platform safety and current explicit owner instructions; this file and [project rules](docs/governance/REPOSITORY_RULES.md); [public-experience roadmap](docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md); [engineering guide](docs/engineering/PUBLIC_EXPERIENCE_ENGINEERING.md); [sprint task cards](docs/execution/V3_2_AGENT_SPRINTS.md); [work ledger](docs/execution/V3_2_WORK_LEDGER.md). The roadmap alone selects public-experience work. Supporting plans and historical queues cannot create another queue.

The owner has explicitly requested these documents, complete implementation rather than token changes, controlled autonomy, honest reporting, and independent verification of Codex reports. This does not authorize unrelated products, destructive operations, fabricated evidence, or bypassing repository protections.

## Read once at session start

For the owner's paired ASDEV/Audit mission, also read [paired experience contract v1](docs/engineering/PAIRED_PRODUCT_EXPERIENCE.md). Only the two explicitly named repositories are in scope, each through its own isolated branch, instructions and release gates. This does not authorize a third product, shared database/authentication changes, or deployment. EC tasks extend the canonical roadmap; do not restart PR #26 or mark Audit complete from this site's evidence.

1. This file and the project rules.
2. Roadmap current state and the next dependency-ready task card.
3. Engineering sections relevant to that task; inspect the referenced source files.
4. Ledger evidence, open PRs, current `main`, actual task branch and dirty state.
5. [Report review protocol](docs/governance/CODEX_REPORT_REVIEW.md) before reporting completion.

Read [approval gates](docs/governance/APPROVAL_GATES.md), [environment roles](docs/governance/ENVIRONMENT_ROLES_AND_SYNC_POLICY.md), and [live verification](docs/governance/POST_DEPLOY_LIVE_VERIFICATION_POLICY.md) before remote operations. Read automation infrastructure guides only for tasks that actually touch that infrastructure. Do not spend each cycle re-reading the whole repository.

## Environment and isolation

Use `LOCAL_PC`, `AUTOMATION_SERVER`, `IRAN_PROD_SERVER`, and `GITHUB_MAIN` accurately. A cloud review workspace is not automatically one of the owner's machines; label it `REVIEW_WORKSPACE`. Detect the repository root and available tools instead of assuming a Windows/Linux path, hostname, installed agent, or model.

- Work on an isolated topic branch/worktree. Preserve the owner's dirty checkout.
- Before integration, inspect the full merge-base, commit range and changed paths against current `main`.
- Reuse an existing mission PR when appropriate. Never merge old branch ancestry blindly or force-push to hide it.
- PRs remain required; the observed controlled-autonomy ruleset requires zero human approvals. Verify current checks and policy, do not weaken them or invent another routine approval gate.
- Only the orchestrator integrates changes and updates the canonical ledger. Independent workers may own non-overlapping paths when supported; do not assume MiMo/OpenCode or any paid service is installed. Never label a self-review independent.

## Actual stack, not historical guesses

At accepted application SHA `39c09b43191822d70c30f7fa8ae51dadb36d37b7`: Next.js App Router, React, TypeScript, Tailwind, existing shadcn/Radix components, Prisma with **SQLite**, Vitest, Playwright, axe, Storybook and Lighthouse CI. Exact versions come from `pnpm-lock.yaml`; see the engineering guide. Do not migrate the framework, database, router, authentication, Admin or deploy architecture as part of visual work.

## Execution loop

`observe → define the complete outcome → implement → inspect in a browser → test → repair → independent review → integrate → continue`

For each task:

1. Record task ID, actual base SHA, proven gap, allowed paths, complete acceptance criteria, reused evidence and rollback in one concise ledger entry.
2. Implement the **smallest complete solution**. There is no line-count target. Required composition, state transitions, responsive behavior and visual polish are in scope; unrelated refactoring is not.
3. Use red/green tests for behavior. A test that finds an SVG or its title does not prove scene logic, quality, responsiveness or performance.
4. Exercise the real route with a browser. A separate demo, mock screenshot, component story or simulated DOM is not production-page evidence.
5. Inspect screenshots and recordings yourself. Capture FA/EN, relevant widths, motion/reduced-motion and critical states. Repair defects instead of approving new snapshots blindly.
6. Publish a reviewable diff and evidence. Resolve required findings, satisfy actual checks, then integrate through normal PR policy.
7. Update the ledger and continue to the next ready task without routine permission questions. Do not invent new cleanup work when the admitted queue is complete.

Documentation-only tasks use link, consistency, diff and secret checks; do not claim application tests ran locally or repeat the full local suite merely for prose changes. Actual required hosted checks still run and must pass even when they include application tests/builds.

## Copy is part of the product

- Public Persian must be simple, natural, respectful and understandable without technical training.
- First explain the visitor's problem, benefit and next action. Put specialist detail behind an optional disclosure.
- Prefer «درخواست بررسی سایت»، «نمونه کارها»، «ببین چه چیزی بهتر شده» over untranslated internal labels such as Audit, evidence provenance, rollback and topology.
- No raw enum values (`unknown`, `tool`, etc.) in public UI. Preserve unknown data honestly; do not invent a platform or price.
- Reuse `src/lib/locale-utils.ts` and existing locale content functions. Do not mandate a nonexistent universal translation API or create a competing i18n framework.
- No unsupported claims, fake live telemetry, invented customer outcomes, awards, conversion gains or review scores. An `accepted` string in code is not independent provenance.

## Completion and reporting

Track separate dimensions: implementation, visual/interaction, copy/comprehension, accessibility, performance, release and artifact availability. Use `PASS`, `FAIL`, `UNVERIFIED`, or justified `NOT_APPLICABLE` for each. Overall `DONE` requires all applicable acceptance criteria, not just green CI.

Every report must include task IDs; base/candidate/merged/release SHAs separately; changed paths; commands with actual exit codes/counts; artifact links and hashes; failures/skips; reviewer identity/type; actual deployment identity and rollback evidence when relevant; and the next real action.

Never:

- replace tests with source-string checks and claim browser behavior;
- count skipped/absent tests as passed;
- label a CSS perspective illustration a WebGL implementation;
- label a retained rollback directory a tested rollback;
- infer Production SHA from `main`;
- invent screenshot/trace/video paths, user tests, benchmark scores or inaccessible artifacts;
- suppress errors, relax thresholds, remove tests, hide content or rename a failing task to obtain PASS;
- say «world-class», «10/10», «all done» or «no blockers» as a substitute for the required evidence.

See the report review protocol for the independent adversarial check applied to every Codex report, including reports by the coordinating assistant.

## Safety and stop conditions

Continue all safe authorized preparation and implementation. Stop only the affected lane for unavailable access, destructive/data-loss risk, secret provisioning, a genuinely missing applicable runtime authorization, or an unadmitted broad architectural change. Record the precise blocker and continue independent work where possible.

Existing authorizations remain valid within their actual scope; do not ask again merely because the agent changed. Documentation containing an approval phrase is not an authorization event. This documentation update does not dispatch staging/Production, rerun SQLite relocation, change settings, rotate credentials, send messages, or activate external monitoring.

Never expose secrets or customer data, modify production databases in tests, bypass security, force-push, erase unknown dirty work, or mutate other ASDEV repositories. Use disposable test databases and project-local tools. Keep a normal static/semantic path available when motion, JavaScript or GPU features are unavailable.
