# NEXT 30 DAYS — ASDEV Roadmap

**Period:** 2026-08-15 to 2026-09-14
**Source of Truth:** GitHub

---

## 1. Unified Deploy Rollout

## 0. Discover Portfolio Integration — P1

هدف این بازه، انتقال Discover از surface مستقل به route داخلی سایت شخصی است؛ با reuse کامل Admin، Prisma، layout و release contracts موجود.

### Milestones

- Week 1: local schema/API contract و تست‌های failing
- Week 2: public `/discover`، locale/SEO و Admin CRUD
- Week 3: Windows 11 smoke/a11y، migration rehearsal و cleanup proof
- Week 4: focused PR، CI و release readiness review

### Acceptance

- Discover فقط Published/Discover records را نمایش دهد.
- Portfolio فعلی بدون regression باقی بماند.
- CRUD و publication بدون deploy در local کار کند.
- هیچ runtime service/database/auth جدا اضافه نشود.
- جزئیات در `docs/superpowers/specs/2026-08-15-discover-portfolio-integration-design.md` و `docs/operations/DISCOVER_LOCAL_RUNBOOK.md` ثبت شده باشد.

- Standardize deploy process across all sites
- Create unified deploy script
- Add validation gates (lint, type-check, test, build, healthcheck)
- Implement rollback procedures
- Deploy to all sites with owner approval

**Milestones:**
- Week 1: Deploy script standardized
- Week 2: Validation gates implemented
- Week 3: Rollback procedures documented
- Week 4: All sites using unified deploy

---

## 2. Monitoring Automation

- Implement synthetic route monitoring
- Set up automated health checks
- Create alert notification system (Telegram/webhook)
- Define SLO targets
- Create monitoring dashboard

**Milestones:**
- Week 1: Synthetic monitoring active
- Week 2: Health checks automated
- Week 3: Alerts configured
- Week 4: Dashboard operational

---

## 3. Website-by-Website Standardization

- Audit each site's tech stack and configuration
- Standardize testing approach
- Standardize deployment approach
- Standardize monitoring approach
- Document site-specific configurations

**Milestones:**
- Week 1: Audit complete
- Week 2: Standards defined
- Week 3: AlirezaSafaeiSystems standardized
- Week 4: AuditSystems and PersianToolbox aligned

---

## 4. Automation Hardening

- Harden command loop scripts
- Add error handling and retry logic
- Implement provider fallback
- Add rate limiting to automation
- Create automation health checks

**Milestones:**
- Week 1: Error handling added
- Week 2: Retry logic implemented
- Week 3: Provider fallback tested
- Week 4: Health checks operational

---

## 5. Technical Debt Burn-Down

- Identify top technical debt items
- Prioritize by impact and effort
- Create focused PRs for each item
- Track burn-down progress
- Report weekly to Issue #45

**Milestones:**
- Week 1: Debt inventory complete
- Week 2: Top 5 items addressed
- Week 3: Top 10 items addressed
- Week 4: Burn-down report published

---

## Task Priority

| Priority | Task | Effort | Risk |
|---|---|---|---|
| 1 | Unified deploy rollout | High | Medium |
| 2 | Monitoring automation | Medium | Low |
| 3 | Website standardization | Medium | Low |
| 4 | Automation hardening | Medium | Low |
| 5 | Technical debt burn-down | High | Low |

---

## Success Criteria

By end of 30 days:
- All sites use unified deploy process
- Monitoring automated and alerting active
- Sites standardized with documented configurations
- Automation scripts hardened and tested
- Top 10 technical debt items resolved
- Weekly progress reports posted to Issue #45
