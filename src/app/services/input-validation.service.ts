import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputValidationService {

  constructor() {}

  /**
   * Valider et nettoyer un email
   */
  validateEmail(email: string): { isValid: boolean; cleanedEmail?: string; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email requis' };
    }

    // Nettoyer l'email
    const cleanedEmail = email.trim().toLowerCase();

    // Validation de longueur
    if (cleanedEmail.length > 254) {
      return { isValid: false, error: 'Email trop long' };
    }

    // Validation du format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(cleanedEmail)) {
      return { isValid: false, error: 'Format d\'email invalide' };
    }

    // Vérifier les domaines suspects
    const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = cleanedEmail.split('@')[1];
    
    if (suspiciousDomains.includes(domain)) {
      return { isValid: false, error: 'Type d\'email non autorisé' };
    }

    return { isValid: true, cleanedEmail };
  }

  /**
   * Valider et nettoyer un nom
   */
  validateName(name: string): { isValid: boolean; cleanedName?: string; error?: string } {
    if (!name || typeof name !== 'string') {
      return { isValid: true, cleanedName: '' }; // Nom optionnel
    }

    // Nettoyer le nom
    const cleanedName = name.trim();

    // Validation de longueur
    if (cleanedName.length > 100) {
      return { isValid: false, error: 'Nom trop long' };
    }

    // Validation du contenu (lettres, espaces, tirets, apostrophes uniquement)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    
    if (!nameRegex.test(cleanedName)) {
      return { isValid: false, error: 'Nom contient des caractères non autorisés' };
    }

    return { isValid: true, cleanedName };
  }

  /**
   * Valider les préférences de newsletter
   */
  validatePreferences(preferences: any): { isValid: boolean; cleanedPreferences?: any; error?: string } {
    if (!preferences || typeof preferences !== 'object') {
      return { isValid: false, error: 'Préférences requises' };
    }

    const cleanedPreferences = {
      articles: Boolean(preferences.articles),
      videos: Boolean(preferences.videos),
      podcasts: Boolean(preferences.podcasts)
    };

    // Au moins une préférence doit être activée
    if (!cleanedPreferences.articles && !cleanedPreferences.videos && !cleanedPreferences.podcasts) {
      return { isValid: false, error: 'Au moins une préférence doit être sélectionnée' };
    }

    return { isValid: true, cleanedPreferences };
  }

  /**
   * Valider une URL
   */
  validateUrl(url: string): { isValid: boolean; cleanedUrl?: string; error?: string } {
    if (!url || typeof url !== 'string') {
      return { isValid: false, error: 'URL requise' };
    }

    try {
      const urlObj = new URL(url);
      
      // Vérifier le protocole
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Protocole non autorisé' };
      }

      // Vérifier l'hostname (pas d'IP privées)
      const hostname = urlObj.hostname;
      if (this.isPrivateIP(hostname)) {
        return { isValid: false, error: 'Adresse IP privée non autorisée' };
      }

      return { isValid: true, cleanedUrl: url };
    } catch (error) {
      return { isValid: false, error: 'URL invalide' };
    }
  }

  /**
   * Valider le contenu HTML
   */
  validateHtmlContent(content: string): { isValid: boolean; cleanedContent?: string; error?: string } {
    if (!content || typeof content !== 'string') {
      return { isValid: false, error: 'Contenu requis' };
    }

    // Validation de longueur
    if (content.length > 50000) {
      return { isValid: false, error: 'Contenu trop long' };
    }

    // Vérifier les balises dangereuses
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
    const dangerousRegex = new RegExp(`<(${dangerousTags.join('|')})[^>]*>`, 'gi');
    
    if (dangerousRegex.test(content)) {
      return { isValid: false, error: 'Contenu contient des éléments dangereux' };
    }

    // Vérifier les attributs dangereux
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'javascript:', 'data:'];
    const hasDangerousAttributes = dangerousAttributes.some(attr => 
      content.toLowerCase().includes(attr)
    );
    
    if (hasDangerousAttributes) {
      return { isValid: false, error: 'Contenu contient des attributs dangereux' };
    }

    return { isValid: true, cleanedContent: content };
  }

  /**
   * Vérifier si une IP est privée
   */
  private isPrivateIP(hostname: string): boolean {
    // Regex pour les IPs privées
    const privateIPRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|169\.254\.|::1|fc00::|fe80::)/;
    return privateIPRegex.test(hostname);
  }

  /**
   * Valider un objet complet d'abonnement
   */
  validateSubscriptionData(data: any): { isValid: boolean; cleanedData?: any; errors?: string[] } {
    const errors: string[] = [];
    const cleanedData: any = {};

    // Valider l'email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    } else {
      cleanedData.email = emailValidation.cleanedEmail;
    }

    // Valider le nom
    const nameValidation = this.validateName(data.name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error!);
    } else {
      cleanedData.name = nameValidation.cleanedName;
    }

    // Valider les préférences
    const preferencesValidation = this.validatePreferences(data.preferences);
    if (!preferencesValidation.isValid) {
      errors.push(preferencesValidation.error!);
    } else {
      cleanedData.preferences = preferencesValidation.cleanedPreferences;
    }

    return {
      isValid: errors.length === 0,
      cleanedData: errors.length === 0 ? cleanedData : undefined,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
