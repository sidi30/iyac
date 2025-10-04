// Import de tous les médias audio
import { audio001 } from './audio/audio-001';

// Import de tous les médias vidéo
import { video001 } from './video/video-001';
import { video002 } from './video/video-002';

// Export de tous les médias audio dans l'ordre chronologique (plus récent en premier)
export const allAudioItems = [
  audio001 // Interview Audio - Honorable Kabirou Ibrahim (30 septembre 2025)
];

// Export de tous les médias vidéo dans l'ordre chronologique (plus récent en premier)
export const allVideoItems = [
  video001, // Interview Vidéo - Honorable Kabirou Ibrahim (1er octobre 2025)
  video002  // Interview Historique - Ibrahim Yacouba (15 décembre 2024)
];

// Export de tous les médias combinés
export const allMediaItems = [
  ...allAudioItems,
  ...allVideoItems
];

// Export individuel pour faciliter l'import sélectif
export {
  audio001,
  video001,
  video002
};
