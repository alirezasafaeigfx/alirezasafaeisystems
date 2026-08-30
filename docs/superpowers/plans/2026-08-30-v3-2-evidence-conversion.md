# V3.2 Evidence and Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the V3.1 public experience into an Audit-first, quantitatively evidenced, technically distinctive conversion system without reopening the proven backend/release architecture.

**Architecture:** Preserve the V3/V3.1 platform and work in a new post-release branch. Add a typed evidence registry, refactor only the public positioning/navigation and flagship Case Study presentation, harden Discover first-viewport media, and extend full-page visual evidence. Each task owns focused files and ends in independent verification.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, existing Radix/shadcn primitives, Prisma 6, Vitest 4, Testing Library, Playwright, Axe, Lighthouse CI.

**Spec:** `docs/superpowers/specs/2026-08-30-v3-2-evidence-conversion-design.md`

## Global Constraints

- Do not change the owner-approved V3.1 candidate solely for planning or documentation.
- Begin product implementation from the actual R0-accepted base, never from a guessed SHA.
- ASDEV Audit remains the primary conversion target.
- No fake client, logo, metric, testimonial, screenshot, evidence artifact, contact data, or identity media.
- No new runtime dependency unless the task cannot be completed with the existing stack and ORCH records the justification.
- Preserve Admin, Prisma, authentication, security, and release contracts.
- WCAG 2.2 AA, FA/EN parity, RTL/LTR, reduced motion, SEO, and performance budgets remain mandatory.
- Production deploy, migration, content publication, merge, rollback, and destructive actions obey existing exact approval gates.
- Reuse green exact-SHA evidence when relevant inputs are unchanged; do not rerun it for ceremony.

---

## File Structure

- Create `src/lib/evidence-registry.ts` — typed source for public quantitative evidence.
- Create `src/__tests__/lib/evidence-registry.test.ts` — provenance and uniqueness contract.
- Modify `src/lib/home-content.ts` — evidence-led bilingual positioning and links.
- Modify `src/components/sections/homepage-v3.tsx` — H1, proof, CTA composition.
- Modify `src/components/layout/header.tsx` and `src/components/layout/footer.tsx` — focused IA and Audit CTA.
- Create `src/components/case-studies/case-study-impact-table.tsx` — semantic Before/After impact.
- Create `src/components/case-studies/case-study-architecture.tsx` — code-native Before/After flow.
- Create `src/components/case-studies/case-study-timeline.tsx` — ordered decisions/timeline.
- Create `src/__tests__/components/case-study-documentary.test.tsx` — reusable evidence presentation contract.
- Modify `src/app/case-studies/infrastructure-localization-rescue/page.tsx` — flagship documentary composition.
- Modify `src/app/case-studies/page.tsx` — editorial index with one flagship.
- Modify `src/components/discover/discover-grid.tsx` — eager first row, stable skeleton/fallback.
- Modify `src/__tests__/components/discover-grid.test.tsx` — image loading contract.
- Create `docs/product/BLOG_PUBLICATION_GATE.md` — exact primary-navigation re-entry and publication evidence contract.
- Modify `src/app/globals.css` and focused public components — card reduction, typography, motion.
- Modify `e2e/public-v31-visual.spec.ts` or create `e2e/public-v32-visual.spec.ts` — full-page evidence matrix.
- Create `docs/reports/v3-2-visual-review.md` only after real renders exist.

---

### Task 0: Reconcile and Close V3.1 Release State

**Files:**
- Create: `tests/ci/deploy-source-archive-contract.test.ts`
- Modify: `.github/workflows/deploy-vps.yml` on a separate workflow-fix branch
- Modify: `docs/execution/V3_2_WORK_LEDGER.md` on the docs/control branch only
- Application feature files: none

**Interfaces:**
- Consumes: PR #17, exact head, check runs, visual artifact, staging workflow and approval records.
- Produces: a compressed source-transfer contract, two successful staging live passes on the unchanged application candidate, and one accepted post-V3.1 base SHA for Task 1.

- [ ] **Step 1: Read exact GitHub state**

