# R0 Release-Governance Incident — 2026-08-30

Status: OPEN — reconciliation in progress

## Scope and strategic purpose

This lane supports ASDEV Audit goals 2 and 4: trusted evidence and safer production operations. It records repository truth without rewriting history or claiming production state that has not been observed.

## Proven GitHub sequence

Evidence was collected from `GITHUB_MAIN` via GitHub API and the fetched Git object graph on 2026-08-30.

| Event | Exact evidence |
|---|---|
| PR #19 opened | `2026-08-30T09:02:26Z`; base `ac08d1232ee4edfcdbe029a5f636d68b9e8861cc`; head `b27cdbcf9c4c2a26804bf81f017948db7396c044`; branch `fix/r0-02-archive-contract` |
| PR #19 head ancestry | `41a80235c83ec6949d518bd7fa034814d6e43fef` → `5a08208db2b7ea34bb11bbecb52b8c74bed07cfb` → `b27cdbcf9c4c2a26804bf81f017948db7396c044` |
| PR #19 merged | `2026-08-30T09:13:03Z` as merge commit `4a02127bfdc2ed37956803c113b635700a930efe`; parents `ac08d123...` and `b27cdbc...` |
| PR #19 content | 44 files, 4,630 insertions, 510 deletions; included the complete V3.1 candidate plus the R0-02 transport fix |
| PR #17 marked merged | `2026-08-30T09:13:05Z`; exact head `41a80235c83ec6949d518bd7fa034814d6e43fef`; merge commit reported as the head itself |
| Main release advance | `39c686d4b977e7122a6a2ca889878a43fea3f1f9`, semantic-release `1.1.0`, `2026-08-30T09:23:35Z` |

Conclusion: the application candidate entered `GITHUB_MAIN` through the incorrectly based R0-02 PR. PR #17 is already represented by its exact head in main; it must not be merged again. This is an incident, not a corrected historical sequence.

## R0-03 authoritative run

Run `33303771900`, attempt 1, is the only authorized staging dispatch. GitHub reports:

- created `2026-08-30T09:19:37Z`, head SHA `4a02127bfdc2ed37956803c113b635700a930efe`;
- Quality gate job `99236569461`: completed successfully at `09:29:58Z`;
- Deploy job `99237723156`: started `09:36:23Z`; `Upload release source` was still in progress at the last poll;
- no cancellation, rerun, or second dispatch was issued.

The workflow definition resolves an immutable deployment SHA from its `ref` input. The requested target remains `41a80235...`; the run’s deploy logs must be consumed before asserting the resolved target, archive checksum, release ID, health, smoke, or live-verification results.

## Production truth reconciliation

Read-only SSH to `IRAN_PROD_SERVER` (`pt-production`) timed out while connecting to `193.93.169.32:22` on 2026-08-30. No server identity, release symlink, process status, health response, deployment record, or migration record was obtained. Therefore production is `UNKNOWN / NOT VERIFIED`, not “unchanged”. No rollback or other production mutation was attempted.

Repository evidence alone does not imply a production deployment. Semantic-release `1.1.0` and membership in main are not production evidence.

## R0-04 candidate review status

The exact candidate checkout at `41a80235...` was not modified. The local Vitest run produced 393 passing tests and one timeout in the existing Windows-sensitive onsite backup contract (`tests/ci/backup-and-deploy-approval-contract.test.ts`, explicit 15-second timeout). Because a required gate is not clean, R0-04 is `NOT GREEN`; the timeout is not reclassified as an application failure without reproducibility/root-cause evidence. Existing V3.1 visual/a11y contracts and source-level FA/EN, RTL/LTR, SEO, auth/data-handling, and responsive checks remain supporting evidence only until the independent review and environment-compatible test run are complete.

## Governance gap and smallest safe hardening

GitHub returned `404 Branch not protected` for `main` and an empty ruleset list. Existing CI checks therefore provide process evidence but not a merge-control boundary. The prevention patch on the isolated branch `chore/r0-governance-preflight` adds:

1. full-SHA current-main base preflight for branches named `fix/r0-*`;
2. a maximum of 12 changed files for the bounded R0 infrastructure scope;
3. an allowlist limited to workflow/CI/governance automation paths;
4. fail-closed rejection of `src/`, `public/`, `e2e/`, `prisma/`, package, and other application/UI/content paths;
5. Vitest coverage for stale-base, mixed-content, oversized/out-of-scope, and non-R0 cases.

Administrative hardening proposal, pending explicit repository administrator action: protect `main`, require the CI Router plus full quality/security checks and one approving review, disallow direct pushes and administrator bypass where feasible, and require CODEOWNERS review for `.github/workflows/**`, `scripts/deploy/**`, `ops/deploy/**`, and release configuration. Do not change settings from this lane without the administrative gate.

## R0-05 reclassification

R0-05 is now **GOVERNANCE + RELEASE-IDENTITY RECONCILIATION**. It may proceed only after Run `33303771900` reaches a truthful terminal state, R0-04 is green, and production identity is observed. It must preserve the accidental source merge fact and must not manufacture a cleaner graph by reverting, force-pushing, re-merging PR #17, or altering approved application semantics.

PR #18 (`docs/v3-2-evidence-conversion-roadmap`, head `48eb38afe66ab80bbd1767e5240f06bd81d7450a`) is open against stale base `ac08d123...`; its GitHub mergeability is not treated as safe until it is reconciled against current main without force-push.

## Next safe actions

Poll Run `33303771900` without changing it; obtain primary deploy logs and artifacts. Retry authorized read-only `IRAN_PROD_SERVER` inspection only when connectivity permits. Complete exact-SHA R0-04 review, then reconcile PR #18 and update the canonical V3.2 ledger in a post-freeze branch. Establish R0-06 only from the accepted post-release base.
