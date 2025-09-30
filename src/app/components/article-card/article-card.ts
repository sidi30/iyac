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

  // Image par défaut fixe - toujours la même pour tous les composants
  private static readonly DEFAULT_IMAGE = './assets/iyac.jpg';

  ngOnInit(): void {
    // Pas besoin de logique complexe, on utilise toujours la même image
  }

  getDefaultImage(): string {
    // Utilise l'ID de l'article pour déterminer quelle image utiliser
    // Cela garantit que chaque article aura toujours la même image
    const images = ['./assets/iyac.jpg', './assets/iyac2.jpg', './assets/iyac3.jpg'];
    
    if (this.article.id && typeof this.article.id === 'number') {
      // Utilise l'ID de l'article pour sélectionner l'image de manière déterministe
      const index = this.article.id % images.length;
      return images[index];
    }
    
    // Fallback vers l'image principale si pas d'ID ou ID non numérique
    return ArticleCardComponent.DEFAULT_IMAGE;
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
