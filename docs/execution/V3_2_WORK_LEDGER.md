# V3.2 Work Ledger

**Single writer:** ORCH  
**Rule:** Evidence, not unchecked boxes, determines state.

## Immutable completed evidence — do not repeat

| Scope | Exact evidence | State | Reopen only if |
|---|---|---|---|
| V3 production baseline | `main@ac08d1232ee4edfcdbe029a5f636d68b9e8861cc` | frozen | a verified production incident requires it |
| V3.1 Tasks 1–10 | PR #17 head `41a80235c83ec6949d518bd7fa034814d6e43fef` | complete by code/check/artifact evidence | relevant source/head changes or a demonstrated regression |
| V3.1 visual contract | 37/37; artifact `9721029344`; digest `d48839…` | owner-approved | candidate SHA or relevant visual inputs change |
| V3.1 hosted pre-staging gates | six terminal-success workflows recorded on exact head | reusable | candidate SHA or relevant workflow/config changes |

## Active task registry

| Task | Status | Owner | Base/head | Evidence | Blocker/next action |
|---|---|---|---|---|---|
| R0-01 | `DONE` | ORCH/SRE | PR #17 `41a80235` | run `33298314611`; staging release `20260830T070559Z`; artifact `9728655284` | verified pipeline-timeout diagnosis |
| R0-02 | `QUEUED` | QA/SRE | new workflow-fix branch from `main` | `deploy-vps.yml` has 45-minute budget; uncompressed archive was 123,883,520 bytes | red/green compressed-archive contract |
| R0-03 | `BLOCKED` | SRE | exact app candidate `41a80235` | pass 1 green; pass 2 not completed | R0-02 merge, then one governed rerun |
| R0-04 | `QUEUED` | REVIEW | PR #17 `41a80235` | existing diff + hosted evidence | independent review |
| R0-05 | `BLOCKED` | ORCH/SRE | same | none yet | R0-03 and R0-04 |
| R0-06 | `BLOCKED` | ORCH | accepted merge/release base | none yet | R0-05 |
| S1-* | `QUEUED` | UX/EVID/FE/QA | post-R0 base | none yet | R0-06 |
| S2-* | `QUEUED` | EVID/UX/FE/QA | S1 accepted head | none yet | S1 exit gate |
| S3-* | `QUEUED` | FE/UX/QA | S1 accepted head | none yet | S1 contracts |
| S4-* | `QUEUED` | UX/FE/QA | S2/S3 accepted head | none yet | S2 and S3 exit gates |
| S5-* | `BLOCKED` | QA/REVIEW/SRE/ORCH | final candidate | none yet | S1–S4 |

## Update format

Append one row per meaningful state change; do not log micro-steps.

```text
UTC:
TASK_ID:
OLD_STATE -> NEW_STATE:
OWNER:
BASE_SHA:
RESULT_SHA:
FILES:
PRIMARY_EVIDENCE:
FAILURES/RISKS:
NEXT_DEPENDENCY:
```

## State definitions

- `QUEUED`: dependencies satisfied or expected; unclaimed.
- `CLAIMED`: one owner and non-overlapping paths recorded.
- `IN_PROGRESS`: bounded work has started.
- `BLOCKED`: exact dependency/gate/external blocker recorded.
- `REVIEW`: implementation complete; independent verification pending.
- `DONE`: primary evidence and ORCH acceptance recorded.
- `SUPERSEDED`: newer task/evidence replaces it; link required.

## Anti-loop checks

Do not execute a task when any answer is unknown:

1. What exact user/Audit outcome does it support?
2. What evidence proves it is not already done?
3. Which files does it own exclusively?
4. What fresh command or artifact proves completion?
5. Which higher-value safe task would be displaced?

If the task is cleanup without measurable value, duplicate verification on an unchanged SHA, speculative abstraction, or unrelated dependency churn, reject it.
