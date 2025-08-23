# 📅 Planning Nettoyage - Application de Gestion des Plannings

Application web moderne pour la gestion des plannings de nettoyage avec système multi-planning, authentification admin et notifications SMS.

## 🚀 **Fonctionnalités Principales**

### **📋 Gestion Multi-Planning**
- Support de **plusieurs plannings simultanés** (par année, école, etc.)
- Chaque planning protégé par un **token unique sécurisé**
- Isolation complète des données entre plannings

### **👥 Gestion des Familles**
- Import en lot depuis **Excel/CSV**
- **Téléphone obligatoire** pour les notifications SMS
- **Classes préférées** par famille
- **Exclusions temporelles** (vacances, indisponibilité)
- Validation automatique des disponibilités
- Système d'archivage/restauration
- Interface de gestion des contraintes d'exclusion

### **🏠 Classes de Nettoyage**
- Zones de nettoyage avec couleurs personnalisées
- Ordre d'affichage configurable
- Descriptions détaillées

### **📆 Semaines & Publication**
- **Système de publication** : semaines visibles ou cachées
- Gestion des périodes spéciales (vacances, etc.)
- Contrôle de visibilité par les administrateurs

### **🔧 Affectations Intelligentes**
- **Contrainte unique** : 1 famille maximum par cellule (classe + semaine)
- Suggestions automatiques basées sur les préférences
- **Vérification des exclusions temporelles automatique**
- Drag & drop pour réorganiser
- Interface responsive (mobile/desktop)
- Support pour 10+ classes avec défilement horizontal

### **🔐 Authentification & Permissions**
- **Admin** : Accès complet en modification
- **Public** : Accès en lecture seule aux semaines publiées
- Sessions sécurisées avec expiration automatique
- Protection des données sensibles (téléphones)

### **📊 Statistiques & Audit**
- Taux de remplissage des plannings
- Historique des imports
- Gestion des erreurs détaillée
- **Suite de tests complète (API + composants)**
- Monitoring des contraintes d'exclusion

## 🏗️ **Architecture Technique**

### **Frontend**
- **React 19** avec hooks modernes
- **React DnD** pour le drag & drop
- **Vite** pour le build rapide
- Interface responsive et moderne
- **CSS Grid** pour layout avancé
- Support mobile optimisé

### **Backend**
- **API REST** serverless (Vercel Functions)
- **PostgreSQL** (Neon) pour la persistance
- **Driver serverless** optimisé
- **Express.js** pour développement local
- Middleware de logging détaillé

### **Base de Données**

```sql
-- Tables principales
├── plannings          # Plannings avec tokens sécurisés
├── familles          # Familles avec préférences
├── classes           # Zones de nettoyage
├── semaines          # Périodes avec statut publication
├── affectations      # Assignations famille → classe → semaine
├── familles_exclusions # Indisponibilités temporelles (COMPLET)
├── admin_sessions    # Sessions administrateur
└── imports           # Audit des imports Excel

-- Fonctions de validation
├── isFamilleAvailableForPeriod() # Validation contraintes exclusion
└── Contraintes d'unicité         # 1 famille max par cellule
```

### **Contraintes de Sécurité**
- Tokens SHA-256 sécurisés
- Isolation des données par planning
- Sessions admin avec expiration
- Protection CORS configurée

## 📊 **Schéma de Base de Données**

### **Structure Simplifiée**
```mermaid
erDiagram
    plannings ||--o{ familles : "contient"
    plannings ||--o{ semaines : "organise"
    familles ||--o{ affectations : "participe"
    semaines ||--o{ affectations : "planifiée"
    
    plannings {
        token string "Token sécurisé unique"
        name string "Nom du planning"
        admin_password_hash string "Hash mot de passe admin"
        is_active boolean
    }
    
    familles {
        nom string "Nom famille"
        telephone string "OBLIGATOIRE pour SMS"
        classes_preferences array "Classes préférées"
        nb_nettoyage int "Nombre nettoyages/an"
    }
    
    semaines {
        debut date "Date début"
        fin date "Date fin"
        is_published boolean "Semaine publiée"
        published_at timestamp
    }
    
    affectations {
        planning_id int
        famille_id int
        classe_id string
        semaine_id string
        unique "1 famille max par cellule"
    }
```

