/**
 * Simple test des variables d'environnement
 */

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Test des variables
  const envVars = {
    SMS_ENABLED: process.env.SMS_ENABLED,
    SMS_PROVIDER: process.env.SMS_PROVIDER,
    NODE_ENV: process.env.NODE_ENV,
    TWILIO_SID: process.env.TWILIO_SID ? 'SET' : 'NOT_SET',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'SET' : 'NOT_SET',
    TWILIO_SENDER: process.env.TWILIO_SENDER,
    ADMIN_SALT: process.env.ADMIN_SALT ? 'SET' : 'NOT_SET'
  };

  const evaluation = {
    smsEnabled: process.env.SMS_ENABLED === 'true',
    smsEnabledRaw: process.env.SMS_ENABLED,
    isProduction: process.env.NODE_ENV === 'production',
    hasAllTwilioVars: !!(process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SENDER)
  };

  res.json({
    success: true,
    envVars,
    evaluation,
    timestamp: new Date().toISOString()
  });
}
