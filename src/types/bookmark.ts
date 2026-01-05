// src/types/bookmark.ts

// ==========================================
// 📦 ENUMS & TYPES
// ==========================================

// On peut réexporter ContentType depuis upload si déjà défini, ou le redéfinir ici
import { ContentType } from './upload';

export interface BookmarkEntity {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  createdAt: Date;
  
  // Le backend aplatit 'announcement' ou 'article' dans ce champ 'content'
  content?: {
    id: string;
    title: string;
    excerpt?: string | null;
    featuredImage: string;
    thumbnailImage?: string | null;
    organization?: {
      id: string;
      name: string;
      logo?: string | null;
    };
    // ... autres champs spécifiques (startDate, endDate, readingTime, etc.)
  };
}

export interface CreateBookmarkDto {
  contentType: ContentType;
  contentId: string;
}

export interface QueryBookmarkDto {
  page?: number;
  limit?: number;
  contentType?: ContentType;
  search?: string;
  sortBy?: 'createdAt' | 'contentType';
  sortOrder?: 'asc' | 'desc';
}

// ==========================================
// 📄 RESPONSES
// ==========================================

export interface PaginatedBookmarksResponse {
  data: BookmarkEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface BookmarkCheckResponse {
  isBookmarked: boolean;
  bookmarkId?: string;
}

export interface BookmarkStatsResponse {
  total: number;
  announcements: number;
  articles: number;
  recentBookmarks: BookmarkEntity[];
}