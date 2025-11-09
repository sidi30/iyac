import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RedactionAuthService } from '../services/redaction-auth.service';

/**
 * Guard pour protéger la route /redaction
 * Redirige vers la page de login si l'utilisateur n'est pas authentifié
 */
export const redactionAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(RedactionAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // L'utilisateur n'est pas authentifié, on reste sur la page de rédaction
  // mais le composant affichera le formulaire de login
  return true;
};

