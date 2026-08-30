# R0-04 Independent Review — V3.1 exact candidate

Date: 2026-08-30  
Status: **GREEN**  
Reviewed application SHA: `41a80235c83ec6949d518bd7fa034814d6e43fef`

## Decision

R0-04 is green for the exact owner-approved V3.1 application candidate. The earlier Windows-local timeout in `tests/ci/backup-and-deploy-approval-contract.test.ts` is classified as environment-specific test-harness slowness, not an application or release-safety regression, because the same contract and the complete suite pass on the repository's Linux hosted gate for the exact candidate.

This review does **not** close R0, authorize another staging dispatch, authorize production, or resolve the separate release-governance incident.

## Exact-head hosted evidence

All six pre-staging workflows associated with `41a80235c83ec6949d518bd7fa034814d6e43fef` are terminal success:

| Gate | Run | Result |
|---|---:|---|
| CI Router | `33274158521` | SUCCESS |
| CI | `33274158509` | SUCCESS |
| Security Audit | `33274158601` | SUCCESS |
| CodeQL | `33274158587` | SUCCESS |
| E2E Smoke | `33274158547` | SUCCESS |
| Lighthouse Budget | `33274158432` | SUCCESS |

The later R0-03 Quality Gate also checked out the same immutable SHA and completed `pnpm run verify` successfully on GitHub-hosted Ubuntu. Its Vitest result was 72 files / 394 tests passing, including the onsite backup/deploy approval contract that timed out in the local Windows run.

## Visual, accessibility and locale evidence

Owner visual approval is explicitly recorded for this exact SHA and immutable evidence:

- artifact ID: `9721029344`;
- artifact digest: `sha256:d48839e8fc326610e2c146b70996eed914f20688afcf002a53ed39ea91d64602`;
- screenshot/evidence files: 11;
- V3.1 visual contract: 37/37 PASS;
- human visual rubric: every category >= 4, average 4.55/5;
- FA/EN desktop and mobile inspected;
- Audit Systems, PersianToolbox, Infrastructure Localization Rescue, owner portrait, Admin isolation and focus evidence accepted.

The exact-head E2E workflow covers browser smoke and accessibility; the hosted Lighthouse gate covers the performance budget. The visual contract includes responsive and directionality evidence for the bilingual public experience.

## Scope review

PR #17 changed 41 files. The application/runtime scope is presentation- and public-content-oriented:

- public shell/header/footer/layout and V3.1 CSS;
- homepage editorial/evidence presentation;
- Discover public query controls, pagination and presentation;
- Blog public presentation/markdown shell;
- truthful owned public media assets;
- unit/E2E/visual/a11y evidence and the E2E workflow.

No Prisma schema, migration, production deploy workflow, authentication implementation, session signing, credential handling, secret configuration, database migration logic, or production rollback implementation was changed by PR #17.

The Discover server-page diff keeps filtering/pagination server-backed, uses explicit public-field `select` clauses, and does not add private/admin fields to public rendering.

## Security and data-handling review

- exact-head Security Audit: SUCCESS;
- exact-head CodeQL: SUCCESS;
- exact-head CI/secret scanning: SUCCESS;
- no auth/session/migration/deploy implementation changed in PR #17;
- Admin public-chrome suppression is presentation-only and does not weaken route authorization or session controls;
- no new external runtime dependency is required by the V3.1 presentation layer.

No primary evidence was found that requires reopening the approved application candidate.

## Accessibility / SEO / performance / responsive review

- exact-head E2E Smoke and accessibility evidence: SUCCESS;
- V3.1 visual contract: 37/37 PASS;
- Lighthouse Budget: SUCCESS;
- bilingual FA/EN and RTL/LTR evidence accepted in the owner-approved artifact;
- Discover metadata/query behavior remains canonical/server-backed and filtered query pages preserve indexing controls covered by existing tests;
- no fresh regression evidence was found in the reviewed exact SHA.

## Windows timeout classification

The local Windows run reported 393 passes plus one timeout in the first onsite-backup contract with an explicit 15-second limit. The equivalent hosted Linux execution completed that test successfully in roughly 2–3 seconds, and the complete exact-head hosted gate is green. Therefore:

- classification: **local Windows/WSL timing variance**;
- candidate severity: **non-blocking**;
- action: keep the test/runtime observation in the incident record; do not modify the approved application SHA to accommodate a non-reproducing local timeout.

## R0 dependency result

R0-04 dependency is satisfied. Remaining R0 blockers are external to the approved application candidate:

1. R0-03 is terminal FAIL at the same-host VPS canonical-HTTPS smoke boundary because VPS DNS resolution timed out after the application itself deployed and passed local health;
2. the R0 release-governance incident remains open;
3. exact production release/symlink identity remains unverified because read-only SSH inspection timed out.

No production mutation or second staging dispatch is authorized by this review.
