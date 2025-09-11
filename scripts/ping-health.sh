#!/usr/bin/env bash
# scripts/ping-health.sh - Monitoring de santé
set -euo pipefail

HEALTH_URL="http://localhost:3000/health"
LOG_FILE="/var/log/ecole-health.log"
TIMEOUT=10

# Fonction de logging avec timestamp
log() {
    echo "[$(date -Iseconds)] $1" | tee -a "$LOG_FILE"
}

# Ping du health endpoint
if response=$(curl -sSf --max-time "$TIMEOUT" "$HEALTH_URL" 2>/dev/null); then
    # Vérifier que la réponse contient "OK"
    if echo "$response" | grep -q '"status":"OK"'; then
        log "✅ Health check OK"
        exit 0
    else
        log "⚠️ Health check: réponse inattendue: $response"
        exit 1
    fi
else
    log "❌ Health check FAILED - service indisponible"
    
    # Vérifier si les containers tournent
    if command -v docker >/dev/null 2>&1; then
        if docker ps --filter "name=ecole_app" --format "table {{.Names}}\t{{.Status}}" | grep -q "Up"; then
            log "📊 Container ecole_app est UP mais ne répond pas"
        else
            log "📊 Container ecole_app est DOWN"
        fi
    fi
    
    exit 1
fi
