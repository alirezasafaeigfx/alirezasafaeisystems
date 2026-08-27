# AlirezaSafaeiSystems production live verification

- Environment: `IRAN_PROD_SERVER`
- Connection: `ssh pt-production`
- Release: `20260827T213500Z-wsl-ui-v2`
- Source: `LOCAL_PC` snapshot built on Ubuntu WSL2 with Node `v22.22.0`
- Previous release: `20260827T212500Z-wsl-ui`
- Runtime: PM2 `my-portfolio-production`, `127.0.0.1:3002`

## Verification

- Linux production build: passed, 42 routes generated.
- Isolated server preflight on `127.0.0.1:3015`: passed.
- Production `/api/ready`: HTTP 200, `status=ready`.
- Public homepage: HTTP 200.
- HTTP to HTTPS redirect: HTTP 301.
- Public sitemap and robots: HTTP 200.
- New Persian hero, audience section, and CTA: present.
- SEO title: present.
- localized `Service` structured data: present.
- Playwright desktop/accessibility/home checks: 2 passed.
- Playwright mobile audience/CTA/console/network check: 1 passed.
- PM2 status: online, zero restarts, zero unstable restarts.
- Rollback target is retained under `/var/www/my-portfolio/releases/production/20260822T162442Z-discover-concurrency-fix`.

## Warning

- `https://www.alirezasafaeisystems.ir/` presented a certificate-name mismatch from `LOCAL_PC`; apex HTTPS is valid and served the release. This requires a separate public-edge approval if nginx/TLS changes are needed.

## Verdict

`LIVE_VERIFICATION_PASS_WITH_WARNINGS`
