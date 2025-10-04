import { AudioItem } from '../../../models/media.model';

export const audio001: AudioItem = {
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
};
