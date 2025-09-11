#!/usr/bin/env bash
# fix-permissions.sh
# Script à exécuter avec sudo pour corriger les permissions et permettre à l'utilisateur ecole
# d'initialiser SSL et gérer les certificats Let's Encrypt

set -euo pipefail

echo "🔧 Correction des permissions pour l'utilisateur ecole..."

# Donner accès complet à l'utilisateur ecole sur son répertoire de travail
chown -R ecole:ecole /srv/ecole-app/

# Corriger les permissions du dossier certbot si il existe
if [ -d "/srv/ecole-app/certbot" ]; then
    echo "📁 Correction des permissions certbot..."
    chown -R ecole:ecole /srv/ecole-app/certbot/
    chmod -R 755 /srv/ecole-app/certbot/
fi

# Permettre à ecole d'exécuter docker sans sudo (si pas déjà fait)
if ! groups ecole | grep -q docker; then
    echo "🐳 Ajout de l'utilisateur ecole au groupe docker..."
    usermod -aG docker ecole
    echo "⚠️  L'utilisateur ecole doit se reconnecter pour que les changements prennent effet"
fi

# Créer le dossier de logs si nécessaire
mkdir -p /srv/ecole-app/logs
chown ecole:ecole /srv/ecole-app/logs

echo "✅ Permissions corrigées ! L'utilisateur ecole peut maintenant :"
echo "   - Gérer les certificats SSL"
echo "   - Exécuter les scripts de déploiement"
echo "   - Accéder aux logs"
