import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { BreakingNews } from '../../models/article.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breaking-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breaking-news.html',
  styleUrls: ['./breaking-news.scss']
})
export class BreakingNewsComponent implements OnInit {
  breakingNews$: Observable<BreakingNews[]>;

  constructor(private articleService: ArticleService) {
    this.breakingNews$ = this.articleService.getBreakingNews();
  }

  ngOnInit(): void {}
}
