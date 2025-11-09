import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RedactionAuthService } from '../../services/redaction-auth.service';
import { environment } from '../../../environments/environment';

/**
 * Composant pour la page de rédaction
 * Affiche un formulaire de connexion ou redirige vers l'espace rédaction
 */
@Component({
  selector: 'app-redaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redaction.html',
  styleUrls: ['./redaction.scss']
})
export class RedactionComponent implements OnInit {
  password = '';
  errorMessage = signal<string>('');
  isAuthenticated = signal<boolean>(false);
  redactionUrl: SafeResourceUrl;
  showIframeWarning = signal<boolean>(false);

  constructor(
    private authService: RedactionAuthService,
    private sanitizer: DomSanitizer
  ) {
    this.isAuthenticated.set(this.authService.isAuthenticated());
    this.redactionUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.redactionUrl);
  }

  ngOnInit(): void {
    // Si déjà authentifié, ouvrir automatiquement dans un nouvel onglet
    if (this.isAuthenticated()) {
      this.openInNewTab();
    }
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
      // Ouvrir automatiquement dans un nouvel onglet
      this.openInNewTab();
    } else {
      this.errorMessage.set('Mot de passe incorrect');
      this.password = '';
    }
  }

  /**
   * Ouvre l'espace rédaction dans un nouvel onglet
   */
  openInNewTab(): void {
    window.open(environment.redactionUrl, '_blank', 'noopener,noreferrer');
  }

  /**
   * Tente d'afficher dans un iframe (peut être bloqué)
   */
  tryIframe(): void {
    this.showIframeWarning.set(false);
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

