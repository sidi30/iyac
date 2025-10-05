// Cloudflare Worker - Proxy pour Newsletter
// Déployez ceci sur Cloudflare Workers avec le domaine api.liberteiyac.com

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQhp69hgYM9qEfxScvamEGrJ3iYL_1unpoghHUDRhBA18ZR5u0wG-afPYnb2dy7re8rQ/exec';

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    if (request.method !== 'POST') {
      return json({ 
        ok: false, 
        error: 'Method Not Allowed',
        message: 'Seules les requêtes POST sont autorisées'
      }, 405, request);
    }

    try {
      const body = await request.json();
      const { email, name, preferences } = body;
      
      // 1) Validation email
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return json({ 
          ok: false, 
          error: 'invalid_email',
          message: 'Adresse email invalide'
        }, 400, request);
      }

      // 2) Validation nom (optionnel)
      const cleanName = name ? name.trim().substring(0, 100) : '';
      
      // 3) Validation préférences
      const cleanPreferences = preferences || { articles: true, videos: true, podcasts: true };

      console.log('📧 Traitement inscription:', { email, name: cleanName });

      // 4) Forward vers Google Apps Script (côté serveur → pas de CORS)
      const appsScriptResponse = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'LiberteIYAC-Newsletter/1.0'
        },
        body: JSON.stringify({ 
          email: email.trim(),
          name: cleanName,
          preferences: JSON.stringify(cleanPreferences),
          source: 'website',
          timestamp: new Date().toISOString()
        }),
      });

      const appsScriptData = await appsScriptResponse.json();
      console.log('📊 Réponse Apps Script:', appsScriptData);

      // 5) Si inscription réussie, envoyer email de bienvenue via Resend
      if (appsScriptData.success && env.RESEND_API_KEY) {
        try {
          const welcomeEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'contact@liberteiyac.com',
              to: [email.trim()],
              subject: 'Bienvenue à Liberté IYAC ! 🎉',
              html: getWelcomeEmailTemplate(cleanName || email.split('@')[0])
            })
          });

          const emailResult = await welcomeEmailResponse.json();
          console.log('📧 Email de bienvenue envoyé:', emailResult);

        } catch (emailError) {
          console.error('❌ Erreur envoi email:', emailError);
          // Ne pas faire échouer l'inscription si l'email échoue
        }
      }

      return json({ 
        ok: !!appsScriptData.success, 
        message: appsScriptData.success ? 
          'Inscription réussie ! Vérifiez votre boîte mail.' : 
          'Erreur lors de l\'inscription',
        data: appsScriptData
      }, appsScriptData.success ? 200 : 400, request);

    } catch (err) {
      console.error('❌ Erreur serveur:', err);
      return json({ 
        ok: false, 
        error: 'server_error',
        message: 'Erreur interne du serveur'
      }, 500, request);
    }
  }
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'https://liberteiyac.com',
    'https://www.liberteiyac.com',
    'https://sidi30.github.io'
  ];
  
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : 'https://liberteiyac.com';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function json(obj, status, request) {
  return new Response(JSON.stringify(obj), { 
    status, 
    headers: corsHeaders(request) 
  });
}

function getWelcomeEmailTemplate(name) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Bienvenue - Liberté IYAC</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 20px; 
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px; 
                padding: 20px 0;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border-radius: 8px 8px 0 0;
            }
            .header h1 { 
                color: white; 
                margin: 0; 
                font-size: 28px;
            }
            .header p { 
                color: #e2e8f0; 
                margin: 5px 0 0 0; 
                font-size: 16px;
            }
            .content { 
                padding: 20px; 
            }
            .button { 
                background: #2563eb; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                display: inline-block; 
                margin: 20px 0;
                font-weight: bold;
            }
            .footer { 
                border-top: 1px solid #eee; 
                margin-top: 30px; 
                padding-top: 20px; 
                text-align: center; 
                font-size: 12px; 
                color: #666; 
            }
            .highlight {
                background: #fef3c7;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #f59e0b;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Bienvenue ${name} !</h1>
                <p>Liberté IYAC - Voix Unies pour la Justice</p>
            </div>

            <div class="content">
                <h2>Merci de vous être abonné à notre newsletter !</h2>

                <p>Vous recevrez désormais nos dernières actualités directement dans votre boîte mail :</p>

                <ul>
                    <li>📰 <strong>Articles exclusifs</strong> sur la situation politique</li>
                    <li>🎥 <strong>Vidéos et interviews</strong> avec nos leaders</li>
                    <li>🎙️ <strong>Podcasts</strong> pour des analyses approfondies</li>
                    <li>🚨 <strong>Actualités urgentes</strong> et breaking news</li>
                </ul>

                <div class="highlight">
                    <h3>Notre Mission</h3>
                    <p><em>"La liberté et la justice ne sont pas des privilèges, mais des droits fondamentaux de chaque citoyen."</em></p>
                    <p><strong>- Ibrahim Yacouba</strong></p>
                </div>

                <div style="text-align: center;">
                    <a href="https://liberteiyac.com" class="button">Visiter le Site</a>
                </div>

                <p><strong>Restez connecté :</strong></p>
                <ul>
                    <li>🌐 Site web : <a href="https://liberteiyac.com">liberteiyac.com</a></li>
                    <li>📧 Contact : <a href="mailto:contact@liberteiyac.com">contact@liberteiyac.com</a></li>
                </ul>
            </div>

            <div class="footer">
                <p>Vous recevez cet email car vous vous êtes abonné à notre newsletter.</p>
                <p><a href="https://liberteiyac.com/unsubscribe">Se désabonner</a> | 
                   <a href="https://liberteiyac.com/privacy">Politique de confidentialité</a></p>
                <p>© 2025 Liberté IYAC. Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
