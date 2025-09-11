import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import des APIs (comme dev-server.js)
import authHandler from './api/auth.js';
import planningHandler from './api/planning.js';
import famillesHandler from './api/familles.js';
import smsHandler from './api/sms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));

// Middleware de logging (simplifié)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Middleware CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Routes API exactement comme dev-server.js
app.use('/api/auth', async (req, res, next) => {
  console.log('🔐 AUTH endpoint appelé');
  try {
    await authHandler(req, res);
  } catch (err) {
    console.error('❌ Erreur AUTH détaillée:', err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur serveur AUTH' });
    }
  }
});

app.use('/api/planning', async (req, res, next) => {
  console.log('📅 PLANNING endpoint appelé');
  try {
    await planningHandler(req, res);
  } catch (err) {
    console.error('❌ Erreur PLANNING détaillée:', err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur serveur PLANNING' });
    }
  }
});

app.use('/api/familles', async (req, res, next) => {
  console.log('👨‍👩‍👧‍👦 FAMILLES endpoint appelé');
  try {
    await famillesHandler(req, res);
  } catch (err) {
    console.error('❌ Erreur FAMILLES détaillée:', err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur serveur FAMILLES' });
    }
  }
});

app.use('/api/sms', async (req, res, next) => {
  console.log('📱 SMS endpoint appelé');
  try {
    await smsHandler(req, res);
  } catch (err) {
    console.error('❌ Erreur SMS détaillée:', err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erreur serveur SMS' });
    }
  }
});

// Route de santé
app.get('/health', (req, res) => {
  console.log('✅ Health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
    database: !!process.env.DATABASE_URL
  });
});

// Route de debug pour tester le driver DB
app.get('/debug/db', async (req, res) => {
  try {
    console.log('🔍 Debug DB - DATABASE_DRIVER:', process.env.DATABASE_DRIVER);
    const { query } = await import('./api/db.js');
    const result = await query('SELECT version() as version');
    res.json({
      driver: process.env.DATABASE_DRIVER !== 'postgres' ? 'Neon' : 'PostgreSQL',
      version: result.rows[0].version,
      success: true
    });
  } catch (err) {
    console.error('❌ Debug DB error:', err.message);
    res.status(500).json({
      error: err.message,
      driver: process.env.DATABASE_DRIVER !== 'postgres' ? 'Neon' : 'PostgreSQL',
      success: false
    });
  }
});

// Servir les fichiers statiques du build Vite
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Route catch-all pour SPA (React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Route par défaut pour développement
app.get('/', (req, res) => {
  res.json({ 
    message: 'Planning API Server (Production)', 
    endpoints: ['/api/auth', '/api/planning', '/api/familles', '/api/sms', '/health']
  });
});

// Gestion des erreurs globales
process.on('uncaughtException', (err) => {
  console.error('💥 Erreur non capturée:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rejetée:', reason);
  process.exit(1);
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 ================================');
  console.log(`🚀   SERVEUR DE PRODUCTION`);
  console.log('🚀 ================================');
  console.log(`🌐 API Server: http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   • http://localhost:${PORT}/health`);
  console.log(`   • http://localhost:${PORT}/api/auth`);
  console.log(`   • http://localhost:${PORT}/api/planning`);
  console.log(`   • http://localhost:${PORT}/api/familles`);
  console.log(`   • http://localhost:${PORT}/api/sms`);
  console.log(`📋 Variables d'environnement:`);
  console.log(`   • DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`   • NODE_ENV: ${process.env.NODE_ENV || 'production'}`);
  console.log('🚀 ================================\n');
});

export default app;
