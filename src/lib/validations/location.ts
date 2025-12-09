import { z } from 'zod';
import { ContentType } from '@/types/location';

// Schéma pour créer une localisation
export const createLocationSchema = z.object({
  contentType: z.nativeEnum(ContentType, { message: 'Type de contenu invalide' }),
  contentId: z.string().min(1, "L'ID du contenu est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, 'La ville est requise'),
  region: z.string().min(1, 'La région est requise'),
  latitude: z.number().min(-90, 'La latitude doit être >= -90').max(90, 'La latitude doit être <= 90'),
  longitude: z.number().min(-180, 'La longitude doit être >= -180').max(180, 'La longitude doit être <= 180'),
  placeId: z.string().optional(),
  formattedAddress: z.string().optional(),
  additionalInfo: z.string().optional(),
});

// Schéma pour mettre à jour une localisation
export const updateLocationSchema = createLocationSchema.partial();

// Schéma pour le géocodage
export const geocodeSchema = z.object({
  address: z.string().min(3, "L'adresse doit contenir au moins 3 caractères"),
});

// Schéma pour le géocodage inverse
export const reverseGeocodeSchema = z.object({
  latitude: z.number().min(-90, 'La latitude doit être >= -90').max(90, 'La latitude doit être <= 90'),
  longitude: z.number().min(-180, 'La longitude doit être >= -180').max(180, 'La longitude doit être <= 180'),
});

// Types inférés pour une utilisation facile dans les formulaires
export type CreateLocationFormData = z.infer<typeof createLocationSchema>;
export type UpdateLocationFormData = z.infer<typeof updateLocationSchema>;
export type GeocodeFormData = z.infer<typeof geocodeSchema>;
export type ReverseGeocodeFormData = z.infer<typeof reverseGeocodeSchema>;