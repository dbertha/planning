#!/usr/bin/env bash
# backup.sh - Script de sauvegarde PostgreSQL
set -euo pipefail

BACKUP_DIR="/srv/ecole-app/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/planning_backup_$TIMESTAMP.sql.gz"

# Créer le dossier de sauvegarde
mkdir -p "$BACKUP_DIR"

# Charger les variables d'environnement
if [ -f "/srv/ecole-app/.env" ]; then
    source "/srv/ecole-app/scripts/run_with_env.sh"
fi

# Vérifier que DATABASE_URL est définie
if [ -z "${DATABASE_URL:-}" ]; then
    echo "❌ DATABASE_URL non définie"
    exit 1
fi

echo "[$(date -Iseconds)] 🗄️ Début de la sauvegarde PostgreSQL"

# Extraire les informations de connexion
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

# Exporter le mot de passe pour pg_dump
export PGPASSWORD="$DB_PASS"

# Effectuer la sauvegarde via Docker (pg_dump depuis le conteneur PostgreSQL)
if docker compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"; then
    echo "[$(date -Iseconds)] ✅ Sauvegarde créée: $BACKUP_FILE"
    
    # Vérifier la taille du fichier
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date -Iseconds)] 📊 Taille: $BACKUP_SIZE"
    
    # Nettoyer les anciennes sauvegardes (garder 7 jours)
    find "$BACKUP_DIR" -name "planning_backup_*.sql.gz" -mtime +7 -delete
    echo "[$(date -Iseconds)] 🧹 Anciennes sauvegardes nettoyées (>7 jours)"
    
else
    echo "[$(date -Iseconds)] ❌ Échec de la sauvegarde"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Nettoyer la variable d'environnement
unset PGPASSWORD

echo "[$(date -Iseconds)] 🎯 Sauvegarde terminée avec succès"
