import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-card.html',
  styleUrls: ['./article-card.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: Article;
  @Input() isHorizontal = false;
  @Input() showFullContent = false;

  // Image par défaut déterminée une seule fois
  defaultImage: string = '';

  // Images par défaut d'IYAC
  private defaultImages = [
    '/iyac.jpg',
    '/iyac2.jpg',
    '/iyac3.jpg'
  ];

  ngOnInit(): void {
    // Détermine l'image par défaut une seule fois lors de l'initialisation
    const randomIndex = Math.floor(Math.random() * this.defaultImages.length);
    this.defaultImage = this.defaultImages[randomIndex];
  }

  getDefaultImage(): string {
    // Retourne l'image par défaut déterminée lors de l'initialisation
    return this.defaultImage;
  }

  isLeaderArticle(): boolean {
    // Vérifie si l'article concerne le leader IYAC
    const leaderKeywords = ['iyac', 'ibrahim', 'yacouba', 'leader', 'président'];
    const title = this.article.title.toLowerCase();
    const content = this.article.content.toLowerCase();
    const author = this.article.author.toLowerCase();
    
    return leaderKeywords.some(keyword => 
      title.includes(keyword) || 
      content.includes(keyword) || 
      author.includes(keyword)
    );
  }
}
