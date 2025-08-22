# 🧪 Suite de Tests - Planning Nettoyage

Cette suite de tests complète valide le bon fonctionnement de l'application Planning Nettoyage, couvrant les APIs, la logique métier et les composants React.

## 📋 Vue d'ensemble

### Types de tests

- **🔗 Tests API** (`api.test.js`) : Validation des endpoints REST, authentification, CRUD
- **⚛️ Tests Composants** (`components.test.js`) : Logique des hooks React, validation des données, filtres
- **⚡ Tests Performance** : Temps de réponse, utilisation mémoire

### Couverture fonctionnelle

✅ **Authentification**
- Création de planning avec mot de passe admin
- Login/logout admin
- Validation des sessions
- Gestion des permissions

✅ **Multi-planning**
- Isolation des données par token
- Accès public vs admin
- Publication des semaines

✅ **Gestion des familles**
- CRUD familles avec validation téléphone
- Import Excel/CSV
- Classes préférées et exclusions

✅ **Planning et affectations**
- Contrainte unique (1 famille par cellule)
- Vérification disponibilités
- Drag & drop et édition

✅ **Classes et semaines**
- Gestion des zones de nettoyage
- Publication/dépublication
- Génération en lot

## 🚀 Utilisation

### Installation

Aucune dépendance supplémentaire - utilise Node.js natif et les APIs Web standard.

### Lancement des tests

```bash
# Tous les tests
npm test

# Tests API uniquement
npm run test:api

# Tests composants uniquement
npm run test:components

# Aide et options
npm run test:help
```

### Commandes avancées

```bash
# Tests avec URL personnalisée
API_BASE_URL=https://myapp.vercel.app npm test

# Tests en ignorant les prérequis
node tests/run-all-tests.js --skip-prereq

# Tests API seulement (utile en CI)
node tests/run-all-tests.js --api-only
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `API_BASE_URL` | URL de base de l'API | `http://localhost:3000` |
| `DATABASE_URL` | URL PostgreSQL | Lecture depuis `env.local` |
| `NODE_ENV` | Environnement | `test` |

### Prérequis automatiques

Le script vérifie automatiquement :
- ✅ Version Node.js ≥ 18
- ✅ Fichiers de test présents
- ✅ Variables d'environnement configurées
- ✅ API accessible

## 📊 Rapports

### Sortie console

```
🚀 SUITE DE TESTS PLANNING NETTOYAGE
📍 URL API: http://localhost:3000
⏱️  Timeout: 300s

============================================================
  🔍 VÉRIFICATION DES PRÉREQUIS
============================================================
✅ Node.js version
✅ Fichiers de test
✅ Variables d'environnement
✅ API disponible

============================================================
  🏃 EXÉCUTION DES TESTS
============================================================

----------------------------------------
  🧪 Tests des APIs REST
----------------------------------------
🧪 Test: Création d'un planning de test
✅ PASS: Création d'un planning de test
🧪 Test: Vérification session admin
✅ PASS: Vérification session admin
[... 16 tests API ...]

============================================================
  📊 RAPPORT DE TESTS
============================================================
📈 Tests exécutés: 23
✅ Réussis: 23
❌ Échoués: 0
🎯 Taux de réussite: 100%

🎉 TOUS LES TESTS SONT PASSÉS! 🎉
```

### Rapport JSON

Un rapport détaillé est sauvegardé dans `tests/last-test-report.json` :

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "config": {
    "API_BASE_URL": "http://localhost:3000",
    "TIMEOUT": 300000
  },
  "results": [
    {
      "name": "Tests API",
      "success": true,
      "duration": 12340
    }
  ],
  "summary": {
    "total": 2,
    "passed": 2,
    "failed": 0,
    "successRate": 100
  }
}
```

## 🔍 Tests détaillés

### Tests API (16 tests)

1. **Création planning de test** - Génération token et session admin
2. **Vérification session admin** - Validation authentification
3. **Accès mode public** - Données visibles sans admin
4. **Création classe** - CRUD classes avec couleurs
5. **Création semaine** - Périodes avec statut publication
6. **Création famille** - Validation téléphone obligatoire
7. **Création affectation** - Assignation famille→classe→semaine
8. **Contrainte unique** - Une famille max par cellule
9. **Publication semaine** - Contrôle visibilité
10. **Accès public après publication** - Données publiées visibles
11. **Template import familles** - Format CSV
12. **Statistiques** - Métriques planning
13. **Authentification incorrecte** - Sécurité mot de passe
14. **Accès sans permissions** - Protection endpoints admin
15. **Token invalide** - Validation tokens planning
16. **Nettoyage** - Déconnexion et cleanup

### Tests Composants (7 tests)

1. **Utilitaires de date** - Formatage et plages
2. **Hook usePlanningData** - Chargement données et auth
3. **Logique affectation** - Disponibilités et contraintes
4. **Logique permissions** - Filtrage selon rôle
5. **Validation données** - Familles et classes
6. **Logique import** - Parser CSV et validation
7. **Logique filtres** - Recherche et dates

## 🚀 Intégration CI/CD

### GitHub Actions exemple

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      API_BASE_URL: ${{ secrets.API_BASE_URL }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

### Vercel Checks

```json
{
  "checks": [
    {
      "name": "tests",
      "path": "npm test"
    }
  ]
}
```

## 🐛 Debugging

### Échecs de tests communs

**❌ API non accessible**
```
❌ API disponible - Démarrer le serveur sur http://localhost:3000
```
➡️ Solution : `npm run dev` dans un autre terminal

**❌ Base de données non configurée**
```
❌ Variables d'environnement - Configurer DATABASE_URL ou créer env.local
```
➡️ Solution : Vérifier `env.local` ou `DATABASE_URL`

**❌ Tests timeout**
```
❌ Test api.test.js timeout après 300s
```
➡️ Solution : Vérifier la connectivité réseau/DB

### Mode debug

```bash
# Verbose logging
DEBUG=1 npm test

# Tests avec plus de temps
TIMEOUT=600000 npm test

# Ignorer vérifications prérequis
npm test -- --skip-prereq
```

## 📝 Écriture de nouveaux tests

### Ajouter un test API

```javascript
// Dans api.test.js
await runner.test('Nom du test', async () => {
  const { data, status } = await apiCall('/api/endpoint', {
    method: 'POST',
    headers: { 'X-Admin-Session': testAdminSession },
    body: JSON.stringify({ /* data */ })
  });

  assertEqual(status, 200, 'Status devrait être 200');
  assert(data.success, 'Opération devrait réussir');
});
```

### Ajouter un test composant

```javascript
// Dans components.test.js
function testNewFeature() {
  const result = newFeatureFunction(input);
  assert(result.isValid, 'Résultat devrait être valide');
  assertEqual(result.value, expected, 'Valeur attendue');
}

await runner.test('Test nouvelle fonctionnalité', () => {
  testNewFeature();
});
```

## 🎯 Objectifs qualité

- **Couverture** : ≥ 80% des fonctionnalités critiques
- **Performance** : Réponse API < 2s, Mémoire < 200MB
- **Fiabilité** : Tests passent de façon déterministe
- **Maintenance** : Tests lisibles et documentés

---

💡 **Conseil** : Lancez `npm test` avant chaque commit pour garantir la qualité !

🚀 **Production** : Tous les tests doivent passer avant le déploiement. 