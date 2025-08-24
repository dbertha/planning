import { 
  query,
  validateTokenAndGetPlanning, 
  authenticateAdmin, 
  validateAdminSession,
  cleanExpiredSessions,
  createPlanning
} from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method } = req;

  switch (method) {
    case 'GET':
      return await handleGet(req, res);
    case 'POST':
      return await handlePost(req, res);
    case 'DELETE':
      return await handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res) {
  try {
    const { action, session_token } = req.query;

    switch (action) {
      case 'check_session':
        // Vérifier si une session admin est valide
        if (!session_token) {
          return res.status(400).json({ error: 'Token de session requis' });
        }

        // Nettoyer les sessions expirées
        await cleanExpiredSessions();

        const sessionInfo = await validateAdminSession(session_token);
        
        if (!sessionInfo.isAdmin) {
          return res.status(401).json({ 
            isAdmin: false,
            error: 'Session expirée ou invalide' 
          });
        }

        res.status(200).json({
          isAdmin: true,
          planning: {
            token: sessionInfo.planning.token,
            name: sessionInfo.planning.name,
            description: sessionInfo.planning.description,
            year: sessionInfo.planning.annee_scolaire
          },
          session: {
            expires_at: sessionInfo.session.expires_at
          }
        });
        break;

      case 'planning_info':
        // Obtenir les infos d'un planning (public)
        const { token } = req.query;
        if (!token) {
          return res.status(400).json({ error: 'Token de planning requis' });
        }

        const planning = await validateTokenAndGetPlanning(token);
        const hasAdminPassword = !!planning.admin_password_hash;

        res.status(200).json({
          token: planning.token,
          name: planning.name,
          description: planning.description,
          year: planning.annee_scolaire,
          hasAdminPassword,
          isPublic: !hasAdminPassword // Planning public si pas de mot de passe admin
        });
        break;

      default:
        return res.status(400).json({ error: 'Action non valide' });
    }
  } catch (error) {
    console.error('Erreur GET auth:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handlePost(req, res) {
  try {
    const { action, data } = req.body;

    switch (action) {
      case 'login':
        // Connexion admin
        const { token, password } = data;
        
        if (!token || !password) {
          return res.status(400).json({ error: 'Token et mot de passe requis' });
        }

        try {
          const authResult = await authenticateAdmin(token, password);
          
          res.status(200).json({
            success: true,
            sessionToken: authResult.sessionToken,
            expiresAt: authResult.expiresAt,
            planning: {
              token: authResult.planning.token,
              name: authResult.planning.name,
              description: authResult.planning.description,
              year: authResult.planning.annee_scolaire
            }
          });
        } catch (authError) {
          res.status(401).json({ 
            error: authError.message,
            success: false 
          });
        }
        break;

      case 'create_planning':
        // Créer un nouveau planning (avec ou sans mot de passe admin)
        const { name, description, year, adminPassword, customToken } = data;
        
        if (!name) {
          return res.status(400).json({ error: 'Nom du planning requis' });
        }

        // Utiliser le mot de passe par défaut si pas fourni
        const finalPassword = adminPassword || process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        
        const newPlanning = await createPlanning(
          name, 
          description, 
          parseInt(year) || new Date().getFullYear(),
          finalPassword,
          customToken
        );

        // Si un mot de passe admin est fourni, créer automatiquement une session
        let sessionToken = null;
        let expiresAt = null;
        
        if (adminPassword) {
          const authResult = await authenticateAdmin(newPlanning.token, adminPassword);
          sessionToken = authResult.sessionToken;
          expiresAt = authResult.expiresAt;
        }

        res.status(201).json({
          success: true,
          planning: newPlanning,
          url: `${req.headers.host || 'localhost'}?token=${newPlanning.token}`,
          sessionToken,
          expiresAt,
          isAdmin: !!adminPassword
        });
        break;

      default:
        res.status(400).json({ error: 'Action non supportée' });
    }
  } catch (error) {
    console.error('Erreur POST auth:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function handleDelete(req, res) {
  try {
    const { action, data } = req.body;

    switch (action) {
      case 'logout':
        // Déconnexion admin (supprimer la session)
        const { sessionToken } = data;
        
        if (!sessionToken) {
          return res.status(400).json({ error: 'Token de session requis' });
        }

        await query(
          'DELETE FROM admin_sessions WHERE session_token = $1',
          [sessionToken]
        );

        res.status(200).json({ 
          success: true,
          message: 'Déconnexion réussie' 
        });
        break;

      default:
        res.status(400).json({ error: 'Action non supportée' });
    }
  } catch (error) {
    console.error('Erreur DELETE auth:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
} 