// Import de tous les articles
import { article001 } from './article-001';
import { article003 } from './article-003';
import { article004 } from './article-004';
import { article005 } from './article-005';

// Export de tous les articles dans l'ordre chronologique (plus récent en premier)
export const allArticles = [
  article005, // Exemple d'article (5 octobre 2025)
  article004, // La France Insoumise (1er octobre 2025)
  article003, // État de la démocratie (29 septembre 2025)
  article001  // Comité Justice et Liberté (27 septembre 2025)
];

// Export individuel pour faciliter l'import sélectif
export {
  article001,
  article003,
  article004,
  article005
};
