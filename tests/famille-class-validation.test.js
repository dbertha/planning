#!/usr/bin/env node

/**
 * Tests pour la validation des classes_preferences lors de l'import/création de familles
 */

const API_BASE_URL = 'http://localhost:3000';

let testToken = null;
let sessionToken = null;
let testClassIds = [];

function log(message, color = 'white') {
  const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  };
  console.log(`${colors[color]}${message}\x1b[0m`);
}

async function createTestPlanning() {
  try {
    const uniqueId = Date.now();
    const response = await fetch(`${API_BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_planning',
        data: {
          name: 'Planning Test Validation Classes',
          description: 'Test validation classes_preferences',
          year: 2024,
          adminPassword: 'admin123',
          customToken: `class-validation-test-${uniqueId}`
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    testToken = result.planning.token;
    sessionToken = result.sessionToken;
    
    log(`✅ Planning créé: ${testToken}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création planning: ${error.message}`, 'red');
    return false;
  }
}

async function createTestClasses() {
  try {
    // Générer des IDs uniques pour éviter les conflits
    const uniqueId = Date.now().toString().slice(-4);
    
    // Créer quelques classes de test
    const classes = [
      { id: `SALLE_A_${uniqueId}`, nom: 'Salle A Test', couleur: '#ff0000', ordre: 1 },
      { id: `SALLE_B_${uniqueId}`, nom: 'Salle B Test', couleur: '#00ff00', ordre: 2 },
      { id: `SALLE_C_${uniqueId}`, nom: 'Salle C Test', couleur: '#0000ff', ordre: 3 }
    ];

    for (const classe of classes) {
      const response = await fetch(`${API_BASE_URL}/api/planning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token: testToken,
          type: 'classe',
          data: classe
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur création classe ${classe.id}: HTTP ${response.status}`);
      }
    }

    // Stocker les IDs des classes créées pour les tests suivants
    testClassIds = classes.map(c => c.id);
    
    log(`✅ 3 classes créées: ${testClassIds.join(', ')}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création classes: ${error.message}`, 'red');
    return false;
  }
}

async function testValidClassPreferences() {
  try {
    log('📋 Test: Famille avec classes préférées valides', 'cyan');
    
    const response = await fetch(`${API_BASE_URL}/api/familles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        action: 'create',
        data: {
          nom: 'Famille Test Valide',
          email: 'test@email.com',
          telephone: '0123456789',
          nb_nettoyage: 3,
          classes_preferences: [testClassIds[0], testClassIds[2]], // Premier et troisième
          notes: 'Famille avec préférences valides'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const result = await response.json();
    log(`✅ Famille créée avec préférences valides: ${result.nom}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur test préférences valides: ${error.message}`, 'red');
    return false;
  }
}

async function testInvalidClassPreferences() {
  try {
    log('📋 Test: Famille avec classes préférées invalides', 'cyan');
    
    const response = await fetch(`${API_BASE_URL}/api/familles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        action: 'create',
        data: {
          nom: 'Famille Test Invalide',
          email: 'test@email.com',
          telephone: '0123456789',
          nb_nettoyage: 3,
          classes_preferences: [testClassIds[0], 'SALLE_X', 'SALLE_Y'], // SALLE_X et SALLE_Y n'existent pas
          notes: 'Famille avec préférences invalides'
        }
      })
    });

    if (response.ok) {
      throw new Error('La création aurait dû échouer avec des classes invalides');
    }

    const error = await response.json();
    if (!error.error.includes("n'existe pas dans ce planning")) {
      throw new Error(`Message d'erreur inattendu: ${error.error}`);
    }

    log(`✅ Validation réussie: ${error.error}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur test préférences invalides: ${error.message}`, 'red');
    return false;
  }
}

async function testImportWithInvalidClasses() {
  try {
    log('📋 Test: Import de familles avec classes invalides', 'cyan');
    
    const famillesData = [
      {
        nom: 'Famille Import Valide',
        email: 'valid@email.com',
        telephone: '0123456789',
        nb_nettoyage: 3,
        classes_preferences: `${testClassIds[0]},${testClassIds[1]}`, // Valide
        notes: 'Import valide'
      },
      {
        nom: 'Famille Import Invalide',
        email: 'invalid@email.com',
        telephone: '0987654321',
        nb_nettoyage: 2,
        classes_preferences: `${testClassIds[0]},SALLE_Z`, // SALLE_Z n'existe pas
        notes: 'Import invalide'
      }
    ];

    const response = await fetch(`${API_BASE_URL}/api/familles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        action: 'import',
        data: {
          familles: famillesData,
          filename: 'test_validation_classes.csv'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    
    // Vérifier les résultats
    if (result.success !== 1) {
      throw new Error(`Attendu 1 succès, reçu ${result.success}`);
    }
    
    if (result.errors !== 1) {
      throw new Error(`Attendu 1 erreur, reçu ${result.errors}`);
    }

    // Vérifier que l'erreur concerne bien la classe invalide
    const errorDetail = result.error_details.find(e => 
      e.erreur.includes("SALLE_Z") && e.erreur.includes("n'existe pas")
    );
    
    if (!errorDetail) {
      throw new Error('Erreur de validation de classe non trouvée dans les détails');
    }

    log(`✅ Import avec validation: ${result.success} succès, ${result.errors} erreurs`, 'green');
    log(`   Erreur détectée: ${errorDetail.erreur}`, 'yellow');
    return true;
  } catch (error) {
    log(`❌ Erreur test import validation: ${error.message}`, 'red');
    return false;
  }
}

async function testMixedValidInvalidClasses() {
  try {
    log('📋 Test: Famille avec mix de classes valides/invalides', 'cyan');
    
    const response = await fetch(`${API_BASE_URL}/api/familles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        action: 'create',
        data: {
          nom: 'Famille Test Mix',
          email: 'mix@email.com',
          telephone: '0123456789',
          nb_nettoyage: 3,
          classes_preferences: [testClassIds[0], 'SALLE_INEXISTANTE', testClassIds[1]], // Mix valide/invalide
          notes: 'Mix de préférences'
        }
      })
    });

    if (response.ok) {
      throw new Error('La création aurait dû échouer à cause de SALLE_INEXISTANTE');
    }

    const error = await response.json();
    if (!error.error.includes('SALLE_INEXISTANTE') || !error.error.includes("n'existe pas")) {
      throw new Error(`Message d'erreur inattendu: ${error.error}`);
    }

    log(`✅ Validation mix réussie: première classe invalide détectée`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur test mix classes: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('🧪 Tests de Validation Classes Préférées', 'cyan');
  log('========================================', 'cyan');
  log('🚀 Démarrage des tests de validation...\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Test 1: Création du planning et des classes
  log('📋 Test 1: Préparation (planning + classes de test)');
  if (await createTestPlanning() && await createTestClasses()) {
    passed++;
  } else {
    failed++;
    log('❌ Impossible de continuer sans planning/classes', 'red');
    return { passed, failed };
  }

  // Test 2: Classes préférées valides
  log('\n📋 Test 2: Famille avec classes préférées valides');
  if (await testValidClassPreferences()) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Classes préférées invalides
  log('\n📋 Test 3: Famille avec classes préférées invalides');
  if (await testInvalidClassPreferences()) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Import avec classes invalides
  log('\n📋 Test 4: Import de familles avec validation classes');
  if (await testImportWithInvalidClasses()) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: Mix de classes valides/invalides
  log('\n📋 Test 5: Mix de classes valides/invalides');
  if (await testMixedValidInvalidClasses()) {
    passed++;
  } else {
    failed++;
  }

  // Résumé
  log('\n📊 Résumé des tests de validation classes:', 'cyan');
  log(`   Préparation: ✅ RÉUSSI`, 'green');
  log(`   Classes valides: ${passed >= 2 ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`, passed >= 2 ? 'green' : 'red');
  log(`   Classes invalides: ${passed >= 3 ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`, passed >= 3 ? 'green' : 'red');
  log(`   Import validation: ${passed >= 4 ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`, passed >= 4 ? 'green' : 'red');
  log(`   Mix validation: ${passed >= 5 ? '✅ RÉUSSI' : '❌ ÉCHOUÉ'}`, passed >= 5 ? 'green' : 'red');

  const success = failed === 0;
  log(`\n🎯 Résultat global: ${success ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ÉCHOUÉS'}`, success ? 'green' : 'red');
  
  return { passed, failed };
}

// Exécuter les tests si appelé directement
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMainModule) {
  runTests().then(result => {
    process.exit(result.failed > 0 ? 1 : 0);
  });
}

export { runTests };
