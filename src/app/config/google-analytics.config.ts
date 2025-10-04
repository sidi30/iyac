// Configuration Google Analytics pour Liberté IYAC
export const GOOGLE_ANALYTICS_CONFIG = {
  // Remplacez par votre ID de mesure Google Analytics
  MEASUREMENT_ID: 'G-JJDC6WW0HV', // À remplacer par votre ID réel
  
  // Configuration des événements personnalisés
  EVENTS: {
    // Articles
    ARTICLE_READ: 'article_read',
    ARTICLE_SHARE: 'article_share',
    
    // Médias
    MEDIA_PLAY: 'media_play',
    MEDIA_PAUSE: 'media_pause',
    MEDIA_DOWNLOAD: 'media_download',
    MEDIA_INTERACTION: 'media_interaction',
    
    // Recherche et navigation
    SEARCH: 'search',
    FILTER_USE: 'filter_use',
    PAGE_VIEW: 'page_view',
    
    // Social
    SOCIAL_SHARE: 'social_share',
    
    // Engagement
    SCROLL: 'scroll',
    TIME_ON_SITE: 'time_on_site',
    EXTERNAL_LINK: 'external_link_click',
    
    // Conversions
    CONVERSION: 'conversion',
    NEWSLETTER_SIGNUP: 'newsletter_signup',
    
    // Erreurs
    ERROR: 'error'
  },
  
  // Catégories d'événements
  CATEGORIES: {
    CONTENT: 'content',
    MEDIA: 'media',
    ENGAGEMENT: 'engagement',
    SOCIAL: 'social',
    CONVERSION: 'conversion',
    ERROR: 'error',
    DOWNLOAD: 'download',
    SEARCH: 'search'
  },
  
  // Types de contenu
  CONTENT_TYPES: {
    ARTICLE: 'article',
    AUDIO: 'audio',
    VIDEO: 'video',
    DOWNLOAD: 'download',
    SEARCH: 'search',
    FILTER: 'filter',
    SOCIAL: 'social',
    CONVERSION: 'conversion',
    ERROR: 'error',
    ENGAGEMENT: 'engagement'
  },
  
  // Paramètres personnalisés
  CUSTOM_PARAMETERS: {
    SITE_TYPE: 'liberteiyac_journal',
    CONTENT_CATEGORY: 'content_category',
    USER_TYPE: 'user_type'
  }
};

// Instructions pour obtenir votre ID Google Analytics :
/*
1. Allez sur https://analytics.google.com/
2. Créez un compte ou connectez-vous
3. Créez une propriété pour votre site web
4. Obtenez votre ID de mesure (format: G-XXXXXXXXXX)
5. Remplacez 'G-XXXXXXXXXX' dans ce fichier et dans index.html
6. Remplacez aussi dans src/app/services/google-analytics.service.ts
*/
