// Suite de tests pour les composants React
// Tests simulés (sans DOM réel) pour valider la logique

import { TestRunner, assert, assertEqual } from './api.test.js';

// Mock des hooks React
const mockUseState = (initialValue) => {
  let value = initialValue;
  const setValue = (newValue) => {
    value = typeof newValue === 'function' ? newValue(value) : newValue;
  };
  return [value, setValue];
};

const mockUseEffect = (fn, deps) => {
  // Simulation simplifiée - execute immédiatement
  if (!deps || deps.length === 0) {
    fn();
  }
};

// Mock des données de test
const mockPlanningData = {
  planning: {
    name: 'Planning Test',
    description: 'Planning de test',
    year: 2024,
    token: 'test_token'
  },
  classes: [
    { id: 'A', nom: 'Classe A', couleur: '#ff0000', ordre: 1 },
    { id: 'B', nom: 'Classe B', couleur: '#00ff00', ordre: 2 }
  ],
  semaines: [
    { id: '2024-01-15', debut: '2024-01-15', fin: '2024-01-21', type: 'nettoyage', is_published: true },
    { id: '2024-01-22', debut: '2024-01-22', fin: '2024-01-28', type: 'nettoyage', is_published: false }
  ],
  familles: [
    { id: 1, nom: 'Famille A', telephone: '0123456789', classes_preferences: ['A'] },
    { id: 2, nom: 'Famille B', telephone: '0987654321', classes_preferences: ['B'] }
  ],
  affectations: [
    { id: 1, familleId: 1, classeId: 'A', semaineId: '2024-01-15', familleNom: 'Famille A' }
  ],
  permissions: {
    isAdmin: false,
    canEdit: false
  }
};

const mockAdminData = {
  ...mockPlanningData,
  permissions: {
    isAdmin: true,
    canEdit: true
  }
};

// Tests des utilitaires
function testDateUtils() {
  console.log('\n📅 Tests des utilitaires de date');
  
  // Simulation des fonctions dateUtils
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };
  
  const isDateInRange = (date, start, end) => {
    const d = new Date(date);
    const s = new Date(start);
    const e = new Date(end);
    return d >= s && d <= e;
  };
  
  // Tests
  assert(formatDate('2024-01-15') === '15/01/2024', 'formatDate devrait formater correctement');
  assert(isDateInRange('2024-01-16', '2024-01-15', '2024-01-21'), 'Date devrait être dans la plage');
  assert(!isDateInRange('2024-01-10', '2024-01-15', '2024-01-21'), 'Date ne devrait pas être dans la plage');
  
  console.log('✅ Tests dateUtils passés');
}

// Tests du hook usePlanningData
function testUsePlanningData() {
  console.log('\n🪝 Tests du hook usePlanningData');
  
  // Simulation du hook améliorée
  const createUsePlanningData = (token) => {
    // Simulation directe de l'état basé sur la présence du token
    const hasToken = !!token;
    const loading = !hasToken; // Pas de chargement si on a un token
    const data = hasToken ? mockPlanningData : {
      planning: null,
      classes: [],
      semaines: [],
      familles: [],
      affectations: [],
      permissions: { isAdmin: false, canEdit: false }
    };
    
    const loginAdmin = async (password) => {
      if (password === 'test123') {
        return { success: true, data: mockAdminData };
      }
      return { success: false, error: 'Mot de passe incorrect' };
    };
    
    const logoutAdmin = async () => {
      return { success: true };
    };
    
    return {
      data,
      loading,
      error: null,
      isAdmin: data.permissions?.isAdmin || false,
      canEdit: data.permissions?.canEdit || false,
      loginAdmin,
      logoutAdmin
    };
  };
  
  // Tests
  const hook1 = createUsePlanningData(null);
  assert(hook1.loading === true, 'Devrait être en chargement sans token');
  
  const hook2 = createUsePlanningData('test_token');
  assert(hook2.loading === false, 'Ne devrait plus être en chargement avec token');
  assert(hook2.data.planning.name === 'Planning Test', 'Données devraient être chargées');
  assert(hook2.isAdmin === false, 'Ne devrait pas être admin initialement');
  
  console.log('✅ Tests usePlanningData passés');
}

