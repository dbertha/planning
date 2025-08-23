import { query } from './api/db.js';

async function migrateExclusionsTable() {
  try {
    console.log('🔧 Migration de la table familles_exclusions...\n');
    
    // 1. Ajouter la colonne planning_id
    console.log('1️⃣ Ajout de la colonne planning_id...');
    await query(`
      ALTER TABLE familles_exclusions 
      ADD COLUMN IF NOT EXISTS planning_id INTEGER
    `);
    
    // 2. Ajouter la colonne type
    console.log('2️⃣ Ajout de la colonne type...');
    await query(`
      ALTER TABLE familles_exclusions 
      ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'indisponibilite'
    `);
    
    // 3. Ajouter la colonne notes
    console.log('3️⃣ Ajout de la colonne notes...');
    await query(`
      ALTER TABLE familles_exclusions 
      ADD COLUMN IF NOT EXISTS notes TEXT
    `);
    
    // 4. Mettre à jour les enregistrements existants (s'il y en a)
    const existingRecords = await query('SELECT COUNT(*) FROM familles_exclusions WHERE planning_id IS NULL');
    if (parseInt(existingRecords.rows[0].count) > 0) {
      console.log('4️⃣ Mise à jour des enregistrements existants...');
      // Pour les anciens enregistrements, on peut assigner un planning_id par défaut
      // ou les supprimer selon les besoins
      await query(`
        UPDATE familles_exclusions 
        SET planning_id = 1, type = 'indisponibilite' 
        WHERE planning_id IS NULL
      `);
    }
    
    // 5. Ajouter les contraintes de clé étrangère si possible
    console.log('5️⃣ Ajout des contraintes...');
    try {
      await query(`
        ALTER TABLE familles_exclusions 
        ADD CONSTRAINT IF NOT EXISTS fk_familles_exclusions_planning 
        FOREIGN KEY (planning_id) REFERENCES plannings(id) ON DELETE CASCADE
      `);
      console.log('✅ Contrainte planning_id ajoutée');
    } catch (error) {
      console.log('⚠️ Contrainte planning_id non ajoutée (normal si la table plannings n\'existe pas encore)');
    }
    
    try {
      await query(`
        ALTER TABLE familles_exclusions 
        ADD CONSTRAINT IF NOT EXISTS fk_familles_exclusions_famille 
        FOREIGN KEY (famille_id) REFERENCES familles(id) ON DELETE CASCADE
      `);
      console.log('✅ Contrainte famille_id ajoutée');
    } catch (error) {
      console.log('⚠️ Contrainte famille_id non ajoutée (normal si la table familles n\'existe pas encore)');
    }
    
    // 6. Vérifier la nouvelle structure
    console.log('\n6️⃣ Vérification de la nouvelle structure...');
    const newStructure = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'familles_exclusions' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Nouvelle structure:');
    console.table(newStructure.rows);
    
    console.log('\n🎉 Migration terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur de migration:', error.message);
    process.exit(1);
  }
}

migrateExclusionsTable().then(() => process.exit(0));
