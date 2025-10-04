import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare let gtag: (...args: any[]) => void;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  
  // Remplacez par votre ID de mesure Google Analytics
  private readonly GA_TRACKING_ID = 'G-JJDC6WW0HV'; // À remplacer par votre ID

  constructor(private router: Router) {
    this.initializeGoogleAnalytics();
    this.trackPageViews();
  }

  private initializeGoogleAnalytics(): void {
    // Charger le script Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialiser gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'site_type',
        'custom_parameter_2': 'content_category'
      }
    });
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', this.GA_TRACKING_ID, {
          page_path: event.urlAfterRedirects,
          page_title: document.title,
          page_location: window.location.href
        });
      });
  }

  // Tracking des événements personnalisés
  trackEvent(eventName: string, parameters?: any): void {
    gtag('event', eventName, {
      event_category: parameters?.category || 'engagement',
      event_label: parameters?.label || '',
      value: parameters?.value || 0,
      custom_parameter_1: 'liberteiyac_journal',
      custom_parameter_2: parameters?.contentType || 'general',
      ...parameters
    });
  }

  // Tracking des articles lus
  trackArticleRead(articleId: string, articleTitle: string, category: string): void {
    this.trackEvent('article_read', {
      category: 'content',
      label: articleTitle,
      article_id: articleId,
      article_category: category,
      contentType: 'article'
    });
  }

  // Tracking des médias joués
  trackMediaPlay(mediaId: string, mediaTitle: string, mediaType: 'audio' | 'video'): void {
    this.trackEvent('media_play', {
      category: 'media',
      label: mediaTitle,
      media_id: mediaId,
      media_type: mediaType,
      contentType: mediaType
    });
  }

  // Tracking des téléchargements
  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('file_download', {
      category: 'download',
      label: fileName,
      file_type: fileType,
      contentType: 'download'
    });
  }

  // Tracking des recherches
  trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent('search', {
      category: 'engagement',
      label: searchTerm,
      search_term: searchTerm,
      results_count: resultsCount,
      contentType: 'search'
    });
  }

  // Tracking des interactions avec les filtres
  trackFilterUse(filterType: string, filterValue: string): void {
    this.trackEvent('filter_use', {
      category: 'engagement',
      label: `${filterType}: ${filterValue}`,
      filter_type: filterType,
      filter_value: filterValue,
      contentType: 'filter'
    });
  }

  // Tracking des clics sur les boutons sociaux
  trackSocialShare(platform: string, contentType: string): void {
    this.trackEvent('social_share', {
      category: 'social',
      label: platform,
      social_platform: platform,
      content_type: contentType,
      contentType: 'social'
    });
  }

  // Tracking des erreurs
  trackError(errorMessage: string, errorLocation: string): void {
    this.trackEvent('error', {
      category: 'error',
      label: errorMessage,
      error_message: errorMessage,
      error_location: errorLocation,
      contentType: 'error'
    });
  }

  // Tracking des conversions (abonnements, contacts, etc.)
  trackConversion(conversionType: string, value?: number): void {
    this.trackEvent('conversion', {
      category: 'conversion',
      label: conversionType,
      conversion_type: conversionType,
      value: value || 0,
      contentType: 'conversion'
    });
  }

  // Tracking du temps passé sur le site
  trackTimeOnSite(timeSpent: number): void {
    this.trackEvent('time_on_site', {
      category: 'engagement',
      label: 'time_spent',
      time_spent_seconds: timeSpent,
      contentType: 'engagement'
    });
  }

  // Tracking des interactions avec les lecteurs média
  trackMediaInteraction(action: string, mediaId: string, mediaType: 'audio' | 'video'): void {
    this.trackEvent('media_interaction', {
      category: 'media',
      label: action,
      action: action,
      media_id: mediaId,
      media_type: mediaType,
      contentType: mediaType
    });
  }

  // Tracking des pages les plus visitées
  trackPageView(pageName: string, pageCategory: string): void {
    gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      content_group1: pageCategory,
      custom_parameter_1: 'liberteiyac_journal',
      custom_parameter_2: pageCategory
    });
  }

  // Configuration pour les objectifs personnalisés
  setUserProperties(userId?: string, userType?: string): void {
    gtag('config', this.GA_TRACKING_ID, {
      user_id: userId || 'anonymous',
      custom_map: {
        'custom_parameter_1': 'site_type',
        'custom_parameter_2': 'content_category',
        'custom_parameter_3': 'user_type'
      }
    });

    if (userType) {
      gtag('set', {
        user_type: userType
      });
    }
  }

  // Tracking des événements de scroll
  trackScroll(depth: number): void {
    this.trackEvent('scroll', {
      category: 'engagement',
      label: `${depth}%`,
      scroll_depth: depth,
      contentType: 'engagement'
    });
  }

  // Tracking des clics sur les liens externes
  trackExternalLink(url: string, linkText: string): void {
    this.trackEvent('external_link_click', {
      category: 'engagement',
      label: linkText,
      external_url: url,
      contentType: 'external_link'
    });
  }
}