## 🛠️ **Installation & Déploiement**

### **Prérequis**
- Node.js 18+
- PostgreSQL (Neon recommandé)
- Compte Vercel (optionnel)

### **Variables d'Environnement**
```env
# Base de données
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Sécurité admin
ADMIN_SALT=your_secure_salt_here

# Vercel (optionnel)
VERCEL_TOKEN=your_vercel_token
```

### **Installation Locale**
```bash
# Cloner le projet
git clone https://github.com/your-repo/planning.git
cd planning

# Installer les dépendances
npm install

# Lancer en développement (2 terminaux)
npm run dev        # Frontend Vite (port 5173)
npm run dev:api    # Backend API (port 3000)

# Tester le système
npm test          # Suite de tests complète

# Builder pour production
npm run build
```

### **Déploiement Vercel**
```bash
# Déployer
vercel --prod

# Ou via l'interface Vercel connectée au Git
```

## 📁 **Structure du Projet**

```
planning/
├── api/                   # APIs serverless
│   ├── auth.js           # Authentification admin
│   ├── planning.js       # Gestion planning + contraintes
│   ├── familles.js       # Gestion familles + exclusions
│   └── db.js            # Utilitaires base de données
├── src/
│   ├── components/       # Composants React
│   │   ├── Planning.jsx         # Composant principal
│   │   ├── PlanningGrid.jsx     # Grille responsive
│   │   ├── AffectationCell.jsx  # Cellule drag & drop
│   │   ├── FamillesManager.jsx  # Gestion familles
│   │   ├── ExclusionsManager.jsx # Gestion exclusions
│   │   └── ...
│   ├── hooks/           # Hooks React
│   │   ├── usePlanningData.js
│   │   └── useAffectations.js
│   ├── utils/           # Utilitaires
│   │   └── dateUtils.js
│   └── data/            # Données de migration
├── tests/               # Suite de tests complète
│   ├── api.test.js      # Tests API REST
│   ├── exclusions.test.js # Tests contraintes
│   ├── components.test.js # Tests React
│   └── run-all-tests.js  # Orchestrateur
├── dev-server.js        # Serveur de développement
├── vercel.json          # Configuration Vercel
├── package.json         # Dépendances
└── vite.config.js       # Configuration Vite
```

## 🔧 **APIs Disponibles**

### **Authentication (`/api/auth`)**
```javascript
// Login admin
POST /api/auth
{
  "action": "login",
  "data": { "token": "planning_token", "password": "admin_pass" }
}

// Vérifier session
GET /api/auth?action=check_session&session_token=xxx

// Créer planning
POST /api/auth
{
  "action": "create_planning",
  "data": { "name": "Planning 2024", "adminPassword": "secret" }
}
```

### **Planning (`/api/planning`)**
```javascript
// Récupérer données complètes
GET /api/planning?token=xxx&type=full

// Familles disponibles pour une cellule
GET /api/planning?token=xxx&action=available_families&classe_id=A&semaine_id=2024-01-11

// Publier/dépublier semaine (admin uniquement)
POST /api/planning
{
  "token": "xxx",
  "type": "publish_semaine",
  "data": { "semaineId": "2024-01-11", "publish": true }
}
```

### **Familles (`/api/familles`)**
```javascript
// Liste des familles
GET /api/familles?token=xxx&action=list

// Template import Excel
GET /api/familles?token=xxx&action=template

// Import en lot
POST /api/familles
{
  "token": "xxx",
  "action": "import",
  "data": { "familles": [...], "filename": "import.csv" }
}

// Ajouter exclusion temporelle
POST /api/familles
{
  "token": "xxx",
  "action": "add_exclusion",
  "famille_id": 123,
  "date_debut": "2024-12-01",
  "date_fin": "2024-12-31",
  "type": "vacances",
  "notes": "Vacances d'hiver"
}

// Archiver/restaurer famille
POST /api/familles
{
  "token": "xxx",
  "action": "archive",
  "data": { "id": 123, "archived": true }
}
```

## 📝 **Format Import Excel**

### **Template Familles**
| nom | email | telephone | nb_nettoyage | classes_preferences | notes |
|-----|-------|-----------|--------------|-------------------|-------|
| Famille Dupont | dupont@email.com | 0123456789 | 3 | A,C | Préfère week-ends |

