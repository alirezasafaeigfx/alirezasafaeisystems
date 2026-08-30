# V3.2 — Immersive Interaction System

**Status:** Proposed design specification; documentation only  
**Date:** 2026-08-30  
**Branch intent:** Isolated design documentation; no application, dependency, workflow, deployment, database, content-publication, or production mutation  
**Program:** ASDEV Public Experience V3.2  
**Parent direction:** Engineering Editorial + Operational Interface  
**Authority:** Subordinate to `docs/strategy/FOCUS_POLICY.md`, `AGENTS.md`, `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`, and the approved V3.2 evidence/conversion design

## 1. Decision

ASDEV may adopt a more immersive interaction model, but only as a progressive enhancement of the existing evidence-led V3.2 direction.

The purpose is not to make the site visually noisy, game-like, cyberpunk, or dependent on a 3D canvas. The purpose is to make operational systems, engineering decisions, failure modes, interventions, and measurable evidence easier to understand and more memorable.

The visual identity target is:

> **Operational systems made visible.**

The implementation model is deliberately gated:

1. **Gate A — Semantic Scene Logic:** prove the experience with semantic DOM/SVG/CSS and code-native operational diagrams.
2. **Gate B — Advanced Motion:** introduce a dedicated animation runtime only where CSS/WAAPI is objectively insufficient for a meaningful interaction.
3. **Gate C — GPU Signature Scene:** introduce Three.js/WebGL/WebGPU only if a measured prototype demonstrates material narrative value without violating performance, accessibility, reliability, and mobile budgets.

No gate authorizes the next gate automatically.

## 2. Relationship to the approved V3.2 roadmap

This specification does not replace S1–S5 and does not create an independent visual-redesign program.

It refines the existing S4 direction:

- S4-01: reduce equal-weight card surfaces;
- S4-02: establish distinctive bilingual editorial rhythm;
- S4-03: author mobile composition instead of stacking desktop sections;
- S4-04: introduce one meaningful operational visualization where it explains the work;
- S4-05: add purposeful motion with complete reduced-motion behavior.

The immersive track is evaluated only after the release/governance state in R0 is reconciled and only after the V3.2 implementation base is established.

## 3. Core experience principle: Scene Logic over Page Logic

Traditional page logic treats each section as an isolated vertical block. ASDEV should instead model the high-value public experience as a small number of meaningful narrative states.

The Home page target flow is:

```text
Hero Positioning
      │
      ▼
Operational System Scene
      │
      ├── unstable
      ├── diagnosing
      ├── intervention
      └── stable
      │
      ▼
Evidence Transition
      │
      ▼
Quantitative Proof
      │
      ▼
Flagship Case Study
      │
      ▼
ASDEV Audit
```

Scrolling may advance narrative state, but information hierarchy must never depend on animation execution.

If JavaScript, animation, GPU rendering, or advanced interaction is unavailable, the information order remains:

```text
Hero
→ System Diagram
→ Proof
→ Flagship Evidence
→ Audit CTA
```

This fallback is a first-class experience, not an error mode.

## 4. Brand behavior

ASDEV must not borrow the surface aesthetics of award-gallery websites without preserving its own product meaning.

### Required traits

- technical, restrained, intentional;
- evidence-led rather than spectacle-led;
- editorial typography combined with operational diagrams;
- dark/light depth only where it reinforces system hierarchy;
- motion that communicates state, cause, sequence, or topology;
- visual confidence without fake dashboards, fake terminals, fake telemetry, or fabricated client evidence.

### Explicitly rejected defaults

- generic cyberpunk interface language;
- permanent glowing grids;
- decorative particle fields with no semantic role;
- glassmorphism as a primary design system;
- endless ambient motion;
- scroll hijacking;
- cursor replacement that obstructs normal interaction;
- full-site 3D dependency;
- cinematic loading screens whose only purpose is masking oversized payloads;
- meaningless parallax;
- cloned Awwwards composition patterns.

## 5. Gate A — Semantic Operational Scene

Gate A is the default implementation direction and must be attempted before adding a dedicated animation or 3D dependency.

### 5.1 Hero operational scene

The Hero may include a code-native representation of a web system under pressure.

Suggested conceptual states:

