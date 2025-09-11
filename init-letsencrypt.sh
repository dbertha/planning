#!/bin/bash
# init-letsencrypt.sh - Initialisation automatique des certificats Let's Encrypt
set -euo pipefail

# Charger les variables d'environnement
if [ -f ".env" ]; then
    source .env
fi

# Variables requises
DOMAIN="${APP_DOMAIN:-}"
EMAIL="${APP_EMAIL:-}"
STAGING="${LETSENCRYPT_STAGING:-0}" # Set to 1 for testing

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "❌ Erreur: APP_DOMAIN et APP_EMAIL doivent être définis dans .env"
    echo "   APP_DOMAIN=$DOMAIN"
    echo "   APP_EMAIL=$EMAIL"
    exit 1
fi

echo "🔐 Initialisation Let's Encrypt pour $DOMAIN"

# Créer les dossiers nécessaires
mkdir -p certbot/conf certbot/www

# Télécharger les paramètres SSL recommandés
if [ ! -f "certbot/conf/options-ssl-nginx.conf" ] || [ ! -f "certbot/conf/ssl-dhparams.pem" ]; then
    echo "⬇️  Téléchargement des paramètres SSL..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > certbot/conf/options-ssl-nginx.conf
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > certbot/conf/ssl-dhparams.pem
fi

# Créer un certificat temporaire pour démarrer Nginx
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo "📜 Création d'un certificat temporaire pour $DOMAIN..."
    mkdir -p "certbot/conf/live/$DOMAIN"
    
    # Générer un certificat auto-signé temporaire
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "certbot/conf/live/$DOMAIN/privkey.pem" \
        -out "certbot/conf/live/$DOMAIN/fullchain.pem" \
        -subj "/CN=$DOMAIN" 2>/dev/null
    
    echo "✅ Certificat temporaire créé"
fi

# Préparer la configuration Nginx avec le bon domaine
echo "🔧 Configuration de Nginx pour $DOMAIN..."
sed "s/APP_DOMAIN_PLACEHOLDER/$DOMAIN/g" nginx-ssl.conf > nginx.conf

# Démarrer Nginx avec le certificat temporaire
echo "🚀 Démarrage de Nginx..."
docker compose up -d nginx

# Attendre que Nginx soit prêt
echo "⏳ Attente du démarrage de Nginx..."
sleep 10

# Supprimer le certificat temporaire
echo "🗑️  Suppression du certificat temporaire..."
rm -rf "certbot/conf/live/$DOMAIN"

# Déterminer l'URL Certbot (staging ou production)
if [ "$STAGING" != "0" ]; then
    CERTBOT_URL="--staging"
    echo "⚠️  Mode STAGING activé (certificat de test)"
else
    CERTBOT_URL=""
    echo "🔒 Mode PRODUCTION (certificat réel)"
fi

# Obtenir le vrai certificat Let's Encrypt
echo "🔐 Demande du certificat Let's Encrypt pour $DOMAIN..."
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    $CERTBOT_URL \
    -d "$DOMAIN"

# Redémarrer Nginx avec le nouveau certificat
echo "🔄 Redémarrage de Nginx avec le certificat SSL..."
docker compose restart nginx

# Vérifier que HTTPS fonctionne
echo "✅ Vérification du certificat SSL..."
sleep 5

if curl -sSf "https://$DOMAIN/health" >/dev/null 2>&1; then
    echo "🎉 SUCCESS! HTTPS configuré avec succès pour $DOMAIN"
    echo "🔗 Votre site est accessible sur: https://$DOMAIN"
    
    # Afficher les informations du certificat
    echo ""
    echo "📋 Informations du certificat:"
    docker compose run --rm certbot certificates
    
else
    echo "❌ Erreur: HTTPS ne fonctionne pas correctement"
    echo "🔍 Vérifiez les logs:"
    echo "   docker compose logs nginx"
    echo "   docker compose logs certbot"
    exit 1
fi

echo ""
echo "🔄 Le renouvellement automatique est configuré :"
echo "   - Vérification: toutes les 12h"
echo "   - Renouvellement: 30 jours avant expiration"
echo "   - Reload Nginx: toutes les 6h"
echo ""
echo "🎯 Configuration SSL terminée avec succès!"
