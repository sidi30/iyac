# 🔒 Guide de Sécurité - Liberté IYAC

## 🎯 Vue d'Ensemble Sécuritaire

Ce document détaille les mesures de sécurité implémentées dans l'application Liberté IYAC pour protéger contre les vulnérabilités critiques identifiées.

## 🚨 Vulnérabilités Corrigées

### **1. XSS (Cross-Site Scripting) - CRITIQUE ✅**

#### **Problème Identifié**
- Utilisation d'`innerHTML` sans sanitisation
- Injection possible de scripts malveillants
- Fichiers affectés : `article-card.html`, `article-detail.html`

#### **Solution Implémentée**
- **Pipe de Sanitisation** : `SanitizeHtmlPipe` avec DOMPurify
- **Configuration Stricte** : Balises et attributs autorisés uniquement
- **Validation** : Contenu HTML nettoyé avant affichage

```typescript
// Configuration sécurisée
const config = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'div', 'span'],
  ALLOWED_ATTR: ['class', 'id'],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false
};
```

### **2. Exposition d'URLs Sensibles - ÉLEVÉ ✅**

#### **Problème Identifié**
- URL Google Apps Script exposée dans le code
- Risque d'attaques par énumération
- Possibilité de DoS

#### **Solution Implémentée**
- **Service de Configuration** : `SecurityConfigService`
- **Validation d'URL** : Vérification du format Google Apps Script
- **Environnements Séparés** : Configuration par environnement

```typescript
private isValidGoogleAppsScriptUrl(url: string): boolean {
  const pattern = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  return pattern.test(url);
}
```

### **3. Clés API en Dur - ÉLEVÉ ✅**

#### **Problème Identifié**
- Clés API exposées dans le code source
- Risque de vol et utilisation malveillante
- Pas de rotation des clés

#### **Solution Implémentée**
- **Fichiers d'Environnement** : `environment.prod.ts` et `environment.ts`
- **Validation des Clés** : Format et structure vérifiés
- **Masquage** : Clés partiellement masquées dans les logs

```typescript
// Validation des clés API
private isValidResendApiKey(key: string): boolean {
  const pattern = /^re_[A-Za-z0-9_-]+$/;
  return pattern.test(key);
}
```

### **4. Absence de Headers de Sécurité - MOYEN ✅**

#### **Problème Identifié**
- Pas de protection contre clickjacking
- MIME sniffing possible
- Pas de politique de référent

#### **Solution Implémentée**
- **Headers de Sécurité** : X-Frame-Options, X-Content-Type-Options, etc.
- **Politique de Permissions** : Restrictions sur caméra, microphone, géolocalisation
- **Politique de Référent** : Contrôle des informations partagées

```html
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
<meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()">
```

### **5. Validation des Entrées - MOYEN ✅**

#### **Problème Identifié**
- Pas de validation des données utilisateur
- Risque d'injection de données malveillantes
- Pas de nettoyage des entrées

#### **Solution Implémentée**
- **Service de Validation** : `InputValidationService`
- **Validation Complète** : Email, nom, préférences, URLs
- **Nettoyage** : Données sanitizées avant traitement

```typescript
validateEmail(email: string): { isValid: boolean; cleanedEmail?: string; error?: string } {
  // Validation stricte avec nettoyage
  const cleanedEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(cleanedEmail) ? { isValid: true, cleanedEmail } : { isValid: false, error: 'Format invalide' };
}
```

## 🛡️ Mesures de Sécurité Supplémentaires

### **1. Configuration par Environnement**
- **Développement** : Configuration relaxée pour faciliter le debug
- **Production** : Configuration stricte avec toutes les protections
- **Variables d'Environnement** : Séparation des configurations sensibles

### **2. Validation des Données**
- **Email** : Format RFC 5322, longueur maximale, domaines suspects bloqués
- **Nom** : Caractères autorisés uniquement, longueur limitée
- **Préférences** : Au moins une option requise
- **URLs** : Protocoles autorisés, IPs privées bloquées
- **HTML** : Balises et attributs dangereux interdits

