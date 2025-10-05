// Configuration d'environnement pour la production
export const environment = {
  production: true,
  
  // URLs et clés API - À configurer selon votre environnement
  googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbzQhp69hgYM9qEfxScvamEGrJ3iYL_1unpoghHUDRhBA18ZR5u0wG-afPYnb2dy7re8rQ/exec',
  resendApiKey: 're_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT', // À remplir avec votre clé Resend
  fromEmail: 'noreply@liberteiyac.com', // À remplir avec votre domaine
  
  // Google Analytics
  gaTrackingId: 'G-JJDC6WW0HV',
  
  // Configuration de sécurité
  enableSecurityHeaders: true,
  enableCSP: true,
  enableHSTS: true,
  
  // Configuration CORS
  allowedOrigins: [
    'https://liberteiyac.com',
    'https://www.liberteiyac.com',
    'https://sidi30.github.io'
  ],
  
  // Limites de sécurité
  maxRequestSize: '10mb',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // 100 requêtes par fenêtre
};
