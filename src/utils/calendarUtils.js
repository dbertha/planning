/**
 * Utilitaires pour générer des événements de calendrier
 * Support des formats iCalendar (.ics) et Google Calendar
 */

/**
 * Formate une date pour iCalendar (format YYYYMMDDTHHMMSSZ)
 */
function formatDateForICS(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Formate une date pour Google Calendar (format YYYYMMDDTHHMMSSZ)
 */
function formatDateForGoogle(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Échapper les caractères spéciaux pour iCalendar
 */
function escapeICSText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Génère un fichier iCalendar (.ics) pour une affectation
 * @param {Object} affectation - Données de l'affectation
 * @param {Object} semaine - Données de la semaine
 * @param {Object} classe - Données de la classe
 * @param {Object} famille - Données de la famille
 * @returns {string} Contenu du fichier .ics
 */
export function generateICSFile(affectation, semaine, classe, famille) {
  // Dates de début et fin (journée complète)
  const startDate = new Date(semaine.debut);
  const endDate = new Date(semaine.fin);
  endDate.setDate(endDate.getDate() + 1); // Jour suivant pour événement d'une journée

  // Titre de l'événement
  const title = `Nettoyage École - ${classe.nom}`;
  
  // Description
  const description = [
    `Affectation de nettoyage pour ${famille.nom}`,
    `Classe: ${classe.nom}`,
    `Période: du ${startDate.toLocaleDateString('fr-FR')} au ${new Date(semaine.fin).toLocaleDateString('fr-FR')}`,
    classe.instructions_pdf_url ? `Instructions: ${classe.instructions_pdf_url}` : ''
  ].filter(Boolean).join('\\n');

  // Générer un UID unique
  const uid = `affectation-${affectation.id}-${Date.now()}@planning-ecole.com`;

  // Contenu du fichier ICS
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Planning École//Planning Nettoyage//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${startDate.toISOString().split('T')[0].replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${endDate.toISOString().split('T')[0].replace(/-/g, '')}`,
    `SUMMARY:${escapeICSText(title)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(classe.nom)}`,
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'DESCRIPTION:Rappel nettoyage école',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Génère un lien Google Calendar pour une affectation
 * @param {Object} affectation - Données de l'affectation
 * @param {Object} semaine - Données de la semaine
 * @param {Object} classe - Données de la classe
 * @param {Object} famille - Données de la famille
 * @returns {string} URL Google Calendar
 */
export function generateGoogleCalendarLink(affectation, semaine, classe, famille) {
  const startDate = new Date(semaine.debut);
  const endDate = new Date(semaine.fin);
  endDate.setDate(endDate.getDate() + 1);

  const title = `Nettoyage École - ${classe.nom}`;
  
  const description = [
    `Affectation de nettoyage pour ${famille.nom}`,
    `Classe: ${classe.nom}`,
    `Période: du ${startDate.toLocaleDateString('fr-FR')} au ${new Date(semaine.fin).toLocaleDateString('fr-FR')}`,
    classe.instructions_pdf_url ? `Instructions: ${classe.instructions_pdf_url}` : ''
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDateForGoogle(startDate).slice(0, 8)}/${formatDateForGoogle(endDate).slice(0, 8)}`,
    details: description,
    location: classe.nom,
    trp: 'true' // Transparent (ne bloque pas le calendrier)
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Génère un lien Outlook Calendar pour une affectation
 * @param {Object} affectation - Données de l'affectation
 * @param {Object} semaine - Données de la semaine
 * @param {Object} classe - Données de la classe
 * @param {Object} famille - Données de la famille
 * @returns {string} URL Outlook Calendar
 */
export function generateOutlookCalendarLink(affectation, semaine, classe, famille) {
  const startDate = new Date(semaine.debut);
  const endDate = new Date(semaine.fin);
  endDate.setDate(endDate.getDate() + 1);

  const title = `Nettoyage École - ${classe.nom}`;
  
  const description = [
    `Affectation de nettoyage pour ${famille.nom}`,
    `Classe: ${classe.nom}`,
    `Période: du ${startDate.toLocaleDateString('fr-FR')} au ${new Date(semaine.fin).toLocaleDateString('fr-FR')}`,
    classe.instructions_pdf_url ? `Instructions: ${classe.instructions_pdf_url}` : ''
  ].filter(Boolean).join('\n');

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: description,
    location: classe.nom,
    allday: 'true'
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Télécharge un fichier .ics
 * @param {string} icsContent - Contenu du fichier ICS
 * @param {string} filename - Nom du fichier
 */
export function downloadICSFile(icsContent, filename = 'nettoyage-ecole.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Génère un nom de fichier basé sur l'affectation
 * @param {Object} affectation - Données de l'affectation
 * @param {Object} semaine - Données de la semaine
 * @param {Object} classe - Données de la classe
 * @param {Object} famille - Données de la famille
 * @returns {string} Nom de fichier
 */
export function generateFilename(affectation, semaine, classe, famille) {
  const startDate = new Date(semaine.debut);
  const dateStr = startDate.toISOString().split('T')[0];
  const familyName = famille.nom.replace(/[^a-zA-Z0-9]/g, '_');
  const className = classe.id.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `nettoyage_${dateStr}_${familyName}_${className}.ics`;
}