### **3. Gestion des Erreurs**
- **Logs Sécurisés** : Pas d'exposition d'informations sensibles
- **Messages Génériques** : Erreurs utilisateur sans détails techniques
- **Monitoring** : Détection d'activités suspectes

### **4. Protection CORS**
- **Origines Autorisées** : Liste restrictive des domaines autorisés
- **Méthodes HTTP** : Seules les méthodes nécessaires autorisées
- **Headers** : Headers autorisés limités

## 🔧 Configuration de Production

### **Variables d'Environnement Requises**

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  googleSheetsUrl: 'VOTRE_URL_GOOGLE_APPS_SCRIPT',
  resendApiKey: 'VOTRE_CLE_RESEND',
  fromEmail: 'noreply@votre-domaine.com',
  gaTrackingId: 'G-VOTRE_ID_GA',
  enableSecurityHeaders: true,
  enableCSP: true,
  enableHSTS: true
};
```

### **Headers de Sécurité Recommandés**

```nginx
# Configuration Nginx recommandée
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📊 Monitoring et Alertes

### **Métriques de Sécurité**
- **Tentatives XSS** : Détection d'injections malveillantes
- **Requêtes Anormales** : Patterns suspects
- **Erreurs de Validation** : Échecs de validation répétés
- **Accès Non Autorisés** : Tentatives d'accès à des ressources protégées

### **Alertes Recommandées**
- **Tentatives XSS** : Alerte immédiate
- **Erreurs 4xx/5xx** : Monitoring des erreurs
- **Trafic Anormal** : Pic de trafic suspect
- **Échecs d'Authentification** : Tentatives répétées

## 🚀 Déploiement Sécurisé

### **Checklist de Sécurité**

#### **Avant Déploiement**
- [ ] Variables d'environnement configurées
- [ ] Clés API valides et testées
- [ ] Headers de sécurité activés
- [ ] Validation des entrées testée
- [ ] Sanitisation HTML vérifiée

#### **Après Déploiement**
- [ ] Headers de sécurité vérifiés
- [ ] HTTPS activé et fonctionnel
- [ ] Monitoring configuré
- [ ] Alertes de sécurité actives
- [ ] Tests de pénétration effectués

### **Tests de Sécurité**

#### **Tests Automatisés**
```bash
# Test des headers de sécurité
curl -I https://votre-site.com | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection)"

# Test de validation XSS
curl -X POST https://votre-site.com/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"<script>alert(\"XSS\")</script>@test.com"}'
```

#### **Tests Manuels**
- **Injection XSS** : Tentative d'injection de scripts
- **Validation d'Email** : Emails malformés et suspects
- **Headers de Sécurité** : Vérification des protections
- **CORS** : Test des restrictions cross-origin

## 📚 Ressources de Sécurité

### **Standards et Bonnes Pratiques**
- **OWASP Top 10** : Vulnérabilités web les plus critiques
- **CSP (Content Security Policy)** : Politique de sécurité du contenu
- **HTTPS** : Chiffrement des communications
- **RGPD** : Protection des données personnelles

### **Outils de Test**
- **OWASP ZAP** : Scanner de vulnérabilités
- **Burp Suite** : Test de sécurité web
- **Nmap** : Scan de ports et services
- **SSL Labs** : Test de configuration SSL/TLS

## 🎯 Conclusion

L'application Liberté IYAC est maintenant sécurisée contre les principales vulnérabilités web :

✅ **XSS** : Sanitisation complète du contenu HTML  
✅ **Exposition de Données** : Configuration sécurisée  
✅ **Validation** : Entrées utilisateur validées et nettoyées  
✅ **Headers de Sécurité** : Protection contre les attaques courantes  
✅ **Monitoring** : Détection d'activités suspectes  

**🔒 Votre application est maintenant prête pour un déploiement sécurisé en production !**
