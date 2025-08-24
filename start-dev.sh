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

# Démarrer le frontend en arrière-plan
echo "🌐 Démarrage du frontend (port 5173)..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Attendre que le frontend démarre
echo "⏳ Attente du démarrage du frontend..."
sleep 5

# Vérifier que le frontend fonctionne
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend démarré avec succès"
else
    echo "⚠️  Frontend en cours de démarrage..."
fi

echo ""
echo "🎯 ENVIRONNEMENT DE DÉVELOPPEMENT PRÊT"
echo ""
echo "📡 API Backend: http://localhost:3000"
echo "🌐 Frontend React: http://localhost:5173"
echo ""
echo "📋 Commandes utiles:"
echo "   - Arrêter tout: Ctrl+C"
echo "   - Logs API: tail -f api.log"
echo "   - Logs Frontend: tail -f frontend.log"
echo "   - Tests: npm test"
echo ""
echo "📱 Endpoints disponibles:"
echo "   - http://localhost:3000/health"
echo "   - http://localhost:3000/api/planning"
echo "   - http://localhost:3000/api/sms"
echo ""

# Fonction pour nettoyer à la sortie
cleanup() {
    echo ""
    echo "🔄 Arrêt des serveurs..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serveurs arrêtés"
    exit 0
}

# Intercepter Ctrl+C
trap cleanup INT

echo "⌨️  Appuyez sur Ctrl+C pour arrêter tous les serveurs"
echo "🔗 Ouvrez votre navigateur sur: http://localhost:5173"
echo ""

# Garder le script en vie et surveiller les processus
while true; do
    # Vérifier que les processus tournent encore
    if ! kill -0 $API_PID 2>/dev/null; then
        echo "❌ API arrêtée de manière inattendue"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend arrêté de manière inattendue"
        break
    fi
    sleep 2
done

cleanup
