import { VideoItem } from '../../../models/media.model';

export const video002: VideoItem = {
  id: 'video-002',
  title: 'Interview Historique - Ibrahim Yacouba, Président MPN Kiishin Kassa',
  description: 'Ancien interview d\'Ibrahim Yacouba, président du parti politique MPN Kiishin Kassa, où il fait une promesse solennelle à ses partisans et exprime son engagement total pour son pays.',
  type: 'video',
  fileUrl: 'assets/videos/interviewIbrahim.mp4',
  thumbnailUrl: 'assets/iyac/WhatsApp Image 2025-09-25 à 15.10.37_aa487fdd.jpg',
  duration: 180, // 3 minutes estimées
  publishDate: new Date('2024-12-15'),
  author: 'MPN Kiishin Kassa',
  category: 'Interview',
  tags: ['Ibrahim Yacouba', 'IYAC', 'MPN Kiishin Kassa', 'Président', 'Parti Politique', 'Promesse', 'Engagement', 'Niger', 'Politique'],
  isFeatured: true,
  downloadUrl: 'assets/videos/interviewIbrahim.mp4',
  size: 25 * 1024 * 1024, // 25 MB estimé
  resolution: '1920x1080',
  quality: 'HD',
  transcript: `
[00:00] Introduction - Ibrahim Yacouba, Président du MPN Kiishin Kassa
[00:30] "Je vais vous faire une promesse, je sais que c'est Dieu qui donne le pouvoir à qui il veut et quand il veut"
[01:00] "Mais moi Ibrahim Yacouba je me battrai de toutes mes forces et de toute mon énergie pour que vous soyez fiers de moi"
[01:30] "Fiers de vous et du mouvement que vous soutenez"
[02:00] "Si j'avais plus d'une vie, je vous jure je les mettrais toutes ensemble pour me battre pour mon pays"
[02:30] Conclusion - Engagement total pour le Niger
  `.trim()
};
