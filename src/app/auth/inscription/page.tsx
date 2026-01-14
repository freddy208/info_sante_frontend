/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, EyeOff, UserPlus, Heart, Sparkles, ArrowRight, 
  Zap, Loader2, Mail, Lock, User, Phone, MapPin, ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  registerSchema, 
  RegisterFormData, 
  CameroonRegion, 
  CameroonCity 
} from '@/lib/validations/auth';
import { toast } from 'react-hot-toast';

// =====================================
// 🗺️ CONFIGURATION DES VILLES PAR RÉGION
// =====================================
const regionCities: Record<CameroonRegion, CameroonCity[]> = {
  [CameroonRegion.ADAMAOUA]: [
    CameroonCity.NGAOUNDERE,
    CameroonCity.MEIGANGA,
    CameroonCity.TIBATI,
    CameroonCity.TIGNERE,
    CameroonCity.BANYO,
  ],
  [CameroonRegion.CENTRE]: [
    CameroonCity.YAOUNDE,
    CameroonCity.MBALMAYO,
    CameroonCity.OBALA,
    CameroonCity.MFOU,
    CameroonCity.AKONOLINGA,
    CameroonCity.BAFIA,
    CameroonCity.ESEKA,
    CameroonCity.MBANDJOCK,
    CameroonCity.NANGA_EBOKO,
    CameroonCity.NTUI,
    CameroonCity.MONATELE,
    CameroonCity.SOA,
    CameroonCity.AYOS,
  ],
  [CameroonRegion.EST]: [
    CameroonCity.BERTOUA,
    CameroonCity.ABONG_MBANG,
    CameroonCity.BATOURI,
    CameroonCity.YOKADOUMA,
    CameroonCity.LOMIE,
    CameroonCity.BETARE_OYA,
    CameroonCity.GAROUA_BOULAI,
  ],
  [CameroonRegion.EXTREME_NORD]: [
    CameroonCity.MAROUA,
    CameroonCity.KOUSSERI,
    CameroonCity.MOKOLO,
    CameroonCity.MORA,
    CameroonCity.YAGOUA,
    CameroonCity.KAELE,
    CameroonCity.GUIDIGUIS,
    CameroonCity.MINDIF,
  ],
  [CameroonRegion.LITTORAL]: [
    CameroonCity.DOUALA,
    CameroonCity.EDEA,
    CameroonCity.NKONGSAMBA,
    CameroonCity.LOUM,
    CameroonCity.MBANGA,
    CameroonCity.MANJO,
    CameroonCity.PENJA,
    CameroonCity.DIZANGUE,
    CameroonCity.YABASSI,
    CameroonCity.NDOM,
  ],
  [CameroonRegion.NORD]: [
    CameroonCity.GAROUA,
    CameroonCity.GUIDER,
    CameroonCity.TCHOLLIRE,
    CameroonCity.LAGDO,
    CameroonCity.POLI,
    CameroonCity.REY_BOUBA,
    CameroonCity.PITOA,
  ],
  [CameroonRegion.NORD_OUEST]: [
    CameroonCity.BAMENDA,
    CameroonCity.KUMBO,
    CameroonCity.NDOP,
    CameroonCity.MBENGWI,
    CameroonCity.WUM,
    CameroonCity.FUNDONG,
    CameroonCity.NKAMBE,
    CameroonCity.BAFUT,
  ],
  [CameroonRegion.OUEST]: [
    CameroonCity.BAFOUSSAM,
    CameroonCity.DSCHANG,
    CameroonCity.MBOUDA,
    CameroonCity.FOUMBAN,
    CameroonCity.BAFANG,
    CameroonCity.BANDJOUN,
    CameroonCity.BANGANGTE,
    CameroonCity.BAHAM,
    CameroonCity.FOUMBOT,
    CameroonCity.TONGA,
  ],
  [CameroonRegion.SUD]: [
    CameroonCity.EBOLOWA,
    CameroonCity.KRIBI,
    CameroonCity.SANGMELIMA,
    CameroonCity.AMBAM,
    CameroonCity.CAMPO,
    CameroonCity.LOLODORF,
    CameroonCity.AKOM_II,
    CameroonCity.BIPINDI,
  ],
  [CameroonRegion.SUD_OUEST]: [
    CameroonCity.BUEA,
    CameroonCity.LIMBE,
    CameroonCity.KUMBA,
    CameroonCity.TIKO,
    CameroonCity.MUYUKA,
    CameroonCity.MAMFE,
    CameroonCity.IDENAU,
    CameroonCity.MUNDEMBA,
  ],
};

