# Intégration SMS - Documentation

Cette documentation décrit l'intégration SMS dans l'application Planning, supportant les providers **Twilio**, **Spryng** et **SMSFactor**.

## 🚀 Fonctionnalités

- ✅ **Multi Provider** : Support de Twilio, Spryng et SMSFactor avec switch automatique
- ✅ **Templates SMS** : Messages prédéfinis pour différents scénarios
- ✅ **Envoi ciblé** : Famille individuelle, semaine, ou envoi en masse
- ✅ **Mode Test/Production** : Simulation sécurisée ou envoi réel
- ✅ **Normalisation automatique** : Numéros belges formatés en E.164
- ✅ **Interface Admin** : Gestion complète via l'admin panel
- ✅ **Tests automatisés** : Suite de tests complète

## 📋 Configuration

### Variables d'environnement (.env.local)

```bash
# Configuration SMS générale
SMS_ENABLED=true
SMS_PROVIDER=twilio
# SMS_PROVIDER=spryng
# SMS_PROVIDER=smsfactor

# Configuration Twilio SMS (recommandé)
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here  
TWILIO_SENDER=+15551234567

# Configuration Spryng SMS (alternative)
SPRYNG_API_KEY=your_spryng_api_key_here
SMS_SENDER=your_sender_name_or_number

# Configuration SMSFactor SMS (alternative française)
SMS_FACTOR_API_TOKEN=your_smsfactor_token_here
SMS_SENDER=your_sender_name_or_number

# Numéro de test personnel
TEST_PHONE_NUMBER=0032497890341

# Environnement (development = mode test, production = envoi réel)
NODE_ENV=development
```

### Configuration Twilio

