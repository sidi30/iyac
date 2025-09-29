export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: Date;
  imageUrl?: string;
  category: string;
  tags: string[];
  isBreaking?: boolean;
  readTime: number;
  isHighlighted?: boolean;
}

export interface BreakingNews {
  id: string;
  title: string;
  timestamp: Date;
  urgent: boolean;
}

export interface Media {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'podcast' | 'document';
  duration?: string;
  thumbnailUrl?: string;
  publishDate: Date;
}
