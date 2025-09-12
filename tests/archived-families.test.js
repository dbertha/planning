/**
 * Tests pour vérifier que les familles archivées ne peuvent pas être utilisées pour l'assignation
 */

import { query, getAvailableFamiliesForCell, autoDistributeWeek } from '../api/db.js';

async function testArchivedFamiliesExclusion() {
  console.log('\n🧪 Test: Exclusion des familles archivées de l\'assignation');
  
  try {
    // Créer un planning de test
    const planningResult = await query(
      'INSERT INTO plannings (nom, token, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *',
      ['Test Archived Families', 'test-archived-families-' + Date.now()]
    );
    const planning = planningResult.rows[0];
    
    // Créer une classe de test
    const classeResult = await query(
      'INSERT INTO classes (planning_id, nom, ordre, couleur) VALUES ($1, $2, $3, $4) RETURNING *',
      [planning.id, 'Classe A', 1, '#ff0000']
    );
    const classe = classeResult.rows[0];
    
    // Créer une semaine de test
    const semaineResult = await query(
      'INSERT INTO semaines (planning_id, debut, fin, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [planning.id, '2024-01-15', '2024-01-21', 'Semaine test']
    );
    const semaine = semaineResult.rows[0];
    
    // Créer une famille active
    const familleActiveResult = await query(
      'INSERT INTO familles (planning_id, nom, telephone, nb_nettoyage, classes_preferences, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [planning.id, 'Famille Active', '0123456789', 4, [classe.id], true]
    );
    const familleActive = familleActiveResult.rows[0];
    
    // Créer une famille archivée
    const familleArchivedResult = await query(
      'INSERT INTO familles (planning_id, nom, telephone, nb_nettoyage, classes_preferences, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [planning.id, 'Famille Archivée', '0987654321', 4, [classe.id], false]
    );
    const familleArchived = familleArchivedResult.rows[0];
    
    console.log('   ✅ Données de test créées');
    
    // Test 1: getAvailableFamiliesForCell ne doit pas inclure la famille archivée
    console.log('\n   📋 Test 1: getAvailableFamiliesForCell');
    const availableFamilies = await getAvailableFamiliesForCell(classe.id, semaine.id, planning.id);
    
    const activeFamilyIncluded = availableFamilies.some(f => f.id === familleActive.id);
    const archivedFamilyIncluded = availableFamilies.some(f => f.id === familleArchived.id);
    
    console.log(`      Famille active incluse: ${activeFamilyIncluded ? '✅' : '❌'}`);
    console.log(`      Famille archivée incluse: ${archivedFamilyIncluded ? '❌ (PROBLÈME!)' : '✅'}`);
    
    if (!activeFamilyIncluded) {
      throw new Error('La famille active devrait être incluse dans les familles disponibles');
    }
    
    if (archivedFamilyIncluded) {
      throw new Error('La famille archivée ne devrait PAS être incluse dans les familles disponibles');
    }
    
    // Test 2: autoDistributeWeek ne doit pas utiliser la famille archivée
    console.log('\n   📋 Test 2: autoDistributeWeek');
    const distributionResult = await autoDistributeWeek(semaine.id, planning.id);
    
    console.log(`      Distribution réussie: ${distributionResult.success ? '✅' : '❌'}`);
    console.log(`      Affectations créées: ${distributionResult.affectations_created}`);
    
    if (distributionResult.success && distributionResult.affectations_created > 0) {
      // Vérifier que l'affectation créée n'est pas pour la famille archivée
      const affectationsResult = await query(
        'SELECT a.*, f.nom as famille_nom, f.is_active FROM affectations a JOIN familles f ON a.famille_id = f.id WHERE a.planning_id = $1 AND a.semaine_id = $2',
        [planning.id, semaine.id]
      );
      
      const archivedFamilyAssigned = affectationsResult.rows.some(a => a.famille_id === familleArchived.id);
      console.log(`      Famille archivée assignée: ${archivedFamilyAssigned ? '❌ (PROBLÈME!)' : '✅'}`);
      
      if (archivedFamilyAssigned) {
        throw new Error('La famille archivée ne devrait PAS être assignée par l\'algorithme automatique');
      }
    }
    
    // Test 3: Vérifier que les requêtes directes excluent les familles archivées
    console.log('\n   📋 Test 3: Requêtes directes');
    
    // Test famillesQueries.getById
    const { famillesQueries } = await import('../api/queries.js');
    const familleByIdResult = await famillesQueries.getById(familleArchived.id, planning.id);
    const archivedFamilyFound = familleByIdResult.rows.length > 0;
    console.log(`      getById trouve famille archivée: ${archivedFamilyFound ? '❌ (PROBLÈME!)' : '✅'}`);
    
    if (archivedFamilyFound) {
      throw new Error('getById ne devrait pas trouver la famille archivée');
    }
    
    // Test famillesQueries.getByIds
    const familleByIdsResult = await famillesQueries.getByIds([familleActive.id, familleArchived.id], planning.id);
    const onlyActiveFamilyFound = familleByIdsResult.rows.length === 1 && familleByIdsResult.rows[0].id === familleActive.id;
    console.log(`      getByIds ne trouve que famille active: ${onlyActiveFamilyFound ? '✅' : '❌'}`);
    
    if (!onlyActiveFamilyFound) {
      throw new Error('getByIds ne devrait trouver que la famille active');
    }
    
    console.log('\n   ✅ Tous les tests d\'exclusion des familles archivées ont réussi !');
    
    // Nettoyage
    await query('DELETE FROM affectations WHERE planning_id = $1', [planning.id]);
    await query('DELETE FROM familles WHERE planning_id = $1', [planning.id]);
    await query('DELETE FROM classes WHERE planning_id = $1', [planning.id]);
    await query('DELETE FROM semaines WHERE planning_id = $1', [planning.id]);
    await query('DELETE FROM plannings WHERE id = $1', [planning.id]);
    
    console.log('   🧹 Données de test nettoyées');
    
  } catch (error) {
    console.error('   ❌ Erreur lors du test:', error.message);
    throw error;
  }
}

// Exécuter le test si ce fichier est appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  testArchivedFamiliesExclusion()
    .then(() => {
      console.log('\n🎉 Test terminé avec succès !');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test échoué:', error.message);
      process.exit(1);
    });
}

export { testArchivedFamiliesExclusion };
