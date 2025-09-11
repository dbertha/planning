#!/usr/bin/env bash
# init_server.sh
# Usage: ./init_server.sh root@IP_DU_VPS
# Script à exécuter depuis ta machine locale pour préparer un VPS Ubuntu 22.04 minimal.
# Il installe docker/docker-compose, crée un user deploy, configure ufw, crée dossiers,
# et place une clé publique placeholder dans authorized_keys (à remplacer par la clé publique
# de GitHub Actions / ton deploy key).

set -euo pipefail

SSH_TARGET="${1:-}"
if [ -z "$SSH_TARGET" ]; then
  echo "Usage: $0 root@IP_DU_VPS"
  exit 2
fi

# Paramètres (tu peux les modifier)
APP_USER="ecole"
APP_BASE="/srv/ecole-app"
SSH_PUB_PLACEHOLDER="ssh-ed25519 AAAA...YOUR_PUBLIC_KEY_PLACEHOLDER... deploy-key"

echo "=== Initialisation du VPS : $SSH_TARGET ==="

# --- Copier et exécuter le bootstrap sur le VPS ---
ssh -o StrictHostKeyChecking=no "$SSH_TARGET" bash -s <<'REMOTE'
set -euo pipefail

APP_USER="ecole"
APP_BASE="/srv/ecole-app"
SSH_PUB_PLACEHOLDER="ssh-ed25519 AAAA...YOUR_PUBLIC_KEY_PLACEHOLDER... deploy-key"

# 1) Update & packages
apt update && apt upgrade -y
apt install -y curl git apt-transport-https ca-certificates gnupg lsb-release ufw

# 2) Docker install (official)
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
fi

# docker-compose (plugin)
if ! docker compose version >/dev/null 2>&1; then
  apt install -y docker-compose-plugin
fi

systemctl enable docker
systemctl start docker

# 3) Create app user and add to docker group
if ! id "$APP_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "App user" "$APP_USER"
  usermod -aG docker "$APP_USER"
fi

# 4) UFW basic rules (SSH, HTTP, HTTPS)
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 5) Create folders
mkdir -p "$APP_BASE"/{app,postgres-data,backups,logs}
chown -R "$APP_USER":"$APP_USER" "$APP_BASE"
chmod 750 "$APP_BASE"

# 6) Setup deploy SSH authorized_keys for $APP_USER
USER_SSH_DIR="/home/$APP_USER/.ssh"
mkdir -p "$USER_SSH_DIR"
chown "$APP_USER:$APP_USER" "$USER_SSH_DIR"
chmod 700 "$USER_SSH_DIR"

# Add placeholder key if authorized_keys missing (user will replace via SSH later)
AUTHORIZED_KEYS="$USER_SSH_DIR/authorized_keys"
if [ ! -f "$AUTHORIZED_KEYS" ] || ! grep -q "deploy-key" "$AUTHORIZED_KEYS" 2>/dev/null; then
  echo "$SSH_PUB_PLACEHOLDER" >> "$AUTHORIZED_KEYS"
  chown "$APP_USER:$APP_USER" "$AUTHORIZED_KEYS"
  chmod 600 "$AUTHORIZED_KEYS"
fi

# 7) Create a minimal deploy script place-holder (owned by app user)
DEPLOY_SH="$APP_BASE/deploy.sh"
cat > "$DEPLOY_SH" <<'DEPLOY'
#!/usr/bin/env bash
set -euo pipefail
echo "Placeholder deploy script. Replace with your scripts/deploy.sh from repo."
DEPLOY
chown "$APP_USER:$APP_USER" "$DEPLOY_SH"
chmod 750 "$DEPLOY_SH"

# 8) Allow passwordless sudo for docker group actions if needed (commented by default)
# echo "%docker ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose" > /etc/sudoers.d/docker-nopasswd

echo "=== VPS bootstrap completed ==="
REMOTE

echo "=== FIN : vérifie que tu as remplacé la clé publique placeholder par la clé publique réelle de GitHub Actions dans /home/$APP_USER/.ssh/authorized_keys ==="
echo "Pense à créer la clé privée correspondante localement et à l'ajouter comme secret DEPLOY_SSH_PRIVATE_KEY sur GitHub."
