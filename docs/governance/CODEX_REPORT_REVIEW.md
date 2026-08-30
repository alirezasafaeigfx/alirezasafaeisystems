# Codex report review — evidence before acceptance

Updated: 2026-08-30. Applies to Codex, other executors and the coordinating assistant whenever the owner supplies a progress/completion report.

## Required response behavior

Do not paraphrase the report and call it verified. Read its claims, retrieve primary evidence, compare the delivered behavior with the owner's current requirements, and state the limits of what was actually checked. Use the connected GitHub tools and a real browser when available. Missing access is `UNVERIFIED`, not assumed success or assumed failure.

Start with the user's objective: distinctive interactive experience, ordinary-Iranian comprehension, authored mobile, credible evidence and a working assessment path. Successful engineering operations cannot substitute for these outcomes.

First classify scope: progress update, documentation unit, implementation unit, runtime operation, or whole-program acceptance. Apply only relevant checks to a unit, with explicit reasons for NOT_APPLICABLE; partial progress may honestly remain incomplete. Documentation units require diff/link/consistency/permission checks and independent documentation review, not UI benchmarks or owner visual approval. Required hosted checks remain mandatory regardless of scope. An infrastructure/harness unit needs its own behavior/security evidence, not premature final visual acceptance. Whole-program S5 cannot waive the required product dimensions; unavailable evidence is UNVERIFIED, not NOT_APPLICABLE.

## Review sequence

1. **Identity:** repository, PR, base/head/merge SHA, workflow SHA, deployed SHA and release ID. Fetch live metadata; do not infer any of them from a pasted summary or `main` alone.
2. **Scope:** inspect the full diff/ancestry and relevant code. Map every claimed task to its roadmap acceptance criteria. Confirm required behavior exists, not merely a new file/title/flag.
3. **Tests:** inspect what tests assert. Verify commands/results on the actual candidate. Separate pass/fail/skip/timeout and pre-existing issues with evidence. Component presence is not interaction coverage; mocked browser APIs are not device measurements.
4. **Experience:** open the actual route and exercise the changed flows. Review FA/EN and desktop/mobile/tablet artifacts. For motion, inspect a recording or interact through every state; a still image cannot prove pacing, continuity or cleanup.
5. **Copy:** check first-viewport comprehension, CTA meaning, untranslated/technical labels, empty states, errors and optional specialist details. Do not invent a user study.
6. **Accessibility/performance:** read raw results with browser/device/profile and units. Check reduced-motion, keyboard, no-JS/GPU fallback, bundle delta, LCP/CLS and interaction latency. Distinguish field INP from a lab proxy and emulation from real hardware.
7. **Truth:** inspect sources behind claims; `reviewState: 'accepted'` and plausible-looking source strings alone are insufficient. Identify hypothetical diagrams and ensure they are labeled.
8. **Release:** verify workflow terminal result, public behavior, immutable release identity, two consecutive public passes and rollback evidence. Distinguish code rollback, retained release and actual data restore/drill. Do not run mutating fixture suites against Production.
9. **Artifact integrity:** retrieve a representative artifact, check filename/hash/SHA and content. A Windows temp path or expired CI URL is not independently inspectable evidence. Do not claim a screenshot was viewed if it was only listed.
10. **Decision:** report the matrix below, precise remaining gaps and the next dependency-ready correction. Reuse valid evidence; avoid replaying completed releases or reopening all R0 work.

## Verdict matrix

| Dimension | Allowed verdict |
|---|---|
| Implementation and scope | PASS / PARTIAL / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Visual composition and motion | PASS / PARTIAL / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Plain-language comprehension | PASS / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Accessibility and fallbacks | PASS / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Performance | PASS / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Claims and provenance | PASS / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Release/runtime | PASS / FAIL / UNVERIFIED / NOT_APPLICABLE |
| Independent review of this unit | ACCEPTED / CHANGES_REQUESTED / PENDING / NOT_APPLICABLE |
| Owner visual disposition of prepared product | ACCEPTED / CHANGES_REQUESTED / PENDING / NOT_APPLICABLE |

`NOT_APPLICABLE` needs a scope-based reason; it cannot erase an inconvenient requirement. Program `DONE` requires all applicable criteria and review requirements. A program-blocking design omission is not automatically a production outage; classify acceptance severity separately from operational severity.

## Mandatory adversarial questions

- If the new SVG and headings exist but all interaction is removed, would these tests still pass?
- If the public CTA is below a giant portrait on mobile, does the “three-second clarity” claim survive?
- Did “3D” mean GPU-rendered depth or a CSS transform? Is that distinction explicit?
- Does the declared stable system actually change topology, or merely change a label/color?
- Was the screenshot baseline accepted after inspection, or simply overwritten?
- Does a green Lighthouse job only warn at thresholds weaker than the product contract?
- Do five fictional stages masquerade as a real customer case study?
- Were an asset list, test command, reviewer, deployment or user quote invented?
- Did “smallest delta” remove a required outcome rather than unrelated work?
- Did a backup helper perform a relocation, or report a no-op? Is the report precise?

## Executor handoff schema

For public-experience implementation/acceptance units, put a compact manifest in `test-results/public-experience/<candidate-sha>/manifest.json`; publish its sanitized durable copy with the PR/workflow artifact. A docs-only unit records its scoped validation in the PR; it does not fabricate an application manifest. Fields:

```json
{
  "schemaVersion": 1,
  "taskIds": [],
  "repository": "alirezasafaeigfx/alirezasafaeisystems",
  "baseSha": "FULL_SHA",
  "candidateSha": "FULL_SHA",
  "environment": "REVIEW_WORKSPACE",
  "capturedAt": "ISO_8601_UTC",
  "sourceDirty": false,
  "commands": [],
  "criteria": [],
  "artifacts": [],
  "reviews": [],
  "release": null,
  "limitations": []
}
```

This is a schema example, not evidence. Replace SHA markers with real identities; empty required arrays cannot pass. Each command records command, working directory, runtime, start/end, exit code and pass/fail/skip counts. Each criterion records ID, verdict and evidence references. Each artifact records relative path, durable URL, SHA-256, locale, viewport, state and capture conditions. Each review records author/type (human, independent agent or self), scope SHA, findings and disposition. Release, if applicable, records application SHA, workflow run/attempt, release ID, prior release and whether rollback was actually exercised.

The current docs revision defines this contract. It does not falsely claim a validator already exists; task `S5-01` must implement/check it before final acceptance.

## Reviewer reply format

1. What I independently verified, with source links.
2. What exists but is incomplete or fails the agreed criteria.
3. What remains unverified and why.
4. Overall verdict, explicitly separating release success from experience acceptance.
5. Short corrective executor prompt containing exact missing tasks, preserved evidence and prohibited shortcuts.

No praise-based acceptance, invented numerical design score, or automatic `DONE` from another agent's declaration. No protocol can guarantee that an agent never misreports; reproducible evidence, independent inspection and real enforcement tests make misreporting detectable and rejectable.
