const fs = require('fs');
const path = require('path');

// Configuration
const MEDIA_TYPES = {
  audio: {
    directory: 'src/app/data/media/audio',
    prefix: 'audio',
    template: `import { AudioItem } from '../../models/media.model';

export const audio{ID}: AudioItem = {
  id: 'audio-{ID}',
  title: '{TITLE}',
  description: '{DESCRIPTION}',
  type: 'audio',
  fileUrl: 'assets/{FILE_URL}',
  duration: {DURATION}, // en secondes
  publishDate: new Date('{PUBLISH_DATE}'),
  author: '{AUTHOR}',
  category: '{CATEGORY}',
  tags: [{TAGS}],
  isFeatured: {IS_FEATURED},
  downloadUrl: 'assets/{FILE_URL}',
  size: {SIZE}, // en bytes
  transcript: \`
{TRANSCRIPT}
  \`.trim()
};`
  },
  video: {
    directory: 'src/app/data/media/video',
    prefix: 'video',
    template: `import { VideoItem } from '../../models/media.model';

export const video{ID}: VideoItem = {
  id: 'video-{ID}',
  title: '{TITLE}',
  description: '{DESCRIPTION}',
  type: 'video',
  fileUrl: 'assets/{FILE_URL}',
  thumbnailUrl: 'assets/{THUMBNAIL_URL}',
  duration: {DURATION}, // en secondes
  publishDate: new Date('{PUBLISH_DATE}'),
  author: '{AUTHOR}',
  category: '{CATEGORY}',
  tags: [{TAGS}],
  isFeatured: {IS_FEATURED},
  downloadUrl: 'assets/{FILE_URL}',
  size: {SIZE}, // en bytes
  resolution: '{RESOLUTION}',
  quality: '{QUALITY}',
  transcript: \`
{TRANSCRIPT}
  \`.trim()
};`
  }
};

// Fonction pour obtenir le prochain ID
function getNextId(type) {
  const directory = MEDIA_TYPES[type].directory;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    return '001';
  }
  
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.ts'))
    .map(file => {
      const match = file.match(new RegExp(`${MEDIA_TYPES[type].prefix}-(\\d+)\\.ts`));
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => b - a);
  
  const nextId = (files[0] || 0) + 1;
  return nextId.toString().padStart(3, '0');
}

// Fonction pour créer un nouveau média
function createMedia(type, data) {
  const nextId = getNextId(type);
  const config = MEDIA_TYPES[type];
  
  // Remplacer les placeholders dans le template
  let content = config.template
    .replace(/{ID}/g, nextId)
    .replace(/{TITLE}/g, data.title || 'Nouveau ' + type)
    .replace(/{DESCRIPTION}/g, data.description || 'Description du ' + type)
    .replace(/{FILE_URL}/g, data.fileUrl || '')
    .replace(/{DURATION}/g, data.duration || 0)
    .replace(/{PUBLISH_DATE}/g, data.publishDate || new Date().toISOString().split('T')[0])
    .replace(/{AUTHOR}/g, data.author || 'Équipe Liberté IYAC')
    .replace(/{CATEGORY}/g, data.category || 'Interview')
    .replace(/{TAGS}/g, data.tags ? data.tags.map(tag => `'${tag}'`).join(', ') : "'Tag1', 'Tag2'")
    .replace(/{IS_FEATURED}/g, data.isFeatured || false)
    .replace(/{SIZE}/g, data.size || 0)
    .replace(/{TRANSCRIPT}/g, data.transcript || '[00:00] Transcription à venir...');
  
  // Ajouter les champs spécifiques aux vidéos
  if (type === 'video') {
    content = content
      .replace(/{THUMBNAIL_URL}/g, data.thumbnailUrl || 'assets/iyac.jpg')
      .replace(/{RESOLUTION}/g, data.resolution || '1920x1080')
      .replace(/{QUALITY}/g, data.quality || 'HD');
  }
  
  // Créer le fichier
  const filename = `${config.prefix}-${nextId}.ts`;
  const filepath = path.join(config.directory, filename);
  
  fs.writeFileSync(filepath, content);
  console.log(`✅ ${type} créé : ${filename}`);
  
  return { id: nextId, filename, filepath };
}

