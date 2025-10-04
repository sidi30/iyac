import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SecurityConfigService } from './security-config.service';

export interface SecurityEvent {
  type: 'xss_attempt' | 'csrf_attack' | 'rate_limit_exceeded' | 'suspicious_activity' | 'validation_failure' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  timestamp: Date;
  userAgent: string;
  ip?: string;
  sessionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityMonitoringService {
  private readonly MAX_EVENTS_STORED = 1000;
  private readonly CRITICAL_EVENTS_THRESHOLD = 10;
  private readonly TIME_WINDOW = 5 * 60 * 1000; // 5 minutes
  private securityEvents: SecurityEvent[] = [];

  constructor(
    private http: HttpClient,
    private securityConfig: SecurityConfigService
  ) {
    this.loadStoredEvents();
    this.startPeriodicCleanup();
  }

  /**
   * Enregistrer un événement de sécurité
   */
  logSecurityEvent(
    type: SecurityEvent['type'],
    severity: SecurityEvent['severity'],
    message: string,
    details: any = {}
  ): void {
    const event: SecurityEvent = {
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };

    this.securityEvents.push(event);
    this.trimEvents();
    this.saveEvents();

    // Alerte pour les événements critiques
    if (severity === 'critical') {
      this.handleCriticalEvent(event);
    }

    // Vérifier les patterns suspects
    this.checkSuspiciousPatterns();

    console.warn(`🚨 Événement de sécurité [${severity.toUpperCase()}]: ${message}`, event);
  }

  /**
   * Enregistrer une tentative XSS
   */
  logXssAttempt(content: string, sanitizedContent: string): void {
    this.logSecurityEvent(
      'xss_attempt',
      'high',
      'Tentative d\'injection XSS détectée',
      {
        originalContent: content.substring(0, 200),
        sanitizedContent: sanitizedContent.substring(0, 200),
        contentLength: content.length
      }
    );
  }

  /**
   * Enregistrer une attaque CSRF
   */
  logCsrfAttack(token: string, expectedToken: string): void {
    this.logSecurityEvent(
      'csrf_attack',
      'critical',
      'Tentative d\'attaque CSRF détectée',
      {
        providedToken: token.substring(0, 10) + '...',
        expectedToken: expectedToken.substring(0, 10) + '...',
        tokensMatch: token === expectedToken
      }
    );
  }

  /**
   * Enregistrer un dépassement de rate limit
   */
  logRateLimitExceeded(action: string, limit: number, attempts: number): void {
    this.logSecurityEvent(
      'rate_limit_exceeded',
      'medium',
      `Limite de taux dépassée pour l'action: ${action}`,
      {
        action,
        limit,
        attempts,
        ratio: attempts / limit
      }
    );
  }

  /**
   * Enregistrer une activité suspecte
   */
  logSuspiciousActivity(activity: string, details: any): void {
    this.logSecurityEvent(
      'suspicious_activity',
      'high',
      `Activité suspecte détectée: ${activity}`,
      details
    );
  }

  /**
   * Enregistrer un échec de validation
   */
  logValidationFailure(field: string, value: string, error: string): void {
    this.logSecurityEvent(
      'validation_failure',
      'low',
      `Échec de validation pour le champ: ${field}`,
      {
        field,
        value: value.substring(0, 50),
        error,
        valueLength: value.length
      }
    );
  }

  /**
   * Enregistrer un accès non autorisé
   */
  logUnauthorizedAccess(resource: string, method: string): void {
    this.logSecurityEvent(
      'unauthorized_access',
      'high',
      `Tentative d'accès non autorisé à: ${resource}`,
      {
        resource,
        method,
        url: window.location.href
      }
    );
  }

  /**
   * Obtenir les événements de sécurité récents
   */
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Obtenir les événements par type
   */
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.securityEvents.filter(event => event.type === type);
  }

  /**
   * Obtenir les événements par sévérité
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.securityEvents.filter(event => event.severity === severity);
  }

  /**
   * Obtenir les statistiques de sécurité
   */
  getSecurityStats(): {
    totalEvents: number;
    eventsByType: { [key: string]: number };
    eventsBySeverity: { [key: string]: number };
    criticalEventsLast24h: number;
    suspiciousActivityCount: number;
  } {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);

    const eventsByType: { [key: string]: number } = {};
    const eventsBySeverity: { [key: string]: number } = {};

    let criticalEventsLast24h = 0;
    let suspiciousActivityCount = 0;

    this.securityEvents.forEach(event => {
      // Compter par type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

      // Compter par sévérité
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;

      // Événements critiques des dernières 24h
      if (event.severity === 'critical' && event.timestamp.getTime() > last24h) {
        criticalEventsLast24h++;
      }

      // Activités suspectes
      if (event.type === 'suspicious_activity') {
        suspiciousActivityCount++;
      }
    });

