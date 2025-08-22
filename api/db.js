import { Pool } from '@neondatabase/serverless';
import crypto from 'crypto';
import ws from 'ws';

// Configuration WebSocket pour Neon en dev local
if (typeof WebSocket === 'undefined') {
  global.WebSocket = ws;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const query = async (text, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Générer un token sécurisé unique
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash d'un mot de passe admin
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + process.env.ADMIN_SALT || 'default_salt').digest('hex');
};

// Initialiser les tables si elles n'existent pas
export const initDatabase = async () => {
  try {
    // Table des plannings (master table)
    await query(`
      CREATE TABLE IF NOT EXISTS plannings (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64) UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        year INTEGER,
        admin_password_hash VARCHAR(64), -- Hash du mot de passe admin pour ce planning
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );
    `);

    // Table des classes (zones de nettoyage)
    await query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(10),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom TEXT NOT NULL,
        couleur VARCHAR(7) NOT NULL,
        ordre INTEGER DEFAULT 0,
        description TEXT,
        PRIMARY KEY (id, planning_id)
      );
    `);

    // Table des familles (téléphone obligatoire pour SMS)
    await query(`
      CREATE TABLE IF NOT EXISTS familles (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom TEXT NOT NULL,
        email TEXT,
        telephone TEXT NOT NULL, -- OBLIGATOIRE pour les SMS
        nb_nettoyage INTEGER DEFAULT 3,
        classes_preferences TEXT[], -- Array des IDs de classes préférées
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table des exclusions temporelles des familles (sans motif)
    await query(`
      CREATE TABLE IF NOT EXISTS familles_exclusions (
        id SERIAL PRIMARY KEY,
        famille_id INTEGER REFERENCES familles(id) ON DELETE CASCADE,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        type VARCHAR(20) DEFAULT 'indisponibilite', -- indisponibilite, vacances, maladie, autre
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_date_range CHECK (date_fin >= date_debut)
      );
    `);

    // Table des semaines (avec statut de publication)
    await query(`
      CREATE TABLE IF NOT EXISTS semaines (
        id VARCHAR(20),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        debut DATE NOT NULL,
        fin DATE NOT NULL,
        type VARCHAR(10) NOT NULL,
        description TEXT,
        is_published BOOLEAN DEFAULT false, -- Semaine publiée ou non
        published_at TIMESTAMP, -- Date de publication
        PRIMARY KEY (id, planning_id)
      );
    `);

    // Table des affectations simplifiée (une famille max par cellule)
    await query(`
      CREATE TABLE IF NOT EXISTS affectations (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        famille_id INTEGER REFERENCES familles(id) ON DELETE CASCADE,
        classe_id VARCHAR(10),
        semaine_id VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classe_id, planning_id) REFERENCES classes(id, planning_id),
        FOREIGN KEY (semaine_id, planning_id) REFERENCES semaines(id, planning_id),
        UNIQUE (planning_id, classe_id, semaine_id) -- UNE FAMILLE MAX PAR CELLULE
      );
    `);

    // Table des sessions admin
    await query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        session_token VARCHAR(64) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table d'audit pour les imports
    await query(`
      CREATE TABLE IF NOT EXISTS imports (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL, -- familles, classes, semaines
        filename TEXT,
        nb_lines INTEGER,
        nb_success INTEGER,
        nb_errors INTEGER,
        errors_detail JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Index pour améliorer les performances
    await query(`
      CREATE INDEX IF NOT EXISTS idx_plannings_token ON plannings(token);
      CREATE INDEX IF NOT EXISTS idx_classes_planning ON classes(planning_id);
      CREATE INDEX IF NOT EXISTS idx_familles_planning ON familles(planning_id);
      CREATE INDEX IF NOT EXISTS idx_familles_active ON familles(planning_id, is_active);
      CREATE INDEX IF NOT EXISTS idx_familles_preferences ON familles USING GIN (classes_preferences);
      CREATE INDEX IF NOT EXISTS idx_familles_exclusions_famille ON familles_exclusions(famille_id);
      CREATE INDEX IF NOT EXISTS idx_familles_exclusions_dates ON familles_exclusions(date_debut, date_fin);
      CREATE INDEX IF NOT EXISTS idx_semaines_planning ON semaines(planning_id);
      CREATE INDEX IF NOT EXISTS idx_semaines_dates ON semaines(debut, fin);
      CREATE INDEX IF NOT EXISTS idx_semaines_published ON semaines(planning_id, is_published);
      CREATE INDEX IF NOT EXISTS idx_affectations_planning ON affectations(planning_id);
      CREATE INDEX IF NOT EXISTS idx_affectations_famille ON affectations(famille_id);
      CREATE INDEX IF NOT EXISTS idx_affectations_semaine ON affectations(semaine_id);
      CREATE INDEX IF NOT EXISTS idx_affectations_unique_cell ON affectations(planning_id, classe_id, semaine_id);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_planning ON admin_sessions(planning_id);
    `);

    console.log('Tables créées avec succès');
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error);
    throw error;
  }
};

// Valider un token et récupérer le planning
export const validateTokenAndGetPlanning = async (token) => {
  if (!token) {
    throw new Error('Token manquant');
  }

  const result = await query(
    'SELECT * FROM plannings WHERE token = $1 AND is_active = true',
    [token]
  );

  if (result.rows.length === 0) {
    throw new Error('Token invalide ou planning inactif');
  }

  return result.rows[0];
};

// Créer un nouveau planning avec mot de passe admin
export const createPlanning = async (name, description, year, adminPassword) => {
  const token = generateSecureToken();
  const passwordHash = adminPassword ? hashPassword(adminPassword) : null;
  
  const result = await query(
    'INSERT INTO plannings (token, name, description, annee_scolaire, admin_password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [token, name, description, year, passwordHash]
  );

  return result.rows[0];
};

// Authentification admin
export const authenticateAdmin = async (token, password) => {
  const planning = await validateTokenAndGetPlanning(token);
  
  if (!planning.admin_password_hash) {
    throw new Error('Aucun mot de passe admin configuré pour ce planning');
  }
  
  const passwordHash = hashPassword(password);
  if (passwordHash !== planning.admin_password_hash) {
    throw new Error('Mot de passe incorrect');
  }
  
  // Créer une session admin
  const sessionToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  
  await query(
    'INSERT INTO admin_sessions (planning_id, session_token, expires_at) VALUES ($1, $2, $3)',
    [planning.id, sessionToken, expiresAt]
  );
  
  return { sessionToken, expiresAt, planning };
};

// Valider une session admin
export const validateAdminSession = async (sessionToken) => {
  if (!sessionToken) {
    return { isAdmin: false };
  }
  
  const result = await query(`
    SELECT s.*, p.*
    FROM admin_sessions s
    JOIN plannings p ON p.id = s.planning_id
    WHERE s.session_token = $1 AND s.expires_at > NOW()
  `, [sessionToken]);
  
  if (result.rows.length === 0) {
    return { isAdmin: false };
  }
  
  return { 
    isAdmin: true, 
    planning: result.rows[0],
    session: result.rows[0]
  };
};

// Nettoyer les sessions expirées
export const cleanExpiredSessions = async () => {
  await query('DELETE FROM admin_sessions WHERE expires_at < NOW()');
};

// Fonctions utilitaires pour les familles avec préférences et exclusions
export const getFamillesWithPreferences = async (planningId) => {
  const result = await query(`
    SELECT f.*, 
           COALESCE(
             ARRAY_AGG(DISTINCT c.nom) FILTER (WHERE c.nom IS NOT NULL), 
             ARRAY[]::TEXT[]
           ) as preferences_noms,
           COUNT(DISTINCT fe.id) as nb_exclusions,
           COUNT(DISTINCT a.id) as nb_affectations
    FROM familles f
    LEFT JOIN classes c ON c.id = ANY(f.classes_preferences) AND c.planning_id = f.planning_id
    LEFT JOIN familles_exclusions fe ON fe.famille_id = f.id
    LEFT JOIN affectations a ON a.famille_id = f.id
    WHERE f.planning_id = $1 AND f.is_active = true
    GROUP BY f.id
    ORDER BY f.nom
  `, [planningId]);
  
  return result.rows;
};

// Vérifier si une famille est disponible pour une période donnée
export const isFamilleAvailableForPeriod = async (familleId, dateDebut, dateFin, planningId) => {
  const result = await query(`
    SELECT COUNT(*) as exclusions_count
    FROM familles_exclusions fe
    WHERE fe.famille_id = $1 
      AND fe.planning_id = $2
      AND (
        (fe.date_debut <= $3 AND fe.date_fin >= $3) OR
        (fe.date_debut <= $4 AND fe.date_fin >= $4) OR
        (fe.date_debut >= $3 AND fe.date_fin <= $4)
      )
  `, [familleId, planningId, dateDebut, dateFin]);
  
  return parseInt(result.rows[0].exclusions_count) === 0;
};

// Vérifier si une cellule (classe + semaine) est libre
export const isCellAvailable = async (classeId, semaineId, planningId) => {
  const result = await query(`
    SELECT COUNT(*) as affectations_count
    FROM affectations
    WHERE planning_id = $1 AND classe_id = $2 AND semaine_id = $3
  `, [planningId, classeId, semaineId]);
  
  return parseInt(result.rows[0].affectations_count) === 0;
};

// Obtenir les familles disponibles pour une cellule (classe + semaine)
export const getAvailableFamiliesForCell = async (classeId, semaineId, planningId) => {
  const result = await query(`
    SELECT f.id, f.nom, f.telephone, f.nb_nettoyage, f.classes_preferences,
           CASE 
             WHEN $1 = ANY(f.classes_preferences) THEN true
             ELSE false
           END as has_preference,
           COUNT(a.id) as affectations_count,
           s.debut, s.fin
    FROM familles f
    CROSS JOIN semaines s
    LEFT JOIN affectations a ON a.famille_id = f.id AND a.planning_id = f.planning_id
    WHERE f.planning_id = $2 AND f.is_active = true
      AND s.id = $3 AND s.planning_id = $2
      -- Pas déjà affectée à une autre cellule cette semaine
      AND NOT EXISTS (
        SELECT 1 FROM affectations a2 
        WHERE a2.famille_id = f.id 
          AND a2.semaine_id = $3 
          AND a2.planning_id = $2
      )
      -- Pas d'exclusion temporelle
      AND NOT EXISTS (
        SELECT 1 FROM familles_exclusions fe
        WHERE fe.famille_id = f.id 
          AND fe.planning_id = $2
          AND (
            (fe.date_debut <= s.debut AND fe.date_fin >= s.debut) OR
            (fe.date_debut <= s.fin AND fe.date_fin >= s.fin) OR
            (fe.date_debut >= s.debut AND fe.date_fin <= s.fin)
          )
      )
    GROUP BY f.id, f.nom, f.telephone, f.nb_nettoyage, f.classes_preferences, s.debut, s.fin
    HAVING COUNT(a.id) < f.nb_nettoyage
    ORDER BY 
      CASE WHEN $1 = ANY(f.classes_preferences) THEN true ELSE false END DESC,
      COUNT(a.id) ASC,
      f.nom
  `, [classeId, planningId, semaineId]);
  
  return result.rows;
};

// Publier/dépublier des semaines
export const toggleSemainePublication = async (semaineId, planningId, publish) => {
  const publishedAt = publish ? 'CURRENT_TIMESTAMP' : 'NULL';
  
  const result = await query(
    `UPDATE semaines SET is_published = $1, published_at = ${publishedAt} WHERE id = $2 AND planning_id = $3 RETURNING *`,
    [publish, semaineId, planningId]
  );
  
  return result.rows[0];
};

// Ajouter une exclusion temporelle pour une famille (sans motif)
export const addFamilleExclusion = async (familleId, planningId, dateDebut, dateFin, type, notes) => {
  const result = await query(
    'INSERT INTO familles_exclusions (famille_id, planning_id, date_debut, date_fin, type, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [familleId, planningId, dateDebut, dateFin, type || 'indisponibilite', notes]
  );
  
  return result.rows[0];
};

// Obtenir les exclusions d'une famille
export const getFamilleExclusions = async (familleId, planningId) => {
  const result = await query(
    'SELECT * FROM familles_exclusions WHERE famille_id = $1 AND planning_id = $2 ORDER BY date_debut',
    [familleId, planningId]
  );
  
  return result.rows;
}; 