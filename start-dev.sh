#!/bin/bash

# Script pour démarrer le développement avec API + Frontend

echo "🚀 Démarrage de l'environnement de développement..."

# Tuer les processus existants
echo "🔄 Nettoyage des processus existants..."
pkill -f "node dev-server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null

# Attendre que les processus se terminent
sleep 2

# Charger l'environnement
source ~/.nvm/nvm.sh
nvm use 18
set -a
source .env.local
set +a

echo "📋 Variables chargées:"
echo "   - DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "   - SMS_ENABLED: $SMS_ENABLED"
echo "   - NODE_ENV: $NODE_ENV"

# Démarrer l'API en arrière-plan
echo "🔧 Démarrage du serveur API (port 3000)..."
npm run dev:api > api.log 2>&1 &
API_PID=$!

# Attendre que l'API démarre
echo "⏳ Attente du démarrage de l'API..."
sleep 3

# Vérifier que l'API fonctionne
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ API démarrée avec succès"
else
    echo "❌ Erreur démarrage API"
    cat api.log
    exit 1
fi

echo ""
echo "🎯 PRÊT POUR LE DÉVELOPPEMENT"
echo ""
echo "📡 API Backend: http://localhost:3000"
echo "🌐 Frontend: Lancez 'npm run dev' dans un autre terminal"
echo ""
echo "📋 Commandes utiles:"
echo "   - Arrêter API: kill $API_PID"
echo "   - Logs API: tail -f api.log"
echo "   - Tests: npm test"
echo ""
echo "📱 Endpoints disponibles:"
echo "   - http://localhost:3000/health"
echo "   - http://localhost:3000/api/planning"
echo "   - http://localhost:3000/api/sms"
echo ""
echo "💡 Pour démarrer le frontend:"
echo "   npm run dev"

# Garder le script en vie
echo "⌨️  Appuyez sur Ctrl+C pour arrêter l'API"
wait $API_PID