```text
State 01 — Pressure
Traffic rises. A path becomes constrained.

State 02 — Diagnosis
The bottleneck is isolated and labelled.

State 03 — Intervention
Topology, routing, caching, localization, or deployment behavior changes.

State 04 — Stabilization
The system reaches an explainable steady state.

State 05 — Evidence
The visual state resolves into sourced quantitative proof.
```

The scene must not display invented operational facts. If it represents a real case study, every technical claim follows the V3.2 evidence/provenance contract.

### 5.2 Proof continuity

The operational scene should transition conceptually into the evidence layer instead of ending as decoration.

Candidate sourced metrics remain governed by the parent V3.2 evidence registry, for example:

- MTTR: `180 min → 55 min`;
- deployment failure: `−58%`;
- emergency rollback: `0 / 30 days`.

The animation cannot make a metric valid. Provenance makes it valid.

### 5.3 DOM/SVG implementation preference

Preferred primitive order:

1. semantic HTML;
2. CSS layout and transitions;
3. SVG for topology, paths, directional flow, masks, and diagrams;
4. Web Animations API where native timeline control materially helps;
5. dedicated motion library only after Gate B approval;
6. GPU canvas only after Gate C approval.

## 6. Motion language

Motion is a system-level design primitive and must not be authored independently in each component.

### 6.1 Semantic motion vocabulary

The initial vocabulary is:

```text
enter
exit
reveal
shift
focus
system-pulse
evidence-reveal
state-transition
topology-change
```

Every animation must map to one of these semantics or justify a new semantic token.

### 6.2 Timing bands

Initial timing bands for prototype evaluation:

```text
instant      80–120ms
response     140–180ms
transition   240–360ms
narrative    500–900ms
```

These are design budgets, not hard-coded universal values. Human review determines whether a particular interaction feels slow, distracting, or ambiguous.

### 6.3 Physical motion

Spring/inertia behavior is appropriate only where an element is perceived as physically manipulated or where velocity communicates causality.

Examples that may justify physics:

- draggable architecture inspection;
- inertial node exploration;
- elastic transition between explicit system states;
- controlled kinetic typography tied to state change.

Simple opacity, hover, navigation, focus, and small translations should not gain a physics dependency merely for visual novelty.

## 7. Gate B — Advanced Motion Runtime

A dedicated animation dependency may be introduced only when a concrete Gate A prototype proves that CSS/WAAPI cannot provide the required interaction cleanly.

### Entry criteria

At least one approved interaction must require one or more of:

- coordinated multi-target timeline control;
- physical drag/inertia behavior;
- stateful spring simulation;
- non-trivial SVG morph/path animation;
- layout transitions that cannot be implemented reliably with existing primitives;
- synchronization between semantic DOM and a future GPU scene.

### Dependency decision record

Before adding a motion library, the implementation PR must record:

- exact use case;
- why CSS/WAAPI is insufficient;
- added compressed bundle cost;
- tree-shaking behavior;
- hydration/client-boundary impact;
- accessibility implications;
- mobile CPU cost;
- teardown/memory behavior;
- reduced-motion path;
- fallback behavior.

A library is not approved because it is popular, award-winning, or visually impressive.

## 8. Gate C — GPU Signature Scene

Three.js/WebGL/WebGPU is optional, not a V3.2 requirement.

The only currently recommended 3D concept is a single **System Core** scene that visualizes architecture under pressure and then resolves into a normal technical diagram/evidence surface.

### 8.1 Candidate System Core narrative

Conceptual topology:

```text
        EDGE
         │
API ─── CORE ─── CACHE
         │
      DATABASE
```

Possible narrative:

```text
Pressure
→ path saturation
→ diagnosis
→ architecture intervention
→ stable topology
→ flatten into 2D architecture diagram
→ measurable evidence
```

The key value is the semantic `3D → 2D` continuity. The 3D object must become or directly explain a real information surface.

### 8.2 GPU entry criteria

Gate C may proceed only if all are true:

1. Gate A experience is already complete and understandable without GPU rendering.
2. A prototype demonstrates a clear comprehension or brand-memory benefit.
3. The scene is singular and bounded rather than a site-wide rendering dependency.
4. LCP content is not blocked by the scene.
5. keyboard, screen-reader, reduced-motion, and no-JS paths remain complete.
6. mobile adaptive-quality behavior is designed before implementation.
7. a static/code-native visual fallback exists.
8. memory cleanup and route-transition teardown are verified.
9. visual and performance tests cover the scene at required widths.
10. the dependency and asset budget receives explicit technical approval in the implementation PR.

