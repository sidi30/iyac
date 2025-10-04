# 📧 Configuration Newsletter Google Sheets + Resend

## 🎯 Vue d'Ensemble

Cette implémentation utilise **Google Sheets** pour le stockage permanent des emails et **Resend** pour l'envoi d'emails gratuit (3000/mois).

## 🚀 Configuration Google Sheets

### **Étape 1: Créer une Feuille Google Sheets**

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez une nouvelle feuille "Newsletter Abonnés"
3. Ajoutez les colonnes suivantes :
   - **A**: Email
   - **B**: Nom
   - **C**: Date d'abonnement
   - **D**: Préférences (JSON)
   - **E**: Source

### **Étape 2: Créer un Script Google Apps**

1. Dans votre feuille, allez dans **Extensions > Apps Script**
2. Remplacez le code par :

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Ajouter une nouvelle ligne
    sheet.appendRow([
      data.email,
      data.name || '',
      data.subscribedAt,
      data.preferences || '{"articles":true,"videos":true,"podcasts":true}',
      data.source || 'website'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Ignorer la première ligne (en-têtes)
    const subscribers = data.slice(1).map(row => ({
      email: row[0],
      name: row[1],
      subscribedAt: row[2],
      preferences: row[3]
    }));
    
    return ContentService
      .createTextOutput(JSON.stringify({subscribers: subscribers}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### **Étape 3: Déployer le Script**

1. Cliquez sur **Déployer > Nouveau déploiement**
2. Choisissez **Type**: Application web
3. **Exécuter en tant que**: Moi
4. **Qui a accès**: Tous les utilisateurs
5. Cliquez sur **Déployer**
6. **Copiez l'URL** du déploiement

## 📧 Configuration Resend

### **Étape 1: Créer un Compte Resend**

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Vérifiez votre email

### **Étape 2: Obtenir la Clé API**

1. Dans le dashboard Resend
2. Allez dans **API Keys**
3. Cliquez sur **Create API Key**
4. **Copiez la clé** (commence par `re_`)

### **Étape 3: Configurer le Domaine (Optionnel)**

Pour utiliser votre propre domaine :
1. Allez dans **Domains**
2. Ajoutez votre domaine
3. Configurez les enregistrements DNS
4. Utilisez `noreply@votre-domaine.com`

## ⚙️ Configuration du Code

### **1. Mettre à Jour Google Sheets Service**

Dans `src/app/services/google-sheets.service.ts`, remplacez :

```typescript
private readonly GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

Par votre URL de déploiement Google Apps Script.

### **2. Mettre à Jour Newsletter Service**

Dans `src/app/services/newsletter.service.ts`, remplacez :

```typescript
private readonly RESEND_API_KEY = 'YOUR_RESEND_API_KEY';
private readonly FROM_EMAIL = 'noreply@liberteiyac.com';
```

Par vos vraies valeurs.

## 🔧 Utilisation

### **Abonnement Automatique**

```typescript
// Dans votre composant
async subscribe(email: string, name?: string) {
  await this.newsletterService.subscribe(email, name);
  // L'email est automatiquement sauvegardé dans Google Sheets
  // Et un email de bienvenue est envoyé via Resend
}
```

### **Notifications Automatiques**

```typescript
// Quand vous ajoutez un nouvel article
async addArticle(article: Article) {
  // ... logique d'ajout ...
  
  // Notification automatique
  await this.contentNotification.notifyNewArticle(article);
}
```

### **Synchronisation**

```typescript
// Synchroniser avec Google Sheets
await this.newsletterService.syncWithGoogleSheets();
```

## 📊 Avantages de cette Solution

### **✅ Stockage Permanent**
- Emails dans Google Sheets
- Accessible depuis partout
- Pas de perte de données
- Export facile en CSV/Excel

### **✅ Envoi Gratuit**
- Resend : 3000 emails/mois
- Pas de limite de destinataires
- Templates HTML personnalisés
- Analytics inclus

### **✅ Maintenance Facile**
- Interface Google Sheets familière
- Pas de serveur à gérer
- Sauvegarde automatique
- Collaboration possible

## 🎨 Templates Email

### **Email de Bienvenue**
- Design professionnel avec logo
- Message personnalisé avec le nom
- Liste des types de contenu
- Citation d'Ibrahim Yacouba
- Bouton "Visiter le Site"

### **Email de Notification**
- Titre du contenu en évidence
- Description complète
- Bouton "Lire" avec lien direct
- Date de publication
- Lien de désabonnement

## 🔒 Sécurité

### **Google Sheets**
- Accès contrôlé par Google
- Sauvegarde automatique
- Historique des modifications
- Partage sécurisé

### **Resend**
- API sécurisée avec clés
- Domaine vérifié
- Protection anti-spam
- Conformité RGPD

## 📈 Limites et Coûts

### **Google Sheets**
- **Gratuit** : 10 millions de cellules
- **Limite** : 5 millions de cellules par feuille
- **Collaboration** : Jusqu'à 100 utilisateurs

### **Resend**
- **Gratuit** : 3000 emails/mois
- **Payant** : À partir de $20/mois
- **Limite** : 100 destinataires par email

## 🚀 Prochaines Étapes

1. **Configurer Google Sheets** avec le script
2. **Créer compte Resend** et obtenir la clé API
3. **Mettre à jour le code** avec vos identifiants
4. **Tester l'abonnement** et l'envoi
5. **Intégrer les notifications** automatiques

## 📞 Support

- **Google Apps Script** : [Documentation](https://developers.google.com/apps-script)
- **Resend** : [Documentation](https://resend.com/docs)
- **Templates** : Modèles HTML inclus
- **Code** : Services complets implémentés

## 🎯 Résultat Final

✅ **Stockage permanent** dans Google Sheets  
✅ **Envoi gratuit** avec Resend (3000/mois)  
✅ **Templates professionnels** HTML  
✅ **Notifications automatiques**  
✅ **Interface familière** Google Sheets  
✅ **Pas de backend** requis  

**Cette solution vous donne le meilleur des deux mondes : stockage permanent + envoi gratuit !**
