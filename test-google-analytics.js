// Test Google Analytics - À exécuter dans la console du navigateur
console.log('=== TEST GOOGLE ANALYTICS ===');

// 1. Vérifier si gtag est chargé
if (typeof window.gtag === 'function') {
  console.log('✅ gtag est chargé');
} else {
  console.log('❌ gtag n\'est pas chargé');
}

// 2. Vérifier dataLayer
if (window.dataLayer && Array.isArray(window.dataLayer)) {
  console.log('✅ dataLayer existe:', window.dataLayer.length, 'éléments');
} else {
  console.log('❌ dataLayer n\'existe pas');
}

// 3. Vérifier le tracking ID
const trackingId = 'G-JJDC6WW0HV';
console.log('📊 Tracking ID:', trackingId);

// 4. Test d'envoi d'événement
if (typeof window.gtag === 'function') {
  try {
    window.gtag('event', 'test_event', {
      event_category: 'test',
      event_label: 'console_test',
      value: 1
    });
    console.log('✅ Événement de test envoyé');
  } catch (error) {
    console.log('❌ Erreur lors de l\'envoi:', error);
  }
}

// 5. Vérifier les requêtes réseau
console.log('🔍 Vérifiez l\'onglet Network pour les requêtes vers google-analytics.com');

// 6. Test de page view
if (typeof window.gtag === 'function') {
  try {
    window.gtag('config', trackingId, {
      page_path: '/test',
      page_title: 'Test Page'
    });
    console.log('✅ Page view de test envoyée');
  } catch (error) {
    console.log('❌ Erreur page view:', error);
  }
}

console.log('=== FIN DU TEST ===');
