import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranscriptionService, TranscriptionState, TranscriptionResult } from '../../services/transcription.service';

@Component({
  selector: 'app-transcription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transcription-container">
      <div class="transcription-header">
        <h5><i class="fas fa-microphone"></i> Transcription en Temps Réel</h5>
        <div class="transcription-controls">
          <select 
            [(ngModel)]="selectedLanguage" 
            (change)="onLanguageChange()"
            class="language-select"
            [disabled]="transcriptionState.isListening">
            <option *ngFor="let lang of supportedLanguages" [value]="lang">
              {{ getLanguageName(lang) }}
            </option>
          </select>
          
          <button 
            *ngIf="transcriptionState.isSupported && !transcriptionState.isListening"
            (click)="startTranscription()"
            class="btn btn-success btn-sm">
            <i class="fas fa-play"></i> Démarrer
          </button>
          
          <button 
            *ngIf="transcriptionState.isListening"
            (click)="stopTranscription()"
            class="btn btn-danger btn-sm">
            <i class="fas fa-stop"></i> Arrêter
          </button>
          
          <button 
            (click)="resetTranscription()"
            class="btn btn-secondary btn-sm">
            <i class="fas fa-refresh"></i> Réinitialiser
          </button>
        </div>
      </div>

      <div class="transcription-status" *ngIf="transcriptionState.error">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle"></i> {{ transcriptionState.error }}
        </div>
      </div>

      <div class="transcription-status" *ngIf="!transcriptionState.isSupported">
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-circle"></i> 
          La transcription vocale n'est pas supportée par votre navigateur.
          Veuillez utiliser Chrome, Edge ou Safari pour cette fonctionnalité.
        </div>
      </div>

      <div class="transcription-status" *ngIf="transcriptionState.isSupported && !transcriptionState.isListening && transcriptionState.results.length === 0">
        <div class="alert alert-info">
          <i class="fas fa-info-circle"></i> 
          Cliquez sur "Démarrer" pour commencer la transcription en temps réel.
        </div>
      </div>

      <div class="transcription-content" *ngIf="transcriptionState.results.length > 0">
        <div class="transcription-results">
          <div 
            *ngFor="let result of transcriptionState.results; let i = index"
            class="transcription-result"
            [class.final]="result.isFinal"
            [class.interim]="!result.isFinal">
            <span class="timestamp">[{{ formatTimestamp(result.timestamp) }}]</span>
            <span class="text">{{ result.text }}</span>
            <span class="confidence" *ngIf="result.confidence">
              ({{ (result.confidence * 100).toFixed(0) }}%)
            </span>
          </div>
        </div>

        <div class="transcription-actions">
          <button 
            (click)="copyTranscription()"
            class="btn btn-outline-primary btn-sm">
            <i class="fas fa-copy"></i> Copier
          </button>
          
          <button 
            (click)="downloadTranscription('txt')"
            class="btn btn-outline-success btn-sm">
            <i class="fas fa-download"></i> Télécharger TXT
          </button>
          
          <button 
            (click)="downloadTranscription('srt')"
            class="btn btn-outline-info btn-sm">
            <i class="fas fa-download"></i> Télécharger SRT
          </button>
          
          <button 
            (click)="downloadTranscription('vtt')"
            class="btn btn-outline-warning btn-sm">
            <i class="fas fa-download"></i> Télécharger VTT
          </button>
        </div>
      </div>

      <div class="transcription-live" *ngIf="transcriptionState.isListening">
        <div class="live-indicator">
          <div class="pulse"></div>
          <span>Transcription en cours...</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transcription-container {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .transcription-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .transcription-header h5 {
      margin: 0;
      color: #495057;
      font-weight: 600;
    }

    .transcription-header h5 i {
      color: #28a745;
      margin-right: 8px;
    }

    .transcription-controls {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .language-select {
      padding: 6px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: white;
      font-size: 14px;
    }

    .transcription-status {
      margin-bottom: 20px;
    }

    .transcription-content {
      background: white;
      border-radius: 6px;
      padding: 15px;
      border: 1px solid #e9ecef;
    }

    .transcription-results {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 15px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .transcription-result {
      display: block;
      margin-bottom: 8px;
      padding: 8px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.4;
    }

    .transcription-result.final {
      background: #d4edda;
      border-left: 4px solid #28a745;
    }

    .transcription-result.interim {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      font-style: italic;
    }

    .timestamp {
      font-weight: bold;
      color: #6c757d;
      margin-right: 8px;
    }

    .text {
      color: #495057;
    }

    .confidence {
      font-size: 12px;
      color: #6c757d;
      margin-left: 8px;
    }

    .transcription-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .transcription-live {
      text-align: center;
      padding: 20px;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #28a745;
      font-weight: 500;
    }

    .pulse {
      width: 12px;
      height: 12px;
      background: #28a745;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(40, 167, 69, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .transcription-container {
        padding: 15px;
        margin: 15px 0;
      }

      .transcription-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }

      .transcription-controls {
        width: 100%;
        justify-content: flex-start;
      }

      .transcription-actions {
        justify-content: center;
      }

      .transcription-results {
        max-height: 200px;
      }

      .transcription-result {
        font-size: 13px;
      }
    }

    @media (max-width: 576px) {
      .transcription-container {
        padding: 12px;
        margin: 12px 0;
      }

      .transcription-controls {
        flex-direction: column;
        gap: 8px;
      }

      .transcription-actions {
        flex-direction: column;
      }

      .transcription-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class TranscriptionComponent implements OnInit, OnDestroy {
  @Input() mediaTitle: string = 'Média';
  
  transcriptionState: TranscriptionState = {
    isListening: false,
    isSupported: false,
    language: 'fr-FR',
    results: []
  };
  
  selectedLanguage: string = 'fr-FR';
  supportedLanguages: string[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private transcriptionService: TranscriptionService) {}

  ngOnInit(): void {
    this.supportedLanguages = this.transcriptionService.getSupportedLanguages();
    
    this.subscription.add(
      this.transcriptionService.getTranscriptionState().subscribe(state => {
        this.transcriptionState = state;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.transcriptionService.stopTranscription();
  }

  startTranscription(): void {
    this.transcriptionService.startTranscription(this.selectedLanguage);
  }

  stopTranscription(): void {
    this.transcriptionService.stopTranscription();
  }

  resetTranscription(): void {
    this.transcriptionService.resetTranscription();
  }

  onLanguageChange(): void {
    this.transcriptionService.setLanguage(this.selectedLanguage);
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  getLanguageName(langCode: string): string {
    const languageNames: { [key: string]: string } = {
      'fr-FR': 'Français',
      'en-US': 'Anglais (États-Unis)',
      'en-GB': 'Anglais (Royaume-Uni)',
      'es-ES': 'Espagnol',
      'de-DE': 'Allemand',
      'it-IT': 'Italien',
      'pt-PT': 'Portugais',
      'ar-SA': 'Arabe',
      'zh-CN': 'Chinois',
      'ja-JP': 'Japonais',
      'ko-KR': 'Coréen',
      'ru-RU': 'Russe',
      'hi-IN': 'Hindi',
      'th-TH': 'Thaï',
      'vi-VN': 'Vietnamien',
      'nl-NL': 'Néerlandais',
      'sv-SE': 'Suédois',
      'no-NO': 'Norvégien',
      'da-DK': 'Danois',
      'fi-FI': 'Finnois',
      'pl-PL': 'Polonais',
      'tr-TR': 'Turc',
      'he-IL': 'Hébreu',
      'cs-CZ': 'Tchèque',
      'sk-SK': 'Slovaque',
      'hu-HU': 'Hongrois',
      'ro-RO': 'Roumain',
      'bg-BG': 'Bulgare',
      'hr-HR': 'Croate',
      'sr-RS': 'Serbe',
      'sl-SI': 'Slovène',
      'et-EE': 'Estonien',
      'lv-LV': 'Letton',
      'lt-LT': 'Lituanien',
      'uk-UA': 'Ukrainien',
      'be-BY': 'Biélorusse',
      'mk-MK': 'Macédonien',
      'sq-AL': 'Albanais',
      'mt-MT': 'Maltais',
      'is-IS': 'Islandais',
      'ga-IE': 'Irlandais',
      'cy-GB': 'Gallois',
      'eu-ES': 'Basque',
      'ca-ES': 'Catalan',
      'gl-ES': 'Galicien',
      'af-ZA': 'Afrikaans',
      'sw-KE': 'Swahili',
      'am-ET': 'Amharique',
      'ha-NG': 'Haoussa',
      'ig-NG': 'Igbo',
      'yo-NG': 'Yoruba',
      'zu-ZA': 'Zoulou',
      'xh-ZA': 'Xhosa',
      'st-ZA': 'Sotho',
      'tn-ZA': 'Tswana',
      'ss-ZA': 'Swati',
      'nr-ZA': 'Ndebele',
      've-ZA': 'Venda',
      'ts-ZA': 'Tsonga',
      'nso-ZA': 'Pedi'
    };
    
    return languageNames[langCode] || langCode;
  }

  copyTranscription(): void {
    const text = this.transcriptionService.getFinalTranscription();
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        // Optionnel: afficher une notification de succès
        console.log('Transcription copiée dans le presse-papiers');
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
    }
  }

  downloadTranscription(format: 'txt' | 'srt' | 'vtt'): void {
    const content = this.transcriptionService.exportTranscription(format);
    const filename = `${this.mediaTitle.replace(/[^a-zA-Z0-9]/g, '_')}_transcription.${format}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
