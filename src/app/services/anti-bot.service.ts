import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AntiBotService {
  private readonly HUMAN_ACTIONS_THRESHOLD = 3;
  private readonly SUSPICIOUS_PATTERNS = [
    'bot', 'crawler', 'spider', 'scraper', 'automated',
    'selenium', 'phantom', 'headless', 'test'
  ];

  constructor() {}

  /**
   * Détecter si l'utilisateur est un bot
   */
  isBot(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSuspiciousUA = this.SUSPICIOUS_PATTERNS.some(pattern => 
      userAgent.includes(pattern)
    );

    // Vérifier les caractéristiques du navigateur
    const hasWebGL = this.checkWebGL();
    const hasCanvas = this.checkCanvas();
    const hasAudio = this.checkAudio();
    const hasTouch = this.checkTouch();
    const hasPlugins = this.checkPlugins();

    // Un bot aura généralement moins de caractéristiques
    const browserFeatures = [hasWebGL, hasCanvas, hasAudio, hasTouch, hasPlugins];
    const featureCount = browserFeatures.filter(Boolean).length;

    // Vérifier la résolution d'écran
    const screenResolution = this.checkScreenResolution();

    // Vérifier les événements de souris
    const mouseEvents = this.checkMouseEvents();

    return isSuspiciousUA || 
           featureCount < 2 || 
           !screenResolution.normal || 
           !mouseEvents.normal;
  }

  /**
   * Vérifier WebGL
   */
  private checkWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Vérifier Canvas
   */
  private checkCanvas(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      
      // Test de rendu
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('test', 2, 2);
      
      return canvas.toDataURL() !== canvas.toDataURL();
    } catch (e) {
      return false;
    }
  }

  /**
   * Vérifier Audio
   */
  private checkAudio(): boolean {
    try {
      const audio = new Audio();
      return !!(audio.canPlayType && audio.canPlayType('audio/mpeg'));
    } catch (e) {
      return false;
    }
  }

  /**
   * Vérifier Touch
   */
  private checkTouch(): boolean {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0;
  }

  /**
   * Vérifier les plugins
   */
  private checkPlugins(): boolean {
    return navigator.plugins && navigator.plugins.length > 0;
  }

  /**
   * Vérifier la résolution d'écran
   */
  private checkScreenResolution(): { normal: boolean; width: number; height: number } {
    const width = screen.width;
    const height = screen.height;
    
    // Résolutions suspectes (trop petites ou trop grandes)
    const suspiciousResolutions = [
      { w: 1024, h: 768 },   // Résolution de test commune
      { w: 800, h: 600 },    // Résolution de test
      { w: 1920, h: 1080 },  // Résolution de bureau standard
      { w: 1366, h: 768 }     // Résolution de laptop standard
    ];

    const isSuspicious = suspiciousResolutions.some(res => 
      res.w === width && res.h === height
    );

    return {
      normal: !isSuspicious && width > 400 && height > 300,
      width,
      height
    };
  }

  /**
   * Vérifier les événements de souris
   */
  private checkMouseEvents(): { normal: boolean; events: number } {
    let mouseEventCount = 0;
    
    const mouseHandler = () => {
      mouseEventCount++;
    };

    // Écouter les événements de souris pendant 5 secondes
    document.addEventListener('mousemove', mouseHandler);
    document.addEventListener('mousedown', mouseHandler);
    document.addEventListener('mouseup', mouseHandler);
    document.addEventListener('click', mouseHandler);

    setTimeout(() => {
      document.removeEventListener('mousemove', mouseHandler);
      document.removeEventListener('mousedown', mouseHandler);
      document.removeEventListener('mouseup', mouseHandler);
      document.removeEventListener('click', mouseHandler);
    }, 5000);

    return {
      normal: mouseEventCount > 0,
      events: mouseEventCount
    };
  }

  /**
   * Vérifier le comportement humain
   */
  checkHumanBehavior(): Promise<boolean> {
    return new Promise((resolve) => {
      let humanActions = 0;
      let startTime = Date.now();

      const actionHandler = () => {
        humanActions++;
        
        // Si assez d'actions humaines détectées
        if (humanActions >= this.HUMAN_ACTIONS_THRESHOLD) {
          resolve(true);
          cleanup();
        }
      };

      const cleanup = () => {
        document.removeEventListener('mousemove', actionHandler);
        document.removeEventListener('keydown', actionHandler);
        document.removeEventListener('scroll', actionHandler);
        document.removeEventListener('click', actionHandler);
      };

      // Écouter les actions humaines
      document.addEventListener('mousemove', actionHandler);
      document.addEventListener('keydown', actionHandler);
      document.addEventListener('scroll', actionHandler);
      document.addEventListener('click', actionHandler);

      // Timeout après 10 secondes
      setTimeout(() => {
        resolve(humanActions >= this.HUMAN_ACTIONS_THRESHOLD);
        cleanup();
      }, 10000);
    });
  }

  /**
   * Vérifier les patterns de frappe
   */
  checkTypingPattern(): boolean {
    const typingEvents: number[] = [];
    let lastKeyTime = 0;

    const keyHandler = (event: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - lastKeyTime;
      
      if (lastKeyTime > 0) {
        typingEvents.push(timeDiff);
      }
      
      lastKeyTime = now;
    };

    document.addEventListener('keydown', keyHandler);

    // Analyser après 5 secondes
    setTimeout(() => {
      document.removeEventListener('keydown', keyHandler);
      
      if (typingEvents.length < 3) {
        return false; // Pas assez de frappe
      }

      // Calculer la variance des intervalles
      const avgInterval = typingEvents.reduce((a, b) => a + b, 0) / typingEvents.length;
      const variance = typingEvents.reduce((sum, interval) => 
        sum + Math.pow(interval - avgInterval, 2), 0
      ) / typingEvents.length;

      // Les humains ont une variance plus élevée
      return variance > 100;
    }, 5000);

    return true;
  }

  /**
   * Vérifier la présence de captcha
   */
  async verifyCaptcha(): Promise<boolean> {
    // Implémentation simple de vérification
    // Dans une vraie application, vous utiliseriez reCAPTCHA ou hCaptcha
    
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Les mobiles sont généralement des humains
    if (isMobile) {
      return true;
    }

    // Vérifier les caractéristiques du navigateur
    const hasWebGL = this.checkWebGL();
    const hasCanvas = this.checkCanvas();
    
    return hasWebGL && hasCanvas;
  }

  /**
   * Obtenir un score de confiance
   */
  async getConfidenceScore(): Promise<number> {
    let score = 0;
    const maxScore = 100;

    // User Agent (20 points)
    const userAgent = navigator.userAgent.toLowerCase();
    const isSuspiciousUA = this.SUSPICIOUS_PATTERNS.some(pattern => 
      userAgent.includes(pattern)
    );
    if (!isSuspiciousUA) score += 20;

    // Caractéristiques du navigateur (30 points)
    const features = [
      this.checkWebGL(),
      this.checkCanvas(),
      this.checkAudio(),
      this.checkTouch(),
      this.checkPlugins()
    ];
    score += (features.filter(Boolean).length / features.length) * 30;

    // Résolution d'écran (20 points)
    const resolution = this.checkScreenResolution();
    if (resolution.normal) score += 20;

    // Comportement humain (30 points)
    try {
      const isHuman = await this.checkHumanBehavior();
      if (isHuman) score += 30;
    } catch (e) {
      // En cas d'erreur, ne pas pénaliser
    }

    return Math.min(score, maxScore);
  }

  /**
   * Bloquer les bots détectés
   */
  blockBot(): void {
    // Rediriger vers une page d'erreur ou afficher un message
    const blockedMessage = `
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h2>Accès Non Autorisé</h2>
        <p>L'accès automatisé à ce site n'est pas autorisé.</p>
        <p>Si vous êtes un utilisateur légitime, veuillez désactiver vos extensions de navigateur et réessayer.</p>
      </div>
    `;
    
    document.body.innerHTML = blockedMessage;
  }

  /**
   * Vérifier et bloquer si nécessaire
   */
  async checkAndBlock(): Promise<boolean> {
    const isBotDetected = this.isBot();
    
    if (isBotDetected) {
      const confidenceScore = await this.getConfidenceScore();
      
      if (confidenceScore < 30) {
        this.blockBot();
        return false; // Accès bloqué
      }
    }
    
    return true; // Accès autorisé
  }
}
