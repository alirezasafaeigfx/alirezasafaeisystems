# Decision Log

## 2026-08-30 — Public-experience acceptance and execution correction

Owner explicitly requested direct roadmap/agent/rule/engineering-guide updates, practical task/sprint cards, advanced interaction, plain Persian and independent checking of every Codex report. Successful Production release remains historical fact; it is not complete design/motion acceptance. Reconcile state in the [ledger](../execution/V3_2_WORK_LEDGER.md); use only the [canonical roadmap](../roadmaps/ASDEV_PUBLIC_EXPERIENCE_EXECUTION.md).

Replace the old Gate-A-only ceiling with a complete native foundation plus admitted bounded Anime.js evaluation and one deferred Three.js signature prototype, with measured adoption and no blanket runtime/dependency permission. Required quality is the smallest complete solution, not the fewest lines. Preserve current app stack/SQLite/deploy architecture and normal protected PR flow. Missing visual/source/performance evidence cannot be called PASS. The new [engineering guide](../engineering/PUBLIC_EXPERIENCE_ENGINEERING.md) and [report review protocol](../governance/CODEX_REPORT_REVIEW.md) define implementation and inspection. No code/dependency/runtime/settings mutation is performed by this docs decision. Older conflicting public-site task priorities below are historical.

Append-only. Newest first.

---

## 2026-08-30 — Compress deploy source archive for VPS transfer

- **Decision:** `deploy-vps.yml` now emits `.tar.gz` source archives and extracts them with `tar -xzf`.
- **Why:** The previous raw tar transfer was too large for the pass-2 budget.
- **Effect:** Keeps the immutable SHA + resumable rsync contract while shrinking transfer size.

## 2026-07-09 — Autonomous Loop Governance installed in GitHub

- **Decision:** Official policy path `docs/automation/ASDEV_AUTONOMOUS_LOOP_POLICY.md`; AGENTS.md + control-plane README + agent rules point here.  
- **Why:** Chat-only loop instructions caused stop-after-task behavior.  
- **Effect:** Agents must continue safe high-ROI work after every completion.

## 2026-07-09 — No 10/10 claim without public edge

- **Decision:** Continue product quality on GitHub; do **not** declare 10/10 or public deploy complete until edge+uptime+depth proven.
- **Why:** External audit 502 + honest scoring; app-layer alone is not public quality.
- **Product commits:** `bc1068c`, `0c16bec` on persiantoolbox main.

## 2026-07-08 — No 10/10 or public-edge claim until proven

- **Decision:** Do **not** claim 10/10 product/site quality or production **public** deploy (edge live) until **public edge + depth + uptime** are proven.  
- **Why:** App-layer prod on `:3100` + product quality packs (`bc1068c` + SEO factory) improve the product, but public edge is still OFF; score trajectory is ~7.5 not 10.  
- **Not doing yet:** Marketing 10/10 claims, edge cutover, or treating app-layer-only as full public launch.

## 2026-07-08 — OS Build Loop v2

- **Decision:** Build ASDEV Engineering Operating Model before more site handwork.  
- **Why:** Multi-project + multi-agent growth needs factory, not one-off ops.  
- **Not doing yet:** public edge / live timers / migrations without phrases.

## 2026-07-08 — Autonomous Productivity Mode

- **Decision:** Agents must continue safe high-value work; stop only on real gates.  
- **Why:** Over-gating created a conservative waiter, not an OS builder.

## 2026-07-08 — First CRITICAL_SITE production = app-layer only

- **Decision:** Option A — `127.0.0.1:3100` only.  
- **Why:** Blast radius; edge separate phrase.

## 2026-07-08 — Port isolation 3100/3200

- **Decision:** Registry prod/staging ports never equal.  
- **Why:** Co-host safety.

## 2026-07-08 — Remote build on IRAN for product pin

- **Decision:** Build on IRAN (heap + swap) instead of huge SCP.  
- **Why:** Transfer instability / OOM.
