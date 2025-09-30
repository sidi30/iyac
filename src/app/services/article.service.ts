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
        title: 'L\'esprit insoumis : résistance et détermination au Niger',
        imageUrl: 'assets/insoumise.jpg',
        content: `<div class="article-content-formatted">
          <div class="article-intro">
            <h3>La force de l'insoumission</h3>
            <p class="lead">Face à l'injustice et à l'oppression, l'esprit insoumis du peuple nigérien continue de briller comme une lueur d'espoir dans les ténèbres.</p>
          </div>

          <div class="article-section">
            <h4>Définition de l'insoumission</h4>
            <p>L'insoumission n'est pas la rébellion aveugle, mais la <strong>détermination inébranlable</strong> à défendre la vérité et la justice.</p>
            <p>C'est le refus de se plier face à l'injustice, même quand les forces semblent déséquilibrées.</p>
          </div>

          <div class="article-section">
            <h4>L'insoumission au Niger</h4>
            <p>Dans le contexte nigérien, l'insoumission se manifeste par :</p>
            <ul>
              <li><strong>La défense des droits</strong> : Refus d'accepter les violations des libertés fondamentales</li>
              <li><strong>La résistance pacifique</strong> : Mobilisation citoyenne pour la justice</li>
              <li><strong>La solidarité</strong> : Soutien inconditionnel aux victimes d'injustice</li>
              <li><strong>La persévérance</strong> : Continuité du combat malgré les obstacles</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Cas d'Ibrahim Yacoubou</h4>
            <p>L'arrestation d'Ibrahim Yacoubou illustre parfaitement la nécessité de l'insoumission.</p>
            <p>Face à cette injustice, le peuple nigérien a choisi de ne pas se soumettre et de continuer le combat pour sa libération.</p>
          </div>

          <div class="article-section">
            <h4>Les formes de résistance</h4>
            <p>L'insoumission au Niger prend plusieurs formes :</p>
            <ul>
              <li><strong>Mobilisation citoyenne</strong> : Rassemblements et manifestations pacifiques</li>
              <li><strong>Solidarité communautaire</strong> : Soutien aux familles des détenus</li>
              <li><strong>Défense juridique</strong> : Accompagnement des procédures légales</li>
              <li><strong>Sensibilisation</strong> : Information et éducation sur les droits</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>L'importance de l'insoumission</h4>
            <p>L'insoumission est essentielle pour :</p>
            <ul>
              <li>Préserver la démocratie et les libertés</li>
              <li>Empêcher l'arbitraire et l'injustice</li>
              <li>Maintenir l'espoir et la dignité</li>
              <li>Construire un avenir meilleur</li>
            </ul>
          </div>

          <div class="article-section">
            <h4>Message d'espoir</h4>
            <p>L'esprit insoumis du peuple nigérien est une force inébranlable qui ne peut être brisée par aucune oppression.</p>
            <p>Ensemble, nous continuerons à résister et à lutter pour la justice, la liberté et la dignité.</p>
          </div>

          <div class="article-call-to-action">
            <h4>Restons insoumis, restons unis !</h4>
            <p><em>La liberté d'Ibrahim Yacoubou est notre cause commune.</em></p>
          </div>
        </div>`,
        excerpt: 'Face à l\'injustice et à l\'oppression, l\'esprit insoumis du peuple nigérien continue de briller comme une lueur d\'espoir dans les ténèbres.',
        author: 'Équipe Liberté IYAC',
        publishDate: new Date('2025-10-01'),
        category: 'Résistance',
        tags: ['Insoumission', 'Résistance', 'Niger', 'Justice', 'Liberté', 'Ibrahim Yacoubou'],
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
        title: 'L\'esprit insoumis : résistance et détermination au Niger',
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
