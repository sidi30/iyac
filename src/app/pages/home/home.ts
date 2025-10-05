import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ArticleCardComponent } from '../../components/article-card/article-card';
import { LeaderShowcaseComponent } from '../../components/leader-showcase/leader-showcase';
import { Article } from '../../models/article.model';
import { Observable } from 'rxjs';

interface MediaCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ArticleCardComponent, LeaderShowcaseComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  articles$: Observable<Article[]>;
  featuredArticles$: Observable<Article[]>;
  mediaCards: MediaCard[] = [
    {
      icon: 'fas fa-video',
      title: 'Vidéos',
      description: 'Reportages et interviews exclusives',
      link: '/videos',
      buttonText: 'Voir les vidéos'
    },
    {
      icon: 'fas fa-podcast',
      title: 'Podcasts',
      description: 'Débats et analyses audio',
      link: '/podcasts',
      buttonText: 'Écouter'
    },
    {
      icon: 'fas fa-file-pdf',
      title: 'Documents',
      description: 'Rapports et analyses détaillées',
      link: '/documents',
      buttonText: 'Consulter'
    }
  ];

  constructor(private articleService: ArticleService) {
    this.articles$ = this.articleService.getArticles();
    this.featuredArticles$ = this.articleService.getFeaturedArticles();
  }

  ngOnInit(): void {}
}
