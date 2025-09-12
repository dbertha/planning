#!/usr/bin/env node

/**
 * Endpoint CRON pour exécuter les SMS planifiés
 * À appeler toutes les minutes via un cron job ou service externe
 */

import { getScheduledSMSToExecute, updateScheduledSMSLastExecuted } from './db.js';

// Configuration (avec trim pour éviter les \n)
const SMS_CONFIG = {
  provider: (process.env.SMS_PROVIDER || 'twilio').trim(),
  enabled: (process.env.SMS_ENABLED || 'false').trim() === 'true',
  testMode: (process.env.NODE_ENV || 'development').trim() !== 'production'
};

console.log('🔧 Configuration SMS CRON:', {
  SMS_ENABLED: process.env.SMS_ENABLED,
  enabled: SMS_CONFIG.enabled,
  provider: SMS_CONFIG.provider,
  testMode: SMS_CONFIG.testMode
});

/**
 * Créer le service SMS approprié
 */
function createSMSServiceForCron() {
  const provider = SMS_CONFIG.provider.toLowerCase();
  
  console.log(`📱 Initialisation du service SMS pour CRON: ${provider}`);
  
  // Import des classes SMS nécessaires (simplifié pour le cron)
  if (provider === 'twilio') {
    return {
      sendSMS: async (to, message, templateData = {}) => {
        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const phoneNumber = process.env.TWILIO_SENDER;
        
        if (!accountSid || !authToken || !phoneNumber) {
          throw new Error('Configuration Twilio incomplète');
        }

        // Normaliser le numéro
        const normalizedTo = normalizePhoneNumber(to);
        
        if (SMS_CONFIG.testMode) {
          console.log(`📱 [MODE TEST] SMS Twilio vers ${normalizedTo}: ${message}`);
          return {
            success: true,
            testMode: true,
            messageId: `test_cron_${Date.now()}`,
            to: normalizedTo,
            from: phoneNumber,
            message: message,
            provider: 'twilio'
          };
        }

        // Envoi réel via Twilio
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: normalizedTo,
            From: phoneNumber,
            Body: message
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Twilio API erreur ${response.status}: ${errorData}`);
        }

        const result = await response.json();
        return {
          success: true,
          testMode: false,
          messageId: result.sid,
          to: normalizedTo,
          from: phoneNumber,
          message: message,
          status: result.status,
          provider: 'twilio'
        };
      }
    };
  } else if (provider === 'smsfactor') {
    return {
      sendSMS: async (to, message, templateData = {}) => {
        const apiToken = process.env.SMS_FACTOR_API_TOKEN;
        const sender = process.env.SMS_SENDER || 'Planning';
        
        if (!apiToken) {
          throw new Error('Configuration SMSFactor incomplète');
        }

        // Normaliser le numéro pour SMSFactor (format international sans +)
        const normalizedTo = normalizeSMSFactorPhoneNumber(to);
        
        if (SMS_CONFIG.testMode) {
          console.log(`📱 [MODE TEST] SMS SMSFactor vers ${normalizedTo}: ${message}`);
          return {
            success: true,
            testMode: true,
            messageId: `test_smsfactor_cron_${Date.now()}`,
            to: normalizedTo,
            message: message,
            provider: 'smsfactor'
          };
        }

        // Envoi réel via SMSFactor
        const params = new URLSearchParams({
          text: message.substring(0, 1600),
          to: normalizedTo,
          token: apiToken,
          pushtype: 'alert',
          sender: sender
        });

        const response = await fetch(`https://api.smsfactor.com/send?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`SMSFactor API erreur ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.status < 0) {
          throw new Error(`SMSFactor erreur (${result.status}): ${result.message}`);
        }

        return {
          success: true,
          testMode: false,
          messageId: result.ticket,
          to: normalizedTo,
          message: message,
          cost: result.cost,
          credits: result.credits,
          provider: 'smsfactor'
        };
      }
    };
  } else {
    throw new Error(`Provider SMS non supporté pour CRON: ${provider}. Utilisez 'twilio' ou 'smsfactor'`);
  }
}

/**
 * Normaliser un numéro de téléphone (pour Twilio - format E.164)
 */
