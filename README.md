# Liberté IYAC Journal

Site web officiel de **Liberté IYAC** - Journal d'information et d'actualités du Niger

🌐 **Site officiel** : [https://liberteiyac.com](https://liberteiyac.com)

## 🚀 Déploiement sur GitHub Pages avec Domaine Personnalisé

### 1. Configuration du Repository GitHub

1. Allez dans les **Settings** de votre repository GitHub
2. Dans la section **Pages**, sélectionnez :
   - **Source** : Deploy from a branch
   - **Branch** : main
   - **Folder** : /docs

### 2. Configuration du Domaine Personnalisé

1. Dans les **Settings** → **Pages**, ajoutez votre domaine personnalisé :
   - **Custom domain** : `liberteiyac.com`
   - Cochez **Enforce HTTPS**

2. Configurez les DNS de votre domaine :
   ```
   Type: CNAME
   Name: www
   Value: votre-username.github.io
   
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

### 3. Build pour Production (Solution Same-Origin)

```bash
# Installer les dépendances
npm install

# Build pour liberteiyac.com avec Same-Origin (RECOMMANDÉ)
npm run build:liberteiyac

# OU Déploiement automatique complet
npm run deploy:liberteiyac

# OU Build pour GitHub Pages générique
npm run build:github
```

**Important** : Utilisez `--base-href="/"` et `--deploy-url="/"` pour éviter les problèmes CORS.

### 4. Déploiement

1. Commitez et poussez les fichiers :
```bash
git add .
git commit -m "Deploy to liberteiyac.com"
git push origin main
```

2. GitHub Pages va automatiquement déployer le contenu du dossier `/docs`

### 5. Vérification

- Votre site sera disponible à : **https://liberteiyac.com**
- Les images d'IYAC s'afficheront correctement
- Le domaine personnalisé sera actif

## 📁 Structure des Images

Les images d'IYAC Ibrahim Yacouba sont stockées dans :
- `src/assets/iyac.jpg` - Portrait officiel
- `src/assets/iyac2.jpg` - En action  
- `src/assets/iyac3.jpg` - Avec la communauté

Ces images sont automatiquement copiées dans le dossier `docs/assets/` lors du build.

## 🛠️ Commandes Utiles

```bash
# Développement local
npm start

# Build de production
npm run build

# Build pour GitHub Pages générique
npm run build:github

# Build pour liberteiyac.com (RECOMMANDÉ)
npm run build:liberteiyac

# Build pour domaine personnalisé
npm run build:production

# Tests
npm test
```

## 🔧 Configuration SEO

Le site est optimisé pour le référencement avec :
- Meta tags Open Graph
- Twitter Cards
- Canonical URL
- Description et mots-clés optimisés
- Images d'IYAC pour le branding

## 📞 Support

Si vous rencontrez des problèmes avec le domaine :
1. Vérifiez la configuration DNS
2. Attendez 24-48h pour la propagation DNS
3. Vérifiez que le certificat SSL est actif
4. Contactez votre hébergeur de domaine si nécessaire