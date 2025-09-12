/**
 * Requêtes SQL réutilisables pour éviter la duplication
 */

import { query } from './db.js';

/**
 * Requêtes pour les classes
 */
export const classesQueries = {
  getAll: (planningId) => 
    query('SELECT * FROM classes WHERE planning_id = $1 ORDER BY ordre, id', [planningId]),
  
  getById: (classeId, planningId) => 
    query('SELECT * FROM classes WHERE id = $1 AND planning_id = $2', [classeId, planningId]),
  
  checkExists: (classeId, planningId) => 
    query('SELECT id FROM classes WHERE id = $1 AND planning_id = $2', [classeId, planningId]),
};

/**
 * Requêtes pour les familles
 */
export const famillesQueries = {
  getAll: (planningId, activeOnly = true) => {
    const whereClause = activeOnly ? 'WHERE planning_id = $1 AND is_active = true' : 'WHERE planning_id = $1';
    return query(`SELECT * FROM familles ${whereClause} ORDER BY nom`, [planningId]);
  },
  
  getById: (familleId, planningId) => 
    query('SELECT * FROM familles WHERE id = $1 AND planning_id = $2 AND is_active = true', [familleId, planningId]),
  
  getByIds: (familleIds, planningId) => {
    const placeholders = familleIds.map((_, i) => `$${i + 2}`).join(',');
    return query(
      `SELECT * FROM familles WHERE planning_id = $1 AND id IN (${placeholders}) AND is_active = true`,
      [planningId, ...familleIds]
    );
  },

  getPreferences: (familleId, planningId) => 
    query('SELECT classes_preferences FROM familles WHERE id = $1 AND planning_id = $2 AND is_active = true', [familleId, planningId]),
};

/**
 * Requêtes pour les semaines
 */
export const semainesQueries = {
  getAll: (planningId, publishedOnly = false) => {
    let semainesQuery = 'SELECT * FROM semaines WHERE planning_id = $1';
    if (publishedOnly) {
      semainesQuery += ' AND is_published = true';
    }
    semainesQuery += ' ORDER BY debut';
    return query(semainesQuery, [planningId]);
  },
  
  getById: (semaineId, planningId) => 
    query('SELECT * FROM semaines WHERE id = $1 AND planning_id = $2', [semaineId, planningId]),
  
  getDateRange: (semaineId, planningId) => 
    query('SELECT debut, fin FROM semaines WHERE id = $1 AND planning_id = $2', [semaineId, planningId]),
  
  getLatest: (planningId) => 
    query('SELECT * FROM semaines WHERE planning_id = $1 ORDER BY debut DESC LIMIT 1', [planningId]),
};

/**
 * Requêtes pour les affectations
 */
