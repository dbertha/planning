import { 
  query, 
  validateTokenAndGetPlanning, 
  getFamillesWithPreferences, 
  isFamilleAvailableForPeriod,
  addFamilleExclusion,
  getFamilleExclusions,
  validateAdminSession
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
    case 'PUT':
      return await handlePut(req, res);
    case 'DELETE':
      return await handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handleGet(req, res) {
  try {
    const { token, action, famille_id } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis dans l\'URL' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    switch (action) {
      case 'list':
        // Vérifier si c'est un admin pour inclure les familles archivées
        const sessionToken = req.headers['x-admin-session'];
        const isAdmin = sessionToken ? (await validateAdminSession(sessionToken)).isAdmin : false;
        const familles = await getFamillesWithPreferences(planning.id, isAdmin);
        res.status(200).json(familles);
        break;

      case 'exclusions':
        if (!famille_id) {
          return res.status(400).json({ error: 'ID famille requis' });
        }
        const exclusions = await getFamilleExclusions(parseInt(famille_id), planning.id);
        res.status(200).json(exclusions);
        break;

      case 'get_all_exclusions':
        // Récupérer toutes les exclusions du planning
        const allExclusions = await query(`
          SELECT 
            fe.*,
            f.nom as famille_nom
          FROM familles_exclusions fe
          JOIN familles f ON fe.famille_id = f.id
          WHERE fe.planning_id = $1 AND f.is_active = true
          ORDER BY fe.date_debut DESC, f.nom
        `, [planning.id]);
        
        res.status(200).json(allExclusions.rows);
        break;

      case 'template':
        // Générer un template CSV pour l'import
        const classes = await query(
          'SELECT id, nom FROM classes WHERE planning_id = $1 ORDER BY ordre, id',
          [planning.id]
        );

        const template = {
          headers: ['nom', 'email', 'telephone', 'nb_nettoyage', 'classes_preferences', 'notes'],
          example: [
            'Famille Dupont',
            'dupont@email.com',
            '0123456789', // OBLIGATOIRE
            '3',
            'A,C', // IDs des classes préférées
            'Remarques particulières'
          ],
          classes_disponibles: classes.rows,
          instructions: {
            nom: 'Nom de la famille (obligatoire)',
            email: 'Adresse email (optionnel)',
            telephone: 'Numéro de téléphone (OBLIGATOIRE pour SMS)',
            nb_nettoyage: 'Nombre de nettoyages par an (défaut: 3)',
            classes_preferences: 'IDs des classes préférées, séparés par virgule (ex: A,C)',
            notes: 'Remarques particulières (optionnel)'
          },
          exclusions_temporelles: {
            description: 'Les exclusions temporelles se gèrent séparément via l\'interface',
            exemple: 'Famille indisponible du 2024-07-01 au 2024-07-15'
          }
        };

        res.status(200).json(template);
        break;

      case 'stats':
        const stats = await query(`
          SELECT 
            COUNT(*) as total_familles,
            AVG(nb_nettoyage) as moyenne_nettoyages,
            COUNT(*) FILTER (WHERE array_length(classes_preferences, 1) > 0) as familles_avec_preferences,
            COUNT(DISTINCT fe.famille_id) as familles_avec_exclusions
          FROM familles f
          LEFT JOIN familles_exclusions fe ON fe.famille_id = f.id
          WHERE f.planning_id = $1 AND f.is_active = true
        `, [planning.id]);

        const exclusionsStats = await query(`
          SELECT 
            type,
            COUNT(*) as count_par_type
          FROM familles_exclusions fe
          JOIN familles f ON f.id = fe.famille_id
          WHERE f.planning_id = $1
          GROUP BY type
        `, [planning.id]);

        res.status(200).json({
          ...stats.rows[0],
          exclusions_par_type: exclusionsStats.rows
        });
        break;

      case 'check_availability':
        const { date_debut, date_fin } = req.query;
        if (!famille_id || !date_debut || !date_fin) {
          return res.status(400).json({ error: 'famille_id, date_debut et date_fin requis' });
        }
        
        const isAvailable = await isFamilleAvailableForPeriod(
          parseInt(famille_id), 
          date_debut, 
          date_fin, 
          planning.id
        );
        
        res.status(200).json({ available: isAvailable });
        break;

      default:
        return res.status(400).json({ error: 'Action non valide' });
    }
  } catch (error) {
    console.error('Erreur GET familles:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handlePost(req, res) {
  try {
    const { token, action, data } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    switch (action) {
      case 'create':
        // Validation du téléphone obligatoire
        if (!data.telephone || data.telephone.trim() === '') {
          return res.status(400).json({ error: 'Numéro de téléphone obligatoire pour les SMS' });
        }

        // Valider que les classes préférées existent dans ce planning
        const classesPreferences = data.classes_preferences || [];
        if (classesPreferences.length > 0) {
          for (const classeId of classesPreferences) {
            const existingClasse = await query(
              'SELECT id FROM classes WHERE id = $1 AND planning_id = $2',
              [classeId, planning.id]
            );
            
            if (existingClasse.rows.length === 0) {
              return res.status(400).json({ error: `Classe '${classeId}' n'existe pas dans ce planning` });
            }
          }
        }

        const createResult = await query(
          'INSERT INTO familles (planning_id, nom, email, telephone, nb_nettoyage, classes_preferences, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [
            planning.id, 
            data.nom, 
            data.email, 
            data.telephone.trim(), 
            data.nb_nettoyage || 3, 
            classesPreferences, 
            data.notes
          ]
        );
        res.status(201).json(createResult.rows[0]);
        break;

      case 'import':
        const importResult = await handleImport(planning.id, data.familles, data.filename);
        res.status(200).json(importResult);
        break;

      case 'add_exclusion':
        // Les données peuvent être dans data ou directement dans req.body (legacy)
        const exclusionData = data || req.body;
        if (!exclusionData.famille_id || !exclusionData.date_debut || !exclusionData.date_fin) {
          return res.status(400).json({ error: 'famille_id, date_debut et date_fin requis' });
        }
        
        const exclusionResult = await addFamilleExclusion(
          exclusionData.famille_id,
          planning.id,
          exclusionData.date_debut,
          exclusionData.date_fin,
          exclusionData.type,
          exclusionData.notes
        );
        
        res.status(201).json(exclusionResult);
        break;

      case 'validate_preference':
        // Vérifier si une famille a une préférence pour une classe
        const familleInfo = await query(
          'SELECT classes_preferences FROM familles WHERE id = $1 AND planning_id = $2',
          [data.famille_id, planning.id]
        );
        
        if (familleInfo.rows.length === 0) {
          return res.status(404).json({ error: 'Famille non trouvée' });
        }
        
        const preferences = familleInfo.rows[0].classes_preferences || [];
        const hasPreference = preferences.includes(data.classe_id);
        
        res.status(200).json({ 
          has_preference: hasPreference,
          description: hasPreference ? 'Classe préférée' : 'Aucune préférence'
        });
        break;

      default:
        res.status(400).json({ error: 'Action non supportée' });
    }
  } catch (error) {
    console.error('Erreur POST familles:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('duplicate key') && error.message.includes('familles_nom_planning_unique')) {
      res.status(400).json({ error: 'Une famille avec ce nom existe déjà dans ce planning' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handlePut(req, res) {
  try {
    const { token, id, data, action } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    if (action === 'update_exclusion') {
      // Mise à jour d'une exclusion
      const result = await query(
        'UPDATE familles_exclusions SET date_debut = $1, date_fin = $2, type = $3, notes = $4 WHERE id = $5 AND planning_id = $6 RETURNING *',
        [data.date_debut, data.date_fin, data.type, data.notes, id, planning.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exclusion non trouvée' });
      }

      res.status(200).json(result.rows[0]);
    } else {
      // Mise à jour d'une famille - validation du téléphone
      if (data.telephone && data.telephone.trim() === '') {
        return res.status(400).json({ error: 'Numéro de téléphone obligatoire pour les SMS' });
      }

      // Valider que les classes préférées existent dans ce planning
      const classesPreferences = data.classes_preferences || [];
      if (classesPreferences.length > 0) {
        for (const classeId of classesPreferences) {
          const existingClasse = await query(
            'SELECT id FROM classes WHERE id = $1 AND planning_id = $2',
            [classeId, planning.id]
          );
          
          if (existingClasse.rows.length === 0) {
            return res.status(400).json({ error: `Classe '${classeId}' n'existe pas dans ce planning` });
          }
        }
      }

      const result = await query(
        'UPDATE familles SET nom = $1, email = $2, telephone = $3, nb_nettoyage = $4, classes_preferences = $5, notes = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 AND planning_id = $8 RETURNING *',
        [
          data.nom, 
          data.email, 
          data.telephone?.trim(), 
          data.nb_nettoyage, 
          classesPreferences, 
          data.notes, 
          id, 
          planning.id
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Famille non trouvée' });
      }

      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Erreur PUT familles:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('duplicate key') && error.message.includes('familles_nom_planning_unique')) {
      res.status(400).json({ error: 'Une famille avec ce nom existe déjà dans ce planning' });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

async function handleDelete(req, res) {
  try {
    const { token, id, action } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    const planning = await validateTokenAndGetPlanning(token);

    if (action === 'delete_exclusion') {
      // Suppression d'une exclusion
      const result = await query(
        'DELETE FROM familles_exclusions WHERE id = $1 AND planning_id = $2 RETURNING *',
        [id, planning.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exclusion non trouvée' });
      }

      res.status(200).json({ message: 'Exclusion supprimée' });
    } else {
      // Soft delete : marquer la famille comme inactive
      const result = await query(
        'UPDATE familles SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND planning_id = $2 RETURNING *',
        [id, planning.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Famille non trouvée' });
      }

      res.status(200).json({ message: 'Famille supprimée' });
    }
  } catch (error) {
    console.error('Erreur DELETE familles:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

// Fonction d'import en lot
async function handleImport(planningId, familles, filename) {
  let nbSuccess = 0;
  let nbErrors = 0;
  const errors = [];

  for (let i = 0; i < familles.length; i++) {
    const famille = familles[i];
    try {
      // Valider les données
      if (!famille.nom || famille.nom.trim() === '') {
        throw new Error('Nom de famille obligatoire');
      }

      // VALIDATION TÉLÉPHONE OBLIGATOIRE
      if (!famille.telephone || famille.telephone.trim() === '') {
        throw new Error('Numéro de téléphone obligatoire pour les SMS');
      }

      // Convertir les préférences de classes de string vers array
      let classesPreferences = [];
      if (famille.classes_preferences && typeof famille.classes_preferences === 'string') {
        classesPreferences = famille.classes_preferences.split(',').map(id => id.trim()).filter(id => id);
      } else if (Array.isArray(famille.classes_preferences)) {
        classesPreferences = famille.classes_preferences;
      }

      // Valider que les classes préférées existent dans ce planning
      if (classesPreferences.length > 0) {
        for (const classeId of classesPreferences) {
          const existingClasse = await query(
            'SELECT id FROM classes WHERE id = $1 AND planning_id = $2',
            [classeId, planningId]
          );
          
          if (existingClasse.rows.length === 0) {
            throw new Error(`Classe '${classeId}' n'existe pas dans ce planning`);
          }
        }
      }

      // Valider le nombre de nettoyages
      const nbNettoyage = parseInt(famille.nb_nettoyage) || 3;
      if (nbNettoyage < 1 || nbNettoyage > 10) {
        throw new Error('Nombre de nettoyages doit être entre 1 et 10');
      }

      // Insérer la famille
      await query(
        'INSERT INTO familles (planning_id, nom, email, telephone, nb_nettoyage, classes_preferences, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          planningId, 
          famille.nom.trim(), 
          famille.email || null, 
          famille.telephone.trim(), // OBLIGATOIRE
          nbNettoyage, 
          classesPreferences, 
          famille.notes || null
        ]
      );

      nbSuccess++;
    } catch (error) {
      nbErrors++;
      let errorMessage = error.message;
      
      // Améliorer le message d'erreur pour les doublons
      if (error.message.includes('duplicate key') && error.message.includes('familles_nom_planning_unique')) {
        errorMessage = 'Famille déjà existante dans ce planning';
      }
      
      errors.push({
        ligne: i + 1,
        famille: famille.nom || 'Nom manquant',
        erreur: errorMessage
      });
    }
  }

  // Enregistrer l'audit de l'import (adapter à la structure existante)
  await query(
    'INSERT INTO imports (planning_id, filename, total_families, successful_imports, errors) VALUES ($1, $2, $3, $4, $5)',
    [planningId, filename, familles.length, nbSuccess, JSON.stringify(errors)]
  );

  return {
    total_lines: familles.length,
    success: nbSuccess,
    errors: nbErrors,
    error_details: errors
  };
} 