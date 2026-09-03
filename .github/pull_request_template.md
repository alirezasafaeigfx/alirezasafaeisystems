## Summary

<!-- What changed and why (ASDEV goal) -->

ASDEV-SCOPE: r0-infrastructure
ASDEV-TASK-ID: TASK-ID
ASDEV-INTENDED-BASE-SHA: FULL-BASE-SHA
ASDEV-PRIMARY-CONCERN: concise concern
ASDEV-EXPECTED-PATH-CATEGORIES: application

For the admitted Anime.js/Three.js unit, use `public-experience-dependencies`, include S4-10 or S4-11 in the task IDs, use the exact current `GITHUB_MAIN` base SHA, and list every changed-path category. The validator rejects unrelated auth, database, deployment, and undeclared paths.

## Type

- [ ] Platform / control plane
- [ ] Deploy engine
- [ ] Docs / governance
- [ ] Product app
- [ ] Observability / monitoring foundation
- [ ] Security audit (non-destructive)

## Gates taken

- [ ] None (safe autonomous work)
- [ ] Staging deploy phrase
- [ ] Production deploy phrase
- [ ] Public edge phrase
- [ ] Migration phrase
- [ ] Live monitoring timers phrase

## Validation

- [ ] Secret scan considered
- [ ] Dry-run / tests run (list below)

```text
# commands + results
```

## Risk

<!-- residual risks -->

## Explicit non-changes

<!-- e.g. no nginx reload, no DNS -->
