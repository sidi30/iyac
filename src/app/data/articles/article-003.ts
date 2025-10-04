import { Article } from '../../models/article.model';

export const article003: Article = {
  id: '3',
  title: 'État de la démocratie au Niger : défis et perspectives',
  imageUrl: 'assets/democratie.jpg',
  content: `<div class="article-content-formatted">
    <div class="article-intro">
      <h3>La démocratie nigérienne en question</h3>
      <p class="lead">Le Niger, pays d'Afrique de l'Ouest, fait face à des défis majeurs concernant la consolidation de sa démocratie et le respect des droits fondamentaux.</p>
    </div>

    <div class="article-section">
      <h4>Contexte politique</h4>
      <p>Depuis son indépendance en 1960, le Niger a connu plusieurs transitions politiques et périodes d'instabilité.</p>
      <p>Le pays a adopté une nouvelle constitution en 2010, établissant un système démocratique multipartite.</p>
    </div>

    <div class="article-section">
      <h4>Défis actuels</h4>
      <p>La démocratie nigérienne rencontre plusieurs obstacles :</p>
      <ul>
        <li><strong>Liberté d'expression</strong> : Restrictions sur les médias et l'opposition</li>
        <li><strong>Détention politique</strong> : Emprisonnement d'opposants</li>
        <li><strong>État de droit</strong> : Questions sur l'indépendance de la justice</li>
        <li><strong>Participation citoyenne</strong> : Limitation des droits de manifestation</li>
      </ul>
    </div>

    <div class="article-section">
      <h4>Cas d\'Ibrahim Yacoubou</h4>
      <p>L'arrestation et la détention d'Ibrahim Yacoubou illustrent les défis auxquels fait face la démocratie nigérienne.</p>
      <p>Son cas soulève des questions sur l'équité du système judiciaire et le respect des droits de l'homme.</p>
    </div>

    <div class="article-section">
      <h4>Perspectives d\'avenir</h4>
      <p>Pour consolider la démocratie, le Niger doit :</p>
      <ul>
        <li>Garantir l'indépendance de la justice</li>
        <li>Respecter les droits fondamentaux</li>
        <li>Permettre une opposition politique libre</li>
        <li>Assurer la transparence des processus démocratiques</li>
      </ul>
    </div>
  </div>`,
  excerpt: 'Le Niger fait face à des défis majeurs concernant la consolidation de sa démocratie et le respect des droits fondamentaux.',
  author: 'Équipe Liberté IYAC',
  publishDate: new Date('2025-09-29'),
  category: 'Politique',
  tags: ['Démocratie', 'Niger', 'Politique', 'Droits de l\'homme', 'Justice'],
  isBreaking: false,
  readTime: 5,
  isHighlighted: true
};
