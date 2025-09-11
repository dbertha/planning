#!/usr/bin/env bash
# setup-ssl.sh
# Script pour configurer SSL Let's Encrypt après correction des permissions
# À exécuter en tant qu'utilisateur ecole

set -euo pipefail

cd "$(dirname "$(realpath "$0")")"

echo "🔐 Configuration SSL Let's Encrypt pour ${APP_DOMAIN:-entretien.laec.be}"

# Vérifier que les variables d'environnement sont chargées
if [ -f ".env" ]; then
    source .env
fi

if [ -z "${APP_DOMAIN:-}" ]; then
    echo "❌ APP_DOMAIN non défini dans .env"
    exit 1
fi

if [ -z "${APP_EMAIL:-}" ]; then
    echo "❌ APP_EMAIL non défini dans .env"
    exit 1
fi

echo "📧 Email: ${APP_EMAIL}"
echo "🌐 Domaine: ${APP_DOMAIN}"

# Initialiser Let's Encrypt
if [ -f "init-letsencrypt.sh" ]; then
    echo "🚀 Lancement de l'initialisation SSL..."
    chmod +x init-letsencrypt.sh
    ./init-letsencrypt.sh
else
    echo "❌ Script init-letsencrypt.sh non trouvé"
    exit 1
fi

echo "✅ Configuration SSL terminée !"
echo "🌍 Votre site devrait maintenant être accessible en HTTPS: https://${APP_DOMAIN}"
