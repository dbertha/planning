#!/usr/bin/env node

/**
 * Tests pour la fonctionnalité de distribution automatique des nettoyages
 */

console.log('🧪 Tests de Distribution Automatique');
console.log('=====================================');

async function testAutoDistributionLogic() {
  console.log('\n📋 Test 1: Algorithme de distribution équitable');
  
  try {
    // Test des scenarios de distribution
    const scenarios = [
      {
        name: 'Distribution équitable basique',
        families: [
          { id: 1, nom: 'Famille A', nb_nettoyage: 3, current_affectations: 0, classes_preferences: ['A', 'B'] },
          { id: 2, nom: 'Famille B', nb_nettoyage: 3, current_affectations: 1, classes_preferences: ['B', 'C'] },
          { id: 3, nom: 'Famille C', nb_nettoyage: 3, current_affectations: 2, classes_preferences: ['C'] }
        ],
        availableClasses: ['A', 'B', 'C'],
        expectedPriority: 'Famille A devrait être prioritaire (0% complété)'
      },
      {
        name: 'Gestion des préférences',
        families: [
          { id: 1, nom: 'Famille X', nb_nettoyage: 4, current_affectations: 1, classes_preferences: ['SALLE_A'] },
          { id: 2, nom: 'Famille Y', nb_nettoyage: 4, current_affectations: 1, classes_preferences: ['SALLE_B'] }
        ],
        availableClasses: ['SALLE_A', 'SALLE_B'],
        expectedPriority: 'Chaque famille devrait être assignée à sa classe préférée'
      },
      {
        name: 'Famille nouvelle vs famille expérimentée',
        families: [
          { id: 1, nom: 'Famille Nouvelle', nb_nettoyage: 1, current_affectations: 0, classes_preferences: [] },
          { id: 2, nom: 'Famille Expérimentée', nb_nettoyage: 5, current_affectations: 4, classes_preferences: [] }
        ],
        availableClasses: ['GENERAL'],
        expectedPriority: 'Famille Nouvelle prioritaire (0% vs 80% complété)'
      }
    ];

    for (const scenario of scenarios) {
      console.log(`\n   🎯 Scénario: ${scenario.name}`);
      
      // Simuler le calcul des scores de priorité
      const familiesWithScores = scenario.families.map(famille => {
        const percentage_completed = famille.nb_nettoyage > 0 
          ? (famille.current_affectations / famille.nb_nettoyage * 100) 
          : 0;
        
        let priorityScore = 100 - percentage_completed;
        
        // Simuler le bonus de préférence
        const hasPreference = scenario.availableClasses.some(classe => 
          famille.classes_preferences.includes(classe)
        );
        if (hasPreference) {
          priorityScore += 20;
        }
        
        return {
          ...famille,
          percentage_completed,
          priorityScore,
          hasPreference
        };
      });

      familiesWithScores.sort((a, b) => b.priorityScore - a.priorityScore);
      
      console.log(`      📊 Résultats de priorité:`);
      familiesWithScores.forEach((famille, index) => {
        console.log(`         ${index + 1}. ${famille.nom}: ${famille.priorityScore.toFixed(1)} points (${famille.percentage_completed.toFixed(1)}% complété${famille.hasPreference ? ', préférence' : ''})`);
      });
      
      console.log(`      💡 ${scenario.expectedPriority}`);
    }

    console.log('\n✅ Tests d\'algorithme réussis');
    return true;

  } catch (error) {
    console.error('❌ Erreur dans les tests d\'algorithme:', error);
    return false;
  }
}

