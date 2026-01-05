
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/reaction.ts

// ==========================================
// 🎭 ENUMS
// ==========================================

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  HELPFUL = 'HELPFUL',
  THANKS = 'THANKS',
}

export enum ContentType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ARTICLE = 'ARTICLE',
  ADVICE = 'ADVICE',
  COMMENT = 'COMMENT',
  // ✅ AJOUT IMPORTANT : Ajoutez cette ligne pour que le Like fonctionne sur les hôpitaux
  ORGANIZATION = 'ORGANIZATION', 
}

// ==========================================
// 📦 ENTITIES & DTOs
// ==========================================

export interface ReactionEntity {
  id: string;
  userId: string;
  contentType: ContentType;
  contentId: string;
  type: ReactionType;
  createdAt: Date;
  user?: any; // Optionnel : détails de l'utilisateur si inclus
}

export interface CreateReactionDto {
  contentType: ContentType;
  contentId: string;
  type: ReactionType;
}

export interface QueryReactionDto {
  page?: number;
  limit?: number;
  contentType?: ContentType;
  contentId?: string;
  type?: ReactionType;
}

// ==========================================
// 📄 RESPONSES
// ==========================================

export interface PaginatedReactionsResponse {
  data: ReactionEntity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Format de retour de l'endpoint GET /reactions/stats/:contentType/:contentId
 */
export interface ReactionStats {
  total: number;
  LIKE: number;
  LOVE: number;
  HELPFUL: number;
  THANKS: number;
}