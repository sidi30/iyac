import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoItem } from '../../models/media.model';
import { MediaService } from '../../services/media.service';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-player-container" *ngIf="videoItem">
      <div class="video-player">
        <!-- Lecteur vidéo -->
        <div class="video-wrapper" (click)="togglePlayPause()">
          <video #videoElement 
                 [src]="videoItem.fileUrl"
                 [poster]="videoItem.thumbnailUrl"
                 (loadedmetadata)="onLoadedMetadata()"
                 (timeupdate)="onTimeUpdate()"
                 (ended)="onEnded()"
                 (play)="onPlay()"
                 (pause)="onPause()"
                 (click)="togglePlayPause()">
          </video>
          
          <!-- Overlay de contrôle -->
          <div class="video-overlay" *ngIf="!isPlaying" (click)="togglePlayPause()">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>

          <!-- Contrôles vidéo -->
          <div class="video-controls" [class.show]="showControls">
            <div class="progress-container">
              <div class="progress-bar" (click)="seekTo($event)">
                <div class="progress-fill" [style.width.%]="progressPercentage"></div>
                <div class="progress-handle" [style.left.%]="progressPercentage"></div>
              </div>
            </div>

            <div class="control-row">
              <div class="left-controls">
                <button class="btn-control" (click)="togglePlayPause()">
                  <i class="fas" [class.fa-play]="!isPlaying" [class.fa-pause]="isPlaying"></i>
                </button>
                
                <div class="time-display">
                  {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}
                </div>
              </div>

              <div class="right-controls">
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

                <button class="btn-control" (click)="toggleFullscreen()">
                  <i class="fas fa-expand"></i>
                </button>

                <button class="btn-control" (click)="downloadVideo()" title="Télécharger">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations vidéo -->
        <div class="video-info">
          <h4 class="video-title"><strong>{{ videoItem.title }}</strong></h4>
          <p class="video-description">{{ videoItem.description }}</p>
          
          <div class="video-meta">
            <span class="duration">{{ formatDuration(duration) }}</span>
            <span class="resolution" *ngIf="videoItem.resolution">{{ videoItem.resolution }}</span>
            <span class="quality" *ngIf="videoItem.quality">{{ videoItem.quality }}</span>
            <span class="file-size" *ngIf="videoItem.size">{{ formatFileSize(videoItem.size) }}</span>
          </div>

          <div class="video-tags">
            <span class="tag" *ngFor="let tag of videoItem.tags">{{ tag }}</span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .video-player-container {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 20px;
      margin: 20px 0;
    }

    .video-player {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }

    video {
      width: 100%;
      height: auto;
      display: block;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .play-button {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: #007bff;
      transition: all 0.3s ease;
    }

    .play-button:hover {
      background: white;
      transform: scale(1.1);
    }

    .video-controls {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      padding: 20px 15px 15px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .video-controls.show {
      opacity: 1;
    }

    .video-wrapper:hover .video-controls {
      opacity: 1;
    }

    .progress-container {
      margin-bottom: 15px;
    }

    .progress-bar {
      position: relative;
      height: 6px;
      background: rgba(255,255,255,0.3);
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

    .control-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-controls, .right-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .btn-control {
      background: transparent;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .btn-control:hover {
      background: rgba(255,255,255,0.2);
    }

    .btn-control.muted {
      color: #ff6b6b;
    }

    .time-display {
      color: white;
      font-size: 14px;
      font-weight: 500;
    }

    .volume-container {
      display: flex;
      align-items: center;
    }

    .volume-slider {
      width: 80px;
      height: 4px;
      background: rgba(255,255,255,0.3);
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

    .video-info {
      padding: 0 10px;
    }

    .video-title {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.3;
    }

    .video-title strong {
      font-weight: 700;
      color: #1a252f;
    }

    .video-description {
      margin: 0 0 15px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .video-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      font-size: 12px;
      color: #888;
    }

    .video-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag {
      background: #e9ecef;
      color: #495057;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .live-transcription-section {
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
      margin-top: 20px;
    }

    .transcript-section h5 {
      margin: 0 0 15px 0;
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
      .video-player-container {
        padding: 15px;
        margin: 15px 0;
      }
      
      .video-title {
        font-size: 18px;
      }
      
      .video-description {
        font-size: 13px;
      }
      
      .play-button {
        width: 70px;
        height: 70px;
        font-size: 28px;
      }
    }

    @media (max-width: 992px) {
      .video-player-container {
        padding: 12px;
        margin: 12px 0;
      }
      
      .video-title {
        font-size: 16px;
      }
      
      .video-description {
        font-size: 12px;
      }
      
      .play-button {
        width: 60px;
        height: 60px;
        font-size: 24px;
      }
      
      .btn-control {
        width: 36px;
        height: 36px;
      }
      
      .volume-slider {
        width: 70px;
      }
      
      .time-display {
        font-size: 13px;
      }
    }

    @media (max-width: 768px) {
      .video-player-container {
        padding: 10px;
        margin: 10px 0;
        border-radius: 8px;
      }

      .video-title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 8px;
        color: #2c3e50;
      }
      
      .video-title strong {
        font-weight: 700;
        color: #1a252f;
      }

      .video-description {
        font-size: 11px;
        margin-bottom: 12px;
        line-height: 1.4;
      }

      .video-meta {
        flex-direction: column;
        gap: 5px;
        font-size: 11px;
        margin-bottom: 12px;
      }

      .play-button {
        width: 50px;
        height: 50px;
        font-size: 20px;
      }

      .control-row {
        flex-direction: column;
        gap: 10px;
      }

      .left-controls, .right-controls {
        justify-content: center;
        gap: 12px;
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
        font-size: 12px;
      }

      .video-controls {
        padding: 15px 10px 10px;
      }

      .progress-bar {
        height: 5px;
      }

      .progress-handle {
        width: 12px;
        height: 12px;
        top: -3px;
      }

      .video-info {
        padding: 0 5px;
      }

      .tag {
        font-size: 11px;
        padding: 3px 6px;
      }
    }

    @media (max-width: 576px) {
      .video-player-container {
        padding: 8px;
        margin: 8px 0;
      }

      .video-title {
        font-size: 14px;
      }

      .video-description {
        font-size: 10px;
        line-height: 1.3;
      }

      .video-meta {
        font-size: 10px;
        gap: 3px;
      }

      .play-button {
        width: 45px;
        height: 45px;
        font-size: 18px;
      }

      .left-controls, .right-controls {
        gap: 10px;
        flex-wrap: wrap;
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
        font-size: 11px;
      }

      .video-controls {
        padding: 12px 8px 8px;
      }

      .transcript-section {
        padding-top: 15px;
      }

      .transcript-section h5 {
        font-size: 14px;
        margin-bottom: 10px;
      }

      .transcript-content {
        padding: 12px;
        font-size: 12px;
      }

      .tag {
        font-size: 10px;
        padding: 2px 5px;
      }
    }

    @media (max-width: 400px) {
      .video-player-container {
        padding: 6px;
        margin: 6px 0;
      }

      .video-title {
        font-size: 13px;
      }

      .video-description {
        font-size: 9px;
      }

      .play-button {
        width: 40px;
        height: 40px;
        font-size: 16px;
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
        font-size: 10px;
      }

      .video-controls {
        padding: 10px 6px 6px;
      }

      .transcript-content {
        padding: 10px;
        font-size: 11px;
      }
    }

    /* Orientation landscape pour mobile */
    @media (max-width: 768px) and (orientation: landscape) {
      .video-player-container {
        padding: 8px;
        margin: 8px 0;
      }

      .video-title {
        font-size: 14px;
      }

      .video-description {
        font-size: 11px;
      }

      .control-row {
        flex-direction: row;
        gap: 5px;
      }

      .left-controls, .right-controls {
        gap: 8px;
      }

      .btn-control {
        width: 30px;
        height: 30px;
        font-size: 13px;
      }

      .volume-slider {
        width: 50px;
      }
    }
  `]
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @Input() videoItem!: VideoItem;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  currentTime = 0;
  duration = 0;
  isPlaying = false;
  volume = 1;
  isMuted = false;
  progressPercentage = 0;
  showControls = false;

  constructor(
    private mediaService: MediaService,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    if (this.videoItem) {
      // Restaurer la position de lecture sauvegardée
      const savedPosition = this.mediaService.getPlaybackPosition(this.videoItem.id);
      if (savedPosition > 0) {
        setTimeout(() => {
          if (this.videoElement) {
            this.videoElement.nativeElement.currentTime = savedPosition;
          }
        }, 100);
      }
    }
  }

  ngOnDestroy() {
    // Sauvegarder la position de lecture
    if (this.videoItem && this.currentTime > 0) {
      this.mediaService.savePlaybackPosition(this.videoItem.id, this.currentTime);
    }
  }

  onLoadedMetadata() {
    this.duration = this.videoElement.nativeElement.duration;
  }

  onTimeUpdate() {
    this.currentTime = this.videoElement.nativeElement.currentTime;
    this.progressPercentage = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  onPlay() {
    this.isPlaying = true;
    this.showControls = false;
  }

  onPause() {
    this.isPlaying = false;
    this.showControls = true;
  }

  onEnded() {
    this.isPlaying = false;
    this.currentTime = 0;
    this.progressPercentage = 0;
    this.showControls = true;
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.videoElement.nativeElement.pause();
      // Tracking de la pause
      this.googleAnalytics.trackMediaInteraction('pause', this.videoItem.id, 'video');
    } else {
      this.videoElement.nativeElement.play();
      // Tracking du démarrage de lecture
      this.googleAnalytics.trackMediaPlay(this.videoItem.id, this.videoItem.title, 'video');
      this.googleAnalytics.trackMediaInteraction('play', this.videoItem.id, 'video');
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.videoElement.nativeElement.muted = this.isMuted;
  }

  setVolume(event: Event) {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
    this.videoElement.nativeElement.volume = this.volume;
  }

  seekTo(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * this.duration;
    
    this.videoElement.nativeElement.currentTime = newTime;
  }

  toggleFullscreen() {
    if (this.videoElement.nativeElement.requestFullscreen) {
      this.videoElement.nativeElement.requestFullscreen();
    }
  }

  downloadVideo() {
    // Tracking du téléchargement
    this.googleAnalytics.trackDownload(this.videoItem.title, 'video');
    this.mediaService.downloadMedia(this.videoItem);
  }

  formatDuration(seconds: number): string {
    return this.mediaService.formatDuration(seconds);
  }

  formatFileSize(bytes: number): string {
    return this.mediaService.formatFileSize(bytes);
  }
}
