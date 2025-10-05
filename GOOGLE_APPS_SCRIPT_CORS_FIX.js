// Configuration CORS pour Google Apps Script
// Remplacez le code existant dans votre Google Apps Script par ceci

function doPost(e) {
  // Headers CORS pour permettre les requêtes depuis votre domaine
  const headers = {
    'Access-Control-Allow-Origin': 'https://liberteiyac.com',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  // Gérer les requêtes OPTIONS (preflight)
  if (e.parameter && e.parameter.method === 'OPTIONS') {
    return ContentService
      .createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  try {
    // Récupérer les données
    const data = JSON.parse(e.postData.contents);
    
    // Ouvrir la feuille Google Sheets
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Ajouter les données à la feuille
    const row = [
      data.email || '',
      data.name || '',
      new Date().toISOString(),
      data.preferences || '{}',
      'website'
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Abonné ajouté avec succès' 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': 'https://liberteiyac.com',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    // Récupérer les abonnés
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    const subscribers = data.slice(1).map(row => ({
      email: row[0],
      name: row[1],
      subscribedAt: row[2],
      preferences: row[3],
      source: row[4]
    }));
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        subscribers: subscribers 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}