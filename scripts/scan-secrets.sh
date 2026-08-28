#!/usr/bin/env bash
set -euo pipefail

DEFAULT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT_DIR="${SCAN_SECRETS_ROOT_DIR:-$DEFAULT_ROOT}"
cd "$ROOT_DIR"

TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_OUT"' EXIT

RG_BIN="${SCAN_SECRETS_RG_BIN:-rg}"
GIT_BIN="${SCAN_SECRETS_GIT_BIN:-git}"

# LOCAL_PC may expose ripgrep only as a native Windows executable while this
# script runs under Git Bash. Discover that executable without bypassing the
# scanner or falling back to a weaker pattern.
if ! command -v "$RG_BIN" >/dev/null 2>&1 && command -v where.exe >/dev/null 2>&1; then
  native_rg="$(where.exe rg.exe 2>/dev/null | head -n 1 | tr -d '\r' || true)"
  if [ -n "$native_rg" ]; then
    if command -v cygpath >/dev/null 2>&1; then
      RG_BIN="$(cygpath -u "$native_rg")"
    else
      # WSL Git Bash images may not ship cygpath; convert the common C:\ path.
      native_rg="${native_rg//\\//}"
      drive="$(printf '%s' "${native_rg:0:1}" | tr '[:upper:]' '[:lower:]')"
      RG_BIN="/mnt/${drive}${native_rg:2}"
    fi
  fi
fi
PATTERN='(AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|-----BEGIN (RSA|EC|OPENSSH|PGP) PRIVATE KEY-----|(?i)(api[_-]?key|token|secret|password)\s*[:=]\s*["'"'"'`][^"'"'"'`]{8,}["'"'"'`])'

handle_scan_status() {
  local status="$1"
  local scanner="$2"

  if [ "$status" -eq 0 ]; then
    echo "Potential secrets detected by $scanner:"
    cat "$TMP_OUT"
    exit 1
  fi

  if [ "$status" -eq 1 ]; then
    echo "Secret scan passed via $scanner."
    exit 0
  fi

  echo "Secret scan failed: $scanner exited with status $status." >&2
  exit "$status"
}

run_ripgrep() {
  set +e
  "$RG_BIN" -n --hidden \
    --glob '!.git/**' \
    --glob '!node_modules/**' \
    --glob '!.next/**' \
    --glob '!storybook-static/**' \
    --glob '!coverage/**' \
    --glob '!_ops/**' \
    --glob '!docs/**' \
    --glob '!DOCUMENTATION.md' \
    --glob '!README.md' \
    --glob '!src/**/__tests__/**' \
    --glob '!**/*.test.ts' \
    --glob '!**/*.test.tsx' \
    --glob '!**/*.spec.ts' \
    --glob '!**/*.spec.tsx' \
    --glob '!scripts/db/vps-provision-shared-postgres.sh' \
    --glob '!scripts/network/configure-vps-telegram-alert.sh' \
    --glob '!scripts/ops/vps-install-redis-enterprise.sh' \
    -P "$PATTERN" . >"$TMP_OUT"
  local status=$?
  set -e
  handle_scan_status "$status" "ripgrep"
}

run_git_grep() {
  if ! "$GIT_BIN" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Secret scan unavailable: git-grep fallback requires a Git work tree." >&2
    exit 2
  fi

  set +e
  "$GIT_BIN" grep -n -P "$PATTERN" -- \
    . \
    ':(exclude)docs/**' \
    ':(exclude)DOCUMENTATION.md' \
    ':(exclude)README.md' \
    ':(exclude)src/**/__tests__/**' \
    ':(exclude)**/*.test.ts' \
    ':(exclude)**/*.test.tsx' \
    ':(exclude)**/*.spec.ts' \
    ':(exclude)**/*.spec.tsx' \
    ':(exclude)scripts/db/vps-provision-shared-postgres.sh' \
    ':(exclude)scripts/network/configure-vps-telegram-alert.sh' \
    ':(exclude)scripts/ops/vps-install-redis-enterprise.sh' \
    >"$TMP_OUT"
  local status=$?
  set -e
  handle_scan_status "$status" "git grep fallback"
}

if command -v "$RG_BIN" >/dev/null 2>&1; then
  run_ripgrep
fi

if command -v "$GIT_BIN" >/dev/null 2>&1; then
  run_git_grep
fi

echo "Secret scan unavailable: neither ripgrep nor git fallback is available." >&2
exit 2
