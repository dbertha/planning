#!/bin/bash

# Script pour configurer automatiquement les variables d'environnement Vercel
# à partir de .env.local

echo "🚀 Configuration automatique des variables Vercel..."

# Source du fichier .env.local
if [ ! -f .env.local ]; then
    echo "❌ Fichier .env.local non trouvé"
    exit 1
fi

# Extraction des variables nécessaires depuis .env.local
source .env.local

# Variables obligatoires à configurer sur Vercel
declare -A VERCEL_VARS=(
    ["ADMIN_SALT"]="planning_admin_salt_2024"  # Valeur par défaut si manquante
    ["SMS_ENABLED"]="${SMS_ENABLED:-true}"
    ["SMS_PROVIDER"]="twilio"  # Forcer twilio
    ["NODE_ENV"]="production"  # OBLIGATOIRE: production pour Vercel
    ["TWILIO_SID"]="${TWILIO_SID}"
    ["TWILIO_AUTH_TOKEN"]="${TWILIO_AUTH_TOKEN}"
    ["TWILIO_SENDER"]="${TWILIO_SENDER}"
    ["TEST_PHONE_NUMBER"]="${SMS_SENDER}"  # Utiliser SMS_SENDER comme numéro de test
)

echo "📋 Variables à configurer :"
for var in "${!VERCEL_VARS[@]}"; do
    value="${VERCEL_VARS[$var]}"
    if [[ "$var" == *"TOKEN"* ]] || [[ "$var" == *"SALT"* ]]; then
        echo "   $var = ***HIDDEN***"
    else
        echo "   $var = $value"
    fi
done

echo ""
read -p "Continuer avec la configuration ? (y/N): " confirm

if [[ $confirm != [yY] ]]; then
    echo "❌ Configuration annulée"
    exit 0
fi

echo ""
echo "🔧 Configuration des variables sur Vercel..."

# Fonction pour ajouter une variable
add_vercel_env() {
    local var_name=$1
    local var_value=$2
    
    if [ -z "$var_value" ]; then
        echo "⚠️  Valeur vide pour $var_name, ignoré"
        return
    fi
    
    echo "➕ Ajout de $var_name..."
    
    # Ajouter pour Production, Preview et Development
    echo "$var_value" | vercel env add "$var_name" production --yes 2>/dev/null
    echo "$var_value" | vercel env add "$var_name" preview --yes 2>/dev/null
    echo "$var_value" | vercel env add "$var_name" development --yes 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "   ✅ $var_name configuré"
    else
        echo "   ⚠️  $var_name peut déjà exister ou erreur"
    fi
}

# Configuration de chaque variable
for var in "${!VERCEL_VARS[@]}"; do
    add_vercel_env "$var" "${VERCEL_VARS[$var]}"
done

echo ""
echo "🔍 Vérification des variables configurées..."
vercel env ls

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Vérifier les variables : vercel env ls"
echo "   2. Tester localement : npm run check:env"
echo "   3. Déployer : vercel --prod"
echo "   4. Tester le déploiement : curl https://planning-lac.vercel.app/api/planning"
