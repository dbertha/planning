#!/usr/bin/env node

/**
 * Tests pour l'import des classes
 * Vérifie le téléchargement du template et l'import CSV
 */

// Utiliser fetch natif de Node.js 18+

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

let testToken = null;
let sessionToken = null;

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function createTestPlanning() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_planning',
        data: {
          name: 'Planning Test Import Classes',
          description: 'Test automatisé import classes',
          year: 2024,
          adminPassword: 'test123',
          customToken: `import-classes-test-${Date.now()}`
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

async function testDownloadTemplate() {
  try {
    log('📥 Test: Téléchargement du template CSV...', 'cyan');
    
    const response = await fetch(`${API_BASE_URL}/api/planning?token=${testToken}&type=classes_template`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const csvContent = await response.text();
    
    // Vérifier le contenu du template
    const lines = csvContent.split('\n');
    if (lines.length < 3) {
      throw new Error('Template doit contenir au moins 3 lignes (header + 2 exemples)');
    }

    const headers = lines[0].split(',');
    const expectedHeaders = ['id', 'nom', 'couleur', 'ordre', 'description'];
    
    for (const header of expectedHeaders) {
      if (!headers.includes(header)) {
        throw new Error(`Header manquant: ${header}`);
      }
    }

    // Vérifier les exemples
    const example1 = lines[1].split(',');
    if (example1.length !== expectedHeaders.length) {
      throw new Error('Exemple 1 a un nombre incorrect de colonnes');
    }

    log(`✅ Template téléchargé avec succès (${lines.length} lignes)`, 'green');
    log(`   Headers: ${headers.join(', ')}`, 'blue');
    return csvContent;
  } catch (error) {
    log(`❌ Erreur téléchargement template: ${error.message}`, 'red');
    return null;
  }
}

async function testImportClasses() {
  try {
    log('📊 Test: Import de classes via CSV...', 'cyan');
    
    // Données de test pour l'import
    const testClasses = [
      {
        id: 'TEST_A',
        nom: 'Test Salle A',
        couleur: '#ff0000',
        ordre: '1',
        description: 'Salle de test A'
      },
      {
        id: 'TEST_B',
        nom: 'Test Salle B',
        couleur: '#00ff00',
        ordre: '2',
        description: 'Salle de test B'
      },
      {
        id: 'TEST_C',
        nom: 'Test Salle C',
        couleur: '#0000ff',
        ordre: '3',
        description: 'Salle de test C'
      }
    ];

    const response = await fetch(`${API_BASE_URL}/api/planning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        type: 'import_classes',
        data: {
          classes: testClasses,
          filename: 'test_classes.csv'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    // Vérifier les résultats
    if (result.total_lines !== testClasses.length) {
      throw new Error(`Total incorrect: attendu ${testClasses.length}, reçu ${result.total_lines}`);
    }

    if (result.success !== testClasses.length) {
      throw new Error(`Succès incorrect: attendu ${testClasses.length}, reçu ${result.success}`);
    }

    if (result.errors !== 0) {
      throw new Error(`Erreurs inattendues: ${result.errors}`);
    }

    log(`✅ Import réussi: ${result.success}/${result.total_lines} classes`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur import classes: ${error.message}`, 'red');
    return false;
  }
}

async function testImportValidation() {
  try {
    log('🔍 Test: Validation des données d\'import...', 'cyan');
    
    // Données de test avec erreurs intentionnelles
    const invalidClasses = [
      {
        id: '', // ID vide (erreur)
        nom: 'Test Sans ID',
        couleur: '#ff0000',
        ordre: '1',
        description: 'Test'
      },
      {
        id: 'VALID_ID',
        nom: '', // Nom vide (erreur)
        couleur: '#00ff00',
        ordre: '2',
        description: 'Test'
      },
      {
        id: 'BAD_COLOR',
        nom: 'Test Couleur',
        couleur: 'rouge', // Couleur invalide (erreur)
        ordre: '3',
        description: 'Test'
      },
      {
        id: 'BAD_ORDER',
        nom: 'Test Ordre',
        couleur: '#0000ff',
        ordre: '200', // Ordre trop élevé (erreur)
        description: 'Test'
      },
      {
        id: 'TEST_A', // ID déjà existant (erreur)
        nom: 'Test Doublon',
        couleur: '#ffff00',
        ordre: '5',
        description: 'Test'
      }
    ];

    const response = await fetch(`${API_BASE_URL}/api/planning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': sessionToken
      },
      body: JSON.stringify({
        token: testToken,
        type: 'import_classes',
        data: {
          classes: invalidClasses,
          filename: 'test_invalid_classes.csv'
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    // Vérifier que toutes les lignes ont des erreurs
    if (result.errors !== invalidClasses.length) {
      throw new Error(`Erreurs attendues: ${invalidClasses.length}, reçues: ${result.errors}`);
    }

    if (result.success !== 0) {
      throw new Error(`Aucun succès attendu, reçu: ${result.success}`);
    }

    // Vérifier les détails des erreurs
    if (!result.error_details || result.error_details.length !== invalidClasses.length) {
      throw new Error('Détails des erreurs manquants ou incorrects');
    }

    log(`✅ Validation réussie: ${result.errors} erreurs détectées`, 'green');
    
    // Afficher les erreurs pour information
    result.error_details.forEach((error, index) => {
      log(`   Ligne ${error.ligne}: ${error.erreur}`, 'yellow');
    });
    
    return true;
  } catch (error) {
    log(`❌ Erreur test validation: ${error.message}`, 'red');
    return false;
  }
}

async function testClassesListing() {
  try {
    log('📋 Test: Vérification des classes créées...', 'cyan');
    
    const response = await fetch(`${API_BASE_URL}/api/planning?token=${testToken}&type=classes`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const classes = await response.json();
    
    // Vérifier que les classes importées sont présentes
    const expectedClasses = ['TEST_A', 'TEST_B', 'TEST_C'];
    const foundClasses = classes.map(c => c.id);
    
    for (const expectedId of expectedClasses) {
      if (!foundClasses.includes(expectedId)) {
        throw new Error(`Classe manquante: ${expectedId}`);
      }
    }

    // Vérifier les propriétés d'une classe
    const testClassA = classes.find(c => c.id === 'TEST_A');
    if (!testClassA) {
      throw new Error('Classe TEST_A non trouvée');
    }

    if (testClassA.nom !== 'Test Salle A') {
      throw new Error(`Nom incorrect: attendu 'Test Salle A', reçu '${testClassA.nom}'`);
    }

    if (testClassA.couleur !== '#ff0000') {
      throw new Error(`Couleur incorrecte: attendu '#ff0000', reçu '${testClassA.couleur}'`);
    }

    if (testClassA.ordre !== 1) {
      throw new Error(`Ordre incorrect: attendu 1, reçu ${testClassA.ordre}`);
    }

    log(`✅ ${classes.length} classes trouvées, données correctes`, 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur vérification classes: ${error.message}`, 'red');
    return false;
  }
}

async function runClassesImportTests() {
  log('🧪 Tests d\'Import des Classes', 'cyan');
  log('================================', 'cyan');
  log('🚀 Démarrage des tests d\'import des classes...\n', 'blue');

  let passed = 0;
  let failed = 0;

  // Test 1: Création du planning
  log('📋 Test 1: Création du planning de test');
  if (await createTestPlanning()) {
    passed++;
  } else {
    failed++;
    log('❌ Impossible de continuer sans planning', 'red');
    return { passed, failed };
  }

  // Test 2: Téléchargement du template
  log('\n📋 Test 2: Téléchargement du template CSV');
  if (await testDownloadTemplate()) {
    passed++;
  } else {
    failed++;
  }

  // Test 3: Import valide
  log('\n📋 Test 3: Import de classes valides');
  if (await testImportClasses()) {
    passed++;
  } else {
    failed++;
  }

  // Test 4: Validation des erreurs
  log('\n📋 Test 4: Validation des données invalides');
  if (await testImportValidation()) {
    passed++;
  } else {
    failed++;
  }

  // Test 5: Vérification des classes créées
  log('\n📋 Test 5: Vérification des classes dans la base');
  if (await testClassesListing()) {
    passed++;
  } else {
    failed++;
  }

  // Résumé
  log('\n📊 Résumé des tests d\'import des classes:', 'cyan');
  log(`   Template CSV: ${passed >= 2 ? '✅' : '❌'} ${passed >= 2 ? 'RÉUSSI' : 'ÉCHOUÉ'}`, passed >= 2 ? 'green' : 'red');
  log(`   Import valide: ${passed >= 3 ? '✅' : '❌'} ${passed >= 3 ? 'RÉUSSI' : 'ÉCHOUÉ'}`, passed >= 3 ? 'green' : 'red');
  log(`   Validation erreurs: ${passed >= 4 ? '✅' : '❌'} ${passed >= 4 ? 'RÉUSSI' : 'ÉCHOUÉ'}`, passed >= 4 ? 'green' : 'red');
  log(`   Vérification données: ${passed >= 5 ? '✅' : '❌'} ${passed >= 5 ? 'RÉUSSI' : 'ÉCHOUÉ'}`, passed >= 5 ? 'green' : 'red');

  log(`\n🎯 Résultat global: ${failed === 0 ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ÉCHOUÉS'}`, failed === 0 ? 'green' : 'red');

  return { passed, failed };
}

// Exporter pour utilisation dans la suite de tests
export { runClassesImportTests };

// Exécution si appelé directement
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1].endsWith('classes-import.test.js')) {
  runClassesImportTests()
    .then(({ passed, failed }) => {
      process.exit(failed > 0 ? 1 : 0);
    })
    .catch(error => {
      log(`💥 Erreur fatale: ${error.message}`, 'red');
      process.exit(1);
    });
}
