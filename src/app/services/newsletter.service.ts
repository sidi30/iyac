import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NewsletterSubscription {
  email: string;
  subscriptionDate: Date;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private subscriptionsSubject = new BehaviorSubject<NewsletterSubscription[]>([]);

  constructor() { }

  subscribe(email: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Simulation d'une inscription à la newsletter
      setTimeout(() => {
        const currentSubscriptions = this.subscriptionsSubject.value;
        const existingSubscription = currentSubscriptions.find(sub => sub.email === email);

        if (existingSubscription) {
          observer.next({ success: false, message: 'Cette adresse email est déjà inscrite à notre newsletter.' });
        } else {
          const newSubscription: NewsletterSubscription = {
            email,
            subscriptionDate: new Date(),
            isActive: true
          };

          currentSubscriptions.push(newSubscription);
          this.subscriptionsSubject.next(currentSubscriptions);

          observer.next({ success: true, message: 'Inscription réussie ! Merci de vous être abonné à notre newsletter.' });
        }
        observer.complete();
      }, 1000);
    });
  }

  getSubscriptions(): Observable<NewsletterSubscription[]> {
    return this.subscriptionsSubject.asObservable();
  }

  unsubscribe(email: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentSubscriptions = this.subscriptionsSubject.value;
        const index = currentSubscriptions.findIndex(sub => sub.email === email);

        if (index !== -1) {
          currentSubscriptions[index].isActive = false;
          this.subscriptionsSubject.next(currentSubscriptions);
          observer.next({ success: true, message: 'Désinscription réussie.' });
        } else {
          observer.next({ success: false, message: 'Adresse email non trouvée.' });
        }
        observer.complete();
      }, 1000);
    });
  }
}
