#!/usr/bin/env bash
# scripts/deploy.sh
# Script de déploiement à exécuter *sur le serveur*.
# Exemples d'actions :
# - updater le code (git pull) — en pratique le workflow a déjà fait git pull, mais on garde l'étape en sécurité
# - rebuild et up des containers
# - exécuter migrations si existantes
# - vérifier healthchecks, rollout / rollback simple en cas d'erreur

set -euo pipefail
cd "$(dirname "$(realpath "$0")")/.."

LOGFILE="./logs/ecole-deploy.log"
echo "[$(date -Iseconds)] Début du déploiement" | tee -a "$LOGFILE"

# Config
COMPOSE_FILE="./docker-compose.yml"
APP_SERVICE_NAME="ecole_app"   # nom du container / service à adapter
MIGRATION_CMD="npm run migrate" # si ton image expose cette commande (optionnel)
BACKUP_SCRIPT="./backup.sh"     # local backup script (optionnel)

# 1. pull latest code (defensive)
git fetch --all --prune
git reset --hard origin/main

# 2. optional: local DB backup before deployment (best-effort)
if [ -x "$BACKUP_SCRIPT" ]; then
  echo "[$(date -Iseconds)] Lancement backup local avant migration" | tee -a "$LOGFILE"
  "$BACKUP_SCRIPT" || echo "Backup a échoué, mais on continue" | tee -a "$LOGFILE"
fi

# 3. Pull images if remote images used (optional)
# docker compose pull || true

# 4. Vérifier et initialiser SSL si nécessaire
if [ "${ENABLE_SSL:-}" = "true" ] && [ -n "${APP_DOMAIN:-}" ]; then
  if [ ! -f "certbot/conf/live/${APP_DOMAIN}/fullchain.pem" ]; then
    echo "[$(date -Iseconds)] Initialisation SSL pour ${APP_DOMAIN}" | tee -a "$LOGFILE"
    chmod +x init-letsencrypt.sh
    ./init-letsencrypt.sh
  else
    echo "[$(date -Iseconds)] Certificats SSL existants trouvés" | tee -a "$LOGFILE"
  fi
fi

# 5. Build & up : construire images locales et démarrer
echo "[$(date -Iseconds)] docker compose up -d --build --remove-orphans --force-recreate" | tee -a "$LOGFILE"
docker compose up -d --build --remove-orphans --force-recreate

