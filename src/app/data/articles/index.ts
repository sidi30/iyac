// Import de tous les articles
import { article001 } from './article-001';
import { article003 } from './article-003';
import { article004 } from './article-004';
import { article006 } from './article-006';
import { article007 } from './article-007';

// Export de tous les articles dans l'ordre chronologique (plus récent en premier)
export const allArticles = [
  article007, // Niger/Injustice : 8 Questions pour comprendre l'injustice et le complot contre IYAC (5 octobre 2025)
  article006, // Mansour Elh Amani - Message de solidarité (5 octobre 2025)
  article004, // La France Insoumise (1er octobre 2025)
  article003, // État de la démocratie (29 septembre 2025)
  article001  // Comité Justice et Liberté (27 septembre 2025)
];

// Export individuel pour faciliter l'import sélectif
export {
  article001,
  article003,
  article004,
  article006,
  article007
};