function normalizePhoneNumber(phone) {
  if (!phone) throw new Error('Numéro de téléphone manquant');
  
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('0032')) {
    cleaned = '+32' + cleaned.substring(4);
  } else if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  } else if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('0')) {
      cleaned = '+32' + cleaned.substring(1);
    } else {
      cleaned = '+32' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Normaliser un numéro de téléphone pour SMSFactor (format international sans +)
 */
function normalizeSMSFactorPhoneNumber(phone) {
  if (!phone) throw new Error('Numéro de téléphone manquant');
  
  // Retirer tous les espaces et caractères non-numériques sauf +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si commence par 0032, remplacer par 32
  if (cleaned.startsWith('0032')) {
    cleaned = '32' + cleaned.substring(4);
  }
  // Si commence par +, le retirer
  else if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // Si commence par 00, remplacer par rien
  else if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // Si ne commence pas par un indicatif international, ajouter 32 (Belgique par défaut)
  else if (!cleaned.startsWith('32') && !cleaned.startsWith('33') && !cleaned.startsWith('1')) {
    if (cleaned.startsWith('0')) {
      cleaned = '32' + cleaned.substring(1);
    } else {
      cleaned = '32' + cleaned;
    }
  }
  
  return cleaned;
}

/**
 * Obtenir les familles avec nettoyage pour la semaine courante
 */
async function getFamiliesWithCurrentWeekCleaning(planningToken) {
  try {
    // Calculer la semaine courante (lundi à dimanche)
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - now.getDay() + 1);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const mondayStr = monday.toISOString().split('T')[0];
    const sundayStr = sunday.toISOString().split('T')[0];
    
    console.log(`🗓️ Recherche affectations semaine courante: ${mondayStr} → ${sundayStr}`);
    
    // Importer query depuis db.js
    const { query } = await import('./db.js');
    
    const result = await query(`
      SELECT DISTINCT
        f.id, f.nom, f.telephone,
        c.nom as classe_nom,
        s.debut, s.fin, s.description as semaine_description, s.code_cles
      FROM familles f
      JOIN affectations a ON f.id = a.famille_id
      JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
      JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
      JOIN plannings p ON f.planning_id = p.id
      WHERE p.token = $1 
        AND f.is_active = true
        AND s.debut >= $2 
        AND s.fin <= $3
        AND s.is_published = true
    `, [planningToken, mondayStr, sundayStr]);
    
    return result.rows;
  } catch (error) {
    console.error('❌ Erreur récupération familles semaine courante:', error);
    return [];
  }
}

/**
 * Obtenir toutes les familles actives d'un planning
 */
async function getAllActiveFamilies(planningToken) {
  try {
    const { query } = await import('./db.js');
    
    const result = await query(`
      SELECT f.id, f.nom, f.telephone, f.email
      FROM familles f
      JOIN plannings p ON f.planning_id = p.id
      WHERE p.token = $1 AND f.is_active = true
      ORDER BY f.nom
    `, [planningToken]);
    
    return result.rows;
  } catch (error) {
    console.error('❌ Erreur récupération familles actives:', error);
    return [];
  }
}

/**
 * Remplacer les variables dans un message
 */
function replaceMessageVariables(message, data) {
  const placeholders = [
    '{nom_famille}', '{classe_nom}', '{date_debut}', '{date_fin}',
    '{planning_name}', '{planning_url}', '{message}', '{codes_cles}'
  ];

  placeholders.forEach(placeholder => {
    const key = placeholder.replace(/{|}/g, '');
    message = message.replace(new RegExp(placeholder, 'g'), data[key] || '');
  });

  return message;
}

/**
 * Exécuter un SMS planifié
 */
