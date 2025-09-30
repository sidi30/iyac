import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private router: Router) {}

  handleError(error: any): void {
    console.error('Erreur globale:', error);
    
    // Rediriger vers la page d'erreur pour toute erreur non gérée
    this.router.navigate(['/error']);
  }
}
