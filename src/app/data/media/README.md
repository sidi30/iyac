# 📁 Structure des Médias - Liberté IYAC

## 🎯 **Organisation Modulaire**

La structure des médias suit maintenant le même principe que les articles : **un fichier par média** pour faciliter la gestion et l'ajout de nouveau contenu.

## 📂 **Structure des Dossiers**

```
src/app/data/media/
├── audio/                    # Fichiers audio individuels
│   ├── audio-001.ts         # Interview Kabirou Ibrahim
│   └── audio-002.ts         # (futur audio)
├── video/                    # Fichiers vidéo individuels
│   ├── video-001.ts         # Interview Kabirou Ibrahim
│   ├── video-002.ts         # Interview Historique Ibrahim Yacouba
│   └── video-003.ts         # (futur vidéo)
└── index.ts                 # Index central
```

## 🎵 **Structure d'un Fichier Audio**

```typescript
// src/app/data/media/audio/audio-001.ts
import { AudioItem } from '../../models/media.model';

export const audio001: AudioItem = {
  id: 'audio-001',
  title: 'Titre de l\'audio',
  description: 'Description détaillée',
  type: 'audio',
  fileUrl: 'assets/audios/fichier.mp3',
  duration: 1800, // en secondes
  publishDate: new Date('2025-10-05'),
  author: 'Auteur',
  category: 'Interview',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  isFeatured: true,
  downloadUrl: 'assets/audios/fichier.mp3',
  size: 15 * 1024 * 1024, // en bytes
  transcript: `
[00:00] Transcription avec timestamps
[01:30] Plus de contenu...
  `.trim()
};
```

## 🎬 **Structure d'un Fichier Vidéo**

```typescript
// src/app/data/media/video/video-001.ts
import { VideoItem } from '../../models/media.model';

export const video001: VideoItem = {
  id: 'video-001',
  title: 'Titre de la vidéo',
  description: 'Description détaillée',
  type: 'video',
  fileUrl: 'assets/videos/fichier.mp4',
  thumbnailUrl: 'assets/iyac/image.jpg',
  duration: 2400, // en secondes
  publishDate: new Date('2025-10-05'),
  author: 'Auteur',
  category: 'Interview',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  isFeatured: true,
  downloadUrl: 'assets/videos/fichier.mp4',
  size: 50 * 1024 * 1024, // en bytes
  resolution: '1920x1080',
  quality: 'HD',
  transcript: `
[00:00] Transcription avec timestamps
[01:30] Plus de contenu...
  `.trim()
};
```

## 🔧 **Ajout Automatique de Nouveaux Médias**

### **Script de Génération**

Utilisez le script `generate-media.js` pour créer automatiquement de nouveaux médias :

```bash
# Générer un nouvel audio
npm run generate-media audio --title "Nouvel Interview" --featured

# Générer une nouvelle vidéo
npm run generate-media video --title "Nouvelle Vidéo" --file-url "videos/nouveau.mp4" --featured
```

### **Options Disponibles**

#### **Options Communes**
- `--title "Titre du média"`
- `--description "Description du média"`
- `--file-url "chemin/vers/fichier"`
- `--duration 1800` (en secondes)
- `--author "Auteur"`
- `--category "Catégorie"`
- `--tags "tag1,tag2,tag3"`
- `--featured` (mettre à la une)
- `--transcript "Transcription..."`

#### **Options Spécifiques aux Vidéos**
- `--thumbnail-url "chemin/vers/thumbnail"`
- `--resolution "1920x1080"`
- `--quality "HD"`

### **Exemples d'Utilisation**

```bash
# Audio simple
npm run generate-media audio --title "Interview Politique" --author "Journaliste" --featured

# Vidéo complète
npm run generate-media video \
  --title "Débat Public" \
  --description "Débat sur la démocratie au Niger" \
  --file-url "videos/debat.mp4" \
  --thumbnail-url "iyac/debat.jpg" \
  --duration 3600 \
  --author "Équipe Liberté IYAC" \
  --category "Débat" \
  --tags "Démocratie,Niger,Politique" \
  --featured \
  --resolution "1920x1080" \
  --quality "HD" \
  --transcript "[00:00] Introduction du débat..."
```

