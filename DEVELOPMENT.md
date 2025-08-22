# 🚀 Guide de Développement - Planning Nettoyage

Ce guide explique les bonnes pratiques pour développer avec **Vite + Vercel**.

## 🏗️ **Architecture**

### **Production (Vercel)**
```
https://myapp.vercel.app/
├── Frontend (Vite build) 
└── /api/* (Vercel Functions)
```

### **Développement : 2 Approches**

## **🎯 Approche 1 : Vercel Dev (Recommandée)**

### Avantages ✅
- ✅ **Identique à la production** - même domaine/port
- ✅ **Pas de problème CORS** 
- ✅ **Configuration simple**
- ✅ **Serverless functions natives**

### Commandes
```bash
# Installation Vercel CLI (si pas fait)
npm i -g vercel

# Développement (port 3000 par défaut)
npm run dev
# ou
vercel dev

# Tests
npm test  # URL: http://localhost:3000

# Spécifier un port différent
vercel dev --listen 8080
```

### Configuration
```json
// vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

## **🔄 Approche 2 : Vite Dev + Vercel Dev Séparé**

### Avantages ✅
- ✅ **Hot Reload Vite ultra-rapide**
- ✅ **DevTools Vite optimisés**
- ✅ **Workflows séparés frontend/backend**

### Inconvénients ❌
- ❌ Plus complexe (2 serveurs)
- ❌ Configuration proxy requise
- ❌ Peut différer de la production

### Commandes
```bash
# Terminal 1 : APIs Vercel
vercel dev --listen 3000

# Terminal 2 : Frontend Vite  
npm run dev:vite  # Port 5173 avec proxy

# Tests
API_BASE_URL=http://localhost:5173 npm test
```

### Configuration Vite (Déjà configurée)
```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'  // Proxy vers Vercel
    }
  }
})
```

---

## **🧪 Tests selon l'Approche**

### **Auto-détection intelligente**
```bash
# Détection automatique du port/URL
npm test

# Force l'URL spécifique
API_BASE_URL=http://localhost:5173 npm test
API_BASE_URL=https://myapp.vercel.app npm test
```

### **Variables d'environnement**
```bash
# Vercel dev (port 3000)
API_BASE_URL=http://localhost:3000 npm test

# Vite dev avec proxy (port 5173)  
API_BASE_URL=http://localhost:5173 npm test

# Production Vercel
API_BASE_URL=https://myapp.vercel.app npm test
```

---

## **📊 Comparaison des Approches**

| Critère | Vercel Dev | Vite + Vercel |
|---------|------------|---------------|
| **Simplicité** | 🟢 Simple | 🟡 Moyen |
| **Prod Similarity** | 🟢 Identique | 🟡 Proche |
| **Hot Reload** | 🟡 Standard | 🟢 Ultra-rapide |
| **CORS** | 🟢 Aucun souci | 🟡 Config nécessaire |
| **DevTools** | 🟡 Standard | 🟢 Optimisés |
| **Performance** | 🟢 Très bon | 🟢 Excellent |

---

## **🎯 Recommandations par Cas d'Usage**

### **🥇 Vercel Dev (Recommandé pour la plupart)**
```bash
npm run dev  # Port 3000
```
**Utilisez si :**
- ✅ Vous travaillez sur les APIs serverless
- ✅ Vous voulez un environnement identique à la production
- ✅ Vous préférez la simplicité
- ✅ Vous travaillez en équipe (moins de confusion)

### **🥈 Vite Dev Séparé (Pour développement frontend intensif)**
```bash
# Terminal 1
vercel dev --listen 3000

# Terminal 2  
npm run dev:vite  # Port 5173
```
**Utilisez si :**
- ✅ Vous travaillez principalement sur l'UI React
- ✅ Vous voulez le hot reload ultra-rapide de Vite
- ✅ Vous ne touchez pas souvent aux APIs
- ✅ Vous maîtrisez les configs proxy

---

## **🔧 Configuration Avancée**

### **Ports personnalisés**
```bash
# Vercel dev port custom
vercel dev --listen 8080

# Vite dev port custom
npm run dev:vite -- --port 4000

# Tests avec port custom
API_BASE_URL=http://localhost:8080 npm test
```

### **HTTPS local**
```bash
# Vercel dev avec HTTPS
vercel dev --local-config vercel.json

# Vite dev avec HTTPS
npm run dev:vite -- --https
```

### **Variables d'environnement**
```bash
# Charger .env.local
vercel dev

# Avec variables custom
DATABASE_URL=xxx vercel dev
```

---

## **🐛 Troubleshooting**

### **❌ "Cannot connect to API"**
```bash
# Vérifier que Vercel dev tourne
vercel dev --listen 3000

# Ou utiliser l'approche intégrée
npm run dev
```

### **❌ "CORS error"**
```bash
# Utiliser vercel dev au lieu de vite séparé
npm run dev

# Ou vérifier la config proxy dans vite.config.js
```

### **❌ "Tests fail"**
```bash
# Spécifier l'URL correcte
API_BASE_URL=http://localhost:3000 npm test

# Ou démarrer le bon serveur
npm run dev  # puis dans un autre terminal : npm test
```

### **❌ "Port already in use"**
```bash
# Changer le port
vercel dev --listen 3001

# Ou tuer le processus
sudo lsof -ti:3000 | xargs kill -9
```

---

## **📚 Ressources**

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vite Configuration](https://vitejs.dev/config/)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

---

## **💡 Conseil Final**

**Commencez par l'approche Vercel Dev** pour sa simplicité :
```bash
npm run dev
```

**Basculez vers Vite séparé** seulement si vous avez besoin du hot reload ultra-rapide pour du développement UI intensif.

**En production** : Tout fonctionne pareil sur Vercel ! 🚀 