export const affectationsQueries = {
  getAll: (planningId) => 
    query('SELECT * FROM affectations WHERE planning_id = $1', [planningId]),
  
  getByClasse: (classeId, planningId) => 
    query('SELECT * FROM affectations WHERE classe_id = $1 AND planning_id = $2', [classeId, planningId]),
  
  getBySemaine: (semaineId, planningId) => 
    query('SELECT * FROM affectations WHERE semaine_id = $1 AND planning_id = $2', [semaineId, planningId]),
  
  getByFamille: (familleId, planningId) => 
    query('SELECT * FROM affectations WHERE famille_id = $1 AND planning_id = $2', [familleId, planningId]),
  
  countByClasse: (classeId, planningId) => 
    query('SELECT COUNT(*) as count FROM affectations WHERE classe_id = $1 AND planning_id = $2', [classeId, planningId]),
  
  countBySemaine: (semaineId, planningId) => 
    query('SELECT COUNT(*) as count FROM affectations WHERE semaine_id = $1 AND planning_id = $2', [semaineId, planningId]),
  
  checkExisting: (familleId, semaineId, planningId) => 
    query('SELECT classe_id FROM affectations WHERE famille_id = $1 AND semaine_id = $2 AND planning_id = $3', [familleId, semaineId, planningId]),
  
  getClassesForSemaine: (semaineId, planningId) => 
    query('SELECT classe_id FROM affectations WHERE semaine_id = $1 AND planning_id = $2', [semaineId, planningId]),
  
  getEnrichedBySemaines: (planningId, semainesIds) => {
    const placeholders = semainesIds.map((_, i) => `$${i + 2}`).join(',');
    return query(`
      SELECT a.*, 
             f.nom as famille_nom, 
             f.telephone as famille_telephone,
             f.telephone2 as famille_telephone2,
             f.nb_nettoyage,
             f.classes_preferences,
             c.nom as classe_nom, 
             c.couleur as classe_couleur,
             s.debut, s.fin, s.type as semaine_type, s.description as semaine_description,
             s.is_published, s.published_at,
             CASE 
               WHEN a.classe_id = ANY(f.classes_preferences) THEN 'Classe préférée'
               ELSE 'Assignation normale'
             END as preference_description,
             ROW_NUMBER() OVER (PARTITION BY a.famille_id ORDER BY s.debut, c.ordre, c.id) as nettoyage_numero
      FROM affectations a
      LEFT JOIN familles f ON a.famille_id = f.id
      LEFT JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
      LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
      WHERE a.planning_id = $1 AND a.semaine_id IN (${placeholders})
      ORDER BY s.debut, c.ordre, c.id
    `, [planningId, ...semainesIds]);
  },
  
  getAllEnriched: (planningId) => 
    query(`
      SELECT a.*, 
             f.nom as famille_nom, 
             f.telephone as famille_telephone,
             f.telephone2 as famille_telephone2,
             f.nb_nettoyage,
             f.classes_preferences,
             c.nom as classe_nom, 
             c.couleur as classe_couleur,
             s.debut, s.fin, s.type as semaine_type, s.description as semaine_description,
             s.is_published, s.published_at,
             CASE 
               WHEN a.classe_id = ANY(f.classes_preferences) THEN 'Classe préférée'
               ELSE 'Assignation normale'
             END as preference_description,
             ROW_NUMBER() OVER (PARTITION BY a.famille_id ORDER BY s.debut, c.ordre, c.id) as nettoyage_numero
      FROM affectations a
      LEFT JOIN familles f ON a.famille_id = f.id
      LEFT JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
      LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
      WHERE a.planning_id = $1
      ORDER BY s.debut, c.ordre, c.id
    `, [planningId]),
};

/**
 * Requêtes enrichies (avec JOIN)
 */
export const enrichedQueries = {
  getAffectationsWithDetails: (planningId, semainesIds = null) => {
    let whereClause = 'WHERE a.planning_id = $1';
    let params = [planningId];
    
    if (semainesIds && semainesIds.length > 0) {
      const placeholders = semainesIds.map((_, i) => `$${i + 2}`).join(',');
      whereClause += ` AND a.semaine_id IN (${placeholders})`;
      params.push(...semainesIds);
    }
    
    return query(`
      SELECT a.*, 
             f.nom as famille_nom, 
             f.telephone as famille_telephone,
             f.telephone2 as famille_telephone2,
             f.nb_nettoyage,
             f.classes_preferences,
             c.nom as classe_nom, 
             c.couleur as classe_couleur,
             s.debut, s.fin, s.type as semaine_type, s.description as semaine_description,
             s.is_published, s.published_at,
             CASE 
               WHEN a.classe_id = ANY(f.classes_preferences) THEN 'Classe préférée'
               ELSE 'Assignation normale'
             END as preference_description,
             ROW_NUMBER() OVER (PARTITION BY a.famille_id ORDER BY s.debut, c.ordre, c.id) as nettoyage_numero
      FROM affectations a
      LEFT JOIN familles f ON a.famille_id = f.id
      LEFT JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
      LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
      ${whereClause}
      ORDER BY s.debut, c.ordre, c.id
    `, params);
  },

  getFamillesWithAffectations: (planningId, semaineId) => 
    query(`
      SELECT 
        f.id, f.nom, f.telephone, f.telephone2, f.email,
        c.nom as classe_nom, c.couleur as classe_couleur,
        s.debut, s.fin, s.description as semaine_description,
        a.notes as affectation_notes
      FROM familles f
      JOIN affectations a ON f.id = a.famille_id
      JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
      JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
      WHERE f.planning_id = $1 AND s.id = $2 AND f.is_active = true
      ORDER BY f.nom
    `, [planningId, semaineId]),
};
