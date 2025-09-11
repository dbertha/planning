# Dockerfile pour l'application Planning
FROM node:18-alpine

# Installer curl pour healthcheck et netcat pour attendre la DB
RUN apk add --no-cache curl netcat-openbsd

# Créer le répertoire de l'app
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances (sans Neon) - Force no cache
RUN npm ci --only=production || npm install --only=production

# Copier le code source
COPY . .

# Construire le frontend
RUN npm run build

# Créer les dossiers nécessaires
RUN mkdir -p logs backups

# Exposer les ports
EXPOSE 3000 5173

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Démarrer l'application
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "prod"]
