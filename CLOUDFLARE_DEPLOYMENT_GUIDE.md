# 🚀 Déploiement Cloudflare Workers - Newsletter

## 📋 Prérequis

1. **Compte Cloudflare** avec Workers activé
2. **Domaine** `liberteiyac.com` configuré sur Cloudflare
3. **Wrangler CLI** installé : `npm install -g wrangler`

## 🔧 Configuration

### **1. Installation Wrangler**

```bash
npm install -g wrangler
wrangler login
```

### **2. Configuration du Projet**

```bash
# Créer le dossier du worker
mkdir liberteiyac-newsletter-worker
cd liberteiyac-newsletter-worker

# Copier les fichiers
cp ../cloudflare-worker-subscribe.js subscribe.js
cp ../wrangler.toml .

# Initialiser le projet
wrangler init
```

### **3. Configuration des Secrets**

```bash
# Ajouter la clé API Resend comme secret
wrangler secret put RESEND_API_KEY
# Entrez : re_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT
```

### **4. Configuration du Domaine**

Dans le dashboard Cloudflare :
1. Allez dans **Workers & Pages**
2. Sélectionnez votre worker
3. Allez dans **Settings** → **Triggers**
4. Ajoutez une route : `api.liberteiyac.com/subscribe`

## 🚀 Déploiement

### **Déploiement Initial**

```bash
# Déployer le worker
wrangler deploy

# Vérifier le déploiement
curl https://api.liberteiyac.com/subscribe
```

### **Mise à Jour**

```bash
# Modifier le code si nécessaire
# Puis redéployer
wrangler deploy
```

## 🧪 Test

### **Test de l'API**

```bash
# Test avec curl
curl -X POST https://api.liberteiyac.com/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "preferences": {
      "articles": true,
      "videos": true,
      "podcasts": false
    }
  }'
```

### **Test depuis le Frontend**

```javascript
// Test dans la console du navigateur
fetch('https://api.liberteiyac.com/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@liberteiyac.com',
    name: 'Test User',
    preferences: {
      articles: true,
      videos: true,
      podcasts: true
    }
  })
})
.then(response => response.json())
.then(data => console.log('Réponse:', data));
```

## 📊 Monitoring

### **Logs Cloudflare**

```bash
# Voir les logs en temps réel
wrangler tail

# Voir les logs d'une requête spécifique
wrangler tail --format=pretty
```

### **Analytics**

Dans le dashboard Cloudflare :
- **Workers & Pages** → Votre worker → **Analytics**
- Métriques : requêtes, erreurs, latence

## 🔒 Sécurité

### **CORS Configuré**

Le worker accepte les requêtes depuis :
- `https://liberteiyac.com`
- `https://www.liberteiyac.com`
- `https://sidi30.github.io`

### **Validation**

- ✅ Validation email côté serveur
- ✅ Limitation de taille des données
- ✅ Headers de sécurité
- ✅ Logs de sécurité

### **Rate Limiting (Optionnel)**

Ajoutez dans le worker :

```javascript
// Rate limiting simple
const RATE_LIMIT_KEY = `rate_limit:${email}`;
const rateLimitData = await env.RATE_LIMIT_STORE.get(RATE_LIMIT_KEY);

if (rateLimitData) {
  const { count, timestamp } = JSON.parse(rateLimitData);
  if (count >= 5 && Date.now() - timestamp < 3600000) { // 1 heure
    return json({ ok: false, error: 'rate_limit' }, 429, request);
  }
}
```

## 🎯 Avantages de cette Solution

### **✅ Sécurité**
- Pas de clés API exposées côté frontend
- Validation côté serveur
- CORS configuré correctement

### **✅ Performance**
- Edge computing (Cloudflare)
- Latence minimale
- Scalabilité automatique

### **✅ Coût**
- Cloudflare Workers : gratuit jusqu'à 100k requêtes/jour
- Resend : gratuit jusqu'à 3k emails/mois

### **✅ Maintenance**
- Code centralisé
- Logs centralisés
- Déploiement simple

## 🔄 Workflow Complet

1. **Frontend** → `https://api.liberteiyac.com/subscribe`
2. **Cloudflare Worker** → Validation + Google Apps Script
3. **Google Apps Script** → Sauvegarde dans Google Sheets
4. **Cloudflare Worker** → Envoi email via Resend
5. **Frontend** ← Confirmation de succès

## 🆘 Dépannage

### **Erreur CORS**
- Vérifier la configuration CORS dans le worker
- Vérifier l'origine dans les headers

### **Erreur Google Apps Script**
- Vérifier l'URL du script
- Vérifier les permissions du script

### **Erreur Resend**
- Vérifier la clé API dans les secrets
- Vérifier le domaine vérifié dans Resend

---

**🎉 Votre newsletter est maintenant sécurisée et performante !**
