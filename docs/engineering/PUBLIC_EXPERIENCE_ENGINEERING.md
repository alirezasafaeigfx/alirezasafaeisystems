# Public experience engineering guide

Updated: 2026-08-31. Design and implementation contract for the [canonical roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md), not another task queue.

The [shared quality/growth contract](../strategy/PAIRED_QUALITY_GROWTH_CONTRACT.md) extends this guide to technical SEO, useful Persian content, reliability and measurement. Keep the stricter budgets below. [GR task cards](../execution/QUALITY_GROWTH_SPRINTS.md) map these concerns to actual sources/tests. Historical version tables describe their stated baseline; PR #26 now contains substantial later implementation and must be inspected before repeating any admission/prototype task.

## 1. Product outcome and visual direction

Build an unmistakably authored engineering portfolio and service experience: editorial typography, purposeful spatial composition, a recognizable operational system, credible documentary evidence, and clear next actions. Primary Persian is conversational and understandable to a nontechnical Iranian business owner. Technical depth is available on demand.

Use the owner's supplied research as design references, not unverified technical claims or permission to copy code/artwork. Retain one coherent ASDEV identity rather than collecting unrelated effects:

| Reference | Transfer into ASDEV | Do not copy |
|---|---|---|
| Lusion / Oryzo | Continuity between a spatial system and a readable evidence diagram; deliberate art direction | Product artwork, proprietary shaders, invented physics/benchmark claims |
| Anime.js | Precise state transitions, selective physical response, user-directed inspection | Physics on every element or an unnecessary second animation runtime |
| Niccolò Miranda | Strong typography, asymmetric editorial hierarchy, varied pacing | Newspaper skin, unreadable Persian type, forced horizontal page scrolling |
| Cartier / Immersive Garden | Calm timing, spatial depth and controlled emphasis | Autoplay audio, expensive materials with no narrative purpose |
| Lando Norris / OFF+BRAND | One memorable signature scene and confident first viewport | Neon racing identity or an obligatory loading screen |
| Messenger / Zentry | Learning through a bounded interaction | Full-site game navigation or hiding service information behind exploration |

