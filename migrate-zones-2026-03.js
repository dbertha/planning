#!/usr/bin/env node

/**
 * Migration: Reorganiser les zones de nettoyage (mars 2026)
 *
 * Changements:
 * - Zone G (Libellule+Cheval, Beatrice) -> Zone D (Maternelle)
 * - Zone D (Hirondelle+Milan, P3/P4) -> Zone G (Primaire, rose)
 * - Zone B: description mise a jour (ecureuil = cuisine uniquement)
 * - Zone D (nouvelle): cheval = estrade+parquet+garderie
 * - Ordre: ABCD maternelles, EFG primaires
 *
 * Usage: node migrate-zones-2026-03.js <TOKEN_PLANNING> <DB_URI> [--dry-run]
 */

import { Client } from 'pg';

async function migrate(planningToken, dbUri, dryRun = false) {
  const client = new Client({ connectionString: dbUri });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get planning ID
    const planningResult = await client.query(
      'SELECT id, name FROM plannings WHERE token = $1',
      [planningToken]
    );

    if (planningResult.rows.length === 0) {
      throw new Error(`Planning "${planningToken}" not found`);
    }

    const planningId = planningResult.rows[0].id;
    console.log(`Planning: "${planningResult.rows[0].name}" (ID: ${planningId})`);

    // Show current state
    const currentClasses = await client.query(
      'SELECT id, nom, couleur, ordre, description FROM classes WHERE planning_id = $1 ORDER BY ordre',
      [planningId]
    );
    console.log('\nCurrent zones:');
    currentClasses.rows.forEach(c => console.log(`  ${c.id}: ${c.nom} (ordre ${c.ordre})`));

    // Show affected families
    const famillesWithD = await client.query(
      "SELECT id, nom, classes_preferences FROM familles WHERE planning_id = $1 AND 'D' = ANY(classes_preferences)",
      [planningId]
    );
    const famillesWithG = await client.query(
      "SELECT id, nom, classes_preferences FROM familles WHERE planning_id = $1 AND 'G' = ANY(classes_preferences)",
      [planningId]
    );

    console.log(`\nFamilies with zone D (will become G): ${famillesWithD.rows.length}`);
    famillesWithD.rows.forEach(f => console.log(`  - ${f.nom} (prefs: ${f.classes_preferences})`));
    console.log(`Families with zone G (will become D): ${famillesWithG.rows.length}`);
    famillesWithG.rows.forEach(f => console.log(`  - ${f.nom} (prefs: ${f.classes_preferences})`));

    // Show affected affectations
    const affectD = await client.query(
      "SELECT COUNT(*) as count FROM affectations WHERE planning_id = $1 AND classe_id = 'D'",
      [planningId]
    );
    const affectG = await client.query(
      "SELECT COUNT(*) as count FROM affectations WHERE planning_id = $1 AND classe_id = 'G'",
      [planningId]
    );
    console.log(`\nAffectations with zone D (will become G): ${affectD.rows[0].count}`);
    console.log(`Affectations with zone G (will become D): ${affectG.rows[0].count}`);

    if (dryRun) {
      console.log('\n--- DRY RUN - no changes made ---');
      return;
    }

    // Begin transaction
    await client.query('BEGIN');

    try {
      // Step 0: Temporarily drop FK constraint on affectations -> classes
      console.log('\nStep 0: Temporarily drop FK constraints');
      await client.query(
        "ALTER TABLE affectations DROP CONSTRAINT IF EXISTS affectations_classe_id_planning_id_fkey"
      );

      // Step 1: Swap D <-> G in affectations via _TEMP
      console.log('Step 1: Swap affectations D <-> G');
      await client.query(
        "UPDATE affectations SET classe_id = '_TEMP' WHERE classe_id = 'D' AND planning_id = $1",
        [planningId]
      );
      await client.query(
        "UPDATE affectations SET classe_id = 'D' WHERE classe_id = 'G' AND planning_id = $1",
        [planningId]
      );
      await client.query(
        "UPDATE affectations SET classe_id = 'G' WHERE classe_id = '_TEMP' AND planning_id = $1",
        [planningId]
      );

      // Step 2: Swap D <-> G in familles preferences via _TEMP
      console.log('Step 2: Swap family preferences D <-> G');
      await client.query(
        "UPDATE familles SET classes_preferences = array_replace(classes_preferences, 'D', '_TEMP') WHERE planning_id = $1 AND 'D' = ANY(classes_preferences)",
        [planningId]
      );
      await client.query(
        "UPDATE familles SET classes_preferences = array_replace(classes_preferences, 'G', 'D') WHERE planning_id = $1 AND 'G' = ANY(classes_preferences)",
        [planningId]
      );
      await client.query(
        "UPDATE familles SET classes_preferences = array_replace(classes_preferences, '_TEMP', 'G') WHERE planning_id = $1 AND '_TEMP' = ANY(classes_preferences)",
        [planningId]
      );

      // Step 3: Swap class IDs D <-> G via _TEMP
      console.log('Step 3: Swap class IDs D <-> G');
      await client.query(
        "UPDATE classes SET id = '_TEMP' WHERE id = 'D' AND planning_id = $1",
        [planningId]
      );
      await client.query(
        "UPDATE classes SET id = 'D', nom = 'Partie D - Maternelle', couleur = '#baffba', ordre = 4, description = 'Local Libellule (Classe de Beatrice) + local Cheval (estrade + parquet + garderie)' WHERE id = 'G' AND planning_id = $1",
        [planningId]
      );
      await client.query(
        "UPDATE classes SET id = 'G', nom = 'Partie G - Primaire', couleur = '#ffb3d9', ordre = 7, description = 'Local Hirondelle (Classe de P3) + local Milan (classe de P4)' WHERE id = '_TEMP' AND planning_id = $1",
        [planningId]
      );

      // Step 4: Update zone B description
      console.log('Step 4: Update zone B description');
      await client.query(
        "UPDATE classes SET description = 'Local Chat (Classe d''Eglantine) + local Ecureuil (cuisine uniquement)' WHERE id = 'B' AND planning_id = $1",
        [planningId]
      );

      // Step 5: Update zone E order (5) and F order (6)
      console.log('Step 5: Update zone orders (E=5, F=6)');
      await client.query(
        "UPDATE classes SET ordre = 5 WHERE id = 'E' AND planning_id = $1",
        [planningId]
      );
      await client.query(
        "UPDATE classes SET ordre = 6 WHERE id = 'F' AND planning_id = $1",
        [planningId]
      );

      // Step 6: Re-add FK constraint
      console.log('Step 6: Re-add FK constraint');
      await client.query(
        "ALTER TABLE affectations ADD CONSTRAINT affectations_classe_id_planning_id_fkey FOREIGN KEY (classe_id, planning_id) REFERENCES classes(id, planning_id)"
      );

      await client.query('COMMIT');
      console.log('\nMigration committed successfully!');

      // Show final state
      const finalClasses = await client.query(
        'SELECT id, nom, couleur, ordre, description FROM classes WHERE planning_id = $1 ORDER BY ordre',
        [planningId]
      );
      console.log('\nNew zones:');
      finalClasses.rows.forEach(c => console.log(`  ${c.id}: ${c.nom} (ordre ${c.ordre}) - ${c.description}`));

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Migration ROLLED BACK due to error:', error.message);
      throw error;
    }

  } finally {
    await client.end();
  }
}

// Parse args
const args = process.argv.slice(2);
if (args.length < 2 || args.includes('--help')) {
  console.log('Usage: node migrate-zones-2026-03.js <TOKEN_PLANNING> <DB_URI> [--dry-run]');
  console.log('');
  console.log('  --dry-run  Show what would change without making changes');
  process.exit(0);
}

const [token, dbUri] = args;
const dryRun = args.includes('--dry-run');

migrate(token, dbUri, dryRun).catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
