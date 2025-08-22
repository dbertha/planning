import { 
  query, 
  initDatabase, 
  validateTokenAndGetPlanning, 
  createPlanning, 
  getAvailableFamiliesForCell, 
  isCellAvailable,
  validateAdminSession,
  toggleSemainePublication
} from './db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Initialiser la base de données au premier appel
  await initDatabase();
  
  const { method } = req;

  switch (method) {
    case 'GET':
      return await handleGet(req, res);
    case 'POST':
      return await handlePost(req, res);
    case 'PUT':
      return await handlePut(req, res);
    case 'DELETE':
      return await handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// Fonction utilitaire pour vérifier les permissions
async function checkAdminPermission(req, requireAdmin = true) {
  const sessionToken = req.headers['x-admin-session'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!sessionToken && requireAdmin) {
    throw new Error('ADMIN_REQUIRED: Session admin requise pour cette opération');
  }
  
  if (sessionToken) {
    const sessionInfo = await validateAdminSession(sessionToken);
    return {
      isAdmin: sessionInfo.isAdmin,
      planning: sessionInfo.planning
    };
  }
  
  return { isAdmin: false, planning: null };
}

async function handleGet(req, res) {
  try {
    const { token, type, action, classe_id, semaine_id } = req.query;
    
    // Cas spécial : obtenir les familles disponibles pour une cellule (classe + semaine)
    if (action === 'available_families') {
      if (!token || !classe_id || !semaine_id) {
        return res.status(400).json({ error: 'Token, classe_id et semaine_id requis' });
      }
      
      const planning = await validateTokenAndGetPlanning(token);
      const availableFamilies = await getAvailableFamiliesForCell(classe_id, semaine_id, planning.id);
      
      return res.status(200).json(availableFamilies);
    }

    // Cas spécial : vérifier si une cellule est libre
    if (action === 'check_cell') {
      if (!token || !classe_id || !semaine_id) {
        return res.status(400).json({ error: 'Token, classe_id et semaine_id requis' });
      }
      
      const planning = await validateTokenAndGetPlanning(token);
      const isAvailable = await isCellAvailable(classe_id, semaine_id, planning.id);
      
      return res.status(200).json({ available: isAvailable });
    }

    // Validation du token pour toutes les autres opérations
    if (!token) {
      return res.status(400).json({ error: 'Token requis dans l\'URL' });
    }

    const planning = await validateTokenAndGetPlanning(token);
    
    // Vérifier les permissions
    const authInfo = await checkAdminPermission(req, false);
    const isAdmin = authInfo.isAdmin;
    
    if (type === 'full') {
      // Récupérer toutes les données du planning avec les nouvelles relations
      const classesResult = await query(
        'SELECT * FROM classes WHERE planning_id = $1 ORDER BY ordre, id',
        [planning.id]
      );
      
      // Filtrer les semaines selon les permissions
      let semainesQuery = 'SELECT * FROM semaines WHERE planning_id = $1';
      if (!isAdmin) {
        semainesQuery += ' AND is_published = true';
      }
      semainesQuery += ' ORDER BY debut';
      
      const semainesResult = await query(semainesQuery, [planning.id]);
      
      const famillesResult = await query(
        'SELECT * FROM familles WHERE planning_id = $1 AND is_active = true ORDER BY nom',
        [planning.id]
      );
      
      // Filtrer les affectations selon les semaines visibles
      const semainesIds = semainesResult.rows.map(s => s.id);
      let affectationsResult = { rows: [] };
      
      if (semainesIds.length > 0) {
        const placeholders = semainesIds.map((_, i) => `$${i + 2}`).join(',');
        affectationsResult = await query(`
          SELECT a.*, 
                 f.nom as famille_nom, 
                 f.telephone as famille_telephone,
                 f.nb_nettoyage,
                 f.classes_preferences,
                 c.nom as classe_nom, 
                 c.couleur as classe_couleur,
                 s.debut, s.fin, s.type as semaine_type, s.description as semaine_description,
                 s.is_published, s.published_at,
                 CASE 
                   WHEN a.classe_id = ANY(f.classes_preferences) THEN 'Classe préférée'
                   ELSE 'Assignation normale'
                 END as preference_description
          FROM affectations a
          LEFT JOIN familles f ON a.famille_id = f.id
          LEFT JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
          LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
          WHERE a.planning_id = $1 AND a.semaine_id IN (${placeholders})
          ORDER BY s.debut, c.ordre, c.id
        `, [planning.id, ...semainesIds]);
      }

      const data = {
        planning: {
          name: planning.name,
          description: planning.description,
          year: planning.annee_scolaire,
          token: planning.token
        },
        classes: classesResult.rows,
        semaines: semainesResult.rows,
        familles: isAdmin ? famillesResult.rows : [], // Familles visibles seulement pour admin
        affectations: affectationsResult.rows.map(row => ({
          id: row.id,
          familleId: row.famille_id,
          classeId: row.classe_id,
          semaineId: row.semaine_id,
          notes: row.notes,
          // Données enrichies pour l'affichage
          familleNom: row.famille_nom,
          familleTelephone: isAdmin ? row.famille_telephone : null, // Téléphone seulement pour admin
          classeNom: row.classe_nom,
          classeCouleur: row.classe_couleur,
          semaineDebut: row.debut,
          semaineFin: row.fin,
          semaineType: row.semaine_type,
          semaineDescription: row.semaine_description,
          semainePublished: row.is_published,
          semainePublishedAt: row.published_at,
          preferenceDescription: row.preference_description
        })),
        permissions: {
          isAdmin,
          canEdit: isAdmin
        }
      };

      res.status(200).json(data);
    } else {
      // Récupérer par type spécifique
      let result;
      switch (type) {
        case 'classes':
          result = await query('SELECT * FROM classes WHERE planning_id = $1 ORDER BY ordre, id', [planning.id]);
          break;
        case 'semaines':
          let semainesQuery = 'SELECT * FROM semaines WHERE planning_id = $1';
          if (!isAdmin) {
            semainesQuery += ' AND is_published = true';
          }
          semainesQuery += ' ORDER BY debut';
          result = await query(semainesQuery, [planning.id]);
          break;
        case 'familles':
          if (!isAdmin) {
            return res.status(403).json({ error: 'Accès interdit : informations familles réservées aux administrateurs' });
          }
          result = await query('SELECT * FROM familles WHERE planning_id = $1 AND is_active = true ORDER BY nom', [planning.id]);
          break;
        case 'affectations':
          // Filtrer selon les semaines publiées pour les non-admin
          let affectationsQuery = `
            SELECT a.*, f.nom as famille_nom, c.nom as classe_nom, s.debut as semaine_debut, s.is_published
            FROM affectations a
            LEFT JOIN familles f ON a.famille_id = f.id
            LEFT JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
            LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
            WHERE a.planning_id = $1`;
          
          if (!isAdmin) {
            affectationsQuery += ' AND s.is_published = true';
          }
          
          affectationsQuery += ' ORDER BY s.debut, c.id';
          result = await query(affectationsQuery, [planning.id]);
          break;
        case 'stats':
          const stats = await query(`
            SELECT 
              COUNT(DISTINCT f.id) as total_familles,
              COUNT(DISTINCT c.id) as total_classes,
              COUNT(DISTINCT s.id) as total_semaines,
              COUNT(DISTINCT s.id) FILTER (WHERE s.is_published = true) as semaines_publiees,
              COUNT(a.id) as total_affectations,
              COUNT(a.id) FILTER (WHERE a.classe_id = ANY(f.classes_preferences)) as affectations_preferees,
              ROUND(COUNT(a.id)::decimal / NULLIF((COUNT(DISTINCT c.id) * COUNT(DISTINCT s.id)), 0) * 100, 2) as taux_remplissage
            FROM familles f
            FULL OUTER JOIN classes c ON c.planning_id = f.planning_id
            FULL OUTER JOIN semaines s ON s.planning_id = f.planning_id
            FULL OUTER JOIN affectations a ON a.planning_id = f.planning_id AND a.famille_id = f.id
            WHERE f.planning_id = $1 OR c.planning_id = $1 OR s.planning_id = $1 OR a.planning_id = $1
          `, [planning.id]);
          result = { rows: [stats.rows[0]] };
          break;
        case 'info':
          return res.status(200).json({
            name: planning.name,
            description: planning.description,
            year: planning.annee_scolaire,
            created_at: planning.created_at,
            token: planning.token,
            hasAdminPassword: !!planning.admin_password_hash,
            isAdmin,
            canEdit: isAdmin
          });
        default:
          return res.status(400).json({ error: 'Type non valide' });
      }
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.error('Erreur GET planning:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('ADMIN_REQUIRED')) {
      res.status(403).json({ error: 'Accès administrateur requis' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handlePost(req, res) {
  try {
    // Vérifier les permissions admin pour toute modification
    await checkAdminPermission(req, true);
    
    const { token, type, data } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    switch (type) {
      case 'classe':
        const classeResult = await query(
          'INSERT INTO classes (id, planning_id, nom, couleur, ordre, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [data.id, planning.id, data.nom, data.couleur, data.ordre || 0, data.description]
        );
        res.status(201).json(classeResult.rows[0]);
        break;

      case 'semaine':
        const semaineResult = await query(
          'INSERT INTO semaines (id, planning_id, debut, fin, type, description, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [data.id, planning.id, data.debut, data.fin, data.type, data.description, data.is_published || false]
        );
        res.status(201).json(semaineResult.rows[0]);
        break;

      case 'affectation':
        // Vérifier que la cellule est libre (contrainte unique)
        const isAvailable = await isCellAvailable(data.classeId, data.semaineId, planning.id);
        if (!isAvailable) {
          return res.status(400).json({ 
            error: 'Cette cellule est déjà occupée par une autre famille' 
          });
        }

        const affectationResult = await query(
          'INSERT INTO affectations (planning_id, famille_id, classe_id, semaine_id, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [planning.id, data.familleId, data.classeId, data.semaineId, data.notes]
        );
        res.status(201).json(affectationResult.rows[0]);
        break;

      case 'publish_semaine':
        // Publier/dépublier une semaine
        const { semaineId, publish } = data;
        const updatedSemaine = await toggleSemainePublication(semaineId, planning.id, publish);
        res.status(200).json(updatedSemaine);
        break;

      default:
        res.status(400).json({ error: 'Type non supporté' });
    }
  } catch (error) {
    console.error('Erreur POST planning:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('ADMIN_REQUIRED')) {
      res.status(403).json({ error: 'Accès administrateur requis' });
    } else if (error.message.includes('duplicate key')) {
      res.status(400).json({ error: 'Cette cellule est déjà occupée par une autre famille' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handlePut(req, res) {
  try {
    // Vérifier les permissions admin pour toute modification
    await checkAdminPermission(req, true);
    
    const { token, type, id, data } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    switch (type) {
      case 'affectation':
        const result = await query(
          'UPDATE affectations SET famille_id = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND planning_id = $4 RETURNING *',
          [data.familleId, data.notes, id, planning.id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Affectation non trouvée' });
        }
        res.status(200).json(result.rows[0]);
        break;

      case 'classe':
        const classeResult = await query(
          'UPDATE classes SET nom = $1, couleur = $2, ordre = $3, description = $4 WHERE id = $5 AND planning_id = $6 RETURNING *',
          [data.nom, data.couleur, data.ordre, data.description, id, planning.id]
        );
        if (classeResult.rows.length === 0) {
          return res.status(404).json({ error: 'Classe non trouvée' });
        }
        res.status(200).json(classeResult.rows[0]);
        break;

      case 'semaine':
        const semaineResult = await query(
          'UPDATE semaines SET debut = $1, fin = $2, type = $3, description = $4, is_published = $5 WHERE id = $6 AND planning_id = $7 RETURNING *',
          [data.debut, data.fin, data.type, data.description, data.is_published, id, planning.id]
        );
        if (semaineResult.rows.length === 0) {
          return res.status(404).json({ error: 'Semaine non trouvée' });
        }
        res.status(200).json(semaineResult.rows[0]);
        break;

      case 'planning':
        const planningResult = await query(
          'UPDATE plannings SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
          [data.name, data.description, planning.id]
        );
        res.status(200).json(planningResult.rows[0]);
        break;

      default:
        res.status(400).json({ error: 'Type non supporté pour la mise à jour' });
    }
  } catch (error) {
    console.error('Erreur PUT planning:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('ADMIN_REQUIRED')) {
      res.status(403).json({ error: 'Accès administrateur requis' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handleDelete(req, res) {
  try {
    // Vérifier les permissions admin pour toute suppression
    await checkAdminPermission(req, true);
    
    const { token, type, id } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    switch (type) {
      case 'affectation':
        const result = await query(
          'DELETE FROM affectations WHERE id = $1 AND planning_id = $2 RETURNING *',
          [id, planning.id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Affectation non trouvée' });
        }
        res.status(200).json({ message: 'Affectation supprimée' });
        break;

      case 'classe':
        // Vérifier s'il y a des affectations liées
        const affectationsCount = await query(
          'SELECT COUNT(*) as count FROM affectations WHERE classe_id = $1 AND planning_id = $2',
          [id, planning.id]
        );
        
        if (parseInt(affectationsCount.rows[0].count) > 0) {
          return res.status(400).json({ 
            error: 'Impossible de supprimer une classe avec des affectations existantes' 
          });
        }

        const classeResult = await query(
          'DELETE FROM classes WHERE id = $1 AND planning_id = $2 RETURNING *',
          [id, planning.id]
        );
        if (classeResult.rows.length === 0) {
          return res.status(404).json({ error: 'Classe non trouvée' });
        }
        res.status(200).json({ message: 'Classe supprimée' });
        break;

      case 'semaine':
        // Vérifier s'il y a des affectations liées
        const semaineAffectationsCount = await query(
          'SELECT COUNT(*) as count FROM affectations WHERE semaine_id = $1 AND planning_id = $2',
          [id, planning.id]
        );
        
        if (parseInt(semaineAffectationsCount.rows[0].count) > 0) {
          return res.status(400).json({ 
            error: 'Impossible de supprimer une semaine avec des affectations existantes' 
          });
        }

        const semaineResult = await query(
          'DELETE FROM semaines WHERE id = $1 AND planning_id = $2 RETURNING *',
          [id, planning.id]
        );
        if (semaineResult.rows.length === 0) {
          return res.status(404).json({ error: 'Semaine non trouvée' });
        }
        res.status(200).json({ message: 'Semaine supprimée' });
        break;

      default:
        res.status(400).json({ error: 'Type non supporté pour la suppression' });
    }
  } catch (error) {
    console.error('Erreur DELETE planning:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('ADMIN_REQUIRED')) {
      res.status(403).json({ error: 'Accès administrateur requis' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
} 