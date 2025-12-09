// Enums basés sur le schéma Prisma
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
}

// Types de base
export interface Article {
  id: string;
  organizationId: string;
  title: string;
  slug?: string | null;
  content: string;
  excerpt?: string | null;
  featuredImage: string;
  thumbnailImage?: string | null;
  categoryId: string;
  author?: string | null;
  readingTime?: number | null;
  tags?: string[];
  viewsCount: number;
  sharesCount: number;
  commentsCount: number;
  reactionsCount: number;
  isFeatured: boolean;
  publishedAt?: string | null;
  status: ArticleStatus;
  suspensionReason?: string | null;
  suspendedBy?: string | null;
  deletedAt?: Date | null;
  createdAt: string;
  updatedAt: Date;
  
  // Inclusions optionnelles
  organization?: {
    id: string;
    name: string;
    logo?: string | null;
    phone?: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug?: string | null;
  };
}

// DTOs pour les formulaires
export interface CreateArticleDto {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage: string;
  thumbnailImage?: string;
  categoryId: string;
  author?: string;
  readingTime?: number;
  tags?: string[];
  externalUrl?: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  thumbnailImage?: string;
  categoryId?: string;
  author?: string;
  readingTime?: number;
  tags?: string[];
  externalUrl?: string;
}

export interface QueryArticleDto {
  page?: number;
  limit?: number;
  categoryId?: string;
  organizationId?: string;
  search?: string;
  city?: string;
  status?: ArticleStatus;
  tags?: string[];
  featured?: boolean;
}

// Types pour les réponses API
export interface PaginatedArticlesResponse {
  data: Article[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}