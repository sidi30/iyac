# Liberté IYAC Journal

Site web du journal Liberté IYAC - Voix Unies pour la Justice

## Déploiement sur GitHub Pages

### 1. Configuration du Repository

1. Allez dans les **Settings** de votre repository GitHub
2. Dans la section **Pages**, sélectionnez :
   - **Source** : Deploy from a branch
   - **Branch** : main
   - **Folder** : /docs

### 2. Build pour GitHub Pages

```bash
# Installer les dépendances
npm install

# Build spécialement pour GitHub Pages
npm run build:github
```

### 3. Déploiement

1. Commitez et poussez les fichiers :
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

2. GitHub Pages va automatiquement déployer le contenu du dossier `/docs`

### 4. Vérification

- Votre site sera disponible à : `https://votre-username.github.io/liberteiyac-journal`
- Les images d'IYAC devraient maintenant s'afficher correctement

## Structure des Images

Les images d'IYAC Ibrahim Yacouba sont stockées dans :
- `src/assets/iyac.jpg` - Portrait officiel
- `src/assets/iyac2.jpg` - En action  
- `src/assets/iyac3.jpg` - Avec la communauté

Ces images sont automatiquement copiées dans le dossier `docs/assets/` lors du build.

## Commandes Utiles

```bash
# Développement local
npm start

# Build de production
npm run build

# Build pour GitHub Pages
npm run build:github

# Tests
npm test
```

## Support

Si les images ne s'affichent toujours pas sur GitHub Pages :
1. Vérifiez que le dossier `/docs` contient bien le dossier `/assets`
2. Vérifiez que les chemins dans le code utilisent `./assets/` et non `/assets/`
3. Attendez quelques minutes pour que GitHub Pages mette à jour le cache