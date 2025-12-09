import { z } from 'zod';
import { CommentStatus } from '@/types/comment';

// Schéma pour créer un commentaire
export const createCommentSchema = z.object({
  contentType: z.string().min(1, 'Le type de contenu est requis'),
  contentId: z.string().min(1, "L'ID du contenu est requis"),
  parentCommentId: z.string().optional(),
  content: z.string().min(1, 'Le contenu est requis').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
});

// Schéma pour mettre à jour un commentaire
export const updateCommentSchema = z.object({
  content: z.string().min(1, 'Le contenu est requis').max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères').optional(),
  status: z.nativeEnum(CommentStatus).optional(),
});

// Schéma pour les paramètres de requête
export const queryCommentSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  contentType: z.string().optional(),
  contentId: z.string().optional(),
  status: z.nativeEnum(CommentStatus).optional(),
  search: z.string().optional(),
  parentCommentId: z.string().optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;
export type QueryCommentFormData = z.infer<typeof queryCommentSchema>;