# 📧 Configuration Newsletter avec EmailJS

## 🎯 Vue d'Ensemble

Cette implémentation utilise **EmailJS** pour envoyer des newsletters automatiquement sans backend. Les emails sont stockés localement et les notifications sont envoyées via EmailJS.

## 🚀 Configuration EmailJS

### **Étape 1: Créer un Compte EmailJS**

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit (200 emails/mois)
3. Connectez votre service email (Gmail, Outlook, etc.)

### **Étape 2: Configuration du Service**

1. **Service Email**: Connectez votre Gmail/Outlook
2. **Templates**: Créez 2 templates :
   - `welcome_template` : Email de bienvenue
   - `content_template` : Notification de contenu

### **Étape 3: Récupérer les Identifiants**

Dans votre dashboard EmailJS, récupérez :
- **Service ID** : `service_xxxxxxx`
- **Template ID** : `template_xxxxxxx`
- **Public Key** : `xxxxxxxxxxxxxxx`

### **Étape 4: Mettre à Jour le Code**

Dans `src/app/services/newsletter.service.ts`, remplacez :

```typescript
private readonly EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
private readonly EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
private readonly EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

Par vos vrais identifiants.

## 📧 Templates Email

### **Template de Bienvenue (`welcome_template`)**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue - Liberté IYAC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Liberté IYAC</h1>
            <p style="color: #666;">Voix Unies pour la Justice</p>
        </div>
        
        <h2>Bienvenue {{to_name}} !</h2>
        
        <p>Merci de vous être abonné à notre newsletter. Vous recevrez désormais :</p>
        
        <ul>
            <li>📰 Nos derniers articles</li>
            <li>🎥 Nouvelles vidéos</li>
            <li>🎙️ Podcasts exclusifs</li>
            <li>🚨 Actualités urgentes</li>
        </ul>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Notre Mission</h3>
            <p><em>"La liberté et la justice ne sont pas des privilèges, mais des droits fondamentaux de chaque citoyen."</em></p>
            <p><strong>- Ibrahim Yacouba</strong></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{site_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Visiter le Site
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
            Vous recevez cet email car vous vous êtes abonné à notre newsletter.<br>
            <a href="{{unsubscribe_url}}">Se désabonner</a>
        </p>
    </div>
</body>
</html>
```

### **Template de Contenu (`content_template`)**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{content_type}} - Liberté IYAC</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">Liberté IYAC</h1>
            <p style="color: #666;">Voix Unies pour la Justice</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin-top: 0;">{{content_type}}</h2>
            <p style="font-size: 14px; color: #666; margin-bottom: 0;">
                Publié le {{publish_date}}
            </p>
        </div>
        
        <h3 style="color: #1e40af;">{{content_title}}</h3>
        
        <p style="font-size: 16px; line-height: 1.6;">{{content_description}}</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{content_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Lire {{content_type}}
            </a>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>Restez Informé(e)</h4>
            <p>Recevez nos dernières actualités directement dans votre boîte mail.</p>
            <a href="{{site_url}}" style="color: #2563eb;">Visiter le site</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
            Vous recevez cet email car vous vous êtes abonné à notre newsletter.<br>
            <a href="{{unsubscribe_url}}">Se désabonner</a>
        </p>
    </div>
</body>
</html>
```

## 🔧 Utilisation

### **Envoi Automatique**

Le service se déclenche automatiquement quand vous ajoutez du contenu :

```typescript
// Dans votre service d'articles
async addArticle(article: Article) {
  // ... logique d'ajout ...
  
  // Notification automatique
  await this.contentNotification.notifyNewArticle(article);
}

// Dans votre service de médias
async addVideo(video: MediaItem) {
  // ... logique d'ajout ...
  
  // Notification automatique
  await this.contentNotification.notifyNewVideo(video);
}
```

### **Envoi Manuel**

```typescript
// Notification urgente
await this.contentNotification.notifyBreakingNews(article);

// Contenu mis en avant
await this.contentNotification.notifyFeaturedContent(content);
```

## 📊 Fonctionnalités

### **✅ Gestion des Abonnés**
- Stockage local des emails
- Préférences par type de contenu
- Désabonnement facile
- Compteur d'abonnés

### **✅ Types de Notifications**
- 📰 Nouveaux articles
- 🎥 Nouvelles vidéos
- 🎙️ Nouveaux podcasts
- 🚨 Actualités urgentes
- ⭐ Contenu mis en avant

### **✅ Personnalisation**
- Templates HTML personnalisables
- Variables dynamiques
- Design responsive
- Liens de désabonnement

## 🔒 Sécurité

- **Pas de backend** : Tout côté client
- **Stockage local** : Emails dans localStorage
- **Limite EmailJS** : 200 emails/mois gratuit
- **Désabonnement** : Lien dans chaque email

## 📈 Avantages

✅ **Gratuit** jusqu'à 200 emails/mois  
✅ **Pas de backend** requis  
✅ **Configuration simple**  
✅ **Templates personnalisables**  
✅ **Notifications automatiques**  
✅ **Gestion des préférences**  

## 🚀 Prochaines Étapes

1. **Configurer EmailJS** avec vos identifiants
2. **Créer les templates** email
3. **Tester l'abonnement** et l'envoi
4. **Intégrer les notifications** automatiques
5. **Personnaliser les templates** selon vos besoins

## 📞 Support

- **EmailJS Docs** : [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- **Templates** : Modèles fournis dans ce guide
- **Code** : Service complet implémenté
- **Test** : Fonctionne immédiatement après configuration
