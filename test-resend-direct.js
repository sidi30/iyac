// Test Resend Direct - À utiliser avec précaution
// ⚠️ ATTENTION : Cette approche expose la clé API côté frontend

import { Resend } from 'resend';

const resend = new Resend('re_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT');

// Fonction de test
async function testResendDirect() {
  try {
    console.log('🧪 Test Resend direct...');
    
    const result = await resend.emails.send({
      from: 'contact@liberteiyac.com', // Utilisez votre domaine vérifié
      to: 'liberteiyac@gmail.com',
      subject: 'Test Liberté IYAC',
      html: `
        <h1>Test Newsletter Liberté IYAC</h1>
        <p>Ceci est un test d'envoi d'email via Resend.</p>
        <p><strong>Date :</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>Liberté IYAC - Voix Unies pour la Justice</em></p>
      `
    });
    
    console.log('✅ Email envoyé avec succès:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Erreur Resend:', error);
    throw error;
  }
}

// Test d'envoi
testResendDirect()
  .then(result => {
    console.log('🎉 Test réussi !', result);
  })
  .catch(error => {
    console.error('💥 Test échoué:', error);
  });

export { testResendDirect };
