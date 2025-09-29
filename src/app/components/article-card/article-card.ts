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
}
