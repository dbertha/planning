#!/usr/bin/env node

// Script principal pour exécuter tous les tests
// Usage: node tests/run-all-tests.js [--api-only] [--components-only] [--help]

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Détection intelligente du port selon l'environnement
  API_BASE_URL: process.env.API_BASE_URL || detectApiBaseUrl(),
  TIMEOUT: 300000, // 5 minutes
  CONCURRENT: false // Tests séquentiels pour éviter les conflits
};

// Détection automatique de l'URL de base selon l'environnement
function detectApiBaseUrl() {
  // 1. Variable d'environnement explicite
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // 2. En production/preview Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3. Développement local
  // - vercel dev : http://localhost:3000 (recommandé)
  // - vite dev + vercel dev séparé : http://localhost:5173 avec proxy vers 3000
  
  // Par défaut, on assume vercel dev (approche recommandée)
  return 'http://localhost:3000';
}

// Couleurs pour l'affichage
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function logSection(title) {
  const line = '='.repeat(60);
  log(`\n${line}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log(line, 'cyan');
}

function logSubsection(title) {
  log(`\n${'-'.repeat(40)}`, 'blue');
  log(`  ${title}`, 'blue');
  log('-'.repeat(40), 'blue');
}

// Vérification des prérequis
async function checkPrerequisites() {
  logSection('🔍 VÉRIFICATION DES PRÉREQUIS');

  const checks = [
    {
      name: 'Node.js version',
      check: () => {
        const version = process.version;
        const major = parseInt(version.split('.')[0].substring(1));
        return major >= 18;
      },
      fix: 'Installer Node.js 18 ou plus récent'
    },
    {
      name: 'Fichiers de test',
      check: () => {
        const testFiles = [
          'tests/api.test.js',
          'tests/components.test.js'
        ];
        return testFiles.every(file => fs.existsSync(file));
      },
      fix: 'Vérifier que tous les fichiers de test existent'
    },
    {
      name: 'Variables d\'environnement',
      check: () => {
        return process.env.DATABASE_URL || fs.existsSync('env.local');
      },
      fix: 'Configurer DATABASE_URL ou créer env.local'
    },
    {
      name: 'API disponible',
      check: async () => {
        try {
          const response = await fetch(`${CONFIG.API_BASE_URL}/health`);
          return response.status === 200;
        } catch (error) {
          return false;
        }
      },
      fix: `Démarrer le serveur sur ${CONFIG.API_BASE_URL}`
    }
  ];

  let allPassed = true;

  for (const check of checks) {
    try {
      const passed = await check.check();
      if (passed) {
        log(`✅ ${check.name}`, 'green');
      } else {
        log(`❌ ${check.name} - ${check.fix}`, 'red');
        allPassed = false;
      }
    } catch (error) {
      log(`❌ ${check.name} - Erreur: ${error.message}`, 'red');
      allPassed = false;
    }
  }

  if (!allPassed) {
    log('\n❌ Certains prérequis ne sont pas satisfaits.', 'red');
    return false;
  }

  log('\n✅ Tous les prérequis sont satisfaits !', 'green');
  return true;
}

// Exécution d'un test
function runTest(testFile, description) {
  return new Promise((resolve, reject) => {
    logSubsection(`🧪 ${description}`);
    
    const testPath = path.resolve(__dirname, testFile);
    const child = spawn('node', [testPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        API_BASE_URL: CONFIG.API_BASE_URL,
        NODE_ENV: 'test'
      }
    });

    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`Test ${testFile} timeout après ${CONFIG.TIMEOUT / 1000}s`));
    }, CONFIG.TIMEOUT);

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        log(`✅ ${description} - RÉUSSI`, 'green');
        resolve(true);
      } else {
        log(`❌ ${description} - ÉCHOUÉ (code: ${code})`, 'red');
        resolve(false);
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      log(`❌ ${description} - ERREUR: ${error.message}`, 'red');
      resolve(false);
    });
  });
}

// Tests de performance
async function runPerformanceTests() {
  logSubsection('⚡ Tests de performance');

  const performanceTests = [
    {
      name: 'Temps de réponse API',
      test: async () => {
        const start = Date.now();
        try {
          await fetch(`${CONFIG.API_BASE_URL}/api/auth?action=planning_info&token=test`);
          const duration = Date.now() - start;
          log(`   Temps de réponse: ${duration}ms`, duration < 1000 ? 'green' : 'yellow');
          return duration < 2000; // Acceptable si < 2s
        } catch (error) {
          log(`   Erreur: ${error.message}`, 'red');
          return false;
        }
      }
    },
    {
      name: 'Mémoire utilisée',
      test: async () => {
        const memUsage = process.memoryUsage();
        const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        log(`   Mémoire heap: ${heapUsedMB}MB`, heapUsedMB < 100 ? 'green' : 'yellow');
        return heapUsedMB < 200; // Acceptable si < 200MB
      }
    }
  ];

  let allPassed = true;
  for (const test of performanceTests) {
    try {
      const passed = await test.test();
      if (passed) {
        log(`✅ ${test.name}`, 'green');
      } else {
        log(`⚠️ ${test.name} - Performance dégradée`, 'yellow');
      }
    } catch (error) {
      log(`❌ ${test.name} - Erreur: ${error.message}`, 'red');
      allPassed = false;
    }
  }

  return allPassed;
}

// Génération du rapport
function generateReport(results) {
  logSection('📊 RAPPORT DE TESTS');

  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;
  const successRate = Math.round((passedTests / totalTests) * 100);

  log(`📈 Tests exécutés: ${totalTests}`);
  log(`✅ Réussis: ${passedTests}`, 'green');
  log(`❌ Échoués: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`🎯 Taux de réussite: ${successRate}%`, successRate >= 80 ? 'green' : 'red');

  if (failedTests > 0) {
    log('\n❌ Tests échoués:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`   • ${r.name}`, 'red');
    });
  }

  // Recommandations
  log('\n💡 Recommandations:', 'yellow');
  if (successRate < 80) {
    log('   • Corriger les tests échoués avant le déploiement', 'yellow');
  }
  if (failedTests === 0) {
    log('   • Tous les tests passent - prêt pour le déploiement! 🚀', 'green');
  }

  // Sauvegarde du rapport
  const reportData = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    results,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      successRate
    }
  };

  try {
    fs.writeFileSync('tests/last-test-report.json', JSON.stringify(reportData, null, 2));
    log('\n📄 Rapport sauvegardé dans tests/last-test-report.json', 'blue');
  } catch (error) {
    log(`⚠️ Impossible de sauvegarder le rapport: ${error.message}`, 'yellow');
  }

  return successRate >= 80;
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const options = {
    apiOnly: args.includes('--api-only'),
    componentsOnly: args.includes('--components-only'),
    help: args.includes('--help') || args.includes('-h'),
    skipPrerequisites: args.includes('--skip-prereq')
  };

  if (options.help) {
    console.log(`
🧪 Suite de tests Planning Nettoyage

Usage: node tests/run-all-tests.js [options]

Options:
  --api-only         Exécuter seulement les tests API
  --components-only  Exécuter seulement les tests de composants
  --skip-prereq      Ignorer la vérification des prérequis
  --help, -h         Afficher cette aide

Variables d'environnement:
  API_BASE_URL       URL de base de l'API (défaut: http://localhost:3000)
  DATABASE_URL       URL de connexion PostgreSQL

Exemples:
  node tests/run-all-tests.js                    # Tous les tests
  node tests/run-all-tests.js --api-only         # Tests API seulement
  API_BASE_URL=https://myapp.vercel.app node tests/run-all-tests.js
    `);
    process.exit(0);
  }

  log(colorize('🚀 SUITE DE TESTS PLANNING NETTOYAGE', 'bright'));
  log(`📍 URL API: ${CONFIG.API_BASE_URL}`);
  log(`⏱️  Timeout: ${CONFIG.TIMEOUT / 1000}s`);

  // Vérification des prérequis
  if (!options.skipPrerequisites) {
    const prereqsOk = await checkPrerequisites();
    if (!prereqsOk) {
      log('\n❌ Arrêt des tests en raison de prérequis non satisfaits.', 'red');
      process.exit(1);
    }
  }

  // Définition des tests à exécuter
  const testSuites = [];
  
  if (!options.componentsOnly) {
    testSuites.push({
      name: 'Tests API',
      file: 'api.test.js',
      description: 'Tests des APIs REST (auth, planning, familles)'
    });
  }
  
  if (!options.apiOnly) {
    testSuites.push({
      name: 'Tests Composants',
      file: 'components.test.js',
      description: 'Tests de la logique des composants React'
    });
  }

  // Exécution des tests
  logSection('🏃 EXÉCUTION DES TESTS');
  
  const results = [];
  const startTime = Date.now();

  for (const suite of testSuites) {
    try {
      const success = await runTest(suite.file, suite.description);
      results.push({
        name: suite.name,
        success,
        duration: Date.now() - startTime
      });
    } catch (error) {
      log(`❌ Erreur lors de l'exécution de ${suite.name}: ${error.message}`, 'red');
      results.push({
        name: suite.name,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      });
    }
  }

  // Tests de performance (optionnels)
  if (!options.apiOnly && !options.componentsOnly) {
    const perfSuccess = await runPerformanceTests();
    results.push({
      name: 'Tests Performance',
      success: perfSuccess,
      duration: Date.now() - startTime
    });
  }

  // Génération du rapport final
  const overallSuccess = generateReport(results);
  
  const totalDuration = Date.now() - startTime;
  log(`\n⏱️ Durée totale: ${Math.round(totalDuration / 1000)}s`, 'blue');
  
  if (overallSuccess) {
    log('\n🎉 TOUS LES TESTS SONT PASSÉS! 🎉', 'green');
    process.exit(0);
  } else {
    log('\n💥 CERTAINS TESTS ONT ÉCHOUÉ', 'red');
    process.exit(1);
  }
}

// Gestion des erreurs globales
process.on('uncaughtException', (error) => {
  log(`💥 Erreur non gérée: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  log(`💥 Promesse rejetée: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

// Point d'entrée
// Toujours exécuter les tests
if (true) {
  main().catch(error => {
    log(`💥 Erreur fatale: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

export { main, runTest, checkPrerequisites }; 