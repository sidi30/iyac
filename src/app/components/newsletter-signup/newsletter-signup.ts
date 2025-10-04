import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService, NewsletterSubscriber } from '../../services/newsletter.service';

@Component({
  selector: 'app-newsletter-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-signup.html',
  styleUrls: ['./newsletter-signup.scss']
})
export class NewsletterSignupComponent implements OnInit {
  email = '';
  name = '';
  isLoading = false;
  message = '';
  isSuccess = false;
  showPreferences = false;
  preferences = {
    articles: true,
    videos: true,
    podcasts: true
  };
  subscribersCount = 0;

  constructor(private newsletterService: NewsletterService) {}

  ngOnInit() {
    this.subscribersCount = this.newsletterService.getSubscribersCount();
  }

  async onSubmit() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.showMessage('Veuillez entrer une adresse email valide.', false);
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      await this.newsletterService.subscribe(this.email, this.name, this.preferences);
      this.showMessage('🎉 Abonnement réussi ! Vous recevrez nos newsletters.', true);
      this.email = '';
      this.name = '';
      this.showPreferences = false;
      this.subscribersCount = this.newsletterService.getSubscribersCount();
    } catch (error: any) {
      this.showMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.', false);
    } finally {
      this.isLoading = false;
    }
  }

  togglePreferences() {
    this.showPreferences = !this.showPreferences;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private showMessage(message: string, success: boolean) {
    this.message = message;
    this.isSuccess = success;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
