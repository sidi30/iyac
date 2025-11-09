import { Injectable } from '@angular/core';

/**
 * Service d'authentification pour la page de rédaction
 * Gère l'authentification par mot de passe pour accéder à l'espace rédaction
 */
@Injectable({
  providedIn: 'root'
})
export class RedactionAuthService {
  private readonly PASSWORD = '@Africa2024!Injustice';
  private readonly STORAGE_KEY = 'redaction_auth';
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

  constructor() {}

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const authData = this.getAuthData();
    
    if (!authData) {
      return false;
    }

    // Vérifier si la session n'a pas expiré
    const now = Date.now();
    if (now > authData.expiresAt) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Authentifie l'utilisateur avec le mot de passe
   */
  authenticate(password: string): boolean {
    if (password === this.PASSWORD) {
      const authData = {
        authenticated: true,
        expiresAt: Date.now() + this.SESSION_DURATION
      };
      
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
      return true;
    }
    
    return false;
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Récupère les données d'authentification du storage
   */
  private getAuthData(): { authenticated: boolean; expiresAt: number } | null {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}

