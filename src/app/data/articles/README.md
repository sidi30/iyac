# Guide d'ajout d'articles

Ce guide explique comment ajouter de nouveaux articles au journal Liberté IYAC.

## Structure des articles

Les articles sont organisés dans le dossier `src/app/data/articles/` avec la structure suivante :

```
src/app/data/articles/
├── index.ts              # Export de tous les articles
├── article-001.ts        # Premier article
├── article-002.ts        # Deuxième article
├── article-003.ts        # Troisième article
└── ...
```

## Comment ajouter un nouvel article

### 1. Créer le fichier de l'article

Créez un nouveau fichier `article-XXX.ts` dans le dossier `src/app/data/articles/` où XXX est le numéro suivant dans la séquence.

**Exemple : `article-005.ts`**

```typescript
import { Article } from '../../models/article.model';

export const article005: Article = {
  id: '5',
  title: 'Titre de votre article',
  imageUrl: 'assets/votre-image.jpg', // Optionnel
  content: `<div class="article-content-formatted">
    <div class="article-intro">
      <h3>Introduction</h3>
      <p class="lead">Votre introduction...</p>
    </div>
    
    <div class="article-section">
      <h4>Section 1</h4>
      <p>Votre contenu...</p>
    </div>
    
    <!-- Ajoutez autant de sections que nécessaire -->
  </div>`,
  excerpt: 'Résumé court de votre article (2-3 phrases)',
  author: 'Nom de l\'auteur',
  publishDate: new Date('2025-10-XX'), // Date de publication
  category: 'Catégorie', // Ex: 'Politique', 'Justice', 'Solidarité Internationale'
  tags: ['tag1', 'tag2', 'tag3'], // Mots-clés
  isBreaking: false, // true si c'est une actualité urgente
  readTime: 3, // Temps de lecture estimé en minutes
  isHighlighted: false // true pour mettre en avant
};
```

### 2. Mettre à jour le fichier index.ts

Ajoutez l'import et l'export de votre nouvel article dans `src/app/data/articles/index.ts` :

```typescript
// Import de tous les articles
import { article001 } from './article-001';
import { article003 } from './article-003';
import { article004 } from './article-004';
import { article005 } from './article-005'; // Nouvel import

// Export de tous les articles dans l'ordre chronologique (plus récent en premier)
export const allArticles = [
  article005, // Votre nouvel article (le plus récent)
  article004,
  article003,
  article001
];

// Export individuel pour faciliter l'import sélectif
export {
  article001,
  article003,
  article004,
  article005 // Nouvel export
};
```

## Structure du contenu HTML

Utilisez les classes CSS suivantes pour structurer votre contenu :

- `.article-intro` : Introduction de l'article
- `.article-section` : Sections principales
- `.article-call-to-action` : Appel à l'action
- `.article-signature` : Signature de l'auteur

## Catégories disponibles

- `Justice`
- `Politique`
- `Solidarité Internationale`
- `Démocratie`
- `Droits de l'homme`

## Tags recommandés

- `Niger`
- `Ibrahim Yacoubou`
- `IYAC`
- `Justice`
- `Liberté`
- `Démocratie`
- `Droits de l'homme`

## Fonctionnalités du service

Le service `ArticleService` offre les méthodes suivantes :

- `addArticle(article)` : Ajouter un article dynamiquement
- `updateArticle(id, article)` : Mettre à jour un article
- `removeArticle(id)` : Supprimer un article
- `getArticles()` : Obtenir tous les articles
- `getArticleById(id)` : Obtenir un article par ID
- `getFeaturedArticles()` : Obtenir les articles mis en avant
- `getArticlesByCategory(category)` : Obtenir les articles par catégorie
- `getBreakingArticles()` : Obtenir les articles urgents
- `searchArticles(keyword)` : Rechercher des articles
- `getRecentArticles(limit)` : Obtenir les articles récents

## Images

Placez vos images dans le dossier `src/assets/` et référencez-les avec le chemin `assets/nom-image.jpg`.

## Validation

Après avoir ajouté un article, vérifiez que :

1. Le fichier compile sans erreur
2. L'article apparaît sur la page d'accueil
3. L'article est accessible via son URL `/article/ID`
4. Les fonctionnalités de recherche fonctionnent