## 9. Adaptive quality controller

Responsive design is insufficient for immersive rendering. Capability and user preference must influence the interaction tier.

Proposed tiers:

```text
Tier 0 — Static semantic diagram
Tier 1 — DOM/SVG + CSS motion
Tier 2 — DOM/SVG + advanced animation runtime
Tier 3 — GPU signature scene
```

Inputs may include:

- `prefers-reduced-motion`;
- viewport and input mode;
- rendering capability;
- measured frame stability;
- memory pressure signals where safely available;
- page visibility/background state;
- device pixel ratio;
- asset readiness;
- runtime failure/fallback conditions.

The controller must fail downward safely. A failed Tier 3 scene becomes Tier 1/0 content, not a blank Hero.

## 10. Performance contract

Immersive behavior is subordinate to responsiveness and production reliability.

### Core Web Vitals release targets

- LCP: target `≤ 2.5s` at the 75th percentile;
- INP: target `≤ 200ms` at the 75th percentile;
- CLS: target `≤ 0.1` at the 75th percentile.

These targets do not replace project Lighthouse/CI policy.

### Additional ASDEV immersive budgets

The implementation must enforce or verify:

- LCP/H1/primary CTA render independently of any GPU scene;
- no scene asset is required for semantic first paint;
- later scene assets use deferred/lazy loading;
- canvas dimensions are reserved before activation;
- no render loop while the scene is outside the active viewport unless explicitly justified;
- render loop pauses when the document is hidden;
- device pixel ratio is bounded rather than blindly using maximum DPR;
- large textures/models require explicit compression and dimensions;
- route transitions dispose geometry, textures, listeners, observers, and animation timelines;
- no long-running animation causes repeated main-thread long tasks;
- mobile experience remains useful when advanced rendering is disabled.

### Prototype evidence

A Gate B/C prototype must record before/after evidence for:

- JS transferred;
- total scene asset weight;
- LCP;
- INP or interaction latency proxy in controlled lab tests;
- CLS;
- long tasks;
- average and worst observed frame pacing during the scene;
- memory behavior before entering and after leaving the route where practical.

## 11. Reduced-motion mode is a design mode

`prefers-reduced-motion` must not be implemented as a global emergency kill switch that leaves ambiguous states.

Normal path example:

```text
node travels
→ topology transforms
→ evidence emerges
```

Reduced-motion equivalent:

```text
Diagram A
→ restrained crossfade/state replacement
→ Diagram B
→ evidence visible
```

The information, order, labels, CTA availability, focus behavior, and proof must remain equivalent.

No content may require motion to become discoverable.

## 12. Accessibility contract

All immersive components must satisfy the existing accessibility gates plus these additional rules:

- semantic heading and landmark hierarchy remains in DOM;
- Canvas/SVG visuals have an equivalent accessible explanation where needed;
- keyboard interaction never requires drag;
- pointer-only interactions have keyboard/touch alternatives;
- focus indicators are never hidden behind visual layers;
- motion does not create unavoidable vestibular triggers;
- no flashing pattern violates safe animation thresholds;
- auto-playing sound is forbidden;
- spatial audio, if ever proposed, requires separate explicit UX approval and user initiation;
- reduced-motion mode is tested, not assumed;
- RTL/LTR mirroring is intentional rather than a transform accident.

## 13. Mobile composition

Mobile is an authored experience, not the desktop timeline compressed into a narrow viewport.

The mobile path should usually:

- reduce simultaneous animated elements;
- shorten spatial camera-like movement;
- replace hover/cursor behaviors with explicit touch targets;
- prefer vertical causal flow;
- reduce GPU quality tier earlier;
- keep proof and CTA visible without waiting for a long scroll sequence;
- avoid pinned scenes that consume excessive viewport height;
- preserve normal browser scrolling.

A mobile implementation that merely disables broken desktop effects does not pass S4-03.

## 14. Flagship Case Study as technical documentary

The immersive interaction system reaches its highest value in the flagship `infrastructure-localization-rescue` case study.

Preferred documentary structure:

```text
01 / INCIDENT
What failed?

02 / CONSTRAINT
Why was the system difficult to stabilize?

03 / BEFORE SYSTEM
Architecture before intervention

04 / DIAGNOSIS
Where the actual bottleneck/failure originated

05 / INTERVENTION
What changed and why

06 / AFTER SYSTEM
Architecture after intervention

07 / EVIDENCE
Measured outcome

08 / TRADE-OFFS
What was deliberately not changed

09 / VERIFICATION
How the result was validated

10 / AUDIT
Could the visitor's system have a related failure mode?
```

