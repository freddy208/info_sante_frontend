// ============================================
// 📰 ARTICLE TYPES (Frontend Mirror)
// ============================================

// Enum miroir de ArticleStatus (Backend)
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
  SUSPENDED = 'SUSPENDED',
}

// Types simplifiés pour les relations (pour éviter l'import circulaire)

export interface OrganizationLite {
  id: string;
  name: string;
  logo?: string | null;
  phone?: string | null;
  // ✅ AJOUT CRITIQUE : Le backend envoie `isVerified` pour la confiance
  isVerified: boolean; 
}

export interface CategoryLite {
  id: string;
  name: string;
  slug?: string | null;
  icon?: string | null;
  color?: string | null;
}

// Interface Principale Article
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
  publishedAt?: string | null; // ISO String
  status: ArticleStatus;
  suspensionReason?: string | null;
  suspendedBy?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Inclusions (Relations)
  organization?: OrganizationLite;
  category?: CategoryLite;
}

// DTOs (Payloads pour création/mise à jour)
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
  externalUrl?: string; // 🔥 AJOUTÉ : Était dans votre DTO Backend mais manquant dans le type
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
  externalUrl?: string; // 🔥 AJOUTÉ
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
  excludeId?: string;
}

// Réponse API
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