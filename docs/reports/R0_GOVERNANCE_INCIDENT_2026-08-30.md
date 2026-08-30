# R0 Release-Governance Incident — 2026-08-30

Status: **OPEN — safe remediation prepared; mutation freeze remains active**

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

Run `33303771900`, attempt 1, is the only authorized staging dispatch. It reached terminal `failure` at `2026-08-30T09:59:20Z`. No cancellation, rerun, or second staging dispatch was issued.

Primary job evidence:

- workflow-run/head identity: `4a02127bfdc2ed37956803c113b635700a930efe` because the workflow definition was dispatched from `main`;
- Quality gate job `99236569461`: `success`;
- Quality gate checkout and resolved immutable deployment SHA: `41a80235c83ec6949d518bd7fa034814d6e43fef`;
- Deploy job `99237723156` checkout and `TARGET_REF`: the same exact `41a80235...` candidate;
- source archive: `alirezasafaeisystems-41a80235c83ec6949d518bd7fa034814d6e43fef.tar.gz`;
- source archive SHA-256: `349a8f6ec2dfa4486867b0a8c765e40534432629daf865216835f3c742398acd`;
- compressed archive size: `79,731,634` bytes;
- archive transfer completed in approximately `18:57`, materially below the previous raw-tar transfer that consumed roughly 40 minutes;
- remote staging build completed successfully;
- Prisma reported 11 migrations, no pending migrations, and no schema drift;
- staging process started successfully and local deploy health passed on port `3003`;
- the failed new staging release ID is only partially visible in the connector log as `20260830T0937***Z`; no exact seconds are inferred;
- post-deploy smoke failed with `curl: (28) Resolving timed out after 10000 milliseconds` while the VPS attempted to resolve `staging.alirezasafaeisystems.ir` for the first canonical HTTPS edge check;
- live browser verification was skipped and no live-verification artifact was produced;
- rollback succeeded, restored the failed-release database snapshot, restarted staging, and reported exact rollback target `/var/www/my-portfolio/releases/staging/20260830T070559Z`.

### Deployment API SHA discrepancy — resolved

GitHub deployment record `6165237045` reported environment `staging`, ref `main`, and SHA `4a02127bfdc2ed37956803c113b635700a930efe`. Primary run logs establish that this SHA identifies the workflow/run source on `main`, while the quality gate resolved and both jobs checked out/deployed immutable application SHA `41a80235c83ec6949d518bd7fa034814d6e43fef`.

Therefore the deployment API record is not accepted as the application payload identity for this parameterized workflow. Application deployment identity is proven by resolved `TARGET_REF`, checkout logs, archive filename, and source checksum. There is no remaining conflict about which application source was attempted.

### R0-03 failure classification

R0-03 is **terminal FAIL — same-host smoke-network/DNS contract**, not an application build failure and not an archive-transport failure.

The application passed direct health on `127.0.0.1:3003`. The failing boundary was the next layer: canonical HTTPS edge smoke from inside the VPS depended on the VPS resolver. The later GitHub-hosted browser verifier is a separate boundary and must continue to exercise real public DNS/routing.

## R0-03 remediation — Draft PR #20

Draft PR #20, `fix(deploy): isolate same-host smoke from VPS DNS`, was created from exact `main@39c686d4b977e7122a6a2ca889878a43fea3f1f9`. It remains unmerged under the incident freeze.

Scope is exactly three files:

- `.github/workflows/deploy-vps.yml`;
- `tests/ci/deploy-smoke-network-contract.test.ts`;
- `tests/ci/deploy-discover-smoke.test.ts`.

No application, content, auth, Prisma, migration, database, or production data path is modified.

TDD evidence:

1. RED `043123687fb7bce3cc5740a35993914a388ffe36` added the same-host DNS-bypass contract. Hosted CI reproduced the expected failure while the existing suite otherwise passed.
2. GREEN `1ea9402947ec8cb9fc959711b7e6b7a9cd4fbb8a` changed only same-host canonical HTTPS smoke to use `curl --resolve ${BASE_HOST}:443:127.0.0.1`, preserving the canonical hostname and TLS SNI while bypassing only the VPS resolver.
3. Compatibility `b39e354cc39934b153bbc690bf6e0ff4ccf46921` aligned the pre-existing Discover smoke contract with the new invariant.
4. `LIVE_VERIFY_BASE_URL="$BASE_URL"` remains unchanged, so the two browser verification passes still use real public DNS/routing.

Hosted evidence on final PR #20 head `b39e354cc39934b153bbc690bf6e0ff4ccf46921` is fully green:

| Gate | Run | Result |
|---|---:|---|
| CI Router | `33306090495` | SUCCESS |
| CI | `33306090500` | SUCCESS |
| Security Audit | `33306090494` | SUCCESS |
| CodeQL | `33306090491` | SUCCESS |
| E2E Smoke | `33306090497` | SUCCESS |
| Lighthouse Budget | `33306090515` | SUCCESS |

This proves the remediation branch is release-candidate-ready from pre-merge CI perspective. It does **not** authorize merging it, dispatching staging again, or mutating production while the incident freeze remains active.

## Production truth reconciliation

Read-only SSH to `IRAN_PROD_SERVER` timed out while connecting to the production SSH endpoint on 2026-08-30. Exact **current** production symlink/release identity therefore remains `UNKNOWN / NOT VERIFIED`.

The last production release that is positively verified from primary GitHub workflow evidence is Run `33234404337`:

