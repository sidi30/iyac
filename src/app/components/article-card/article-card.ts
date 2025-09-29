import { Component, Input } from '@angular/core';
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
export class ArticleCardComponent {
  @Input() article!: Article;
  @Input() isHorizontal = false;
  @Input() showFullContent = false;

  // Images par défaut d'IYAC
  private defaultImages = [
    '/iyac.jpg',
    '/iyac2.jpg',
    '/iyac3.jpg'
  ];

  getDefaultImage(): string {
    // Retourne une image aléatoire d'IYAC si pas d'image spécifique
    const randomIndex = Math.floor(Math.random() * this.defaultImages.length);
    return this.defaultImages[randomIndex];
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
