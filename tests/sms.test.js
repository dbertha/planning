#!/usr/bin/env node

/**
 * Tests pour l'intégration SMS (Twilio et Spryng)
 * Teste les fonctionnalités d'envoi de SMS aux familles
 */

console.log('🧪 Tests SMS');
console.log('============');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Utilitaires de test
 */
class SMSTestRunner {
  constructor() {
    this.testCount = 0;
    this.passCount = 0;
    this.failCount = 0;
  }

  async test(name, testFn) {
    this.testCount++;
    console.log(`\n🧪 Test: ${name}`);
    
    try {
      await testFn();
      this.passCount++;
      console.log(`✅ PASS: ${name}`);
    } catch (error) {
      this.failCount++;
      console.log(`❌ FAIL: ${name}`);
      console.log(`   Erreur: ${error.message}`);
    }
  }

  summary() {
    console.log(`\n📊 Résultats des tests:`);
    console.log(`✅ Réussis: ${this.passCount}`);
    console.log(`❌ Échoués: ${this.failCount}`);
    console.log(`📈 Total: ${this.testCount}`);
    
    if (this.failCount === 0) {
      console.log(`\n🎉 Tous les tests sont passés !`);
      return true;
    } else {
      console.log(`\n❌ ${this.failCount} test(s) ont échoué.`);
      return false;
    }
  }
}

/**
 * Utilitaires pour les appels API
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...(options.body && { body: JSON.stringify(options.body) })
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // Certaines réponses peuvent ne pas être JSON
  }

  return {
    status: response.status,
    ok: response.ok,
    data
  };
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: attendu ${expected}, reçu ${actual}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Tests de configuration SMS
 */
async function testSMSConfiguration() {
  console.log('\n📱 Tests de Configuration SMS');
  console.log('=============================');

  const runner = new SMSTestRunner();

  // Variables de test
  let testPlanningToken = null;
  let testSessionToken = null;

  // Créer un planning de test
  await runner.test('Création d\'un planning de test pour SMS', async () => {
    const response = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning SMS Test',
          description: 'Planning pour tester les SMS',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'sms-test-' + Date.now()
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Création du planning devrait réussir');
    assert(response.data.planning.token, 'Token du planning devrait exister');
    
    testPlanningToken = response.data.planning.token;
    testSessionToken = response.data.sessionToken;
  });

  // Test de la configuration SMS
  await runner.test('Vérification de la configuration SMS', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'test_config'
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.config, 'Configuration SMS devrait être présente');
    assert(typeof response.data.config.enabled === 'boolean', 'enabled devrait être un booléen');
    assert(typeof response.data.config.testMode === 'boolean', 'testMode devrait être un booléen');
  });

  // Test des templates SMS
  await runner.test('Récupération des templates SMS', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      body: {
        token: testPlanningToken,
        action: 'get_templates'
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.templates, 'Templates devraient être présents');
    
    const templates = response.data.templates;
    assert(templates.affectation_rappel, 'Template affectation_rappel devrait exister');
    assert(templates.affectation_nouvelle, 'Template affectation_nouvelle devrait exister');
    assert(templates.personnalise, 'Template personnalise devrait exister');
    
    // Vérifier la structure d'un template
    const template = templates.affectation_rappel;
    assert(template.name, 'Template devrait avoir un nom');
    assert(template.template, 'Template devrait avoir un contenu');
  });

  return runner.summary();
}

/**
 * Tests d'envoi SMS (mode test)
 */
