import { z } from 'zod';

// Miroir du CreateCategoryDto du backend
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'La couleur doit être au format hexadécimal (ex: #4CAF50)').optional(),
  parentId: z.string().uuid("L'ID parent doit être un UUID valide").optional(),
  order: z.number().int().min(0, "L'ordre doit être un nombre entier supérieur ou égal à 0").optional(),
});

// Miroir du UpdateCategoryDto du backend (hérite de createCategorySchema)
export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean('isActive doit être un booléen').optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;