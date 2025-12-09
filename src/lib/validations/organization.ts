import { z } from 'zod';
import { OrganizationType } from '@/types/organization';

// Schéma pour l'inscription d'une organisation
export const registerOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    }),
  type: z.nativeEnum(OrganizationType, { message: "Type d'organisation invalide" }),
  phone: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le téléphone doit être au format camerounais (+237XXXXXXXXX)',
    }),
  whatsapp: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le WhatsApp doit être au format camerounais (+237XXXXXXXXX)',
    })
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional()
    .or(z.literal('')),
  website: z.string().url('URL du site web invalide').optional().or(z.literal('')),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, 'La ville est requise'),
  region: z.string().min(1, 'La région est requise'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  registrationNumber: z.string().min(1, "Le numéro d'enregistrement est requis"),
  licenseDocument: z.string().optional(),
  emergencyAvailable: z.boolean().optional(),
  insuranceAccepted: z.array(z.string()).optional(),
  openingHours: z.any().optional(),
});

// Schéma pour la connexion d'une organisation
export const loginOrganizationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// Schéma pour la mise à jour d'une organisation
export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères')
    .optional(),
  phone: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le téléphone doit être au format camerounais (+237XXXXXXXXX)',
    })
    .optional(),
  whatsapp: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le WhatsApp doit être au format camerounais (+237XXXXXXXXX)',
    })
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .optional()
    .or(z.literal('')),
  website: z.string().url('URL du site web invalide').optional().or(z.literal('')),
  address: z.string().min(1, "L'adresse est requise").optional(),
  city: z.string().min(1, 'La ville est requise').optional(),
  region: z.string().min(1, 'La région est requise').optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  emergencyAvailable: z.boolean().optional(),
  insuranceAccepted: z.array(z.string()).optional(),
  openingHours: z.any().optional(),
});

// Schéma pour le changement de mot de passe
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
  newPassword: z
    .string()
    .min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        'Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    }),
});

// Schéma pour l'ajout d'un membre
export const createMemberSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le téléphone doit être au format camerounais (+237XXXXXXXXX)',
    })
    .optional()
    .or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
});

// Schéma pour la mise à jour d'un membre
export const updateMemberSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').optional(),
  lastName: z.string().min(1, 'Le nom est requis').optional(),
  email: z.string().email('Email invalide').optional(),
  phone: z
    .string()
    .regex(/^\+237[0-9]{9}$/, {
      message: 'Le téléphone doit être au format camerounais (+237XXXXXXXXX)',
    })
    .optional()
    .or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

// Types inférés pour une utilisation facile dans les formulaires
export type RegisterOrganizationFormData = z.infer<typeof registerOrganizationSchema>;
export type LoginOrganizationFormData = z.infer<typeof loginOrganizationSchema>;
export type UpdateOrganizationFormData = z.infer<typeof updateOrganizationSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type CreateMemberFormData = z.infer<typeof createMemberSchema>;
export type UpdateMemberFormData = z.infer<typeof updateMemberSchema>;