#!/usr/bin/env node

/**
 * Script utilitaire pour générer un nouvel article
 * Usage: node generate-article.js "Titre de l'article" "Auteur" "Catégorie"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ARTICLES_DIR = path.join(__dirname, 'src/app/data/articles');
const INDEX_FILE = path.join(ARTICLES_DIR, 'index.ts');

// Fonction pour obtenir le prochain numéro d'article
function getNextArticleNumber() {
  const files = fs.readdirSync(ARTICLES_DIR);
  const articleFiles = files.filter(file => file.startsWith('article-') && file.endsWith('.ts'));
  
  if (articleFiles.length === 0) return '001';
  
  const numbers = articleFiles.map(file => {
    const match = file.match(/article-(\d+)\.ts/);
    return match ? parseInt(match[1]) : 0;
  });
  
  const nextNumber = Math.max(...numbers) + 1;
  return nextNumber.toString().padStart(3, '0');
}

// Fonction pour générer le contenu de l'article
function generateArticleContent(articleNumber, title, author, category) {
  const articleId = articleNumber;
  const articleName = `article${articleNumber}`;
  const today = new Date().toISOString().split('T')[0];
  
  return `import { Article } from '../../models/article.model';

export const ${articleName}: Article = {
  id: '${articleId}',
  title: '${title}',
  imageUrl: 'assets/iyac.jpg', // Remplacez par votre image
  content: \`<div class="article-content-formatted">
    <div class="article-intro">
      <h3>Introduction</h3>
      <p class="lead">Votre introduction ici...</p>
    </div>

    <div class="article-section">
      <h4>Section principale</h4>
      <p>Votre contenu principal...</p>
    </div>

    <div class="article-call-to-action">
      <h4>Appel à l'action</h4>
      <p>Votre message d'action...</p>
    </div>

    <div class="article-signature">
      <p><strong>Fait le ${today}</strong><br>
      <em>${author}</em></p>
    </div>
  </div>\`,
  excerpt: 'Résumé court de votre article (2-3 phrases)...',
  author: '${author}',
  publishDate: new Date('${today}'),
  category: '${category}',
  tags: ['${category}', 'Niger', 'Ibrahim Yacoubou'],
  isBreaking: false,
  readTime: 3,
  isHighlighted: false
};`;
}

// Fonction pour mettre à jour le fichier index
function updateIndexFile(articleNumber, articleName) {
  let indexContent = fs.readFileSync(INDEX_FILE, 'utf8');
  
  // Ajouter l'import
  const importRegex = /(import { article\d+ } from '\.\/article-\d+';)/g;
  const imports = indexContent.match(importRegex) || [];
  const newImport = `import { ${articleName} } from './article-${articleNumber}';`;
  
  if (!indexContent.includes(newImport)) {
    // Trouver la dernière ligne d'import et ajouter le nouveau
    const lastImportIndex = indexContent.lastIndexOf('import {');
    const nextLineIndex = indexContent.indexOf('\n', lastImportIndex);
    indexContent = indexContent.slice(0, nextLineIndex) + '\n' + newImport + indexContent.slice(nextLineIndex);
  }
  
  // Ajouter à l'array allArticles (en première position)
  const allArticlesRegex = /export const allArticles = \[([\s\S]*?)\];/;
  const match = indexContent.match(allArticlesRegex);
  
  if (match) {
    const currentArticles = match[1].trim();
    const newAllArticles = `export const allArticles = [
  ${articleName}, // Nouvel article (${new Date().toISOString().split('T')[0]})
${currentArticles ? '  ' + currentArticles.replace(/\n/g, '\n  ') : ''}
];`;
    
    indexContent = indexContent.replace(allArticlesRegex, newAllArticles);
  }
  
  // Ajouter à l'export individuel
  const exportRegex = /export \{\s*([\s\S]*?)\s*\};/;
  const exportMatch = indexContent.match(exportRegex);
  
  if (exportMatch) {
    const currentExports = exportMatch[1].trim();
    const newExports = `export {
  ${articleName},
${currentExports ? '  ' + currentExports.replace(/\n/g, '\n  ') : ''}
};`;
    
    indexContent = indexContent.replace(exportRegex, newExports);
  }
  
  fs.writeFileSync(INDEX_FILE, indexContent);
}

// Fonction principale
function generateArticle() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node generate-article.js "Titre de l\'article" "Auteur" "Catégorie"');
    console.log('Exemple: node generate-article.js "Nouvelle actualité" "Dr. Smith" "Politique"');
    process.exit(1);
  }
  
  const [title, author, category] = args;
  const articleNumber = getNextArticleNumber();
  const articleName = `article${articleNumber}`;
  const fileName = `article-${articleNumber}.ts`;
  const filePath = path.join(ARTICLES_DIR, fileName);
  
  // Générer le contenu de l'article
  const articleContent = generateArticleContent(articleNumber, title, author, category);
  
  // Créer le fichier
  fs.writeFileSync(filePath, articleContent);
  
  // Mettre à jour l'index
  updateIndexFile(articleNumber, articleName);
  
  console.log(`✅ Article créé avec succès !`);
  console.log(`📁 Fichier: ${fileName}`);
  console.log(`🆔 ID: ${articleNumber}`);
  console.log(`📝 Titre: ${title}`);
  console.log(`👤 Auteur: ${author}`);
  console.log(`📂 Catégorie: ${category}`);
  console.log(`\n📋 Prochaines étapes:`);
  console.log(`1. Éditez le fichier ${fileName} pour ajouter votre contenu`);
  console.log(`2. Remplacez l'image par défaut si nécessaire`);
  console.log(`3. Ajustez les tags et métadonnées`);
  console.log(`4. Testez l'article sur le site`);
}

// Exécuter le script
if (require.main === module) {
  generateArticle();
}

module.exports = { generateArticle };
