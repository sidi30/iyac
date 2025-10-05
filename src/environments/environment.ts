// Configuration d'environnement pour le développement
export const environment = {
  production: false,
  
  // URLs et clés API pour le développement
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbzQhp69hgYM9qEfxScvamEGrJ3iYL_1unpoghHUDRhBA18ZR5u0wG-afPYnb2dy7re8rQ/exec',
  resendApiKey: 're_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT', // Clé de test pour le développement
  fromEmail: 'contact@liberteiyac.com', // Email d'expéditeur configuré
  
  // Google Analytics (ID de test)
  gaTrackingId: 'G-JJDC6WW0HV',
  
  // Configuration de développement
  enableMockMode: true, // Active le mode simulation pour éviter les erreurs CORS
  enableCSP: false, // Désactivé en développement pour faciliter le debug
  enableHSTS: false,
  
  // Configuration CORS (relaxée pour le développement)
  allowedOrigins: [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'https://liberteiyac.com',
    'https://www.liberteiyac.com',
    'https://sidi30.github.io'
  ],
  
  // Limites de sécurité (relaxées pour le développement)
  maxRequestSize: '50mb',
  rateLimitWindow: 5 * 60 * 1000, // 5 minutes
  rateLimitMax: 1000, // 1000 requêtes par fenêtre
};