# 5.1. Nettoyer et copier les fichiers statiques depuis le conteneur
echo "[$(date -Iseconds)] Nettoyage du volume partagé static_files" | tee -a "$LOGFILE"
docker compose exec -T nginx rm -rf /usr/share/nginx/html/* || echo "Nettoyage échoué, mais on continue" | tee -a "$LOGFILE"

echo "[$(date -Iseconds)] Vérification des fichiers statiques dans le conteneur" | tee -a "$LOGFILE"
if docker compose exec -T "$APP_SERVICE_NAME" ls -la /app/dist/ >/dev/null 2>&1; then
    echo "[$(date -Iseconds)] Fichiers statiques trouvés dans le conteneur:" | tee -a "$LOGFILE"
    docker compose exec -T "$APP_SERVICE_NAME" ls -la /app/dist/ | head -5 | tee -a "$LOGFILE"
    
    # Forcer la copie des fichiers statiques
    echo "[$(date -Iseconds)] Copie forcée des fichiers statiques vers nginx" | tee -a "$LOGFILE"
    docker compose exec -T "$APP_SERVICE_NAME" cp -r /app/dist/. /usr/share/nginx/html/ || echo "Copie échouée, mais on continue" | tee -a "$LOGFILE"
    
    # Vérifier le volume partagé après copie
    echo "[$(date -Iseconds)] Vérification du volume partagé static_files après copie" | tee -a "$LOGFILE"
    docker compose exec -T nginx ls -la /usr/share/nginx/html/ | head -5 | tee -a "$LOGFILE"
else
    echo "[$(date -Iseconds)] ⚠️ Fichiers statiques non trouvés dans le conteneur!" | tee -a "$LOGFILE"
fi

# 5.2. Forcer le rechargement de Nginx pour éviter les problèmes de cache
echo "[$(date -Iseconds)] Rechargement de Nginx pour appliquer les nouvelles ressources" | tee -a "$LOGFILE"
docker compose exec -T nginx nginx -s reload || echo "Nginx reload failed, but continuing" | tee -a "$LOGFILE"

# 5.3. Vérifier les timestamps et forcer le rechargement des fichiers statiques
echo "[$(date -Iseconds)] Vérification des timestamps des fichiers statiques" | tee -a "$LOGFILE"
docker compose exec -T nginx find /usr/share/nginx/html -name "*.js" -o -name "*.css" -exec ls -la {} \; | head -10 | tee -a "$LOGFILE"

# Vérifier que les fichiers sont récents (moins de 5 minutes)
CURRENT_TIME=$(date +%s)
OLD_FILES=$(docker compose exec -T nginx find /usr/share/nginx/html -name "*.js" -o -name "*.css" -mmin +5 2>/dev/null | wc -l)
if [ "$OLD_FILES" -gt 0 ]; then
    echo "[$(date -Iseconds)] ⚠️ $OLD_FILES fichiers statiques sont anciens, forçage de la copie..." | tee -a "$LOGFILE"
    docker compose exec -T "$APP_SERVICE_NAME" cp -r /app/dist/. /usr/share/nginx/html/ || echo "Copie forcée échouée" | tee -a "$LOGFILE"
else
    echo "[$(date -Iseconds)] ✅ Fichiers statiques récents détectés" | tee -a "$LOGFILE"
fi

echo "[$(date -Iseconds)] Rechargement de Nginx" | tee -a "$LOGFILE"
docker compose exec -T nginx nginx -s reload || echo "Nginx reload failed, but continuing" | tee -a "$LOGFILE"

# 5. Optionnel : lancer migrations si le service expose la commande
if docker compose ps --status running | grep -q "$APP_SERVICE_NAME"; then
  if docker compose exec -T "$APP_SERVICE_NAME" sh -lc "command -v node >/dev/null 2>&1 && test -f package.json"; then
    echo "[$(date -Iseconds)] Détection du service $APP_SERVICE_NAME : tentative de migrations" | tee -a "$LOGFILE"
    # Exemple : si ta container a un script npm run migrate
    set +e
    docker compose exec -T "$APP_SERVICE_NAME" sh -lc "$MIGRATION_CMD"
    MIG_RET=$?
    set -e
    if [ "$MIG_RET" -ne 0 ]; then
      echo "[$(date -Iseconds)] Attention : migrations ont échoué (code $MIG_RET). Voir logs." | tee -a "$LOGFILE"
      # Ne rollback pas automatiquement pour éviter perte, mais tu peux ajouter rollback ici
    else
      echo "[$(date -Iseconds)] Migrations OK" | tee -a "$LOGFILE"
    fi
  fi
fi

# 6. Health-check simple : attendre que l'app réponde (HTTP 200)
if [ "${ENABLE_SSL:-}" = "true" ] && [ -n "${APP_DOMAIN:-}" ]; then
  APP_HEALTH_URL="https://${APP_DOMAIN}/health"
else
  APP_HEALTH_URL="http://127.0.0.1:3000/health"
fi

RETRIES=15  # Plus de tentatives pour laisser le temps à SSL de se configurer
SLEEP=5
OK=0
for i in $(seq 1 $RETRIES); do
  if curl -fsS "$APP_HEALTH_URL" >/dev/null 2>&1; then
    OK=1
    break
  fi
  echo "[$(date -Iseconds)] En attente healthcheck ($i/$RETRIES) - $APP_HEALTH_URL..." | tee -a "$LOGFILE"
  sleep $SLEEP
done

if [ "$OK" -eq 1 ]; then
  echo "[$(date -Iseconds)] Healthcheck réussi." | tee -a "$LOGFILE"
else
  echo "[$(date -Iseconds)] Healthcheck a échoué après $RETRIES tentatives." | tee -a "$LOGFILE"
  echo "Consulte les logs : docker compose logs --tail 200" | tee -a "$LOGFILE"
  exit 2
fi

echo "[$(date -Iseconds)] Déploiement terminé avec succès" | tee -a "$LOGFILE"
