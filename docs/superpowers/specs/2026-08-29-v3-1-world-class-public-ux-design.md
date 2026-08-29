# V3.1 — World-Class Public UX & Visual System

**Status:** Approved direction / design specification  
**Date:** 2026-08-29  
**Owner:** Product + Brand + UX/UI + Frontend  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`  
**Baseline:** V3 production release is closed and frozen. V3.1 is a separate visual/UX initiative.  
**Primary surfaces:** Home, global navigation, Discover, Blog/Insights, shared public shell  

---

## 1. Decision

V3.1 is not a cleanup pass.

It is a deliberate visual and interaction redesign whose quality bar is **competitive with high-end contemporary international software-engineer / product-builder portfolios**, while remaining credible, fast, accessible, bilingual, and production-safe.

The public experience must move from:

> clean, functional, generic

into:

> distinctive, premium, personal, evidence-led, memorable, and globally competitive.

The approved visual direction is the concept reviewed by the owner on 2026-08-29: a light premium technical-editorial portfolio with a strong personal hero, large portrait, disciplined blue accent, product screenshots, high-quality typography, real proof, compact information density, and a dark high-contrast conversion/footer zone.

The concept is a **direction**, not a literal implementation. No fake logos, fake clients, fake statistics, AI-generated identity replacement, fabricated testimonials, or invented contact information may enter production.

---

## 2. Why V3.1 Exists

V3 improved architecture, information hierarchy, migration safety, deployment governance, accessibility, and operational reliability, but the final public UI did not reach the intended visual quality.

Confirmed V3 presentation problems to correct:

1. Hero portrait area is an empty neutral placeholder, causing an unfinished/template feel.
2. Section spacing is visually over-expanded in multiple places because section-level and inner vertical padding stack.
3. Repeated `border + rounded card + muted background` treatment creates low visual differentiation.
4. Project proof is mostly textual instead of screenshot/mockup-led.
5. Personal identity is too weak for a personal-brand-first portfolio.
6. Header/footer/body retain mixed design languages from different generations.
7. Proof sections describe evidence without visually presenting enough evidence.
8. Discover's implemented filter/search UI does not fully realize its approved URL-backed/server-first product spec.
9. Public UI quality was never guarded by a real visual acceptance gate; automated checks could pass while the page still felt generic or unfinished.

V3.1 addresses these issues without reopening the completed V3 backend/release architecture.

---

## 3. Quality Bar

V3.1 must be judged against contemporary high-end portfolio and product-site work, including the quality class represented by recent Awwwards Portfolio / Developer Award / Site of the Day work.

We do **not** copy specific sites.

We benchmark the following qualities:

- immediate authored identity;
- strong typography and composition;
- high-quality original imagery;
- deliberate hierarchy;
- product proof shown visually;
- controlled asymmetry;
- strong rhythm and density;
- polished micro-interaction;
- responsive behavior that feels designed, not merely stacked;
- memorable visual signature without sacrificing usability.

A technically correct but generic shadcn/Tailwind composition is not sufficient.

---

## 4. Product Positioning

Canonical public identity remains:

- **FA:** علیرضا صفایی
- **EN:** Alireza Safaei
- **FA role:** مهندس نرم‌افزار
- **EN role:** Software Engineer
- **Specialization:** Web Systems, Software Architecture & Production Reliability

Homepage job:

1. establish the person;
2. establish senior technical capability;
3. prove it through real work;
4. make collaboration feel low-friction and credible.

The first viewport must feel like a senior engineer/product-builder portfolio, not an agency template, generic SaaS landing page, admin dashboard, or component-library demo.

---

## 5. Art Direction

### 5.1 Core aesthetic

**Premium technical editorial + personal product-builder portfolio.**

Characteristics:

- predominantly light canvas;
- deep ink/navy typography;
- restrained vivid blue/cobalt accent;
- subtle cool-lilac/blue atmospheric depth where useful;
- high local contrast;
- crisp but soft surfaces;
- large personal imagery;
- product screenshots and device/browser mockups;
- selective dark sections for conversion and closure;
- minimal decorative noise.

### 5.2 Visual signature

The site needs a repeatable identity beyond rounded cards.

Approved signature ingredients:

- geometric ASDEV/Alireza monogram treatment;
- fine technical grid / orbital / node motifs used sparingly;
- thin accent rules and annotated micro-labels;
- oversized editorial numerals/section indices where meaningful;
- image crops that break strict card monotony;
- blue edge-light / halo treatment around personal and product imagery;
- restrained code/system annotations as supporting texture, never primary marketing copy.

### 5.3 Explicit anti-patterns

Avoid:

- generic gradient blobs everywhere;
- glassmorphism as a default surface;
- every section inside a rounded card;
- excessive pills/chips;
- repeated identical 3-column cards;
- fake terminal windows;
- decorative dashboards unrelated to real products;
- unreadable tiny text used only for aesthetic density;
- neon cyberpunk styling;
- animation for its own sake;
- huge empty desktop whitespace;
- full-page template symmetry.

---

## 6. Color System

Keep semantic tokens but refine their visual application.

### Light surface direction

- Background: near-white with a subtle cool cast, not flat gray.
- Foreground: deep navy/ink rather than pure black.
- Primary: confident cobalt/electric blue.
- Secondary accent: cool violet only as a supporting tone.
- Border: low-contrast neutral with selective blue tint.
- Muted surfaces: extremely restrained; avoid turning the whole page gray.

### Dark conversion surface

A deep navy / near-black section may be used for the final CTA/footer and selected project presentations.

It should feel intentional and cinematic, not like the dark-theme version of every card.

### Accessibility

All final token combinations must satisfy WCAG 2.2 AA minimum contrast.

A visual choice that fails contrast is not approved even if it matches the concept direction.

---

## 7. Typography

Typography must become a major brand asset.

### Persian

Use the strongest approved local Persian family already available in the repository after visual comparison at real sizes. Prioritize:

- clean modern letterforms;
- strong weight range;
- excellent numerals;
- high readability at 16–18px;
- confident display behavior at 48–80px desktop.

Do not use several Persian font families simultaneously on the same page without a clear typographic role.

### English

Use the current system/local stack unless a legally distributable local font already in the project demonstrably improves the visual system. No external font dependency is required for V3.1.

### Scale

Desktop hero title should be genuinely editorial and prominent.

Recommended target ranges, subject to visual testing:

- Hero role/title: 64–88px desktop, 40–52px mobile.
- Section title: 36–52px desktop.
- Card/project title: 22–32px.
- Body: 16–18px.
- Metadata/micro-label: 12–14px with sufficient contrast.

Use optical line length and rhythm rather than arbitrary utility sizes.

---

## 8. Spacing & Density

V3.1 must eliminate content dispersion.

Rules:

- Define one canonical section-spacing system.
- Do not stack `.section-block` vertical padding with another full `py-*` section padding unless intentionally measured.
- Desktop sections should typically expose meaningful content in every viewport.
- Large whitespace must create hierarchy, not simply lengthen the page.
- Project imagery may use larger vertical space than text-only sections.

Target rhythm:

- major section gap: approximately 80–120px desktop depending on content;
- compact inter-section transitions where background remains continuous;
- mobile spacing reduced proportionally, not simply inherited from desktop.

---

## 9. Global Header

### Desktop

Create a compact premium floating/contained header with:

- Alireza/ASDEV identity mark;
- maximum 5 primary navigation choices in the main row;
- language control;
- one clear collaboration CTA.

Do not make the navigation itself the strongest visual object on the page.

The header should transition subtly on scroll without large blur/glass effects.

### Mobile

Prefer a strong top navigation + sheet/drawer.

The existing fixed bottom navigation must be re-evaluated. It should remain only if real user-flow evidence justifies app-like persistent navigation. A personal portfolio does not automatically need a fixed bottom tab bar.

---

## 10. Homepage Composition

### 10.1 Hero — the signature section

Desktop composition: approximately 55/45 or 58/42.

Content side:

- name eyebrow;
- large `مهندس نرم‌افزار` / `Software Engineer` identity;
- concise value proposition;
- short supporting sentence;
- exactly two dominant actions;
- optional compact verified availability/location/social signal.

Visual side:

- real owner-approved portrait;
- deliberate crop;
- layered technical/orbital graphic system;
- one small evidence/status annotation maximum;
- no generic empty placeholder in release candidate.

Mobile order:

1. portrait/identity visual;
2. name;
3. role;
4. value proposition;
5. CTA pair;
6. compact supporting links.

### Portrait rule

Final production V3.1 requires a real approved portrait.

An AI-generated face may be used only in early concept mockups and must never be shipped as the owner's identity.

### CTA

Primary: `شروع همکاری` / `Start collaboration`  
Secondary: `مشاهده پروژه‌ها` / `View projects`

The primary action may route to a lower-friction collaboration entry before deeper qualification if product flow supports it.

---

## 11. Credibility / Proof Strip

Immediately after the hero, show a compact credibility layer using only real evidence.

Possible approved evidence types:

- owned product marks (PersianToolbox, Audit Systems, Novax, etc.);
- verified shipped-product count only if traceable;
- verified production/release signals;
- real collaboration categories without naming clients;
- links to live products.

Do not display fake partner/client logos from the concept image.

If no strong quantitative proof exists, use live product identity rather than weak invented statistics.

---

## 12. Services — Exactly Three, Visually Distinct

Services remain limited to three, but presentation should no longer look like default cards.

Recommended layout:

- section intro occupying ~30–35% of width;
- three service modules in a controlled asymmetric grid or progressive row;
- each service with a strong icon/graphic cue;
- clear short outcome language;
- subtle index `01 / 02 / 03`;
- one understated path to details.

Services:

1. Product & Web Systems Development
2. Stabilization & Optimization
3. Project Rescue / Completion

Motion: small hover/entry transitions only.

---

## 13. Selected Work — Visual Proof First

This is a critical V3.1 upgrade.

Projects must be presented as authored case-study previews, not text cards.

Each selected project should include:

- real screenshot or designed mockup using real product UI;
- project title;
- one-sentence problem/outcome context;
- role;
- maximum 2–4 relevant technologies;
- evidence-backed outcome if available;
- case-study CTA.

Recommended project set:

- PersianToolbox
- Novax
- Audit Systems

Layout options:

- one large flagship + two supporting projects; or
- alternating wide editorial rows.

Avoid three visually identical rectangles if stronger composition is possible.

Each project should have its own visual palette while remaining inside the master brand system.

---

## 14. Proof / Outcomes

Replace generic "evidence over claims" copy with visible evidence.

Preferred proof formats:

- before/after technical outcomes;
- shipped release/process evidence;
- real screenshots;
- architecture snapshots where useful;
- measurable performance/reliability changes with source/methodology;
- links to live systems.

If a metric is not defensible, do not show the metric.

A small number of high-confidence proof points is better than a large number of weak claims.

---

## 15. About / Personal Trust

The homepage needs to feel owned by a real person.

Use:

- second real contextual photo if available, or a crop/detail from the portrait session;
- concise first-person copy;
- engineering philosophy;
- how collaboration feels;
- social/profile links where useful.

Avoid a one-sentence generic biography.

The user should understand both technical competence and working style.

---

## 16. Final CTA & Footer

The final conversion area may shift to a strong dark cinematic surface.

Requirements:

- one strong collaboration question;
- one primary CTA;
- optional direct email/contact method;
- clean location/availability if accurate;
- no fake phone/client data;
- compact footer navigation;
- consistent identity mark;
- social links.

The footer should feel like an intentional closing scene, not a default 4-column footer template.

---

## 17. Discover V3.1

Discover must keep its Instagram-bio utility while receiving the same premium visual system.

### Product behavior corrections

The approved V3 product contract must finally be honored:

- URL-backed `q` search;
- URL-backed category;
- resource type;
- platform;
- sort;
- page;
- server-backed result state;
- real pagination;
- shareable search/filter URLs.

Client components should update normalized URL params; the server remains the source of result truth.

### Visual direction

- search is the hero, not a decorative heading;
- compact filter bar;
- featured resources clearly separated without fake popularity;
- richer resource imagery/logo treatment;
- consistent card media ratio;
- strong internal profile CTA;
- mobile filtering remains simple and reachable;
- compact editorial disclosure/trust block.

Discover should feel like a premium curated resource library, not a CRUD grid.

---

## 18. Blog / Insights V3.1

Blog presentation should become publication-grade.

Landing:

- strong editorial heading;
- one featured article when real content exists;
- clean article grid/list with hierarchy;
- category/date metadata kept quiet;
- meaningful image treatment only when real artwork exists.

Article:

- excellent Persian/English reading measure;
- robust heading rhythm;
- beautiful code blocks;
- tables usable on mobile;
- pull-quote/callout primitive if content justifies it;
- article metadata and author identity treated professionally;
- related content at end.

Do not overdecorate long-form reading pages.

---

## 19. Motion & Interaction

Motion should communicate quality, not novelty.

Allowed:

- subtle section reveal;
- image parallax of a few pixels where reduced-motion safe;
- card media scale/translation on hover;
- precise button hover states;
- animated accent line/node where performance-safe;
- header state transition.

Avoid:

- scroll hijacking;
- long entrance sequences;
- cursor gimmicks;
- constant floating elements;
- looping decorative animations;
- motion that delays access to content.

All motion must respect `prefers-reduced-motion`.

---

## 20. Responsive Design

Required designed breakpoints / validation widths:

- 360
- 390
- 768
- 1024
- 1280
- 1440
- 1728

Responsive acceptance is not "nothing overflows."

At each class of viewport verify:

- composition remains intentional;
- visual focal point is preserved;
- portrait crop remains strong;
- CTA hierarchy remains clear;
- project media is legible;
- text measures remain comfortable;
- sections do not become oversized empty stacks.

FA RTL and EN LTR must each look authored, not mirrored as an afterthought.

---

## 21. Accessibility

Visual ambition cannot reduce accessibility.

Required:

- WCAG 2.2 AA;
- one H1;
- semantic landmarks;
- visible focus treatment designed into the visual language;
- minimum practical 44px interactive targets;
- proper image alternative text;
- no information encoded only by color;
- reduced motion;
- keyboard-complete navigation;
- correct RTL/LTR focus order and icon direction.

---

## 22. Performance

The site must feel premium because it is fast, not despite being heavy.

Rules:

- `next/image` for controlled imagery;
- AVIF/WebP output through Next where appropriate;
- explicit sizes/aspect ratios;
- no video hero by default;
- no heavyweight animation framework unless proven necessary;
- keep server-renderable content server-rendered;
- no client-side hydration solely for decoration;
- reuse the existing production-safe dependency set when possible.

Targets remain at least the current V3 release quality budget; visual redesign cannot justify a major Lighthouse regression.

---

## 23. Asset Requirements

Before final release candidate:

### Required

1. Real owner-approved professional portrait, high resolution.
2. Real screenshots for PersianToolbox.
3. Real screenshots for Novax.
4. Real screenshots for Audit Systems.

### Preferred

5. One secondary/lifestyle working portrait.
6. Clean project logos/marks where ownership/license is clear.
7. High-quality social preview composition.

No private, client-confidential, unlicensed, or fabricated media may be committed.

---

## 24. Visual Acceptance Gate — New Hard Gate

This is the most important V3.1 process change.

Automated CI is necessary but **not sufficient** for visual completion.

Before a public-UI PR may be considered ready for merge, it must provide current screenshots from the actual implementation.

Minimum evidence matrix:

### Homepage

1. FA — 1440 desktop
2. FA — 390 mobile
3. EN — 1440 desktop
4. EN — 390 mobile
5. dark-theme desktop where dark theme is supported

### Discover

6. FA — 1440 landing/results
7. FA — 390 landing/results
8. representative detail page

### Blog

9. landing
10. representative article page when content exists

### States

11. keyboard focus example
12. reduced-motion verification evidence
13. empty/error state for relevant redesigned surfaces

Screenshots must be reviewed visually **before merge**.

No statement such as "Lighthouse passed" or "Axe passed" substitutes for visual approval.

---

## 25. Visual Review Rubric

Each release candidate is scored 1–5 on:

1. **First-impression quality**
2. **Personal identity / memorability**
3. **Typography**
4. **Composition & hierarchy**
5. **Spacing & density**
6. **Project proof quality**
7. **Interaction polish**
8. **Mobile quality**
9. **FA/EN parity**
10. **Consistency across Home/Discover/Blog**

Merge bar:

- no category below **4/5**;
- average at least **4.4/5**;
- no unresolved obvious placeholder;
- no obvious generic-template section in a primary viewport;
- owner visual approval required.

This rubric is intentionally subjective in part. Visual quality requires human judgment.

---

## 26. Implementation Architecture

Preserve existing production-safe architecture.

Likely impacted public files include:

- `src/app/globals.css`
- `src/app/page.tsx`
- `src/components/sections/homepage-v3.tsx` or successor
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/bottom-nav.tsx`
- `src/lib/home-content.ts`
- `src/app/discover/page.tsx`
- `src/components/discover/*`
- blog presentation components/routes
- new reusable public presentation primitives
- public assets
- targeted E2E/visual tests

