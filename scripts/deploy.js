#!/usr/bin/env node

/**
 * Script de déploiement automatique pour GitHub Pages
 * Usage: node scripts/deploy.js [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  buildCommand: 'ng build --configuration=github-pages',
  deployCommand: 'ng deploy',
  distPath: 'dist/liberteiyac-journal/browser',
  backupPath: 'dist/backup',
  maxRetries: 3
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bright}${colors.blue}[ÉTAPE ${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Vérifications préliminaires
function checkPrerequisites() {
  logStep(1, 'Vérification des prérequis');
  
  try {
    // Vérifier Node.js
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    logSuccess(`Node.js: ${nodeVersion}`);
    
    // Vérifier npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm: ${npmVersion}`);
    
    // Vérifier Angular CLI
    const ngVersion = execSync('ng version --json', { encoding: 'utf8' });
    const ngInfo = JSON.parse(ngVersion);
    logSuccess(`Angular CLI: ${ngInfo.Angular}`);
    
    // Vérifier Git
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    logSuccess(`Git: ${gitVersion}`);
    
    // Vérifier le statut Git
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      logWarning('Des modifications non commitées détectées');
      logInfo('Fichiers modifiés:');
      console.log(gitStatus);
    } else {
      logSuccess('Aucune modification non commitée');
    }
    
    return true;
  } catch (error) {
    logError(`Erreur lors de la vérification: ${error.message}`);
    return false;
  }
}

// Build de l'application
function buildApplication() {
  logStep(2, 'Construction de l\'application');
  
  try {
    logInfo('Suppression des anciens builds...');
    if (fs.existsSync('dist')) {
      execSync('rm -rf dist', { stdio: 'inherit' });
    }
    
    logInfo('Installation des dépendances...');
    execSync('npm ci', { stdio: 'inherit' });
    
    logInfo('Construction de l\'application...');
    execSync(CONFIG.buildCommand, { stdio: 'inherit' });
    
    // Vérifier que le build a réussi
    if (!fs.existsSync(CONFIG.distPath)) {
      throw new Error('Le build a échoué - dossier dist manquant');
    }
    
    logSuccess('Build réussi !');
    return true;
  } catch (error) {
    logError(`Erreur lors du build: ${error.message}`);
    return false;
  }
}

// Test du build
function testBuild() {
  logStep(3, 'Test du build');
  
  try {
    // Vérifier les fichiers essentiels
    const essentialFiles = [
      'index.html',
      'main.js',
      'styles.css'
    ];
    
    for (const file of essentialFiles) {
      const filePath = path.join(CONFIG.distPath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Fichier essentiel manquant: ${file}`);
      }
    }
    
    logSuccess('Tous les fichiers essentiels sont présents');
    
    // Vérifier la taille du build
    const buildSize = execSync(`du -sh ${CONFIG.distPath}`, { encoding: 'utf8' }).trim();
    logInfo(`Taille du build: ${buildSize}`);
    
    return true;
  } catch (error) {
    logError(`Erreur lors du test: ${error.message}`);
    return false;
  }
}

// Déploiement
function deployToGitHubPages() {
  logStep(4, 'Déploiement sur GitHub Pages');
  
  try {
    logInfo('Déploiement en cours...');
    execSync(CONFIG.deployCommand, { stdio: 'inherit' });
    
    logSuccess('Déploiement réussi !');
    logInfo('Votre site sera disponible dans quelques minutes sur GitHub Pages');
    
    return true;
  } catch (error) {
    logError(`Erreur lors du déploiement: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function main() {
  log(`${colors.bright}${colors.magenta}🚀 DÉPLOIEMENT LIBERTÉ IYAC JOURNAL${colors.reset}`);
  log(`${colors.cyan}==========================================${colors.reset}`);
  
  const startTime = Date.now();
  
  try {
    // Étape 1: Vérifications
    if (!checkPrerequisites()) {
      process.exit(1);
    }
    
    // Étape 2: Build
    if (!buildApplication()) {
      process.exit(1);
    }
    
    // Étape 3: Test
    if (!testBuild()) {
      process.exit(1);
    }
    
    // Étape 4: Déploiement
    if (!deployToGitHubPages()) {
      process.exit(1);
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    logSuccess(`\n🎉 Déploiement terminé avec succès en ${duration}s !`);
    logInfo('Votre site est maintenant en ligne sur GitHub Pages');
    logInfo('URL: https://sidi30.github.io/iyac/');
    
  } catch (error) {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: node scripts/deploy.js [options]

Options:
  --help, -h     Afficher cette aide
  --dry-run      Effectuer un build de test sans déployer
  --verbose      Mode verbeux

Exemples:
  node scripts/deploy.js
  node scripts/deploy.js --dry-run
  node scripts/deploy.js --verbose
`);
  process.exit(0);
}

if (args.includes('--dry-run')) {
  logWarning('Mode dry-run activé - aucun déploiement ne sera effectué');
  // Modifier la configuration pour le dry-run
  CONFIG.deployCommand = 'echo "DRY RUN: Déploiement simulé"';
}

// Exécution
main().catch(error => {
  logError(`Erreur inattendue: ${error.message}`);
  process.exit(1);
});