The narrative may animate transitions between these states, but every state must remain independently readable and link to truthful provenance.

## 15. Candidate Home blueprint

This is a design direction, not implementation authorization.

### Home / 01 — Hero

Purpose: explain the ASDEV positioning within three seconds.

Required information:

- evidence-led H1;
- concise supporting line;
- primary ASDEV Audit CTA;
- secondary evidence CTA;
- optional operational scene that does not delay the above.

### Home / 02 — Operational proof

Purpose: visually explain that ASDEV works on systems under real pressure.

Preferred format:

- one system topology;
- one clear problem state;
- one intervention transition;
- direct handoff into sourced metrics.

### Home / 03 — Quantitative evidence

Purpose: show proof rather than product-name badges.

The proof strip is semantic text first. Motion is optional.

### Home / 04 — Flagship documentary preview

Purpose: make the case study feel like inspectable engineering work rather than a portfolio tile.

Use a dominant editorial layout, architecture preview, one or two verified outcomes, and a direct evidence route.

### Home / 05 — Selected systems/work

Purpose: supporting evidence only.

Avoid returning to a dense wall of equal-weight bordered cards.

### Home / 06 — Services / Audit bridge

Purpose: connect what was shown to a concrete technical assessment.

### Home / 07 — Final Audit CTA

Purpose: close the narrative with one dominant action and an explicit expectation of what the assessment provides.

## 16. Interaction state model

Interactive scenes must be implemented as explicit state machines or similarly inspectable state models rather than ad-hoc scroll callbacks distributed across components.

Conceptual shape:

```ts
type SystemSceneState =
  | 'idle'
  | 'pressure'
  | 'diagnosis'
  | 'intervention'
  | 'stable'
  | 'evidence';
```

Requirements:

- deterministic transitions;
- no impossible state combinations;
- reduced-motion mappings for every narrative state;
- testable state entry/exit behavior;
- URL/navigation changes do not leave orphan listeners or animation state;
- analytics track meaningful experience events, not every animation frame.

## 17. Analytics contract

Immersive interaction is valuable only if it supports comprehension and conversion.

Potential meaningful events:

- Hero evidence CTA viewed/clicked;
- operational proof entered;
- flagship evidence opened;
- ASDEV Audit CTA clicked after evidence exposure;
- reduced-motion experience used where privacy-safe and policy-compliant only if this measurement is genuinely required.

Do not instrument decorative animation milestones as vanity analytics.

## 18. Testing strategy

### Unit/component

Test:

- state-machine transitions;
- reduced-motion mapping;
- fallback content presence;
- evidence registry integration;
- adaptive-tier selection logic where deterministic;
- resource cleanup helpers.

### Browser/E2E

Required widths remain aligned with V3.2:

- `390`;
- `768`;
- `1440`;

Additional targeted checks remain useful at:

- `360`;
- `1024`;
- `1728`.

Test both FA/EN where applicable.

Required interaction evidence:

- keyboard-only path;
- touch/mobile path;
- reduced motion;
- slow network;
- first render before enhanced assets load;
- route enter/leave/return;
- no horizontal overflow;
- primary CTA availability throughout narrative;
- screenshot states for stable narrative checkpoints, not arbitrary animation frames.

### Performance regression

Gate B/C cannot merge on visual approval alone. Performance deltas require recorded evidence and a reviewer verdict.

## 19. Failure and fallback design

The immersive layer must fail safe.

Examples:

- animation runtime fails to load → static DOM/SVG composition;
- WebGL/WebGPU unavailable → semantic 2D diagram;
- model/texture load fails → code-native fallback art;
- reduced-motion enabled → reduced-motion narrative;
- device too constrained → lower tier;
- tab hidden → pause;
- navigation interrupts scene → cleanup and normal route transition.

No fallback may expose an empty container with the main information missing.

## 20. Security and privacy

The immersive system must not introduce unnecessary telemetry, third-party render services, remote asset dependencies, fingerprinting logic, or externally hosted runtime code.

Any capability detection must be minimal and directly tied to rendering safety, not user fingerprinting.

