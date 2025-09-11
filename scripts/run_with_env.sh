#!/usr/bin/env bash
# /usr/local/bin/run_with_env.sh
# Usage: run_with_env.sh /path/to/script arg1 arg2...
set -euo pipefail

ENV_FILE="/srv/ecole-app/.env"

# Si .env existe, source it (ignore les lignes vides/commentaires)
if [ -f "$ENV_FILE" ]; then
  # export each KEY=VALUE line, ignore comments
  set -o allexport
  # shellcheck disable=SC1090
  # use a subshell to avoid interpreting problematic characters
  awk 'BEGIN{FS="="} /^[[:space:]]*[^#[:space:]]/ {print $0}' "$ENV_FILE" | sed 's/\r$//' > /tmp/.env_parsed
  # shellcheck disable=SC1091
  . /tmp/.env_parsed
  set +o allexport
  rm -f /tmp/.env_parsed
fi

# Exec the command passed as args
exec "$@"