```bash
git fetch origin --prune
git rev-parse origin/main
git ls-remote origin refs/heads/design/v3-1-world-class-public-ux
gh pr view 17 --json headRefOid,baseRefOid,isDraft,mergeable,reviewDecision,statusCheckRollup
gh run view 33298314611 --json headSha,status,conclusion,jobs,url
```

Expected: primary evidence identifies exact head `41a80235c83ec6949d518bd7fa034814d6e43fef` and run `33298314611` as cancelled after staging release `20260830T070559Z` deployed, health/smoke passed, pass 1 returned `LIVE_VERIFICATION_PASS`, and pass 2 did not complete. If `gh` is unavailable, use the connected GitHub API for the same fields; do not guess.

- [ ] **Step 2: Compare against immutable evidence**

Verify whether the candidate still equals `41a80235c83ec6949d518bd7fa034814d6e43fef`. If it changed, mark previous visual approval non-transferable and require new evidence for affected files.

- [ ] **Step 3: Classify the next action**

The current primary evidence requires this verdict:

```text
STAGING_PIPELINE_TIMEOUT_MINIMAL_REPAIR_REQUIRED
WAITING_FOR_EXACT_APPROVAL
EXTERNAL_BLOCKER
```

- [ ] **Step 4: Write the failing compressed-archive workflow test**

Create `tests/ci/deploy-source-archive-contract.test.ts` and read `.github/workflows/deploy-vps.yml` as text. Assert the workflow creates a `.tar.gz` archive with `git archive --format=tar.gz`, verifies its SHA-256, transfers that archive, and extracts with gzip support. Also reject the prior uncompressed archive contract.

```ts
expect(workflow).toContain('git archive --format=tar.gz')
expect(workflow).toContain('.tar.gz')
expect(workflow).toContain('tar -xzf')
expect(workflow).not.toContain('git archive --format=tar HEAD')
```

- [ ] **Step 5: Verify RED**

```bash
pnpm exec vitest run tests/ci/deploy-source-archive-contract.test.ts
```

Expected: FAIL against the current uncompressed archive workflow.

- [ ] **Step 6: Implement the bounded workflow repair**

Change only the source archive creation/extraction contract to `.tar.gz`; preserve resolved SHA, source digest comparison, rsync safety, approvals, environment protection, deployment logic, live verification and rollback behavior.

- [ ] **Step 7: Verify GREEN and existing deploy contracts**

```bash
pnpm exec vitest run tests/ci/deploy-source-archive-contract.test.ts tests/ci/deploy-ssh-transport.test.ts tests/ci/verification-runner-contract.test.ts tests/ci/backup-and-deploy-approval-contract.test.ts
pnpm run type-check
pnpm run lint
```

- [ ] **Step 8: Commit the workflow fix separately**

```bash
git add .github/workflows/deploy-vps.yml tests/ci/deploy-source-archive-contract.test.ts
git commit -m "fix(deploy): compress immutable release source transfer"
```

- [ ] **Step 9: Re-run governed staging once on the unchanged candidate**

After the workflow fix is reviewed and available to the governed dispatcher, deploy exact application ref `41a80235c83ec6949d518bd7fa034814d6e43fef`. Require health, smoke, both live browser passes, artifact upload and green `staging/deploy` plus `staging/live-verification` statuses.

- [ ] **Step 10: Run independent PR review before merge progression**

Review all changed files for truth, scope, security, accessibility, performance, and release-contract regressions. Record P0/P1/P2 findings; do not modify code from the reviewer lane.

- [ ] **Step 11: Establish the implementation base**

Only after governed acceptance:

```bash
git fetch origin --prune
git switch --create feat/v3-2-evidence-conversion origin/main
git status --short --branch
```

Expected: clean branch and the exact accepted `origin/main` SHA recorded in the ledger.

---

### Task 1: Add the Evidence Registry and Replace Generic Hero Positioning

