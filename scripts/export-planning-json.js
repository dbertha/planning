#!/usr/bin/env node

/**
 * Script pour exporter un planning de production vers un fichier JSON
 * 
 * Usage:
 *   node scripts/export-planning-json.js --list
 *   node scripts/export-planning-json.js --token <token> --output <path>
 *   DATABASE_URL="..." node scripts/export-planning-json.js --token ecole2025
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger .env si présent
config({ path: path.join(__dirname, '..', '.env.local') });
config({ path: path.join(__dirname, '..', '.env') });

// Couleurs pour l'affichage
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

// Parser les arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    list: false,
    token: null,
    output: null
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--list':
        options.list = true;
        break;
      case '--token':
        options.token = args[++i];
        break;
      case '--output':
        options.output = args[++i];
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
${colors.bright}Export Planning JSON${colors.reset}

Usage:
  node scripts/export-planning-json.js --list
  node scripts/export-planning-json.js --token <token> --output <path>

Options:
  --list              Lister tous les plannings disponibles
  --token <token>     Token du planning à exporter
  --output <path>     Chemin du fichier de sortie (défaut: tests/fixtures/planning-snapshot.json)
  --help, -h          Afficher cette aide

Variables d'environnement:
  DATABASE_URL        URL de connexion PostgreSQL (obligatoire)

Exemples:
  # Lister les plannings
  DATABASE_URL="postgresql://user:pass@host:5432/db" node scripts/export-planning-json.js --list

  # Exporter un planning
  node scripts/export-planning-json.js --token ecole2025 --output planning-backup.json
  `);
}

async function listPlannings(pool) {
  log('\n📋 Plannings disponibles:', 'cyan');
  
  const result = await pool.query(`
    SELECT 
      id, 
      token, 
      name, 
      annee_scolaire, 
      is_active,
      created_at
    FROM plannings 
    ORDER BY created_at DESC
  `);

  if (result.rows.length === 0) {
    log('   Aucun planning trouvé', 'yellow');
    return;
  }

  result.rows.forEach(planning => {
    const status = planning.is_active ? '✓' : '✗';
    const statusColor = planning.is_active ? 'green' : 'red';
    log(`\n   ${status} ${planning.name}`, statusColor);
    log(`     Token: ${planning.token}`, 'blue');
    log(`     Année: ${planning.annee_scolaire || 'N/A'}`);
    log(`     ID: ${planning.id}`);
  });
  
  log(''); // Ligne vide
}

async function exportPlanning(pool, token, outputPath) {
  log(`\n🔄 Export du planning avec token: ${token}`, 'cyan');

  // 1. Récupérer le planning
  const planningResult = await pool.query(
    'SELECT * FROM plannings WHERE token = $1 AND is_active = true',
    [token]
  );

  if (planningResult.rows.length === 0) {
    throw new Error(`Planning avec le token '${token}' introuvable`);
  }

  const planning = planningResult.rows[0];
  log(`   Planning: ${planning.name}`, 'green');

  // 2. Récupérer toutes les données associées en parallèle
  log('   Récupération des données...', 'blue');
  
  const [classesResult, famillesResult, semainesResult, affectationsResult, exclusionsResult] = 
    await Promise.all([
      pool.query('SELECT * FROM classes WHERE planning_id = $1 ORDER BY ordre, id', [planning.id]),
      pool.query('SELECT * FROM familles WHERE planning_id = $1 ORDER BY nom', [planning.id]),
      pool.query('SELECT * FROM semaines WHERE planning_id = $1 ORDER BY debut', [planning.id]),
      pool.query('SELECT * FROM affectations WHERE planning_id = $1', [planning.id]),
      pool.query('SELECT * FROM familles_exclusions WHERE planning_id = $1', [planning.id])
    ]);

  // 3. Construire l'objet JSON
  const snapshot = {
    metadata: {
      exported_at: new Date().toISOString(),
      planning_token: planning.token,
      planning_name: planning.name,
      export_tool: 'export-planning-json.js'
    },
    planning: {
      id: planning.id,
      token: planning.token,
      name: planning.name,
      description: planning.description,
      annee_scolaire: planning.annee_scolaire,
      is_active: planning.is_active
    },
    classes: classesResult.rows.map(c => ({
      id: c.id,
      nom: c.nom,
      couleur: c.couleur,
      ordre: c.ordre,
      description: c.description,
      instructions_pdf_url: c.instructions_pdf_url
    })),
    familles: famillesResult.rows.map(f => ({
      id: f.id,
      nom: f.nom,
      email: f.email,
      telephone: f.telephone,
      telephone2: f.telephone2,
      nb_nettoyage: f.nb_nettoyage,
      classes_preferences: f.classes_preferences,
      notes: f.notes,
      is_active: f.is_active
    })),
    semaines: semainesResult.rows.map(s => ({
      id: s.id,
      debut: s.debut,
      fin: s.fin,
      type: s.type,
      description: s.description,
      code_cles: s.code_cles,
      is_published: s.is_published,
      published_at: s.published_at
    })),
    affectations: affectationsResult.rows.map(a => ({
      id: a.id,
      famille_id: a.famille_id,
      classe_id: a.classe_id,
      semaine_id: a.semaine_id,
      notes: a.notes,
      created_at: a.created_at
    })),
    exclusions: exclusionsResult.rows.map(e => ({
      id: e.id,
      famille_id: e.famille_id,
      date_debut: e.date_debut,
      date_fin: e.date_fin,
      type: e.type,
      notes: e.notes
    }))
  };

  // 4. Statistiques
  log('\n📊 Statistiques:', 'cyan');
  log(`   Classes: ${snapshot.classes.length}`, 'blue');
  log(`   Familles: ${snapshot.familles.length} (${snapshot.familles.filter(f => f.is_active).length} actives)`, 'blue');
  log(`   Semaines: ${snapshot.semaines.length}`, 'blue');
  log(`   Affectations: ${snapshot.affectations.length}`, 'blue');
  log(`   Exclusions: ${snapshot.exclusions.length}`, 'blue');

  // 5. Écrire le fichier JSON
  const jsonContent = JSON.stringify(snapshot, null, 2);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, jsonContent, 'utf-8');

  const sizeKB = (jsonContent.length / 1024).toFixed(2);
  log(`\n✅ Export réussi: ${outputPath}`, 'green');
  log(`   Taille: ${sizeKB} KB`, 'blue');
}

async function main() {
  const options = parseArgs();

  // Vérifier DATABASE_URL
  if (!process.env.DATABASE_URL) {
    log('❌ DATABASE_URL non définie', 'red');
    log('Définir la variable d\'environnement ou créer un fichier .env', 'yellow');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    if (options.list) {
      await listPlannings(pool);
    } else if (options.token) {
      const outputPath = options.output || path.join(__dirname, '..', 'tests', 'fixtures', 'planning-snapshot.json');
      await exportPlanning(pool, options.token, outputPath);
    } else {
      showHelp();
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, 'red');
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();



