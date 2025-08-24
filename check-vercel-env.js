/**
 * Script pour vérifier si toutes les variables d'environnement 
 * requises sont configurées sur Vercel
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const requiredVars = {
  // Base de données (obligatoire)
  'DATABASE_URL': {
    required: true,
    description: 'URL de connexion PostgreSQL',
    example: 'postgresql://user:pass@host:5432/db'
  },
  
  // Sécurité (obligatoire)
  'ADMIN_SALT': {
    required: true,
    description: 'Salt pour le hachage des mots de passe admin',
    example: 'your_random_salt_string'
  },
  
  // Configuration SMS (obligatoire)
  'SMS_ENABLED': {
    required: true,
    description: 'Activation des SMS',
    example: 'true'
  },
  'SMS_PROVIDER': {
    required: true,
    description: 'Fournisseur SMS (twilio ou spryng)',
    example: 'twilio'
  },
  'NODE_ENV': {
    required: true,
    description: 'Environnement d\'exécution',
    example: 'production'
  },
  
  // Twilio (si SMS_PROVIDER=twilio)
  'TWILIO_SID': {
    required: true,
    conditional: 'SMS_PROVIDER=twilio',
    description: 'Account SID Twilio (commence par AC)',
    example: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  },
  'TWILIO_AUTH_TOKEN': {
    required: true,
    conditional: 'SMS_PROVIDER=twilio',
    description: 'Token d\'authentification Twilio',
    example: 'your_auth_token_here'
  },
  'TWILIO_SENDER': {
    required: true,
    conditional: 'SMS_PROVIDER=twilio',
    description: 'Numéro Twilio expéditeur',
    example: '+15551234567'
  },
  
  // Spryng (si SMS_PROVIDER=spryng)
  'SPRYNG_API_KEY': {
    required: false,
    conditional: 'SMS_PROVIDER=spryng',
    description: 'Clé API Spryng',
    example: 'your_spryng_api_key'
  },
  'SMS_SENDER': {
    required: false,
    conditional: 'SMS_PROVIDER=spryng',
    description: 'Nom ou numéro expéditeur Spryng',
    example: 'Planning ou +32123456789'
  },
  
  // Test (optionnel)
  'TEST_PHONE_NUMBER': {
    required: false,
    description: 'Numéro de test pour SMS',
    example: '0032497890341'
  },
  
  // Administration (optionnel)
  'DEFAULT_ADMIN_PASSWORD': {
    required: false,
    description: 'Mot de passe admin par défaut pour nouveaux plannings',
    example: 'admin123'
  }
};

function checkEnvironmentVariables() {
  console.log('🔍 Vérification des variables d\'environnement...\n');
  
  const missing = [];
  const present = [];
  const warnings = [];
  
  const smsProvider = process.env.SMS_PROVIDER || 'twilio';
  
  for (const [varName, config] of Object.entries(requiredVars)) {
    const value = process.env[varName];
    const isPresent = value !== undefined && value !== '';
    
    // Vérifier si la variable est conditionnellement requise
    const isConditionallyRequired = config.conditional && 
      config.conditional.includes(`SMS_PROVIDER=${smsProvider}`);
    
    const isRequired = config.required || isConditionallyRequired;
    
    if (isPresent) {
      present.push({
        name: varName,
        value: varName.includes('TOKEN') || varName.includes('PASSWORD') || varName.includes('SALT') 
          ? '***HIDDEN***' 
          : value,
        required: isRequired
      });
      
      // Validations spécifiques
      if (varName === 'TWILIO_SID' && !value.startsWith('AC')) {
        warnings.push(`⚠️  ${varName}: Devrait commencer par 'AC' (Account SID)`);
      }
      if (varName === 'SMS_ENABLED' && !['true', 'false'].includes(value)) {
        warnings.push(`⚠️  ${varName}: Devrait être 'true' ou 'false'`);
      }
      if (varName === 'SMS_PROVIDER' && !['twilio', 'spryng'].includes(value)) {
        warnings.push(`⚠️  ${varName}: Devrait être 'twilio' ou 'spryng'`);
      }
      
    } else if (isRequired) {
      missing.push({
        name: varName,
        description: config.description,
        example: config.example,
        conditional: config.conditional
      });
    }
  }
  
  // Affichage des résultats
  console.log('✅ Variables présentes:');
  present.forEach(v => {
    const status = v.required ? '(OBLIGATOIRE)' : '(optionnel)';
    console.log(`   ${v.name} = ${v.value} ${status}`);
  });
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Avertissements:');
    warnings.forEach(w => console.log(`   ${w}`));
  }
  
  if (missing.length > 0) {
    console.log('\n❌ Variables manquantes:');
    missing.forEach(v => {
      const conditional = v.conditional ? ` (${v.conditional})` : '';
      console.log(`   ${v.name}${conditional}`);
      console.log(`      Description: ${v.description}`);
      console.log(`      Exemple: ${v.example}`);
      console.log('');
    });
    
    console.log('📝 Pour configurer sur Vercel:');
    console.log('   1. Dashboard Vercel → Settings → Environment Variables');
    console.log('   2. Ou via CLI: vercel env add VARIABLE_NAME');
    console.log('   3. Redéployer: vercel --prod');
    
    process.exit(1);
  } else {
    console.log('\n🎉 Toutes les variables requises sont configurées !');
    console.log(`\n📱 Configuration SMS: ${smsProvider.toUpperCase()}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📧 SMS activés: ${process.env.SMS_ENABLED || 'false'}`);
  }
}

// Exécution si appelé directement
const isMainModule = import.meta.url.endsWith(process.argv[1]) || 
                    import.meta.url === `file://${process.argv[1]}` ||
                    process.argv[1].endsWith('check-vercel-env.js');

if (isMainModule) {
  checkEnvironmentVariables();
}

export { checkEnvironmentVariables, requiredVars };
