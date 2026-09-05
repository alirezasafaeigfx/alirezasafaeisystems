# Public experience acceptance checkpoint — 2026-09-05

This checkpoint reconciles current GitHub evidence without reopening already merged implementation work. It is a state record, not a release authorization, deployment receipt, owner visual approval, or replacement for the canonical task definitions in `docs/roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md`.

## Current repository identity

- Current `main` at checkpoint creation: `6c19598a56a651dde07884afdc8da0fcfbac02c5`.
- PR #26 (`feat(experience): deliver measured V3.2 public interaction`) is merged. Merge commit: `336ab2090cd251ca6108ba4577288b05c915a451`.
- PR #30 (`chore(security): modernize Lighthouse audit toolchain`) is merged. Merge commit/current main: `6c19598a56a651dde07884afdc8da0fcfbac02c5`.
- No Production deploy, public-edge change, migration, timer activation, DNS/nginx mutation, or customer submission is authorized or performed by this checkpoint.

## PR #26 implementation/review reconciliation

Final reviewed candidate: `08d64742282cb7456ffbbc6077baa29d505a0741`.

All six pull-request workflows for that exact head completed successfully:

- CodeQL `33746574159`
- CI Router `33746574181`
- Security Audit `33746574200`
- CI `33746574216`
- Lighthouse Budget `33746574171`
- E2E Smoke `33746574202`

All known inline CodeRabbit review threads are resolved. The final CodeRabbit review covering exact head `08d64742282cb7456ffbbc6077baa29d505a0741` generated no actionable comments and reported no merge-blocking risk.

Therefore S4 implementation must **not** be restarted. The five-state semantic scene, finite Anime.js motion, deferred Three.js prototype, fallbacks, lifecycle work, public-copy/evidence guards and measurement harness are merged implementation to be reused. Remaining work is acceptance/provenance, not rebuilding S4-10/S4-11/S4-12 from scratch.

## Exact candidate evidence retrieved

The E2E Smoke run exposes a still-retrievable V3.2 evidence artifact:

- Artifact ID: `9890025924`
- Name: `v32-public-experience-08d64742282cb7456ffbbc6077baa29d505a0741`
- Artifact digest: `sha256:36e9a11c0ca1f4a91575b6aef2aa47663307d2bd4bae1aa5dbfe16d5416d672f`
- Recorded expiry: `2026-09-17T10:57:16Z`
- Artifact head SHA: `08d64742282cb7456ffbbc6077baa29d505a0741`

The package contains the FA/EN light/dark 390/768/1440 visual matrix, five native scene-state captures, native and GPU interaction recordings, no-JS evidence, flagship/Discover evidence, Three.js fallback/prototype captures, performance comparison, build attribution and a generated evidence manifest draft.

The immutable-base performance comparison inside the artifact reports:

- `verdict: PASS`
- `failedBudgets: []`
- `unsupportedReasons: []`
- base SHA `2fe4988841a36c7f4eaf1da47fb5bffe22d00547`
- candidate SHA `08d64742282cb7456ffbbc6077baa29d505a0741`
- baseline initial JS gzip: `290719` bytes
- candidate initial JS gzip: `277490` bytes
- candidate median LCP: `1200ms`
- candidate max CLS: approximately `0.000056731`
- candidate measured interaction samples remain available in the captured report

These are lab/CI observations for the exact candidate, not field metrics.

## Why S5 acceptance is still open

The generated `manifest.json` is explicitly a draft. It has empty `commands`, `criteria`, `artifacts`, and `reviews`, `release: null`, and records this limitation:

> Draft only: replace every empty evidence field and publish durable non-Actions URLs before validation.

The current validator requires each accepted artifact to have a retrievable durable HTTPS URL, rejects expiring GitHub Actions URLs, verifies SHA-256 locally/remotely, requires the complete visual/state criteria, and requires accepted independent review for the candidate SHA.

No existing durable evidence store/path was found on current `main`. The Actions package must therefore not be mislabeled as durable evidence. Creating a new durable publication/storage mechanism is a separate admitted decision; this checkpoint does not invent or silently publish one.

An explicit owner visual disposition for the exact candidate was also not found in the PR evidence reviewed for this checkpoint. Until such a disposition is recorded, S5-03 owner acceptance remains `UNVERIFIED` even though code review is clean.

## Security chain currently in flight

PR #31 (`fix(security): integrate fail-closed pnpm audit parser`) is the clean post-#30 integration successor to stale PR #27.

Final exact head at this checkpoint: `58ebd84511ce11ecfb8a37b2874358157a398329`.

Exact-head workflows are all green:

- CI Router `33987002445`
- Security Audit `33987002300`
- CodeQL `33987002552`
- CI `33987002303`
- E2E Smoke `33987002316`
- Lighthouse Budget `33987002306` (one diagnosed `NO_NAVSTART` runtime-only retry; no code/threshold change)

Current fail-closed audit result: `critical=0 high=0 moderate=4 low=1 info=0 unknown=0`.

The only remaining merge gate for PR #31 is a fresh independent exact-head review. The requested CodeRabbit review is currently blocked by included-review capacity; that gate must not be bypassed.

After PR #31 merges:

- close PR #27 as superseded by the clean parser integration;
- close draft PR #29 as superseded by merged PR #30 remediation plus PR #31 verification.

## Current execution decision

1. Do not restart merged S4 implementation.
2. Finish the PR #31 fresh-review gate and integrate only if the exact head remains clean.
3. Preserve S5 as acceptance/provenance work: durable artifact publication/retrieval, accepted manifest, explicit owner visual disposition, then the remaining governed acceptance/release chain.
4. Public edge, live monitoring timers, migration and Production redeploy remain phrase-gated and are outside this safe reconciliation.
5. Do not blindly merge stale paired docs PR #28: its branch is materially behind current main and needs a clean current-main reconciliation if/when that paired documentation work resumes.
