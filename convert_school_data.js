#!/usr/bin/env node

/**
 * Script de conversion des données de l'école au format CSV pour import
 * 
 * Usage: node convert_school_data.js
 * 
 * Génère:
 * - classes_import.csv : Classes/zones de nettoyage
 * - familles_import.csv : Familles avec préférences
 */

import fs from 'fs';
import path from 'path';

// Mapping des titulaires vers les IDs de zones de nettoyage
const TITULAIRE_TO_ZONE = {
  'Stéphanie': 'A',  // M1/M2 -> Partie A (Canard + Grenouille)
  'Eglantine': 'B',  // M1 -> Partie B (Chat + Cuisine Cheval)
  'Béatrice': 'G',   // M2/M3 -> Partie G (Libellule + Cheval)
  'Candice': 'C',    // M2/M3 -> Partie C (Poule + Poisson)
  'Camille': 'E',    // P1 -> Partie E (Papillon + Vache)
  'Clémentine': 'F', // P2 -> Partie F (Chien + Lapin)
  'Gjevrie': 'D',    // P3 -> Partie D (Hirondelle + Milan)
  'Aveline': 'D',    // P4 -> Partie D (Hirondelle + Milan)
  'Anne': 'E',       // P5 -> Partie E (Papillon + Vache)
  'Anaëlle': 'F'     // P6 -> Partie F (Chien + Lapin)
};

// Définition des zones de nettoyage
const ZONES_NETTOYAGE = [
  {
    id: 'A',
    nom: 'Partie A - Maternelle',
    couleur: '#ffb3ba',
    ordre: 1,
    description: 'Local Canard (Classe de Stéphanie) + local Grenouille (Salle de Taï-Chi au grenier)'
  },
  {
    id: 'B', 
    nom: 'Partie B - Maternelle',
    couleur: '#ffdfba',
    ordre: 2,
    description: 'Local Chat (Classe d\'Eglantine) + espace Cuisine du local Cheval (grenier)'
  },
  {
    id: 'C',
    nom: 'Partie C - Maternelle', 
    couleur: '#ffffba',
    ordre: 3,
    description: 'Local Poule (Classe de Candice) + local Poisson (local sieste des marmottes)'
  },
  {
    id: 'G',
    nom: 'Partie G - Maternelle',
    couleur: '#baffba',
    ordre: 4,
    description: 'Local Libellule (Classe de Béatrice) + local Cheval (grenier) = uniquement espace devant le local Écureuil (salle des profs), plancher et scène compris'
  },
  {
    id: 'D',
    nom: 'Partie D - Primaire',
    couleur: '#baffc9',
    ordre: 5,
    description: 'Local Hirondelle (Classe de P3) + local Milan (classe de P4)'
  },
  {
    id: 'E',
    nom: 'Partie E - Primaire',
    couleur: '#bae1ff',
    ordre: 6,
    description: 'Local Papillon (Classe de P1) + local Vache (Classe de P5)'
  },
  {
    id: 'F',
    nom: 'Partie F - Primaire',
    couleur: '#c9baff',
    ordre: 7,
    description: 'Local Chien (Classe de P6) + local Lapin (Classe de P2)'
  }
];

// Familles à exclure du planning
const FAMILLES_EXCLUES = [
  'de Troostembergh',
  'Guillaume', 
  'Labeau',
  'Lintermans',
  'Minon Gauthier',
  'Némerlin Didion',
  'Vanhecke Prevoo',
  'Vereecke'
];

/**
 * Parse CSV content into array of objects with proper quote handling
 */
function parseCSV(csvContent, delimiter = ';') {
  const lines = csvContent.trim().split(/\r?\n/); // Gérer les retours chariot Windows
  const headers = parseCSVLine(lines[0], delimiter);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line, delimiter);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    return obj;
  });
}

/**
 * Parse a single CSV line handling quoted values properly
 */
function parseCSVLine(line, delimiter = ',') {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current); // Add the last value
  return values;
}

/**
 * Normalise numéro de téléphone belge
 */
function normalizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Nettoyer le numéro
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si commence par 32, c'est déjà au format international
  if (cleaned.startsWith('32')) {
    return '+' + cleaned;
  }
  
  // Si commence par 0, remplacer par +32
  if (cleaned.startsWith('0')) {
    return '+32' + cleaned.substring(1);
  }
  
  // Si pas de préfixe, ajouter +32
  if (cleaned.length === 9) {
    return '+32' + cleaned;
  }
  
  return phone; // Retourner tel quel si format non reconnu
}