1. **Créer un compte Twilio** : [console.twilio.com](https://console.twilio.com)
2. **Récupérer les credentials** :
   - Account SID (commence par `AC...`)
   - Auth Token 
   - Numéro Twilio (commence par `+`)
3. **Ajouter dans .env.local** :
   ```bash
   TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_SENDER=+15551234567
   ```

### Configuration Spryng

1. **Créer un compte Spryng** : [spryng.be](https://spryng.be)
2. **Récupérer la clé API**
3. **Ajouter dans .env.local** :
   ```bash
   SPRYNG_API_KEY=your_api_key_here
   SMS_SENDER=PlanningApp
   ```

### Configuration SMSFactor

1. **Créer un compte SMSFactor** : [smsfactor.com](https://www.smsfactor.com)
2. **Récupérer le token API** depuis votre tableau de bord
3. **Ajouter dans .env.local** :
   ```bash
   SMS_FACTOR_API_TOKEN=your_token_here
   SMS_SENDER=PlanningApp
   ```

**Notes SMSFactor :**
- Format de numéro : international sans le `+` (ex: `33612345678`)
- Expéditeur : maximum 11 caractères alphanumériques ou numéro de téléphone
- API REST simple avec paramètres GET
- Gestion automatique des crédits et accusés de réception

## 🔧 Installation

Les dépendances SMS sont déjà incluses dans le projet. Aucune installation supplémentaire requise.

## 📱 Utilisation

### Via l'interface Admin

1. **Accéder à l'Admin Panel** avec un compte administrateur
2. **Onglet SMS** : Interface complète de gestion
3. **Trois modes d'envoi** :
   - **Individuel** : Famille spécifique
   - **Semaine** : Toutes les familles d'une semaine
   - **Masse** : Liste personnalisée ou toutes les familles

### Via l'API

#### Test de configuration
```bash
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{"action": "test_config"}'
```

#### Test de connexion
```bash
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connection"}'
```

#### Envoi SMS individuel
```bash
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_planning_token",
    "action": "send_to_famille",
    "data": {
      "famille_id": "123",
      "template_key": "affectation_rappel",
      "template_data": {
        "classe_nom": "Salle A1",
        "date_debut": "2024-01-15",
        "date_fin": "2024-01-21"
      }
    }
  }'
```

## 📝 Templates SMS

### Templates prédéfinis

| Template | Description | Variables |
|----------|-------------|-----------|
| `affectation_rappel` | Rappel d'affectation | `{nom_famille}`, `{classe_nom}`, `{date_debut}`, `{date_fin}`, `{codes_cles}` |
| `affectation_nouvelle` | Nouvelle affectation | `{nom_famille}`, `{classe_nom}`, `{date_debut}`, `{date_fin}`, `{codes_cles}` |
| `semaine_publiee` | Semaine publiée | `{date_debut}`, `{date_fin}`, `{codes_cles}`, `{planning_url}` |
| `rappel_general` | Rappel général | `{planning_name}`, `{codes_cles}` |
| `personnalise` | Message libre | `{message}` |

### Exemple de template

```javascript
{
  "affectation_rappel": {
    "name": "Rappel d'affectation",
    "template": "Bonjour {nom_famille}, vous êtes assigné(e) au nettoyage de {classe_nom} pour la semaine du {date_debut} au {date_fin}. Codes clés: {codes_cles}. Consultez le planning: {planning_url}. Merci ! - {planning_name}"
  }
}
```

### Variables disponibles

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{nom_famille}` | Nom de la famille | "Famille Dupont" |
| `{classe_nom}` | Nom de la classe/zone | "Salle A1" |
| `{date_debut}` | Date de début de la semaine | "01/02/2024" |
| `{date_fin}` | Date de fin de la semaine | "07/02/2024" |
| `{codes_cles}` | Codes clés de la semaine | "Code A1, Code B2, Code C3" |
| `{planning_name}` | Nom du planning | "Planning École 2024" |
| `{planning_url}` | URL du planning | "https://planning.ecole.com?token=abc123" |
| `{message}` | Message personnalisé (template personnalisé uniquement) | Texte libre |

## 🧪 Tests

### Lancer les tests

```bash
# Tests complets
npm test

# Tests SMS uniquement
node tests/sms.test.js

# Tests avec provider spécifique
SMS_PROVIDER=twilio node tests/sms.test.js
```

### Tests personnalisés

```bash
# Test vers votre numéro (mode test)
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{
    "token": "test-token",
    "action": "send_to_famille",
    "data": {
      "famille_id": "test",
      "template_key": "personnalise",
      "message_personnalise": "Test SMS depuis Planning App",
      "overridePhone": "0032497890341"
    }
  }'
```

## 🔀 Switch entre providers

### Changer de provider

1. **Modifier .env.local** :
   ```bash
   SMS_PROVIDER=twilio  # ou spryng
   ```

2. **Redémarrer le serveur** :
   ```bash
   npm run dev:api
   ```

### Comparaison des providers

| Fonctionnalité | Twilio | Spryng | SMSFactor |
|----------------|--------|--------|-----------|
| **Fiabilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Coverage Belgique** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Coverage France** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Pricing** | Moyen | Compétitif | Très compétitif |
| **Documentation** | Excellente | Bonne | Correcte |
| **Features** | Très riche | Standard | Standard |
| **API Simplicité** | Complexe | Moyenne | Simple |

## 🔒 Sécurité

### Mode Test vs Production

- **Development** (`NODE_ENV=development`) : Mode test, aucun SMS réel envoyé
- **Production** (`NODE_ENV=production`) : Envoi réel de SMS

### Validation des numéros

- **Format automatique** : `0032497890341` → `+32497890341`
- **Validation E.164** : Format international standard
- **Filtrage** : Seuls les numéros valides sont traités

### Permissions

- **Admin requis** : Seuls les administrateurs peuvent envoyer des SMS
- **Token validation** : Vérification du planning actif
- **Rate limiting** : Protection contre les abus (à implémenter)

## 🐛 Dépannage

### Erreurs courantes

#### "Provider SMS non supporté"
```bash
# Vérifier la variable SMS_PROVIDER
echo $SMS_PROVIDER
# Doit être 'twilio', 'spryng' ou 'smsfactor'
```

#### "TWILIO_SID manquant"
```bash
# Vérifier les variables Twilio
grep TWILIO .env.local
# Doit contenir TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_SENDER
```

#### "API erreur 404"
- Vérifier que `TWILIO_SID` commence par `AC` (Account SID) et non `SK` (API Key)
- Vérifier que l'Auth Token est correct

#### "SMS_FACTOR_API_TOKEN manquant"
```bash
# Vérifier les variables SMSFactor
grep SMS_FACTOR .env.local
# Doit contenir SMS_FACTOR_API_TOKEN
```

#### "Erreur authentification SMSFactor"
- Vérifier que le token API est valide et actif
- Vérifier que votre compte SMSFactor a des crédits disponibles
- Le token ne doit pas commencer par un espace ou contenir de caractères spéciaux

#### "SMS non reçu"
1. **Vérifier le mode** : `testMode: true` = simulation, `testMode: false` = envoi réel
2. **Vérifier le numéro** : Format `+32497890341` requis
3. **Vérifier les logs** : Messages de debug dans la console serveur

### Logs de debug

```bash
# Activer les logs détaillés
DEBUG=sms* npm run dev:api
```

### Test de connexion

```bash
# Test Twilio
curl -X POST http://localhost:3000/api/sms \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connection"}' | jq .

# Réponse attendue
{
  "success": true,
  "message": "API Twilio connectée - Compte: My first Twilio account (active)"
}
```

## 📊 Monitoring

### Métriques disponibles

- **Taux de succès** : Pourcentage de SMS envoyés avec succès
- **Coût par SMS** : Retourné par l'API provider
- **Temps de réponse** : Latence API
- **Erreurs** : Types et fréquence des erreurs

### Logs structurés

```javascript
// Exemple de log SMS
{
  "timestamp": "2024-01-15T10:30:26.027Z",
  "provider": "twilio",
  "action": "send_sms",
  "to": "+32497890341",
  "from": "+15053880392",
  "messageId": "SM483a5ac9c6d9e0bc9b555275cf8ef09d",
  "status": "queued",
  "testMode": false
}
```

## 🔄 Migration

### De Spryng vers Twilio

1. **Configurer Twilio** dans `.env.local`
2. **Changer le provider** : `SMS_PROVIDER=twilio`
3. **Redémarrer** le serveur
4. **Tester** la configuration

### Vers SMSFactor

1. **Configurer SMSFactor** dans `.env.local`
2. **Changer le provider** : `SMS_PROVIDER=smsfactor`
3. **Redémarrer** le serveur
4. **Tester** la configuration

### Rollback rapide

```bash
# En cas de problème, retour à Spryng
SMS_PROVIDER=spryng npm run dev:api

# Ou vers SMSFactor
SMS_PROVIDER=smsfactor npm run dev:api
```

## 🚀 Déploiement

### Variables de production

```bash
# Production .env
SMS_ENABLED=true
SMS_PROVIDER=twilio  # ou smsfactor
NODE_ENV=production

# Configuration Twilio
TWILIO_SID=ACxxxx...
TWILIO_AUTH_TOKEN=xxxx...
TWILIO_SENDER=+15551234567

# OU Configuration SMSFactor
SMS_FACTOR_API_TOKEN=your_production_token
SMS_SENDER=YourApp
```

### Vérification pré-déploiement

```bash
# Test de configuration
curl -X POST https://yourapp.com/api/sms \
  -H "Content-Type: application/json" \
  -d '{"action": "test_config"}'

# Test de connexion
curl -X POST https://yourapp.com/api/sms \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connection"}'
```

## 📚 Ressources

- **Twilio Documentation** : [twilio.com/docs](https://www.twilio.com/docs)
- **Spryng Documentation** : [spryng.be/api](https://spryng.be/api)
- **SMSFactor Documentation** : [doc.smsfactor.com](https://doc.smsfactor.com)
- **E.164 Format** : [en.wikipedia.org/wiki/E.164](https://en.wikipedia.org/wiki/E.164)

## 🤝 Support

En cas de problème :

1. **Vérifier les logs** serveur
2. **Tester la configuration** via l'API
3. **Consulter cette documentation**
4. **Contacter l'équipe** de développement

---

*Dernière mise à jour : 24 août 2024*