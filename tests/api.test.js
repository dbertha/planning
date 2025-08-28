// Suite de tests pour les APIs
// Run avec: node tests/api.test.js

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async test(name, testFn) {
    console.log(`\n🧪 Test: ${name}`);
    try {
      await testFn();
      console.log(`✅ PASS: ${name}`);
      this.passed++;
    } catch (error) {
      console.log(`❌ FAIL: ${name}`);
      console.error(`   Error: ${error.message}`);
      this.failed++;
    }
  }

  summary() {
    console.log(`\n📊 Résultats des tests:`);
    console.log(`✅ Réussis: ${this.passed}`);
    console.log(`❌ Échoués: ${this.failed}`);
    console.log(`📈 Total: ${this.passed + this.failed}`);
    
    if (this.failed === 0) {
      console.log(`\n🎉 Tous les tests sont passés !`);
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) ont échoué.`);
    }
  }
}

// Utilitaires de test
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Auto-stringify le body si c'est un objet
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
    console.log(`🔧 DEBUG: Body stringified:`, body.substring(0, 100) + '...');
  }
  
  const fetchOptions = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: body
  };
  
  console.log(`🔧 DEBUG: Fetch options:`, {
    url,
    method: fetchOptions.method,
    headers: fetchOptions.headers,
    bodyType: typeof fetchOptions.body,
    bodyLength: fetchOptions.body?.length
  });

  const response = await fetch(url, fetchOptions);

  const data = await response.json();
  return { response, data, status: response.status };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} - Expected: ${expected}, Got: ${actual}`);
  }
}

// Variables globales pour les tests
let testPlanningToken = null;
let testAdminSession = null;
let testFamilleId = null;
let testClasseId = `T${Date.now().toString().slice(-8)}`;  // T + 8 derniers chiffres = 9 chars
let testSemaineId = `S${Date.now().toString().slice(-8)}`;  // S + 8 derniers chiffres = 9 chars

