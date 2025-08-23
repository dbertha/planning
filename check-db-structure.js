import { query } from './api/db.js';

async function checkDatabase() {
  try {
    console.log('🔍 Vérification de la structure de familles_exclusions...\n');
    
    // Vérifier si la table existe
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'familles_exclusions'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ La table familles_exclusions n\'existe pas!');
      return;
    }
    
    console.log('✅ La table familles_exclusions existe');
    
    // Vérifier la structure
    const structure = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'familles_exclusions' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Structure actuelle:');
    console.table(structure.rows);
    
    // Vérifier spécifiquement planning_id
    const planningIdExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'familles_exclusions' 
        AND column_name = 'planning_id'
      );
    `);
    
    console.log(`\n🔍 Colonne planning_id: ${planningIdExists.rows[0].exists ? '✅ Existe' : '❌ N\'existe pas'}`);
    
    // Compter les enregistrements existants
    const count = await query('SELECT COUNT(*) FROM familles_exclusions');
    console.log(`📊 Nombre d'enregistrements: ${count.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkDatabase().then(() => process.exit(0));
