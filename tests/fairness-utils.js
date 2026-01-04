/**
 * Utilitaires pour les tests d'équité de distribution
 */

import munkres from 'munkres-js';

/**
 * Calcule la moyenne d'un tableau de nombres
 */
export function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Calcule l'écart-type d'un tableau de nombres
 */
export function stddev(arr) {
  if (arr.length === 0) return 0;
  const avg = mean(arr);
  const squaredDiffs = arr.map(val => Math.pow(val - avg, 2));
  const variance = mean(squaredDiffs);
  return Math.sqrt(variance);
}

/**
 * Trouve le minimum d'un tableau
 */
export function min(arr) {
  return Math.min(...arr);
}

/**
 * Trouve le maximum d'un tableau
 */
export function max(arr) {
  return Math.max(...arr);
}

/**
 * Calcule le pourcentage de complétion pour une famille
 */
export function calculateCompletionPercent(current, nbNettoyage) {
  if (nbNettoyage === 0) return 0;
  return (current / nbNettoyage) * 100;
}

/**
 * Simule l'algorithme d'auto-distribution pour une semaine
 * Implémentation pure JS sans base de données
 */
export function simulateAutoDistribution(
  availableClasses,
  eligibleFamilies,
  fractionSoFar,
  currentWeekDate = null,
  ALPHA = 100,
  PREFERENCE_PENALTY = 5,
  RECENCY_PENALTY = 50,
  RECENCY_THRESHOLD_WEEKS = 4
) {
  const S = availableClasses.length;
  const LARGE_COST = 1e7;

  if (S === 0 || eligibleFamilies.length === 0) {
    return [];
  }

  // Construire la liste des candidats pour chaque créneau
  const candidatesPerSlot = new Array(S);
  const candidateSet = new Set();

  for (let s = 0; s < S; s++) {
    const clsId = availableClasses[s].id;
    const arr = [];

    for (const f of eligibleFamilies) {
      if (f.current_assignments >= f.nb_nettoyage) continue;
      arr.push(f.id);
      candidateSet.add(f.id);
    }
    candidatesPerSlot[s] = arr;
  }

  // Vérifier les conflits
  for (let s = 0; s < S; s++) {
    if (!candidatesPerSlot[s] || candidatesPerSlot[s].length === 0) {
      return []; // Aucune solution possible
    }
  }

  // Préparer la matrice de coûts
  const candidateFamilies = Array.from(candidateSet);
  const familiesToInclude = eligibleFamilies.filter(f => candidateSet.has(f.id));

  const n = Math.max(candidateFamilies.length, S);
  const matrix = Array.from({ length: n }, () => Array(n).fill(LARGE_COST));

  // Remplir la matrice
  for (let r = 0; r < candidateFamilies.length; r++) {
    const famId = candidateFamilies[r];
    const famille = familiesToInclude.find(f => f.id === famId);

    if (!famille) continue;

    const assignedSoFar = famille.current_assignments;
    const idealToDateForFamily = (famille.nb_nettoyage || 0) * fractionSoFar;
    const over = assignedSoFar - idealToDateForFamily;
    let timeCost = Math.round(ALPHA * over);

    // Pénalité de proximité : éviter les assignations trop rapprochées
    if (currentWeekDate && famille.last_assignment_date) {
      const lastDate = new Date(famille.last_assignment_date);
      const currentDate = new Date(currentWeekDate);
      const daysSinceLastAssignment = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
      const weeksSinceLastAssignment = daysSinceLastAssignment / 7;
      
      if (weeksSinceLastAssignment < RECENCY_THRESHOLD_WEEKS) {
        // Plus c'est récent, plus la pénalité est forte
        const recencyFactor = 1 - (weeksSinceLastAssignment / RECENCY_THRESHOLD_WEEKS);
        timeCost += Math.round(RECENCY_PENALTY * recencyFactor);
      }
    }

    for (let c = 0; c < S; c++) {
      const clsId = availableClasses[c].id;
      if (!candidatesPerSlot[c].includes(famId)) continue;

      let cost = timeCost;
      const hasPrefs = (famille.classes_preferences && famille.classes_preferences.length > 0);
      const inPrefs = hasPrefs && famille.classes_preferences.includes(clsId);
      if (hasPrefs && !inPrefs) {
        cost += PREFERENCE_PENALTY;
      }
      matrix[r][c] = cost;
    }
  }

  // Exécuter l'algorithme hongrois
  const Munkres = munkres.default?.Munkres || munkres.Munkres || munkres;
  const solver = new Munkres();
  const indexes = solver.compute(matrix);

  // Extraire les affectations valides
  const assignments = [];
  for (const [r, c] of indexes) {
    if (r < candidateFamilies.length && c < S && matrix[r][c] < LARGE_COST / 2) {
      const famille = familiesToInclude.find(f => f.id === candidateFamilies[r]);
      const assignedSoFar = famille ? famille.current_assignments : 0;
      const progressPercentage = famille ? (assignedSoFar / famille.nb_nettoyage * 100) : 0;

      assignments.push({
        famille_id: candidateFamilies[r],
        classe_id: availableClasses[c].id,
        progress: progressPercentage.toFixed(1)
      });
    }
  }

  return assignments;
}

