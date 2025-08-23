// Tests pour les contraintes d'exclusion des familles
// Créons nos propres tokens de test

const API_BASE = 'http://localhost:3000';

// Fonction utilitaire pour appeler l'API
async function apiCall(endpoint, method = 'GET', body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
}

export async function runExclusionsTests() {
  console.log('\n🚫 ========== TESTS DES EXCLUSIONS ==========');
  
  let testToken = null;
  let adminSessionToken = null;
  let testFamilleId = null;
  let testClasseId = null;
  let testSemaineId = null;
  let testExclusionId = null;

  try {
    // ========== 0. CRÉATION D'UN PLANNING DE TEST ==========
    console.log('\n0️⃣ Création d\'un planning de test...');
    
    const planningResponse = await apiCall('/api/auth', 'POST', {
      action: 'create_planning',
      data: {
        name: 'Planning Test Exclusions',
        description: 'Planning pour tester les exclusions',
        adminPassword: 'admin123'
      }
    });
    
    testToken = planningResponse.token;
    adminSessionToken = planningResponse.adminSession;
    console.log(`✅ Planning créé (Token: ${testToken.substring(0, 10)}...)`);

    // ========== 1. CRÉATION DES DONNÉES DE TEST ==========
    console.log('\n1️⃣ Création des données de test...');
    
    // Créer une famille de test
    const familleResponse = await apiCall('/api/familles', 'POST', {
      token: testToken,
      nom: 'Famille Test Exclusions',
      telephone: '0123456789',
      email: 'test.exclusions@example.com',
      nb_nettoyage: 3,
      classes_preferences: [],
      notes: 'Famille créée pour tester les exclusions'
    }, {
      'X-Admin-Session': adminSessionToken
    });

    testFamilleId = familleResponse.id;
    console.log(`✅ Famille de test créée (ID: ${testFamilleId})`);

    // Créer une classe de test
    const classeResponse = await apiCall('/api/planning', 'POST', {
      token: testToken,
      type: 'classe',
      data: {
        id: `TE${Date.now().toString().slice(-6)}`,
        nom: 'Classe Test Exclusions',
        couleur: '#FF6B6B',
        ordre: 99,
        description: 'Classe pour tester les exclusions'
      }
    }, {
      'X-Admin-Session': adminSessionToken
    });

    testClasseId = classeResponse.id;
    console.log(`✅ Classe de test créée (ID: ${testClasseId})`);

    // Créer une semaine de test
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + 7); // Semaine prochaine
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const semaineResponse = await apiCall('/api/planning', 'POST', {
      token: testToken,
      type: 'semaine',
      data: {
        id: `TE${Date.now().toString().slice(-6)}`,
        debut: weekStart.toISOString().split('T')[0],
        fin: weekEnd.toISOString().split('T')[0],
        type: 'normale',
        description: 'Semaine test exclusions',
        is_published: true
      }
    }, {
      'X-Admin-Session': adminSessionToken
    });

    testSemaineId = semaineResponse.id;
    console.log(`✅ Semaine de test créée (ID: ${testSemaineId})`);

    // ========== 2. TESTS D'AFFECTATION SANS EXCLUSION ==========
    console.log('\n2️⃣ Test d\'affectation normale (sans exclusion)...');
    
    const affectationSansExclusion = await apiCall('/api/planning', 'POST', {
      token: testToken,
      type: 'affectation',
      data: {
        familleId: testFamilleId,
        classeId: testClasseId,
        semaineId: testSemaineId
      }
    }, {
      'X-Admin-Session': adminSessionToken
    });

    console.log('✅ Affectation créée avec succès sans exclusion');

    // Supprimer l'affectation pour les tests suivants
    await apiCall(`/api/planning/${affectationSansExclusion.id}`, 'DELETE', {
      token: testToken
    }, {
      'X-Admin-Session': adminSessionToken
    });

    console.log('✅ Affectation supprimée pour nettoyer');

    // ========== 3. CRÉATION D'UNE EXCLUSION ==========
    console.log('\n3️⃣ Création d\'une exclusion couvrant la semaine de test...');
    
    const exclusionStart = new Date(weekStart);
    exclusionStart.setDate(weekStart.getDate() - 1); // Commence 1 jour avant
    const exclusionEnd = new Date(weekEnd);
    exclusionEnd.setDate(weekEnd.getDate() + 1); // Finit 1 jour après

    const exclusionResponse = await apiCall('/api/familles', 'POST', {
      token: testToken,
      action: 'add_exclusion',
      famille_id: testFamilleId,
      date_debut: exclusionStart.toISOString().split('T')[0],
      date_fin: exclusionEnd.toISOString().split('T')[0],
      type: 'vacances',
      notes: 'Test d\'exclusion automatique'
    }, {
      'X-Admin-Session': adminSessionToken
    });

    testExclusionId = exclusionResponse.id;
    console.log(`✅ Exclusion créée (ID: ${testExclusionId})`);

    // ========== 4. TEST D'AFFECTATION BLOQUÉE ==========
    console.log('\n4️⃣ Test d\'affectation bloquée par exclusion...');
    
    try {
      await apiCall('/api/planning', 'POST', {
        token: testToken,
        type: 'affectation',
        data: {
          familleId: testFamilleId,
          classeId: testClasseId,
          semaineId: testSemaineId
        }
      }, {
        'X-Admin-Session': adminSessionToken
      });

      console.log('❌ ERREUR : L\'affectation aurait dû être bloquée !');
      return false;
    } catch (error) {
      if (error.message.includes('contrainte d\'exclusion')) {
        console.log('✅ Affectation correctement bloquée par l\'exclusion');
      } else {
        console.log(`❌ Erreur inattendue : ${error.message}`);
        return false;
      }
    }

    // ========== 5. VÉRIFICATION DES FAMILLES DISPONIBLES ==========
    console.log('\n5️⃣ Vérification des familles disponibles...');
    
    const famillesDisponibles = await apiCall(
      `/api/planning?token=${testToken}&type=available_families&classeId=${testClasseId}&semaineId=${testSemaineId}`,
      'GET'
    );

    const familleTestDisponible = famillesDisponibles.find(f => f.id === testFamilleId);
    
    if (familleTestDisponible) {
      console.log('❌ ERREUR : La famille avec exclusion ne devrait pas être disponible !');
      return false;
    } else {
      console.log('✅ Famille correctement exclue de la liste des disponibles');
    }

    // ========== 6. TEST DE RÉCUPÉRATION DES EXCLUSIONS ==========
    console.log('\n6️⃣ Test de récupération des exclusions...');
    
    const exclusions = await apiCall(
      `/api/familles?token=${testToken}&action=get_exclusions&famille_id=${testFamilleId}`,
      'GET'
    );

    if (exclusions.length === 1 && exclusions[0].id === testExclusionId) {
      console.log('✅ Exclusions récupérées correctement');
    } else {
      console.log(`❌ ERREUR : Exclusions incorrectes. Attendu: 1, reçu: ${exclusions.length}`);
      return false;
    }

    // ========== 7. TEST DE SUPPRESSION D'EXCLUSION ==========
    console.log('\n7️⃣ Test de suppression d\'exclusion...');
    
    await apiCall(`/api/familles/${testExclusionId}`, 'DELETE', {
      token: testToken,
      action: 'delete_exclusion'
    }, {
      'X-Admin-Session': adminSessionToken
    });

    console.log('✅ Exclusion supprimée');

    // ========== 8. VÉRIFICATION APRÈS SUPPRESSION ==========
    console.log('\n8️⃣ Vérification que l\'affectation est maintenant possible...');
    
    const affectationApres = await apiCall('/api/planning', 'POST', {
      token: testToken,
      type: 'affectation',
      data: {
        familleId: testFamilleId,
        classeId: testClasseId,
        semaineId: testSemaineId
      }
    }, {
      'X-Admin-Session': adminSessionToken
    });

    console.log('✅ Affectation créée avec succès après suppression de l\'exclusion');

    // ========== 9. NETTOYAGE ==========
    console.log('\n9️⃣ Nettoyage des données de test...');
    
    // Supprimer l'affectation
    await apiCall(`/api/planning/${affectationApres.id}`, 'DELETE', {
      token: testToken
    }, {
      'X-Admin-Session': adminSessionToken
    });

    // Supprimer la famille
    await apiCall(`/api/familles/${testFamilleId}`, 'DELETE', {
      token: testToken
    }, {
      'X-Admin-Session': adminSessionToken
    });

    console.log('✅ Données de test nettoyées');

    console.log('\n🎉 ========== TOUS LES TESTS D\'EXCLUSIONS RÉUSSIS ==========');
    return true;

  } catch (error) {
    console.error(`❌ Erreur dans les tests d'exclusions : ${error.message}`);
    
    // Nettoyage en cas d'erreur
    try {
      if (testExclusionId) {
        await apiCall(`/api/familles/${testExclusionId}`, 'DELETE', {
          token: testToken,
          action: 'delete_exclusion'
        }, {
          'X-Admin-Session': adminSessionToken
        });
      }
      if (testFamilleId) {
        await apiCall(`/api/familles/${testFamilleId}`, 'DELETE', {
          token: testToken
        }, {
          'X-Admin-Session': adminSessionToken
        });
      }
    } catch (cleanupError) {
      console.error('Erreur de nettoyage:', cleanupError.message);
    }
    
    return false;
  }
}