Do not rewrite:

- Prisma persistence unless a genuine product requirement emerges;
- Admin architecture merely to match public visuals;
- deployment governance;
- release safety system;
- authentication/security foundations.

---

## 27. Implementation Phases

### Phase A — Visual foundation

- audit existing public shell;
- normalize spacing tokens;
- finalize typography roles;
- finalize color/surface treatment;
- implement reusable visual primitives;
- header/footer redesign.

### Phase B — Homepage signature experience

- real portrait system;
- hero redesign;
- credibility strip;
- services composition;
- screenshot-led selected work;
- proof/outcomes;
- about/personal trust;
- final CTA.

### Phase C — Discover UX correction + redesign

- URL-backed/server-backed filter architecture;
- pagination;
- search-first layout;
- featured/resource hierarchy;
- detail visual refinement.

### Phase D — Blog editorial presentation

- landing hierarchy;
- article reading system;
- responsive code/table styling;
- related content.

### Phase E — Motion, responsive & accessibility polish

- micro-interactions;
- responsive tuning at all required widths;
- RTL/LTR polish;
- keyboard/focus;
- reduced motion.

### Phase F — Visual acceptance

- screenshot matrix;
- compare against V3 baseline;
- owner review;
- iterate until visual bar passes.

### Phase G — governed release

