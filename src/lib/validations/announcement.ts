import { z } from 'zod';
import { AnnouncementStatus, TargetAudience } from '@/types/announcement';

// Schéma pour créer une annonce
export const createAnnouncementSchema = z.object({
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
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  targetAudience: z.array(z.nativeEnum(TargetAudience)).optional(),
  isFree: z.boolean().optional(),
  cost: z.number().nonnegative().optional(),
  capacity: z.number().int().positive().optional(),
  requiresRegistration: z.boolean().optional(),
});

// Schéma pour mettre à jour une annonce
export const updateAnnouncementSchema = createAnnouncementSchema.partial();

// Schéma pour les paramètres de requête
export const queryAnnouncementSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  categoryId: z.string().optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.nativeEnum(AnnouncementStatus).optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementFormData = z.infer<typeof updateAnnouncementSchema>;
export type QueryAnnouncementFormData = z.infer<typeof queryAnnouncementSchema>;