/**
 * Génère le CSV des classes
 */
function generateClassesCSV() {
  const headers = ['id', 'nom', 'couleur', 'ordre', 'description'];
  
  const csvLines = [headers.join(',')];
  
  ZONES_NETTOYAGE.forEach(zone => {
    const line = [
      zone.id,
      `"${zone.nom}"`,
      zone.couleur,
      zone.ordre,
      `"${zone.description}"`
    ];
    csvLines.push(line.join(','));
  });
  
  return csvLines.join('\n');
}

/**
 * Génère le CSV des familles
 */
function generateFamillesCSV() {
  // Lire les fichiers de données
  const elevesContent = fs.readFileSync('Coordonnées élèves 2025-2026.csv', 'utf-8');
  const famillesContent = fs.readFileSync('Coordonnées élèves 2025-2026_familles.csv', 'utf-8');
  
  const eleves = parseCSV(elevesContent, ',');
  const famillesData = parseCSV(famillesContent, ','); // Utiliser virgule pour le fichier familles
  
  // Créer un mapping nom_famille -> données famille (avec gestion des doublons)
  const famillesMap = new Map();
  const famillesDuplicates = new Map(); // Pour stocker les familles en doublon
  
  famillesData.forEach(famille => {
    const nomFamille = famille['Nom Elève'];
    if (nomFamille) {
      if (famillesMap.has(nomFamille)) {
        // Doublon détecté, stocker dans la map des duplicates
        if (!famillesDuplicates.has(nomFamille)) {
          famillesDuplicates.set(nomFamille, [famillesMap.get(nomFamille)]);
        }
        famillesDuplicates.get(nomFamille).push(famille);
      } else {
        famillesMap.set(nomFamille, famille);
      }
    }
  });
  
  // Grouper les élèves par nom de famille et collecter les préférences de classes
  const famillesPreferences = new Map();
  
  eleves.forEach(eleve => {
    const nomEleve = eleve['Nom Elève'];
    const titulaire = eleve['Titulaire'];
    
    if (!nomEleve || !titulaire) return;
    
    // Mapper titulaire vers zone
    const zoneId = TITULAIRE_TO_ZONE[titulaire];
    if (!zoneId) {
      console.warn(`Titulaire non mappé: ${titulaire} pour élève ${nomEleve}`);
      return;
    }
    
    if (!famillesPreferences.has(nomEleve)) {
      famillesPreferences.set(nomEleve, new Set());
    }
    
    famillesPreferences.get(nomEleve).add(zoneId);
  });
  
  // Générer les données familles pour CSV
  const headers = ['nom', 'email', 'telephone', 'telephone2', 'nb_nettoyage', 'classes_preferences', 'notes'];
  const csvLines = [headers.join(',')];
  
  // Traiter les familles normales (sans doublon)
  famillesPreferences.forEach((zones, nomEleve) => {
    if (!famillesDuplicates.has(nomEleve)) {
      const familleData = famillesMap.get(nomEleve);
      if (!familleData) {
        console.warn(`Données famille manquantes pour: ${nomEleve}`);
        return;
      }
      
      processFamille(familleData, nomEleve, zones, nomEleve);
    }
  });
  
  // Traiter les familles en doublon
  famillesDuplicates.forEach((duplicates, nomFamille) => {
    duplicates.forEach((familleData, index) => {
      // Trouver les élèves correspondant à cette famille spécifique
      let elevesDeFamily = eleves.filter(e => {
        return e['Nom Elève'] === nomFamille && 
               (e['GSM Père'] === familleData['GSM Père'] ||
                e['GSM Mère'] === familleData['GSM Mère']);
      });
      
      if (elevesDeFamily.length === 0) {
        // Fallback: utiliser tous les élèves de ce nom de famille
        elevesDeFamily = eleves.filter(e => e['Nom Elève'] === nomFamille);
      }
      
      const prenomsEleves = elevesDeFamily.map(e => e['Prénom élève']).sort().join(', ');
      const nomFamilleOutput = `${nomFamille} (${prenomsEleves})`;
      
      // Collecter les zones pour cette famille spécifique
      const zones = new Set();
      elevesDeFamily.forEach(eleve => {
        const titulaire = eleve['Titulaire'];
        const zoneId = TITULAIRE_TO_ZONE[titulaire];
        if (zoneId) {
          zones.add(zoneId);
        }
      });
      
      if (zones.size > 0) {
        processFamille(familleData, nomFamille, zones, nomFamilleOutput);
      }
    });
  });
  
  // Fonction pour traiter une famille
  function processFamille(familleData, nomEleve, zones, nomFamilleOutput = null) {
    const nomFamille = nomFamilleOutput || familleData['Nom Elève'] || nomEleve;
    
    // Vérifier si famille exclue
    const isExcluded = FAMILLES_EXCLUES.some(excluded => 
      nomFamille.toLowerCase().includes(excluded.toLowerCase())
    );
    
    if (isExcluded) {
      console.log(`Famille exclue: ${nomFamille}`);
      return;
    }
    
    // Extraire emails et téléphones
    const emailPere = familleData['EMail Père'] || '';
    const emailMere = familleData['EMail Mère'] || '';
    const email = emailPere || emailMere;
    
    const telPere = normalizePhoneNumber(familleData['GSM Père']);
    const telMere = normalizePhoneNumber(familleData['GSM Mère']); 
    const telephone = telPere || telMere;
    const telephone2 = (telPere && telMere && telPere !== telMere) ? telMere : '';
    
    // Valider téléphone obligatoire
    if (!telephone) {
      console.warn(`Pas de téléphone pour famille: ${nomFamille}`);
      return;
    }
    
    // Construire préférences de classes
    const classesPrefs = Array.from(zones).sort().join(',');
    
    // Notes avec informations parents
    const notesParts = [];
    if (familleData['Nom Père'] && familleData['Prénom Père']) {
      notesParts.push(`Père: ${familleData['Prénom Père']} ${familleData['Nom Père']}`);
    }
    if (familleData['Nom Mère'] && familleData['Prénom Mère']) {
      notesParts.push(`Mère: ${familleData['Prénom Mère']} ${familleData['Nom Mère']}`);
    }
    
    const notes = notesParts.join(' | ');
    
    const line = [
      `"${nomFamille}"`,
      `"${email}"`,
      `"${telephone}"`,
      `"${telephone2}"`,
      '4', // nb_nettoyage par défaut
      `"${classesPrefs}"`,
      `"${notes}"`
    ];
    
    csvLines.push(line.join(','));
  }
  
  return csvLines.join('\n');
}

