import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-debug-articles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="debug-container p-4">
      <h3>Debug Articles</h3>
      <div *ngIf="articles$ | async as articles">
        <p>Nombre d'articles chargés: {{ articles.length }}</p>
        <div *ngFor="let article of articles">
          <h5>{{ article.title }}</h5>
          <p>ID: {{ article.id }}</p>
          <p>Date: {{ article.publishDate | date:'dd/MM/yyyy' }}</p>
          <hr>
        </div>
      </div>
      <div *ngIf="(articles$ | async)?.length === 0">
        <p class="text-danger">Aucun article trouvé!</p>
      </div>
    </div>
  `,
  styles: [`
    .debug-container {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      margin: 20px;
    }
  `]
})
export class DebugArticlesComponent implements OnInit {
  articles$: Observable<Article[]>;

  constructor(private articleService: ArticleService) {
    this.articles$ = this.articleService.getArticles();
  }

  ngOnInit(): void {
    console.log('Debug Articles Component initialized');
    this.articles$.subscribe(articles => {
      console.log('Articles loaded:', articles);
    });
  }
}
