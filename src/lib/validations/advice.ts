import { z } from 'zod';
import { AdviceStatus, Priority, TargetAudience } from '@/types/advice';

// Schéma pour créer un conseil
export const createAdviceSchema = z.object({
  categoryId: z.string().min(1, "L'ID de la catégorie est requis"),
  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.string().min(1, 'Le contenu est requis'),
  icon: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  targetAudience: z.array(z.nativeEnum(TargetAudience)).optional(),
});

// Schéma pour mettre à jour un conseil
export const updateAdviceSchema = createAdviceSchema.partial();

// Schéma pour les paramètres de requête
export const queryAdviceSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  categoryId: z.string().optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.nativeEnum(AdviceStatus).optional(),
  priority: z.nativeEnum(Priority).optional(),
  targetAudience: z.array(z.nativeEnum(TargetAudience)).optional(),
  isActive: z.coerce.boolean().optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateAdviceFormData = z.infer<typeof createAdviceSchema>;
export type UpdateAdviceFormData = z.infer<typeof updateAdviceSchema>;
export type QueryAdviceFormData = z.infer<typeof queryAdviceSchema>;