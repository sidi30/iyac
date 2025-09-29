import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-newsletter-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './newsletter-signup.html',
  styleUrls: ['./newsletter-signup.scss']
})
export class NewsletterSignupComponent {
  email = '';
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor(private newsletterService: NewsletterService) {}

  onSubmit() {
    if (!this.email || !this.isValidEmail(this.email)) {
      this.showMessage('Veuillez entrer une adresse email valide.', false);
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.newsletterService.subscribe(this.email).subscribe({
      next: (response) => {
        this.showMessage(response.message, response.success);
        if (response.success) {
          this.email = '';
        }
        this.isLoading = false;
      },
      error: () => {
        this.showMessage('Une erreur est survenue. Veuillez réessayer.', false);
        this.isLoading = false;
      }
    });
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
