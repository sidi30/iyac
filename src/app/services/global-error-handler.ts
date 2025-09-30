import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    console.error('Erreur globale:', error);
    
    // Ne rediriger que pour les erreurs critiques (erreurs de navigation, etc.)
    // Pas pour les erreurs de composants individuels
    if (error?.message?.includes('Navigation') || 
        error?.message?.includes('Cannot resolve') ||
        error?.message?.includes('Module not found')) {
      this.router.navigate(['/error']);
    }
  }
}