/**
 * Main function
 */
function main() {
  try {
    console.log('🔄 Conversion des données de l\'école...\n');
    
    // Générer CSV des classes
    console.log('📋 Génération du fichier classes...');
    const classesCSV = generateClassesCSV();
    fs.writeFileSync('classes_import.csv', classesCSV, 'utf-8');
    console.log('✅ classes_import.csv généré');
    console.log(`   → ${ZONES_NETTOYAGE.length} zones de nettoyage\n`);
    
    // Générer CSV des familles
    console.log('👨‍👩‍👧‍👦 Génération du fichier familles...');
    const famillesCSV = generateFamillesCSV();
    fs.writeFileSync('familles_import.csv', famillesCSV, 'utf-8');
    
    // Compter les lignes générées
    const famillesLines = famillesCSV.split('\n').length - 1; // -1 pour header
    console.log('✅ familles_import.csv généré');
    console.log(`   → ${famillesLines} familles actives`);
    console.log(`   → ${FAMILLES_EXCLUES.length} familles exclues\n`);
    
    // Afficher zones et leurs mappings
    console.log('🗺️  Mapping des zones:');
    Object.entries(TITULAIRE_TO_ZONE).forEach(([titulaire, zone]) => {
      const zoneInfo = ZONES_NETTOYAGE.find(z => z.id === zone);
      console.log(`   ${titulaire} → Zone ${zone} (${zoneInfo?.nom})`);
    });
    
    console.log('\n🚫 Familles exclues:');
    FAMILLES_EXCLUES.forEach(famille => {
      console.log(`   - ${famille}`);
    });
    
    console.log('\n✨ Conversion terminée!');
    console.log('📁 Fichiers générés:');
    console.log('   - classes_import.csv');
    console.log('   - familles_import.csv');
    console.log('\nVous pouvez maintenant importer ces fichiers dans le système de planning.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la conversion:', error.message);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main();
}

export { generateClassesCSV, generateFamillesCSV, ZONES_NETTOYAGE, TITULAIRE_TO_ZONE, FAMILLES_EXCLUES };