/**
 * Analyse la distribution et calcule les métriques
 */
export function analyzeDistribution(familles, affectations, semaines) {
  const familyStats = new Map();

  // Initialiser les stats pour chaque famille
  familles.forEach(f => {
    familyStats.set(f.id, {
      id: f.id,
      nom: f.nom,
      nb_nettoyage: f.nb_nettoyage,
      is_active: f.is_active !== false, // Par défaut actif si non spécifié
      current_assignments: 0,
      preferences: f.classes_preferences || [],
      affectations_in_pref: 0,
      affectations_out_pref: 0
    });
  });

  // Compter les affectations
  affectations.forEach(aff => {
    const stats = familyStats.get(aff.famille_id);
    if (stats) {
      stats.current_assignments++;
      if (stats.preferences.includes(aff.classe_id)) {
        stats.affectations_in_pref++;
      } else {
        stats.affectations_out_pref++;
      }
    }
  });

  // Calculer les pourcentages de complétion
  const completionPercentages = [];
  const activeCompletionPercentages = [];
  const familyDetails = [];

  familyStats.forEach(stats => {
    const pct = calculateCompletionPercent(stats.current_assignments, stats.nb_nettoyage);
    completionPercentages.push(pct);
    
    // Ne considérer que les familles actives pour les métriques d'équité
    if (stats.is_active) {
      activeCompletionPercentages.push(pct);
    }
    
    familyDetails.push({
      ...stats,
      completion_percent: pct,
      expected: stats.nb_nettoyage,
      deviation: stats.current_assignments - stats.nb_nettoyage
    });
  });

  // Métriques globales (basées sur les familles ACTIVES uniquement)
  const avgCompletion = mean(activeCompletionPercentages);
  const stddevCompletion = stddev(activeCompletionPercentages);
  const minCompletion = min(activeCompletionPercentages);
  const maxCompletion = max(activeCompletionPercentages);

  // Familles problématiques (actives uniquement)
  const activeFamilies = familyDetails.filter(f => f.is_active);
  const archivedFamilies = familyDetails.filter(f => !f.is_active);
  const overQuota = activeFamilies.filter(f => f.current_assignments > f.nb_nettoyage);
  const underQuota = activeFamilies.filter(f => f.current_assignments < f.nb_nettoyage);
  const significantDeviation = activeFamilies.filter(f => Math.abs(f.completion_percent - avgCompletion) > 20);

  // Taux de respect des préférences
  const totalAffectations = affectations.length;
  const totalInPref = Array.from(familyStats.values())
    .reduce((sum, stats) => sum + stats.affectations_in_pref, 0);
  const preferenceRate = totalAffectations > 0 ? (totalInPref / totalAffectations) * 100 : 0;

  return {
    global: {
      total_families: familles.length,
      active_families: activeFamilies.length,
      archived_families: archivedFamilies.length,
      total_weeks: semaines.length,
      total_affectations: affectations.length,
      avg_completion: avgCompletion,
      stddev_completion: stddevCompletion,
      min_completion: minCompletion,
      max_completion: maxCompletion,
      preference_rate: preferenceRate
    },
    families: familyDetails.sort((a, b) => b.completion_percent - a.completion_percent),
    active_families: activeFamilies.sort((a, b) => b.completion_percent - a.completion_percent),
    archived_families: archivedFamilies.sort((a, b) => b.completion_percent - a.completion_percent),
    alerts: {
      over_quota: overQuota,
      under_quota: underQuota,
      significant_deviation: significantDeviation
    }
  };
}

/**
 * Génère un rapport textuel des métriques
 */
