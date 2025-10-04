import { Article } from '../../models/article.model';

export const article005: Article = {
  id: '5',
  title: 'Exemple d\'article : Comment ajouter facilement du contenu',
  imageUrl: 'assets/iyac.jpg',
  content: `<div class="article-content-formatted">
    <div class="article-intro">
      <h3>Guide pratique pour les contributeurs</h3>
      <p class="lead">Ceci est un exemple d'article pour démontrer la facilité d'ajout de contenu dans le système modulaire.</p>
    </div>

    <div class="article-section">
      <h4>Avantages de la nouvelle structure</h4>
      <p>La refactorisation du système d'articles offre plusieurs avantages :</p>
      <ul>
        <li><strong>Modularité</strong> : Chaque article est dans son propre fichier</li>
        <li><strong>Maintenabilité</strong> : Facile de modifier ou supprimer un article</li>
        <li><strong>Évolutivité</strong> : Ajout simple de nouveaux articles</li>
        <li><strong>Organisation</strong> : Structure claire et logique</li>
      </ul>
    </div>

    <div class="article-section">
      <h4>Processus d'ajout simplifié</h4>
      <p>Pour ajouter un nouvel article, il suffit de :</p>
      <ol>
        <li>Créer un fichier <code>article-XXX.ts</code></li>
        <li>Définir l'objet Article avec toutes les propriétés</li>
        <li>Mettre à jour le fichier <code>index.ts</code></li>
        <li>L'article apparaît automatiquement sur le site</li>
      </ol>
    </div>

    <div class="article-section">
      <h4>Fonctionnalités avancées</h4>
      <p>Le service ArticleService offre maintenant des méthodes pour :</p>
      <ul>
        <li>Rechercher des articles par mot-clé</li>
        <li>Filtrer par catégorie</li>
        <li>Obtenir les articles récents</li>
        <li>Gérer les actualités urgentes</li>
      </ul>
    </div>

    <div class="article-call-to-action">
      <h4>Prêt à contribuer ?</h4>
      <p>Consultez le fichier README.md dans le dossier articles pour le guide complet !</p>
    </div>

    <div class="article-signature">
      <p><strong>Fait le 5 octobre 2025</strong><br>
      <em>Équipe de développement Liberté IYAC</em></p>
    </div>
  </div>`,
  excerpt: 'Ceci est un exemple d\'article pour démontrer la facilité d\'ajout de contenu dans le système modulaire.',
  author: 'Équipe de développement',
  publishDate: new Date('2025-10-05'),
  category: 'Documentation',
  tags: ['Documentation', 'Guide', 'Développement', 'Articles'],
  isBreaking: false,
  readTime: 2,
  isHighlighted: false
};
