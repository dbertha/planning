#!/usr/bin/env node

/**
 * Test de simulation d'équité de distribution
 * Charge un snapshot JSON et simule l'auto-distribution jusqu'à la fin de l'année
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  simulateAutoDistribution,
  analyzeDistribution,
  generateReport
} from './fairness-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Couleurs
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

/**
 * Charge le snapshot JSON
 */
function loadSnapshot(snapshotPath) {
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Fichier snapshot introuvable: ${snapshotPath}`);
  }

  log(`📂 Chargement du snapshot: ${snapshotPath}`, 'cyan');
  const content = fs.readFileSync(snapshotPath, 'utf-8');
  const snapshot = JSON.parse(content);

  log(`   Planning: ${snapshot.planning.name}`, 'green');
  log(`   Exporté le: ${snapshot.metadata.exported_at}`, 'blue');

  return snapshot;
}

/**
 * Identifie les semaines à simuler (futures ou non assignées complètement)
 */
function getWeeksToSimulate(semaines, affectations, classes) {
  const today = new Date();
  const weeksWithAffectations = new Map();

  // Compter les affectations par semaine
  affectations.forEach(aff => {
    const count = weeksWithAffectations.get(aff.semaine_id) || 0;
    weeksWithAffectations.set(aff.semaine_id, count + 1);
  });

  const classesCount = classes.length;

  // Sélectionner les semaines futures ou incomplètes
  const toSimulate = semaines
    .map(s => ({
      ...s,
      debut_date: new Date(s.debut),
      current_affectations: weeksWithAffectations.get(s.id) || 0
    }))
    .filter(s => {
      // Semaine future OU incomplète
      return s.debut_date >= today || s.current_affectations < classesCount;
    })
    .sort((a, b) => a.debut_date - b.debut_date);

  return toSimulate;
}

/**
 * Simule l'auto-distribution pour toutes les semaines futures
 */
function simulateFullYear(snapshot) {
  log('\n🔄 Simulation de la distribution jusqu\'à fin d\'année...', 'cyan');

  const { classes, familles, semaines, affectations: initialAffectations } = snapshot;

  // Créer des copies pour la simulation
  const simulatedAffectations = [...initialAffectations];
  const familyAssignments = new Map();

  // Initialiser les compteurs et dernière date d'affectation
  const familyLastAssignment = new Map(); // Map famille_id -> dernière date
  
  familles.forEach(f => {
    const familleAffectations = initialAffectations.filter(a => a.famille_id === f.id);
    familyAssignments.set(f.id, familleAffectations.length);
    
    // Trouver la dernière date d'affectation
    if (familleAffectations.length > 0) {
      const lastAff = familleAffectations
        .map(a => {
          const semaine = semaines.find(s => s.id === a.semaine_id);
          return semaine ? new Date(semaine.debut) : null;
        })
        .filter(d => d)
        .sort((a, b) => b - a)[0];
      if (lastAff) {
        familyLastAssignment.set(f.id, lastAff);
      }
    }
  });

  // Identifier les semaines à simuler
  const weeksToSimulate = getWeeksToSimulate(semaines, initialAffectations, classes);
  
  log(`\n📊 État initial:`, 'blue');
  log(`   Total semaines: ${semaines.length}`, 'blue');
  log(`   Semaines déjà assignées: ${semaines.length - weeksToSimulate.length}`, 'green');
  log(`   Semaines à simuler: ${weeksToSimulate.length}`, 'yellow');
  log(`   Affectations actuelles: ${initialAffectations.length}\n`, 'blue');

  if (weeksToSimulate.length === 0) {
    log('✅ Aucune semaine à simuler, toutes sont déjà complètes', 'green');
    return {
      semaines_simulees: 0,
      nouvelles_affectations: 0,
      snapshot_final: snapshot
    };
  }

  // Simuler chaque semaine
  let nouvelles_affectations = 0;
  
  weeksToSimulate.forEach((semaine, index) => {
    const weekNumber = index + 1;
    const totalWeeks = weeksToSimulate.length;

    // Classes déjà occupées pour cette semaine
    const occupiedClasses = new Set(
      simulatedAffectations
        .filter(a => a.semaine_id === semaine.id)
        .map(a => a.classe_id)
    );

    // Classes disponibles
    const availableClasses = classes
      .filter(c => !occupiedClasses.has(c.id))
      .map(c => ({ id: c.id, nom: c.nom }));

    if (availableClasses.length === 0) {
      log(`   Semaine ${semaine.id}: Déjà complète (${occupiedClasses.size}/${classes.length})`, 'blue');
      return;
    }

    // Familles déjà assignées cette semaine
    const occupiedFamilies = new Set(
      simulatedAffectations
        .filter(a => a.semaine_id === semaine.id)
        .map(a => a.famille_id)
    );

    // Familles éligibles
    const activeFamilles = familles.filter(f => f.is_active);
    const eligibleFamilies = activeFamilles
      .filter(f => !occupiedFamilies.has(f.id))
      .map(f => ({
        id: f.id,
        nom: f.nom,
        nb_nettoyage: f.nb_nettoyage,
        classes_preferences: f.classes_preferences || [],
        current_assignments: familyAssignments.get(f.id) || 0,
        last_assignment_date: familyLastAssignment.get(f.id) || null
      }));

    // Calculer fractionSoFar basé sur la position de la semaine
    const weekIndex = semaines.findIndex(s => s.id === semaine.id);
    const fractionSoFar = (weekIndex + 1) / semaines.length;

    // Date de la semaine courante pour le calcul de recency
    const currentWeekDate = new Date(semaine.debut);

    // Simuler l'auto-distribution
    const assignments = simulateAutoDistribution(
      availableClasses,
      eligibleFamilies,
      fractionSoFar,
      currentWeekDate
    );

    // Appliquer les affectations
    assignments.forEach(aff => {
      simulatedAffectations.push({
        famille_id: aff.famille_id,
        classe_id: aff.classe_id,
        semaine_id: semaine.id,
        notes: `Simulé - ${aff.progress}% complété`,
        simulated: true
      });

      const currentCount = familyAssignments.get(aff.famille_id) || 0;
      familyAssignments.set(aff.famille_id, currentCount + 1);
      
      // Mettre à jour la dernière date d'affectation pour éviter les clusters
      familyLastAssignment.set(aff.famille_id, currentWeekDate);
      
      nouvelles_affectations++;
    });

    const statusIcon = assignments.length === availableClasses.length ? '✓' : '⚠';
    log(`   ${statusIcon} Semaine ${semaine.id}: ${assignments.length}/${availableClasses.length} affectations créées`, 
        assignments.length === availableClasses.length ? 'green' : 'yellow');
  });

  log(`\n✅ Simulation terminée`, 'green');
  log(`   Nouvelles affectations: ${nouvelles_affectations}`, 'blue');
  log(`   Total final: ${simulatedAffectations.length}\n`, 'blue');

  // Créer le snapshot final
  const snapshotFinal = {
    ...snapshot,
    affectations: simulatedAffectations,
    simulation_metadata: {
      semaines_simulees: weeksToSimulate.length,
      nouvelles_affectations,
      simulated_at: new Date().toISOString()
    }
  };

  return {
    semaines_simulees: weeksToSimulate.length,
    nouvelles_affectations,
    snapshot_final: snapshotFinal
  };
}

/**
 * Fonction principale
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bright}Test de Simulation d'Équité${colors.reset}

Usage:
  node tests/fairness-simulation.test.js <snapshot.json> [options]

Options:
  --verbose, -v       Afficher les détails complets de toutes les familles
  --output <path>     Sauvegarder le snapshot simulé
  --csv <path>        Exporter le rapport détaillé en CSV
  --help, -h          Afficher cette aide

Exemple:
  node tests/fairness-simulation.test.js tests/fixtures/planning-snapshot.json --verbose
  node tests/fairness-simulation.test.js tests/fixtures/planning-snapshot.json --csv rapport.csv
    `);
    process.exit(0);
  }

  const snapshotPath = args[0];
  const verbose = args.includes('--verbose') || args.includes('-v');
  const outputIndex = args.findIndex(a => a === '--output');
  const outputPath = outputIndex >= 0 ? args[outputIndex + 1] : null;
  const csvIndex = args.findIndex(a => a === '--csv');
  const csvPath = csvIndex >= 0 ? args[csvIndex + 1] : null;

  try {
    // 1. Charger le snapshot
    const snapshot = loadSnapshot(snapshotPath);

    // 2. Simuler jusqu'à la fin de l'année
    const { semaines_simulees, nouvelles_affectations, snapshot_final } = simulateFullYear(snapshot);

    // 3. Analyser la distribution finale
    const metrics = analyzeDistribution(
      snapshot_final.familles,
      snapshot_final.affectations,
      snapshot_final.semaines
    );

    // 4. Générer et afficher le rapport
    const report = generateReport(metrics, { verbose, colorize: true });
    console.log(report);

    // 5. Exporter en CSV si demandé
    if (csvPath) {
      const csvLines = ['Famille,Assigné,Quota,Pourcentage,Préférences_Respectées,Préférences_Non_Respectées,Taux_Préférences,Déviation,Statut'];
      
      metrics.families.forEach(f => {
        const prefRate = f.current_assignments > 0 ? (f.affectations_in_pref / f.current_assignments * 100).toFixed(1) : '0';
        let status = 'OK';
        if (f.current_assignments > f.nb_nettoyage) {
          status = 'HORS_QUOTA';
        } else if (f.completion_percent < 50) {
          status = 'EN_RETARD';
        } else if (f.completion_percent < 80) {
          status = 'EN_COURS';
        }
        
        csvLines.push([
          `"${f.nom}"`,
          f.current_assignments,
          f.nb_nettoyage,
          f.completion_percent.toFixed(1),
          f.affectations_in_pref,
          f.affectations_out_pref,
          prefRate,
          f.deviation,
          status
        ].join(','));
      });
      
      fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
      log(`📊 Rapport CSV sauvegardé: ${csvPath}`, 'green');
    }

    // 6. Sauvegarder le snapshot simulé si demandé
    if (outputPath) {
      fs.writeFileSync(outputPath, JSON.stringify(snapshot_final, null, 2), 'utf-8');
      log(`💾 Snapshot simulé sauvegardé: ${outputPath}`, 'green');
    }

    // 7. Retourner le code de sortie selon les résultats
    const success = metrics.global.stddev_completion < 15 && metrics.alerts.over_quota.length === 0;
    process.exit(success ? 0 : 1);

  } catch (error) {
    log(`\n❌ Erreur: ${error.message}`, 'red');
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Exporter pour utilisation dans d'autres tests
export { simulateFullYear, loadSnapshot };

// Exécuter si appelé directement
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1].endsWith('fairness-simulation.test.js')) {
  main();
}

