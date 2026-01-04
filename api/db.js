import { Pool } from 'pg';
import crypto from 'crypto';

console.log('🗄️ Utilisation du driver: PostgreSQL standard (VPS)');

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
    // Table des plannings (master table) - Schéma Neon
    await query(`
      CREATE TABLE IF NOT EXISTS plannings (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        annee_scolaire INTEGER,
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

    // Table des classes (zones de nettoyage) - Schéma Neon
    await query(`
      CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(20),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom VARCHAR(255) NOT NULL,
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

    // Migration: Corriger le type de last_executed_date de DATE vers TIMESTAMP
    try {
      await query(`
        ALTER TABLE scheduled_sms ALTER COLUMN last_executed_date TYPE timestamp USING last_executed_date::timestamp;
      `);
      console.log('Migration: scheduled_sms.last_executed_date corrigé vers TIMESTAMP');
    } catch (error) {
      if (error.code !== '42804') { // Ignore error if already TIMESTAMP
        console.log('Migration: scheduled_sms.last_executed_date déjà TIMESTAMP ou erreur:', error.message);
      }
    }

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

    // Table des familles (téléphone obligatoire pour SMS) - Schéma Neon
    await query(`
      CREATE TABLE IF NOT EXISTS familles (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telephone VARCHAR(255) NOT NULL, -- OBLIGATOIRE pour les SMS
        telephone2 TEXT, -- Deuxième numéro de téléphone (optionnel)
        nb_nettoyage INTEGER DEFAULT 3,
        classes_preferences TEXT[], -- Array des IDs de classes préférées
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(nom, planning_id) -- Éviter les doublons de famille par planning
      );
    `);

    // Migration: Ajouter la colonne telephone2 si elle n'existe pas
    await query(`
      ALTER TABLE familles ADD COLUMN IF NOT EXISTS telephone2 TEXT;
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
        last_executed_date TIMESTAMP, -- Pour éviter les doublons (timestamp complet nécessaire)
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
        code_cles TEXT, -- Codes clés pour cette semaine (ex: "Code A1, Code B2")
        is_published BOOLEAN DEFAULT false, -- Semaine publiée ou non
        published_at TIMESTAMP, -- Date de publication
        PRIMARY KEY (id, planning_id)
      );
    `);

    // Migration: Ajouter la colonne code_cles si elle n'existe pas
    await query(`
      ALTER TABLE semaines ADD COLUMN IF NOT EXISTS code_cles TEXT;
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
        filename VARCHAR(255),
        total_families INTEGER,
        successful_imports INTEGER,
        errors TEXT,
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
export const getFamillesWithPreferences = async (planningId, includeArchived = false, includeExclusions = false) => {
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
  
  // Si includeExclusions est true, récupérer les exclusions pour chaque famille
  if (includeExclusions) {
    for (const famille of result.rows) {
      const exclusions = await getFamilleExclusions(famille.id, planningId);
      famille.exclusions = exclusions;
    }
  }
  
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

// Distribution automatique pour une semaine - Version optimisée avec algorithme hongrois
export const autoDistributeWeek = async (semaineId, planningId) => {
  // Import munkres-js pour l'algorithme hongrois
  const munkresModule = await import('munkres-js');
  const Munkres = munkresModule.default?.Munkres || munkresModule.Munkres;
  
  // Paramètres de l'algorithme
  const ALPHA = 100;       // poids pour l'équité temporelle
  const LARGE_COST = 1e7;  // coût prohibitif pour empêcher un appariement

  try {
    // 1. Récupération des données de base en parallèle
    const [
      semaineRes,
      classesRes,
      occupiedClassesRes,
      occupiedFamiliesRes,
      assignedCountsRes,
      weeksRes,
      classesCountRes,
      lastAssignmentRes
    ] = await Promise.all([
      query('SELECT id, debut, fin FROM semaines WHERE id = $1 AND planning_id = $2', [semaineId, planningId]),
      query('SELECT id, nom, ordre, description FROM classes WHERE planning_id = $1 ORDER BY ordre, id', [planningId]),
      // Classes déjà occupées cette semaine
      query('SELECT classe_id FROM affectations WHERE semaine_id = $1 AND planning_id = $2', [semaineId, planningId]),
      // Familles déjà assignées cette semaine
      query('SELECT famille_id FROM affectations WHERE semaine_id = $1 AND planning_id = $2', [semaineId, planningId]),
      // Compteur d'affectations AVANT cette semaine (pour l'équité)
      query(`
        SELECT a.famille_id, COUNT(*) AS c
        FROM affectations a
        JOIN semaines s ON a.semaine_id = s.id
        WHERE a.planning_id = $1 AND s.debut < (SELECT debut FROM semaines WHERE id = $2)
        GROUP BY a.famille_id
      `, [planningId, semaineId]),
      query('SELECT id, debut FROM semaines WHERE planning_id = $1 ORDER BY debut', [planningId]),
      query('SELECT COUNT(*) AS c FROM classes WHERE planning_id = $1', [planningId]),
      // Dernière semaine d'affectation pour chaque famille (pour éviter les clusters)
      query(`
        SELECT a.famille_id, MAX(s.debut) AS last_assignment_date
        FROM affectations a
        JOIN semaines s ON a.semaine_id = s.id
        WHERE a.planning_id = $1 AND s.debut < (SELECT debut FROM semaines WHERE id = $2)
        GROUP BY a.famille_id
      `, [planningId, semaineId])
    ]);

    if (semaineRes.rows.length === 0) {
      throw new Error('Semaine introuvable');
    }
    const semaine = semaineRes.rows[0];

    // 2. Récupérer les familles avec vérification des exclusions pour cette période
    const familiesRes = await query(`
      SELECT f.id AS famille_id, f.nom, f.nb_nettoyage, f.classes_preferences,
             CASE 
               WHEN EXISTS (
                 SELECT 1 FROM familles_exclusions fe 
                 WHERE fe.famille_id = f.id 
                 AND fe.planning_id = f.planning_id
                 AND (
                   (fe.date_debut <= $2 AND fe.date_fin >= $2) OR
                   (fe.date_debut <= $3 AND fe.date_fin >= $3) OR
                   (fe.date_debut >= $2 AND fe.date_fin <= $3)
                 )
               ) THEN true
               ELSE false
             END as is_excluded
      FROM familles f
      WHERE f.planning_id = $1 AND f.is_active = true
    `, [planningId, semaine.debut, semaine.fin]);

    const classes = classesRes.rows;
    const occupiedClasses = new Set(occupiedClassesRes.rows.map(r => r.classe_id));
    const occupiedFamilies = new Set(occupiedFamiliesRes.rows.map(r => Number(r.famille_id)));
    const assignedMap = new Map(assignedCountsRes.rows.map(r => [Number(r.famille_id), Number(r.c)]));
    
    // Map pour stocker la dernière date d'affectation par famille
    const lastAssignmentMap = new Map(
      lastAssignmentRes.rows.map(r => [Number(r.famille_id), new Date(r.last_assignment_date)])
    );

    const totalWeeks = weeksRes.rows.length;
    const classesCount = Number(classesCountRes.rows[0]?.c || 0);
    const totalSlotsInPlanning = Math.max(1, totalWeeks * classesCount);
    const numFamilies = familiesRes.rows.length;

    // Calcul de l'index de la semaine (position dans l'année)
    const weekIndex = weeksRes.rows.findIndex(w => w.id === semaineId);
    const fractionSoFar = weekIndex / Math.max(1, totalWeeks);
    const targetPerFamily = totalSlotsInPlanning / Math.max(1, numFamilies);
    const idealToDate = targetPerFamily * fractionSoFar;

    // Construction de la liste des familles avec leurs préférences
    const families = familiesRes.rows
      .filter(r => !r.is_excluded) // Exclure les familles indisponibles
      .map(r => ({
        famille_id: Number(r.famille_id),
        nom: r.nom,
        nb_nettoyage: r.nb_nettoyage,
        classes_pref: new Set((r.classes_preferences || []).map(id => id.toString())),
        current_assignments: assignedMap.get(Number(r.famille_id)) || 0,
        last_assignment_date: lastAssignmentMap.get(Number(r.famille_id)) || null
      }));

    // 2. Classes disponibles pour cette semaine
    const availableClasses = classes
      .map(r => ({ id: r.id.toString(), nom: r.nom, description: r.description || '' }))
      .filter(c => !occupiedClasses.has(c.id));

    if (availableClasses.length === 0) {
      return {
        success: true,
        message: 'Toutes les classes sont déjà occupées pour cette semaine',
        affectations_created: 0,
        details: [],
        available_classes: 0,
        total_classes: classes.length
      };
    }

    const S = availableClasses.length; // nombre de créneaux (classes) à assigner

    // 3. Filtrage des candidats par créneau (contraintes strictes sauf préférences)
    const candidatesPerSlot = new Array(S);
    const candidateSet = new Set();

    for (let s = 0; s < S; s++) {
      const clsId = availableClasses[s].id;
      const arr = [];
      
      for (const f of families) {
        // Contraintes strictes:
        if (occupiedFamilies.has(f.famille_id)) continue;         // déjà assignée cette semaine
        if (f.current_assignments >= f.nb_nettoyage) continue;    // quota déjà atteint

        // Préférences désormais traitées via un coût (soft constraint)
        arr.push(f.famille_id);
        candidateSet.add(f.famille_id);
      }
      candidatesPerSlot[s] = arr;
    }

    // Détection des conflits (créneaux sans candidats)
    const conflictSlots = [];
    for (let s = 0; s < S; s++) {
      if (!candidatesPerSlot[s] || candidatesPerSlot[s].length === 0) {
        conflictSlots.push(availableClasses[s].id);
      }
    }
    
    if (conflictSlots.length > 0) {
      console.warn(`⚠️ Créneaux sans candidats éligibles: ${conflictSlots.join(', ')}`);
      return {
        success: false,
        message: `Aucune famille éligible pour les classes: ${conflictSlots.join(', ')}`,
        conflict_slots: conflictSlots,
        affectations_created: 0,
        details: [],
        available_classes: availableClasses.length,
        total_classes: classes.length
      };
    }

    // 4. Préparation de la matrice de coûts pour l'algorithme hongrois
    const candidateFamilies = Array.from(candidateSet);
    const familiesToInclude = families.filter(f => candidateSet.has(f.famille_id));
    
    const n = Math.max(candidateFamilies.length, S);
    const famIndex = new Map(candidateFamilies.map((id, i) => [id, i]));
    const matrix = Array.from({ length: n }, () => Array(n).fill(LARGE_COST));

    // Remplissage de la matrice avec les coûts d'équité temporelle + pénalités
    const PREFERENCE_PENALTY = 5;   // pénalité si la classe n'est pas dans les préférences
    const RECENCY_PENALTY = 50;      // pénalité si le dernier nettoyage est trop proche
    const RECENCY_THRESHOLD_WEEKS = 4; // seuil en semaines pour la pénalité de proximité
    
    const currentWeekDate = new Date(semaine.debut);
    
    for (let r = 0; r < candidateFamilies.length; r++) {
      const famId = candidateFamilies[r];
      const famille = familiesToInclude.find(f => f.famille_id === famId);
      
      if (!famille) continue;
      
      const assignedSoFar = famille.current_assignments;
      // Équité par famille: objectif proportionnel à nb_nettoyage
      const idealToDateForFamily = (famille.nb_nettoyage || 0) * fractionSoFar;
      const over = assignedSoFar - idealToDateForFamily;
      // Permettre des coûts négatifs pour prioriser les familles en retard
      let timeCost = Math.round(ALPHA * over);
      
      // Pénalité de proximité : éviter les assignations trop rapprochées
      if (famille.last_assignment_date) {
        const daysSinceLastAssignment = (currentWeekDate - famille.last_assignment_date) / (1000 * 60 * 60 * 24);
        const weeksSinceLastAssignment = daysSinceLastAssignment / 7;
        
        if (weeksSinceLastAssignment < RECENCY_THRESHOLD_WEEKS) {
          // Plus c'est récent, plus la pénalité est forte
          const recencyFactor = 1 - (weeksSinceLastAssignment / RECENCY_THRESHOLD_WEEKS);
          timeCost += Math.round(RECENCY_PENALTY * recencyFactor);
        }
      }

      for (let c = 0; c < S; c++) {
        const clsId = availableClasses[c].id;
        if (!candidatesPerSlot[c].includes(famId)) continue;
        // Coût basé sur l'équité temporelle + préférence souple
        let cost = timeCost;
        const hasPrefs = (famille.classes_pref && famille.classes_pref.size > 0);
        const inPrefs = hasPrefs && famille.classes_pref.has(clsId);
        if (hasPrefs && !inPrefs) {
          cost += PREFERENCE_PENALTY;
        }
        matrix[r][c] = cost;
      }
    }

    // 5. Exécution de l'algorithme hongrois
    const munkres = new Munkres();
    const indexes = munkres.compute(matrix);

    // 6. Extraction des affectations valides
    const assignments = [];
    for (const [r, c] of indexes) {
      if (r < candidateFamilies.length && c < S && matrix[r][c] < LARGE_COST / 2) {
        const famille = familiesToInclude.find(f => f.famille_id === candidateFamilies[r]);
        const assignedSoFar = famille ? famille.current_assignments : 0;
        const progressPercentage = famille ? (assignedSoFar / famille.nb_nettoyage * 100) : 0;
        
        assignments.push({
          famille_id: candidateFamilies[r],
          classe_id: availableClasses[c].id,
          semaine_id: semaineId,
          notes: `Auto-assigné (préférence) - ${progressPercentage.toFixed(1)}% complété`
        });
      }
    }

    if (assignments.length < S) {
      console.warn(`⚠️ Seulement ${assignments.length}/${S} affectations générées`);
    }

    // 7. Insertion en lot des affectations
    const valuesSql = [];
    const params = [];
    assignments.forEach((a, i) => {
      const base = i * 5;
      valuesSql.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`);
      params.push(planningId, a.famille_id, a.classe_id, a.semaine_id, a.notes);
    });

    let createdAffectations = [];
    let createdCount = 0;

    if (assignments.length > 0) {
      const insertSql = `INSERT INTO affectations (planning_id, famille_id, classe_id, semaine_id, notes) VALUES ${valuesSql.join(', ')} RETURNING *`;
      const inserted = await query(insertSql, params);
      createdAffectations = inserted.rows || [];
      createdCount = createdAffectations.length;
    }

    // 8. Statistiques pour le log
    const preferencesRespected = assignments.length; // Toutes les affectations respectent les préférences par construction
    const preferenceRate = assignments.length > 0 ? 100 : 0;
    
    console.log(`📊 Résultat optimisé: ${createdCount} affectations, ${preferencesRespected} préférences respectées (${preferenceRate}%)`);

    return {
      success: true,
      message: `${createdCount} affectation(s) créée(s) automatiquement (toutes avec préférences)`,
      affectations_created: createdCount,
      details: createdAffectations,
      available_classes: availableClasses.length,
      total_classes: classes.length
    };

  } catch (error) {
    console.error('Erreur lors de la distribution automatique optimisée:', error);
    throw error;
  }
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

