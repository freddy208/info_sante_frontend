import { z } from 'zod';
import { Priority, TargetAudience } from '@/types/announcement';

// DTOs correspondant à votre Backend
export const createAnnouncementSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().url(),
  thumbnailImage: z.string().url().optional(),
  categoryId: z.string().uuid(),
  startDate: z.string().datetime(), // ISO string
  endDate: z.string().datetime(),   // ISO string
  targetAudience: z.array(z.nativeEnum(TargetAudience)).optional(),
  // ✅ CORRECTION ICI : On définit la valeur par défaut sur l'enum natif lui-même
  priority: z.nativeEnum(Priority).default(Priority.LOW).optional(),
  isFree: z.boolean().default(true).optional(),
  cost: z.number().positive().optional(),
  capacity: z.number().int().positive().optional(),
  requiresRegistration: z.boolean().default(false).optional(),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export const queryAnnouncementSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  categoryId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  status: z.string().optional(), // Pour Zod ici, string suffit pour la query, l'API validera l'Enum
  priority: z.nativeEnum(Priority).optional(), // Filtre par priorité (ex: 'HIGH')
});

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementFormData = z.infer<typeof updateAnnouncementSchema>;
export type QueryAnnouncementFormData = z.infer<typeof queryAnnouncementSchema>;