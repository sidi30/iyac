export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'audio' | 'video';
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number; // en secondes
  publishDate: Date;
  author?: string;
  category: string;
  tags: string[];
  isFeatured?: boolean;
  downloadUrl?: string;
  transcript?: string; // Transcription pour l'accessibilité
  size?: number; // Taille du fichier en bytes
}

export interface AudioItem extends MediaItem {
  type: 'audio';
  waveform?: number[]; // Données de forme d'onde pour visualisation
}

export interface VideoItem extends MediaItem {
  type: 'video';
  thumbnailUrl: string; // Obligatoire pour les vidéos
  resolution?: string; // ex: "1920x1080"
  quality?: 'HD' | 'SD' | '4K';
}

export interface PlaybackState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  isMuted: boolean;
}

export interface MediaPlaylist {
  id: string;
  title: string;
  description: string;
  items: MediaItem[];
  createdAt: Date;
  isPublic: boolean;
}
