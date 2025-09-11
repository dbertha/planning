# 🚀 Guide de Migration Vercel → VPS

## 📋 **Checklist de Migration**

### **Phase 1: Préparation VPS**
```bash
# 1. Initialiser le VPS (depuis votre machine locale)
./init_server.sh root@VOTRE_IP_VPS

# 2. Configurer les clés SSH sur GitHub
# - Créer une clé SSH dédiée pour le déploiement
# - Ajouter la clé publique dans /home/ecole/.ssh/authorized_keys sur le VPS
# - Ajouter la clé privée comme secret DEPLOY_SSH_PRIVATE_KEY sur GitHub
```

### **Phase 2: Configuration Secrets GitHub**
```bash
# Secrets à configurer sur GitHub :
DEPLOY_SSH_PRIVATE_KEY=<clé_privée_ssh>
DEPLOY_SSH_USER=ecole
DEPLOY_SSH_HOST=VOTRE_IP_VPS
DEPLOY_SECRETS=<base64_encode_du_fichier_.env>
```

### **Phase 3: Variables d'Environnement**
```bash
# Créer le fichier .env sur le VPS avec :
DATABASE_URL=postgresql://ecole:PASSWORD@postgres:5432/planning
DATABASE_PASSWORD=votre_mot_de_passe_postgres
SMS_ENABLED=true
TWILIO_SID=votre_sid_twilio
TWILIO_AUTH_TOKEN=votre_token_twilio
TWILIO_SENDER=votre_numero_twilio
ADMIN_SALT=votre_salt_securise
DEFAULT_ADMIN_PASSWORD=votre_mot_de_passe_admin
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://votre-domaine.com

# Configuration SSL Let's Encrypt (NOUVEAU)
APP_DOMAIN=votre-domaine.com
APP_EMAIL=admin@votre-domaine.com
ENABLE_SSL=true
LETSENCRYPT_STAGING=0  # 1 pour les tests, 0 pour production
```

## 🔧 **Commandes de Déploiement**

### **Déploiement Initial**
```bash
# Sur le VPS, en tant qu'utilisateur ecole
cd /srv/ecole-app
git clone https://github.com/votre-repo/planning.git .
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# Construire et démarrer
docker compose up -d --build
```

### **Déploiements Suivants**
```bash
# Via GitHub Actions (automatique sur push main)
git push origin main

# Ou manuellement sur le VPS
cd /srv/ecole-app
./scripts/deploy.sh
```

## 📊 **Monitoring & Maintenance**

### **Vérifications de Santé**
```bash
# Health check
curl http://localhost:3000/health

# Logs containers
docker compose logs -f ecole_app
docker compose logs -f postgres

# Statut des services
docker compose ps
```

### **Sauvegardes**
```bash
# Sauvegarde manuelle
./backup.sh

# Les sauvegardes automatiques sont configurées via cron :
# - Tous les jours à 2h00 : sauvegarde DB
# - Tous les dimanches à 3h30 : nettoyage anciennes sauvegardes
```

### **Gestion des Logs**
```bash
# Logs application
tail -f /var/log/ecole-deploy.log
tail -f /var/log/ecole-health.log

# Logs Docker
docker compose logs --tail=100 ecole_app
```

## 🔐 **Sécurité**

### **Firewall (UFW)**
```bash
# Ports ouverts par défaut :
# - 22/tcp (SSH)
# - 80/tcp (HTTP)
# - 443/tcp (HTTPS)

# Vérifier le statut
sudo ufw status
```

### **SSL/HTTPS avec Let's Encrypt (Automatique) 🔒**
Le SSL est configuré automatiquement si `ENABLE_SSL=true` dans votre `.env` :

```bash
# Initialisation manuelle SSL (si nécessaire)
./init-letsencrypt.sh

# Renouvellement manuel
npm run ssl:renew

# Vérifier les certificats
docker compose run --rm certbot certificates

# Tester en mode staging (certificats de test)
LETSENCRYPT_STAGING=1 ./init-letsencrypt.sh
```

**Fonctionnalités SSL :**
- ✅ **Certificats gratuits** Let's Encrypt
- ✅ **Renouvellement automatique** (tous les jours à midi)
- ✅ **Redirection HTTP → HTTPS** automatique
- ✅ **Headers de sécurité** (HSTS, CSP, etc.)
- ✅ **Configuration SSL A+** (Mozilla Intermediate)
- ✅ **Support HTTP/2**

## 🚨 **Résolution de Problèmes**

### **Service ne démarre pas**
```bash
# Vérifier les logs
docker compose logs ecole_app

# Vérifier les variables d'environnement
docker compose exec ecole_app env | grep DATABASE_URL

# Redémarrer les services
docker compose restart
```

### **Base de données inaccessible**
```bash
# Vérifier PostgreSQL
docker compose exec postgres pg_isready -U ecole

# Se connecter à la DB
docker compose exec postgres psql -U ecole -d planning
```

### **Problèmes de déploiement**
```bash
# Vérifier les permissions
ls -la /srv/ecole-app/scripts/deploy.sh

# Vérifier les clés SSH
ssh -T ecole@VOTRE_IP_VPS

# Logs GitHub Actions
# Voir l'onglet Actions de votre repo GitHub
```

## 📈 **Performance & Optimisations**

### **Monitoring Ressources**
```bash
# CPU/RAM
docker stats

# Espace disque
df -h
du -sh /srv/ecole-app/backups/

# Logs Nginx
tail -f /var/log/nginx/access.log
```

### **Optimisations**
- **Rate limiting** : Configuré dans `nginx.conf`
- **Compression gzip** : Activée pour les assets
- **Cache statique** : 1 an pour JS/CSS, 5min pour HTML
- **Healthchecks** : Toutes les 30s pour l'app, 10s pour PostgreSQL

## 🎯 **Migration Réussie !**

Votre application Planning fonctionne maintenant sur VPS avec :
- ✅ **Docker Compose** pour l'orchestration
- ✅ **Nginx** comme reverse proxy
- ✅ **PostgreSQL** containerisé
- ✅ **Sauvegardes automatiques** via cron
- ✅ **Déploiement automatique** via GitHub Actions
- ✅ **Monitoring de santé** intégré
- ✅ **SSL ready** (certificats à ajouter)

L'application est accessible sur `http://VOTRE_IP_VPS` et prête pour la production ! 🚀
