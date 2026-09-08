#!/usr/bin/env bash
set -euo pipefail

tmp_audit_file="$(mktemp)"
trap 'rm -f "$tmp_audit_file"' EXIT

set +e
pnpm audit --json >"$tmp_audit_file"
set -e

node scripts/ci/parse-pnpm-audit.mjs "$tmp_audit_file"
