import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <h2 class="display-4 journal-title">Vidéos</h2>
          <p class="lead text-muted">Reportages et interviews exclusives</p>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-center py-5">
          <i class="fas fa-video fa-5x text-primary mb-4"></i>
          <h4>Section en développement</h4>
          <p class="text-muted">Les vidéos seront bientôt disponibles. Restez connectés !</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VideosComponent {}
