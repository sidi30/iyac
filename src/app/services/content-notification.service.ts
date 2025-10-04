import { Injectable } from '@angular/core';
import { NewsletterService, NewsletterContent } from './newsletter.service';
import { Article } from '../models/article.model';
import { MediaItem } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class ContentNotificationService {

  constructor(private newsletterService: NewsletterService) {}

  /**
   * Notifier les abonnés d'un nouvel article
   */
  async notifyNewArticle(article: Article): Promise<boolean> {
    const content: NewsletterContent = {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `/article/${article.id}`,
      imageUrl: article.imageUrl,
      publishDate: new Date()
    };

    return await this.newsletterService.sendContentNotification(content);
  }

  /**
   * Notifier les abonnés d'une nouvelle vidéo
   */
  async notifyNewVideo(video: MediaItem): Promise<boolean> {
    const content: NewsletterContent = {
      type: 'video',
      title: video.title,
      description: video.description,
      url: '/videos',
      imageUrl: video.thumbnailUrl,
      publishDate: video.publishDate
    };

    return await this.newsletterService.sendContentNotification(content);
  }

  /**
   * Notifier les abonnés d'un nouveau podcast
   */
  async notifyNewPodcast(audio: MediaItem): Promise<boolean> {
    const content: NewsletterContent = {
      type: 'podcast',
      title: audio.title,
      description: audio.description,
      url: '/podcasts',
      imageUrl: audio.thumbnailUrl,
      publishDate: audio.publishDate
    };

    return await this.newsletterService.sendContentNotification(content);
  }

  /**
   * Notifier d'un contenu urgent (breaking news)
   */
  async notifyBreakingNews(article: Article): Promise<boolean> {
    const content: NewsletterContent = {
      type: 'article',
      title: `🚨 URGENT: ${article.title}`,
      description: `Actualité urgente: ${article.excerpt}`,
      url: `/article/${article.id}`,
      imageUrl: article.imageUrl,
      publishDate: new Date()
    };

    return await this.newsletterService.sendContentNotification(content);
  }

  /**
   * Notifier d'un contenu mis en avant
   */
  async notifyFeaturedContent(content: NewsletterContent): Promise<boolean> {
    const featuredContent: NewsletterContent = {
      ...content,
      title: `⭐ À LA UNE: ${content.title}`,
      description: `Contenu mis en avant: ${content.description}`
    };

    return await this.newsletterService.sendContentNotification(featuredContent);
  }

  /**
   * Synchroniser les abonnés avec Google Sheets
   */
  async syncSubscribers(): Promise<void> {
    await this.newsletterService.syncWithGoogleSheets();
  }
}
