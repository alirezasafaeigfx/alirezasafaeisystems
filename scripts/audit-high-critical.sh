#!/usr/bin/env bash
set -euo pipefail

tmp_audit_file="$(mktemp)"
trap 'rm -f "$tmp_audit_file"' EXIT

set +e
pnpm audit --json >"$tmp_audit_file"
audit_status=$?
set -e

if [[ $audit_status -eq 0 ]]; then
  echo "pnpm audit: no vulnerabilities detected"
  exit 0
fi

node scripts/ci/parse-pnpm-audit.mjs "$tmp_audit_file"
