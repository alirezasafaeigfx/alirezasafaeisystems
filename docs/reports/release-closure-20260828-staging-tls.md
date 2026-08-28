# Release Closure Evidence — Staging TLS

- Repository: `alirezasafaeigfx/alirezasafaeisystems`
- Branch: `feat/personal-brand-content-platform-v3`
- Baseline SHA: `a753577822be9da420a131c824bdd3dc76319a5e`
- Environment read: `IRAN_PROD_SERVER` via `ssh pt-production`
- Production mutation: none

## Root cause

`staging.alirezasafaeisystems.ir` resolves to `193.93.169.32`. HTTP is served by the active `/etc/nginx/sites-enabled/my-portfolio-staging` vhost and proxies to `127.0.0.1:3003`; `/api/ready` returned HTTP 200.

That vhost has only `listen 80`. Nginx owns ports 80 and 443, but no active HTTPS vhost names `staging.alirezasafaeisystems.ir`. `certbot certificates` has no certificate for this hostname and `certbot renew --dry-run --cert-name staging.alirezasafaeisystems.ir` reports that no renewal configuration exists. An SNI probe for the hostname returns the unrelated `ir.llm.persiantoolbox.ir` certificate, and a normal client validation fails with `SEC_E_WRONG_PRINCIPAL`.

The hostname therefore falls through to the default HTTPS virtual host. This is isolated from the existing `alirezasafaeisystems.ir`, `www.alirezasafaeisystems.ir`, `audit.alirezasafaeisystems.ir`, `persiantoolbox.ir`, and `staging.persiantoolbox.ir` vhosts/certificates.

## Safe staged remediation

1. Back up `/etc/nginx/sites-available/my-portfolio-staging`.
2. Obtain a dedicated certificate for `staging.alirezasafaeisystems.ir` with the existing certbot mechanism.
3. Add only the staging hostname's `listen 443 ssl` server block, retaining `proxy_pass http://127.0.0.1:3003` and its proxy headers.
4. Replace its port-80 application block with `return 301 https://$host$request_uri`.
5. Run `nginx -t`; reload only if it passes. Restore the backed-up file and reload if the post-change check fails.
6. Re-run the governed staging deployment workflow and its two-pass browser live verification.

## Rollback inventory

- Current staging release: `/var/www/my-portfolio/current/staging -> /var/www/my-portfolio/releases/staging/20260828T101500Z-a753577`
- Retained previous staging release: `20260828T095500Z-d288727`
- Current release remains unchanged during this investigation.

## Gate status

The remediation is a staging edge/deploy mutation and is pending the exact approval phrase `APPROVE_PHASE_2_STAGING_DEPLOY`. No production migration, deployment, certificate, hostname, or nginx configuration was changed.
