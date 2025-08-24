# Guide de Développement - Planning App

## 🚀 Démarrage rapide

### Option 1: Script automatique (Recommandé)
```bash
npm start
# ou
./start-dev.sh
```

Cela démarre automatiquement :
- ✅ API Backend sur http://localhost:3000
- ✅ Frontend React sur http://localhost:5173  
- ✅ Proxy automatique des requêtes `/api/*`

### Option 2: Démarrage manuel
```bash
# Terminal 1 - API Backend
source ~/.nvm/nvm.sh && nvm use 18
set -a && source .env.local && set +a  
npm run dev:api

# Terminal 2 - Frontend React
npm run dev
```

## 🔧 Configuration

### Variables d'environnement requises
Créer `.env.local` avec :
```bash
# Base de données
DATABASE_URL=postgresql://...

# SMS (Twilio)
SMS_ENABLED=true
SMS_PROVIDER=twilio
TWILIO_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxx
TWILIO_SENDER=+15551234567

# Admin (optionnel)
DEFAULT_ADMIN_PASSWORD=admin123

# Sécurité
ADMIN_SALT=your_random_salt
NODE_ENV=development
```

### Vérification des variables
```bash
npm run check:env
```

## 🧪 Tests

```bash
# Tous les tests
npm test

# Tests API uniquement  
npm run test:api

# Tests composants uniquement
npm run test:components
```

## 📱 Fonctionnalités

### Accès à l'application
- **Interface publique** : http://localhost:5173
- **Admin** : Cliquer sur "Admin" puis saisir le token + mot de passe

### SMS planifiés
1. Aller dans Admin → SMS Planifiés
2. Créer un SMS avec : jour, heure, message
3. Le SMS sera envoyé automatiquement via service externe

### Mots de passe par défaut
- **Admin** : `admin123` (configurable via `DEFAULT_ADMIN_PASSWORD`)
- **Token planning** : Généré automatiquement ou personnalisé

## 🔍 Debug

### Logs
```bash
# Logs API en temps réel
tail -f api.log

# Logs Frontend en temps réel  
tail -f frontend.log
```

### Endpoints utiles
- **Health check** : http://localhost:3000/health
- **Test SMS cron** : `curl -X POST http://localhost:3000/api/sms-cron`

### Problèmes courants

**Erreur 405 sur `/api/sms`**
→ Vérifier que l'API backend tourne sur le port 3000

**Variables non trouvées**
→ Exécuter `npm run check:env` pour diagnostiquer

**SMS non envoyés**
→ Vérifier `NODE_ENV=development` (mode test) vs `production`

## 📦 Déploiement

### Vercel
```bash
# Vérifier et déployer
npm run vercel:deploy
```

### Variables Vercel
Toutes les variables de `.env.local` doivent être configurées sur Vercel Dashboard.

## 🔧 Architecture

```
├── api/                 # Backend Node.js
│   ├── auth.js         # Authentification
│   ├── planning.js     # Gestion planning
│   ├── familles.js     # Gestion familles  
│   ├── sms.js          # SMS (Twilio/Spryng)
│   └── sms-cron.js     # SMS planifiés
├── src/                # Frontend React
│   ├── components/     # Composants UI
│   ├── hooks/          # Hooks React
│   └── utils/          # Utilitaires
└── tests/              # Suite de tests
```

## 🎯 Workflow de développement

1. **Modifier le code** (API ou Frontend)
2. **Les serveurs redémarrent automatiquement** (nodemon + vite)
3. **Tester** via interface ou `npm test`
4. **Commiter** et pousser les changements
5. **Déployer** avec `npm run vercel:deploy`