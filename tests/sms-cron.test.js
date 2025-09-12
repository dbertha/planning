#!/usr/bin/env node

/**
 * Tests pour le système de SMS planifiés (CRON)
 * Teste les fonctionnalités d'exécution automatique des SMS avec codes clés
 */

console.log('🧪 Tests SMS CRON');
console.log('=================');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Utilitaires de test
 */
class SMSCronTestRunner {
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
 * Tests de création et gestion des SMS planifiés
 */
async function testScheduledSMSCreation() {
  console.log('\n📅 Tests de Création SMS Planifiés');
  console.log('===================================');

  const runner = new SMSCronTestRunner();

  // Variables de test
  let testPlanningToken = null;
  let testSessionToken = null;
  let testScheduledSMSId = null;

  // Setup: Créer un environnement de test
  await runner.test('Setup environnement de test SMS planifiés', async () => {
    // 1. Créer un planning
    const planningResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning SMS CRON Test',
          description: 'Test SMS planifiés avec codes clés',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'sms-cron-test-' + Date.now()
        }
      }
    });

    assert(planningResponse.data.success, 'Création du planning devrait réussir');
    testPlanningToken = planningResponse.data.planning.token;

    // Se connecter en tant qu'admin
    const loginResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'login',
        data: {
          token: testPlanningToken,
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
        }
      }
    });

    assertEqual(loginResponse.status, 200, 'Connexion admin devrait réussir');
    testSessionToken = loginResponse.data.sessionToken;

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
          id: 'CRON_TEST',
          nom: 'Classe CRON Test',
          couleur: '#ff0000',
          ordre: 1
        }
      }
    });

    assertEqual(classeResponse.status, 201, 'Status création classe devrait être 201');

    // 3. Créer une semaine avec codes clés
    const semaineResponse = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'semaine',
        data: {
          id: 'CRON_WEEK',
          debut: '2024-02-01',
          fin: '2024-02-07',
          type: 'nettoyage',
          description: 'Semaine CRON test',
          code_cles: 'Code CRON1, Code CRON2, Code CRON3',
          is_published: true
        }
      }
    });

    assertEqual(semaineResponse.status, 201, 'Status création semaine devrait être 201');
    assertEqual(semaineResponse.data.code_cles, 'Code CRON1, Code CRON2, Code CRON3', 'Codes clés devraient être sauvegardés');

    // 4. Créer une famille
    const familleResponse = await apiCall('/api/familles', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create',
        data: {
          nom: 'Famille CRON Test',
          email: 'cron@test.com',
          telephone: '+33123456789',
          nb_nettoyage: 3,
          classes_preferences: ['CRON_TEST']
        }
      }
    });

    assertEqual(familleResponse.status, 201, 'Status création famille devrait être 201');

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
          familleId: familleResponse.data.id,
          classeId: 'CRON_TEST',
          semaineId: 'CRON_WEEK'
        }
      }
    });

    assertEqual(affectationResponse.status, 201, 'Status création affectation devrait être 201');
  });

  // Test de création d'un SMS planifié
  await runner.test('Création d\'un SMS planifié avec codes clés', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create_scheduled_sms',
        data: {
          name: 'Test SMS CRON',
          description: 'SMS de test avec codes clés',
          message_template: 'Bonjour {nom_famille}, vous êtes affecté à {classe_nom} du {date_debut} au {date_fin}. Codes clés: {codes_cles}. Cordialement, {planning_name}',
          day_of_week: 1, // Lundi
          hour: 9,
          minute: 0,
          target_type: 'current_week'
        }
      }
    });

    assertEqual(response.status, 201, 'Status devrait être 201');
    assert(response.data.success, 'Création SMS planifié devrait réussir');
    assert(response.data.id, 'SMS planifié devrait avoir un ID');
    assertEqual(response.data.name, 'Test SMS CRON', 'Nom devrait correspondre');
    assertEqual(response.data.target_type, 'current_week', 'Type de cible devrait correspondre');
    
    testScheduledSMSId = response.data.id;
  });

  // Test de récupération des SMS planifiés
  await runner.test('Récupération des SMS planifiés', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'get_scheduled_sms'
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Récupération devrait réussir');
    assert(Array.isArray(response.data.scheduled_sms), 'Devrait retourner un tableau');
    assert(response.data.scheduled_sms.length > 0, 'Devrait contenir au moins un SMS planifié');
    
    const sms = response.data.scheduled_sms.find(s => s.id === testScheduledSMSId);
    assert(sms, 'SMS planifié créé devrait être présent');
    assertEqual(sms.name, 'Test SMS CRON', 'Nom devrait correspondre');
  });

  // Test de mise à jour d'un SMS planifié
  await runner.test('Mise à jour d\'un SMS planifié', async () => {
    const response = await apiCall('/api/sms', {
      method: 'PUT',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'update_scheduled_sms',
        data: {
          id: testScheduledSMSId,
          name: 'Test SMS CRON Modifié',
          message_template: 'Message modifié pour {nom_famille}. Codes: {codes_cles}',
          hour: 10
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Mise à jour devrait réussir');
    assertEqual(response.data.name, 'Test SMS CRON Modifié', 'Nom devrait être mis à jour');
    assertEqual(response.data.hour, 10, 'Heure devrait être mise à jour');
  });

  // Test de suppression d'un SMS planifié
  await runner.test('Suppression d\'un SMS planifié', async () => {
    const response = await apiCall('/api/sms', {
      method: 'DELETE',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'delete_scheduled_sms',
        data: {
          id: testScheduledSMSId
        }
      }
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Suppression devrait réussir');
  });

  return runner.summary();
}

/**
 * Tests d'exécution du CRON SMS
 */
async function testSMSCronExecution() {
  console.log('\n⏰ Tests d\'Exécution CRON SMS');
  console.log('==============================');

  const runner = new SMSCronTestRunner();

  // Variables de test
  let testPlanningToken = null;
  let testSessionToken = null;

  // Setup: Créer un environnement de test
  await runner.test('Setup environnement de test CRON', async () => {
    // 1. Créer un planning
    const planningResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning CRON Execution Test',
          description: 'Test exécution CRON SMS',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'cron-exec-test-' + Date.now()
        }
      }
    });

    assert(planningResponse.data.success, 'Création du planning devrait réussir');
    testPlanningToken = planningResponse.data.planning.token;

    // Se connecter en tant qu'admin
    const loginResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'login',
        data: {
          token: testPlanningToken,
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
        }
      }
    });

    assertEqual(loginResponse.status, 200, 'Connexion admin devrait réussir');
    testSessionToken = loginResponse.data.sessionToken;

    // 2. Créer une classe
    await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'classe',
        data: {
          id: 'CRON_EXEC',
          nom: 'Classe CRON Exec',
          couleur: '#00ff00',
          ordre: 1
        }
      }
    });

    // 3. Créer une semaine avec codes clés
    await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'semaine',
        data: {
          id: 'CRON_EXEC_WEEK',
          debut: '2024-02-01',
          fin: '2024-02-07',
          type: 'nettoyage',
          description: 'Semaine CRON exec test',
          code_cles: 'Code EXEC1, Code EXEC2',
          is_published: true
        }
      }
    });

    // 4. Créer une famille
    const familleResponse = await apiCall('/api/familles', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create',
        data: {
          nom: 'Famille CRON Exec',
          email: 'cron-exec@test.com',
          telephone: '+33987654321',
          nb_nettoyage: 2,
          classes_preferences: ['CRON_EXEC']
        }
      }
    });

    // 5. Créer une affectation
    await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        type: 'affectation',
        data: {
          familleId: familleResponse.data.id,
          classeId: 'CRON_EXEC',
          semaineId: 'CRON_EXEC_WEEK'
        }
      }
    });

    // 6. Créer un SMS planifié pour maintenant (pour test)
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create_scheduled_sms',
        data: {
          name: 'Test CRON Execution',
          description: 'SMS de test pour exécution CRON',
          message_template: 'Test CRON: {nom_famille} affecté à {classe_nom}. Codes: {codes_cles}',
          day_of_week: currentDay,
          hour: currentHour,
          minute: currentMinute,
          target_type: 'current_week'
        }
      }
    });
  });

  // Test d'exécution du CRON SMS
  await runner.test('Exécution du CRON SMS', async () => {
    const response = await apiCall('/api/sms-cron', {
      method: 'POST'
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Exécution CRON devrait réussir');
    
    // Vérifier que les SMS ont été traités
    if (response.data.executed > 0) {
      assert(response.data.results, 'Résultats devraient être présents');
      assert(Array.isArray(response.data.results), 'Résultats devraient être un tableau');
      
      // Vérifier qu'au moins un résultat contient les codes clés
      const hasCodesCles = response.data.results.some(result => 
        result.results && result.results.some(r => 
          r.message && r.message.includes('Code EXEC1, Code EXEC2')
        )
      );
      assert(hasCodesCles, 'Au moins un SMS devrait contenir les codes clés');
    }
  });

  // Test d'exécution CRON avec GET (pour compatibilité)
  await runner.test('Exécution CRON SMS avec GET', async () => {
    const response = await apiCall('/api/sms-cron', {
      method: 'GET'
    });

    assertEqual(response.status, 200, 'Status devrait être 200');
    assert(response.data.success, 'Exécution CRON GET devrait réussir');
  });

  return runner.summary();
}

/**
 * Tests de validation des variables dans les SMS planifiés
 */
async function testSMSVariableValidation() {
  console.log('\n🔍 Tests de Validation Variables SMS');
  console.log('====================================');

  const runner = new SMSCronTestRunner();

  // Variables de test
  let testPlanningToken = null;
  let testSessionToken = null;

  // Setup simple
  await runner.test('Setup pour tests de validation variables', async () => {
    const response = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning Variables Test',
          description: 'Test validation variables SMS',
          year: 2024,
          adminPassword: 'admin123',
          customToken: 'variables-test-' + Date.now()
        }
      }
    });

    testPlanningToken = response.data.planning.token;

    const loginResponse = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'login',
        data: {
          token: testPlanningToken,
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
        }
      }
    });

    assertEqual(loginResponse.status, 200, 'Connexion admin devrait réussir');
    testSessionToken = loginResponse.data.sessionToken;
  });

  // Test de création SMS avec toutes les variables
  await runner.test('Création SMS avec toutes les variables disponibles', async () => {
    const response = await apiCall('/api/sms', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testSessionToken
      },
      body: {
        token: testPlanningToken,
        action: 'create_scheduled_sms',
        data: {
          name: 'Test Variables Complètes',
          description: 'Test avec toutes les variables',
          message_template: 'Bonjour {nom_famille}, affectation {classe_nom} du {date_debut} au {date_fin}. Codes: {codes_cles}. Planning: {planning_name}',
          day_of_week: 1,
          hour: 8,
          minute: 30,
          target_type: 'all_active'
        }
      }
    });

    assertEqual(response.status, 201, 'Status devrait être 201');
    assert(response.data.success, 'Création SMS avec variables devrait réussir');
    assert(response.data.message_template.includes('{nom_famille}'), 'Template devrait contenir {nom_famille}');
    assert(response.data.message_template.includes('{classe_nom}'), 'Template devrait contenir {classe_nom}');
    assert(response.data.message_template.includes('{date_debut}'), 'Template devrait contenir {date_debut}');
    assert(response.data.message_template.includes('{date_fin}'), 'Template devrait contenir {date_fin}');
    assert(response.data.message_template.includes('{codes_cles}'), 'Template devrait contenir {codes_cles}');
    assert(response.data.message_template.includes('{planning_name}'), 'Template devrait contenir {planning_name}');
  });

  // Test de validation des types de cibles
  await runner.test('Validation des types de cibles SMS', async () => {
    const validTargetTypes = ['current_week', 'all_active'];
    
    for (const targetType of validTargetTypes) {
      const response = await apiCall('/api/sms', {
        method: 'POST',
        headers: {
          'X-Admin-Session': testSessionToken
        },
        body: {
          token: testPlanningToken,
          action: 'create_scheduled_sms',
          data: {
            name: `Test ${targetType}`,
            description: `Test type de cible ${targetType}`,
            message_template: 'Test {nom_famille} avec codes {codes_cles}',
            day_of_week: 2,
            hour: 9,
            minute: 0,
            target_type: targetType
          }
        }
      });

      assertEqual(response.status, 201, `Status devrait être 201 pour ${targetType}`);
      assert(response.data.success, `Création devrait réussir pour ${targetType}`);
      assertEqual(response.data.target_type, targetType, `Type de cible devrait être ${targetType}`);
    }
  });

  return runner.summary();
}

/**
 * Point d'entrée principal
 */
async function runAllTests() {
  console.log('🚀 Démarrage des tests SMS CRON...\n');
  
  const results = {
    creation: false,
    execution: false,
    validation: false
  };

  // Exécuter les différentes suites de tests
  results.creation = await testScheduledSMSCreation();
  results.execution = await testSMSCronExecution();
  results.validation = await testSMSVariableValidation();

  // Résumé global
  console.log('\n📊 Résumé des tests SMS CRON:');
  console.log(`   Création SMS planifiés: ${results.creation ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Exécution CRON: ${results.execution ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Validation variables: ${results.validation ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n🎯 Résultat global: ${allPassed ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ONT ÉCHOUÉ'}`);
  
  return allPassed;
}

// Exécuter les tests si ce fichier est lancé directement
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1].endsWith('sms-cron.test.js')) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur lors de l\'exécution des tests SMS CRON:', error);
    process.exit(1);
  });
}

export { runAllTests };
