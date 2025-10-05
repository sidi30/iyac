import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  
  private readonly GA_TRACKING_ID = 'G-JJDC6WW0HV';

  constructor(private router: Router) {
    this.trackPageViews();
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  trackPageView(pagePath: string, pageTitle?: string): void {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', this.GA_TRACKING_ID, {
          page_path: pagePath,
          page_title: pageTitle || document.title
        });
      }
    } catch (error) {
      console.warn('Erreur Google Analytics:', error);
    }
  }

  trackEvent(eventName: string, parameters?: any): void {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, parameters);
      }
    } catch (error) {
      console.warn('Erreur Google Analytics Event:', error);
    }
  }

  trackArticleRead(articleId: string, articleTitle: string): void {
    this.trackEvent('article_read', {
      article_id: articleId,
      article_title: articleTitle
    });
  }

  trackMediaPlay(mediaId: string, mediaType: 'video' | 'audio'): void {
    this.trackEvent('media_play', {
      media_id: mediaId,
      media_type: mediaType
    });
  }

  trackMediaInteraction(mediaId: string, action: string): void {
    this.trackEvent('media_interaction', {
      media_id: mediaId,
      action: action
    });
  }

  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType
    });
  }

  trackSearch(searchTerm: string, resultsCount: number): void {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  trackFilterUse(filterType: string, filterValue: string): void {
    this.trackEvent('filter_use', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }

  trackSocialShare(platform: string, contentId: string): void {
    this.trackEvent('social_share', {
      platform: platform,
      content_id: contentId
    });
  }
}