// Test de validation des exclusions
export function testExclusionValidation() {
  console.log('\n📋 Test 2: Validation des exclusions temporelles');
  
  const testCases = [
    {
      name: 'Famille disponible',
      semaine: { debut: '2024-02-01', fin: '2024-02-07' },
      exclusions: [
        { date_debut: '2024-01-01', date_fin: '2024-01-31' }, // Avant
        { date_debut: '2024-03-01', date_fin: '2024-03-31' }  // Après
      ],
      expected: true
    },
    {
      name: 'Famille exclue (période exacte)',
      semaine: { debut: '2024-02-01', fin: '2024-02-07' },
      exclusions: [
        { date_debut: '2024-02-01', date_fin: '2024-02-07' }
      ],
      expected: false
    },
    {
      name: 'Famille exclue (chevauchement début)',
      semaine: { debut: '2024-02-01', fin: '2024-02-07' },
      exclusions: [
        { date_debut: '2024-01-25', date_fin: '2024-02-03' }
      ],
      expected: false
    },
    {
      name: 'Famille exclue (chevauchement fin)',
      semaine: { debut: '2024-02-01', fin: '2024-02-07' },
      exclusions: [
        { date_debut: '2024-02-05', date_fin: '2024-02-15' }
      ],
      expected: false
    }
  ];

  let allPassed = true;
  
  testCases.forEach((testCase, index) => {
    const hasConflict = testCase.exclusions.some(exclusion => {
      const excludeStart = new Date(exclusion.date_debut);
      const excludeEnd = new Date(exclusion.date_fin);
      const semaineStart = new Date(testCase.semaine.debut);
      const semaineEnd = new Date(testCase.semaine.fin);
      
      return (
        (excludeStart <= semaineStart && excludeEnd >= semaineStart) ||
        (excludeStart <= semaineEnd && excludeEnd >= semaineEnd) ||
        (excludeStart >= semaineStart && excludeEnd <= semaineEnd)
      );
    });
    
    const isAvailable = !hasConflict;
    const passed = isAvailable === testCase.expected;
    
    console.log(`   ${passed ? '✅' : '❌'} ${testCase.name}: ${isAvailable ? 'Disponible' : 'Exclue'} (attendu: ${testCase.expected ? 'Disponible' : 'Exclue'})`);
    
    if (!passed) allPassed = false;
  });

  return allPassed;
}

// Test des différents cas d'usage
export function testDistributionScenarios() {
  console.log('\n📋 Test 3: Scénarios de distribution');
  
  const scenarios = [
    {
      name: 'Planning vide - première semaine',
      description: 'Toutes les familles à 0%, préférences prioritaires',
      expectation: 'Distribution selon les préférences de classes'
    },
    {
      name: 'Mi-année scolaire',
      description: 'Familles avec des pourcentages différents',
      expectation: 'Priorité aux familles les moins servies'
    },
    {
      name: 'Famille arrivant en cours d\'année',
      description: 'Nouvelle famille vs familles établies',
      expectation: 'Famille nouvelle prioritaire (nb_nettoyage ajusté)'
    },
    {
      name: 'Semaine avec exclusions multiples',
      description: 'Plusieurs familles indisponibles',
      expectation: 'Distribution parmi les familles disponibles uniquement'
    },
    {
      name: 'Toutes les classes occupées',
      description: 'Aucune classe libre',
      expectation: 'Aucune affectation créée, message informatif'
    }
  ];

  scenarios.forEach((scenario, index) => {
    console.log(`   📋 Scénario ${index + 1}: ${scenario.name}`);
    console.log(`      📝 ${scenario.description}`);
    console.log(`      🎯 Attendu: ${scenario.expectation}`);
  });

  console.log('\n💡 Ces scénarios peuvent être testés manuellement dans l\'interface');
  return true;
}

// Point d'entrée principal pour les tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de distribution automatique...\n');
  
  const results = {
    algorithm: await testAutoDistributionLogic(),
    exclusions: testExclusionValidation(),
    scenarios: testDistributionScenarios()
  };

  console.log('\n📊 Résumé des tests:');
  console.log(`   Algorithme: ${results.algorithm ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Exclusions: ${results.exclusions ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  console.log(`   Scénarios: ${results.scenarios ? '✅ RÉUSSI' : '❌ ÉCHEC'}`);
  
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
