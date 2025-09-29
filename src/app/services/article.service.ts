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
        id: '1',
        title: 'Comité Justice et Liberté / Voix Unies pour Ibrahim Yacoubou',
        content: `Citoyennes, Citoyens, Amis du Niger,

Cela fait aujourd'hui deux semaines que notre compatriote Ibrahim Yacouba, IYAC, a été arrêté sur la base d'un dossier fictif concocté pour l'emprisonner et salir sa réputation.

Malgré toutes les preuves de sa non implication, il demeure encore détenu à Ouallam, où il avait déjà passé injustement 452 jours de détention.

Cela fait également deux semaines que nous sommes pleinement mobilisés pour que notre compatriote recouvre sa liberté.

Par la grâce de Dieu, par la justesse de cette cause, nous sommes chaque jour plus nombreux.

Notre mobilisation n'est ni politique, ni politicienne. Elle est citoyenne et transcende toute considération.

Nous ne mettons en cause personne et nous n'indexons personne dans cette affaire.

Nous voudrions surtout exprimer ici notre profonde gratitude à celles et ceux qui se tiennent à nos côtés. Votre soutien indéfectible est la preuve que la vérité ne peut être étouffée et que la justice ne peut être confisquée.

Nous rendons grâce à ALLAH, le Seigneur de l'univers, qui chaque jour fait progresser notre cause.

Ce n'est pas seulement IYAC qui est emprisonné à tort, c'est notre pacte social que l'on veut compromettre.

Cet acharnement contre un leader politique connu pour son intégrité et son attachement à la patrie est une insupportable injustice.

Nous avons foi en Dieu et à sa promesse d'établir la vérité, quelque soit le temps que ça prendra. Ya Allah soit notre Garant et notre Bouclier contre l'injustice. Amen

Libérez IYAC. Défendons notre avenir.

Fait à Niamey, le 27 septembre 2025
Dr Djibril Oumarou`,
        excerpt: 'Cela fait aujourd\'hui deux semaines que notre compatriote Ibrahim Yacouba, IYAC, a été arrêté sur la base d\'un dossier fictif concocté pour l\'emprisonner et salir sa réputation.',
        author: 'Dr Djibril Oumarou',
        publishDate: new Date('2025-09-27'),
        category: 'Justice',
        tags: ['Justice', 'Liberté', 'Niger', 'Ibrahim Yacoubou'],
        isBreaking: true,
        readTime: 3,
        isHighlighted: true
      }
    ];

    const breakingNews: BreakingNews[] = [
      {
        id: '1',
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