// Tests de la logique d'affectation
function testAffectationLogic() {
  console.log('\n📝 Tests de la logique d\'affectation');
  
  // Simulation des fonctions d'affectation
  const isCellAvailable = (classeId, semaineId, affectations) => {
    return !affectations.some(a => a.classeId === classeId && a.semaineId === semaineId);
  };
  
  const getAvailableFamilies = (classeId, familles) => {
    return familles.filter(f => f.classes_preferences.includes(classeId));
  };
  
  const createAffectation = (familleId, classeId, semaineId, affectations) => {
    if (!isCellAvailable(classeId, semaineId, affectations)) {
      throw new Error('Cellule déjà occupée');
    }
    
    const newAffectation = {
      id: affectations.length + 1,
      familleId,
      classeId,
      semaineId
    };
    
    return [...affectations, newAffectation];
  };
  
  // Tests
  assert(isCellAvailable('B', '2024-01-15', mockPlanningData.affectations), 'Cellule B/2024-01-15 devrait être libre');
  assert(!isCellAvailable('A', '2024-01-15', mockPlanningData.affectations), 'Cellule A/2024-01-15 devrait être occupée');
  
  const availableFamiliesA = getAvailableFamilies('A', mockPlanningData.familles);
  assertEqual(availableFamiliesA.length, 1, 'Une famille devrait préférer la classe A');
  assertEqual(availableFamiliesA[0].nom, 'Famille A', 'Famille A devrait préférer la classe A');
  
  const newAffectations = createAffectation(2, 'B', '2024-01-15', mockPlanningData.affectations);
  assertEqual(newAffectations.length, 2, 'Nouvelle affectation devrait être ajoutée');
  
  try {
    createAffectation(2, 'A', '2024-01-15', mockPlanningData.affectations);
    assert(false, 'Devrait lever une erreur pour cellule occupée');
  } catch (error) {
    assert(error.message === 'Cellule déjà occupée', 'Message d\'erreur correct');
  }
  
  console.log('✅ Tests logique affectation passés');
}

// Tests de la logique des permissions
function testPermissionsLogic() {
  console.log('\n🔐 Tests de la logique des permissions');
  
  // Simulation des fonctions de permissions
  const canViewFamilles = (permissions) => {
    return permissions.isAdmin;
  };
  
  const canEditData = (permissions) => {
    return permissions.canEdit;
  };
  
  const canViewSemaine = (semaine, permissions) => {
    return permissions.isAdmin || semaine.is_published;
  };
  
  const filterSemainesForUser = (semaines, permissions) => {
    return semaines.filter(s => canViewSemaine(s, permissions));
  };
  
  // Tests avec utilisateur public
  const publicPermissions = mockPlanningData.permissions;
  assert(!canViewFamilles(publicPermissions), 'Utilisateur public ne devrait pas voir les familles');
  assert(!canEditData(publicPermissions), 'Utilisateur public ne devrait pas pouvoir éditer');
  
  const publicSemaines = filterSemainesForUser(mockPlanningData.semaines, publicPermissions);
  assertEqual(publicSemaines.length, 1, 'Utilisateur public ne devrait voir qu\'une semaine publiée');
  assert(publicSemaines[0].is_published, 'Semaine visible devrait être publiée');
  
  // Tests avec admin
  const adminPermissions = mockAdminData.permissions;
  assert(canViewFamilles(adminPermissions), 'Admin devrait voir les familles');
  assert(canEditData(adminPermissions), 'Admin devrait pouvoir éditer');
  
  const adminSemaines = filterSemainesForUser(mockPlanningData.semaines, adminPermissions);
  assertEqual(adminSemaines.length, 2, 'Admin devrait voir toutes les semaines');
  
  console.log('✅ Tests logique permissions passés');
}

// Tests de validation des données
function testDataValidation() {
  console.log('\n✅ Tests de validation des données');
  
  // Simulation des fonctions de validation
  const validateFamille = (famille) => {
    const errors = [];
    
    if (!famille.nom || famille.nom.trim() === '') {
      errors.push('Nom obligatoire');
    }
    
    if (!famille.telephone || famille.telephone.trim() === '') {
      errors.push('Téléphone obligatoire');
    }
    
    if (famille.telephone && !/^[0-9+\-\s()]+$/.test(famille.telephone)) {
      errors.push('Format téléphone invalide');
    }
    
    if (famille.nb_nettoyage && (famille.nb_nettoyage < 1 || famille.nb_nettoyage > 10)) {
      errors.push('Nombre de nettoyages doit être entre 1 et 10');
    }
    
    return errors;
  };
  
  const validateClasse = (classe) => {
    const errors = [];
    
    if (!classe.id || classe.id.trim() === '') {
      errors.push('ID obligatoire');
    }
    
    if (!classe.nom || classe.nom.trim() === '') {
      errors.push('Nom obligatoire');
    }
    
    if (!classe.couleur || !/^#[0-9a-fA-F]{6}$/.test(classe.couleur)) {
      errors.push('Couleur invalide');
    }
    
    return errors;
  };
  
  // Tests de validation famille valide
  const familleValide = {
    nom: 'Famille Test',
    telephone: '0123456789',
    nb_nettoyage: 3
  };
  assertEqual(validateFamille(familleValide).length, 0, 'Famille valide ne devrait pas avoir d\'erreurs');
  
  // Tests de validation famille invalide
  const familleInvalide = {
    nom: '',
    telephone: '',
    nb_nettoyage: 15
  };
  const erreursFamille = validateFamille(familleInvalide);
  assert(erreursFamille.length > 0, 'Famille invalide devrait avoir des erreurs');
  assert(erreursFamille.includes('Nom obligatoire'), 'Devrait détecter nom manquant');
  assert(erreursFamille.includes('Téléphone obligatoire'), 'Devrait détecter téléphone manquant');
  
  // Tests de validation classe
  const classeValide = {
    id: 'A',
    nom: 'Classe A',
    couleur: '#ff0000'
  };
  assertEqual(validateClasse(classeValide).length, 0, 'Classe valide ne devrait pas avoir d\'erreurs');
  
  const classeInvalide = {
    id: '',
    nom: '',
    couleur: 'rouge'
  };
  const erreursClasse = validateClasse(classeInvalide);
  assert(erreursClasse.length > 0, 'Classe invalide devrait avoir des erreurs');
  
  console.log('✅ Tests validation données passés');
}

