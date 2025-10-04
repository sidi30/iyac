import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleSheetsService, NewsletterSubscriber } from './google-sheets.service';
import { SecurityConfigService } from './security-config.service';
import { CsrfProtectionService } from './csrf-protection.service';
import { RateLimitingService } from './rate-limiting.service';
import { SecurityMonitoringService } from './security-monitoring.service';
import { InputValidationService } from './input-validation.service';

export type { NewsletterSubscriber } from './google-sheets.service';

export interface NewsletterContent {
  type: 'article' | 'video' | 'podcast';
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private readonly RESEND_API_URL = 'https://api.resend.com/emails';

  constructor(
    private http: HttpClient,
    private googleSheetsService: GoogleSheetsService,
    private securityConfig: SecurityConfigService,
    private csrfProtection: CsrfProtectionService,
    private rateLimiting: RateLimitingService,
    private securityMonitoring: SecurityMonitoringService,
    private inputValidation: InputValidationService
  ) {}

  public get subscribers$() {
    return this.googleSheetsService.subscribers$;
  }

  /**
   * S'abonner à la newsletter
   */
  async subscribe(email: string, name?: string, preferences?: Partial<NewsletterSubscriber['preferences']>): Promise<boolean> {
    try {
      // Vérifier le rate limiting
      const rateLimitCheck = this.rateLimiting.isAllowed('newsletter_subscribe', email);
      if (!rateLimitCheck.allowed) {
        this.securityMonitoring.logRateLimitExceeded('newsletter_subscribe', 5, 6);
        throw new Error(rateLimitCheck.reason);
      }

      // Valider les données d'entrée
      const validationResult = this.inputValidation.validateSubscriptionData({
        email,
        name,
        preferences
      });

      if (!validationResult.isValid) {
        this.securityMonitoring.logValidationFailure('subscription', email, validationResult.errors?.join(', ') || 'Validation failed');
        throw new Error(validationResult.errors?.join(', ') || 'Données invalides');
      }

      const cleanedData = validationResult.cleanedData!;

      // Vérifier si l'email existe déjà
      if (this.googleSheetsService.isSubscribed(cleanedData.email)) {
        throw new Error('Cet email est déjà abonné à la newsletter');
      }

      // Créer le nouvel abonné
      const newSubscriber: NewsletterSubscriber = {
        email: cleanedData.email,
        name: cleanedData.name,
        subscribedAt: new Date(),
        preferences: cleanedData.preferences
      };

      // Ajouter l'abonné (sauvegarde locale + Google Sheets)
      this.googleSheetsService.addSubscriber(newSubscriber);

      // Enregistrer l'action réussie
      this.rateLimiting.recordAction('newsletter_subscribe', email);

      // Envoyer email de confirmation
      await this.sendWelcomeEmail(newSubscriber);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Se désabonner de la newsletter
   */
  unsubscribe(email: string): boolean {
    try {
      return this.googleSheetsService.removeSubscriber(email);
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      return false;
    }
  }

  /**
   * Envoyer une notification pour nouveau contenu
   */
  async sendContentNotification(content: NewsletterContent): Promise<boolean> {
    try {
      const subscribers = this.googleSheetsService.getSubscribers();
      const relevantSubscribers = subscribers.filter(sub => {
        switch (content.type) {
          case 'article':
            return sub.preferences.articles;
          case 'video':
            return sub.preferences.videos;
          case 'podcast':
            return sub.preferences.podcasts;
          default:
            return true;
        }
      });

      if (relevantSubscribers.length === 0) {
        console.log('Aucun abonné pertinent pour ce type de contenu');
        return true;
      }

      // Envoyer à tous les abonnés pertinents
      const emailPromises = relevantSubscribers.map(subscriber => 
        this.sendContentEmail(subscriber, content)
      );

      await Promise.all(emailPromises);
      
      console.log(`Newsletter envoyée à ${relevantSubscribers.length} abonnés`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la newsletter:', error);
      return false;
    }
  }

  /**
   * Envoyer email de bienvenue
   */
  private async sendWelcomeEmail(subscriber: NewsletterSubscriber): Promise<void> {
    const fromEmail = this.securityConfig.getFromEmail();
    const emailData = {
      from: fromEmail,
      to: [subscriber.email],
      subject: '🎉 Bienvenue dans la newsletter Liberté IYAC',
      html: this.getWelcomeEmailTemplate(subscriber)
    };

    await this.sendEmail(emailData);
  }

  /**
   * Envoyer email de contenu
   */
  private async sendContentEmail(subscriber: NewsletterSubscriber, content: NewsletterContent): Promise<void> {
    const fromEmail = this.securityConfig.getFromEmail();
    const emailData = {
      from: fromEmail,
      to: [subscriber.email],
      subject: `📰 ${this.getContentTypeLabel(content.type)}: ${content.title}`,
      html: this.getContentEmailTemplate(subscriber, content)
    };

    await this.sendEmail(emailData);
  }

  /**
   * Envoyer un email via Resend API
   */
  private async sendEmail(emailData: any): Promise<void> {
    try {
      const apiKey = this.securityConfig.getResendApiKey();
      const fromEmail = this.securityConfig.getFromEmail();
      
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...this.csrfProtection.getCsrfHeaders()
      };

      const response = await this.http.post(this.RESEND_API_URL, {
        ...emailData,
        from: fromEmail
      }, { headers }).toPromise();

      console.log('Email envoyé avec succès:', response);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      this.securityMonitoring.logSecurityEvent('suspicious_activity', 'medium', 'Erreur lors de l\'envoi d\'email', { error });
      throw error;
    }
  }

  /**
   * Obtenir le libellé du type de contenu
   */
  private getContentTypeLabel(type: NewsletterContent['type']): string {
    switch (type) {
      case 'article':
        return 'Nouvel Article';
      case 'video':
        return 'Nouvelle Vidéo';
      case 'podcast':
        return 'Nouveau Podcast';
      default:
        return 'Nouveau Contenu';
    }
  }

  /**
   * Template HTML pour l'email de bienvenue
   */
  private getWelcomeEmailTemplate(subscriber: NewsletterSubscriber): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>Bienvenue - Liberté IYAC</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2563eb; margin: 0; }
              .header p { color: #666; margin: 5px 0 0 0; }
              .content { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
              .footer { border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Liberté IYAC</h1>
                  <p>Voix Unies pour la Justice</p>
              </div>
              
              <h2>Bienvenue ${subscriber.name || 'Cher(e) abonné(e)'} !</h2>
              
              <p>Merci de vous être abonné à notre newsletter. Vous recevrez désormais :</p>
              
              <ul>
                  <li>📰 Nos derniers articles</li>
                  <li>🎥 Nouvelles vidéos</li>
                  <li>🎙️ Podcasts exclusifs</li>
                  <li>🚨 Actualités urgentes</li>
              </ul>
              
              <div class="content">
                  <h3>Notre Mission</h3>
                  <p><em>"La liberté et la justice ne sont pas des privilèges, mais des droits fondamentaux de chaque citoyen."</em></p>
                  <p><strong>- Ibrahim Yacouba</strong></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${window.location.origin}" class="button">Visiter le Site</a>
              </div>
              
              <div class="footer">
                  Vous recevez cet email car vous vous êtes abonné à notre newsletter.<br>
                  <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Se désabonner</a>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  /**
   * Template HTML pour l'email de contenu
   */
  private getContentEmailTemplate(subscriber: NewsletterSubscriber, content: NewsletterContent): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <title>${this.getContentTypeLabel(content.type)} - Liberté IYAC</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .header h1 { color: #2563eb; margin: 0; }
              .header p { color: #666; margin: 5px 0 0 0; }
              .content-header { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .content-header h2 { color: #2563eb; margin-top: 0; }
              .content-header p { font-size: 14px; color: #666; margin-bottom: 0; }
              .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
              .footer { border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Liberté IYAC</h1>
                  <p>Voix Unies pour la Justice</p>
              </div>
              
              <div class="content-header">
                  <h2>${this.getContentTypeLabel(content.type)}</h2>
                  <p>Publié le ${content.publishDate.toLocaleDateString('fr-FR')}</p>
              </div>
              
              <h3 style="color: #1e40af;">${content.title}</h3>
              
              <p style="font-size: 16px; line-height: 1.6;">${content.description}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                  <a href="${window.location.origin}${content.url}" class="button">Lire ${this.getContentTypeLabel(content.type)}</a>
              </div>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h4>Restez Informé(e)</h4>
                  <p>Recevez nos dernières actualités directement dans votre boîte mail.</p>
                  <a href="${window.location.origin}" style="color: #2563eb;">Visiter le site</a>
              </div>
              
              <div class="footer">
                  Vous recevez cet email car vous vous êtes abonné à notre newsletter.<br>
                  <a href="${window.location.origin}/unsubscribe?email=${encodeURIComponent(subscriber.email)}">Se désabonner</a>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  /**
   * Obtenir la liste des abonnés
   */
  getSubscribers(): NewsletterSubscriber[] {
    return this.googleSheetsService.getSubscribers();
  }

  /**
   * Obtenir le nombre d'abonnés
   */
  getSubscribersCount(): number {
    return this.googleSheetsService.getSubscribersCount();
  }

  /**
   * Vérifier si un email est abonné
   */
  isSubscribed(email: string): boolean {
    return this.googleSheetsService.isSubscribed(email);
  }

  /**
   * Mettre à jour les préférences d'un abonné
   */
  updatePreferences(email: string, preferences: Partial<NewsletterSubscriber['preferences']>): boolean {
    // Cette fonctionnalité nécessiterait une mise à jour dans Google Sheets
    // Pour l'instant, on retourne false
    console.log('Mise à jour des préférences non implémentée avec Google Sheets');
    return false;
  }

  /**
   * Synchroniser avec Google Sheets
   */
  async syncWithGoogleSheets(): Promise<void> {
    await this.googleSheetsService.loadSubscribersFromSheets();
  }
}