## 📝 **Ajout Manuel**

### **1. Créer le Fichier Média**

Créez un nouveau fichier dans le dossier approprié :
- `src/app/data/media/audio/audio-XXX.ts` pour un audio
- `src/app/data/media/video/video-XXX.ts` pour une vidéo

### **2. Utiliser le Template**

Copiez le template approprié et remplissez les informations.

### **3. Mettre à Jour l'Index**

Ajoutez l'import et l'export dans `src/app/data/media/index.ts` :

```typescript
// Import
import { audioXXX } from './audio/audio-XXX';

// Export dans la liste
export const allAudioItems = [
  audio001,
  audioXXX, // Nouveau
];

// Export individuel
export {
  audio001,
  audioXXX, // Nouveau
};
```

## 🖼️ **Images Disponibles**

### **Dossier `assets/iyac/`**
- `WhatsApp Image 2025-09-25 à 15.10.37_7be547b5.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.37_aa487fdd.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.37_e552cb13.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.38_3b71598a.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.38_8305fec9.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.38_8e30bf35.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.39_011eb3f9.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.39_0825893f.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.41_d01cd38f.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.41_e8297c89.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.42_2e06255d.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.42_95d48af6.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.42_a03df2bb.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.42_e4ae81a0.jpg`
- `WhatsApp Image 2025-09-25 à 15.10.42_e6f94809.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.36_175e39fa.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.36_c3de6fc7.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.36_f0c964da.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.37_10fe13c9.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.37_1d862288.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.37_b7a2081a.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.37_bedd9503.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.38_0067dfe0.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.38_028e9dcf.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.38_c8de0693.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.39_b1282771.jpg`
- `WhatsApp Image 2025-09-25 à 15.13.39_f56fc32a.jpg`

### **Autres Images**
- `assets/iyac.jpg`
- `assets/iyac2.jpg`
- `assets/iyac3.jpg`
- `assets/partiIbrahim.jpg`
- `assets/democratie.jpg`
- `assets/insoumise.jpg`

## 🎯 **Avantages de cette Structure**

### **✅ Organisation**
- **Un fichier par média** : Facilite la gestion individuelle
- **Séparation audio/vidéo** : Organisation claire par type
- **Index centralisé** : Point d'entrée unique

### **✅ Maintenance**
- **Modification facile** : Éditer un seul fichier
- **Ajout simple** : Script automatique ou manuel
- **Pas de conflits** : Chaque média est indépendant

### **✅ Évolutivité**
- **Ajout illimité** : Pas de limite de médias
- **Métadonnées riches** : Toutes les informations nécessaires
- **Transcription intégrée** : Support natif

### **✅ Performance**
- **Chargement optimisé** : Seuls les médias nécessaires
- **Cache efficace** : Gestion intelligente des données
- **Recherche rapide** : Indexation automatique

## 🚀 **Utilisation**

### **Pour Ajouter un Nouveau Média**

1. **Automatique** : `npm run generate-media [type] [options]`
2. **Manuel** : Créer le fichier et mettre à jour l'index

### **Pour Modifier un Média Existant**

1. Ouvrir le fichier correspondant dans `audio/` ou `video/`
2. Modifier les propriétés nécessaires
3. Sauvegarder

### **Pour Supprimer un Média**

1. Supprimer le fichier dans `audio/` ou `video/`
2. Retirer l'import et l'export de l'index
3. Sauvegarder

## 📊 **Statistiques Actuelles**

- **Audio** : 1 fichier (audio-001)
- **Vidéo** : 2 fichiers (video-001, video-002)
- **Total** : 3 médias organisés

La structure est maintenant prête pour accueillir facilement de nouveaux contenus audio et vidéo ! 🎵🎬✅
