import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RedactionAuthService } from '../../services/redaction-auth.service';
import { environment } from '../../../environments/environment';

/**
 * Composant pour la page de rédaction
 * Affiche un formulaire de connexion ou le contenu de l'espace rédaction
 */
@Component({
  selector: 'app-redaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redaction.html',
  styleUrls: ['./redaction.scss']
})
export class RedactionComponent {
  password = '';
  errorMessage = signal<string>('');
  isAuthenticated = signal<boolean>(false);
  redactionUrl: SafeResourceUrl;

  constructor(
    private authService: RedactionAuthService,
    private sanitizer: DomSanitizer
  ) {
    this.isAuthenticated.set(this.authService.isAuthenticated());
    this.redactionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.redactionUrl);
  }

  /**
   * Tente de se connecter avec le mot de passe fourni
   */
  login(): void {
    this.errorMessage.set('');
    
    if (!this.password) {
      this.errorMessage.set('Veuillez entrer un mot de passe');
      return;
    }

    const success = this.authService.authenticate(this.password);
    
    if (success) {
      this.isAuthenticated.set(true);
      this.password = '';
    } else {
      this.errorMessage.set('Mot de passe incorrect');
      this.password = '';
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    this.authService.logout();
    this.isAuthenticated.set(false);
  }

  /**
   * Gère la soumission du formulaire
   */
  onSubmit(event: Event): void {
    event.preventDefault();
    this.login();
  }
}

