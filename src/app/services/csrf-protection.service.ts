import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CsrfProtectionService {
  private csrfToken: string | null = null;
  private readonly TOKEN_STORAGE_KEY = 'csrf_token';
  private readonly TOKEN_EXPIRY_KEY = 'csrf_token_expiry';
  private readonly TOKEN_LIFETIME = 30 * 60 * 1000; // 30 minutes

  constructor(private http: HttpClient) {
    this.loadStoredToken();
  }

  /**
   * Générer un token CSRF
   */
  generateCsrfToken(): string {
    const timestamp = Date.now().toString();
    const randomBytes = this.generateRandomBytes(16);
    const token = btoa(timestamp + ':' + randomBytes);
    
    this.csrfToken = token;
    this.storeToken(token);
    
    return token;
  }

  /**
   * Obtenir le token CSRF actuel
   */
  getCsrfToken(): string {
    if (!this.csrfToken || this.isTokenExpired()) {
      return this.generateCsrfToken();
    }
    
    return this.csrfToken;
  }

  /**
   * Valider un token CSRF
   */
  validateCsrfToken(token: string): boolean {
    if (!token || !this.csrfToken) {
      return false;
    }

    // Vérifier l'expiration
    if (this.isTokenExpired()) {
      return false;
    }

    // Comparer les tokens
    return token === this.csrfToken;
  }

  /**
   * Ajouter le token CSRF aux headers HTTP
   */
  getCsrfHeaders(): { [key: string]: string } {
    return {
      'X-CSRF-Token': this.getCsrfToken(),
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  /**
   * Vérifier si le token est expiré
   */
  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) {
      return true;
    }

    const expiryTime = parseInt(expiry, 10);
    return Date.now() > expiryTime;
  }

  /**
   * Charger le token stocké
   */
  private loadStoredToken(): void {
    const storedToken = localStorage.getItem(this.TOKEN_STORAGE_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (storedToken && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        this.csrfToken = storedToken;
      } else {
        this.clearStoredToken();
      }
    }
  }

  /**
   * Stocker le token
   */
  private storeToken(token: string): void {
    const expiryTime = Date.now() + this.TOKEN_LIFETIME;
    
    localStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Supprimer le token stocké
   */
  private clearStoredToken(): void {
    localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    this.csrfToken = null;
  }

  /**
   * Générer des bytes aléatoires
   */
  private generateRandomBytes(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Renouveler le token CSRF
   */
  refreshCsrfToken(): string {
    this.clearStoredToken();
    return this.generateCsrfToken();
  }

  /**
   * Vérifier la présence du token dans les headers de réponse
   */
  validateResponseHeaders(headers: any): boolean {
    const responseToken = headers['x-csrf-token'];
    if (responseToken && responseToken !== this.csrfToken) {
      // Token renouvelé côté serveur
      this.csrfToken = responseToken;
      this.storeToken(responseToken);
      return true;
    }
    return true;
  }
}
