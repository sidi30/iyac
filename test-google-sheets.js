// Script de test pour vérifier la connexion Google Sheets
// À exécuter dans la console du navigateur après avoir ouvert votre site

async function testGoogleSheetsConnection() {
  const url = 'https://script.google.com/macros/s/AKfycbzQhp69hgYM9qEfxScvamEGrJ3iYL_1unpoghHUDRhBA18ZR5u0wG-afPYnb2dy7re8rQ/exec';
  
  console.log('🧪 Test de connexion Google Sheets...');
  
  try {
    // Test 1: Charger les abonnés existants
    console.log('📥 Test 1: Chargement des abonnés...');
    const getResponse = await fetch(`${url}?action=getSubscribers`);
    const getData = await getResponse.json();
    console.log('✅ Chargement réussi:', getData);
    
    // Test 2: Ajouter un abonné de test
    console.log('📤 Test 2: Ajout d\'un abonné de test...');
    const testSubscriber = {
      email: 'test@example.com',
      name: 'Test User',
      subscribedAt: new Date().toISOString(),
      preferences: JSON.stringify({
        articles: true,
        videos: true,
        podcasts: true
      }),
      source: 'test'
    };
    
    const postResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSubscriber)
    });
    
    const postData = await postResponse.json();
    console.log('✅ Ajout réussi:', postData);
    
    console.log('🎉 Tous les tests sont passés ! Votre Google Apps Script fonctionne parfaitement.');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('💡 Vérifiez que votre Google Apps Script est bien déployé et accessible.');
  }
}

// Exécuter le test
testGoogleSheetsConnection();
