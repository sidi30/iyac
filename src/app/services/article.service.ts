import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Article, BreakingNews } from '../models/article.model';
import { allArticles } from '../data/articles/index';

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
    // Chargement des articles depuis les fichiers modulaires
    const articles: Article[] = [...allArticles];

    // Configuration des actualités urgentes basées sur les articles
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

  /**
   * Ajoute un nouvel article à la liste
   * @param article L'article à ajouter
   */
  addArticle(article: Article): void {
    const currentArticles = this.articlesSubject.value;
    const updatedArticles = [article, ...currentArticles]; // Nouvel article en premier
    this.articlesSubject.next(updatedArticles);
  }

  /**
   * Met à jour un article existant
   * @param articleId L'ID de l'article à mettre à jour
   * @param updatedArticle L'article mis à jour
   */
  updateArticle(articleId: string, updatedArticle: Article): void {
    const currentArticles = this.articlesSubject.value;
    const updatedArticles = currentArticles.map(article => 
      article.id === articleId ? updatedArticle : article
    );
    this.articlesSubject.next(updatedArticles);
  }

  /**
   * Supprime un article
   * @param articleId L'ID de l'article à supprimer
   */
  removeArticle(articleId: string): void {
    const currentArticles = this.articlesSubject.value;
    const updatedArticles = currentArticles.filter(article => article.id !== articleId);
    this.articlesSubject.next(updatedArticles);
  }

  /**
   * Obtient tous les articles
   */
  getArticles(): Observable<Article[]> {
    return this.articlesSubject.asObservable();
  }

  /**
   * Obtient les actualités urgentes
   */
  getBreakingNews(): Observable<BreakingNews[]> {
    return this.breakingNewsSubject.asObservable();
  }

  /**
   * Obtient un article par son ID
   * @param id L'ID de l'article
   */
  getArticleById(id: string): Observable<Article | undefined> {
    return new BehaviorSubject(
      this.articlesSubject.value.find(article => article.id === id)
    ).asObservable();
  }

  /**
   * Obtient les articles mis en avant
   */
  getFeaturedArticles(): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => article.isHighlighted)
    ).asObservable();
  }

  /**
   * Obtient les articles par catégorie
   * @param category La catégorie des articles
   */
  getArticlesByCategory(category: string): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => article.category === category)
    ).asObservable();
  }

  /**
   * Obtient les articles urgents (breaking news)
   */
  getBreakingArticles(): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => article.isBreaking)
    ).asObservable();
  }

  /**
   * Recherche des articles par mot-clé
   * @param keyword Le mot-clé de recherche
   */
  searchArticles(keyword: string): Observable<Article[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      this.articlesSubject.value.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.author.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).asObservable();
  }

  /**
   * Obtient les articles récents (derniers N articles)
   * @param limit Nombre d'articles à retourner
   */
  getRecentArticles(limit: number = 5): Observable<Article[]> {
    return new BehaviorSubject(
      this.articlesSubject.value
        .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
        .slice(0, limit)
    ).asObservable();
  }
}