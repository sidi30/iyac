import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioItem, PlaybackState } from '../../models/media.model';
import { MediaService } from '../../services/media.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audio-player-container" *ngIf="audioItem">
      <div class="audio-player">
        <!-- Informations audio -->
        <div class="audio-info">
          <div class="audio-thumbnail">
            <img [src]="audioItem.thumbnailUrl || 'assets/iyac.jpg'" [alt]="audioItem.title" class="thumbnail-img">
            <div class="play-overlay" *ngIf="!isPlaying">
              <i class="fas fa-play"></i>
            </div>
          </div>
          <div class="audio-details">
            <h4 class="audio-title"><strong>{{ audioItem.title }}</strong></h4>
            <p class="audio-description">{{ audioItem.description }}</p>
            <div class="audio-meta">
              <span class="duration">{{ formatDuration(duration) }}</span>
              <span class="file-size" *ngIf="audioItem.size">{{ formatFileSize(audioItem.size) }}</span>
            </div>
          </div>
        </div>

        <!-- Contrôles de lecture -->
        <div class="audio-controls">
          <div class="progress-container">
            <div class="progress-bar" (click)="seekTo($event)">
              <div class="progress-fill" [style.width.%]="progressPercentage"></div>
              <div class="progress-handle" [style.left.%]="progressPercentage"></div>
            </div>
            <div class="time-display">
              <span class="current-time">{{ formatDuration(currentTime) }}</span>
              <span class="total-time">{{ formatDuration(duration) }}</span>
            </div>
          </div>

          <div class="control-buttons">
            <button class="btn-control" (click)="togglePlayPause()" [class.playing]="isPlaying">
              <i class="fas" [class.fa-play]="!isPlaying" [class.fa-pause]="isPlaying"></i>
            </button>
            
            <button class="btn-control" (click)="toggleMute()" [class.muted]="isMuted">
              <i class="fas" [class.fa-volume-up]="!isMuted" [class.fa-volume-mute]="isMuted"></i>
            </button>
            
            <div class="volume-container">
              <input type="range" 
                     class="volume-slider" 
                     min="0" 
                     max="1" 
                     step="0.1" 
                     [value]="volume"
                     (input)="setVolume($event)">
            </div>

            <button class="btn-control" (click)="downloadAudio()" title="Télécharger">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>

      </div>

      <!-- Élément audio caché -->
      <audio #audioElement 
             [src]="audioItem.fileUrl"
             (loadedmetadata)="onLoadedMetadata()"
             (timeupdate)="onTimeUpdate()"
             (ended)="onEnded()"
             (play)="onPlay()"
             (pause)="onPause()">
      </audio>
    </div>
  `,
  styles: [`
    .audio-player-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 20px;
      margin: 20px 0;
    }

    .audio-player {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .audio-info {
      display: flex;
      gap: 15px;
      align-items: flex-start;
    }

    .audio-thumbnail {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .thumbnail-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .play-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .audio-details {
      flex: 1;
    }

    .audio-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.3;
    }

    .audio-title strong {
      font-weight: 700;
      color: #1a252f;
    }

    .audio-description {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .audio-meta {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: #888;
    }

    .audio-controls {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .progress-bar {
      position: relative;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      cursor: pointer;
    }

    .progress-fill {
      height: 100%;
      background: #007bff;
      border-radius: 3px;
      transition: width 0.1s ease;
    }

    .progress-handle {
      position: absolute;
      top: -4px;
      width: 14px;
      height: 14px;
      background: #007bff;
      border-radius: 50%;
      transform: translateX(-50%);
      transition: left 0.1s ease;
    }

    .time-display {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
    }

    .control-buttons {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .btn-control {
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-control:hover {
      background: #0056b3;
      transform: scale(1.05);
    }

    .btn-control.playing {
      background: #28a745;
    }

    .btn-control.muted {
      background: #dc3545;
    }

    .volume-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-slider {
      width: 80px;
      height: 4px;
      background: #e0e0e0;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
    }

    .live-transcription-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
      margin-top: 15px;
    }

    .transcript-section h5 {
      margin: 0 0 10px 0;
      font-size: 16px;
      color: #333;
    }

    .transcript-content {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      color: #555;
    }

    /* Responsive Design - Mobile First */
    @media (max-width: 1200px) {
      .audio-player-container {
        padding: 15px;
        margin: 15px 0;
      }
      
      .audio-title {
        font-size: 16px;
      }
      
      .audio-description {
        font-size: 13px;
      }
    }

    @media (max-width: 992px) {
      .audio-player-container {
        padding: 12px;
        margin: 12px 0;
      }
      
      .audio-info {
        gap: 12px;
      }
      
      .audio-thumbnail {
        width: 70px;
        height: 70px;
      }
      
      .control-buttons {
        gap: 12px;
      }
      
      .btn-control {
        width: 36px;
        height: 36px;
      }
      
      .volume-slider {
        width: 70px;
      }
    }

    @media (max-width: 768px) {
      .audio-player-container {
        padding: 10px;
        margin: 10px 0;
        border-radius: 8px;
      }

      .audio-info {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }

      .audio-thumbnail {
        align-self: center;
        width: 60px;
        height: 60px;
      }

      .audio-title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 6px;
        color: #2c3e50;
      }
      
      .audio-title strong {
        font-weight: 700;
        color: #1a252f;
      }

      .audio-description {
        font-size: 12px;
        margin-bottom: 8px;
      }

      .audio-meta {
        justify-content: center;
        gap: 10px;
        font-size: 11px;
      }

      .control-buttons {
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .btn-control {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }

      .volume-slider {
        width: 60px;
        height: 3px;
      }

      .time-display {
        font-size: 11px;
      }

      .progress-bar {
        height: 5px;
      }

      .progress-handle {
        width: 12px;
        height: 12px;
        top: -3px;
      }
    }

    @media (max-width: 576px) {
      .audio-player-container {
        padding: 8px;
        margin: 8px 0;
      }

      .audio-thumbnail {
        width: 50px;
        height: 50px;
      }

      .audio-title {
        font-size: 14px;
      }

      .audio-description {
        font-size: 11px;
        line-height: 1.3;
      }

      .audio-meta {
        flex-direction: column;
        gap: 5px;
        font-size: 10px;
      }

      .control-buttons {
        gap: 8px;
      }

      .btn-control {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }

      .volume-slider {
        width: 50px;
      }

      .time-display {
        font-size: 10px;
      }

      .transcript-section {
        padding-top: 10px;
      }

      .transcript-section h5 {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .transcript-content {
        padding: 10px;
        font-size: 12px;
      }
    }

    @media (max-width: 400px) {
      .audio-player-container {
        padding: 6px;
        margin: 6px 0;
      }

      .audio-thumbnail {
        width: 45px;
        height: 45px;
      }

      .audio-title {
        font-size: 13px;
      }

      .audio-description {
        font-size: 10px;
      }

      .btn-control {
        width: 26px;
        height: 26px;
        font-size: 11px;
      }

      .volume-slider {
        width: 40px;
      }

      .time-display {
        font-size: 9px;
      }
    }
  `]
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() audioItem!: AudioItem;
  @ViewChild('audioElement') audioElement!: ElementRef<HTMLAudioElement>;

  currentTime = 0;
  duration = 0;
  isPlaying = false;
  volume = 1;
  isMuted = false;
  progressPercentage = 0;

  constructor(
    private mediaService: MediaService,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    if (this.audioItem) {
      // Restaurer la position de lecture sauvegardée
      const savedPosition = this.mediaService.getPlaybackPosition(this.audioItem.id);
      if (savedPosition > 0) {
        setTimeout(() => {
          if (this.audioElement) {
            this.audioElement.nativeElement.currentTime = savedPosition;
          }
        }, 100);
      }
    }
  }

  ngOnDestroy() {
    // Sauvegarder la position de lecture
    if (this.audioItem && this.currentTime > 0) {
      this.mediaService.savePlaybackPosition(this.audioItem.id, this.currentTime);
    }
  }

  onLoadedMetadata() {
    this.duration = this.audioElement.nativeElement.duration;
  }

  onTimeUpdate() {
    this.currentTime = this.audioElement.nativeElement.currentTime;
    this.progressPercentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  onPlay() {
    this.isPlaying = true;
  }

  onPause() {
    this.isPlaying = false;
  }

  onEnded() {
    this.isPlaying = false;
    this.currentTime = 0;
    this.progressPercentage = 0;
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.audioElement.nativeElement.pause();
      // Tracking de la pause
        this.googleAnalytics.trackMediaInteraction(this.audioItem.id, 'pause');
    } else {
      this.audioElement.nativeElement.play();
      // Tracking du démarrage de lecture
      this.googleAnalytics.trackMediaPlay(this.audioItem.id, 'audio');
      this.googleAnalytics.trackMediaInteraction(this.audioItem.id, 'play');
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.nativeElement.muted = this.isMuted;
  }

  setVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
    this.audioElement.nativeElement.volume = this.volume;
  }

  seekTo(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * this.duration;
    
    this.audioElement.nativeElement.currentTime = newTime;
  }

  downloadAudio() {
    // Tracking du téléchargement
    this.googleAnalytics.trackDownload(this.audioItem.title, 'audio');
    this.mediaService.downloadMedia(this.audioItem);
  }

  formatDuration(seconds: number): string {
    return this.mediaService.formatDuration(seconds);
  }

  formatFileSize(bytes: number): string {
    return this.mediaService.formatFileSize(bytes);
  }
}
