/**
 * Validateurs réutilisables pour éviter la duplication
 */

import { classesQueries } from './queries.js';

/**
 * Validation du numéro de téléphone
 */
export function validatePhoneNumber(phone, required = true) {
  if (!phone || phone.trim() === '') {
    if (required) {
      throw new Error('Numéro de téléphone obligatoire pour les SMS');
    }
    return true;
  }
  
  // Validation basique du format
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.length < 8) {
    throw new Error('Numéro de téléphone trop court');
  }
  
  return true;
}

/**
 * Validation des préférences de classes
 */
export async function validateClassesPreferences(classesPreferences, planningId) {
  if (!classesPreferences || classesPreferences.length === 0) {
    return true;
  }
  
  for (const classeId of classesPreferences) {
    const existingClasse = await classesQueries.checkExists(classeId, planningId);
    if (existingClasse.rows.length === 0) {
      throw new Error(`Classe '${classeId}' n'existe pas dans ce planning`);
    }
  }
  
  return true;
}

/**
 * Validation du nombre de nettoyages
 */
export function validateNbNettoyage(nbNettoyage) {
  const nb = parseInt(nbNettoyage) || 3;
  if (nb < 1 || nb > 10) {
    throw new Error('Nombre de nettoyages doit être entre 1 et 10');
  }
  return nb;
}

/**
 * Validation des couleurs hexadécimales
 */
export function validateHexColor(couleur) {
  let color = couleur || '#ffcccb';
  if (!color.startsWith('#')) {
    color = '#' + color;
  }
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error('Couleur doit être au format hexadécimal (ex: #ffcccb)');
  }
  return color;
}

/**
 * Validation de l'ordre (pour les classes)
 */
export function validateOrdre(ordre) {
  const order = parseInt(ordre) || 0;
  if (order < 0 || order > 100) {
    throw new Error('Ordre doit être entre 0 et 100');
  }
  return order;
}

/**
 * Validation des dates
 */
export function validateDateRange(dateDebut, dateFin) {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  
  if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
    throw new Error('Format de date invalide');
  }
  
  if (fin < debut) {
    throw new Error('La date de fin doit être postérieure à la date de début');
  }
  
  return { debut: dateDebut, fin: dateFin };
}

/**
 * Validation des données de famille (création/modification)
 */
export async function validateFamilleData(data, planningId, isUpdate = false) {
  // Validation du nom
  if (!data.nom || data.nom.trim() === '') {
    throw new Error('Nom de famille obligatoire');
  }
  
  // Validation du téléphone principal
  validatePhoneNumber(data.telephone, true);
  
  // Validation du téléphone secondaire (optionnel)
  if (data.telephone2) {
    validatePhoneNumber(data.telephone2, false);
  }
  
  // Validation du nombre de nettoyages
  data.nb_nettoyage = validateNbNettoyage(data.nb_nettoyage);
  
  // Validation des préférences de classes
  await validateClassesPreferences(data.classes_preferences || [], planningId);
  
  return true;
}

/**
 * Validation des données de classe (création/modification)
 */
export function validateClasseData(data) {
  // Validation de l'ID
  if (!data.id || data.id.trim() === '') {
    throw new Error('ID de classe obligatoire');
  }
  
  // Validation du nom
  if (!data.nom || data.nom.trim() === '') {
    throw new Error('Nom de classe obligatoire');
  }
  
  // Validation de la couleur
  data.couleur = validateHexColor(data.couleur);
  
  // Validation de l'ordre
  data.ordre = validateOrdre(data.ordre);
  
  return true;
}

/**
 * Validation des données de semaine
 */
export function validateSemaineData(data) {
  // Validation des dates
  validateDateRange(data.debut, data.fin);
  
  // Validation du type
  const validTypes = ['normale', 'vacances', 'fériée', 'spéciale'];
  if (data.type && !validTypes.includes(data.type)) {
    throw new Error(`Type de semaine invalide. Types valides: ${validTypes.join(', ')}`);
  }
  
  return true;
}
