# Configuration Resend pour Production

## Problème CORS avec Resend

Resend API ne permet pas les requêtes directes depuis le navigateur pour des raisons de sécurité.

## Solutions :

### 1. Proxy Server (Recommandé)
Créer un proxy server qui fait les appels API côté serveur.

### 2. Webhook Resend
Utiliser les webhooks Resend pour déclencher l'envoi d'emails.

### 3. Mode Fallback (Actuel)
Utiliser le mode simulation en production jusqu'à résolution du CORS.

## Configuration Actuelle

Le système utilise actuellement le mode fallback qui :
- ✅ Simule l'inscription newsletter
- ✅ Sauvegarde localement les abonnés
- ✅ Affiche les messages de confirmation
- ❌ N'envoie pas d'emails réels

## Pour Activer les Emails Réels

1. **Configurer un proxy server** (Node.js/Express)
2. **Utiliser les webhooks Resend**
3. **Implémenter un backend complet**

## Code du Proxy Server (Exemple)

```javascript
// proxy-server.js
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend('re_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT');

app.use(cors({
  origin: 'https://liberteiyac.com'
}));

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    
    const result = await resend.emails.send({
      from: 'contact@liberteiyac.com',
      to: [to],
      subject: subject,
      html: html
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on port 3000');
});
```

## Configuration Frontend pour Proxy

```typescript
// Dans newsletter.service.ts
private async sendEmail(emailData: any): Promise<void> {
  try {
    // Utiliser le proxy au lieu de Resend directement
    const response = await this.http.post('https://votre-proxy.com/api/send-email', {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    }).toPromise();
    
    console.log('Email envoyé via proxy:', response);
  } catch (error) {
    console.error('Erreur proxy:', error);
    throw error;
  }
}
```
