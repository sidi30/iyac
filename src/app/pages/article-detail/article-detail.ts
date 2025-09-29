import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.html',
  styleUrls: ['./article-detail.scss']
})
export class ArticleDetailComponent implements OnInit {
  article$: Observable<Article | undefined>;
  relatedArticles$: Observable<Article[]>;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {
    this.article$ = new Observable();
    this.relatedArticles$ = this.articleService.getArticles();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const articleId = params['id'];
      this.article$ = this.articleService.getArticleById(articleId);
    });
  }

  shareArticle(platform: string, article: Article) {
    const url = window.location.href;
    const title = article.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
    }
  }

  printArticle() {
    window.print();
  }
}
