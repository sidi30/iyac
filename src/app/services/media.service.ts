import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaItem, AudioItem, VideoItem, PlaybackState, MediaPlaylist } from '../models/media.model';

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
    const mediaItems: MediaItem[] = [
      {
        id: 'audio-001',
        title: 'Interview Audio - Honorable Kabirou Ibrahim',
        description: 'Interview exclusive avec l\'honorable Kabirou Ibrahim sur la détention injuste de son frère Ibrahim Yacoubou (IYAC) et la situation politique au Niger.',
        type: 'audio',
        fileUrl: 'assets/interview1.mp3',
        duration: 1800, // 30 minutes estimées
        publishDate: new Date('2025-09-30'),
        author: 'Équipe Liberté IYAC',
        category: 'Interview',
        tags: ['Interview', 'Kabirou Ibrahim', 'Ibrahim Yacoubou', 'IYAC', 'Détention', 'Niger', 'Démocratie'],
        isFeatured: true,
        downloadUrl: 'assets/interview1.mp3',
        size: 15 * 1024 * 1024, // 15 MB estimé
        transcript: `
[00:00] Introduction - Présentation de l'interview avec l'honorable Kabirou Ibrahim
[01:30] Question sur la détention d'Ibrahim Yacoubou (IYAC)
[03:45] Réponse de Kabirou Ibrahim sur l'injustice
[06:20] Discussion sur la situation politique au Niger
[09:15] Appel à la solidarité internationale
[12:00] Conclusion et message d'espoir
        `.trim()
      } as AudioItem,
      {
        id: 'video-001',
        title: 'Interview Vidéo - Honorable Kabirou Ibrahim',
        description: 'Interview vidéo complète avec l\'honorable Kabirou Ibrahim, frère d\'Ibrahim Yacoubou (IYAC), sur la détention injuste et les défis démocratiques au Niger.',
        type: 'video',
        fileUrl: 'assets/videos/interviewVideo.mp4',
        thumbnailUrl: 'assets/iyac.jpg',
        duration: 2400, // 40 minutes estimées
        publishDate: new Date('2025-10-01'),
        author: 'Équipe Liberté IYAC',
        category: 'Interview',
        tags: ['Interview', 'Kabirou Ibrahim', 'Ibrahim Yacoubou', 'IYAC', 'Détention', 'Vidéo', 'Niger'],
        isFeatured: true,
        downloadUrl: 'assets/videos/interviewVideo.mp4',
        size: 50 * 1024 * 1024, // 50 MB estimé
        resolution: '1920x1080',
        quality: 'HD',
        transcript: `
[00:00] Introduction - Présentation de l'interview vidéo avec l'honorable Kabirou Ibrahim
[02:15] Question sur la détention injuste d'Ibrahim Yacoubou (IYAC)
[05:30] Réponse détaillée de Kabirou Ibrahim sur l'injustice
[08:45] Discussion sur les défis démocratiques au Niger
[12:20] Appel à la mobilisation internationale
[15:00] Message de solidarité et d'espoir
[18:30] Conclusion et remerciements
        `.trim()
      } as VideoItem
    ];

    this.mediaItemsSubject.next(mediaItems);
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
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.type === 'audio') as AudioItem[]
    ).asObservable();
  }

  getVideoItems(): Observable<VideoItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.type === 'video') as VideoItem[]
    ).asObservable();
  }

  getFeaturedMedia(): Observable<MediaItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.isFeatured)
    ).asObservable();
  }

  getFeaturedAudio(): Observable<AudioItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.isFeatured && item.type === 'audio') as AudioItem[]
    ).asObservable();
  }

  getFeaturedVideos(): Observable<VideoItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.isFeatured && item.type === 'video') as VideoItem[]
    ).asObservable();
  }

  getMediaByCategory(category: string): Observable<MediaItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.category === category)
    ).asObservable();
  }

  searchMedia(keyword: string): Observable<MediaItem[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => 
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
      this.mediaItemsSubject.value.filter(item => 
        item.type === 'audio' && (
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.author?.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      ) as AudioItem[]
    ).asObservable();
  }

  searchVideos(keyword: string): Observable<VideoItem[]> {
    const searchTerm = keyword.toLowerCase();
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => 
        item.type === 'video' && (
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.author?.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      ) as VideoItem[]
    ).asObservable();
  }

  getAudioByCategory(category: string): Observable<AudioItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.type === 'audio' && item.category === category) as AudioItem[]
    ).asObservable();
  }

  getVideoByCategory(category: string): Observable<VideoItem[]> {
    return new BehaviorSubject(
      this.mediaItemsSubject.value.filter(item => item.type === 'video' && item.category === category) as VideoItem[]
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