### **Règles de Validation**
- **nom** : Obligatoire
- **telephone** : **OBLIGATOIRE** pour SMS
- **nb_nettoyage** : Entre 1 et 10 (défaut: 3)
- **classes_preferences** : IDs séparés par virgule

## 🔐 **Système de Permissions**

### **Accès Public (sans authentification)**
- ✅ Voir les semaines **publiées uniquement**
- ✅ Voir les affectations des semaines publiées
- ❌ Pas d'accès aux informations familles
- ❌ Pas de modification possible

### **Accès Admin (avec authentification)**
- ✅ Voir **toutes** les semaines (publiées + non publiées)
- ✅ Voir les informations complètes des familles
- ✅ Modifier, créer, supprimer
- ✅ Publier/dépublier des semaines
- ✅ Import Excel
- ✅ **Gestion complète des exclusions** (interface + validation)

## 🚀 **Roadmap & Améliorations**

### **Phase 1 : Base** ✅
- [x] Multi-planning avec tokens
- [x] Authentification admin
- [x] Import Excel
- [x] Système de publication
- [x] **Interface responsive mobile/desktop**
- [x] **Système d'exclusions complet**
- [x] **Suite de tests exhaustive (100% réussite)**

### **Phase 2 : Notifications** 🔄
- [ ] **Notifications SMS** (Twilio/AWS SNS)
- [ ] Rappels automatiques
- [ ] Confirmations par SMS

### **Phase 3 : UX** 📋
- [x] **Interface mobile optimisée** ✅
- [ ] Calendrier visuel
- [ ] Export PDF des plannings
- [ ] Historique des modifications

### **Phase 4 : Avancé** 🔮
- [ ] API publique pour intégrations
- [ ] Système de rôles avancé
- [ ] Analytics et reporting
- [ ] Synchronisation calendriers

## 🧪 **Tests & Qualité**

### **Suite de Tests Automatisée**
```bash
# Lancer tous les tests
npm test

# Résultats attendus :
# ✅ Tests API: 16/16 RÉUSSIS
# ✅ Tests Exclusions: RÉUSSIS  
# ✅ Tests Composants: 7/7 RÉUSSIS
# ✅ Tests Performance: RÉUSSIS
# 🎯 Taux de réussite: 100%
```

### **Test Local Manuel**
```bash
# Tester l'API
curl -X GET "http://localhost:3000/api/planning?token=your_token&type=full"

# Tester l'authentification
curl -X POST "http://localhost:3000/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"action":"login","data":{"token":"xxx","password":"xxx"}}'

# Tester les exclusions
curl -X POST "http://localhost:3000/api/familles" \
  -H "Content-Type: application/json" \
  -H "X-Admin-Session: your_session" \
  -d '{"token":"xxx","action":"add_exclusion","famille_id":1,"date_debut":"2024-12-01","date_fin":"2024-12-31","type":"vacances"}'
```

### **Monitoring Production**
- Logs Vercel pour erreurs
- Monitoring PostgreSQL Neon
- Alerts sur taux d'erreur

## 👥 **Contribution**

### **Standards de Code**
- ES6+ moderne
- Fonctions pures privilégiées
- Gestion d'erreur exhaustive
- Documentation inline

### **Workflow Git**
```bash
# Feature branch
git checkout -b feature/nom-feature

# Commit conventionnel
git commit -m "feat: ajout notifications SMS"

# Push et PR
git push origin feature/nom-feature
```

## 📞 **Support & Contact**

- **Issues** : GitHub Issues
- **Documentation** : Ce README
- **API Docs** : Commentaires inline dans `/api/`

---

## 📊 **Métriques Projet**

| Métrique | Valeur |
|----------|--------|
| **Langages** | JavaScript, SQL |
| **Frontend** | React 19 + Vite |
| **Backend** | Node.js Serverless |
| **Base de données** | PostgreSQL (Neon) |
| **Déploiement** | Vercel |
| **Performance** | < 30ms API, < 2s load time |
| **Sécurité** | Tokens SHA-256, Sessions |
| **Tests** | **100% de réussite** |
| **Responsive** | ✅ Mobile/Desktop |
| **Features** | **Exclusions temporelles** ✅ |

---

*Application développée avec ❤️ pour simplifier la gestion des plannings de nettoyage.*