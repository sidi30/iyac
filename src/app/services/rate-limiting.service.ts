import { Injectable } from '@angular/core';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RateLimitingService {
  private readonly STORAGE_PREFIX = 'rate_limit_';
  private readonly DEFAULT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly DEFAULT_LIMIT = 100; // 100 requêtes par fenêtre
  private readonly BLOCK_DURATION = 60 * 60 * 1000; // 1 heure de blocage

  // Limites spécifiques par type d'action
  private readonly ACTION_LIMITS = {
    newsletter_subscribe: { limit: 5, window: 5 * 60 * 1000 }, // 5 inscriptions par 5 minutes
    newsletter_unsubscribe: { limit: 10, window: 5 * 60 * 1000 }, // 10 désinscriptions par 5 minutes
    content_view: { limit: 200, window: 15 * 60 * 1000 }, // 200 vues par 15 minutes
    search: { limit: 50, window: 5 * 60 * 1000 }, // 50 recherches par 5 minutes
    api_call: { limit: 30, window: 1 * 60 * 1000 }, // 30 appels API par minute
    form_submit: { limit: 10, window: 5 * 60 * 1000 } // 10 soumissions par 5 minutes
  };

  constructor() {}

  /**
   * Vérifier si une action est autorisée
   */
  isAllowed(action: string, identifier?: string): { allowed: boolean; remaining?: number; resetTime?: number; reason?: string } {
    const key = this.getStorageKey(action, identifier);
    const limit = this.getLimitForAction(action);
    
    const entry = this.getRateLimitEntry(key);
    const now = Date.now();

    // Vérifier si l'utilisateur est bloqué
    if (entry.blocked && now < entry.resetTime) {
      const remainingBlockTime = Math.ceil((entry.resetTime - now) / 1000 / 60);
      return {
        allowed: false,
        reason: `Trop de tentatives. Bloqué pour ${remainingBlockTime} minutes.`
      };
    }

    // Réinitialiser le compteur si la fenêtre est expirée
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + limit.window;
      entry.blocked = false;
    }

    // Vérifier la limite
    if (entry.count >= limit.limit) {
      // Bloquer l'utilisateur si limite dépassée
      entry.blocked = true;
      entry.resetTime = now + this.BLOCK_DURATION;
      this.saveRateLimitEntry(key, entry);
      
      return {
        allowed: false,
        reason: `Limite de ${limit.limit} ${action} par ${Math.ceil(limit.window / 1000 / 60)} minutes atteinte.`
      };
    }

    // Incrémenter le compteur
    entry.count++;
    this.saveRateLimitEntry(key, entry);

    const remaining = limit.limit - entry.count;
    const resetTime = Math.ceil((entry.resetTime - now) / 1000 / 60);

    return {
      allowed: true,
      remaining,
      resetTime
    };
  }

  /**
   * Enregistrer une action réussie
   */
  recordAction(action: string, identifier?: string): void {
    const key = this.getStorageKey(action, identifier);
    const entry = this.getRateLimitEntry(key);
    
    // Ne pas incrémenter si déjà enregistré dans isAllowed
    // Cette méthode est pour les actions supplémentaires
  }

  /**
   * Obtenir les statistiques de rate limiting
   */
  getStats(action: string, identifier?: string): { count: number; limit: number; remaining: number; resetTime: number; blocked: boolean } {
    const key = this.getStorageKey(action, identifier);
    const limit = this.getLimitForAction(action);
    const entry = this.getRateLimitEntry(key);
    const now = Date.now();

    let count = entry.count;
    let resetTime = entry.resetTime;
    let blocked = entry.blocked;

    // Réinitialiser si la fenêtre est expirée
    if (now > entry.resetTime) {
      count = 0;
      resetTime = now + limit.window;
      blocked = false;
    }

    return {
      count,
      limit: limit.limit,
      remaining: Math.max(0, limit.limit - count),
      resetTime: Math.ceil((resetTime - now) / 1000 / 60),
      blocked
    };
  }

  /**
   * Réinitialiser le rate limiting pour un utilisateur
   */
  resetRateLimit(action: string, identifier?: string): void {
    const key = this.getStorageKey(action, identifier);
    localStorage.removeItem(key);
  }

  /**
   * Réinitialiser tous les rate limits
   */
  resetAllRateLimits(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Obtenir la limite pour une action spécifique
   */
  private getLimitForAction(action: string): { limit: number; window: number } {
    return this.ACTION_LIMITS[action as keyof typeof this.ACTION_LIMITS] || {
      limit: this.DEFAULT_LIMIT,
      window: this.DEFAULT_WINDOW
    };
  }

  /**
   * Générer la clé de stockage
   */
  private getStorageKey(action: string, identifier?: string): string {
    const userIdentifier = identifier || this.getUserIdentifier();
    return `${this.STORAGE_PREFIX}${action}_${userIdentifier}`;
  }

  /**
   * Obtenir l'identifiant de l'utilisateur
   */
  private getUserIdentifier(): string {
    // Utiliser l'IP simulée ou un identifiant de session
    return this.getSessionId();
  }

  /**
   * Générer un ID de session unique
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Générer un ID de session
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString();
    const randomBytes = this.generateRandomBytes(8);
    return btoa(timestamp + ':' + randomBytes);
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
   * Obtenir l'entrée de rate limiting
   */
  private getRateLimitEntry(key: string): RateLimitEntry {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Erreur lors du parsing du rate limit:', error);
      }
    }

    return {
      count: 0,
      resetTime: Date.now() + this.DEFAULT_WINDOW,
      blocked: false
    };
  }

  /**
   * Sauvegarder l'entrée de rate limiting
   */
  private saveRateLimitEntry(key: string, entry: RateLimitEntry): void {
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde du rate limit:', error);
    }
  }

  /**
   * Vérifier les patterns suspects
   */
  detectSuspiciousActivity(action: string, identifier?: string): boolean {
    const stats = this.getStats(action, identifier);
    
    // Détecter les patterns suspects
    const suspiciousPatterns = [
      stats.count > stats.limit * 0.8, // Plus de 80% de la limite
      stats.blocked, // Utilisateur bloqué
      this.getConsecutiveFailures(identifier) > 3 // Plus de 3 échecs consécutifs
    ];

    return suspiciousPatterns.some(pattern => pattern);
  }

  /**
   * Obtenir le nombre d'échecs consécutifs
   */
  private getConsecutiveFailures(identifier?: string): number {
    const key = `consecutive_failures_${identifier || this.getUserIdentifier()}`;
    const failures = localStorage.getItem(key);
    return failures ? parseInt(failures, 10) : 0;
  }

  /**
   * Enregistrer un échec
   */
  recordFailure(identifier?: string): void {
    const key = `consecutive_failures_${identifier || this.getUserIdentifier()}`;
    const currentFailures = this.getConsecutiveFailures(identifier);
    localStorage.setItem(key, (currentFailures + 1).toString());
  }

  /**
   * Réinitialiser les échecs
   */
  resetFailures(identifier?: string): void {
    const key = `consecutive_failures_${identifier || this.getUserIdentifier()}`;
    localStorage.removeItem(key);
  }
}