async function executeScheduledSMS(scheduledSMS) {
  try {
    console.log(`🚀 Exécution SMS planifié: "${scheduledSMS.name}" pour planning "${scheduledSMS.planning_name}"`);
    
    const smsService = createSMSServiceForCron();
    
    // Obtenir les destinataires selon le type
    let recipients = [];
    
    if (scheduledSMS.target_type === 'current_week') {
      recipients = await getFamiliesWithCurrentWeekCleaning(scheduledSMS.planning_token);
    } else if (scheduledSMS.target_type === 'all_active') {
      recipients = await getAllActiveFamilies(scheduledSMS.planning_token);
    }
    
    if (recipients.length === 0) {
      console.log(`⚠️ Aucun destinataire trouvé pour "${scheduledSMS.name}"`);
      return { success: true, sent: 0, message: 'Aucun destinataire' };
    }
    
    console.log(`👥 ${recipients.length} destinataire(s) trouvé(s)`);
    
    let sent = 0;
    let errors = 0;
    const results = [];
    
    // Envoyer à chaque destinataire
    for (const recipient of recipients) {
      try {
        if (!recipient.telephone) {
          console.log(`⚠️ Pas de téléphone pour ${recipient.nom}`);
          errors++;
          continue;
        }
        
        // Préparer les données du message
        const messageData = {
          nom_famille: recipient.nom,
          classe_nom: recipient.classe_nom || '',
          date_debut: recipient.debut ? new Date(recipient.debut).toLocaleDateString('fr-FR') : '',
          date_fin: recipient.fin ? new Date(recipient.fin).toLocaleDateString('fr-FR') : '',
          planning_name: scheduledSMS.planning_name,
          codes_cles: recipient.code_cles || ''
        };
        
        // Remplacer les variables dans le message
        const finalMessage = replaceMessageVariables(scheduledSMS.message_template, messageData);
        
        // Envoyer le SMS
        const result = await smsService.sendSMS(recipient.telephone, finalMessage);
        
        if (result.success) {
          console.log(`✅ SMS envoyé à ${recipient.nom} (${recipient.telephone})`);
          sent++;
        } else {
          console.log(`❌ Échec envoi à ${recipient.nom}: ${result.error}`);
          errors++;
        }
        
        results.push({
          famille: recipient.nom,
          telephone: recipient.telephone,
          success: result.success,
          messageId: result.messageId
        });
        
        // Pause entre les envois pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Erreur envoi à ${recipient.nom}: ${error.message}`);
        errors++;
      }
    }
    
    console.log(`📊 SMS planifié "${scheduledSMS.name}" terminé: ${sent} envoyés, ${errors} erreurs`);
    
    // Mettre à jour last_executed_date si au moins un SMS a été envoyé
    if (sent > 0) {
      try {
        await updateScheduledSMSLastExecuted(scheduledSMS.id);
        console.log(`✅ last_executed_date mis à jour pour "${scheduledSMS.name}"`);
      } catch (error) {
        console.error(`❌ Erreur mise à jour last_executed_date pour "${scheduledSMS.name}":`, error.message);
      }
    }
    
    return {
      success: true,
      sent,
      errors,
      total: recipients.length,
      results
    };
    
  } catch (error) {
    console.error(`❌ Erreur exécution SMS planifié "${scheduledSMS.name}":`, error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Fonction principale d'exécution des SMS planifiés
 */
async function executeCronSMS() {
  console.log('🕐 === Début exécution CRON SMS ===');
  
  if (!SMS_CONFIG.enabled) {
    console.log('📱 Service SMS désactivé, arrêt du CRON');
    return { success: true, message: 'SMS désactivé' };
  }
  
  try {
    // Obtenir les SMS à exécuter maintenant
    const scheduledSMSList = await getScheduledSMSToExecute();
    
    if (scheduledSMSList.length === 0) {
      console.log('📭 Aucun SMS planifié à exécuter maintenant');
      return { success: true, message: 'Aucun SMS à exécuter' };
    }
    
    console.log(`📱 ${scheduledSMSList.length} SMS planifié(s) à exécuter`);
    
    const results = [];
    
    // Exécuter chaque SMS planifié
    for (const scheduledSMS of scheduledSMSList) {
      const result = await executeScheduledSMS(scheduledSMS);
      results.push({
        sms_name: scheduledSMS.name,
        planning: scheduledSMS.planning_name,
        ...result
      });
    }
    
    console.log('🎉 === Fin exécution CRON SMS ===');
    
    return {
      success: true,
      executed: scheduledSMSList.length,
      results
    };
    
  } catch (error) {
    console.error('❌ Erreur CRON SMS:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handler pour l'endpoint API
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const result = await executeCronSMS();
    res.json(result);
  } catch (error) {
    console.error('❌ Erreur endpoint CRON:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Si le script est exécuté directement (pas via API)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Exécution directe du CRON SMS...');
  executeCronSMS().then(result => {
    console.log('📋 Résultat:', JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur CRON SMS:', error);
    process.exit(1);
  });
}
