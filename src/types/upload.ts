// Enums basés sur le schéma Prisma
export enum ContentType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ARTICLE = 'ARTICLE',
  ADVICE = 'ADVICE',
  COMMENT = 'COMMENT',
  ORGANIZATION = 'ORGANIZATION',
  PROFILE = 'PROFILE',
  COVER = 'COVER',
}

export enum MediaStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum UserType {
  USER = 'USER',
  ORGANIZATION = 'ORGANIZATION',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

// Types de base
export interface Media {
  id: string;
  uploadedBy: string;
  uploaderType: UserType;
  contentType: ContentType;
  contentId?: string | null;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  cloudinaryPublicId: string;
  status: MediaStatus;
  deletedAt?: Date | null;
  createdAt: Date;
}

// DTOs pour les formulaires
export interface UploadImageDto {
  contentType: ContentType;
  contentId?: string;
}

export interface UploadDocumentDto {
  contentType: ContentType;
  contentId?: string;
}

// Types pour les réponses API
export interface PaginatedMediasResponse {
  data: Media[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Type pour la réponse de Cloudinary
export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  created_at: string;
  folder: string;
  original_filename: string;
}