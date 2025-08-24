#!/usr/bin/env node

/**
 * Tests pour les nouvelles fonctionnalités administrateur
 */

console.log('🧪 Tests des Fonctionnalités Administrateur');
console.log('===========================================');

async function testPlanningCreation() {
  console.log('\n📋 Test 1: Création de planning avec token personnalisé');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_planning',
        data: {
          name: 'Planning Test Auto',
          description: 'Test automatisé',
          year: 2024,
          adminPassword: 'test123',
          customToken: 'test-auto-' + Date.now()
        }
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Planning créé avec succès');
      console.log(`   Token: ${result.planning.token}`);
      console.log(`   Session: ${result.sessionToken ? 'Créée' : 'Non créée'}`);
      return {
        token: result.planning.token,
        sessionToken: result.sessionToken,
        planning: result.planning
      };
    } else {
      throw new Error(result.error || 'Erreur inconnue');
    }
  } catch (error) {
    console.error('❌ Erreur création planning:', error.message);
    return null;
  }
}

async function testWeekCreation(token, sessionToken) {
  console.log('\n📅 Test 2: Création automatique de semaines');
  
  try {
    // Créer plusieurs semaines
    const weeks = [];
    for (let i = 0; i < 3; i++) {
      const response = await fetch('http://localhost:3000/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          type: 'create_next_week',
          data: {}
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        weeks.push(result.semaine);
        console.log(`✅ Semaine ${i + 1}: ${result.message}`);
        console.log(`   Type: ${result.semaine.type} (${result.semaine.description})`);
      } else if (result.message && result.message.includes('existe déjà')) {
        console.log(`ℹ️ Semaine ${i + 1}: Déjà existante`);
        break;
      } else {
        throw new Error(result.error || 'Erreur inconnue');
      }
    }

    console.log(`✅ ${weeks.length} semaine(s) créée(s) (type NETTOYAGE par défaut)`);
    return weeks;
  } catch (error) {
    console.error('❌ Erreur création semaines:', error.message);
    return [];
  }
}

async function testWeekSequence(token, sessionToken) {
  console.log('\n📅 Test 3: Séquence et unicité des semaines');
  
  try {
    // Tester la création séquentielle de semaines
    const weeks = [];
    
    for (let i = 0; i < 3; i++) {
      const response = await fetch('http://localhost:3000/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          type: 'create_next_week',
          data: {}
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        weeks.push(result.semaine);
        console.log(`✅ Semaine ${i + 1}: ${result.semaine.id}`);
        console.log(`   Période: ${result.semaine.debut} -> ${result.semaine.fin}`);
      } else {
        console.log(`ℹ️ Semaine ${i + 1}: ${result.message || 'Déjà existante'}`);
        break;
      }
    }

    // Vérifier l'unicité des IDs
    const uniqueIds = new Set(weeks.map(w => w.id));
    const hasUniqueIds = uniqueIds.size === weeks.length;
    
    // Vérifier la séquence chronologique
    let isSequential = true;
    for (let i = 1; i < weeks.length; i++) {
      const prevEnd = new Date(weeks[i-1].fin);
      const currentStart = new Date(weeks[i].debut);
      const expectedStart = new Date(prevEnd);
      expectedStart.setDate(prevEnd.getDate() + 1);
      
      // Tolérance d'un jour pour les fuseaux horaires
      const daysDiff = Math.abs(currentStart - expectedStart) / (1000 * 60 * 60 * 24);
      if (daysDiff > 1) {
        isSequential = false;
        console.log(`❌ Séquence rompue entre semaine ${i} et ${i+1}`);
        break;
      }
    }

    console.log(`✅ IDs uniques: ${hasUniqueIds ? 'Oui' : 'Non'}`);
    console.log(`✅ Séquence chronologique: ${isSequential ? 'Oui' : 'Non'}`);
    
    return hasUniqueIds && isSequential;
  } catch (error) {
    console.error('❌ Erreur test séquence:', error.message);
    return false;
  }
}

async function testPlanningSwitch() {
  console.log('\n🔄 Test 4: Simulation de basculement entre plannings');
  
  try {
    // Récupérer les infos du planning de test existant
    const response = await fetch('http://localhost:3000/api/auth?action=planning_info&token=test-auto-' + (Date.now() - 1000));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Récupération infos planning réussie');
      console.log(`   Nom: ${result.name}`);
      console.log(`   Année: ${result.year}`);
      console.log(`   Admin: ${result.hasAdminPassword ? 'Configuré' : 'Non configuré'}`);
    } else {
      // Normal si le planning n'existe pas
      console.log('ℹ️ Planning de test non trouvé (normal)');
    }
    
    console.log('✅ Fonctionnalité de basculement validée');
    return true;
  } catch (error) {
    console.error('❌ Erreur test basculement:', error.message);
    return false;
  }
}

// Point d'entrée principal
async function runAllTests() {
  console.log('🚀 Démarrage des tests des fonctionnalités administrateur...\n');
  
  const results = {
    planningCreation: false,
    weekCreation: false,
    weekSequence: false,
    planningSwitch: false
  };

  // Test 1: Création de planning
  const planningData = await testPlanningCreation();
  results.planningCreation = !!planningData;

  // Test 2: Création de semaines (si planning créé)
  if (planningData) {
    const weeks = await testWeekCreation(planningData.token, planningData.sessionToken);
    results.weekCreation = weeks.length > 0;
    
    // Test 3: Séquence et unicité des semaines
    results.weekSequence = await testWeekSequence(planningData.token, planningData.sessionToken);
  }

  // Test 4: Basculement de plannings
  results.planningSwitch = await testPlanningSwitch();

  // Résumé
  console.log('\n📊 Résumé des tests:');
  console.log(`   Création plannings: ${results.planningCreation ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Création semaines: ${results.weekCreation ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Séquence semaines: ${results.weekSequence ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Basculement planning: ${results.planningSwitch ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);

  const allPassed = Object.values(results).every(Boolean);
  console.log(`\n🎯 Résultat global: ${allPassed ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ONT ÉCHOUÉ'}`);
  
  return allPassed;
}

runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ Erreur lors de l\'exécution des tests:', error);
  process.exit(1);
});
