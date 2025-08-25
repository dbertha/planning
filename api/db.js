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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      );
    `);

    // Migration: Remove admin_password_hash column if it exists
    try {
      await query(`ALTER TABLE plannings DROP COLUMN IF EXISTS admin_password_hash;`);
    } catch (error) {
      // Ignore error if column doesn't exist
      console.log('Migration: admin_password_hash column removal completed or already done');
    }

    // Table des classes (zones de nettoyage)
    await query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(20),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom TEXT NOT NULL,
        couleur VARCHAR(7) NOT NULL,
        ordre INTEGER DEFAULT 0,
        description TEXT,
        instructions_pdf_url TEXT, -- URL vers le PDF d'instructions
        PRIMARY KEY (id, planning_id)
      );
    `);

    // Ajouter la colonne PDF si elle n'existe pas (migration)
    await query(`
      ALTER TABLE classes ADD COLUMN IF NOT EXISTS instructions_pdf_url TEXT;
    `);

    // Migration: Ajouter contrainte d'unicité sur (nom, planning_id) pour familles
    try {
      await query(`
        ALTER TABLE familles ADD CONSTRAINT familles_nom_planning_unique 
        UNIQUE (nom, planning_id);
      `);
    } catch (error) {
      if (error.code !== '42P07') { // Ignore error if constraint already exists
        console.log('Migration: familles unique constraint already exists or error:', error.message);
      }
    }

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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(nom, planning_id) -- Éviter les doublons de famille par planning
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

    // Table des SMS planifiés
    await query(`
      CREATE TABLE IF NOT EXISTS scheduled_sms (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        message_template TEXT NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Dimanche, 1=Lundi, ... 6=Samedi
        hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
        minute INTEGER DEFAULT 0 CHECK (minute >= 0 AND minute <= 59),
        target_type VARCHAR(20) DEFAULT 'current_week', -- 'current_week', 'all_active', 'specific_families'
        is_active BOOLEAN DEFAULT true,
        last_executed_date DATE, -- Pour éviter les doublons
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Table pour éviter les doublons d'exécution
    await query(`
      CREATE TABLE IF NOT EXISTS sms_execution_log (
        id SERIAL PRIMARY KEY,
        scheduled_sms_id INTEGER REFERENCES scheduled_sms(id) ON DELETE CASCADE,
        execution_date DATE NOT NULL,
        execution_time TIME NOT NULL,
        success BOOLEAN NOT NULL,
        recipients_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(scheduled_sms_id, execution_date, execution_time)
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

// Créer un nouveau planning (password is now global env var)
export const createPlanning = async (name, description, year, customToken) => {
  const token = customToken || generateSecureToken();
  
  // Vérifier que le token personnalisé n'existe pas déjà
  if (customToken) {
    const existingResult = await query('SELECT id FROM plannings WHERE token = $1', [customToken]);
    if (existingResult.rows.length > 0) {
      throw new Error('Ce token existe déjà. Choisissez un token différent.');
    }
  }
  
  const result = await query(
    'INSERT INTO plannings (token, name, description, annee_scolaire) VALUES ($1, $2, $3, $4) RETURNING *',
    [token, name, description, year]
  );

  return result.rows[0];
};

// Authentification admin (global password from env var)
export const authenticateAdmin = async (token, password) => {
  const planning = await validateTokenAndGetPlanning(token);
  
  // Get global admin password from environment
  const globalAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  
  if (password !== globalAdminPassword) {
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
export const getFamillesWithPreferences = async (planningId, includeArchived = false) => {
  let whereClause = 'WHERE f.planning_id = $1';
  if (!includeArchived) {
    whereClause += ' AND f.is_active = true';
  }

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
    ${whereClause}
    GROUP BY f.id
    ORDER BY f.is_active DESC, f.nom
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

// Distribution automatique pour une semaine
export const autoDistributeWeek = async (semaineId, planningId) => {
  try {
    // 1. Récupérer les informations de la semaine
    const semaineResult = await query(
      'SELECT debut, fin FROM semaines WHERE id = $1 AND planning_id = $2',
      [semaineId, planningId]
    );

    if (semaineResult.rows.length === 0) {
      throw new Error('Semaine introuvable');
    }

    const { debut, fin } = semaineResult.rows[0];

    // 2. Récupérer toutes les classes
    const classesResult = await query(
      'SELECT id, nom FROM classes WHERE planning_id = $1 ORDER BY ordre, id',
      [planningId]
    );

    const classes = classesResult.rows;
    if (classes.length === 0) {
      throw new Error('Aucune classe trouvée pour ce planning');
    }

    // 3. Récupérer les familles disponibles avec leurs statistiques
    const famillesStats = await calculateFamiliesStats(planningId, debut);

    // 4. Trouver les classes déjà occupées pour cette semaine
    const occupiedCellsResult = await query(
      'SELECT classe_id FROM affectations WHERE semaine_id = $1 AND planning_id = $2',
      [semaineId, planningId]
    );
    
    const occupiedClasses = new Set(occupiedCellsResult.rows.map(row => row.classe_id));

    // 5. Filtrer les classes disponibles
    const availableClasses = classes.filter(classe => !occupiedClasses.has(classe.id));

    if (availableClasses.length === 0) {
      return {
        success: true,
        message: 'Toutes les classes sont déjà occupées pour cette semaine',
        affectations_created: 0
      };
    }

    // 6. Algorithme de distribution équitable
    const affectationsToCreate = [];
    
    for (const classe of availableClasses) {
      // Trouver les familles disponibles pour cette classe et cette période
      const availableFamilies = await getAvailableFamiliesForPeriod(
        classe.id, 
        semaineId, 
        planningId, 
        debut, 
        fin
      );

      if (availableFamilies.length === 0) {
        continue;
      }

      // Enrichir avec les statistiques et calculer le score de priorité
      const familiesWithScores = availableFamilies.map(famille => {
        const stats = famillesStats.find(s => s.id === famille.id) || {
          current_affectations: 0,
          percentage_completed: 0
        };

        // Score de priorité basé sur :
        // 1. Pourcentage de nettoyages déjà effectués (plus faible = priorité plus haute)
        // 2. Préférence pour cette classe (bonus)
        // 3. Randomisation légère pour éviter la monotonie
        let priorityScore = 100 - stats.percentage_completed; // Base : moins on a fait, plus on est prioritaire
        
        if (famille.has_preference) {
          priorityScore += 20; // Bonus pour les préférences
        }
        
        // Petit facteur aléatoire pour éviter les patterns trop prévisibles
        priorityScore += Math.random() * 10;

        return {
          ...famille,
          ...stats,
          priorityScore
        };
      });

      // Trier par score de priorité (décroissant)
      familiesWithScores.sort((a, b) => b.priorityScore - a.priorityScore);

      // Sélectionner la famille avec le meilleur score
      const selectedFamily = familiesWithScores[0];

      affectationsToCreate.push({
        famille_id: selectedFamily.id,
        classe_id: classe.id,
        semaine_id: semaineId,
        notes: `Attribution automatique (${selectedFamily.percentage_completed.toFixed(1)}% complété)`
      });
    }

    // 7. Créer les affectations en base
    let createdCount = 0;
    const createdAffectations = [];

    for (const affectation of affectationsToCreate) {
      try {
        const result = await query(
          'INSERT INTO affectations (planning_id, famille_id, classe_id, semaine_id, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [planningId, affectation.famille_id, affectation.classe_id, affectation.semaine_id, affectation.notes]
        );
        
        createdAffectations.push(result.rows[0]);
        createdCount++;
      } catch (error) {
        console.warn(`Erreur lors de la création d'une affectation:`, error.message);
        // Continuer avec les autres affectations
      }
    }

    return {
      success: true,
      message: `${createdCount} affectation(s) créée(s) automatiquement`,
      affectations_created: createdCount,
      details: createdAffectations,
      available_classes: availableClasses.length,
      total_classes: classes.length
    };

  } catch (error) {
    console.error('Erreur lors de la distribution automatique:', error);
    throw error;
  }
};

// Fonction utilitaire pour calculer les statistiques des familles
const calculateFamiliesStats = async (planningId, currentDate) => {
  const result = await query(`
    SELECT 
      f.id,
      f.nom,
      f.nb_nettoyage,
      COUNT(a.id) as current_affectations,
      CASE 
        WHEN f.nb_nettoyage > 0 THEN (COUNT(a.id)::float / f.nb_nettoyage * 100)
        ELSE 0
      END as percentage_completed,
      -- Calculer le pourcentage attendu basé sur la progression dans l'année
      CASE 
        WHEN total_weeks.total > 0 THEN (weeks_passed.passed::float / total_weeks.total * f.nb_nettoyage)
        ELSE 0
      END as expected_affectations_by_now
    FROM familles f
    LEFT JOIN affectations a ON a.famille_id = f.id AND a.planning_id = f.planning_id
    LEFT JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
    -- Calculer le total de semaines dans le planning
    CROSS JOIN (
      SELECT COUNT(*) as total 
      FROM semaines 
      WHERE planning_id = $1
    ) total_weeks
    -- Calculer les semaines passées jusqu'à maintenant
    CROSS JOIN (
      SELECT COUNT(*) as passed 
      FROM semaines 
      WHERE planning_id = $1 AND debut <= $2
    ) weeks_passed
    WHERE f.planning_id = $1 AND f.is_active = true
    GROUP BY f.id, f.nom, f.nb_nettoyage, total_weeks.total, weeks_passed.passed
    ORDER BY percentage_completed ASC, f.nom
  `, [planningId, currentDate]);

  return result.rows;
};

// Fonction utilitaire pour obtenir les familles disponibles pour une classe et période spécifique
const getAvailableFamiliesForPeriod = async (classeId, semaineId, planningId, debut, fin) => {
  const result = await query(`
    SELECT f.id, f.nom, f.telephone, f.nb_nettoyage, f.classes_preferences,
           CASE 
             WHEN $1 = ANY(f.classes_preferences) THEN true
             ELSE false
           END as has_preference,
           COUNT(a.id) as current_affectations
    FROM familles f
    LEFT JOIN affectations a ON a.famille_id = f.id AND a.planning_id = f.planning_id
    WHERE f.planning_id = $2 AND f.is_active = true
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
            (fe.date_debut <= $4 AND fe.date_fin >= $4) OR
            (fe.date_debut <= $5 AND fe.date_fin >= $5) OR
            (fe.date_debut >= $4 AND fe.date_fin <= $5)
          )
      )
    GROUP BY f.id, f.nom, f.telephone, f.nb_nettoyage, f.classes_preferences
    HAVING COUNT(a.id) < f.nb_nettoyage
    ORDER BY 
      CASE WHEN $1 = ANY(f.classes_preferences) THEN true ELSE false END DESC,
      COUNT(a.id) ASC,
      f.nom
  `, [classeId, planningId, semaineId, debut, fin]);
  
  return result.rows;
};

// Créer automatiquement la semaine suivante
export const createNextWeek = async (planningId) => {
  try {
    // Récupérer la dernière semaine existante
    const lastWeekResult = await query(
      'SELECT * FROM semaines WHERE planning_id = $1 ORDER BY debut DESC LIMIT 1',
      [planningId]
    );
    


    let nextWeekData;
    
    if (lastWeekResult.rows.length === 0) {
      // Aucune semaine n'existe, créer la première semaine (lundi de cette semaine)
      const today = new Date();
      const monday = getMondayOfWeek(today);
      nextWeekData = createWeekDefinition(monday, planningId);
    } else {
      // Calculer la semaine suivante
      const lastWeek = lastWeekResult.rows[0];
      const lastEndDate = new Date(lastWeek.fin);
      
      // Calculer le lundi suivant la fin de la dernière semaine
      // Si fin = samedi, lundi suivant = samedi + 2 jours
      // Si fin = dimanche, lundi suivant = dimanche + 1 jour
      let nextMonday = new Date(lastEndDate);
      const lastWeekEndDay = lastEndDate.getDay(); // 0=dimanche, 6=samedi
      
      if (lastWeekEndDay === 0) {
        // Dimanche, ajouter 1 jour pour lundi
        nextMonday.setDate(lastEndDate.getDate() + 1);
      } else if (lastWeekEndDay === 6) {
        // Samedi, ajouter 2 jours pour lundi
        nextMonday.setDate(lastEndDate.getDate() + 2);
      } else {
        // Autre jour (ne devrait pas arriver pour une semaine normale)
        nextMonday.setDate(lastEndDate.getDate() + (8 - lastWeekEndDay));
      }
      

      nextWeekData = createWeekDefinition(nextMonday, planningId);
    }

    // Vérifier que cette semaine n'existe pas déjà
    const existingWeek = await query(
      'SELECT id FROM semaines WHERE id = $1 AND planning_id = $2',
      [nextWeekData.id, planningId]
    );

    if (existingWeek.rows.length > 0) {
      return {
        success: false,
        message: `La semaine du ${formatDateForDisplay(nextWeekData.debut)} au ${formatDateForDisplay(nextWeekData.fin)} existe déjà`
      };
    }

    // Créer la semaine
    const result = await query(
      'INSERT INTO semaines (id, planning_id, debut, fin, type, description, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nextWeekData.id, planningId, nextWeekData.debut, nextWeekData.fin, nextWeekData.type, nextWeekData.description, nextWeekData.is_published]
    );

    return {
      success: true,
      semaine: result.rows[0],
      message: `Semaine du ${formatDateForDisplay(nextWeekData.debut)} au ${formatDateForDisplay(nextWeekData.fin)} créée`
    };

  } catch (error) {
    console.error('Erreur lors de la création de la semaine suivante:', error);
    throw error;
  }
};

// Fonctions utilitaires pour les semaines (importées des utils)
function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function createWeekDefinition(startDate, planningId = null) {
  // Si startDate est déjà un lundi, l'utiliser directement
  // Sinon, trouver le lundi de la semaine
  let monday;
  if (startDate.getDay() === 1) {
    // C'est déjà un lundi
    monday = new Date(startDate);
  } else {
    // Trouver le lundi de cette semaine
    monday = getMondayOfWeek(startDate);
  }
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  // Générer un ID unique: si planningId fourni, l'inclure, sinon utiliser timestamp
  let weekId;
  if (planningId) {
    weekId = `${planningId}-${monday.toISOString().split('T')[0]}`;
  } else {
    weekId = monday.toISOString().split('T')[0];
  }
  
  return {
    id: weekId,
    debut: monday.toISOString().split('T')[0],
    fin: sunday.toISOString().split('T')[0],
    type: 'NETTOYAGE',
    description: `Semaine du ${monday.toLocaleDateString('fr-FR')} au ${sunday.toLocaleDateString('fr-FR')}`,
    is_published: false
  };
}

// Fonctions de vacances retirées - les administrateurs peuvent 
// manuellement changer le type de semaine via l'interface

function formatDateForDisplay(date) {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

// **Fonctions pour les SMS planifiés**

export const createScheduledSMS = async (planningId, data) => {
  try {
    const { name, description, message_template, day_of_week, hour, minute, target_type } = data;
    
    const result = await query(
      'INSERT INTO scheduled_sms (planning_id, name, description, message_template, day_of_week, hour, minute, target_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [planningId, name, description, message_template, day_of_week, hour, minute || 0, target_type || 'current_week']
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Erreur création SMS planifié:', error);
    throw error;
  }
};

export const getScheduledSMSList = async (planningId) => {
  try {
    const result = await query(
      'SELECT * FROM scheduled_sms WHERE planning_id = $1 ORDER BY day_of_week, hour, minute',
      [planningId]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Erreur récupération SMS planifiés:', error);
    throw error;
  }
};

export const updateScheduledSMS = async (smsId, data) => {
  try {
    const { name, description, message_template, day_of_week, hour, minute, target_type, is_active } = data;
    
    const result = await query(
      'UPDATE scheduled_sms SET name = $1, description = $2, message_template = $3, day_of_week = $4, hour = $5, minute = $6, target_type = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, description, message_template, day_of_week, hour, minute, target_type, is_active, smsId]
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Erreur modification SMS planifié:', error);
    throw error;
  }
};

export const deleteScheduledSMS = async (smsId) => {
  try {
    await query('DELETE FROM scheduled_sms WHERE id = $1', [smsId]);
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression SMS planifié:', error);
    throw error;
  }
};

export const getScheduledSMSToExecute = async () => {
  try {
    // Obtenir l'heure actuelle en fuseau horaire de Bruxelles
    const nowInBrussels = new Date().toLocaleString("en-US", {timeZone: "Europe/Brussels"});
    const brusselsTime = new Date(nowInBrussels);
    
    const currentDayOfWeek = brusselsTime.getDay(); // 0=Dimanche, 1=Lundi, etc.
    const currentHour = brusselsTime.getHours();
    const currentMinute = brusselsTime.getMinutes();
    
    console.log(`🕐 Vérification SMS planifiés - Heure Bruxelles: ${brusselsTime.toLocaleString('fr-BE')} (Jour: ${currentDayOfWeek}, H: ${currentHour}, M: ${currentMinute})`);
    
    // Chercher les SMS à envoyer maintenant (avec une tolérance de 5 minutes pour les services externes)
    const result = await query(`
      SELECT s.*, p.name as planning_name, p.token as planning_token
      FROM scheduled_sms s
      JOIN plannings p ON s.planning_id = p.id
      WHERE s.is_active = true 
        AND s.day_of_week = $1 
        AND s.hour = $2 
        AND s.minute BETWEEN $3 AND $4
        AND p.is_active = true
    `, [currentDayOfWeek, currentHour, Math.max(0, currentMinute - 5), currentMinute]);
    
    if (result.rows.length > 0) {
      console.log(`📱 ${result.rows.length} SMS planifié(s) à exécuter trouvé(s)`);
    }
    
    return result.rows;
  } catch (error) {
    console.error('Erreur récupération SMS à exécuter:', error);
    throw error;
  }
}; 