async function testSMSSending() {
  console.log('\n📤 Tests d\'Envoi SMS');
  console.log('====================');

  const runner = new SMSTestRunner();

  // Variables de test
  let testPlanningToken = null;
  let testSessionToken = null;
  let testFamilleId = null;
  let testSemaineId = null;

  // Setup: Créer un environnement de test complet
  await runner.test('Setup environnement de test SMS', async () => {
    // 1. Créer un planning
    const planningResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning SMS Envoi Test',
          description: 'Test complet envoi SMS',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'sms-envoi-test-' + Date.now()
        }
      }
    });

    assert(planningResponse.data.success, 'Création du planning devrait réussir');
    testPlanningToken = planningResponse.data.planning.token;
    testSessionToken = planningResponse.data.sessionToken;

    // 2. Créer une classe
    const classeResponse = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'classe',
        data: {
          id: 'TEST_SMS',
          nom: 'Classe Test SMS',
          couleur: '#ff0000',
          ordre: 1
        }
      }
    });

    assert(classeResponse.data.success, 'Création de la classe devrait réussir');

    // 3. Créer une semaine
    const semaineResponse = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'create_next_week',
        data: {}
      }
    });

    assert(semaineResponse.data.success, 'Création de la semaine devrait réussir');
    testSemaineId = semaineResponse.data.semaine.id;

    // 4. Créer une famille avec téléphone
    const familleResponse = await apiCall('/api/familles', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create',
        data: {
          nom: 'Famille Test SMS',
          email: 'test@example.com',
          telephone: '+33123456789', // Numéro de test
          nb_nettoyage: 3,
          classes_preferences: ['TEST_SMS'],
          notes: 'Famille créée pour tester les SMS'
        }
      }
    });

    assert(familleResponse.data.id, 'Création de la famille devrait réussir');
    testFamilleId = familleResponse.data.id;

    // 5. Créer une affectation
    const affectationResponse = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'affectation',
        data: {
          famille_id: testFamilleId,
          classe_id: 'TEST_SMS',
          semaine_id: testSemaineId
        }
      }
    });

    assert(affectationResponse.data.success, 'Création de l\'affectation devrait réussir');
  });

  // Test d'envoi SMS à une famille
  await runner.test('Envoi SMS à une famille (mode test)', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_to_famille',
        data: {
          famille_id: testFamilleId,
          template_key: 'affectation_rappel'
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Envoi SMS devrait réussir');
    assertEqual(response.data.sent, 1, 'Un SMS devrait être envoyé');
    assert(response.data.results.length > 0, 'Résultats devraient être présents');
    
    const result = response.data.results[0];
    assert(result.success, 'Résultat individuel devrait être un succès');
    assert(result.testMode, 'Devrait être en mode test');
  });

  // Test d'envoi SMS avec message personnalisé
  await runner.test('Envoi SMS avec message personnalisé', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_to_famille',
        data: {
          famille_id: testFamilleId,
          message_personnalise: 'Bonjour, ceci est un message de test pour {nom_famille}. Cordialement, {planning_name}'
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Envoi SMS personnalisé devrait réussir');
  });

  // Test d'envoi SMS aux affectations d'une semaine
  await runner.test('Envoi SMS aux affectations d\'une semaine', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_to_affectations',
        data: {
          semaine_id: testSemaineId,
          template_key: 'affectation_nouvelle'
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Envoi SMS aux affectations devrait réussir');
    assert(response.data.sent >= 1, 'Au moins un SMS devrait être envoyé');
  });

  // Test d'envoi en masse
  await runner.test('Envoi SMS en masse', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_bulk',
        data: {
          famille_ids: [testFamilleId],
          template_key: 'rappel_general'
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Envoi SMS en masse devrait réussir');
    assertEqual(response.data.sent, 1, 'Un SMS devrait être envoyé');
  });

  return runner.summary();
}

/**
 * Tests de validation et gestion d'erreurs
 */
async function testSMSValidation() {
  console.log('\n🛡️ Tests de Validation SMS');
  console.log('===========================');

  const runner = new SMSTestRunner();

  let testPlanningToken = null;
  let testSessionToken = null;

  // Setup simple
  await runner.test('Setup pour tests de validation', async () => {
    const response = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning SMS Validation',
          description: 'Test validation SMS',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'sms-validation-test-' + Date.now()
        }
      }
    });

    testPlanningToken = response.data.planning.token;
    testSessionToken = response.data.sessionToken;
  });

  // Test d'envoi sans permission admin
  await runner.test('Envoi SMS sans permission admin', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      body: {
        token: testPlanningToken,
        action: 'send_to_famille',
        data: {
          famille_id: 999,
          template_key: 'affectation_rappel'
        }
      }
    });

    // Devrait échouer car pas de session admin
    assertEqual(response.status, 401, 'Status devrait être 401 (non autorisé)');
  });

  // Test avec famille inexistante
  await runner.test('Envoi SMS à famille inexistante', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_to_famille',
        data: {
          famille_id: 99999,
          template_key: 'affectation_rappel'
        }
      }
    });

    assertEqual(response.status, 404, 'Status devrait être 404 (famille non trouvée)');
  });

  // Test avec template invalide
  await runner.test('Envoi SMS avec template inexistant', async () => {
    // Créer une famille de test d'abord
    const familleResponse = await apiCall('/api/familles', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create',
        data: {
          nom: 'Famille Validation Test',
          email: 'validation@test.com',
          telephone: '+33987654321',
          nb_nettoyage: 1
        }
      }
    });

    const familleId = familleResponse.data.id;

    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'send_to_famille',
        data: {
          famille_id: familleId,
          template_key: 'template_inexistant'
        }
      }
    });

    assertEqual(response.status, 500, 'Status devrait être 500 (erreur serveur)');
    assert(response.data.error, 'Message d\'erreur devrait être présent');
  });

  // Test avec token planning invalide
  await runner.test('Envoi SMS avec token planning invalide', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: 'token-inexistant',
        action: 'send_to_famille',
        data: {
          famille_id: 1,
          template_key: 'affectation_rappel'
        }
      }
    });

    assertEqual(response.status, 401, 'Status devrait être 401 (token invalide)');
  });

  return runner.summary();
}

