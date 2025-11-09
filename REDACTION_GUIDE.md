# Guide de la Page Rédaction

## Vue d'ensemble

La page **Rédaction** est un espace protégé par mot de passe qui permet d'accéder à l'outil de gestion de contenu PDF sans révéler l'URL externe.

## Accès

### URL
- **Production**: `https://liberteiyac.com/redaction`
- **Développement**: `http://localhost:4200/redaction`

### Authentification
- **Mot de passe**: `@Africa2024!Injustice`
- **Durée de session**: 24 heures
- **Stockage**: Session Storage (sécurisé)

## Fonctionnalités

### Page de connexion
- Interface moderne et sécurisée
- Formulaire de mot de passe avec validation
- Messages d'erreur clairs
- Design responsive (mobile-friendly)

### Espace rédaction
- Ouverture automatique dans un nouvel onglet
- Page de confirmation avec bouton de réouverture
- Bouton de déconnexion
- Header personnalisé avec dégradé
- Évite les problèmes d'iframe bloqué (X-Frame-Options)

### Sécurité
- Le mot de passe est stocké côté service (non visible dans le DOM)
- Session expirable après 24 heures
- Utilisation de sessionStorage (effacé à la fermeture du navigateur)
- URL externe masquée (affiche uniquement `/redaction`)

## Structure technique

### Fichiers créés

1. **Service d'authentification**
   - `src/app/services/redaction-auth.service.ts`
   - Gestion de l'authentification
   - Vérification du mot de passe
   - Gestion de la session

2. **Guard de route**
   - `src/app/guards/redaction-auth.guard.ts`
   - Protection de la route `/redaction`
   - Vérification d'accès automatique

3. **Composant Rédaction**
   - `src/app/pages/redaction/redaction.ts` (TypeScript)
   - `src/app/pages/redaction/redaction.html` (Template)
   - `src/app/pages/redaction/redaction.scss` (Styles)
   - `src/app/pages/redaction/redaction.spec.ts` (Tests)

4. **Configuration**
   - `src/environments/environment.ts` (dev)
   - `src/environments/environment.prod.ts` (production)
   - `src/app/app.routes.ts` (routes)

### Navigation
Un lien "🔒 Rédaction" a été ajouté dans le menu principal du site.

## Utilisation

### Pour les utilisateurs autorisés

1. **Accéder à la page**
   - Cliquer sur "🔒 Rédaction" dans le menu
   - Ou aller directement sur `/redaction`

2. **Se connecter**
   - Entrer le mot de passe : `@Africa2024!Injustice`
   - Cliquer sur "Se connecter"

3. **Utiliser l'espace**
   - Un nouvel onglet s'ouvre automatiquement avec l'espace rédaction
   - Si bloqué par le navigateur, cliquer sur le bouton "Ouvrir l'espace de rédaction"
   - Travailler normalement sur les PDF
   - La session reste active pendant 24h

4. **Se déconnecter**
   - Cliquer sur "Se déconnecter" en haut à droite
   - Ou fermer le navigateur (sessionStorage)

### Pour les développeurs

#### Changer le mot de passe
Modifier dans `src/app/services/redaction-auth.service.ts` :

```typescript
private readonly PASSWORD = '@Africa2024!Injustice';
```

#### Changer la durée de session
Modifier dans `src/app/services/redaction-auth.service.ts` :

```typescript
private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // en millisecondes
```

#### Changer l'URL de l'espace rédaction
Modifier dans `src/environments/environment.ts` et `environment.prod.ts` :

```typescript
redactionUrl: 'https://sidi30.github.io/pdf-iyac/',
```

## Design

### Thème de connexion
- Dégradé violet (Gradient: #667eea → #764ba2)
- Card centrée avec ombre portée
- Animations douces (fadeIn, shake pour erreurs)
- Responsive design

### Thème de l'espace
- Header avec le même dégradé violet
- Bouton de déconnexion stylisé
- Iframe en plein écran
- Adaptation mobile complète

## Déploiement

La page fonctionne automatiquement avec le déploiement standard du projet :

```bash
# Build pour production
npm run build

# Deploy (selon votre méthode)
npm run deploy
```

L'URL `https://liberteiyac.com/redaction` sera accessible une fois déployé.

## Sécurité recommandée (optionnel)

Pour renforcer la sécurité en production, vous pouvez :

1. **Utiliser une authentification backend**
   - Remplacer le mot de passe en dur par une API
   - Implémenter JWT ou OAuth

2. **Ajouter du rate limiting**
   - Limiter les tentatives de connexion
   - Bloquer temporairement après X échecs

3. **Logger les accès**
   - Enregistrer les connexions réussies/échouées
   - Monitoring des accès

4. **HTTPS obligatoire**
   - Déjà configuré avec liberteiyac.com
   - Certificat SSL/TLS actif

## Support

Pour toute question ou problème :
- Vérifier que l'URL externe est accessible
- Vérifier les logs du navigateur (F12)
- Vérifier la configuration des environments
- Si le navigateur bloque l'ouverture automatique, autoriser les popups pour le site

## Résolution du problème d'iframe

Le contenu ne s'affiche plus dans un iframe pour éviter les erreurs "Contenu bloqué" causées par les en-têtes de sécurité (`X-Frame-Options`) du site externe. 

**Solution actuelle** : Ouverture automatique dans un nouvel onglet
- ✅ Évite les restrictions de sécurité
- ✅ Meilleure expérience utilisateur
- ✅ Pas de problème CORS
- ✅ Fonctionne sur tous les navigateurs

---

**Note importante** : Cette page ouvre le contenu de `https://sidi30.github.io/pdf-iyac/` dans un nouvel onglet après authentification. L'URL reste masquée dans la barre d'adresse principale (`/redaction`).

