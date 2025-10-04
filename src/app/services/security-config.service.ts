import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigService {
  
  // Configuration sécurisée avec validation
  private readonly config = {
    googleSheetsUrl: environment.googleSheetsUrl || '',
    resendApiKey: environment.resendApiKey || '',
    fromEmail: environment.fromEmail || 'noreply@liberteiyac.com',
    gaTrackingId: environment.gaTrackingId || 'G-JJDC6WW0HV'
  };

  constructor() {
    this.validateConfig();
  }

  /**
   * Valider la configuration
   */
  private validateConfig(): void {
    const requiredFields = ['googleSheetsUrl'];
    
    for (const field of requiredFields) {
      if (!this.config[field as keyof typeof this.config]) {
        console.warn(`Configuration manquante: ${field}`);
      }
    }
  }

  /**
   * Obtenir l'URL Google Sheets de manière sécurisée
   */
  getGoogleSheetsUrl(): string {
    if (!this.config.googleSheetsUrl) {
      throw new Error('URL Google Sheets non configurée');
    }
    
    // Validation de l'URL
    if (!this.isValidGoogleAppsScriptUrl(this.config.googleSheetsUrl)) {
      throw new Error('URL Google Sheets invalide');
    }
    
    return this.config.googleSheetsUrl;
  }

  /**
   * Obtenir la clé API Resend de manière sécurisée
   */
  getResendApiKey(): string {
    if (!this.config.resendApiKey) {
      throw new Error('Clé API Resend non configurée');
    }
    
    // Validation de la clé API
    if (!this.isValidResendApiKey(this.config.resendApiKey)) {
      throw new Error('Clé API Resend invalide');
    }
    
    return this.config.resendApiKey;
  }

  /**
   * Obtenir l'email d'envoi
   */
  getFromEmail(): string {
    if (!this.isValidEmail(this.config.fromEmail)) {
      throw new Error('Email d\'envoi invalide');
    }
    
    return this.config.fromEmail;
  }

  /**
   * Obtenir l'ID de tracking Google Analytics
   */
  getGaTrackingId(): string {
    if (!this.isValidGaTrackingId(this.config.gaTrackingId)) {
      throw new Error('ID Google Analytics invalide');
    }
    
    return this.config.gaTrackingId;
  }

  /**
   * Valider l'URL Google Apps Script
   */
  private isValidGoogleAppsScriptUrl(url: string): boolean {
    const pattern = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
    return pattern.test(url);
  }

  /**
   * Valider la clé API Resend
   */
  private isValidResendApiKey(key: string): boolean {
    const pattern = /^re_[A-Za-z0-9_-]+$/;
    return pattern.test(key);
  }

  /**
   * Valider un email
   */
  private isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  /**
   * Valider l'ID Google Analytics
   */
  private isValidGaTrackingId(id: string): boolean {
    const pattern = /^G-[A-Z0-9]+$/;
    return pattern.test(id);
  }

  /**
   * Obtenir la configuration complète (pour debug uniquement)
   */
  getConfig(): any {
    return {
      ...this.config,
      resendApiKey: this.config.resendApiKey ? '***' + this.config.resendApiKey.slice(-4) : 'Non configuré'
    };
  }
}
