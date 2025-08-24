#!/usr/bin/env node

/**
 * Service SMS avec Spryng REST API
 * Intégration pour contacter les familles du planning nettoyage
 */

import { validateTokenAndGetPlanning } from './db.js';
import { query } from './db.js';

const SPRYNG_BASE_URL = 'https://rest.spryngsms.com/v1';
const TWILIO_BASE_URL = 'https://api.twilio.com/2010-04-01';

/**
 * Configuration SMS depuis les variables d'environnement
 */
const SMS_CONFIG = {
  // Provider selection (twilio or spryng)
  provider: process.env.SMS_PROVIDER || 'spryng',
  enabled: process.env.SMS_ENABLED === 'true',
  testMode: process.env.NODE_ENV !== 'production',
  testPhoneNumber: process.env.TEST_PHONE_NUMBER || '0032497890341',
  
  // Spryng configuration
  spryng: {
    apiKey: process.env.SPRYNG_API_KEY,
    sender: process.env.SMS_SENDER || 'Planning'
  },
  
  // Twilio configuration  
  twilio: {
    accountSid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_SENDER
  }
};

/**
 * Templates de SMS prédéfinis
 */
const SMS_TEMPLATES = {
  affectation_rappel: {
    name: 'Rappel d\'affectation',
    template: 'Bonjour {nom_famille}, vous êtes assigné(e) au nettoyage de {classe_nom} pour la semaine du {date_debut} au {date_fin}. Merci ! - {planning_name}'
  },
  affectation_nouvelle: {
    name: 'Nouvelle affectation',
    template: 'Nouvelle affectation ! {nom_famille}, vous avez été assigné(e) au nettoyage de {classe_nom} pour la semaine du {date_debut} au {date_fin}. - {planning_name}'
  },
  semaine_publiee: {
    name: 'Semaine publiée',
    template: 'Le planning de la semaine du {date_debut} au {date_fin} est disponible. Consultez vos affectations sur {planning_url}. - {planning_name}'
  },
  rappel_general: {
    name: 'Rappel général',
    template: 'Rappel : pensez à effectuer le nettoyage de votre zone cette semaine. Merci pour votre participation ! - {planning_name}'
  },
  personnalise: {
    name: 'Message personnalisé',
    template: '{message}' // Template libre
  }
};

/**
 * Classe pour la gestion des SMS via Spryng
 */
class SpryngSMSService {
  constructor() {
    this.apiKey = SMS_CONFIG.spryng.apiKey;
    this.sender = SMS_CONFIG.spryng.sender;
  }

  /**
   * Valider la configuration SMS
   */
  validateConfig() {
    if (!SMS_CONFIG.enabled) {
      throw new Error('Service SMS désactivé');
    }
    
    if (!this.apiKey) {
      throw new Error('SPRYNG_API_KEY manquante dans la configuration');
    }

    // Valider l'expéditeur : soit un numéro (commence par + ou chiffres), soit un nom alphanumérique (max 11 chars)
    const isPhoneNumber = /^(\+|[0-9])/.test(this.sender);
    if (!isPhoneNumber && this.sender.length > 11) {
      throw new Error('Nom expéditeur alphanumérique doit faire maximum 11 caractères. Utilisez un numéro de téléphone pour un expéditeur plus long.');
    }
  }

