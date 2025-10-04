import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { SecurityMonitoringService } from '../services/security-monitoring.service';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  
  constructor(private securityMonitoring: SecurityMonitoringService) {}

  transform(value: string): string {
    if (!value) return '';
    
    // Version simplifiée pour debug - retourner le contenu tel quel
    console.log('SanitizeHtmlPipe - Input:', value.substring(0, 100));
    
    // Pour l'instant, retourner le contenu sans sanitisation pour tester
    return value;
  }
}