// Fonction pour mettre à jour l'index
function updateIndex(type, newMedia) {
  const indexPath = 'src/app/data/media/index.ts';
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ Fichier index.ts non trouvé');
    return;
  }
  
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Ajouter l'import
  const importLine = `import { ${type}${newMedia.id} } from './${type}/${type}-${newMedia.id}';`;
  const importRegex = new RegExp(`(// Import de tous les médias ${type}s?\\n)(.*?)(\\n\\n)`);
  
  if (content.match(importRegex)) {
    content = content.replace(importRegex, `$1$2\n${importLine}$3`);
  }
  
  // Ajouter à la liste
  const listRegex = new RegExp(`(export const all${type.charAt(0).toUpperCase() + type.slice(1)}Items = \\[)(.*?)(\\];)`);
  if (content.match(listRegex)) {
    const newItem = `  ${type}${newMedia.id}, // ${new Date().toLocaleDateString()}`;
    content = content.replace(listRegex, `$1$2\n${newItem}$3`);
  }
  
  // Ajouter à l'export individuel
  const exportRegex = /(export \{\s*)(.*?)(\s*\};)/;
  if (content.match(exportRegex)) {
    const newExport = `${type}${newMedia.id},`;
    content = content.replace(exportRegex, `$1$2\n  ${newExport}$3`);
  }
  
  fs.writeFileSync(indexPath, content);
  console.log(`✅ Index mis à jour`);
}

// Interface en ligne de commande
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
📁 Générateur de Médias - Liberté IYAC

Usage:
  node scripts/generate-media.js audio [options]
  node scripts/generate-media.js video [options]

Options:
  --title "Titre du média"
  --description "Description du média"
  --file-url "chemin/vers/fichier"
  --duration 1800
  --author "Auteur"
  --category "Catégorie"
  --tags "tag1,tag2,tag3"
  --featured
  --thumbnail-url "chemin/vers/thumbnail"
  --resolution "1920x1080"
  --quality "HD"
  --transcript "Transcription..."

Exemples:
  node scripts/generate-media.js audio --title "Nouvel Interview" --featured
  node scripts/generate-media.js video --title "Nouvelle Vidéo" --file-url "videos/nouveau.mp4"
    `);
    return;
  }
  
  const type = args[0];
  
  if (!MEDIA_TYPES[type]) {
    console.log(`❌ Type de média non supporté : ${type}`);
    console.log(`Types supportés : ${Object.keys(MEDIA_TYPES).join(', ')}`);
    return;
  }
  
  // Parser les arguments
  const data = {};
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'title':
        data.title = value;
        break;
      case 'description':
        data.description = value;
        break;
      case 'file-url':
        data.fileUrl = value;
        break;
      case 'duration':
        data.duration = parseInt(value);
        break;
      case 'author':
        data.author = value;
        break;
      case 'category':
        data.category = value;
        break;
      case 'tags':
        data.tags = value.split(',').map(tag => tag.trim());
        break;
      case 'featured':
        data.isFeatured = true;
        i--; // Pas de valeur pour ce flag
        break;
      case 'thumbnail-url':
        data.thumbnailUrl = value;
        break;
      case 'resolution':
        data.resolution = value;
        break;
      case 'quality':
        data.quality = value;
        break;
      case 'transcript':
        data.transcript = value;
        break;
    }
  }
  
  try {
    const newMedia = createMedia(type, data);
    updateIndex(type, newMedia);
    console.log(`\n🎉 Nouveau ${type} créé avec succès !`);
    console.log(`📁 Fichier : ${newMedia.filepath}`);
    console.log(`🆔 ID : ${newMedia.id}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création :', error.message);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { createMedia, updateIndex, getNextId };
