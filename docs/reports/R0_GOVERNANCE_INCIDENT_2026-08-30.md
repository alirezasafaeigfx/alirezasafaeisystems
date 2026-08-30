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

Run `33303771900`, attempt 1, is the only authorized staging dispatch. It reached a terminal `failure` state at `2026-08-30T09:59:20Z`. No cancellation, rerun, or second staging dispatch was issued.

Primary job evidence:

- workflow-run/head identity: `4a02127bfdc2ed37956803c113b635700a930efe` because the workflow definition was dispatched from `main`;
- Quality gate job `99236569461`: `success`;
- Quality gate checkout and resolved immutable deployment SHA: `41a80235c83ec6949d518bd7fa034814d6e43fef`;
- Deploy job `99237723156` checkout and `TARGET_REF`: the same exact `41a80235...` candidate;
- source archive: `alirezasafaeisystems-41a80235c83ec6949d518bd7fa034814d6e43fef.tar.gz`;
- source archive SHA-256: `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd`;
- compressed archive size observed in rsync: `79,731,634` bytes;
- archive transfer completed in approximately `18:57`, materially below the previous raw-tar transfer that consumed roughly 40 minutes;
- remote staging build completed successfully;
- Prisma reported 11 migrations, no pending migrations, and no schema drift;
- staging process started successfully and local deploy health passed on port `3003`;
- the deploy script reported completion of a new staging release whose exact seconds are masked in the connector log as `20260830T0937***Z`;
- post-deploy smoke then failed with `curl: (28) Resolving timed out after 10000 milliseconds` while the VPS attempted to resolve `staging.alirezasafaeisystems.ir` for the first canonical HTTPS edge check;
- live browser verification was therefore skipped and no live-verification artifact was produced;
- rollback executed successfully, restored the failed-release database snapshot, restarted staging, and reported exact rollback target `/var/www/my-portfolio/releases/staging/20260830T070559Z`.

### Deployment API SHA discrepancy — resolved

GitHub deployment record `6165237045` reported environment `staging`, ref `main`, and SHA `4a02127bfdc2ed37956803c113b635700a930efe`. The run's primary logs establish that this SHA identifies the workflow/run source on `main`, while the workflow's quality gate resolved and both jobs checked out/deployed immutable application SHA `41a80235c83ec6949d518bd7fa034814d6e43fef`.

Therefore the deployment API record is not accepted as the application payload identity for this parameterized workflow. Application deployment identity is proven by the resolved `TARGET_REF`, checkout log, archive filename, and source checksum. There is no remaining conflict about which application source was attempted.

### R0-03 failure classification

R0-03 is **terminal FAIL — smoke-network/DNS contract**, not an application build failure and not an archive-transport failure.

The same-host application health check succeeded on `127.0.0.1:3003`. The failing boundary was the next layer: canonical HTTPS edge smoke from inside the VPS depended on the VPS resolver. This is isolated from the later live-browser verifier, which must continue to exercise real public DNS/routing from the GitHub-hosted runner.

A separate TDD lane was opened as draft PR #20 from exact `main@39c686d4...`. Its RED-phase test requires same-host edge smoke to preserve the canonical HTTPS hostname/SNI while bypassing only VPS DNS with `curl --resolve <host>:443:127.0.0.1`. No merge or second staging dispatch is authorized by that PR.

## Production truth reconciliation

Read-only SSH to `IRAN_PROD_SERVER` (`pt-production`) timed out while connecting to `193.93.169.32:22` on 2026-08-30. Exact production release identity and symlink target therefore remain `UNKNOWN / NOT VERIFIED`.

The R0-03 primary logs do provide bounded evidence about this run only:

- `TARGET_ENV=staging` throughout the deploy job;
- the production-only SQLite relocation step was skipped;
- the existing `my-portfolio-production` PM2 process remained online while staging was stopped, replaced, and rolled back;
- no production rollback step was invoked by this staging run.

These facts prove Run `33303771900` did not intentionally execute its production path. They do not establish the exact production release identity and do not substitute for read-only server identity evidence.

Repository evidence alone also does not imply a production deployment. Semantic-release `1.1.0` and membership in main are not production evidence.

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

R0-05 is now **GOVERNANCE + RELEASE-IDENTITY RECONCILIATION**. It may proceed only after the R0-03 smoke-network defect is corrected through governance, a permitted staging verification reaches the required live evidence, R0-04 is green, and production identity is observed. It must preserve the accidental source merge fact and must not manufacture a cleaner graph by reverting, force-pushing, re-merging PR #17, or altering approved application semantics.

PR #18 (`docs/v3-2-evidence-conversion-roadmap`, head `48eb38afe66ab80bbd1767e5240f06bd81d7450a`) remains stale against current main and must not be integrated during the incident freeze.

## Next safe actions

1. complete PR #20 TDD RED → GREEN for the isolated smoke-network contract without merging it;
2. complete exact-SHA R0-04 review and reproduce/classify the Windows-only backup timeout in an environment-compatible lane;
3. retry authorized read-only production identity inspection only when connectivity permits;
4. keep `main`, PR #18 integration, production mutation, and any second staging dispatch frozen until the incident decision permits them;
5. once R0 truth is stable, update the canonical V3.2 ledger on a post-freeze branch and establish R0-06 only from the accepted post-release base.