No operational diagram may expose secrets, internal IPs, credentials, real client confidential architecture, private log excerpts, or unsanitized infrastructure details.

## 21. Dependency governance

Current V3.2 should begin dependency-neutral.

Before any new animation/3D dependency:

1. inspect existing platform capabilities;
2. prototype the exact missing behavior;
3. measure bundle/runtime impact;
4. document why native primitives are insufficient;
5. add targeted tests;
6. obtain normal repository review/gates;
7. preserve lockfile discipline;
8. reject unrelated dependency churn.

This specification does not pre-authorize Anime.js, GSAP, Three.js, React Three Fiber, a physics engine, shader toolkit, model loader, or WebGPU abstraction.

## 22. Agent execution lanes after authorization

This section defines future ownership only. It does not authorize execution while R0 is unresolved.

### ORCH

- owns scope, dependency decisions, integration order, and ledger truth;
- prevents Gate B/C from starting without evidence;
- remains sole integration/ledger writer under the parent execution model.

### UX

- authors scene narrative;
- validates hierarchy, pacing, mobile composition, reduced motion;
- prevents decorative scope creep.

### FE-MOTION

- implements Gate A primitives;
- owns state model, observers, animation lifecycle, cleanup;
- proposes Gate B only with measured need.

### FE-GPU

- dormant unless Gate C is explicitly approved;
- owns renderer lifecycle, assets, quality tiers, and static fallback.

### EVID

- validates every metric, architecture statement, and case-study transformation;
- blocks fabricated operational storytelling.

### QA

- owns cross-width, FA/EN, touch, keyboard, reduced-motion, slow-network, and visual-state evidence.

### PERF

- owns bundle/render/performance budgets and before/after measurements.

### REVIEW

- independently scores comprehension, accessibility, performance, truth, and whether immersive behavior actually improves the experience.

## 23. Proposed gate verdicts

### Gate A PASS

Allowed when:

- semantic operational scene is useful without advanced dependencies;
- mobile and reduced-motion paths are complete;
- evidence continuity works;
- no regression to conversion hierarchy;
- human review confirms motion improves comprehension.

### Gate B PASS

Allowed when:

- Gate A is green;
- a specific native limitation is demonstrated;
- dependency budget is acceptable;
- tests and fallback are complete.

### Gate C PASS

Allowed when:

- Gate A/B baseline is already strong;
- GPU prototype produces clear incremental value;
- performance/accessibility budgets pass;
- scene remains optional and isolated;
- mobile fallback is excellent;
- human review prefers it for a reason stronger than novelty.

### FAIL / HOLD

Any gate is held when the experience is prettier but less clear, slower, harder to navigate, less accessible, less truthful, or more fragile.

## 24. Non-goals

- no implementation before R0/post-release base is reconciled;
- no changes to the exact V3.1 approved application candidate for this design proposal;
- no Admin/Prisma/auth/deployment architecture rewrite;
- no production mutation;
- no new content publication;
- no fabricated metrics or architecture;
- no full-site game mechanics;
- no 3D-for-3D's-sake;
- no dependency adoption without a measured gate;
- no replacement of semantic content with Canvas.

## 25. Definition of success

The immersive interaction system is successful only if:

1. a qualified visitor still understands ASDEV's positioning within three seconds;
2. evidence is more understandable, not merely more animated;
3. the flagship case study reads as a technical documentary;
4. mobile composition feels authored;
5. reduced-motion is complete and intentional;
6. semantic/no-JS/fallback content remains useful;
7. Core Web Vitals and repository performance gates remain healthy;
8. no metric or technical claim loses provenance;
9. the interaction system has a small, coherent vocabulary;
10. any advanced dependency earns its place through measured value;
11. any GPU scene is a bounded signature, not the foundation of the site;
12. ASDEV develops a recognizable visual language that communicates engineering rather than imitating an awards-gallery aesthetic.

## 26. Implementation authorization boundary

This file is a design artifact only.

Creating or merging this document does **not** authorize:

- installation of animation or 3D dependencies;
- modification of public UI;
- creation of production assets;
- deployment;
- migration;
- publication;
- merge to `main` during an active release/governance freeze;
- bypass of R0, S1–S5, or repository approval gates.

The next valid step after this document is accepted is to translate **Gate A only** into a bounded implementation plan and prototype task set against the actual accepted V3.2 base. Gate B and Gate C remain explicitly conditional.
