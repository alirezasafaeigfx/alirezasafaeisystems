# Personal Brand + Content Platform V3 baseline

**Environment:** `LOCAL_PC`  
**Repository:** `alirezasafaeigfx/alirezasafaeisystems`  
**Implementation branch:** `feat/personal-brand-content-platform-v3`  
**Source-of-truth SHA:** `75b3452147144283a4beafccdef39663d271a54c`  
**Production impact:** none

## Source verification

The implementation branch was created from the exact head of
`docs/personal-brand-homepage-v3`. All roadmap, product, specification, and
implementation-plan files named by the owner were present and read from that
branch. No V3 source-of-truth document was reconstructed.

## LOCAL_PC quality baseline

`pnpm run verify` completed successfully with Git for Windows Bash:

- ESLint: zero errors and two pre-existing warnings in `scripts/telegram-bot/bot.js`
- TypeScript: passed
- Vitest: 53 files and 329 tests passed
- Next.js production build: passed with 42 routes
- External scan: passed

The workstation currently runs Node.js 24.19.0 while the repository declares
`>=20 <23` and `.nvmrc` selects Node.js 20. This is a baseline warning, not a
passing supported-runtime claim. CI and release evidence must use a supported
Node.js version.

## Database evidence

A LOCAL_PC snapshot of the tracked `db/custom.db` was created beneath the
gitignored directory `.backups/personal-brand-content-platform-v3/20260827-baseline/`.
Both source and snapshot returned `ok` from SQLite `PRAGMA quick_check`; their
SHA-256 values match:

`244BB2BD091ECA263470FABAF2EDF00831EB6AA885075825714C1D573B084D50`

This file is a legacy development artifact. It contains only `BlogPost`,
`ContactMessage`, `Experience`, `Project`, and `Skill`; it is not evidence of
the currently deployed production schema.

The owner-provided offline backup at
`D:\My_Projects\production-backup-2026-08-26` was inspected without mutation.
Its two portfolio `custom.db` copies have the same legacy table set. The
archive does not contain `/var/www/my-portfolio/shared/data/production.db` or
the persistent Discover media directory. It is valid source/config evidence,
but it must not be described as a production database backup.

## Security baseline

Existing controls confirmed by static review include signed and expiring admin
sessions, `HttpOnly` and `SameSite=Strict` cookies, production-only `Secure`,
admin proxy protection, API `no-store`, Zod validation on existing mutations,
and authenticated admin API access.

Open baseline risks:

1. The onsite backup contract points at `shared/env/<environment>.db`, while the
   deployed workflow uses `shared/data/production.db`; Discover media is not
   covered.
2. The deployment workflow does not encode separate production deployment and
   migration approval phrases.
3. Rate-limit identity trusts the first `X-Forwarded-For` value despite the
   documented Nginx append behavior.
4. Admin mutations do not enforce the existing trusted-origin helper. Strict
   same-site cookies and non-simple methods mitigate ordinary cross-site CSRF,
   but sibling-origin compromise remains a residual case.
5. Manual application rollback and migration-aware database rollback have
   different semantics.
6. Admin message deletion can display success without checking `response.ok`.

## Rollback readiness

No `IRAN_PROD_SERVER` mutation, migration, deploy, or rollback was performed.
The current implementation work is additive and remains on a feature branch.
Before any production schema change, the release gate still requires:

- a consistent snapshot of the actual persistent database and Discover media;
- restore and migration rehearsal against a disposable copy;
- schema-drift and integrity checks;
- an identified application and database rollback target;
- exact migration and production-deploy approval phrases.

## Baseline verdict

`LOCAL_BASELINE_PASS_WITH_BLOCKERS`

Feature work without a database mutation may continue. Production migration or
deployment remains blocked until the open database evidence and exact approval
gates are satisfied.
