import { z } from 'zod';
import { ArticleStatus } from '@/types/article';

// Schéma pour créer un article
export const createArticleSchema = z.object({
  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.string().min(1, 'Le contenu est requis'),
  excerpt: z
    .string()
    .min(10, 'Le résumé doit contenir au moins 10 caractères')
    .max(500, 'Le résumé ne peut pas dépasser 500 caractères')
    .optional(),
  featuredImage: z.string().min(1, "L'image principale est requise"),
  thumbnailImage: z.string().optional(),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  author: z.string().max(100, "Le nom de l'auteur ne peut pas dépasser 100 caractères").optional(),
  readingTime: z.number().int().min(1).max(60).optional(),
  tags: z.array(z.string()).optional(),
  externalUrl: z.string().url('URL invalide').optional(), // ✅ Correspond au champ ajouté dans le Type Backend
});

// Schéma pour mettre à jour un article
export const updateArticleSchema = createArticleSchema.partial();

// Schéma pour les paramètres de requête
export const queryArticleSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  categoryId: z.string().optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.nativeEnum(ArticleStatus).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.coerce.boolean().optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateArticleFormData = z.infer<typeof createArticleSchema>;
export type UpdateArticleFormData = z.infer<typeof updateArticleSchema>;
export type QueryArticleFormData = z.infer<typeof queryArticleSchema>;