# 🚀 Guide de Déploiement GitHub Pages

## 📋 Prérequis

Avant de déployer, assurez-vous d'avoir :

### **1. Compte GitHub**
- ✅ Compte GitHub actif
- ✅ Repository `liberteiyac-journal` créé
- ✅ Accès en écriture au repository

### **2. Configuration Locale**
- ✅ Node.js (version 18+)
- ✅ npm (version 9+)
- ✅ Angular CLI (`npm install -g @angular/cli`)
- ✅ Git configuré avec vos identifiants

### **3. Variables d'Environnement**
- ✅ Clé API Resend configurée dans `environment.prod.ts`
- ✅ URL Google Sheets configurée
- ✅ Email d'expéditeur configuré

## 🔧 Configuration Initiale

### **1. Installation des Dépendances**

```bash
# Installer angular-cli-ghpages pour le déploiement
npm install -g angular-cli-ghpages

# Installer les dépendances du projet
npm install
```

### **2. Configuration GitHub Pages**

Dans votre repository GitHub :
1. Allez dans **Settings** → **Pages**
2. Sélectionnez **Source** : `Deploy from a branch`
3. Sélectionnez **Branch** : `gh-pages`
4. Cliquez sur **Save**

### **3. Configuration des Variables d'Environnement**

Éditez `src/environments/environment.prod.ts` :

```typescript
export const environment = {
  production: true,
  
  // URLs et clés API - À configurer selon votre environnement
  googleSheetsUrl: 'https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec',
  resendApiKey: 're_VOTRE_CLE_RESEND', // Votre vraie clé Resend
  fromEmail: 'newsletter@votre-domaine.com', // Votre domaine
  
  // Google Analytics
  gaTrackingId: 'G-JJDC6WW0HV',
  
  // Configuration de production
  enableMockMode: false, // Désactivé en production
  enableCSP: true, // Activé en production
  enableHSTS: true,
  
  // Configuration CORS
  allowedOrigins: [
    'https://liberteiyac.com',
    'https://www.liberteiyac.com',
    'https://sidi30.github.io'
  ],
  
  // Limites de sécurité
  maxRequestSize: '10mb',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // 100 requêtes par fenêtre
};
```

## 🚀 Méthodes de Déploiement

### **Méthode 1 : Script Automatique (Recommandée)**

```bash
# Déploiement complet avec vérifications
npm run deploy

# Test de déploiement (sans déployer réellement)
npm run deploy:dry-run
```

### **Méthode 2 : Déploiement Rapide**

```bash
# Déploiement rapide (moins de vérifications)
npm run deploy:quick
```

### **Méthode 3 : Déploiement Manuel**

```bash
# 1. Build de l'application
npm run build:ghpages

# 2. Déploiement
npx angular-cli-ghpages --dir=dist/liberteiyac-journal/browser
```

## 📝 Processus de Déploiement

### **Étape 1 : Vérifications Préliminaires**
- ✅ Vérification de Node.js, npm, Angular CLI
- ✅ Vérification du statut Git
- ✅ Détection des modifications non commitées

### **Étape 2 : Construction de l'Application**
- ✅ Suppression des anciens builds
- ✅ Installation des dépendances (`npm ci`)
- ✅ Build avec configuration GitHub Pages
- ✅ Vérification de la réussite du build

### **Étape 3 : Test du Build**
- ✅ Vérification des fichiers essentiels
- ✅ Contrôle de la taille du build
- ✅ Validation de l'intégrité

### **Étape 4 : Déploiement**
- ✅ Déploiement sur GitHub Pages
- ✅ Configuration automatique de la branche `gh-pages`
- ✅ Notification de succès

## 🔍 Vérification Post-Déploiement

### **1. Vérification du Site**
- 🌐 URL : `https://sidi30.github.io/iyac/`
- ⏱️ Délai : 2-10 minutes pour la mise à jour
- 🔄 Cache : Vider le cache du navigateur si nécessaire

### **2. Tests Fonctionnels**
- ✅ Page d'accueil se charge
- ✅ Navigation fonctionne
- ✅ Articles s'affichent
- ✅ Vidéos et podcasts fonctionnent
- ✅ Newsletter fonctionne (en production)
- ✅ Google Analytics fonctionne

### **3. Vérification des Services**
- ✅ Google Sheets : Test d'inscription newsletter
- ✅ Resend : Test d'envoi d'email
- ✅ Google Analytics : Vérification des événements

## 🛠️ Dépannage

### **Erreur : "Repository not found"**
```bash
# Vérifier la configuration Git
git remote -v

# Ajouter le remote si nécessaire
git remote add origin https://github.com/sidi30/liberteiyac-journal.git
```

### **Erreur : "Build failed"**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier les erreurs TypeScript
npm run build:ghpages
```

### **Erreur : "Deploy failed"**
```bash
# Vérifier les permissions GitHub
# Aller dans Settings → Developer settings → Personal access tokens
# Créer un token avec les permissions : repo, workflow

# Configurer le token
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
```

### **Site ne se met pas à jour**
- ⏱️ Attendre 5-10 minutes
- 🔄 Vider le cache du navigateur
- 🔍 Vérifier dans GitHub Pages Settings
- 📝 Vérifier les logs de déploiement

## 📊 Monitoring

### **1. Google Analytics**
- 📈 Visiteurs en temps réel
- 📊 Pages les plus visitées
- 🌍 Géolocalisation des visiteurs
- 📱 Appareils utilisés

### **2. GitHub Pages**
- 📝 Logs de déploiement
- ⚡ Performance du site
- 🔒 Sécurité HTTPS

### **3. Services Externes**
- 📧 Resend : Statistiques d'emails
- 📊 Google Sheets : Abonnés newsletter

## 🔄 Mise à Jour Continue

### **Workflow Recommandé**
1. 🔧 Développement en local (`npm start`)
2. 🧪 Test en local (`npm run build:ghpages`)
3. 📝 Commit des changements
4. 🚀 Déploiement (`npm run deploy`)
5. ✅ Vérification du site en ligne

### **Automatisation (Optionnelle)**
- 🤖 GitHub Actions pour déploiement automatique
- 📧 Notifications par email
- 🔔 Alertes en cas d'erreur

## 📞 Support

En cas de problème :
1. 🔍 Vérifier les logs de déploiement
2. 📝 Consulter la documentation GitHub Pages
3. 🆘 Créer une issue sur le repository
4. 💬 Contacter le support technique

---

**🎉 Félicitations ! Votre site Liberté IYAC Journal est maintenant en ligne !**

**URL :** `https://sidi30.github.io/iyac/`
