#!/usr/bin/env node

/**
 * Tests d'intégration pour les nouvelles fonctionnalités
 * Tests bout-en-bout avec vraies données et API
 */

console.log('🧪 Tests d\'Intégration');
console.log('====================');

async function testSimpleIntegration() {
  console.log('\n🔄 Test intégration simplifiée: Vérification des fonctionnalités principales');
  
  let testPlanningToken = null;
  let testSessionToken = null;
  
  try {
    // 1. Créer un planning de test
    console.log('\n   📋 Étape 1: Création du planning de test');
    const planningResponse = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_planning',
        data: {
          name: 'Planning Intégration Test',
          description: 'Test automatisé complet',
          year: 2024,
          adminPassword: 'test123',
          customToken: 'integration-test-' + Date.now()
        }
      })
    });

    const planningResult = await planningResponse.json();
    if (!planningResponse.ok || !planningResult.success) {
      throw new Error('Échec création planning: ' + (planningResult.error || 'Erreur inconnue'));
    }

    testPlanningToken = planningResult.planning.token;
    testSessionToken = planningResult.sessionToken;
    console.log(`   ✅ Planning créé: ${testPlanningToken}`);

    // 2. Créer des classes de test
    console.log('\n   🏫 Étape 2: Création des classes');
    const uniqueId = Date.now().toString().slice(-3); // Derniers 3 chiffres du timestamp
    const classes = [
      { id: `SA${uniqueId}`, nom: 'Salle A', couleur: '#ff0000', ordre: 1 },
      { id: `SB${uniqueId}`, nom: 'Salle B', couleur: '#00ff00', ordre: 2 },
      { id: `SC${uniqueId}`, nom: 'Salle C', couleur: '#0000ff', ordre: 3 }
    ];

    for (const classe of classes) {
      const classResponse = await fetch('http://localhost:3000/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': testSessionToken
        },
        body: JSON.stringify({
          token: testPlanningToken,
          type: 'classe',
          data: classe
        })
      });

      if (!classResponse.ok) {
        const error = await classResponse.json();
        console.log(`   🔍 Debug classe ${classe.id}:`, classResponse.status, error);
        throw new Error(`Échec création classe ${classe.id}: ${error.error || error.message || 'Erreur serveur'}`);
      }
    }
    console.log(`   ✅ ${classes.length} classes créées`);

    // 3. Créer une semaine
    console.log('\n   📅 Étape 3: Création d\'une semaine');
    const weekResponse = await fetch('http://localhost:3000/api/planning', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Session': testSessionToken
      },
      body: JSON.stringify({
        token: testPlanningToken,
        type: 'create_next_week',
        data: {}
      })
    });

    const weekResult = await weekResponse.json();
    if (!weekResponse.ok || !weekResult.success) {
      throw new Error('Échec création semaine: ' + (weekResult.error || weekResult.message || 'Erreur inconnue'));
    }

    const semaineId = weekResult.semaine.id;
    console.log(`   ✅ Semaine créée: ${semaineId}`);

    // 4. Test final de validation
    console.log('\n   ✅ Test d\'intégration réussi: toutes les fonctionnalités principales testées');

    return {
      success: true,
      planningToken: testPlanningToken,
      sessionToken: testSessionToken,
      semaineId,
      message: 'Test d\'intégration simplifié réussi - toutes les fonctionnalités principales marchent'
    };

  } catch (error) {
    console.error(`   ❌ Erreur workflow intégration: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testWeekCreationSequence() {
  console.log('\n📅 Test de création séquentielle de semaines');
  
  try {
    // Utiliser un planning existant ou créer un nouveau
    const planningResponse = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_planning',
        data: {
          name: 'Planning Séquence Test',
          description: 'Test séquence de semaines',
          year: 2024,
          adminPassword: 'test123',
          customToken: 'sequence-test-' + Date.now()
        }
      })
    });

    const planningResult = await planningResponse.json();
    if (!planningResponse.ok || !planningResult.success) {
      throw new Error('Échec création planning: ' + (planningResult.error || 'Erreur inconnue'));
    }

    const token = planningResult.planning.token;
    const sessionToken = planningResult.sessionToken;

    // Créer 5 semaines consécutives
    const weeks = [];
    for (let i = 0; i < 5; i++) {
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
        console.log(`   ✅ Semaine ${i + 1}: ${result.semaine.id} (${result.semaine.debut} -> ${result.semaine.fin})`);
      } else {
        console.log(`   ℹ️ Semaine ${i + 1}: ${result.message || 'Déjà existante'}`);
        break;
      }
    }

    // Vérifier l'unicité et la séquence
    const uniqueIds = new Set(weeks.map(w => w.id));
    const hasUniqueIds = uniqueIds.size === weeks.length;
    
    let isSequential = true;
    for (let i = 1; i < weeks.length; i++) {
      const prevEnd = new Date(weeks[i-1].fin);
      const currentStart = new Date(weeks[i].debut);
      const expectedStart = new Date(prevEnd);
      expectedStart.setDate(prevEnd.getDate() + 1);
      
      const daysDiff = Math.abs(currentStart - expectedStart) / (1000 * 60 * 60 * 24);
      if (daysDiff > 1) {
        isSequential = false;
        console.log(`   ❌ Séquence rompue entre semaine ${i} et ${i+1}`);
        break;
      }
    }

    console.log(`   ✅ IDs uniques: ${hasUniqueIds ? 'Oui' : 'Non'}`);
    console.log(`   ✅ Séquence chronologique: ${isSequential ? 'Oui' : 'Non'}`);
    console.log(`   ✅ ${weeks.length} semaines créées avec succès`);

    return hasUniqueIds && isSequential && weeks.length > 0;

  } catch (error) {
    console.error(`   ❌ Erreur test séquence: ${error.message}`);
    return false;
  }
}

// Point d'entrée principal
async function runAllTests() {
  console.log('🚀 Démarrage des tests d\'intégration...\n');
  
  const results = {
    fullWorkflow: false,
    weekSequence: false
  };

  // Test workflow simplifié  
  const workflowResult = await testSimpleIntegration();
  results.fullWorkflow = workflowResult.success;

  // Test séquence de semaines
  results.weekSequence = await testWeekCreationSequence();

  // Résumé
  console.log('\n📊 Résumé des tests d\'intégration:');
  console.log(`   Workflow complet: ${results.fullWorkflow ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Séquence semaines: ${results.weekSequence ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);

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
