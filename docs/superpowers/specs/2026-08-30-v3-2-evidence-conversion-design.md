# V3.2 — Evidence-Led Positioning and Conversion Design

**Status:** Approved direction; implementation begins only after V3.1 release reconciliation  
**Date:** 2026-08-30  
**Authority:** Post-V3.1 public-experience design, subordinate to `docs/strategy/FOCUS_POLICY.md`, `AGENTS.md`, and all release/approval gates

## Decision

Preserve the V3 backend, Admin, persistence, security, and release architecture. Preserve the exact approved V3.1 candidate while its governed release is being completed. Build V3.2 as a separate, evidence-led improvement program after that release is closed.

V3.2 is not another broad visual rewrite. It closes the conversion and credibility gaps that remain after V3.1:

- generic hero positioning (`مهندس نرم‌افزار` / `Software Engineer`);
- generic collaboration CTA instead of the primary ASDEV Audit path;
- product-name proof instead of quantitative proof;
- text/card-heavy case studies without architecture, timeline, or evidence presentation;
- Blog promoted while no public article is published;
- Discover first-viewport images loaded lazily without a skeleton;
- too many equal-weight cards and insufficient editorial hierarchy;
- incomplete full-page visual regression outside the V3.1 candidate matrix.

## Immutable starting evidence

- `GITHUB_MAIN` baseline observed: `ac08d1232ee4edfcdbe029a5f636d68b9e8861cc`.
- V3.1 PR: `#17`, branch `design/v3-1-world-class-public-ux`.
- Owner-approved candidate: `41a80235c83ec6949d518bd7fa034814d6e43fef`.
- Approved visual artifact: `9721029344`, digest `sha256:d48839e8fc326610e2c146b70996eed914f20688afcf002a53ed39ea91d64602`.
- The V3.1 implementation plan Tasks 1–10 are evidenced as complete on that candidate even though their Markdown checkboxes remain open. They must not be repeated merely to satisfy stale checkboxes.
- Governed staging run `33298314611` deployed staging release `20260830T070559Z`; remote health and smoke passed and live-verification pass 1 returned `LIVE_VERIFICATION_PASS`. Pass 2 was cancelled when the 45-minute job budget expired. The uncompressed `123,883,520`-byte source archive had consumed about 40 minutes in transfer. This is a verified delivery-pipeline timeout, not evidence of an application failure. Artifact `9728655284` preserves the partial live-verification reports.

Changing the approved candidate SHA invalidates exact-head visual approval and requires all affected evidence to be regenerated. Documentation and the R0 workflow repair must therefore live on branches separate from the V3.1 application candidate.

## Product outcome

Within three seconds, a qualified visitor should understand:

1. Alireza builds and stabilizes web systems that must remain operational under real constraints.
2. The claims are backed by inspectable outcomes and case-study evidence.
3. The primary next action is a technical assessment through ASDEV Audit.

## Positioning and conversion contract

### Hero

Persian direction:

> سیستم‌های وبی که زیر فشار هم کار می‌کنند.

English direction:

> Web systems that keep working under pressure.

The supporting copy may explain architecture, rescue, production readiness, and reliability, but the H1 must not revert to a generic job title.

### Actions

- Primary: `شروع ارزیابی فنی` / `Start technical assessment` → attributed ASDEV Audit qualification path.
- Secondary: `مشاهده شواهد` / `View the evidence` → flagship case study or evidence index.

These are the only two equal-level actions in the first viewport. Generic `Start collaboration`, project routers, and unrelated product CTAs are subordinate.

### Navigation

The brand mark is Home. Primary navigation is limited to:

1. Work
2. Services
3. Discover
4. About

The single dominant navigation CTA is the ASDEV Audit assessment. Blog remains directly accessible but is removed from primary navigation until at least three published, locale-complete, evidence-rich articles exist. A future `Insights` group may combine Discover and Blog only after that gate passes.

## Evidence contract

Quantitative proof may appear only when a stable source is recorded. The initial candidate set is:

- MTTR: `180 min → 55 min`;
- deployment failure: `−58%`;
- emergency rollback: `0 / 30 days`.

Each metric must have:

- a stable evidence ID;
- Persian and English labels;
- a source route or repository evidence reference;
- a verification date;
- a short scope/measurement note.

If provenance cannot be verified, remove or downgrade the claim. Do not replace it with a fabricated metric.

## Flagship case-study contract

`infrastructure-localization-rescue` becomes the reference implementation and includes:

1. concise context and constraints;
2. Before architecture;
3. After architecture;
4. measurable impact table;
5. timeline of decisive changes;
6. decisions and trade-offs;
7. sanitized evidence/provenance notes;
8. role and stack;
9. ASDEV Audit CTA.

Diagrams must be semantic, responsive, RTL/LTR-safe, and code-native. No generated fake dashboard, fabricated log, or unverifiable client artifact may be used.

## Discover and Blog contract

### Discover

- Keep its 15 real resources and URL-backed server query contract.
- First-viewport media must reserve dimensions immediately.
- Only the first visible row may use eager/high-priority loading; later media remains lazy.
- A skeleton or meaningful fallback prevents blank white media frames on slow connections.
- Slow-network browser evidence must verify the first useful interaction and absence of layout shift.

### Blog

- Keep the honest empty state and Admin authoring architecture.
- Remove Blog from primary navigation while fewer than three qualified articles are published.
- Agents may draft from existing project evidence, but publishing production content is a separate explicit content mutation decision.
- Do not invent articles merely to fill the grid.

## Visual system contract

Direction: **Engineering Editorial + Operational Interface**.

- Preserve the restrained blue/navy palette and whitespace.
- Reduce equal-weight bordered cards by roughly 40–50% on the affected Home and Case Study surfaces.
- Prefer typography, spacing, dividers, large media, and composition for grouping.
- Introduce at most one signature operational visualization per major page.
- Motion must explain system state or hierarchy, use CSS, and fully respect reduced motion.
- Body typography target: 17–18px desktop, 16–17px mobile, with bounded reading measure.

## Testing and evidence

Required widths: `390`, `768`, `1440`; targeted composition checks also cover `360`, `1024`, and `1728`.

Required surfaces in FA and EN where applicable:

- Home;
- Case Studies index;
- flagship Case Study;
- Discover index and detail;
- Blog empty and representative published article when real content exists;
- keyboard focus;
- reduced motion.

Automated gates are necessary but do not replace human review. Reuse green evidence only when the exact SHA and all relevant inputs are unchanged.

## Non-goals

- no rewrite of Admin, Prisma, authentication, or deployment architecture;
- no new product or standalone Discover expansion;
- no work on frozen repositories;
- no dependency churn unrelated to the program;
- no AI identity replacement, fake client logos, fake screenshots, testimonials, or metrics;
- no production deploy, migration, content publication, force-push, or destructive action without its valid gate.

## Definition of success

- the generic job-title H1 is gone;
- the primary path is ASDEV Audit and is attributable;
- the top of Home shows sourced quantitative proof;
- the flagship Case Study reads as a technical documentary, not stacked cards;
- incomplete Blog content does not weaken primary navigation;
- Discover first-viewport media is useful under a throttled connection;
- FA/EN, mobile/desktop, keyboard, reduced motion, SEO, performance, and security gates pass;
- human visual review scores every category at least 4/5 with an average of at least 4.4/5;
- staging and release evidence are exact-SHA and follow repository governance.