// Tests de logique d'import
function testImportLogic() {
  console.log('\n📊 Tests de la logique d\'import');
  
  // Simulation du parser CSV
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return { headers, rows };
  };
  
  const validateImportData = (rows) => {
    const results = {
      valid: [],
      errors: []
    };
    
    rows.forEach((row, index) => {
      const errors = [];
      
      if (!row.nom || row.nom.trim() === '') {
        errors.push('Nom manquant');
      }
      
      if (!row.telephone || row.telephone.trim() === '') {
        errors.push('Téléphone manquant');
      }
      
      if (errors.length === 0) {
        results.valid.push(row);
      } else {
        results.errors.push({
          ligne: index + 2, // +2 car index 0 + header
          famille: row.nom || 'Sans nom',
          erreurs: errors
        });
      }
    });
    
    return results;
  };
  
  // Tests
  const csvValid = `nom,telephone,email
"Famille A","0123456789","a@test.com"
"Famille B","0987654321","b@test.com"`;
  
  const parsedValid = parseCSV(csvValid);
  assertEqual(parsedValid.headers.length, 3, 'Devrait avoir 3 colonnes');
  assertEqual(parsedValid.rows.length, 2, 'Devrait avoir 2 lignes');
  assertEqual(parsedValid.rows[0].nom, 'Famille A', 'Première famille devrait être Famille A');
  
  const validationValid = validateImportData(parsedValid.rows);
  assertEqual(validationValid.valid.length, 2, 'Toutes les familles devraient être valides');
  assertEqual(validationValid.errors.length, 0, 'Aucune erreur attendue');
  
  const csvInvalid = `nom,telephone,email
"","","invalid@test.com"
"Famille B","0987654321","b@test.com"`;
  
  const parsedInvalid = parseCSV(csvInvalid);
  const validationInvalid = validateImportData(parsedInvalid.rows);
  assertEqual(validationInvalid.valid.length, 1, 'Une seule famille devrait être valide');
  assertEqual(validationInvalid.errors.length, 1, 'Une erreur attendue');
  
  console.log('✅ Tests logique import passés');
}

// Tests des filtres
function testFiltersLogic() {
  console.log('\n🔍 Tests de la logique des filtres');
  
  // Simulation des fonctions de filtre
  const applySearchFilter = (data, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      if (item.nom) return item.nom.toLowerCase().includes(term);
      if (item.familleNom) return item.familleNom.toLowerCase().includes(term);
      return false;
    });
  };
  
  const applyDateFilter = (semaines, startDate, endDate) => {
    return semaines.filter(semaine => {
      const debut = new Date(semaine.debut);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && debut < start) return false;
      if (end && debut > end) return false;
      return true;
    });
  };
  
  // Tests de filtre de recherche
  const searchResults = applySearchFilter(mockPlanningData.familles, 'famille a');
  assertEqual(searchResults.length, 1, 'Recherche devrait trouver une famille');
  assertEqual(searchResults[0].nom, 'Famille A', 'Devrait trouver Famille A');
  
  const noResults = applySearchFilter(mockPlanningData.familles, 'inexistant');
  assertEqual(noResults.length, 0, 'Recherche inexistante ne devrait rien trouver');
  
  // Tests de filtre de date
  const dateFiltered = applyDateFilter(mockPlanningData.semaines, '2024-01-01', '2024-01-20');
  assertEqual(dateFiltered.length, 1, 'Filtre de date devrait trouver une semaine');
  
  console.log('✅ Tests logique filtres passés');
}

// Exécution de tous les tests de composants
async function runComponentTests() {
  const runner = new TestRunner();
  
  await runner.test('Tests des utilitaires de date', () => {
    testDateUtils();
  });
  
  await runner.test('Tests du hook usePlanningData', () => {
    testUsePlanningData();
  });
  
  await runner.test('Tests de la logique d\'affectation', () => {
    testAffectationLogic();
  });
  
  await runner.test('Tests de la logique des permissions', () => {
    testPermissionsLogic();
  });
  
  await runner.test('Tests de validation des données', () => {
    testDataValidation();
  });
  
  await runner.test('Tests de la logique d\'import', () => {
    testImportLogic();
  });
  
  await runner.test('Tests de la logique des filtres', () => {
    testFiltersLogic();
  });
  
  runner.summary();
  return runner.failed === 0;
}

// Exécution des tests
// Toujours exécuter les tests
if (true) {
  console.log('🧪 Lancement des tests de composants React\n');
  
  runComponentTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('\n💥 Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  });
}

export { runComponentTests }; 