export default function InscriptionPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<CameroonRegion | undefined>(undefined);

  // ✅ Optimisation avec useMemo pour éviter les re-renders inutiles
  const availableCities = useMemo(() => {
    return selectedRegion ? regionCities[selectedRegion] || [] : [];
  }, [selectedRegion]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '', // ✅ AJOUT
      firstName: '',
      lastName: '',
      phone: '',
      region: undefined,
      city: undefined,
    },
  });

  // ✅ Réinitialisation de la ville quand la région change
  useEffect(() => {
    if (selectedRegion) {
      form.setValue('city', undefined);
    }
  }, [selectedRegion]);

  // ✅ CORRECTION : Gestion d'erreur améliorée avec messages détaillés
  const onSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      await register(data);

      toast.success('🎉 Compte créé avec succès ! Bienvenue', {
        duration: 3000,
        position: 'top-center',
      });

      // ✅ Petite attente pour laisser l'utilisateur voir le toast
      setTimeout(() => {
        router.push('/accueil');
      }, 500);

    } catch (error: any) {
      // ✅ Extraction du message d'erreur avec fallback
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Une erreur est survenue lors de l\'inscription';

      toast.error(message, {
        duration: 4000,
        position: 'top-center',
      });

      // ✅ Log pour le debug (à retirer en production)
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erreur inscription:', error);
      }
    }
  }, [register, router]);

  // ✅ Toggle password visibility avec useCallback pour éviter re-renders
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/40 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Effets de fond animés */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white p-3 sm:p-4 rounded-full shadow-2xl">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Inscription
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Rejoignez la communauté Info Santé 237
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 mb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Prénom */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                Prénom
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  {...form.register('firstName')}
                  placeholder="Jean"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {form.formState.errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                Nom
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  {...form.register('lastName')}
                  placeholder="Doe"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {form.formState.errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type="email"
                  id="email"
                  {...form.register('email')}
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.email ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Phone className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  {...form.register('phone')}
                  placeholder="+237 6 XX XX XX XX"
                  autoComplete="tel"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Région */}
            <div className="space-y-2">
              <label htmlFor="region" className="block text-sm font-bold text-gray-700 mb-2">
                Région
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="region"
                  {...form.register('region', {
                    onChange: (e) => {
                      const value = e.target.value as CameroonRegion;
                      setSelectedRegion(value || undefined);
                    }
                  })}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium appearance-none ${
                    form.formState.errors.region ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                >
                  <option value="">Sélectionner une région</option>
                  {Object.values(CameroonRegion).map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              {form.formState.errors.region && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.region.message}</p>
              )}
            </div>

            {/* Ville */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2">
                Ville
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <MapPin className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  id="city"
                  {...form.register('city')}
                  disabled={!selectedRegion}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium appearance-none ${
                    form.formState.errors.city ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  } ${!selectedRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">{selectedRegion ? 'Sélectionner une ville' : 'Sélectionnez d\'abord une région'}</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...form.register('password')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.password ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors z-10"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            {/* ✅ Confirmation du mot de passe */}
            <div className="space-y-2">
              <label htmlFor="passwordConfirmation" className="block text-sm font-bold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  id="passwordConfirmation"
                  {...form.register('passwordConfirmation')}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.passwordConfirmation ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors z-10"
                  aria-label={showPasswordConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.formState.errors.passwordConfirmation && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.passwordConfirmation.message}</p>
              )}
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              {isLoading ? (
                <Loader2 className="w-5 h-5 relative z-10 animate-spin" strokeWidth={2.5} />
              ) : (
                <Zap className="w-5 h-5 relative z-10" strokeWidth={2.5} />
              )}
              <span className="relative z-10">
                {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
              </span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />}
            </button>
          </form>
        </div>

        {/* Liens */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <Link 
              href="/auth/connexion" 
              className="text-teal-600 hover:text-teal-700 font-bold transition-colors hover:underline inline-flex items-center gap-1 group"
            >
              Se connecter
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </Link>
          </p>

          <div className="pt-6">
            <Link
              href="/accueil"
              className="group inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold transition-all text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>

        {/* Badge sécurité */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <p className="text-xs text-blue-800 font-medium">
              Connexion sécurisée SSL • Cookie HttpOnly
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}