Only after visual approval + automated gates.

---

## 28. Testing & Verification

Retain all V3 safety gates.

At minimum:

- targeted unit/component tests;
- type-check;
- lint;
- build;
- E2E smoke;
- E2E accessibility;
- Lighthouse;
- security scan;
- responsive screenshot capture;
- keyboard navigation verification;
- RTL/LTR visual checks;
- staging deployment;
- two-pass live verification.

Add visual evidence to the PR rather than relying only on text reports.

---

## 29. Release Safety

V3 production remains frozen during design/implementation work.

V3.1 follows the existing governed staging and production workflows.

No production mutation occurs merely because a visual branch exists.

Merge/deploy requires:

- code verification;
- staging verification;
- visual acceptance gate;
- owner visual approval;
- existing production approval process.

---

## 30. Definition of Done

V3.1 is complete only when:

- homepage first viewport feels authored and premium;
- approved real portrait is present;
- no empty visual placeholder remains;
- typography carries a clear brand signature;
- spacing is intentionally dense enough for desktop;
- three services are visually differentiated;
- selected work is screenshot-led;
- proof is visibly evidence-backed;
- About establishes personal trust;
- final CTA/footer is a designed closing experience;
- Discover uses shareable URL-backed/server-backed state and real pagination;
- Discover visually reads as a curated resource hub;
- Blog reads as a professional publication;
- header/footer/mobile navigation share one coherent language;
- FA and EN both feel deliberately designed;
- accessibility/performance/security gates remain green;
- required screenshot matrix exists;
- visual review rubric passes;
- owner approves the rendered result before merge;
- production is deployed only through the governed workflow and live verification passes.

---

## 31. Non-Goals

V3.1 is not permission to:

- invent credentials, clients, awards, metrics, or testimonials;
- replace Alireza's identity with an AI-generated face;
- rebuild backend/admin architecture without a real need;
- introduce a heavyweight animation stack for aesthetics;
- chase Awwwards-style novelty at the expense of clarity;
- sacrifice speed/accessibility for decorative effects;
- turn the site into a generic agency landing page.

---

## 32. Final Design Principle

**Engineering quality gets the site safely to production. Visual judgment decides whether it deserves to be there.**

V3.1 must satisfy both.