import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  
  transform(value: string): string {
    if (!value) return '';
    
    // Version simplifiée qui fonctionne - nettoyage basique
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Supprimer les iframes
      .replace(/on\w+="[^"]*"/gi, '') // Supprimer les attributs onclick, onload, etc.
      .replace(/javascript:/gi, '') // Supprimer les liens javascript:
      .replace(/data:/gi, '') // Supprimer les liens data:
      .replace(/vbscript:/gi, ''); // Supprimer les liens vbscript:
  }
}