/**
 * Test spécifique pour Twilio vers le numéro personnel
 */
async function testTwilioPersonalNumber() {
  console.log('\n🧪 Tests Twilio - Numéro personnel');
  console.log('===================================');
  
  const runner = new SMSTestRunner();
  
  await runner.test('Configuration Twilio', async () => {
    const response = await fetch(`${API_BASE_URL}/api/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test_config'
      })
    });
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Configuration Twilio échouée');
    }
    
    console.log(`📱 Provider: ${result.provider}`);
    console.log(`🔧 Mode test: ${result.testMode}`);
  });

  await runner.test('Connexion API Twilio', async () => {
    const response = await fetch(`${API_BASE_URL}/api/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test_connection'
      })
    });
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Connexion API Twilio échouée');
    }
    
    console.log(`🏢 Compte: ${result.account?.friendly_name || 'N/A'}`);
    console.log(`📊 Statut: ${result.account?.status || 'N/A'}`);
  });

  await runner.test('Envoi SMS vers numéro personnel (TEST MODE)', async () => {
    // Ce test envoie vers votre numéro en mode test (simulation sans SMS réel)
    const testNumber = process.env.TEST_PHONE_NUMBER || '0032497890341';
    
    const response = await fetch(`${API_BASE_URL}/api/sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'test-token', // Token factice pour le test
        action: 'send_to_famille',
        data: {
          famille_id: 'test',
          template_key: 'personnalise',
          message_personnalise: `Test Twilio depuis Planning App - ${new Date().toLocaleTimeString()}`,
          template_data: {
            nom_famille: 'Test',
            planning_name: 'Planning Test'
          },
          // Forcer l'envoi vers le numéro de test
          overridePhone: testNumber
        }
      })
    });
    
    const result = await response.json();
    
    // En mode test, on s'attend à une simulation réussie
    if (result.success && result.testMode) {
      console.log(`📱 SMS test simulé vers: ${result.to}`);
      console.log(`📝 Message: ${result.message}`);
      console.log(`🆔 ID: ${result.messageId}`);
    } else if (!result.testMode) {
      console.log(`⚠️ Attention: Test en mode PRODUCTION - SMS réellement envoyé !`);
      console.log(`📱 SMS envoyé vers: ${result.to}`);
      console.log(`🆔 ID: ${result.messageId}`);
    } else {
      throw new Error(result.error || 'Envoi SMS test échoué');
    }
  });

  return runner.summary();
}

/**
 * Point d'entrée principal
 */
async function runAllTests() {
  console.log('🚀 Démarrage des tests SMS...\n');
  
  const results = {
    configuration: false,
    sending: false,
    validation: false
  };

  // Exécuter les différentes suites de tests
  results.configuration = await testSMSConfiguration();
  results.sending = await testSMSSending();
  results.validation = await testSMSValidation();
  
  // Test spécifique Twilio si configuré
  if (process.env.SMS_PROVIDER === 'twilio') {
    results.twilio = await testTwilioPersonalNumber();
  }

  // Résumé global
  console.log('\n📊 Résumé des tests SMS:');
  console.log(`   Configuration: ${results.configuration ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Envoi SMS: ${results.sending ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Validation: ${results.validation ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  if (results.twilio !== undefined) {
    console.log(`   Test Twilio personnel: ${results.twilio ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  }

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n🎯 Résultat global: ${allPassed ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ONT ÉCHOUÉ'}`);
  
  return allPassed;
}

// Exécuter les tests si ce fichier est lancé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur lors de l\'exécution des tests SMS:', error);
    process.exit(1);
  });
}

export { runAllTests };