// Tests principaux
async function runTests() {
  const runner = new TestRunner();

  // Test 1: Création d'un planning de test
  await runner.test('Création d\'un planning de test', async () => {
    const { data, status } = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'create_planning',
        data: {
          name: 'Planning Test',
          description: 'Planning pour les tests automatisés',
          year: 2024,
          adminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
          customToken: `api-test-${Date.now()}`
        }
      }
    });

    assertEqual(status, 201, 'Status devrait être 201');
    assert(data.success, 'Création devrait réussir');
    assert(data.planning.token, 'Token devrait être généré');

    testPlanningToken = data.planning.token;
    console.log(`   Token planning: ${testPlanningToken.substring(0, 8)}...`);
  });

  // Test 2: Connexion en mode admin avec le planning
  await runner.test('Connexion admin avec planning', async () => {
    const { data, status } = await apiCall('/api/auth', {
      method: 'POST',
      body: {
        action: 'login',
        data: {
          token: testPlanningToken,
          password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
        }
      }
    });

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.success, 'Connexion devrait réussir');
    assert(data.sessionToken, 'Session admin devrait être créée');

    testAdminSession = data.sessionToken;
    console.log(`   Session admin créée: ${testAdminSession.substring(0, 8)}...`);
  });

  // Test 3: Vérification de la session admin
  await runner.test('Vérification session admin', async () => {
    const { data, status } = await apiCall(`/api/auth?action=check_session&session_token=${testAdminSession}`);

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.isAdmin, 'Devrait être admin');
    assertEqual(data.planning.token, testPlanningToken, 'Token planning devrait correspondre');
  });

  // Test 4: Accès planning sans authentification (mode public)
  await runner.test('Accès planning mode public', async () => {
    const { data, status } = await apiCall(`/api/planning?token=${testPlanningToken}&type=full`);

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.permissions, 'Permissions devraient être définies');
    assertEqual(data.permissions.isAdmin, false, 'Ne devrait pas être admin sans session');
    assertEqual(data.familles.length, 0, 'Familles ne devraient pas être visibles en mode public');
  });

  // Test 5: Création d'une classe
  await runner.test('Création d\'une classe', async () => {
    const { data, status } = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: {
        token: testPlanningToken,
        type: 'classe',
        data: {
          id: testClasseId,
          nom: 'Classe Test A',
          couleur: '#ff0000',
          ordre: 1,
          description: 'Classe de test'
        }
      }
    });

    assertEqual(status, 201, 'Status devrait être 201');
    assertEqual(data.id, testClasseId, 'ID classe devrait correspondre');
    assertEqual(data.nom, 'Classe Test A', 'Nom devrait correspondre');
  });

  // Test 6: Création d'une semaine
  await runner.test('Création d\'une semaine', async () => {
    const { data, status } = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: ({
        token: testPlanningToken,
        type: 'semaine',
        data: {
          id: testSemaineId,
          debut: '2024-02-01',
          fin: '2024-02-07',
          type: 'nettoyage',
          description: 'Semaine de test',
          is_published: false
        }
      })
    });

    assertEqual(status, 201, 'Status devrait être 201');
    assertEqual(data.id, testSemaineId, 'ID semaine devrait correspondre');
    assertEqual(data.is_published, false, 'Semaine ne devrait pas être publiée');
  });

  // Test 7: Création d'une famille
  await runner.test('Création d\'une famille', async () => {
    const { data, status } = await apiCall('/api/familles', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: ({
        token: testPlanningToken,
        action: 'create',
        data: {
          nom: 'Famille Test',
          email: 'test@example.com',
          telephone: '0123456789',
          nb_nettoyage: 3,
          classes_preferences: [testClasseId],
          notes: 'Famille pour les tests'
        }
      })
    });

    assertEqual(status, 201, 'Status devrait être 201');
    assert(data.id, 'ID famille devrait être généré');
    assertEqual(data.nom, 'Famille Test', 'Nom devrait correspondre');
    assertEqual(data.telephone, '0123456789', 'Téléphone devrait correspondre');

    testFamilleId = data.id;
    console.log(`   ID famille: ${testFamilleId}`);
  });

  // Test 8: Création d'une affectation
  await runner.test('Création d\'une affectation', async () => {
    const { data, status } = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: ({
        token: testPlanningToken,
        type: 'affectation',
        data: {
          familleId: testFamilleId,
          classeId: testClasseId,
          semaineId: testSemaineId,
          notes: 'Affectation de test'
        }
      })
    });

    assertEqual(status, 201, 'Status devrait être 201');
    assertEqual(data.famille_id, testFamilleId, 'ID famille devrait correspondre');
    assertEqual(data.classe_id, testClasseId, 'ID classe devrait correspondre');
    assertEqual(data.semaine_id, testSemaineId, 'ID semaine devrait correspondre');
  });

  // Test 8: Vérification contrainte unique (une famille par cellule)
  await runner.test('Test contrainte unique affectation', async () => {
    const { status } = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: ({
        token: testPlanningToken,
        type: 'affectation',
        data: {
          familleId: testFamilleId,
          classeId: testClasseId,
          semaineId: testSemaineId,
          notes: 'Affectation dupliquée'
        }
      })
    });

    assertEqual(status, 400, 'Status devrait être 400 (conflit)');
  });

  // Test 9: Publication d'une semaine
  await runner.test('Publication d\'une semaine', async () => {
    const { data, status } = await apiCall('/api/planning', {
      method: 'POST',
      headers: {
        'X-Admin-Session': testAdminSession
      },
      body: ({
        token: testPlanningToken,
        type: 'publish_semaine',
        data: {
          semaineId: testSemaineId,
          publish: true
        }
      })
    });

    assertEqual(status, 200, 'Status devrait être 200');
    assertEqual(data.is_published, true, 'Semaine devrait être publiée');
    assert(data.published_at, 'Date de publication devrait être définie');
  });

  // Test 10: Accès mode public après publication
  await runner.test('Accès mode public après publication', async () => {
    const { data, status } = await apiCall(`/api/planning?token=${testPlanningToken}&type=full`);

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.semaines.length > 0, 'Semaines publiées devraient être visibles');
    assert(data.affectations.length > 0, 'Affectations devraient être visibles');
    assertEqual(data.familles.length, 0, 'Familles ne devraient toujours pas être visibles');
    
    const semaine = data.semaines.find(s => s.id === testSemaineId);
    assert(semaine, 'Semaine publiée devrait être visible');
    assertEqual(semaine.is_published, true, 'Semaine devrait être marquée comme publiée');
  });

  // Test 11: Import CSV familles
  await runner.test('Template import familles', async () => {
    const { data, status } = await apiCall(`/api/familles?token=${testPlanningToken}&action=template`);

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.headers, 'Headers CSV devraient être définis');
    assert(data.example, 'Exemple CSV devrait être défini');
    assert(data.headers.includes('nom'), 'Header nom devrait être présent');
    assert(data.headers.includes('telephone'), 'Header telephone devrait être présent');
  });

  // Test 12: Statistiques
  await runner.test('Statistiques du planning', async () => {
    const { data, status } = await apiCall(`/api/planning?token=${testPlanningToken}&type=stats`, {
      headers: {
        'X-Admin-Session': testAdminSession
      }
    });

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.length > 0, 'Statistiques devraient être retournées');
    
    const stats = data[0];
    assert(stats.total_familles !== undefined, 'total_familles devrait être défini');
    assert(stats.total_classes !== undefined, 'total_classes devrait être défini');
    assert(stats.total_semaines !== undefined, 'total_semaines devrait être défini');
    assert(stats.total_affectations !== undefined, 'total_affectations devrait être défini');
  });

  // Test 13: Authentification incorrecte
  await runner.test('Test authentification incorrecte', async () => {
    const { status } = await apiCall('/api/auth', {
      method: 'POST',
      body: ({
        action: 'login',
        data: {
          token: testPlanningToken,
          password: 'mauvais_mot_de_passe'
        }
      })
    });

    assertEqual(status, 401, 'Status devrait être 401 (non autorisé)');
  });

  // Test 14: Accès sans permissions admin
  await runner.test('Test accès sans permissions admin', async () => {
    const { status } = await apiCall('/api/planning', {
      method: 'POST',
      body: ({
        token: testPlanningToken,
        type: 'classe',
        data: {
          id: 'UNAUTHORIZED',
          nom: 'Test non autorisé',
          couleur: '#000000'
        }
      })
    });

    assertEqual(status, 403, 'Status devrait être 403 (interdit)');
  });

  // Test 15: Token planning invalide
  await runner.test('Test token planning invalide', async () => {
    const { status } = await apiCall(`/api/planning?token=invalid_token&type=full`);

    assertEqual(status, 401, 'Status devrait être 401 (token invalide)');
  });

  // Test 16: Nettoyage (suppression du planning de test)
  await runner.test('Nettoyage - Déconnexion admin', async () => {
    const { data, status } = await apiCall('/api/auth', {
      method: 'DELETE',
      body: ({
        action: 'logout',
        data: {
          sessionToken: testAdminSession
        }
      })
    });

    assertEqual(status, 200, 'Status devrait être 200');
    assert(data.success, 'Déconnexion devrait réussir');
  });

  runner.summary();
  process.exit(runner.failed > 0 ? 1 : 0);
}

// Exécution des tests
// Toujours exécuter les tests
if (true) {
  console.log('🚀 Lancement de la suite de tests API\n');
  console.log(`📍 URL de base: ${API_BASE_URL}`);
  
  runTests().catch(error => {
    console.error('\n💥 Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  });
}

export { TestRunner, apiCall, assert, assertEqual }; 