export function generateReport(metrics, options = {}) {
  const { verbose = false, colorize = true } = options;

  const colors = colorize ? {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
  } : {
    reset: '', bright: '', red: '', green: '', yellow: '', blue: '', cyan: ''
  };

  const lines = [];

  lines.push(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  lines.push(`${colors.cyan}RAPPORT D'ÉQUITÉ DE DISTRIBUTION${colors.reset}`);
  lines.push(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  lines.push(`${colors.bright}Distribution globale:${colors.reset}`);
  lines.push(`  Familles: ${metrics.global.total_families} (${metrics.global.active_families} actives, ${metrics.global.archived_families} archivées)`);
  lines.push(`  Semaines: ${metrics.global.total_weeks}`);
  lines.push(`  Affectations: ${metrics.global.total_affectations}`);
  lines.push(`  Moyenne par famille: ${metrics.global.avg_completion.toFixed(1)}%`);
  
  const stddevStatus = metrics.global.stddev_completion < 15 ? `${colors.green}[OK]${colors.reset}` : `${colors.red}[ALERTE]${colors.reset}`;
  lines.push(`  Écart-type: ${metrics.global.stddev_completion.toFixed(1)}% ${stddevStatus} (seuil < 15%)`);
  lines.push(`  Min/Max: ${metrics.global.min_completion.toFixed(1)}% / ${metrics.global.max_completion.toFixed(1)}%`);
  lines.push(`  Taux préférences: ${metrics.global.preference_rate.toFixed(1)}%\n`);

  // Alertes
  if (metrics.alerts.over_quota.length > 0 || metrics.alerts.under_quota.length > 0) {
    lines.push(`${colors.yellow}⚠️  Alertes:${colors.reset}`);
    
    if (metrics.alerts.over_quota.length > 0) {
      lines.push(`${colors.red}  Familles hors quota (${metrics.alerts.over_quota.length}):${colors.reset}`);
      metrics.alerts.over_quota.slice(0, 10).forEach(f => {
        lines.push(`    - ${f.nom}: ${f.current_assignments}/${f.nb_nettoyage} (${f.completion_percent.toFixed(1)}%)`);
      });
    }

    if (metrics.alerts.under_quota.length > 5 && verbose) {
      lines.push(`${colors.yellow}  Familles significativement en retard (${metrics.alerts.under_quota.length}):${colors.reset}`);
      metrics.alerts.under_quota
        .filter(f => f.completion_percent < 50)
        .slice(0, 10)
        .forEach(f => {
          lines.push(`    - ${f.nom}: ${f.current_assignments}/${f.nb_nettoyage} (${f.completion_percent.toFixed(1)}%)`);
        });
    }
    lines.push('');
  }

  // Top et bottom 5 (familles ACTIVES uniquement)
  const activeFamiliesSorted = metrics.active_families || metrics.families.filter(f => f.is_active);
  
  if (verbose) {
    lines.push(`${colors.bright}Top 5 familles actives (plus assignées):${colors.reset}`);
    activeFamiliesSorted.slice(0, 5).forEach((f, i) => {
      const prefRate = f.current_assignments > 0 ? (f.affectations_in_pref / f.current_assignments * 100).toFixed(0) : 0;
      lines.push(`  ${i + 1}. ${f.nom}: ${f.current_assignments}/${f.nb_nettoyage} (${f.completion_percent.toFixed(1)}%) - ${prefRate}% pref`);
    });
    lines.push('');

    lines.push(`${colors.bright}Bottom 5 familles actives (moins assignées):${colors.reset}`);
    activeFamiliesSorted.slice(-5).reverse().forEach((f, i) => {
      const prefRate = f.current_assignments > 0 ? (f.affectations_in_pref / f.current_assignments * 100).toFixed(0) : 0;
      lines.push(`  ${i + 1}. ${f.nom}: ${f.current_assignments}/${f.nb_nettoyage} (${f.completion_percent.toFixed(1)}%) - ${prefRate}% pref`);
    });
    lines.push('');

    // Tableau détaillé des familles ACTIVES
    lines.push(`${colors.bright}Détail complet - Familles actives (triées par % complétion):${colors.reset}`);
    lines.push(`${'─'.repeat(90)}`);
    lines.push(`${'Famille'.padEnd(30)} ${'Assigné'.padEnd(12)} ${'Quota'.padEnd(8)} ${'%'.padEnd(8)} ${'Préf'.padEnd(8)} ${'Statut'.padEnd(12)}`);
    lines.push(`${'─'.repeat(90)}`);
    
    activeFamiliesSorted.forEach(f => {
      const prefRate = f.current_assignments > 0 ? (f.affectations_in_pref / f.current_assignments * 100).toFixed(0) : 0;
      const nameTruncated = f.nom.length > 28 ? f.nom.substring(0, 27) + '…' : f.nom;
      const assigned = `${f.current_assignments}`.padEnd(12);
      const quota = `${f.nb_nettoyage}`.padEnd(8);
      const pct = `${f.completion_percent.toFixed(1)}%`.padEnd(8);
      const pref = `${prefRate}%`.padEnd(8);
      
      let status = '';
      let statusColor = colors.reset;
      if (f.current_assignments > f.nb_nettoyage) {
        status = 'HORS QUOTA';
        statusColor = colors.red;
      } else if (f.completion_percent >= 80) {
        status = 'OK';
        statusColor = colors.green;
      } else if (f.completion_percent >= 50) {
        status = 'EN COURS';
        statusColor = colors.yellow;
      } else {
        status = 'EN RETARD';
        statusColor = colors.yellow;
      }
      
      lines.push(`${nameTruncated.padEnd(30)} ${assigned} ${quota} ${pct} ${pref} ${statusColor}${status.padEnd(12)}${colors.reset}`);
    });
    
    lines.push(`${'─'.repeat(90)}`);
    lines.push('');
    
    // Tableau des familles archivées (si elles ont des affectations historiques)
    const archivedFamilies = metrics.archived_families || metrics.families.filter(f => !f.is_active);
    const archivedWithAssignments = archivedFamilies.filter(f => f.current_assignments > 0);
    
    if (archivedWithAssignments.length > 0) {
      lines.push(`${colors.bright}Familles archivées avec affectations historiques:${colors.reset}`);
      lines.push(`${'─'.repeat(90)}`);
      
      archivedWithAssignments.forEach(f => {
        const prefRate = f.current_assignments > 0 ? (f.affectations_in_pref / f.current_assignments * 100).toFixed(0) : 0;
        const nameTruncated = f.nom.length > 28 ? f.nom.substring(0, 27) + '…' : f.nom;
        const assigned = `${f.current_assignments}`.padEnd(12);
        const quota = `${f.nb_nettoyage}`.padEnd(8);
        const pct = `${f.completion_percent.toFixed(1)}%`.padEnd(8);
        const pref = `${prefRate}%`.padEnd(8);
        
        lines.push(`${nameTruncated.padEnd(30)} ${assigned} ${quota} ${pct} ${pref} ${colors.blue}${'ARCHIVÉE'.padEnd(12)}${colors.reset}`);
      });
      
      lines.push(`${'─'.repeat(90)}`);
      lines.push('');
    }
  }

  // Statistiques par groupe de nb_nettoyage (familles actives uniquement)
  const activeFamiliesForStats = metrics.active_families || metrics.families.filter(f => f.is_active);
  const groupedByQuota = new Map();
  activeFamiliesForStats.forEach(f => {
    if (!groupedByQuota.has(f.nb_nettoyage)) {
      groupedByQuota.set(f.nb_nettoyage, []);
    }
    groupedByQuota.get(f.nb_nettoyage).push(f);
  });

  if (groupedByQuota.size > 1) {
    lines.push(`${colors.bright}Statistiques par quota (nb_nettoyage):${colors.reset}`);
    Array.from(groupedByQuota.entries()).sort((a, b) => a[0] - b[0]).forEach(([quota, families]) => {
      const completions = families.map(f => f.completion_percent);
      const avgPct = mean(completions);
      const stddevPct = stddev(completions);
      lines.push(`  Quota ${quota}: ${families.length} familles, moyenne ${avgPct.toFixed(1)}%, écart-type ${stddevPct.toFixed(1)}%`);
    });
    lines.push('');
  }

  // Conclusion
  lines.push(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  if (metrics.global.stddev_completion < 15 && metrics.alerts.over_quota.length === 0) {
    lines.push(`${colors.green}✅ CONCLUSION: Distribution équilibrée${colors.reset}`);
  } else {
    lines.push(`${colors.yellow}⚠️  CONCLUSION: Déséquilibres détectés${colors.reset}`);
  }
  lines.push(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

  return lines.join('\n');
}

