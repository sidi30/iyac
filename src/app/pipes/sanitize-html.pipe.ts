import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as DOMPurify from 'dompurify';
import { SecurityMonitoringService } from '../services/security-monitoring.service';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  
  constructor(private securityMonitoring: SecurityMonitoringService) {}

  transform(value: string): string {
    if (!value) return '';
    
    // Configuration stricte de DOMPurify
    const config = {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'div', 'span'],
      ALLOWED_ATTR: ['class', 'id'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false
    };
    
    const sanitizedContent = DOMPurify.sanitize(value, config);
    
    // Détecter les tentatives XSS
    if (sanitizedContent !== value) {
      this.securityMonitoring.logXssAttempt(value, sanitizedContent);
    }
    
    return sanitizedContent;
  }
}
