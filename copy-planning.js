#!/usr/bin/env node

import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script pour copier un planning complet d'une base de données PostgreSQL vers une autre
 * 
 * Usage: node copy-planning.js <SOURCE_URI> <DEST_URI> <PLANNING_TOKEN> [NEW_TOKEN]
 * 
 * Exemple:
 * node copy-planning.js "postgresql://user:pass@host1:5432/db1" "postgresql://user:pass@host2:5432/db2" "abc123" "def456"
 */

class PlanningCopier {
  constructor(sourceUri, destUri) {
    this.sourcePool = new Pool({ connectionString: sourceUri });
    this.destPool = new Pool({ connectionString: destUri });
    this.mappings = {
      plannings: new Map(),
      familles: new Map(),
      classes: new Map(),
      semaines: new Map()
    };
  }

  async query(pool, text, params = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async sourceQuery(text, params) {
    return this.query(this.sourcePool, text, params);
  }

  async destQuery(text, params) {
    return this.query(this.destPool, text, params);
  }

  async close() {
    await this.sourcePool.end();
    await this.destPool.end();
  }

  /**
   * Copie un planning complet avec toutes ses données associées
   */
  async copyPlanning(planningToken, newToken = null) {
    console.log(`🚀 Début de la copie du planning avec le token: ${planningToken}`);
    
    try {
      // 1. Vérifier que le planning source existe
      const sourcePlanning = await this.getSourcePlanning(planningToken);
      if (!sourcePlanning) {
        throw new Error(`Planning avec le token '${planningToken}' non trouvé dans la base source`);
      }

      console.log(`📋 Planning trouvé: ${sourcePlanning.name} (ID: ${sourcePlanning.id})`);

      // 2. Initialiser les tables de destination si nécessaire
      await this.initDestinationTables();

      // 3. Commencer une transaction sur la destination
      const destClient = await this.destPool.connect();
      
      try {
        await destClient.query('BEGIN');

        // 4. Copier les données dans l'ordre des dépendances
        await this.copyPlanningData(sourcePlanning, newToken || planningToken, destClient);
        await this.copyClassesData(sourcePlanning.id, destClient);
        await this.copyFamillesData(sourcePlanning.id, destClient);
        await this.copyFamillesExclusionsData(sourcePlanning.id, destClient);
        await this.copySemainesData(sourcePlanning.id, destClient);
        await this.copyAffectationsData(sourcePlanning.id, destClient);
        await this.copyScheduledSMSData(sourcePlanning.id, destClient);
        await this.copyImportsData(sourcePlanning.id, destClient);

        // 5. Valider la transaction
        await destClient.query('COMMIT');
        console.log('✅ Transaction validée avec succès');

      } catch (error) {
        await destClient.query('ROLLBACK');
        console.error('❌ Erreur pendant la copie, transaction annulée:', error.message);
        throw error;
      } finally {
        destClient.release();
      }

      // 6. Validation finale
      await this.validateCopy(sourcePlanning.id, newToken || planningToken);

      console.log(`🎉 Copie terminée avec succès!`);
      console.log(`📊 Résumé des mappings:`);
      console.log(`   - Planning: ${sourcePlanning.id} → ${this.mappings.plannings.get(sourcePlanning.id)}`);
      console.log(`   - Classes: ${this.mappings.classes.size} copiées`);
      console.log(`   - Familles: ${this.mappings.familles.size} copiées`);
      console.log(`   - Semaines: ${this.mappings.semaines.size} copiées`);

    } catch (error) {
      console.error('💥 Erreur lors de la copie:', error.message);
      throw error;
    }
  }

  async getSourcePlanning(token) {
    const result = await this.sourceQuery(
      'SELECT * FROM plannings WHERE token = $1 AND is_active = true',
      [token]
    );
    return result.rows[0] || null;
  }

  async initDestinationTables() {
    console.log('🔧 Initialisation des tables de destination...');
    
    // Créer les tables si elles n'existent pas (copié depuis db.js)
    const tableQueries = [
      // Table plannings
      `CREATE TABLE IF NOT EXISTS plannings (
        id SERIAL PRIMARY KEY,
        token VARCHAR(64) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        annee_scolaire INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )`,
      
      // Table classes
      `CREATE TABLE IF NOT EXISTS classes (
        id VARCHAR(20),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom VARCHAR(255) NOT NULL,
        couleur VARCHAR(7) NOT NULL,
        ordre INTEGER DEFAULT 0,
        description TEXT,
        instructions_pdf_url TEXT,
        PRIMARY KEY (id, planning_id)
      )`,
      
      // Table familles
      `CREATE TABLE IF NOT EXISTS familles (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        nom VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        telephone VARCHAR(255) NOT NULL,
        telephone2 TEXT,
        nb_nettoyage INTEGER DEFAULT 3,
        classes_preferences TEXT[],
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(nom, planning_id)
      )`,
      
      // Table familles_exclusions
      `CREATE TABLE IF NOT EXISTS familles_exclusions (
        id SERIAL PRIMARY KEY,
        famille_id INTEGER REFERENCES familles(id) ON DELETE CASCADE,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        date_debut DATE NOT NULL,
        date_fin DATE NOT NULL,
        type VARCHAR(20) DEFAULT 'indisponibilite',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_date_range CHECK (date_fin >= date_debut)
      )`,
      
      // Table scheduled_sms
      `CREATE TABLE IF NOT EXISTS scheduled_sms (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        message_template TEXT NOT NULL,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
        minute INTEGER DEFAULT 0 CHECK (minute >= 0 AND minute <= 59),
        target_type VARCHAR(20) DEFAULT 'current_week',
        is_active BOOLEAN DEFAULT true,
        last_executed_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table sms_execution_log
      `CREATE TABLE IF NOT EXISTS sms_execution_log (
        id SERIAL PRIMARY KEY,
        scheduled_sms_id INTEGER REFERENCES scheduled_sms(id) ON DELETE CASCADE,
        execution_date DATE NOT NULL,
        execution_time TIME NOT NULL,
        success BOOLEAN NOT NULL,
        recipients_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(scheduled_sms_id, execution_date, execution_time)
      )`,
      
      // Table semaines
      `CREATE TABLE IF NOT EXISTS semaines (
        id VARCHAR(20),
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        debut DATE NOT NULL,
        fin DATE NOT NULL,
        type VARCHAR(10) NOT NULL,
        description TEXT,
        is_published BOOLEAN DEFAULT false,
        published_at TIMESTAMP,
        PRIMARY KEY (id, planning_id)
      )`,
      
      // Table affectations
      `CREATE TABLE IF NOT EXISTS affectations (
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
        UNIQUE (planning_id, classe_id, semaine_id)
      )`,
      
      // Table admin_sessions (optionnelle pour la copie)
      `CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        session_token VARCHAR(64) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table imports
      `CREATE TABLE IF NOT EXISTS imports (
        id SERIAL PRIMARY KEY,
        planning_id INTEGER REFERENCES plannings(id) ON DELETE CASCADE,
        filename VARCHAR(255),
        total_families INTEGER,
        successful_imports INTEGER,
        errors TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of tableQueries) {
      await this.destQuery(query);
    }

    console.log('✅ Tables de destination initialisées');
  }

  async copyPlanningData(sourcePlanning, newToken, client) {
    console.log('📋 Copie des données du planning...');
    
    // Vérifier si le token existe déjà dans la destination
    const existingResult = await this.query(this.destPool, 
      'SELECT id FROM plannings WHERE token = $1', [newToken]
    );
    
    if (existingResult.rows.length > 0) {
      throw new Error(`Le token '${newToken}' existe déjà dans la base de destination`);
    }

    const result = await client.query(
      `INSERT INTO plannings (token, name, description, annee_scolaire, created_at, updated_at, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        newToken,
        sourcePlanning.name,
        sourcePlanning.description,
        sourcePlanning.annee_scolaire,
        sourcePlanning.created_at,
        sourcePlanning.updated_at,
        sourcePlanning.is_active
      ]
    );

    const newPlanningId = result.rows[0].id;
    this.mappings.plannings.set(sourcePlanning.id, newPlanningId);
    
    console.log(`✅ Planning copié: ${sourcePlanning.id} → ${newPlanningId}`);
  }

  async copyClassesData(sourcePlanningId, client) {
    console.log('🏫 Copie des classes...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM classes WHERE planning_id = $1 ORDER BY ordre, id',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const classe of result.rows) {
      await client.query(
        `INSERT INTO classes (id, planning_id, nom, couleur, ordre, description, instructions_pdf_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          classe.id,
          newPlanningId,
          classe.nom,
          classe.couleur,
          classe.ordre,
          classe.description,
          classe.instructions_pdf_url
        ]
      );
      
      this.mappings.classes.set(`${sourcePlanningId}-${classe.id}`, classe.id);
    }
    
    console.log(`✅ ${result.rows.length} classes copiées`);
  }

  async copyFamillesData(sourcePlanningId, client) {
    console.log('👨‍👩‍👧‍👦 Copie des familles...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM familles WHERE planning_id = $1 ORDER BY id',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const famille of result.rows) {
      const insertResult = await client.query(
        `INSERT INTO familles (planning_id, nom, email, telephone, telephone2, nb_nettoyage, classes_preferences, notes, is_active, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          newPlanningId,
          famille.nom,
          famille.email,
          famille.telephone,
          famille.telephone2,
          famille.nb_nettoyage,
          famille.classes_preferences,
          famille.notes,
          famille.is_active,
          famille.updated_at
        ]
      );
      
      const newFamilleId = insertResult.rows[0].id;
      this.mappings.familles.set(famille.id, newFamilleId);
    }
    
    console.log(`✅ ${result.rows.length} familles copiées`);
  }

  async copyFamillesExclusionsData(sourcePlanningId, client) {
    console.log('🚫 Copie des exclusions de familles...');
    
    const result = await this.sourceQuery(
      `SELECT fe.* FROM familles_exclusions fe 
       JOIN familles f ON fe.famille_id = f.id 
       WHERE f.planning_id = $1`,
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const exclusion of result.rows) {
      const newFamilleId = this.mappings.familles.get(exclusion.famille_id);
      
      if (newFamilleId) {
        await client.query(
          `INSERT INTO familles_exclusions (famille_id, planning_id, date_debut, date_fin, type, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newFamilleId,
            newPlanningId,
            exclusion.date_debut,
            exclusion.date_fin,
            exclusion.type,
            exclusion.notes,
            exclusion.created_at
          ]
        );
      }
    }
    
    console.log(`✅ ${result.rows.length} exclusions de familles copiées`);
  }

  async copySemainesData(sourcePlanningId, client) {
    console.log('📅 Copie des semaines...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM semaines WHERE planning_id = $1 ORDER BY debut',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const semaine of result.rows) {
      await client.query(
        `INSERT INTO semaines (id, planning_id, debut, fin, type, description, is_published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          semaine.id,
          newPlanningId,
          semaine.debut,
          semaine.fin,
          semaine.type,
          semaine.description,
          semaine.is_published,
          semaine.published_at
        ]
      );
      
      this.mappings.semaines.set(`${sourcePlanningId}-${semaine.id}`, semaine.id);
    }
    
    console.log(`✅ ${result.rows.length} semaines copiées`);
  }

  async copyAffectationsData(sourcePlanningId, client) {
    console.log('📝 Copie des affectations...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM affectations WHERE planning_id = $1 ORDER BY created_at',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const affectation of result.rows) {
      const newFamilleId = this.mappings.familles.get(affectation.famille_id);
      
      if (newFamilleId) {
        await client.query(
          `INSERT INTO affectations (planning_id, famille_id, classe_id, semaine_id, notes, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newPlanningId,
            newFamilleId,
            affectation.classe_id,
            affectation.semaine_id,
            affectation.notes,
            affectation.created_at,
            affectation.updated_at
          ]
        );
      }
    }
    
    console.log(`✅ ${result.rows.length} affectations copiées`);
  }

  async copyScheduledSMSData(sourcePlanningId, client) {
    console.log('📱 Copie des SMS planifiés...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM scheduled_sms WHERE planning_id = $1',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const sms of result.rows) {
      await client.query(
        `INSERT INTO scheduled_sms (planning_id, name, description, message_template, day_of_week, hour, minute, target_type, is_active, last_executed_date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          newPlanningId,
          sms.name,
          sms.description,
          sms.message_template,
          sms.day_of_week,
          sms.hour,
          sms.minute,
          sms.target_type,
          sms.is_active,
          sms.last_executed_date,
          sms.created_at,
          sms.updated_at
        ]
      );
    }
    
    console.log(`✅ ${result.rows.length} SMS planifiés copiés`);
  }

  async copyImportsData(sourcePlanningId, client) {
    console.log('📊 Copie des données d\'import...');
    
    const result = await this.sourceQuery(
      'SELECT * FROM imports WHERE planning_id = $1 ORDER BY created_at',
      [sourcePlanningId]
    );

    const newPlanningId = this.mappings.plannings.get(sourcePlanningId);
    
    for (const importData of result.rows) {
      await client.query(
        `INSERT INTO imports (planning_id, filename, total_families, successful_imports, errors, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          newPlanningId,
          importData.filename,
          importData.total_families,
          importData.successful_imports,
          importData.errors,
          importData.created_at
        ]
      );
    }
    
    console.log(`✅ ${result.rows.length} enregistrements d'import copiés`);
  }

  async validateCopy(sourcePlanningId, destToken) {
    console.log('🔍 Validation de la copie...');
    
    // Récupérer le planning de destination
    const destPlanningResult = await this.destQuery(
      'SELECT id FROM plannings WHERE token = $1',
      [destToken]
    );
    
    if (destPlanningResult.rows.length === 0) {
      throw new Error('Planning de destination non trouvé après copie');
    }
    
    const destPlanningId = destPlanningResult.rows[0].id;
    
    // Comparer les comptages
    const tables = [
      { name: 'classes', query: 'SELECT COUNT(*) as count FROM classes WHERE planning_id = $1' },
      { name: 'familles', query: 'SELECT COUNT(*) as count FROM familles WHERE planning_id = $1' },
      { name: 'semaines', query: 'SELECT COUNT(*) as count FROM semaines WHERE planning_id = $1' },
      { name: 'affectations', query: 'SELECT COUNT(*) as count FROM affectations WHERE planning_id = $1' },
      { name: 'scheduled_sms', query: 'SELECT COUNT(*) as count FROM scheduled_sms WHERE planning_id = $1' },
      { name: 'imports', query: 'SELECT COUNT(*) as count FROM imports WHERE planning_id = $1' }
    ];
    
    for (const table of tables) {
      const sourceCount = await this.sourceQuery(table.query, [sourcePlanningId]);
      const destCount = await this.destQuery(table.query, [destPlanningId]);
      
      const srcCount = parseInt(sourceCount.rows[0].count);
      const dstCount = parseInt(destCount.rows[0].count);
      
      if (srcCount !== dstCount) {
        console.warn(`⚠️ Différence dans ${table.name}: source=${srcCount}, destination=${dstCount}`);
      } else {
        console.log(`✅ ${table.name}: ${srcCount} enregistrements`);
      }
    }
    
    console.log('🔍 Validation terminée');
  }
}

// Fonction principale
async function main() {
  if (process.argv.length < 5) {
    console.error('❌ Usage: node copy-planning.js <SOURCE_URI> <DEST_URI> <PLANNING_TOKEN> [NEW_TOKEN]');
    console.error('');
    console.error('Exemples:');
    console.error('  node copy-planning.js "postgresql://user:pass@host1:5432/db1" "postgresql://user:pass@host2:5432/db2" "abc123"');
    console.error('  node copy-planning.js "postgresql://user:pass@host1:5432/db1" "postgresql://user:pass@host2:5432/db2" "abc123" "def456"');
    process.exit(1);
  }

  const [,, sourceUri, destUri, planningToken, newToken] = process.argv;
  
  console.log('🔄 Initialisation de la copie de planning...');
  console.log(`📤 Source: ${sourceUri.replace(/:\/\/.*@/, '://***@')}`);
  console.log(`📥 Destination: ${destUri.replace(/:\/\/.*@/, '://***@')}`);
  console.log(`🎯 Token planning: ${planningToken}`);
  if (newToken) {
    console.log(`🆕 Nouveau token: ${newToken}`);
  }
  
  const copier = new PlanningCopier(sourceUri, destUri);
  
  try {
    await copier.copyPlanning(planningToken, newToken);
  } catch (error) {
    console.error('💥 Erreur fatale:', error.message);
    process.exit(1);
  } finally {
    await copier.close();
  }
}

// Exécution si appelé directement
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main().catch(console.error);
}

export default PlanningCopier;
