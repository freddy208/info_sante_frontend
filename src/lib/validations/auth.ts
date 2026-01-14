// src/lib/validations/auth.ts
import { z } from 'zod';
export { CameroonRegion, CameroonCity } from "@/types/auth";
import { CameroonRegion, CameroonCity } from '@/types/auth';

// =====================================
// 🔐 SCHÉMA DE CONNEXION
// =====================================
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// =====================================
// 📝 SCHÉMA D'INSCRIPTION (AVEC CONFIRMATION)
// =====================================
export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Email invalide'),
    
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(64, 'Le mot de passe est trop long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
      ),
    
    // ✅ AJOUT : Confirmation du mot de passe
    passwordConfirmation: z
      .string()
      .min(1, 'Veuillez confirmer votre mot de passe'),
    
    firstName: z
      .string()
      .trim()
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    
    lastName: z
      .string()
      .trim()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .optional(),
    
    phone: z
      .string()
      .regex(/^(\+?237)?[2368]\d{8}$/, 'Téléphone camerounais invalide')
      .optional(),
    
    city: z.nativeEnum(CameroonCity).optional(),
    region: z.nativeEnum(CameroonRegion).optional(),
  })
  // ✅ VALIDATION CROISÉE : Les mots de passe doivent correspondre
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation'], // L'erreur s'affichera sur le champ confirmation
  });

export type RegisterFormData = z.infer<typeof registerSchema>;