**Files:**
- Create: `src/lib/evidence-registry.ts`
- Create: `src/__tests__/lib/evidence-registry.test.ts`
- Modify: `src/lib/home-content.ts`
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/__tests__/components/homepage-v3.test.tsx`

**Interfaces:**
- Produces: `EvidenceMetric`, `HOME_EVIDENCE_METRICS`, evidence-linked Hero/Proof content.
- Consumes: existing locale type and stable public Case Study routes.

- [ ] **Step 1: Write the failing evidence contract tests**

```ts
import { HOME_EVIDENCE_METRICS } from '@/lib/evidence-registry'

it('requires unique sourced public metrics', () => {
  expect(new Set(HOME_EVIDENCE_METRICS.map((item) => item.id)).size).toBe(HOME_EVIDENCE_METRICS.length)
  for (const item of HOME_EVIDENCE_METRICS) {
    expect(item.sourceHref).toMatch(/^\/case-studies\//)
    expect(item.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(item.scope.fa.length).toBeGreaterThan(10)
    expect(item.scope.en.length).toBeGreaterThan(10)
  }
})
```

Extend the Homepage test to require `سیستم‌های وبی که زیر فشار هم کار می‌کنند.` / `Web systems that keep working under pressure.` and reject the generic H1.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/lib/evidence-registry.test.ts src/__tests__/components/homepage-v3.test.tsx
```

Expected: FAIL because the registry and new positioning do not exist.

- [ ] **Step 3: Implement the typed registry**

```ts
export type EvidenceMetric = {
  id: 'mttr' | 'deployment-failure' | 'emergency-rollback'
  value: string
  label: { fa: string; en: string }
  scope: { fa: string; en: string }
  sourceHref: string
  verifiedAt: string
}
```

Populate only the three sourced metrics defined by the spec. Keep scope notes explicit; do not imply third-party verification.

- [ ] **Step 4: Refactor Hero and Proof composition**

Keep one H1. Render the evidence registry immediately after the Hero or within its first continuation. Each metric links to its source and remains understandable without animation.

- [ ] **Step 5: Verify GREEN**

```bash
pnpm exec vitest run src/__tests__/lib/evidence-registry.test.ts src/__tests__/components/homepage-v3.test.tsx
pnpm run type-check
pnpm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/evidence-registry.ts src/lib/home-content.ts src/components/sections/homepage-v3.tsx src/__tests__/lib/evidence-registry.test.ts src/__tests__/components/homepage-v3.test.tsx
git commit -m "feat(home): lead with sourced operational evidence"
```

---

### Task 2: Unify Audit-First CTA and Focus the Navigation

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/lib/home-content.ts`
- Modify: `src/__tests__/components/public-shell-v31.test.tsx`
- Modify: `src/__tests__/components/homepage-v3.test.tsx`

**Interfaces:**
- Produces: four-item public navigation and one attributed Audit CTA contract.
- Consumes: locale routing, analytics client, ASDEV Audit public qualification URL.

- [ ] **Step 1: Write failing navigation/CTA tests**

Assert the primary navigation labels are Work, Services, Discover, About; Blog is absent; the CTA label is `شروع ارزیابی فنی` / `Start technical assessment`; the secondary Home action is `مشاهده شواهد` / `View the evidence`.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx src/__tests__/components/homepage-v3.test.tsx
```

- [ ] **Step 3: Implement focused IA**

Use the brand mark for Home. Route Work to `/case-studies`, Services to `/services`, Discover to `/discover`, About to `/about-brand`. Remove Blog from primary desktop/mobile navigation while the publication gate is unmet.

- [ ] **Step 4: Implement attributed Audit CTA**

Use the same destination and attribution contract in Header, Hero, and Footer. Preserve separate event names for placement while keeping one offer ID.

- [ ] **Step 5: Correct the Audit Systems project link**

Route it to a real Audit destination or dedicated evidence page; never leave the item at generic `/case-studies`.

- [ ] **Step 6: Verify**

```bash
pnpm exec vitest run src/__tests__/components/public-shell-v31.test.tsx src/__tests__/components/homepage-v3.test.tsx
pnpm run type-check
pnpm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/header.tsx src/components/layout/footer.tsx src/components/sections/homepage-v3.tsx src/lib/home-content.ts src/__tests__/components
git commit -m "feat(conversion): focus public navigation on Audit intent"
```

---

### Task 3: Build the Flagship Case Study Documentary Primitives

**Files:**
- Create: `src/components/case-studies/case-study-impact-table.tsx`
- Create: `src/components/case-studies/case-study-architecture.tsx`
- Create: `src/components/case-studies/case-study-timeline.tsx`
- Create: `src/__tests__/components/case-study-documentary.test.tsx`
- Modify: `src/app/case-studies/infrastructure-localization-rescue/page.tsx`

**Interfaces:**
- Produces: `CaseStudyImpactTable`, `CaseStudyArchitecture`, `CaseStudyTimeline`.
- Consumes: evidence registry IDs and bilingual server-rendered content.

- [ ] **Step 1: Write failing semantic component tests**

```tsx
expect(screen.getByRole('table', { name: /impact|اثر/i })).toBeInTheDocument()
expect(screen.getAllByRole('img', { name: /architecture|معماری/i })).toHaveLength(2)
expect(screen.getByRole('list', { name: /timeline|خط زمانی/i })).toBeInTheDocument()
```

The architecture component uses semantic labelled regions with a text fallback; no canvas-only meaning.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/case-study-documentary.test.tsx
```

- [ ] **Step 3: Implement focused primitives**

Use server-compatible components, CSS grid/flex and semantic HTML. The impact table includes metric, before, after, measurement window, and evidence link. The architecture flow remains legible in RTL/LTR and without CSS motion.

- [ ] **Step 4: Recompose the flagship page**

Order: Context → Before → Decision → After → Impact → Timeline → Evidence → Trade-offs → Role/Stack → Audit CTA. Remove repetitive bordered-card wrappers from the narrative.

- [ ] **Step 5: Verify**

```bash
pnpm exec vitest run src/__tests__/components/case-study-documentary.test.tsx src/__tests__/seo
pnpm run type-check
pnpm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/components/case-studies src/app/case-studies/infrastructure-localization-rescue/page.tsx src/__tests__/components/case-study-documentary.test.tsx
git commit -m "feat(case-study): build evidence documentary experience"
```

---

### Task 4: Redesign the Case Study Index Around Evidence Hierarchy

**Files:**
- Modify: `src/app/case-studies/page.tsx`
- Create: `src/__tests__/components/case-study-index-v32.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: existing seven Case Study entries and flagship route.
- Produces: one full-width flagship plus a quieter selected-work list.

- [ ] **Step 1: Extract renderable index data and write failing tests**

Assert exactly one flagship, no seven equal `article` cards, correct internal/external link semantics, and one H1.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/case-study-index-v32.test.tsx
```

- [ ] **Step 3: Implement editorial hierarchy**

Render Infrastructure Localization Rescue as the flagship with metric and visual. Render the remaining cases as divided rows or two differentiated groups. Preserve metadata and schema.

- [ ] **Step 4: Verify responsive and semantic behavior**

```bash
pnpm exec vitest run src/__tests__/components/case-study-index-v32.test.tsx src/__tests__/seo
pnpm run type-check
pnpm run lint
```

- [ ] **Step 5: Commit**

```bash
git add src/app/case-studies/page.tsx src/app/globals.css src/__tests__/components/case-study-index-v32.test.tsx
git commit -m "feat(case-studies): lead with flagship evidence"
```

---

### Task 5: Harden Discover Media and Apply the Blog Readiness Rule

**Files:**
- Modify: `src/components/discover/discover-grid.tsx`
- Modify: `src/__tests__/components/discover-grid.test.tsx`
- Modify: `src/components/layout/header.tsx`
- Create: `docs/product/BLOG_PUBLICATION_GATE.md`
- Create: `e2e/public-v32-slow-network.spec.ts`

**Interfaces:**
- Produces: eager first-row media, lazy later media, stable fallback, honest Blog IA.
- Consumes: server-provided ordered Discover items; V3.1 URL-backed query remains canonical.

- [ ] **Step 1: Write failing Discover loading tests**

Render at least five items and assert items 0–2 use `loading="eager"` plus `fetchpriority="high"`, while item 3 onward uses `loading="lazy"`. Assert every frame has a stable aspect ratio and fallback background.

- [ ] **Step 2: Verify RED**

```bash
pnpm exec vitest run src/__tests__/components/discover-grid.test.tsx
```

- [ ] **Step 3: Implement bounded media priority**

Pass the map index into media attributes. Do not make all images eager. Preserve safe external image behavior and the V3.1 query/filter/pagination contract.

- [ ] **Step 4: Add throttled-browser evidence**

In `public-v32-slow-network.spec.ts`, delay image responses deterministically, verify first-row frames reserve dimensions, search remains usable, no horizontal overflow occurs, and later images remain lazy.

- [ ] **Step 5: Apply Blog readiness**

Keep the direct route and honest empty state. Remove Blog from primary navigation. Create `docs/product/BLOG_PUBLICATION_GATE.md` with the exact re-entry rule: at least three published, locale-complete, evidence-rich articles; claim provenance reviewed; metadata/hreflang/schema tests green; owner content-publication decision recorded. Do not publish or invent content in this task.

- [ ] **Step 6: Verify**

```bash
pnpm exec vitest run src/__tests__/components/discover-grid.test.tsx src/__tests__/blog src/__tests__/components/public-shell-v31.test.tsx
pnpm exec playwright test e2e/public-v32-slow-network.spec.ts --project=chromium
pnpm run type-check
pnpm run lint
```

- [ ] **Step 7: Commit**

```bash
git add src/components/discover/discover-grid.tsx src/components/layout/header.tsx src/__tests__ e2e/public-v32-slow-network.spec.ts docs/product/BLOG_PUBLICATION_GATE.md
git commit -m "fix(public): harden Discover media and Blog readiness"
```

---

### Task 6: Complete the Engineering Editorial Visual System

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/sections/homepage-v3.tsx`
- Modify: `src/app/case-studies/page.tsx`
- Modify: `src/app/case-studies/infrastructure-localization-rescue/page.tsx`
- Create: `e2e/public-v32-visual.spec.ts`

**Interfaces:**
- Consumes: stable S1–S3 structure.
- Produces: card reduction, typography, mobile composition, purposeful motion and width matrix.

- [ ] **Step 1: Record the pre-change card/surface inventory**

List each affected equal-weight bordered surface in the PR report. Mark which grouping becomes typography, divider, media, or a retained card. The target is roughly 40–50% fewer unnecessary card surfaces, not a blind global class deletion.

- [ ] **Step 2: Add visual/geometry assertions**

`public-v32-visual.spec.ts` covers Home and the two Case Study surfaces at 390, 768 and 1440; no horizontal overflow; one visible H1; focus visibility; reduced-motion content availability.

- [ ] **Step 3: Implement typography and composition**

Set public body rhythm to the spec targets, bound reading measure, remove repeated borders/shadows, and author mobile order/spacing intentionally.

- [ ] **Step 4: Implement one meaningful operational visual and CSS-only motion**

The visual must explain system state/flow and remain complete when motion is reduced. No Framer Motion, infinite decoration, or content hidden behind animation.

- [ ] **Step 5: Verify**

```bash
pnpm exec playwright test e2e/public-v32-visual.spec.ts --project=chromium
pnpm run test:e2e:a11y
pnpm run type-check
pnpm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/sections/homepage-v3.tsx src/app/case-studies e2e/public-v32-visual.spec.ts
git commit -m "feat(ui): establish evidence-led editorial system"
```

---

### Task 7: Produce Exact-SHA Evidence and Independent Review

**Files:**
- Modify: `e2e/public-v32-visual.spec.ts`
- Create: `docs/reports/v3-2-visual-review.md`
- Modify: `docs/execution/V3_2_WORK_LEDGER.md`

**Interfaces:**
- Consumes: stable implementation candidate.
- Produces: screenshot matrix, review rubric, exact SHA and primary evidence links.

- [ ] **Step 1: Run complete local verification once the candidate is stable**

```bash
pnpm run verify
pnpm run test:e2e:smoke
pnpm run test:e2e:a11y
pnpm exec playwright test e2e/public-v32-visual.spec.ts e2e/public-v32-slow-network.spec.ts --project=chromium
pnpm run lighthouse:ci
pnpm run scan:secrets
```

Expected: every command exits 0; partial execution/timeouts are failures.

- [ ] **Step 2: Capture required evidence**

Generate FA/EN Home, Case Studies index, flagship Case Study, Discover, Blog empty state, focus state, and reduced-motion screenshots at the required widths. Record exact file list and candidate SHA.

- [ ] **Step 3: Run independent review**

Review truth/provenance, security, accessibility, SEO, performance, scope, mobile quality, and anti-template visual quality. The implementer may not self-approve.

- [ ] **Step 4: Score the visual rubric**

No category below 4/5; average at least 4.4/5. Record failures honestly and return fixes to the original task owner.

- [ ] **Step 5: Commit evidence report**

```bash
git add e2e/public-v32-visual.spec.ts docs/reports/v3-2-visual-review.md docs/execution/V3_2_WORK_LEDGER.md
git commit -m "test(ui): record V3.2 exact-head evidence"
```

Any commit changes the candidate SHA; hosted evidence and approval must refer to the resulting final SHA, not the previous one.

---

### Task 8: Hosted CI, Governed Staging, and Release Closure

**Files:**
- Feature files: none unless a verified failure requires a scoped fix
- Create/update: exact release and live-verification report under the repository-standard report path

**Interfaces:**
- Consumes: final reviewed candidate SHA.
- Produces: terminal hosted checks, two staging live passes, approved release identity, rollback target, final verdict.

- [ ] **Step 1: Push the reviewed branch and pin exact SHA**

```bash
git status --short --branch
git rev-parse HEAD
git push --set-upstream origin feat/v3-2-evidence-conversion
```

- [ ] **Step 2: Verify hosted checks on that exact SHA**

Require repository-governed CI, E2E, a11y, Lighthouse, security, CodeQL and secret-scan checks. Do not treat a moving branch name as evidence.

- [ ] **Step 3: Use the governed staging workflow**

Run only with a valid staging approval. Verify quality gate, immutable deployment SHA, post-deploy smoke, assets/fonts, FA/EN, mobile/desktop, navigation, Discover, Blog policy, Case Study, console, network, runtime logs, and rollback target.

- [ ] **Step 4: Require two consecutive live verification passes**

Record URLs, browser/viewport, commands, artifact/report paths, exact SHA, failures and verdict.

- [ ] **Step 5: Obtain any still-required exact release approval**

Do not infer production authority from design approval, staging approval, or an old release token.

- [ ] **Step 6: Complete governed release and post-release verification**

Use one mandatory verdict from `POST_DEPLOY_LIVE_VERIFICATION_POLICY.md`. If any P0/P1 remains, do not declare stable or done.

---

## Plan Self-Review

### Spec coverage

- verified V3.1 staging pipeline timeout without app-candidate mutation: Task 0;
- generic positioning and Audit conversion: Tasks 1–2;
- sourced quantitative proof: Task 1;
- technical-documentary Case Study and index hierarchy: Tasks 3–4;
- Discover slow-network integrity and Blog readiness/re-entry contract: Task 5;
- Carditis, typography, mobile, motion: Task 6;
- FA/EN visual, accessibility, SEO, performance and provenance gates: Task 7;
- staging/release/live verification: Task 8.

### Placeholder scan

This plan contains no unresolved placeholder tokens, fake content, or unspecified release shortcut. Runtime implementation begins from the R0-accepted base, which is intentionally resolved from primary evidence rather than hardcoded before staging/merge closure.

### Type/interface consistency

`EvidenceMetric` is produced in Task 1 and consumed thereafter. Documentary components are produced in Task 3 and used by Task 4 only through public component props. V3.1 Discover query state is preserved; Task 5 changes media behavior, not query authority.

## Execution Recommendation

Use `superpowers:subagent-driven-development` with ORCH as sole integrator. Run UX/EVID read-only contract work in parallel where independent; serialize FE writes that touch Header, Homepage, Case Studies, or global CSS. Require an independent REVIEW gate after Tasks 2, 4, 6 and 7.