  /**
   * Tester la connexion à l'API Spryng (appel GET /balance - read-only)
   */
  async testConnection() {
    try {
      this.validateConfig();

      console.log(`🔍 Test de connexion à l'API Spryng via GET /balance...`);

      // Test sûr: Vérifier le solde (appel read-only, aucun SMS envoyé)
      const balanceResponse = await fetch(`${SPRYNG_BASE_URL}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!balanceResponse.ok) {
        const errorText = await balanceResponse.text();
        throw new Error(`API Spryng erreur ${balanceResponse.status}: ${errorText}`);
      }

      const balanceData = await balanceResponse.json();
      console.log(`💰 Solde Spryng: ${balanceData.amount} ${balanceData.currency}`);
      
      return {
        success: true,
        apiConnected: true,
        balance: balanceData,
        testMode: SMS_CONFIG.testMode,
        message: `API Spryng connectée - Solde: ${balanceData.amount} ${balanceData.currency}`
      };

    } catch (error) {
      console.error(`❌ Erreur connexion API Spryng:`, error.message);
      return {
        success: false,
        apiConnected: false,
        error: error.message,
        testMode: SMS_CONFIG.testMode
      };
    }
  }

  /**
   * Normaliser un numéro de téléphone
   */
  normalizePhoneNumber(phone) {
    if (!phone) return null;
    
    // Supprimer espaces, tirets, parenthèses
    let cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    
    // Gérer les formats français
    if (cleaned.startsWith('0')) {
      cleaned = '+33' + cleaned.substring(1);
    } else if (cleaned.startsWith('33')) {
      cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      // Supposer format français si pas de préfixe international
      cleaned = '+33' + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Envoyer un SMS via l'API Spryng
   */
  async sendSMS(to, message, options = {}) {
    try {
      this.validateConfig();
      
      const normalizedTo = this.normalizePhoneNumber(to);
      if (!normalizedTo) {
        throw new Error('Numéro de téléphone invalide');
      }

      const payload = {
        encoding: 'auto',
        route: 'business', // ou 'economy' pour réduire les coûts
        recipients: [normalizedTo],
        sender: options.sender || this.sender,
        body: message.substring(0, 1600) // Limite Spryng
      };

      console.log(`📱 Envoi SMS${SMS_CONFIG.testMode ? ' (TEST)' : ''}: ${normalizedTo}`);
      console.log(`📄 Contenu: ${message}`);

      if (SMS_CONFIG.testMode) {
        // Mode test : simuler l'envoi
        return {
          success: true,
          messageId: 'test_' + Date.now(),
          cost: 0,
          testMode: true,
          recipient: normalizedTo,
          message: message
        };
      }

      const response = await fetch(`${SPRYNG_BASE_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erreur Spryng (${response.status}): ${errorData.message || 'Erreur inconnue'}`);
      }

      const result = await response.json();
      console.log(`✅ SMS envoyé avec succès: ${result.id}`);

      return {
        success: true,
        messageId: result.id,
        cost: result.cost || 0,
        recipient: normalizedTo,
        message: message
      };

    } catch (error) {
      console.error('❌ Erreur envoi SMS:', error.message);
      throw error;
    }
  }

  /**
   * Générer un message à partir d'un template
   */
  generateMessage(templateKey, data) {
    const template = SMS_TEMPLATES[templateKey];
    if (!template) {
      throw new Error(`Template SMS inconnu: ${templateKey}`);
    }

    let message = template.template;
    
    // Remplacer les variables dans le template
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return message;
  }
}

/**
 * Classe pour la gestion des SMS via Twilio
 */
class TwilioSMSService {
  constructor() {
    this.accountSid = SMS_CONFIG.twilio.accountSid;
    this.authToken = SMS_CONFIG.twilio.authToken;
    this.phoneNumber = SMS_CONFIG.twilio.phoneNumber;
  }

  /**
   * Valider la configuration SMS Twilio
   */
  validateConfig() {
    if (!SMS_CONFIG.enabled) {
      throw new Error('Service SMS désactivé');
    }
    
    if (!this.accountSid) {
      throw new Error('TWILIO_SID manquant dans la configuration');
    }

    if (!this.authToken) {
      throw new Error('TWILIO_AUTH_TOKEN manquant dans la configuration');
    }

    if (!this.phoneNumber) {
      throw new Error('TWILIO_SENDER manquant dans la configuration');
    }
  }

  /**
   * Tester la connexion à l'API Twilio (appel GET /Accounts/{AccountSid} - read-only)
   */
  async testConnection() {
    try {
      this.validateConfig();

      console.log(`🔍 Test de connexion à l'API Twilio via GET /Accounts...`);

      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      
      const response = await fetch(`${TWILIO_BASE_URL}/Accounts/${this.accountSid}.json`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Twilio erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`🏢 Compte Twilio: ${data.friendly_name} (${data.status})`);
      
      return {
        success: true,
        apiConnected: true,
        account: data,
        testMode: SMS_CONFIG.testMode,
        message: `API Twilio connectée - Compte: ${data.friendly_name} (${data.status})`
      };

    } catch (error) {
      console.error(`❌ Erreur connexion API Twilio:`, error.message);
      return {
        success: false,
        apiConnected: false,
        error: error.message,
        message: `Connexion API Twilio échouée: ${error.message}`
      };
    }
  }

  /**
   * Envoyer un SMS via Twilio
   */
  async sendSMS(to, message, templateData = {}) {
    try {
      this.validateConfig();

      // Normaliser le numéro de téléphone
      const phoneNumber = this.normalizePhoneNumber(to);
      
      // Remplacer les variables dans le message
      const finalMessage = this.replaceTemplateVariables(message, templateData);

      if (SMS_CONFIG.testMode) {
        // Mode test : simuler l'envoi sans appel API réel
        console.log(`📱 [MODE TEST] SMS Twilio vers ${phoneNumber}:`);
        console.log(`📝 Message: ${finalMessage}`);
        console.log(`📞 De: ${this.phoneNumber}`);
        
        return {
          success: true,
          testMode: true,
          messageId: `test_twilio_${Date.now()}`,
          to: phoneNumber,
          from: this.phoneNumber,
          message: finalMessage,
          provider: 'twilio'
        };
      }

      // Mode production : envoyer via API Twilio
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
      
      const response = await fetch(`${TWILIO_BASE_URL}/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phoneNumber,
          From: this.phoneNumber,
          Body: finalMessage
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Twilio API erreur ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log(`✅ SMS Twilio envoyé: ${result.sid}`);

      return {
        success: true,
        testMode: false,
        messageId: result.sid,
        to: phoneNumber,
        from: this.phoneNumber,
        message: finalMessage,
        status: result.status,
        provider: 'twilio'
      };

    } catch (error) {
      console.error(`❌ Erreur envoi SMS Twilio:`, error.message);
      throw error;
    }
  }

  /**
   * Normaliser un numéro de téléphone pour Twilio (format E.164)
   */
  normalizePhoneNumber(phone) {
    if (!phone) throw new Error('Numéro de téléphone manquant');
    
    // Retirer tous les espaces et caractères non-numériques sauf +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Si commence par 0032, remplacer par +32
    if (cleaned.startsWith('0032')) {
      cleaned = '+32' + cleaned.substring(4);
    }
    // Si commence par 00, remplacer par +
    else if (cleaned.startsWith('00')) {
      cleaned = '+' + cleaned.substring(2);
    }
    // Si ne commence pas par +, ajouter +32 (Belgique par défaut)
    else if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('0')) {
        cleaned = '+32' + cleaned.substring(1);
      } else {
        cleaned = '+32' + cleaned;
      }
    }
    
    return cleaned;
  }

  /**
   * Remplacer les variables dans un template SMS
   */
  replaceTemplateVariables(message, data) {
    const placeholders = [
      '{nom_famille}', '{classe_nom}', '{date_debut}', '{date_fin}',
      '{planning_name}', '{planning_url}', '{message}'
    ];

    placeholders.forEach(placeholder => {
      const key = placeholder.replace(/{|}/g, '');
      message = message.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return message;
  }

  /**
   * Générer un message à partir d'un template (même interface que Spryng)
   */
  generateMessage(templateKey, data) {
    const template = SMS_TEMPLATES[templateKey];
    if (!template) {
      throw new Error(`Template SMS inconnu: ${templateKey}`);
    }

    let message = template.template;
    
    // Remplacer les variables dans le template
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      message = message.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return message;
  }
}

/**
 * Factory pour créer le service SMS approprié
 */
function createSMSService() {
  const provider = SMS_CONFIG.provider.toLowerCase();
  
  console.log(`📱 Initialisation du service SMS: ${provider}`);
  
  switch (provider) {
    case 'twilio':
      return new TwilioSMSService();
    case 'spryng':
      return new SpryngSMSService();
    default:
      throw new Error(`Provider SMS non supporté: ${provider}. Utilisez 'twilio' ou 'spryng'`);
  }
}

/**
 * Fonctions utilitaires pour récupérer les données
 */
async function getFamilleById(familleId, planningId) {
  const result = await query(
    'SELECT * FROM familles WHERE id = $1 AND planning_id = $2',
    [familleId, planningId]
  );
  return result.rows[0];
}

async function getFamillesWithAffectations(planningId, semaineId) {
  const result = await query(`
    SELECT 
      f.id, f.nom, f.telephone, f.email,
      c.nom as classe_nom, c.couleur as classe_couleur,
      s.debut, s.fin, s.description as semaine_description,
      a.notes as affectation_notes
    FROM familles f
    JOIN affectations a ON f.id = a.famille_id
    JOIN classes c ON a.classe_id = c.id AND a.planning_id = c.planning_id
    JOIN semaines s ON a.semaine_id = s.id AND a.planning_id = s.planning_id
    WHERE f.planning_id = $1 AND s.id = $2 AND f.is_active = true
  `, [planningId, semaineId]);
  
  return result.rows;
}

async function getAllFamillesActive(planningId) {
  const result = await query(
    'SELECT * FROM familles WHERE planning_id = $1 AND is_active = true ORDER BY nom',
    [planningId]
  );
  return result.rows;
}

/**
 * Handlers pour les endpoints SMS
 */
async function handlePost(req, res) {
  try {
    const { token, action, data } = req.body;
    
    // Actions qui ne nécessitent pas de token
    const publicActions = ['get_templates', 'test_config', 'test_connection'];
    
    // Permettre les tests avec overridePhone sans token valide
    const isTestAction = action === 'send_to_famille' && data?.overridePhone;
    
    if (!publicActions.includes(action) && !isTestAction && !token) {
      return res.status(400).json({ error: 'Token requis' });
    }

    // Pour les actions qui nécessitent un planning, valider le token
    let planning = null;
    if (!publicActions.includes(action) && !isTestAction) {
      planning = await validateTokenAndGetPlanning(token);
    } else if (isTestAction) {
      // Planning factice pour les tests
      planning = { 
        id: 'test', 
        name: 'Planning Test', 
        token: 'test-token' 
      };
    }

    const smsService = createSMSService();

    switch (action) {
      case 'send_to_famille':
        return await sendToFamille(res, smsService, planning, data);
        
      case 'send_to_affectations':
        return await sendToAffectations(res, smsService, planning, data);
        
      case 'send_bulk':
        return await sendBulk(res, smsService, planning, data);
        
      case 'test_config':
        return await testConfig(res, smsService);

      case 'test_connection':
        return await testConnection(res, smsService);
        
      case 'get_templates':
        return res.json({ templates: SMS_TEMPLATES });
        
      default:
        return res.status(400).json({ error: 'Action inconnue' });
    }

  } catch (error) {
    console.error('Erreur POST SMS:', error);
    if (error.message.includes('Token')) {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('SMS désactivé') || error.message.includes('API_KEY')) {
      res.status(503).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erreur serveur SMS' });
    }
  }
}

/**
 * Envoyer SMS à une famille spécifique
 */
async function sendToFamille(res, smsService, planning, data) {
  const { famille_id, template_key, template_data = {}, message_personnalise, overridePhone } = data;
  
  // Pour les tests, permettre d'utiliser un numéro personnalisé
  let famille = null;
  let telephone = overridePhone;
  let nom_famille = 'Test';
  
  if (!overridePhone) {
    // Mode normal : récupérer la famille
    if (!famille_id) {
      return res.status(400).json({ error: 'famille_id requis' });
    }

    famille = await getFamilleById(famille_id, planning.id);
    if (!famille) {
      return res.status(404).json({ error: 'Famille non trouvée' });
    }

    if (!famille.telephone) {
      return res.status(400).json({ error: 'Numéro de téléphone manquant pour cette famille' });
    }
    
    telephone = famille.telephone;
    nom_famille = famille.nom;
  }

  let message;
  if (message_personnalise) {
    message = message_personnalise;
  } else {
    const templateData = {
      nom_famille: nom_famille,
      planning_name: planning?.name || 'Planning Test',
      ...template_data
    };
    message = smsService.generateMessage(template_key, templateData);
  }

  const result = await smsService.sendSMS(telephone, message);
  
  res.json({
    success: true,
    sent: 1,
    results: [result],
    famille: famille ? {
      id: famille.id,
      nom: famille.nom,
      telephone: famille.telephone
    } : {
      id: 'test',
      nom: nom_famille,
      telephone: telephone
    }
  });
}

/**
 * Envoyer SMS aux familles avec affectations pour une semaine
 */
async function sendToAffectations(res, smsService, planning, data) {
  const { semaine_id, template_key, template_data = {} } = data;
  
  if (!semaine_id) {
    return res.status(400).json({ error: 'semaine_id requis' });
  }

  const familles = await getFamillesWithAffectations(planning.id, semaine_id);
  
  if (familles.length === 0) {
    return res.status(404).json({ error: 'Aucune affectation trouvée pour cette semaine' });
  }

  const results = [];
  let sent = 0;
  let errors = 0;

  for (const famille of familles) {
    try {
      if (!famille.telephone) {
        results.push({
          famille_id: famille.id,
          famille_nom: famille.nom,
          success: false,
          error: 'Numéro de téléphone manquant'
        });
        errors++;
        continue;
      }

      const templateData = {
        nom_famille: famille.nom,
        classe_nom: famille.classe_nom,
        date_debut: new Date(famille.debut).toLocaleDateString('fr-FR'),
        date_fin: new Date(famille.fin).toLocaleDateString('fr-FR'),
        planning_name: planning.name,
        ...template_data
      };

      const message = smsService.generateMessage(template_key, templateData);
      const smsResult = await smsService.sendSMS(famille.telephone, message);
      
      results.push({
        famille_id: famille.id,
        famille_nom: famille.nom,
        telephone: famille.telephone,
        classe_nom: famille.classe_nom,
        success: true,
        messageId: smsResult.messageId,
        cost: smsResult.cost
      });
      sent++;

    } catch (error) {
      results.push({
        famille_id: famille.id,
        famille_nom: famille.nom,
        success: false,
        error: error.message
      });
      errors++;
    }
  }

  res.json({
    success: true,
    sent,
    errors,
    total: familles.length,
    results
  });
}

/**
 * Envoi en masse à toutes les familles actives
 */
async function sendBulk(res, smsService, planning, data) {
  const { template_key, template_data = {}, message_personnalise, famille_ids } = data;

  let familles;
  if (famille_ids && famille_ids.length > 0) {
    // Envoi à des familles spécifiques
    const placeholders = famille_ids.map((_, i) => `$${i + 2}`).join(',');
    const result = await query(
      `SELECT * FROM familles WHERE planning_id = $1 AND id IN (${placeholders}) AND is_active = true`,
      [planning.id, ...famille_ids]
    );
    familles = result.rows;
  } else {
    // Envoi à toutes les familles actives
    familles = await getAllFamillesActive(planning.id);
  }

  if (familles.length === 0) {
    return res.status(404).json({ error: 'Aucune famille trouvée' });
  }

  const results = [];
  let sent = 0;
  let errors = 0;

  for (const famille of familles) {
    try {
      if (!famille.telephone) {
        results.push({
          famille_id: famille.id,
          famille_nom: famille.nom,
          success: false,
          error: 'Numéro de téléphone manquant'
        });
        errors++;
        continue;
      }

      let message;
      if (message_personnalise) {
        message = message_personnalise.replace('{nom_famille}', famille.nom).replace('{planning_name}', planning.name);
      } else {
        const templateData = {
          nom_famille: famille.nom,
          planning_name: planning.name,
          ...template_data
        };
        message = smsService.generateMessage(template_key, templateData);
      }

      const smsResult = await smsService.sendSMS(famille.telephone, message);
      
      results.push({
        famille_id: famille.id,
        famille_nom: famille.nom,
        telephone: famille.telephone,
        success: true,
        messageId: smsResult.messageId,
        cost: smsResult.cost
      });
      sent++;

    } catch (error) {
      results.push({
        famille_id: famille.id,
        famille_nom: famille.nom,
        success: false,
        error: error.message
      });
      errors++;
    }
  }

  res.json({
    success: true,
    sent,
    errors,
    total: familles.length,
    results
  });
}

/**
 * Tester la configuration SMS
 */
async function testConfig(res, smsService) {
  try {
    smsService.validateConfig();
    
    res.json({
      success: true,
      provider: SMS_CONFIG.provider,
      config: {
        enabled: SMS_CONFIG.enabled,
        testMode: SMS_CONFIG.testMode,
        sender: smsService.sender || smsService.phoneNumber,
        apiConfigured: !!(smsService.apiKey || smsService.accountSid)
      },
      message: 'Configuration SMS valide'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: error.message,
      config: {
        enabled: SMS_CONFIG.enabled,
        testMode: SMS_CONFIG.testMode,
        apiConfigured: !!(smsService.apiKey || smsService.accountSid)
      }
    });
  }
}

/**
 * Tester la connexion à l'API Spryng (appels read-only)
 */
async function testConnection(res, smsService) {
  try {
    const result = await smsService.testConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Connexion API Spryng validée',
        data: result
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Échec connexion API Spryng',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Erreur test connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test de connexion',
      error: error.message
    });
  }
}
/**
 * Point d'entrée principal
 */
export default async function handler(req, res) {
  console.log('📱 SMS endpoint appelé');
  
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Session');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  return handlePost(req, res);
}

