import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article, BreakingNews } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private articlesSubject = new BehaviorSubject<Article[]>([]);
  private breakingNewsSubject = new BehaviorSubject<BreakingNews[]>([]);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    const articles: Article[] = [
      {
        id: '4',
        title: 'La France Insoumise exige la libération d\'Ibrahim Yacoubou',
        imageUrl: 'assets/insoumise.jpg',
        content: `<div class="article-content-formatted">
          <div class="article-intro">
            <h3>Solidarité internationale pour la justice</h3>
            <p class="lead">Le groupe parlementaire La France Insoumise réaffirme son soutien indéfectible à Ibrahim Yacoubou et exige sa libération immédiate.</p>
          </div>

          <div class="article-section">
            <h4>Une mobilisation internationale</h4>
            <p>Face à l'injustice qui frappe Ibrahim Yacoubou, la solidarité internationale s'organise. Le groupe parlementaire <strong>La France Insoumise</strong> a officiellement pris position pour exiger la libération immédiate de ce défenseur des droits.</p>
            <p>Cette mobilisation transcende les frontières et démontre que la lutte pour la justice et la liberté est universelle.</p>
          </div>

          <div class="article-section">
            <h4>Le soutien de Jean-Luc Mélenchon</h4>
            <p>Jean-Luc Mélenchon, leader de La France Insoumise, a personnellement rencontré Ibrahim Yacoubou et a été profondément marqué par la personnalité de cet homme.</p>
            <p><em>"Ibrahim Yacoubou incarne les valeurs de courage, d'intégrité et de détermination que nous défendons. C'est un homme d'exception qui mérite notre soutien total"</em>, a déclaré le député.</p>
          </div>

          <div class="article-section">
            <h4>La rencontre des députés</h4>
            <p>Plusieurs députés de La France Insoumise ont eu l'occasion de rencontrer Ibrahim Yacoubou et ont tous été impressionnés par :</p>
            <ul>
              <li><strong>Sa dignité</strong> : Même dans l'adversité, il garde sa dignité et son humanité</li>
              <li><strong>Son courage</strong> : Il ne recule jamais devant les défis</li>
              <li><strong>Sa vision</strong> : Il porte une vision claire pour l'avenir du Niger</li>
              <li><strong>Son intégrité</strong> : Il reste fidèle à ses principes et valeurs</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Une cause universelle</h4>
            <p>La France Insoumise considère que la défense d'Ibrahim Yacoubou dépasse les clivages politiques traditionnels. C'est une question de <strong>droits de l'homme</strong> et de <strong>justice universelle</strong>.</p>
            <p>Le groupe parlementaire français s'engage à :</p>
            <ul>
              <li>Mobiliser l'opinion publique française</li>
              <li>Interpeller les autorités nigériennes</li>
              <li>Exercer une pression diplomatique</li>
              <li>Maintenir la solidarité internationale</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>L'impact de cette solidarité</h4>
            <p>Le soutien de La France Insoumise apporte une dimension internationale à la cause d'Ibrahim Yacoubou. Cette solidarité :</p>
            <ul>
              <li><strong>Renforce la légitimité</strong> de la lutte pour sa libération</li>
              <li><strong>Exerce une pression</strong> sur les autorités nigériennes</li>
              <li><strong>Mobilise l'opinion</strong> publique internationale</li>
              <li><strong>Donne de l'espoir</strong> à tous les défenseurs des droits</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Un message d'espoir</h4>
            <p>Cette mobilisation internationale démontre que la justice ne connaît pas de frontières. Quand des hommes et des femmes de bonne volonté s'unissent pour défendre les droits fondamentaux, ils peuvent faire reculer l'injustice.</p>
            <p>La France Insoumise envoie un message clair : <strong>Ibrahim Yacoubou n'est pas seul dans sa lutte</strong>.</p>
          </div>

          <div class="article-call-to-action">
            <h4>Solidarité internationale pour la liberté !</h4>
            <p><em>Ensemble, nous ferons triompher la justice et la liberté d'Ibrahim Yacoubou.</em></p>
          </div>

          <div class="article-signature">
            <p><strong>Fait à Paris, le 1er octobre 2025</strong><br>
            <em>Groupe parlementaire La France Insoumise</em></p>
          </div>
        </div>`,
        excerpt: 'Le groupe parlementaire La France Insoumise réaffirme son soutien indéfectible à Ibrahim Yacoubou et exige sa libération immédiate.',
        author: 'La France Insoumise',
        publishDate: new Date('2025-10-01'),
        category: 'Solidarité Internationale',
        tags: ['France Insoumise', 'Jean-Luc Mélenchon', 'Solidarité', 'Niger', 'Justice', 'Ibrahim Yacoubou'],
        isBreaking: true,
        readTime: 4,
        isHighlighted: true
      },
      {
        id: '1',
        title: 'Comité Justice et Liberté / Voix Unies pour Ibrahim Yacoubou',
        content: `<div class="article-content-formatted">
          <div class="article-intro">
            <h3>Citoyennes, Citoyens, Amis du Niger</h3>
            <p class="lead">Cela fait aujourd'hui deux semaines que notre compatriote Ibrahim Yacouba, IYAC, a été arrêté sur la base d'un dossier fictif concocté pour l'emprisonner et salir sa réputation.</p>
          </div>

          <div class="article-section">
            <h4>La situation actuelle</h4>
            <p>Malgré toutes les preuves de sa non implication, il demeure encore détenu à <strong>Ouallam</strong>, où il avait déjà passé injustement <strong>452 jours de détention</strong>.</p>
            <p>Cela fait également deux semaines que nous sommes pleinement mobilisés pour que notre compatriote recouvre sa liberté.</p>
          </div>

          <div class="article-section">
            <h4>Notre mobilisation</h4>
            <p>Par la grâce de Dieu, par la justesse de cette cause, nous sommes chaque jour plus nombreux.</p>
            <p>Notre mobilisation n'est ni politique, ni politicienne. Elle est <strong>citoyenne</strong> et transcende toute considération.</p>
            <p>Nous ne mettons en cause personne et nous n'indexons personne dans cette affaire.</p>
          </div>

          <div class="article-section">
            <h4>Reconnaissance</h4>
            <p>Nous voudrions surtout exprimer ici notre profonde gratitude à celles et ceux qui se tiennent à nos côtés. Votre soutien indéfectible est la preuve que la vérité ne peut être étouffée et que la justice ne peut être confisquée.</p>
            <p>Nous rendons grâce à <strong>ALLAH</strong>, le Seigneur de l'univers, qui chaque jour fait progresser notre cause.</p>
          </div>

          <div class="article-section">
            <h4>L'enjeu démocratique</h4>
            <p>Ce n'est pas seulement IYAC qui est emprisonné à tort, c'est notre <strong>pacte social</strong> que l'on veut compromettre.</p>
            <p>Cet acharnement contre un leader politique connu pour son intégrité et son attachement à la patrie est une insupportable injustice.</p>
          </div>

          <div class="article-section">
            <h4>Notre foi</h4>
            <p>Nous avons foi en Dieu et à sa promesse d'établir la vérité, quelque soit le temps que ça prendra. <em>Ya Allah soit notre Garant et notre Bouclier contre l'injustice. Amen</em></p>
          </div>

          <div class="article-call-to-action">
            <h4>Libérez IYAC. Défendons notre avenir.</h4>
          </div>

          <div class="article-signature">
            <p><strong>Fait à Niamey, le 27 septembre 2025</strong><br>
            <em>Dr Djibril Oumarou</em></p>
          </div>
        </div>`,
        excerpt: 'Cela fait aujourd\'hui deux semaines que notre compatriote Ibrahim Yacouba, IYAC, a été arrêté sur la base d\'un dossier fictif concocté pour l\'emprisonner et salir sa réputation.',
        author: 'Dr Djibril Oumarou',
        publishDate: new Date('2025-09-27'),
        category: 'Justice',
        tags: ['Justice', 'Liberté', 'Niger', 'Ibrahim Yacoubou'],
        isBreaking: true,
        readTime: 3,
        isHighlighted: true
      },
      {
        id: '2',
        title: 'La prison de Filingue : un symbole de l\'injustice au Niger',
        imageUrl: 'assets/prison.avif',
        content: `<div class="article-content-formatted">
          <div class="article-intro">
            <h3>Filingue : Centre de détention controversé</h3>
            <p class="lead">La prison de Filingue, située dans la région de Tillabéri, est devenue un symbole de l'injustice et de la répression politique au Niger.</p>
          </div>

          <div class="article-section">
            <h4>Historique de la prison</h4>
            <p>Construite dans les années 1990, la prison de Filingue a été utilisée à plusieurs reprises pour détenir des opposants politiques et des défenseurs des droits de l'homme.</p>
            <p>Cette installation pénitentiaire est connue pour ses conditions de détention difficiles et son isolement géographique.</p>
          </div>

          <div class="article-section">
            <h4>Conditions de détention</h4>
            <p>Les détenus de Filingue font face à des défis majeurs :</p>
            <ul>
              <li><strong>Isolement géographique</strong> : Difficulté d'accès pour les familles et avocats</li>
              <li><strong>Conditions sanitaires</strong> : Manque d'infrastructures médicales</li>
              <li><strong>Accès limité</strong> : Restrictions sur les visites et communications</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Cas emblématiques</h4>
            <p>Plusieurs personnalités politiques ont été détenues à Filingue, notamment :</p>
            <ul>
              <li>Ibrahim Yacoubou (IYAC) - 452 jours de détention</li>
              <li>Autres opposants politiques</li>
              <li>Défenseurs des droits de l'homme</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Impact sur la démocratie</h4>
            <p>L'utilisation de Filingue comme centre de détention politique soulève des questions sur l'état de la démocratie au Niger et le respect des droits fondamentaux.</p>
          </div>
        </div>`,
        excerpt: 'La prison de Filingue, située dans la région de Tillabéri, est devenue un symbole de l\'injustice et de la répression politique au Niger.',
        author: 'Équipe Liberté IYAC',
        publishDate: new Date('2025-09-28'),
        category: 'Politique',
        tags: ['Prison', 'Filingue', 'Niger', 'Droits de l\'homme', 'Démocratie'],
        isBreaking: false,
        readTime: 4,
        isHighlighted: true
      },
      {
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
      }
    ];

    const breakingNews: BreakingNews[] = [
      {
        id: '1',
        title: 'La France Insoumise exige la libération d\'Ibrahim Yacoubou',
        timestamp: new Date(),
        urgent: true
      },
      {
        id: '2',
        title: 'Mobilisation pour la libération d\'Ibrahim Yacoubou continue',
        timestamp: new Date(),
        urgent: true
      }
    ];

    this.articlesSubject.next(articles);
    this.breakingNewsSubject.next(breakingNews);
  }

  getArticles(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  getBreakingNews(): Observable<BreakingNews[]> {
    return this.breakingNewsSubject.asObservable();
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return new BehaviorSubject(
      this.articlesSubject.value.find(article => article.id === id)
    ).asObservable();
  }

  getFeaturedArticles(): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => article.isHighlighted)
    ).asObservable();
  }

  getArticlesByCategory(category: string): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => article.category === category)
    ).asObservable();
  }
}
