import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface NewsletterSubscriber {
  email: string;
  name?: string;
  subscribedAt: Date;
  preferences: {
    articles: boolean;
    videos: boolean;
    podcasts: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {
  private readonly GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQhp69hgYM9qEfxScvamEGrJ3iYL_1unpoghHUDRhBA18ZR5u0wG-afPYnb2dy7re8rQ/exec';
  private readonly STORAGE_KEY = 'newsletter_subscribers';
  
  private subscribersSubject = new BehaviorSubject<NewsletterSubscriber[]>([]);
  public subscribers$ = this.subscribersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSubscribers();
  }

  /**
   * Sauvegarder un abonné dans Google Sheets
   */
  async saveSubscriberToSheets(subscriber: NewsletterSubscriber): Promise<boolean> {
    try {
      const data = {
        email: subscriber.email,
        name: subscriber.name || '',
        subscribedAt: subscriber.subscribedAt.toISOString(),
        preferences: JSON.stringify(subscriber.preferences),
        source: 'website'
      };

      const response = await this.http.post(this.GOOGLE_APPS_SCRIPT_URL, data).toPromise();
      console.log('Abonné sauvegardé dans Google Sheets:', response);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans Google Sheets:', error);
      return false;
    }
  }

  /**
   * Charger tous les abonnés depuis Google Sheets
   */
  async loadSubscribersFromSheets(): Promise<NewsletterSubscriber[]> {
    try {
      const response = await this.http.get(`${this.GOOGLE_APPS_SCRIPT_URL}?action=getSubscribers`).toPromise() as any;
      
      if (response && response.subscribers) {
        const subscribers = response.subscribers.map((sub: any) => ({
          email: sub.email,
          name: sub.name,
          subscribedAt: new Date(sub.subscribedAt),
          preferences: JSON.parse(sub.preferences || '{"articles":true,"videos":true,"podcasts":true}')
        }));
        
        this.saveSubscribers(subscribers);
        this.subscribersSubject.next(subscribers);
        return subscribers;
      }
      
      return [];
    } catch (error) {
      console.error('Erreur lors du chargement depuis Google Sheets:', error);
      return this.getSubscribers();
    }
  }

  /**
   * Synchroniser les abonnés locaux avec Google Sheets
   */
  async syncSubscribers(): Promise<void> {
    const localSubscribers = this.getSubscribers();
    
    for (const subscriber of localSubscribers) {
      await this.saveSubscriberToSheets(subscriber);
    }
  }

  /**
   * Charger les abonnés depuis le stockage local
   */
  private loadSubscribers(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const subscribers = JSON.parse(stored);
        this.subscribersSubject.next(subscribers);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des abonnés:', error);
    }
  }

  /**
   * Sauvegarder les abonnés dans le stockage local
   */
  private saveSubscribers(subscribers: NewsletterSubscriber[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(subscribers));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des abonnés:', error);
    }
  }

  /**
   * Obtenir la liste des abonnés
   */
  getSubscribers(): NewsletterSubscriber[] {
    return this.subscribersSubject.value;
  }

  /**
   * Obtenir le nombre d'abonnés
   */
  getSubscribersCount(): number {
    return this.getSubscribers().length;
  }

  /**
   * Vérifier si un email est abonné
   */
  isSubscribed(email: string): boolean {
    return this.getSubscribers().some(sub => sub.email === email);
  }

  /**
   * Ajouter un abonné
   */
  addSubscriber(subscriber: NewsletterSubscriber): void {
    const subscribers = this.getSubscribers();
    const updatedSubscribers = [...subscribers, subscriber];
    
    this.saveSubscribers(updatedSubscribers);
    this.subscribersSubject.next(updatedSubscribers);
    
    // Sauvegarder dans Google Sheets en arrière-plan
    this.saveSubscriberToSheets(subscriber);
  }

  /**
   * Supprimer un abonné
   */
  removeSubscriber(email: string): boolean {
    const subscribers = this.getSubscribers();
    const updatedSubscribers = subscribers.filter(sub => sub.email !== email);
    
    this.saveSubscribers(updatedSubscribers);
    this.subscribersSubject.next(updatedSubscribers);
    
    return true;
  }
}
