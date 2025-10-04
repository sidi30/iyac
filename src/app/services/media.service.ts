import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaItem, AudioItem, VideoItem, PlaybackState, MediaPlaylist } from '../models/media.model';
import { allMediaItems, allAudioItems, allVideoItems } from '../data/media/index';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private mediaItemsSubject = new BehaviorSubject<MediaItem[]>([]);
  private currentPlaybackSubject = new BehaviorSubject<PlaybackState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    volume: 1,
    playbackRate: 1,
    isMuted: false
  });
  private currentMediaSubject = new BehaviorSubject<MediaItem | null>(null);

  constructor() {
    this.loadInitialMedia();
  }

  private loadInitialMedia() {
    // Charger tous les médias depuis les fichiers individuels
    this.mediaItemsSubject.next(allMediaItems);
  }

  // Gestion des médias
  getMediaItems(): Observable<MediaItem[]> {
    return this.mediaItemsSubject.asObservable();
  }

  getMediaById(id: string): Observable<MediaItem | undefined> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.find(item => item.id === id)
    ).asObservable();
  }

  getAudioItems(): Observable<AudioItem[]> {
    return new BehaviorSubject<AudioItem[]>(allAudioItems).asObservable();
  }

  getVideoItems(): Observable<VideoItem[]> {
    return new BehaviorSubject<VideoItem[]>(allVideoItems).asObservable();
  }

  getFeaturedMedia(): Observable<MediaItem[]> {
    return new BehaviorSubject(
      allMediaItems.filter(item => item.isFeatured)
    ).asObservable();
  }

  getFeaturedAudio(): Observable<AudioItem[]> {
    return new BehaviorSubject(
      allAudioItems.filter(item => item.isFeatured)
    ).asObservable();
  }

  getFeaturedVideos(): Observable<VideoItem[]> {
    return new BehaviorSubject(
      allVideoItems.filter(item => item.isFeatured)
    ).asObservable();
  }

  getMediaByCategory(category: string): Observable<MediaItem[]> {
    return new BehaviorSubject(
      allMediaItems.filter(item => item.category === category)
    ).asObservable();
  }

  searchMedia(keyword: string): Observable<MediaItem[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      allMediaItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.author?.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).asObservable();
  }

  searchAudio(keyword: string): Observable<AudioItem[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      allAudioItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.author?.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).asObservable();
  }

  searchVideos(keyword: string): Observable<VideoItem[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      allVideoItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.author?.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    ).asObservable();
  }

  getAudioByCategory(category: string): Observable<AudioItem[]> {
    return new BehaviorSubject(
      allAudioItems.filter(item => item.category === category)
    ).asObservable();
  }

  getVideoByCategory(category: string): Observable<VideoItem[]> {
    return new BehaviorSubject(
      allVideoItems.filter(item => item.category === category)
    ).asObservable();
  }

  // Gestion de la lecture
  getCurrentMedia(): Observable<MediaItem | null> {
    return this.currentMediaSubject.asObservable();
  }

  getPlaybackState(): Observable<PlaybackState> {
    return this.currentPlaybackSubject.asObservable();
  }

  setCurrentMedia(media: MediaItem): void {
    this.currentMediaSubject.next(media);
  }

  updatePlaybackState(state: Partial<PlaybackState>): void {
    const currentState = this.currentPlaybackSubject.value;
    this.currentPlaybackSubject.next({ ...currentState, ...state });
  }

  // Fonctionnalités de téléchargement
  downloadMedia(media: MediaItem): void {
    if (media.downloadUrl) {
      const link = document.createElement('a');
      link.href = media.downloadUrl;
      link.download = `${media.title}.${media.type === 'audio' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Sauvegarde de la position de lecture
  savePlaybackPosition(mediaId: string, currentTime: number): void {
    localStorage.setItem(`playback_${mediaId}`, currentTime.toString());
  }

  getPlaybackPosition(mediaId: string): number {
    const saved = localStorage.getItem(`playback_${mediaId}`);
    return saved ? parseFloat(saved) : 0;
  }

  // Gestion des playlists
  createPlaylist(title: string, description: string, items: MediaItem[]): MediaPlaylist {
    const playlist: MediaPlaylist = {
      id: `playlist_${Date.now()}`,
      title,
      description,
      items,
      createdAt: new Date(),
      isPublic: true
    };
    return playlist;
  }

  // Formatage des durées
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  // Formatage des tailles de fichiers
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
