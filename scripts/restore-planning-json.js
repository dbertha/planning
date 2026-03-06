#!/usr/bin/env node

/**
 * Script pour restaurer un planning depuis un fichier JSON (export de export-planning-json.js)
 *
 * Usage:
 *   node scripts/restore-planning-json.js --input <path> [--dry-run]
 *   DATABASE_URL="..." node scripts/restore-planning-json.js --input planning-backup.json
 *
 * IMPORTANT: Ce script remplace TOUTES les donnees du planning cible
 * (classes, familles, semaines, affectations, exclusions).
 * Le planning lui-meme (nom, token) n'est PAS modifie.
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });
config({ path: path.join(__dirname, '..', '.env') });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        options.input = args[++i];
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
${colors.bright}Restore Planning from JSON${colors.reset}

Usage:
  node scripts/restore-planning-json.js --input <path> [--dry-run]

Options:
  --input <path>    Chemin du fichier JSON a restaurer (obligatoire)
  --dry-run         Afficher ce qui serait fait sans modifier la base
  --help, -h        Afficher cette aide

Variables d'environnement:
  DATABASE_URL      URL de connexion PostgreSQL (obligatoire)

Exemples:
  # Preview
  node scripts/restore-planning-json.js --input planning-backup.json --dry-run

  # Restore
  DATABASE_URL="postgresql://..." node scripts/restore-planning-json.js --input planning-backup.json
  `);
}

async function restore(pool, snapshot, dryRun) {
  const { planning, classes, familles, semaines, affectations, exclusions } = snapshot;

  // Find or create the planning by token
  let planningResult = await pool.query(
    'SELECT id, name, token FROM plannings WHERE token = $1',
    [planning.token]
  );

  if (planningResult.rows.length === 0) {
    log(`\nPlanning '${planning.token}' not found, creating it...`, 'yellow');
    planningResult = await pool.query(
      'INSERT INTO plannings (token, name, description, annee_scolaire, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, token',
      [planning.token, planning.name, planning.description || '', planning.annee_scolaire, planning.is_active]
    );
    log(`Created planning "${planningResult.rows[0].name}" (ID: ${planningResult.rows[0].id})`, 'green');
  }

  const dbPlanning = planningResult.rows[0];
  const planningId = dbPlanning.id;

  log(`\nTarget planning: "${dbPlanning.name}" (ID: ${planningId}, token: ${dbPlanning.token})`, 'cyan');
  log(`Snapshot from: ${snapshot.metadata.exported_at}`, 'blue');

  // Show current counts
  const [curClasses, curFamilles, curSemaines, curAffectations, curExclusions] = await Promise.all([
    pool.query('SELECT COUNT(*) as c FROM classes WHERE planning_id = $1', [planningId]),
    pool.query('SELECT COUNT(*) as c FROM familles WHERE planning_id = $1', [planningId]),
    pool.query('SELECT COUNT(*) as c FROM semaines WHERE planning_id = $1', [planningId]),
    pool.query('SELECT COUNT(*) as c FROM affectations WHERE planning_id = $1', [planningId]),
    pool.query('SELECT COUNT(*) as c FROM familles_exclusions WHERE planning_id = $1', [planningId])
  ]);

  log('\nCurrent DB state:', 'yellow');
  log(`  Classes:      ${curClasses.rows[0].c}`);
  log(`  Familles:     ${curFamilles.rows[0].c}`);
  log(`  Semaines:     ${curSemaines.rows[0].c}`);
  log(`  Affectations: ${curAffectations.rows[0].c}`);
  log(`  Exclusions:   ${curExclusions.rows[0].c}`);

  log('\nSnapshot data:', 'blue');
  log(`  Classes:      ${classes.length}`);
  log(`  Familles:     ${familles.length}`);
  log(`  Semaines:     ${semaines.length}`);
  log(`  Affectations: ${affectations.length}`);
  log(`  Exclusions:   ${exclusions.length}`);

  if (dryRun) {
    log('\n--- DRY RUN - no changes will be made ---', 'yellow');
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Delete existing data (order matters for FK constraints)
    log('\nStep 1/6: Deleting existing data...', 'yellow');
    await client.query('DELETE FROM affectations WHERE planning_id = $1', [planningId]);
    await client.query('DELETE FROM familles_exclusions WHERE planning_id = $1', [planningId]);
    await client.query('DELETE FROM familles WHERE planning_id = $1', [planningId]);
    await client.query('DELETE FROM semaines WHERE planning_id = $1', [planningId]);
    await client.query('DELETE FROM classes WHERE planning_id = $1', [planningId]);
    log('  Existing data deleted', 'green');

    // 2. Insert classes
    log('Step 2/6: Inserting classes...', 'yellow');
    for (const c of classes) {
      await client.query(
        'INSERT INTO classes (id, planning_id, nom, couleur, ordre, description, instructions_pdf_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [c.id, planningId, c.nom, c.couleur, c.ordre, c.description, c.instructions_pdf_url]
      );
    }
    log(`  ${classes.length} classes inserted`, 'green');

    // 3. Insert semaines
    log('Step 3/6: Inserting semaines...', 'yellow');
    for (const s of semaines) {
      await client.query(
        'INSERT INTO semaines (id, planning_id, debut, fin, type, description, code_cles, is_published, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [s.id, planningId, s.debut, s.fin, s.type, s.description, s.code_cles, s.is_published, s.published_at]
      );
    }
    log(`  ${semaines.length} semaines inserted`, 'green');

    // 4. Insert familles (preserving original IDs for FK references)
    // We need to map old IDs to new IDs for affectations/exclusions
    log('Step 4/6: Inserting familles...', 'yellow');
    const familleIdMap = new Map(); // old_id -> new_id

    for (const f of familles) {
      const result = await client.query(
        'INSERT INTO familles (planning_id, nom, email, telephone, telephone2, nb_nettoyage, classes_preferences, notes, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [planningId, f.nom, f.email, f.telephone, f.telephone2, f.nb_nettoyage, f.classes_preferences, f.notes, f.is_active]
      );
      familleIdMap.set(f.id, result.rows[0].id);
    }
    log(`  ${familles.length} familles inserted`, 'green');

    // Check if any IDs changed
    const changedIds = [...familleIdMap.entries()].filter(([old, newId]) => old !== newId);
    if (changedIds.length > 0) {
      log(`  Note: ${changedIds.length} famille IDs were remapped (auto-increment)`, 'yellow');
    }

    // 5. Insert exclusions
    log('Step 5/6: Inserting exclusions...', 'yellow');
    let exclusionErrors = 0;
    for (const e of exclusions) {
      const newFamilleId = familleIdMap.get(e.famille_id);
      if (!newFamilleId) {
        log(`  Warning: skipping exclusion ${e.id} - famille_id ${e.famille_id} not found in snapshot`, 'yellow');
        exclusionErrors++;
        continue;
      }
      await client.query(
        'INSERT INTO familles_exclusions (famille_id, planning_id, date_debut, date_fin, type, notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [newFamilleId, planningId, e.date_debut, e.date_fin, e.type, e.notes]
      );
    }
    log(`  ${exclusions.length - exclusionErrors} exclusions inserted${exclusionErrors > 0 ? ` (${exclusionErrors} skipped)` : ''}`, 'green');

    // 6. Insert affectations
    log('Step 6/6: Inserting affectations...', 'yellow');
    let affectationErrors = 0;
    for (const a of affectations) {
      const newFamilleId = familleIdMap.get(a.famille_id);
      if (!newFamilleId) {
        log(`  Warning: skipping affectation ${a.id} - famille_id ${a.famille_id} not found in snapshot`, 'yellow');
        affectationErrors++;
        continue;
      }
      await client.query(
        'INSERT INTO affectations (planning_id, famille_id, classe_id, semaine_id, notes) VALUES ($1, $2, $3, $4, $5)',
        [planningId, newFamilleId, a.classe_id, a.semaine_id, a.notes]
      );
    }
    log(`  ${affectations.length - affectationErrors} affectations inserted${affectationErrors > 0 ? ` (${affectationErrors} skipped)` : ''}`, 'green');

    await client.query('COMMIT');
    log('\nRestore committed successfully!', 'green');

  } catch (error) {
    await client.query('ROLLBACK');
    log(`\nRestore ROLLED BACK: ${error.message}`, 'red');
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  const options = parseArgs();

  if (!options.input) {
    log('Missing --input parameter', 'red');
    showHelp();
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    log('DATABASE_URL not set', 'red');
    process.exit(1);
  }

  // Read and validate snapshot
  const inputPath = path.resolve(options.input);
  if (!fs.existsSync(inputPath)) {
    log(`File not found: ${inputPath}`, 'red');
    process.exit(1);
  }

  let snapshot;
  try {
    snapshot = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  } catch (e) {
    log(`Invalid JSON: ${e.message}`, 'red');
    process.exit(1);
  }

  // Validate snapshot structure
  const requiredKeys = ['metadata', 'planning', 'classes', 'familles', 'semaines', 'affectations', 'exclusions'];
  const missingKeys = requiredKeys.filter(k => !(k in snapshot));
  if (missingKeys.length > 0) {
    log(`Invalid snapshot: missing keys: ${missingKeys.join(', ')}`, 'red');
    process.exit(1);
  }

  log(`Restoring from: ${inputPath}`, 'cyan');
  log(`Snapshot exported: ${snapshot.metadata.exported_at}`, 'blue');
  log(`Planning token: ${snapshot.planning.token}`, 'blue');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await restore(pool, snapshot, options.dryRun);
  } catch (error) {
    log(`\nFatal: ${error.message}`, 'red');
    if (process.env.DEBUG) console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