- environment: `production`;
- immutable application payload: `14501b25c20292c90c33f888eb40227e042b3bfd`;
- release ID: `20260829T044320Z`;
- source SHA-256: `5d443d0085831d76498411d5e463ff635461e200a77a80b3f4359827c9461ea9`;
- migration deployment completed and database schema reported up to date with no drift;
- production health passed on port `3002`;
- canonical production smoke passed;
- two consecutive `LIVE_VERIFICATION_PASS` results were emitted;
- live-verification artifact: `9709543567`;
- artifact digest: `sha256:b35171dbefd5b2a079838362e47e79ef9fb5f6adca15f949ffd36236e3bbef72`.

This is the **last verified production release**, not a claim about the current production symlink. Public `/api/health` and `/api/ready` intentionally expose health/readiness but not release SHA or release ID, so HTTP 200 cannot close the identity gap.

The R0-03 staging run also gives bounded negative evidence:

- `TARGET_ENV=staging` throughout its deploy job;
- the production-only SQLite relocation step was skipped;
- the production PM2 process remained online while staging was replaced and rolled back;
- no production rollback step was invoked by Run `33303771900`.

Repository membership and semantic-release `1.1.0` are not production-deployment evidence.

## R0-04 candidate review — GREEN

R0-04 is closed GREEN for exact candidate `41a80235c83ec6949d518bd7fa034814d6e43fef`. Full details are recorded in `docs/reports/R0_04_INDEPENDENT_REVIEW_2026-08-30.md`.

Exact-head hosted gates are all success:

| Gate | Run | Result |
|---|---:|---|
| CI Router | `33274158521` | SUCCESS |
| CI | `33274158509` | SUCCESS |
| Security Audit | `33274158601` | SUCCESS |
| CodeQL | `33274158587` | SUCCESS |
| E2E Smoke | `33274158547` | SUCCESS |
| Lighthouse Budget | `33274158432` | SUCCESS |

Owner visual approval is recorded for the exact SHA with artifact `9721029344`, digest `sha256:d48839e8fc326610e2c146b70996eed914f20688afcf002a53ed39ea91d64602`, 11 evidence files, 37/37 visual contract PASS, bilingual desktop/mobile evidence, and human rubric average 4.55/5 with every category >=4.

The earlier local Windows timeout in the onsite backup contract is classified as environment-specific harness slowness rather than candidate regression: the same contract and the complete suite pass on the Linux hosted gate for the exact candidate.

PR #17 scope review found no Prisma schema, migration, production deploy workflow, auth/session implementation, credential handling, or rollback implementation changes. Runtime changes are limited to public presentation, Discover/Blog presentation/query behavior, truthful media, tests/evidence, and the E2E workflow.

## Governance gap and prevention — Draft PR #21

GitHub returned no active branch protection/rulesets for `main`. Existing checks are evidence but not an enforced merge-control boundary.

Draft PR #21, `chore(r0): harden bounded PR scope after governance incident`, is based exactly on `main@39c686d4b977e7122a6a2ca889878a43fea3f1f9` and was verified as 5 commits ahead / 0 behind before opening. At creation it contained six changed files, all governance/CI/report scope.

The prevention contract adds:

1. full-SHA current-main base preflight for `fix/r0-*` infrastructure PRs;
2. maximum 12 changed files for that bounded scope;
3. allowlist limited to workflow/CI/governance automation paths;
4. fail-closed rejection of application/UI/content/data paths;
5. regression coverage for stale base, mixed content, oversized/out-of-scope and non-R0 cases;
6. CI Router integration without adding write permissions.

Administrative hardening remains a separate explicit administrator decision: protect `main`, require appropriate CI/security/review checks, disallow direct/bypass merges where feasible, and require CODEOWNERS review for deploy/release-sensitive paths. No repository settings are changed from this incident lane.

## R0-05 reclassification

R0-05 is **GOVERNANCE + RELEASE-IDENTITY RECONCILIATION**. PR #17 must not be merged again and history must not be cosmetically rewritten.

A safe R0 recovery sequence requires all of the following:

1. preserve the incident record and exact existing main history;
2. independently review and integrate the narrowly scoped PR #20 only through a valid incident-recovery merge decision;
3. perform at most one corrective governed staging verification only after that decision, again targeting exact application SHA `41a80235...` and requiring health, smoke, and two consecutive live browser passes;
4. observe exact current production identity before any production progression;
5. keep PR #18 and V3.2 implementation frozen until R0 is objectively reconciled.

## Current dependency state

- R0-02 archive transport: **GREEN / integrated**; compressed transport materially improved transfer time.
- R0-03 first governed staging attempt: **FAIL / rolled back safely** at same-host DNS-dependent smoke.
- R0-03 remediation PR #20: **GREEN pre-merge / DRAFT / not integrated**.
- R0-04 exact candidate independent review: **GREEN**.
- production last verified release: **known** (`20260829T044320Z`, `14501b25...`).
- production current symlink/release: **UNKNOWN** because read-only SSH identity inspection timed out.
- governance prevention PR #21: **DRAFT / hosted audit in progress**.
- `main`, PR #18, production mutation, and any second staging dispatch: **FROZEN**.

## Next safe actions

1. consume PR #21 hosted checks and repair only real findings without merging it;
2. keep PR #20 and #21 Draft until an incident-recovery integration decision exists;
3. retry read-only production identity inspection only when connectivity permits;
4. do not issue a second staging dispatch from the unintegrated workflow fix;
5. after a valid R0 recovery decision, integrate the minimum required prevention/remediation changes in an explicitly reviewed order, then run one corrective staging verification and close R0 from primary evidence;
6. reconcile PR #18 / canonical V3.2 ledger only after the R0 freeze is lifted.
