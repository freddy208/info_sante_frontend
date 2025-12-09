import { z } from 'zod';
import { ContentType } from '@/types/upload';

// Schéma pour l'upload d'une image
export const uploadImageSchema = z.object({
  contentType: z.nativeEnum(ContentType, {
    message: 'Type de contenu invalide',
  }),
  contentId: z.string().optional(),
});

// Schéma pour l'upload d'un document
export const uploadDocumentSchema = z.object({
  contentType: z.nativeEnum(ContentType, {
    message: 'Type de contenu invalide',
  }),
  contentId: z.string().optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type UploadImageFormData = z.infer<typeof uploadImageSchema>;
export type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;