# Public edge verification — alirezasafaeisystems.ir

- Environment: `IRAN_PROD_SERVER`
- Connection: `ssh pt-production`
- Scope: `alirezasafaeisystems.ir` and `www.alirezasafaeisystems.ir` only
- Nginx backup: `/var/backups/nginx/pre-alireza-public-edge-20260827T213746Z`
- Certificate: `/etc/letsencrypt/live/alirezasafaeisystems.ir/`
- Certificate SANs: `alirezasafaeisystems.ir`, `www.alirezasafaeisystems.ir`

## Changes

- Replaced the affected HTTP server block's `return 404` with `return 301 https://$host$request_uri`.
- Updated only the affected HTTPS server block to use the dedicated apex/www certificate and key.
- Did not change application, release, upstream, or unrelated domain configuration.
- `nginx -t` passed before reload.

## Endpoint verification (without `-k`)

| Endpoint | Result |
|---|---|
| `http://alirezasafaeisystems.ir/` | `301` → HTTPS apex |
| `http://www.alirezasafaeisystems.ir/` | `301` → HTTPS www |
| `https://alirezasafaeisystems.ir/` | `200` |
| `https://www.alirezasafaeisystems.ir/` | `200` |

## Verdict

`LIVE_VERIFICATION_PASS`
