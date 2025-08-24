# Alternatives au GitHub Actions pour SMS Cron

## 🎯 Problème
GitHub Actions peut ne pas fonctionner sur certains comptes gratuits.

## 🆓 Solution 1: cron-job.org (Recommandée)

### Configuration :
1. Aller sur https://cron-job.org
2. Créer un compte gratuit
3. Créer un nouveau cron job :
   - **URL** : `https://planning-lac.vercel.app/api/sms-cron`
   - **Méthode** : POST
   - **Fréquence** : `*/5 * * * *` (toutes les 5 minutes)
   - **Timezone** : Europe/Brussels

### Avantages :
- ✅ 100% gratuit
- ✅ Interface simple
- ✅ Fiable
- ✅ Logs détaillés

## 🆓 Solution 2: UptimeRobot

### Configuration :
1. Aller sur https://uptimerobot.com
2. Créer un compte gratuit
3. Créer un monitor HTTP(s) :
   - **URL** : `https://planning-lac.vercel.app/api/sms-cron`
   - **Type** : HTTP(s)
   - **Intervalle** : 5 minutes (minimum gratuit)

### Avantages :
- ✅ Gratuit (50 monitors)
- ✅ Notifications email en cas d'erreur
- ✅ Statistiques de disponibilité

## 🆓 Solution 3: Pipedream

### Configuration :
1. Aller sur https://pipedream.com
2. Créer un workflow avec trigger cron
3. Ajouter une step HTTP request vers votre endpoint

### Avantages :
- ✅ Quotas généreux
- ✅ Interface no-code
- ✅ Logs détaillés

## 🧪 Test rapide

Pour tester n'importe quelle solution :

```bash
# Test manuel de l'endpoint
curl -X POST https://planning-lac.vercel.app/api/sms-cron

# Réponse attendue :
{"success":true,"message":"Aucun SMS à exécuter"}
```

## 📱 Workflow SMS complet

1. **Créer un SMS planifié** dans l'admin :
   - Nom : "Code boîte à clés"
   - Message : "Bonjour {nom_famille}, le code pour ce weekend est : 1234"
   - Jour : Mardi
   - Heure : 10h00
   - Cible : Familles de la semaine courante

2. **Le service externe** appelle `/api/sms-cron` toutes les 5 minutes

3. **Le mardi à 10h00**, le système :
   - Détecte le SMS planifié actif
   - Récupère les familles avec affectations cette semaine
   - Envoie le SMS à chaque famille
   - Log les résultats

## ⚠️ Points importants

- Le système a une **tolérance de 5 minutes** (10h00 à 10h05)
- **Protection contre les doublons** intégrée
- **Logs détaillés** pour debug
- **Mode test/production** selon `NODE_ENV`

## 🔧 Debug

Si les SMS ne s'envoient pas :

1. Vérifier l'endpoint : `curl -X POST https://planning-lac.vercel.app/api/sms-cron`
2. Vérifier les logs Vercel : Dashboard → Functions → api/sms-cron.js
3. Vérifier qu'un SMS planifié existe et est actif
4. Vérifier que des familles ont des affectations cette semaine