    return {
      totalEvents: this.securityEvents.length,
      eventsByType,
      eventsBySeverity,
      criticalEventsLast24h,
      suspiciousActivityCount
    };
  }

  /**
   * Gérer un événement critique
   */
  private handleCriticalEvent(event: SecurityEvent): void {
    // Bloquer l'utilisateur temporairement
    this.blockUser(event.sessionId);

    // Envoyer une alerte (si configuré)
    this.sendSecurityAlert(event);

    // Sauvegarder l'événement critique
    this.saveCriticalEvent(event);
  }

  /**
   * Bloquer un utilisateur
   */
  private blockUser(sessionId: string): void {
    const blockKey = `blocked_user_${sessionId}`;
    const blockUntil = Date.now() + (30 * 60 * 1000); // 30 minutes
    localStorage.setItem(blockKey, blockUntil.toString());
  }

  /**
   * Vérifier si un utilisateur est bloqué
   */
  isUserBlocked(sessionId: string): boolean {
    const blockKey = `blocked_user_${sessionId}`;
    const blockUntil = localStorage.getItem(blockKey);
    
    if (!blockUntil) {
      return false;
    }

    const blockTime = parseInt(blockUntil, 10);
    if (Date.now() > blockTime) {
      localStorage.removeItem(blockKey);
      return false;
    }

    return true;
  }

  /**
   * Vérifier les patterns suspects
   */
  private checkSuspiciousPatterns(): void {
    const recentEvents = this.getRecentEvents(100);
    const now = Date.now();
    const timeWindow = this.TIME_WINDOW;

    // Vérifier les événements critiques répétés
    const criticalEvents = recentEvents.filter(event => 
      event.severity === 'critical' && 
      (now - event.timestamp.getTime()) < timeWindow
    );

    if (criticalEvents.length >= this.CRITICAL_EVENTS_THRESHOLD) {
      this.logSecurityEvent(
        'suspicious_activity',
        'critical',
        `Pattern suspect détecté: ${criticalEvents.length} événements critiques en ${timeWindow / 1000 / 60} minutes`,
        {
          criticalEventsCount: criticalEvents.length,
          timeWindow: timeWindow / 1000 / 60,
          threshold: this.CRITICAL_EVENTS_THRESHOLD
        }
      );
    }

    // Vérifier les tentatives XSS répétées
    const xssAttempts = recentEvents.filter(event => 
      event.type === 'xss_attempt' && 
      (now - event.timestamp.getTime()) < timeWindow
    );

    if (xssAttempts.length >= 5) {
      this.logSecurityEvent(
        'suspicious_activity',
        'high',
        `Pattern suspect détecté: ${xssAttempts.length} tentatives XSS en ${timeWindow / 1000 / 60} minutes`,
        {
          xssAttemptsCount: xssAttempts.length,
          timeWindow: timeWindow / 1000 / 60
        }
      );
    }
  }

  /**
   * Envoyer une alerte de sécurité
   */
  private sendSecurityAlert(event: SecurityEvent): void {
    // Implémentation pour envoyer une alerte (email, webhook, etc.)
    console.error('🚨 ALERTE DE SÉCURITÉ CRITIQUE:', event);
    
    // Ici vous pourriez envoyer un email ou une notification
    // via votre service de notification
  }

  /**
   * Sauvegarder un événement critique
   */
  private saveCriticalEvent(event: SecurityEvent): void {
    const criticalEvents = JSON.parse(localStorage.getItem('critical_security_events') || '[]');
    criticalEvents.push(event);
    
    // Garder seulement les 50 derniers événements critiques
    if (criticalEvents.length > 50) {
      criticalEvents.splice(0, criticalEvents.length - 50);
    }
    
    localStorage.setItem('critical_security_events', JSON.stringify(criticalEvents));
  }

  /**
   * Nettoyer les anciens événements
   */
  private trimEvents(): void {
    if (this.securityEvents.length > this.MAX_EVENTS_STORED) {
      this.securityEvents = this.securityEvents
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, this.MAX_EVENTS_STORED);
    }
  }

  /**
   * Sauvegarder les événements
   */
  private saveEvents(): void {
    try {
      localStorage.setItem('security_events', JSON.stringify(this.securityEvents));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des événements de sécurité:', error);
    }
  }

  /**
   * Charger les événements stockés
   */
  private loadStoredEvents(): void {
    try {
      const stored = localStorage.getItem('security_events');
      if (stored) {
        const events = JSON.parse(stored);
        this.securityEvents = events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des événements de sécurité:', error);
      this.securityEvents = [];
    }
  }

  /**
   * Nettoyage périodique
   */
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures
      
      this.securityEvents = this.securityEvents.filter(event => 
        (now - event.timestamp.getTime()) < maxAge
      );
      
      this.saveEvents();
    }, 60 * 60 * 1000); // Toutes les heures
  }

  /**
   * Obtenir l'ID de session
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
   * Exporter les événements de sécurité
   */
  exportSecurityEvents(): string {
    return JSON.stringify(this.securityEvents, null, 2);
  }

  /**
   * Effacer tous les événements
   */
  clearAllEvents(): void {
    this.securityEvents = [];
    localStorage.removeItem('security_events');
    localStorage.removeItem('critical_security_events');
  }
}