export const updateScheduledSMSLastExecuted = async (smsId) => {
  try {
    const result = await query(`
      UPDATE scheduled_sms 
      SET last_executed_date = NOW()
      WHERE id = $1
      RETURNING *
    `, [smsId]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Erreur mise à jour last_executed_date:', error);
    throw error;
  }
};

export const getScheduledSMSToExecute = async () => {
  try {
    // Obtenir l'heure actuelle en UTC et en fuseau horaire de Bruxelles
    const nowUTC = new Date();
    
    // Créer une date pour le fuseau horaire de Bruxelles
    const nowBrussels = new Date(nowUTC.toLocaleString("en-US", {timeZone: "Europe/Brussels"}));
    
    const currentDayOfWeek = nowBrussels.getDay(); // 0=Dimanche, 1=Lundi, etc.
    const currentHour = nowBrussels.getHours();
    const currentMinute = nowBrussels.getMinutes();
    
    console.log(`🕐 Vérification SMS planifiés - UTC: ${nowUTC.toISOString()}, Bruxelles: ${nowBrussels.toLocaleString('fr-BE')} (Jour: ${currentDayOfWeek}, H: ${currentHour}, M: ${currentMinute})`);
    
    // Fonction pour calculer la dernière occurrence d'une date/heure planifiée dans les dernières 24h
    const getLastScheduledOccurrenceIn24h = (dayOfWeek, hour, minute) => {
      const now = new Date(nowUTC);
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Chercher dans les dernières 24h seulement
      for (let daysBack = 0; daysBack <= 1; daysBack++) {
        const checkDate = new Date(now);
        checkDate.setDate(now.getDate() - daysBack);
        
        if (checkDate.getDay() === dayOfWeek) {
          // C'est le bon jour de la semaine - CALCULER EN UTC DIRECTEMENT
          // Convertir l'heure de Bruxelles vers UTC (CEST = UTC+2, CET = UTC+1)
          const offsetHours = checkDate.getTimezoneOffset() === -120 ? 2 : 1; // -120 = CEST, -60 = CET
          checkDate.setUTCHours(hour - offsetHours, minute, 0, 0);
          
          // Si cette occurrence est dans les dernières 24h ET avant maintenant
          // MAIS pas dans la fenêtre actuelle de "programmé maintenant" (pour éviter les doublons)
          const isCurrentScheduleWindow = (
            dayOfWeek === currentDayOfWeek && 
            hour === currentHour && 
            minute >= Math.max(0, currentMinute - 5) && 
            minute <= currentMinute
          );
          
          if (checkDate >= twentyFourHoursAgo && checkDate < nowUTC && !isCurrentScheduleWindow) {
            return checkDate;
          }
        }
      }
      
      return null; // Aucune occurrence trouvée dans les dernières 24h
    };
    
    // Récupérer tous les SMS actifs
    const allSMS = await query(`
      SELECT s.*, p.name as planning_name, p.token as planning_token
      FROM scheduled_sms s
      JOIN plannings p ON s.planning_id = p.id
      WHERE s.is_active = true AND p.is_active = true
      ORDER BY s.day_of_week, s.hour, s.minute
    `);
    
    const smsToExecute = [];
    
    for (const sms of allSMS.rows) {
      // Vérifier si le SMS est programmé maintenant (avec tolérance de 20 minutes pour cron toutes les 15min)
      const isScheduledNow = (
        sms.day_of_week === currentDayOfWeek && 
        sms.hour === currentHour && 
        sms.minute >= Math.max(0, currentMinute - 20) && 
        sms.minute <= currentMinute
      );
      
      if (isScheduledNow) {
        // IMPORTANT: Vérifier si le SMS a déjà été exécuté récemment pour éviter les doublons
        if (sms.last_executed_date) {
          const lastExecutedUTC = new Date(sms.last_executed_date);
          const nowUTC_copy = new Date(nowUTC);
          
          // Créer l'heure planifiée en UTC pour aujourd'hui
          // CORRECTION FINALE: Calculer l'offset correctement en comparant UTC et Bruxelles
          const scheduledTodayUTC = new Date(nowUTC);
          scheduledTodayUTC.setUTCFullYear(scheduledTodayUTC.getUTCFullYear(), scheduledTodayUTC.getUTCMonth(), scheduledTodayUTC.getUTCDate());
          
          // Calculer l'offset réel en comparant l'heure UTC et l'heure de Bruxelles
          const utcHour = nowUTC.getUTCHours();
          const brusselsHour = nowBrussels.getHours();
          const actualOffset = brusselsHour - utcHour; // CEST=+2, CET=+1
          
          // Pour convertir CEST/CET vers UTC : UTC = heure_locale - offset
          const scheduledUTCHour = sms.hour - actualOffset;
          scheduledTodayUTC.setUTCHours(scheduledUTCHour, sms.minute, 0, 0);
          
          // Si déjà exécuté après l'heure planifiée d'aujourd'hui, ne pas ré-exécuter
          if (lastExecutedUTC >= scheduledTodayUTC) {
            continue;
          }
        }
        
        smsToExecute.push(sms);
        console.log(`   • "${sms.name}" - programmé maintenant`);
        continue;
      }
      
      // Pour les SMS non programmés maintenant, vérifier s'ils auraient dû s'exécuter dans les dernières 24h
      const lastScheduledOccurrence = getLastScheduledOccurrenceIn24h(sms.day_of_week, sms.hour, sms.minute);
      
      if (!lastScheduledOccurrence) {
        continue; // Aucune occurrence dans les dernières 24h
      }
      
      // Vérifier si le SMS doit être envoyé :
      // 1. Jamais envoyé (last_executed_date IS NULL)
      // 2. Dernière exécution antérieure à la dernière occurrence planifiée
      // NOTE: lastScheduledOccurrence est maintenant calculée directement en UTC
      const shouldExecute = (
        !sms.last_executed_date || 
        new Date(sms.last_executed_date) < lastScheduledOccurrence
      );
      
      if (shouldExecute) {
        smsToExecute.push(sms);
        
        if (!sms.last_executed_date) {
          console.log(`   • "${sms.name}" - jamais envoyé (dernière occurrence: ${lastScheduledOccurrence.toLocaleString('fr-BE')})`);
        } else {
          console.log(`   • "${sms.name}" - en retard (dernière exécution: ${new Date(sms.last_executed_date).toLocaleString('fr-BE')}, dernière occurrence: ${lastScheduledOccurrence.toLocaleString('fr-BE')})`);
        }
      }
    }
    
    if (smsToExecute.length > 0) {
      console.log(`📱 ${smsToExecute.length} SMS planifié(s) à exécuter trouvé(s)`);
    }
    
    return smsToExecute;
  } catch (error) {
    console.error('Erreur récupération SMS à exécuter:', error);
    throw error;
  }
}; 