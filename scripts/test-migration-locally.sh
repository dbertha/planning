#!/usr/bin/env bash
#
# Test the zones migration locally against a copy of production data.
#
# Steps:
#   1. Start a local test PostgreSQL (docker-compose.test.yml, port 5433)
#   2. Initialize the DB schema via the app's initDatabase()
#   3. Export a snapshot from production (entretien.laec.be)
#   4. Restore that snapshot into the local DB
#   5. Run the migration script
#   6. Validate the result
#
# Usage:
#   ./scripts/test-migration-locally.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

PROD_DB_URL="postgresql://ecole:SecurePassword2025@entretien.laec.be:5432/planning"
PLANNING_TOKEN="planning-entretien-25"
LOCAL_DB_URL="postgresql://ecole:test_password@localhost:5433/planning"
SNAPSHOT_FILE="$PROJECT_DIR/planning-pre-migration-snapshot.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

step() { echo -e "\n${BOLD}${BLUE}=== $1 ===${NC}"; }
ok()   { echo -e "${GREEN}OK: $1${NC}"; }
warn() { echo -e "${YELLOW}WARN: $1${NC}"; }
fail() { echo -e "${RED}FAIL: $1${NC}"; exit 1; }

# --- Pre-flight checks ---
echo -e "${BOLD}Production DB:${NC} entretien.laec.be:5432"
echo -e "${BOLD}Local test DB:${NC} localhost:5433"
echo ""

# Check that node and docker are available
command -v node >/dev/null || fail "node not found"
command -v docker >/dev/null || fail "docker not found"

# Verify prod DB is reachable
echo "Checking production DB connectivity..."
DATABASE_URL="$PROD_DB_URL" node -e "
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const r = await pool.query('SELECT 1');
  await pool.end();
" 2>/dev/null && ok "Production DB reachable" || fail "Cannot connect to production DB at entretien.laec.be:5432"

# -------------------------------------------------------------------
step "1/6 - Start local test PostgreSQL"
# -------------------------------------------------------------------

# Only start postgres service (not the app or nginx)
docker compose -f docker-compose.test.yml up -d postgres
echo "Waiting for PostgreSQL to be ready..."
for i in $(seq 1 30); do
  if docker compose -f docker-compose.test.yml exec -T postgres pg_isready -U ecole -d planning >/dev/null 2>&1; then
    ok "PostgreSQL ready on port 5433"
    break
  fi
  if [ "$i" -eq 30 ]; then
    fail "PostgreSQL did not start within 30s"
  fi
  sleep 1
done

# -------------------------------------------------------------------
step "2/6 - Initialize DB schema locally"
# -------------------------------------------------------------------

# Run initDatabase() via a small inline script
DATABASE_URL="$LOCAL_DB_URL" node -e "
  import { initDatabase } from './api/db.js';
  await initDatabase();
  console.log('Schema initialized');
  process.exit(0);
" && ok "Schema created" || fail "Schema init failed"

# -------------------------------------------------------------------
step "3/6 - Export snapshot from production"
# -------------------------------------------------------------------

DATABASE_URL="$PROD_DB_URL" node scripts/export-planning-json.js \
  --token "$PLANNING_TOKEN" \
  --output "$SNAPSHOT_FILE" \
  && ok "Snapshot saved to $SNAPSHOT_FILE" \
  || fail "Production export failed"

# -------------------------------------------------------------------
step "4/6 - Restore snapshot into local DB"
# -------------------------------------------------------------------

DATABASE_URL="$LOCAL_DB_URL" node scripts/restore-planning-json.js \
  --input "$SNAPSHOT_FILE" \
  && ok "Restore complete" \
  || fail "Restore failed"

# -------------------------------------------------------------------
step "5/6 - Run migration (dry-run first, then apply)"
# -------------------------------------------------------------------

echo -e "${YELLOW}--- Dry run ---${NC}"
node migrate-zones-2026-03.js "$PLANNING_TOKEN" "$LOCAL_DB_URL" --dry-run

echo ""
echo -e "${YELLOW}--- Applying migration ---${NC}"
node migrate-zones-2026-03.js "$PLANNING_TOKEN" "$LOCAL_DB_URL" \
  && ok "Migration applied" \
  || fail "Migration failed"

# -------------------------------------------------------------------
step "6/6 - Validate migration result"
# -------------------------------------------------------------------

