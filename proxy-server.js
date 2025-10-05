const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend('re_gzcoEFpe_HrByJC6WDUUQVY6NraZLCPsT');

// Configuration CORS
app.use(cors({
  origin: ['https://liberteiyac.com', 'https://www.liberteiyac.com'],
  credentials: true
}));

app.use(express.json());

// Route pour envoyer des emails
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, from } = req.body;
    
    console.log('📧 Envoi d\'email:', { to, subject, from });
    
    const result = await resend.emails.send({
      from: from || 'contact@liberteiyac.com',
      to: [to],
      subject: subject,
      html: html
    });
    
    console.log('✅ Email envoyé:', result);
    
    res.json({ 
      success: true, 
      data: result,
      message: 'Email envoyé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Proxy server actif',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Erreur interne du serveur' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Proxy server démarré sur le port ${PORT}`);
  console.log(`📧 Prêt pour l'envoi d'emails via Resend`);
  console.log(`🌐 CORS configuré pour liberteiyac.com`);
});

module.exports = app;
