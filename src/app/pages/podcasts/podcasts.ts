import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioItem } from '../../models/media.model';
import { MediaService } from '../../services/media.service';
import { AudioPlayerComponent } from '../../components/audio-player/audio-player';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-podcasts',
  standalone: true,
  imports: [CommonModule, FormsModule, AudioPlayerComponent],
  template: `
    <div class="container py-5">
      <div class="row">
        <div class="col-12 text-center mb-5">
          <h2 class="display-4 journal-title">Podcasts</h2>
          <p class="lead text-muted">Interviews et analyses audio sur les actualités du Niger</p>
        </div>
      </div>

      <!-- Barre de recherche -->
      <div class="row mb-4">
        <div class="col-md-6 mx-auto">
          <div class="input-group">
            <input type="text" 
                   class="form-control" 
                   placeholder="Rechercher un podcast..."
                   [(ngModel)]="searchTerm"
                   (input)="onSearch()">
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="filter-buttons">
            <button class="btn btn-outline-primary me-2 mb-2" 
                    [class.active]="selectedCategory === ''"
                    (click)="filterByCategory('')">
              Tous
            </button>
            <button class="btn btn-outline-primary me-2 mb-2" 
                    *ngFor="let category of categories"
                    [class.active]="selectedCategory === category"
                    (click)="filterByCategory(category)">
              {{ category }}
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des podcasts -->
      <div class="row" *ngIf="audioItems$ | async as audioItems">
        <div class="col-12" *ngIf="audioItems.length === 0">
          <div class="text-center py-5">
            <i class="fas fa-podcast fa-3x text-muted mb-3"></i>
            <h4>Aucun podcast trouvé</h4>
            <p class="text-muted">Essayez de modifier vos critères de recherche.</p>
          </div>
        </div>

        <div class="col-12" *ngFor="let audioItem of audioItems">
          <app-audio-player [audioItem]="audioItem"></app-audio-player>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .journal-title {
      color: #2c3e50;
      font-weight: 700;
    }

    .filter-buttons .btn.active {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }

    .input-group {
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border-radius: 25px;
      overflow: hidden;
    }

    .input-group .form-control {
      border: none;
      padding: 12px 20px;
    }

    .input-group .btn {
      border: none;
      padding: 12px 20px;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    /* Responsive Design - Mobile First */
    @media (max-width: 1200px) {
      .container {
        padding: 0 15px;
      }
      
      .journal-title {
        font-size: 2.5rem;
      }
      
      .lead {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 992px) {
      .journal-title {
        font-size: 2.2rem;
      }
      
      .lead {
        font-size: 1rem;
      }
      
      .input-group {
        border-radius: 20px;
      }
      
      .input-group .form-control {
        padding: 10px 18px;
        font-size: 14px;
      }
      
      .input-group .btn {
        padding: 10px 18px;
      }
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 10px;
      }
      
      .journal-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }
      
      .lead {
        font-size: 0.9rem;
        margin-bottom: 2rem;
      }
      
      .input-group {
        border-radius: 15px;
        margin-bottom: 1rem;
      }
      
      .input-group .form-control {
        padding: 8px 15px;
        font-size: 13px;
      }
      
      .input-group .btn {
        padding: 8px 15px;
        font-size: 14px;
      }
      
      .filter-buttons {
        justify-content: center;
        gap: 6px;
      }
      
      .filter-buttons .btn {
        font-size: 12px;
        padding: 6px 12px;
        margin-bottom: 8px;
      }
    }

    @media (max-width: 576px) {
      .container {
        padding: 0 8px;
      }
      
      .journal-title {
        font-size: 1.5rem;
        margin-bottom: 0.8rem;
      }
      
      .lead {
        font-size: 0.8rem;
        margin-bottom: 1.5rem;
      }
      
      .input-group {
        border-radius: 12px;
        margin-bottom: 0.8rem;
      }
      
      .input-group .form-control {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .input-group .btn {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .filter-buttons {
        gap: 4px;
      }
      
      .filter-buttons .btn {
        font-size: 11px;
        padding: 5px 10px;
        margin-bottom: 6px;
      }
    }

    @media (max-width: 400px) {
      .container {
        padding: 0 5px;
      }
      
      .journal-title {
        font-size: 1.3rem;
      }
      
      .lead {
        font-size: 0.75rem;
      }
      
      .input-group .form-control {
        padding: 5px 10px;
        font-size: 11px;
      }
      
      .input-group .btn {
        padding: 5px 10px;
        font-size: 11px;
      }
      
      .filter-buttons .btn {
        font-size: 10px;
        padding: 4px 8px;
      }
    }
  `]
})
export class PodcastsComponent implements OnInit {
  audioItems$: Observable<AudioItem[]>;
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(private mediaService: MediaService) {
    this.audioItems$ = this.mediaService.getAudioItems();
  }

  ngOnInit() {
    // Charger les catégories disponibles
    this.mediaService.getAudioItems().subscribe(audioItems => {
      this.categories = [...new Set(audioItems.map(item => item.category))];
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.audioItems$ = this.mediaService.searchAudio(this.searchTerm);
    } else {
      this.audioItems$ = this.mediaService.getAudioItems();
    }
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category) {
      this.audioItems$ = this.mediaService.getAudioByCategory(category);
    } else {
      this.audioItems$ = this.mediaService.getAudioItems();
    }
  }
}
