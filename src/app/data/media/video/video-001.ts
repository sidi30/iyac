import { VideoItem } from '../../../models/media.model';

export const video001: VideoItem = {
  id: 'video-001',
  title: 'Interview Vidéo - Honorable Kabirou Ibrahim',
  description: 'Interview vidéo complète avec l\'honorable Kabirou Ibrahim, frère d\'Ibrahim Yacoubou (IYAC), sur la détention injuste et les défis démocratiques au Niger.',
  type: 'video',
  fileUrl: 'assets/videos/interviewVideo.mp4',
  thumbnailUrl: 'assets/iyac/WhatsApp Image 2025-09-25 à 15.10.37_7be547b5.jpg',
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
};