Primary sources: [Awwwards winners](https://www.awwwards.com/annual-awards/hall-of-fame), [Lusion Oryzo project](https://lusion.co/projects/oryzo_ai/), [Lusion design process](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations), [Anime.js docs](https://animejs.com/documentation/). Awards establish the references, not ASDEV quality. Statements such as “all physics runs on GPU”, “zero memory overhead”, “guaranteed 60fps” or “a loader improves CWV” must not be repeated without specific evidence.

## 2. Verified stack baseline

Observed in `package.json`, `pnpm-lock.yaml`, `prisma/schema.prisma`, `src/app/layout.tsx` at application SHA `39c09b43191822d70c30f7fa8ae51dadb36d37b7`:

| Layer | Locked baseline | Decision |
|---|---|---|
| Runtime/package manager | Node engine `>=20 <23`; pnpm `9.15.0` | Use compatible Node 22; verify current workflow/toolchain. Do not silently upgrade engines |
| Framework | Next.js `16.2.9`, React/React DOM `19.2.4` | Keep App Router and current server/client boundaries |
| Types/style | TypeScript `5.9.3`, Tailwind `4.3.1` | Extend existing tokens and public styles; no CSS framework replacement |
| UI | Existing shadcn-style components, Radix, Lucide `0.574.0` | Reuse accessible primitives and icon system |
| Persistence | Prisma/client `6.19.2`, SQLite | No database/provider migration |
| Images | Next Image, Sharp `0.34.5` | Sized local assets; optimized WebP/AVIF as suitable |
| Locale | Existing request language, content functions, `locale-utils.ts` | Keep FA/EN routing, RTL/LTR and actual helpers |
| Font/theme | Local Vazirmatn WOFF2, next-themes `0.4.6` | Keep font loading self-hosted and theme semantics |
| Unit/browser | Vitest `4.1.8`, Testing Library, Playwright `1.58.2`, axe `4.11.1` | Behavioral tests plus actual route/browser evidence |
| Visual/performance | Storybook `10.4.6`, LHCI `0.15.1` | Storybook assists component review; actual page is authoritative |
| Delivery | Existing standalone build and governed VPS workflow | Preserve deploy, backup, rollback and server architecture |

These are observed versions, not a recommendation to freeze forever or to claim current security. Before installing, inspect the actual lockfile and official release/security information. Existing Dependabot PRs are separate work; do not merge them as incidental visual preparation. Never use `@latest` or unpinned CDN imports in Production.

## 3. Library and repository selection

| Need | Preferred choice | Admission / exact boundary |
|---|---|---|
| Normal hover/focus, reveal, layout | CSS transforms/opacity, SVG, browser observers, WAAPI | Existing platform; finite motion, accessible states |
| Coordinated timeline or physical manipulation not cleanly served natively | `animejs` v4, [juliangarnier/anime](https://github.com/juliangarnier/anime) | Task `S4-10`; pin one verified compatible version and import only needed modules |
| Signature scene with meaningful depth/camera/lighting | `three`, [mrdoob/three.js](https://github.com/mrdoob/three.js) | Task `S4-11`; one deferred client island, WebGL2 with semantic fallback |
| Optimizing an actually required 3D asset | Three.js loaders; Blender/glTF tooling if already available | Prefer procedural geometry first; add tooling only when an asset requires it |
| Icons | Existing Lucide | Do not add another icon pack or generate inconsistent icons |
| Evidence diagrams | Semantic SVG/HTML from actual case-study facts | Never generated fake terminal/dashboard screenshots |
| Raster creative assets | Image-generation capability if available and appropriate | Original art only; identify illustrative assets, retain source/rights; not proof of real systems |

Do not add GSAP, Framer Motion, Anime.js, React Three Fiber and a physics engine together. Anime.js is the default advanced-motion candidate; GSAP is not an automatic fallback. React Three Fiber/Drei, WebGPU-specific rendering, smooth-scroll runtimes, post-processing chains and physics libraries are outside this admitted implementation unless a concrete need is recorded in the roadmap. Existing useful CSS is not “obsolete.”

For `S4-10` / `S4-11`, the owner-requested engineering revision admits bounded evaluation and a prototype; production adoption still requires measured acceptance. Dependency installation is part of its specific implementation PR, not this docs revision. Record version, license, imports, alternatives considered, actual compressed cost, maintenance/security observations and rollback. Do not assume all third-party assets share the code library's license.

Historical CI blocker at `39c09b4`: package/lockfile changes were routed into an R0-only allowlist that rejected release/application categories. PR #26 already introduces `public-experience-dependencies` with bounded paths and S4-10/11/12 admission. Inspect and reuse that implementation/tests, rather than reintroducing it. GR-01 may extend only missing EC/GR criteria/admission under a bounded concern with negative tests; no disabled checks, hidden install or false R0/S4 declaration.

## 4. Source map and boundaries

| Concern | Existing path to extend |
|---|---|
| Home composition | `src/components/sections/homepage-v3.tsx` |
| Home copy/proof | `src/lib/home-content.ts`, `src/lib/evidence.ts` |
| Hero scene | `src/components/public/operational-scene.tsx` |
| Shared primitives | `src/components/public/proof-strip.tsx`, `project-showcase.tsx`, `visual-frame.tsx`, `section-heading.tsx` |
| Styles | `src/app/public-v31.css`, `src/app/globals.css` |
| Header/footer | `src/components/layout/header.tsx`, `footer.tsx` |
| Flagship | `src/app/case-studies/infrastructure-localization-rescue/page.tsx` |
| Index | `src/app/case-studies/page.tsx` |
| Discover | `src/components/discover/*`, `src/lib/discover-query.ts`, `src/app/discover/*` |
| Locale/metadata | `src/lib/locale-utils.ts`, `src/lib/i18n/server.ts`, `src/app/layout.tsx` |
| Analytics | `src/lib/analytics/client.ts`, `src/components/analytics/web-vitals.tsx` |
| Current coverage | `src/__tests__/components/homepage-v3.test.tsx`, `operational-scene.test.tsx`, `src/__tests__/lib/evidence.test.ts`, `e2e/public-v31-visual.spec.ts` |

Proposed files belong to their task, and are not claimed to exist: `src/lib/system-scene.ts`, `src/lib/public-copy.ts`, `src/components/public/system-scene-controls.tsx`, `src/components/public/system-core-3d.tsx`, `src/components/public/flagship-preview.tsx`, `e2e/public-experience.spec.ts`, `e2e/public-experience-live.spec.ts`, `scripts/ci/validate-public-experience-evidence.mjs`. Reuse an equivalent existing file if found; document that mapping once rather than duplicate it.

Current continuation mapping: PR #26 already has `src/lib/system-scene.ts`, `src/components/public/system-core-3d.tsx`, its launcher, `e2e/public-experience.spec.mjs`, `e2e/system-core-3d-lifecycle.spec.mjs` and the evidence/budget scripts. These supersede matching proposals above. Reuse the actual `.mjs` tests; do not create duplicate `.ts` suites because an older card named one. Verify whether a distinct read-only live spec is still missing before adding it.

## 5. Scene contract

One semantic model feeds the DOM/SVG view, optional advanced animation and optional GPU view. Do not create three unrelated narratives.

```ts
export type SystemSceneState = 'pressure' | 'diagnosis' | 'intervention' | 'stable' | 'evidence'
export type SceneEvent =
  | { type: 'select'; state: SystemSceneState }
  | { type: 'next' }
  | { type: 'previous' }
export type SceneMode = 'static' | 'native' | 'advanced' | 'gpu'
```

`transitionScene(current, event)` is a proposed pure function in `src/lib/system-scene.ts`. Clamp next/previous at boundaries; explicit select supports deterministic backtracking. Mode selection must not change the facts or selected state. Test user actions, not frame counters.

| State | Visual meaning | Plain-language meaning |
|---|---|---|
| pressure | A specific dependency/path is constrained or unavailable | «سایت به مشکل خورده» |
| diagnosis | Isolate the actual cause; show which part is affected | «مشکل رو پیدا می‌کنیم» |
| intervention | A visible, explainable routing/architecture change | «مسیر درست رو جایگزین می‌کنیم» |
| stable | Show the result and any remaining limitation | «سایت دوباره درست کار می‌کنه» only for a justified scenario |
| evidence | Continue into the same readable diagram and inspectable proof | «ببین چه چیزی بهتر شده» |

A conceptual teaching scene says «نمونهٔ آموزشی» visibly. A customer documentary uses verified facts. Do not imply a random fallback guarantees availability or that all outages share one fix.

User controls are real buttons with keyboard/touch support and accessible selected state. Pointer exploration is optional. Scroll may select coarse narrative stages using an observer, but must never hijack scrolling or force a long pinned sequence. No continuous global scroll state or React rerender per frame.

## 6. Art direction and composition

- Hero: concise Persian positioning and clear assessment action visible without waiting; operational art is the signature, not a stock dashboard or a few circles in a card.
- Typography: deliberate contrast in headline/body/captions, legible Persian shaping and measure. Target body 16–17px mobile / 17–18px desktop; test zoom rather than shrinking labels to fit.
- Use whitespace, dividers, large media and editorial asymmetry. Do not merely change all card corner radii or hover effects and call it a redesign.
- Flagship gets a dominant preview with real before/after architecture, a concrete problem and a direct detail route. Other projects remain supporting work.
- Move the existing real portrait to the founder/credibility section; do not generate a replacement identity.
- Mobile: put meaning and action ahead of tall art. Redraw the scene into a compact causal layout; use tap-based progressive detail, not hover-only or scaled desktop text.
- Header, scene, evidence, flagship and final CTA should share motion/timing and visual vocabulary, without a loop on every section.

Before implementation capture a baseline; during implementation review actual screenshots at the same viewport. The chat demonstration from this conversation is only a behavior study, not accepted final art or an implementation asset to copy verbatim.

## 7. Motion, 3D and fallback lifecycle

Initial motion bands: response 120–180ms, transition 180–320ms, narrative 400–700ms. Tune from real recordings; do not claim these numbers guarantee quality. Use spring response only for physically manipulated elements, not every text reveal.

Reduced motion starts in a static readable composition with equivalent state controls. Prefer immediate replacement or restrained crossfade. No 3D initialization for reduced-motion/static modes unless a user explicitly requests the optional view.

Three.js implementation, if accepted:

- Deferred client island; ordinary DOM contains headings, navigation, controls, narrative and links.
- WebGL2 feature failure, context loss or module/asset load failure restores a complete SVG view without losing selection or focus.
- Same scene model and projected anchor mapping for spatial-to-flat continuity; a fade to an unrelated image does not count.
- Render on demand or only during a finite active interaction. Pause when hidden/offscreen and cancel work on navigation.
- Dispose owned geometries, materials, textures, render targets, observers, listeners and renderer. Do not remove resources shared by another owner.
- Cap pixel ratio and backing resolution from actual canvas size; default cap 1.5 desktop and 1 mobile for the prototype, then measure quality/performance.
- No mandatory audio, post-processing or imported heavy models. Design recognizable procedural art; a default spinning cube is not the signature deliverable.

Primary implementation sources: [Three.js cleanup](https://threejs.org/manual/en/cleanup.html), [responsive rendering](https://threejs.org/manual/en/responsive.html), [rendering on demand](https://threejs.org/manual/en/rendering-on-demand.html), [Anime.js WAAPI trade-offs](https://animejs.com/documentation/web-animation-api/when-to-use-waapi), [hardware acceleration limitations](https://animejs.com/documentation/web-animation-api/hardware-accelerated-animations/), [Next.js documentation](https://nextjs.org/docs). Read the version-matched API before coding; a source URL is not a claim that an API was tested.

## 8. Performance acceptance budgets

These are project acceptance targets, not reported measurements:

| Measure | Required budget / reporting |
|---|---|
| LCP | ≤2.5s under documented acceptance profile; p75 field data when available |
| INP | ≤200ms p75 where sufficient field data exists; otherwise report measured lab interaction latency separately, not as field INP |
| Lab interaction proxy | ≤200ms maximum sampled event-to-next-paint latency across the declared interaction script in all three runs; report unsupported instrumentation as unverified |
| CLS | ≤0.1 |
| Gate A initial route JS delta | ≤30 KiB gzip against the frozen baseline, using the same build/toolchain |
| GPU island initial-route dependency | 0 bytes before deferred activation; verify actual requests, not just a dynamic-import statement |
| Deferred GPU code budget | Initial project ceiling 250 KiB gzip for the added island/runtime; exceptions require a recorded roadmap decision before adoption |
| Extra scene assets | ≤1 MiB transfer desktop / ≤512 KiB mobile; prefer no external model or texture |
| Long tasks | No attributable task >50ms on the acceptance profile; show trace evidence |
| Frame pacing | Target 60fps during active motion; record median/p95 frame time and device, do not infer FPS from CSS duration |
| Idle/hidden | No animation/render loop after settling or while hidden/offscreen |

Compare identical production builds with at least three controlled runs per route/profile. Before capture, S5-01 freezes the interaction script (scene controls, menu, assessment link and Discover filters where applicable), instrumentation and aggregation. Use median LCP and maximum CLS across the three runs, maximum sampled lab event-to-next-paint latency, and all-run attribution for long tasks. Preserve every raw run, not just the best result. Field INP remains unavailable until sufficient real observations exist; a lab proxy pass is labeled lab acceptance, never field INP success.

Record browser/version, actual hardware or emulator, network/CPU settings and cache state. Controlled mobile profile: 390×844, 4× CPU slowdown, approximately 1.6 Mbit/s download, 750 Kbit/s upload and 150ms latency; record actual runner limitations. Also test a real mid-range Android if available; absent hardware is disclosed, not fabricated. Preserve desktop/tablet normal-network evidence too.

Current `lighthouserc.json` warns at LCP 4s and CLS 0.2 and a 0.75 performance score. That existing green job DOES NOT establish these tighter project budgets. `S5-01` must make the required measurements and acceptance failures explicit without falsely claiming existing CI enforces them.

## 9. Browser, copy and evidence verification

Core widths: 390, 768, 1440 in FA/EN. Edge layout checks: 360, 1024, 1728. Check both supported themes, zoom/reflow, long Persian copy, keyboard, touch, reduced motion, blocked optional assets, no-JS and route leave/return.

Use actual routes for all final page verdicts. Extend current tests; add dedicated public-experience tests where they cover genuinely new behavior. Do not measure performance in a dev server or while recording heavy debug video without disclosing the overhead.

Local commands use `pnpm exec`, the repository's locked toolchain and a disposable DB:

```bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm lint
pnpm exec vitest run src/__tests__/components/homepage-v3.test.tsx src/__tests__/components/operational-scene.test.tsx src/__tests__/lib/evidence.test.ts
pnpm exec playwright test e2e/public-experience.spec.mjs --config=playwright.config.mjs
pnpm build
```

Use the actual PR #26 successor test path after safely bringing that implementation into the task branch; this docs branch alone does not contain the application changes. A missing suite is not a skip that passes. Browser installation/network failure is a tool blocker, not proof of UI correctness. Never redirect the full existing fixture-writing visual suite to Production. Any distinct live spec must be read-only and use `PLAYWRIGHT_DISABLE_WEBSERVER=true` with explicit public base URL and no fixture creation/submission.

Publish durable sanitized screenshots, motion recordings, traces and raw performance results with candidate SHA and hashes. An owner-PC temp folder alone is not a final evidence handoff. [Report review protocol](../governance/CODEX_REPORT_REVIEW.md) defines the manifest and verification.

## 10. Skills and tool discovery

Use actual installed skills/tools; names vary by executor. Never invent availability or install a plugin merely because it is listed here.

| Work | Capability / preferred skill when available |
|---|---|
| Requirements and task execution | Superpowers brainstorming, writing-plans, executing-plans or subagent-driven-development; reuse this approved design, do not restart planning |
| Isolation and implementation | using-git-worktrees; test-driven-development for behavior |
| Failures | systematic-debugging before speculative fixes |
| Review and acceptance | requesting-code-review, receiving-code-review, verification-before-completion |
| Current official APIs | Web/documentation lookup; primary sources only |
| Visual inspection | Browser/Playwright; control-browser skill if that environment uses it |
| Original raster assets | imagegen only when useful; never for precise diagrams or fake evidence |
| Existing hosted project | Sites skills only if `.openai/hosting.json` actually exists; do not migrate this VPS project into Sites |
| Connected repository | GitHub tools or authenticated Git CLI with correct repo scope |

If a specialized tool is missing, use an equivalent available capability and disclose the substitution. No paid service, new account, hosted runtime dependency, API key purchase or external messaging is assumed. Inspect resources/licenses before copying examples. Do not use a research article as authoritative API documentation.

## 11. SEO, content and measurement implementation

Reuse `src/lib/seo.ts`, App Router metadata/robots/sitemap, existing Discover query handling, `src/lib/blog.ts`/Admin publication path, analytics client/API and web-vitals component. GR-02 owns cross-template SEO regression, GR-03 content/source records, GR-04 actual task utility and GR-05 measurement truth. No SEO plugin, CMS migration or new analytics provider is required.

Check server HTML and rendered DOM/HTTP behavior. A web text extract can omit JSON-LD; it cannot prove schema absence. Keep public content crawlable without motion/3D. Private routes require real authorization regardless of robots/noindex. Test intended indexed routes and excluded utility/draft/private routes separately, including locale/query variants.

Use the shared contract's checked Google Search Central/web.dev/W3C sources, then official version-specific framework documentation for implementation. Automated Lighthouse/axe/schema helpers assist verification; they do not prove Google indexing, human comprehension, visual distinction or field outcomes. New packages require a real gap, compatible exact pin/license/security review and admitted scope.

GR-01 extends the actual evidence validator from PR #26 only after reading its current interface. Preserve its valid strict checks, add new mapped criteria and reject unknown IDs without pretending that new policy is already enforced. Scope code/test/tooling units separately from final product/release/field outcomes.
