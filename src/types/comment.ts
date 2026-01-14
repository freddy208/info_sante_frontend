// Enums basés sur le schéma Prisma
export enum CommentStatus {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
  REPORTED = 'REPORTED',
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  HELPFUL = 'HELPFUL',
  THANKS = 'THANKS',
}

// Types de base
export interface Comment {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  parentCommentId?: string | null;
  content: string;
  reactionsCount: number;
  repliesCount: number;
  isEdited: boolean;
  editedAt?: Date | null;
  status: CommentStatus;
  hiddenBy?: string | null;
  hiddenReason?: string | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  // ✅ AJOUT ICI : Le Backend calcule le total des réponses pour les parents
  totalReplies?: number; 

  // Inclusions optionnelles
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
  replies?: Comment[];
}

// DTOs pour les formulaires
export interface CreateCommentDto {
  contentType: string;
  contentId: string;
  parentCommentId?: string;
  content: string;
}

export interface UpdateCommentDto {
  content?: string;
  status?: CommentStatus;
}

export interface QueryCommentDto {
  page?: number;
  limit?: number;
  contentType?: string;
  contentId?: string;
  status?: CommentStatus;
  search?: string;
  parentCommentId?: string;
}

// Types pour les réponses API
export interface PaginatedCommentsResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}