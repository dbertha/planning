#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CSV_FILE = 'Codes clés nettoyage - Codes clés.csv';

// Fonction pour parser le CSV et convertir les dates
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').slice(1); // Skip header
  const weekCodes = [];
  
  lines.forEach(line => {
    if (!line.trim()) return;
    
    const [, dateStr, code] = line.split(',');
    if (!dateStr || !code) return;
    
    // Parse la date "samedi 06/09/25" vers format ISO
    const dateMatch = dateStr.trim().match(/samedi (\d{2})\/(\d{2})\/(\d{2})/);
    if (!dateMatch) return;
    
    const [, day, month, year] = dateMatch;
    const fullYear = `20${year}`;
    const isoDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Calculer le lundi de cette semaine (samedi -5 jours)
    const saturday = new Date(isoDate);
    const monday = new Date(saturday);
    monday.setDate(saturday.getDate() - 5);
    
    // Calculer le dimanche (lundi +6 jours)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    // Générer l'ID de semaine (format YYYY-MM-DD du lundi)
    const weekId = monday.toISOString().split('T')[0];
    
    weekCodes.push({
      weekId,
      startDate: monday.toISOString().split('T')[0],
      endDate: sunday.toISOString().split('T')[0],
      code: code.trim(),
      originalDate: dateStr.trim(),
      saturday: isoDate
    });
  });
  
  return weekCodes.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

// Fonction pour importer les codes dans la base
async function importCodesToDB(client, weekCodes, planningToken) {
  try {
    // Récupérer l'ID du planning
    const planningResult = await client.query(
      'SELECT id, name FROM plannings WHERE token = $1',
      [planningToken]
    );
    
    if (planningResult.rows.length === 0) {
      throw new Error(`Planning avec le token "${planningToken}" non trouvé`);
    }
    
    const planning = planningResult.rows[0];
    const planningId = planning.id;
    
    console.log(`📋 Planning trouvé: "${planning.name}" (ID: ${planningId})`);
    console.log(`🔢 ${weekCodes.length} codes à importer\n`);
    
    let updated = 0;
    let errors = 0;
    
    for (const weekCode of weekCodes) {
      try {
        // Vérifier si une semaine existe pour cette période (recherche par dates)
        const existingWeek = await client.query(
          `SELECT id, code_cles, debut, fin 
           FROM semaines 
           WHERE planning_id = $1 
             AND (
               (debut <= $2 AND fin >= $2) OR  -- Le samedi est dans la semaine
               (debut <= $3 AND fin >= $3) OR  -- Le lundi est dans la semaine  
               (debut >= $3 AND fin <= $4)     -- La semaine est dans notre période
             )`,
          [planningId, weekCode.saturday, weekCode.startDate, weekCode.endDate]
        );
        
        if (existingWeek.rows.length === 0) {
          // Ne pas créer de semaine, juste l'ignorer
          console.log(`⚠️ Aucune semaine trouvée pour ${weekCode.originalDate}, code ${weekCode.code} ignoré`);
          errors++;
        } else if (existingWeek.rows.length > 1) {
          // Plusieurs semaines trouvées - ambiguïté
          console.log(`⚠️ ${existingWeek.rows.length} semaines trouvées pour ${weekCode.originalDate}, code ${weekCode.code} ignoré (ambiguïté)`);
          existingWeek.rows.forEach(s => {
            console.log(`   - Semaine ${s.id}: ${s.debut} → ${s.fin}`);
          });
          errors++;
        } else {
          // Exactement une semaine trouvée - parfait !
          const semaine = existingWeek.rows[0];
          const oldCode = semaine.code_cles;
          
          await client.query(
            'UPDATE semaines SET code_cles = $1 WHERE id = $2 AND planning_id = $3',
            [weekCode.code, semaine.id, planningId]
          );
          
          console.log(`✅ Mis à jour semaine ${semaine.id} (${semaine.debut} → ${semaine.fin}) avec code ${weekCode.code}${oldCode ? ` (ancien: ${oldCode})` : ''} [${weekCode.originalDate}]`);
          updated++;
        }
      } catch (err) {
        console.error(`❌ Erreur pour semaine ${weekCode.weekId}:`, err.message);
        errors++;
      }
    }
    
    console.log('\n📊 Résumé de l\'import:');
    console.log(`🔄 Semaines mises à jour: ${updated}`);
    console.log(`⚠️ Semaines non trouvées: ${errors}`);
    
  } catch (error) {
    console.error('Erreur lors de l\'import:', error.message);
    throw error;
  }
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log('🔑 Import des codes clés de nettoyage');
  console.log('');
  console.log('Usage:');
  console.log('  node import-codes-cles-standalone.js <TOKEN_PLANNING> <DB_URI>');
  console.log('');
  console.log('Paramètres:');
  console.log('  TOKEN_PLANNING   Token du planning dans lequel importer les codes');
  console.log('  DB_URI          URI de connexion PostgreSQL');
  console.log('');
  console.log('Exemples:');
  console.log('  node import-codes-cles-standalone.js mon-planning "postgresql://user:pass@localhost:5432/planning"');
  console.log('  node import-codes-cles-standalone.js ecole2025 "postgres://user:pass@db.example.com/planning"');
  console.log('');
  console.log('Format CSV attendu:');
  console.log('  Le fichier "Codes clés nettoyage - Codes clés.csv" doit être dans le même dossier');
  console.log('  Format: mois,WE nettoyage 25-26,Code');
  console.log('  Exemple: septembre,samedi 06/09/25,6466');
  console.log('');
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  if (args.length < 2) {
    console.error('❌ Paramètres manquants\n');
    showHelp();
    process.exit(1);
  }
  
  const [planningToken, dbUri] = args;
  const csvPath = path.join(__dirname, CSV_FILE);
  
  // Vérifier que le fichier CSV existe
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Fichier CSV non trouvé: ${csvPath}`);
    console.error('Assurez-vous que le fichier "Codes clés nettoyage - Codes clés.csv" est dans le même dossier que ce script.');
    process.exit(1);
  }
  
  const client = new Client({ connectionString: dbUri });
  
  try {
    console.log('🔗 Connexion à la base de données...');
    await client.connect();
    
    console.log('🔍 Lecture du fichier CSV...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('📊 Analyse du CSV...');
    const weekCodes = parseCSV(csvContent);
    
    if (weekCodes.length === 0) {
      console.warn('⚠️ Aucun code trouvé dans le CSV');
      process.exit(0);
    }
    
    console.log('💾 Import en base de données...');
    await importCodesToDB(client, weekCodes, planningToken);
    
    console.log('\n🎉 Import terminé avec succès !');
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Gérer les signaux d'interruption
process.on('SIGINT', async () => {
  console.log('\n⏹️ Interruption détectée, fermeture...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏹️ Arrêt demandé, fermeture...');
  process.exit(0);
});

// Exécuter le script
main();

export { parseCSV, importCodesToDB };
