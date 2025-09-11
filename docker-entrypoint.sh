#!/bin/sh
# docker-entrypoint.sh
set -e

echo "🚀 Démarrage de l'application Planning..."

# Vérifier les variables d'environnement critiques
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL non définie"
    exit 1
fi

echo "✅ Variables d'environnement validées"

# Fonction pour extraire les infos de DATABASE_URL
extract_db_info() {
    # Extraire host et port de DATABASE_URL
    # Format: postgresql://user:pass@host:port/dbname ou postgresql://user:pass@host/dbname
    
    # D'abord essayer avec port explicite
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:/]*\):[0-9]*\/.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    # Si pas de host trouvé, essayer sans port explicite
    if [ -z "$DB_HOST" ]; then
        DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^/]*\)\/.*/\1/p')
        DB_PORT=5432  # Port par défaut
    fi
    
    # Si toujours pas de port, utiliser le défaut
    if [ -z "$DB_PORT" ]; then
        DB_PORT=5432
    fi
    
    echo "DB_HOST: $DB_HOST, DB_PORT: $DB_PORT"
}

# Attendre que la base soit prête (si PostgreSQL local/containerisé)
if echo "$DATABASE_URL" | grep -q "localhost\|postgres:\|127\.0\.0\.1"; then
    echo "⏳ Attente de la base de données..."
    
    extract_db_info
    
    # Utiliser nc (netcat) au lieu de pg_isready qui n'est pas disponible
    until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
        echo "Base de données non prête ($DB_HOST:$DB_PORT), attente..."
        sleep 2
    done
    echo "✅ Base de données prête sur $DB_HOST:$DB_PORT"
else
    echo "ℹ️  Base de données externe détectée, pas d'attente nécessaire"
fi

# Servir les fichiers statiques et démarrer l'API
echo "🌐 Démarrage du serveur de production..."

# Démarrer l'application
exec "$@"
