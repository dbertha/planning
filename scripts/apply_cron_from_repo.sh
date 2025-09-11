#!/usr/bin/env bash
# /srv/ecole-app/apply_cron_from_repo.sh
set -euo pipefail

APP_DIR="/srv/ecole-app"
CRON_YAML="$APP_DIR/cron/cronjobs.yml"
CRON_TMP="$APP_DIR/cron.current"
CRON_BACKUP="$APP_DIR/cron.previous"
CRON_USER="${1:-ecole}"   # default user for crontab

if [ ! -f "$CRON_YAML" ]; then
  echo "No cron file found at $CRON_YAML"
  exit 0
fi

# Convert YAML -> crontab format
python3 - <<PY
import sys, yaml, shlex
p = yaml.safe_load(open("$CRON_YAML"))
lines = []
for job in p.get("jobs", []):
    sched = job.get("schedule")
    cmd = job.get("command")
    comment = job.get("comment","")
    if not sched or not cmd:
        print("Skipping job with missing schedule/command", file=sys.stderr)
        continue
    # ensure the command runs with environment wrapper if not absolute to /usr/local/bin
    # We assume command is safe as given
    # Add a comment line for readability
    if comment:
        lines.append("# " + comment)
    lines.append(f"{sched} {cmd}")
print("\n".join(lines))
PY
> "$CRON_TMP"

# Normalize line endings
dos2unix -q "$CRON_TMP" || true

# If crontab is identical, do nothing
if crontab -l 2>/dev/null | sed '/^# Installed by/,$d' > /tmp/existing_cron || true; then
  :
fi

if cmp -s "$CRON_TMP" /tmp/existing_cron 2>/dev/null; then
  echo "Crontab unchanged; nothing to do."
  rm -f /tmp/existing_cron
  exit 0
fi

# Backup current crontab
crontab -l > "$CRON_BACKUP" 2>/dev/null || true
cp "$CRON_TMP" "$CRON_TMP".installed

# Install new crontab (for the current SSH user)
# We prepend a small header so future comparisons can ignore metadata if needed
cat > "$CRON_TMP".withheader <<EOF
# Installed by git-deploy pipeline on $(date -Iseconds)
# Source: $CRON_YAML
$(cat "$CRON_TMP")
EOF

# install
crontab "$CRON_TMP".withheader

echo "Installed new crontab for user $CRON_USER."
rm -f /tmp/existing_cron