VALIDATION_RESULT=$(DATABASE_URL="$LOCAL_DB_URL" node -e "
  import { Pool } from 'pg';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const planningId = (await pool.query(\"SELECT id FROM plannings WHERE token = '$PLANNING_TOKEN'\")).rows[0].id;

  let errors = 0;
  function check(name, ok) {
    if (!ok) { console.log('FAIL: ' + name); errors++; }
    else { console.log('PASS: ' + name); }
  }

  // 1. Check zones exist with correct order
  const classes = (await pool.query(
    'SELECT id, nom, couleur, ordre, description FROM classes WHERE planning_id = \$1 ORDER BY ordre', [planningId]
  )).rows;

  check('7 zones exist', classes.length === 7);

  const zoneMap = Object.fromEntries(classes.map(c => [c.id, c]));

  // 2. Zone order: A=1, B=2, C=3, D=4, E=5, F=6, G=7
  check('Zone A ordre=1', zoneMap['A']?.ordre === 1);
  check('Zone B ordre=2', zoneMap['B']?.ordre === 2);
  check('Zone C ordre=3', zoneMap['C']?.ordre === 3);
  check('Zone D ordre=4', zoneMap['D']?.ordre === 4);
  check('Zone E ordre=5', zoneMap['E']?.ordre === 5);
  check('Zone F ordre=6', zoneMap['F']?.ordre === 6);
  check('Zone G ordre=7', zoneMap['G']?.ordre === 7);

  // 3. Zone names: ABCD = Maternelle, EFG = Primaire
  check('Zone D is Maternelle', zoneMap['D']?.nom?.includes('Maternelle'));
  check('Zone G is Primaire', zoneMap['G']?.nom?.includes('Primaire'));

  // 4. Zone D has Libellule (was G)
  check('Zone D has Libellule', zoneMap['D']?.description?.includes('Libellule'));
  check('Zone D has Cheval', zoneMap['D']?.description?.includes('Cheval'));

  // 5. Zone G has Hirondelle (was D)
  check('Zone G has Hirondelle', zoneMap['G']?.description?.includes('Hirondelle'));
  check('Zone G has Milan', zoneMap['G']?.description?.includes('Milan'));

  // 6. Zone B updated description
  check('Zone B has Ecureuil', zoneMap['B']?.description?.includes('Ecureuil'));
  check('Zone B has cuisine', zoneMap['B']?.description?.includes('cuisine'));

  // 7. Zone G color is rose
  check('Zone G color is rose (#ffb3d9)', zoneMap['G']?.couleur === '#ffb3d9');

  // 8. No orphaned affectations (all classe_ids are valid)
  const orphanedAffect = (await pool.query(
    \"SELECT a.id, a.classe_id FROM affectations a WHERE a.planning_id = \$1 AND a.classe_id NOT IN (SELECT id FROM classes WHERE planning_id = \$1)\",
    [planningId]
  )).rows;
  check('No orphaned affectations', orphanedAffect.length === 0);

  // 9. No orphaned family preferences
  const familles = (await pool.query(
    'SELECT id, nom, classes_preferences FROM familles WHERE planning_id = \$1', [planningId]
  )).rows;
  const validIds = new Set(classes.map(c => c.id));
  const orphanedPrefs = familles.filter(f =>
    f.classes_preferences?.some(p => !validIds.has(p))
  );
  check('No orphaned family preferences', orphanedPrefs.length === 0);

  // 10. Total affectations preserved
  const totalAffect = (await pool.query(
    'SELECT COUNT(*) as c FROM affectations WHERE planning_id = \$1', [planningId]
  )).rows[0].c;
  check('Affectations count > 0', parseInt(totalAffect) > 0);
  console.log('  (total affectations: ' + totalAffect + ')');

  // Summary
  console.log('');
  if (errors === 0) {
    console.log('ALL CHECKS PASSED');
  } else {
    console.log('FAILED: ' + errors + ' check(s)');
  }

  await pool.end();
  process.exit(errors > 0 ? 1 : 0);
")

echo "$VALIDATION_RESULT"

# Check exit status of validation
if echo "$VALIDATION_RESULT" | grep -q "ALL CHECKS PASSED"; then
  echo ""
  echo -e "${GREEN}${BOLD}Migration validated successfully! Safe to apply on production.${NC}"
  echo ""
  PROD_URL_DISPLAY="postgresql://ecole:***@entretien.laec.be:5432/planning"
  echo "Production commands:"
  echo "  # 1. Backup"
  echo "  DATABASE_URL=\"$PROD_URL_DISPLAY\" node scripts/export-planning-json.js --token $PLANNING_TOKEN --output planning-pre-migration-backup.json"
  echo "  # 2. Migrate"
  echo "  node migrate-zones-2026-03.js $PLANNING_TOKEN \"$PROD_URL_DISPLAY\""
else
  echo ""
  fail "Validation failed - do NOT apply on production"
fi

# -------------------------------------------------------------------
# Cleanup
# -------------------------------------------------------------------
echo ""
echo -e "${YELLOW}Local test DB still running on port 5433. To stop:${NC}"
echo "  docker compose -f docker-compose.test.yml down -v"
