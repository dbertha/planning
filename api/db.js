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
        instructions_pdf_url TEXT, -- URL vers le PDF d'instructions
        PRIMARY KEY (id, planning_id)
      );
    `);

    // Ajouter la colonne PDF si elle n'existe pas (migration)
    await query(`
      ALTER TABLE classes ADD COLUMN IF NOT EXISTS instructions_pdf_url TEXT;
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
export const createPlanning = async (name, description, year, adminPassword, customToken) => {
  const token = customToken || generateSecureToken();
  const passwordHash = adminPassword ? hashPassword(adminPassword) : null;
  
  // Vérifier que le token personnalisé n'existe pas déjà
  if (customToken) {
    const existingResult = await query('SELECT id FROM plannings WHERE token = $1', [customToken]);
    if (existingResult.rows.length > 0) {
      throw new Error('Ce token existe déjà. Choisissez un token différent.');
    }
  }
  
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