/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Shield, Activity, ArrowRight, Sparkles, Lock, Mail, Heart, Loader2, Link } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { toast } from 'react-hot-toast';

export default function ConnexionPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        toast.success('Connexion réussie !');
        router.push('/accueil');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Une erreur est survenue');
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50/30 to-blue-50/40 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Effets de fond animés avec harmonie de couleurs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-linear-to-br from-teal-400/10 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-linear-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Effet de suivi du curseur pour PWA */}
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo en haut avec animation subtile - gardé en vert */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white p-3 sm:p-4 rounded-full shadow-2xl">
              <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Titre avec gradient vert harmonisé */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">
            <span className="bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Bon retour parmi nous!  
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            Connectez-vous à votre espace santé
          </p>
        </div>

        {/* Carte du formulaire avec coins plus arrondis */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 mb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Champ Email avec coins plus arrondis */}
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
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.email ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Champ Mot de passe avec coins plus arrondis */}
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
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none font-medium ${
                    form.formState.errors.password ? 'border-red-500' : 'border-gray-200 focus:border-teal-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold transition-colors hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {/* Bouton de connexion avec bleu santé doux et gradient harmonieux */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full px-8 py-4 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              {/* Overlay animé */}
              <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              {isLoading ? (
                <Loader2 className="w-5 h-5 relative z-10 animate-spin" strokeWidth={2.5} />
              ) : (
                <Shield className="w-5 h-5 relative z-10" strokeWidth={2.5} />
              )}
              <span className="relative z-10">
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />}
            </button>
          </form>
        </div>

        {/* Liens supplémentaires adaptés PWA */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-bold transition-colors hover:underline inline-flex items-center gap-1 group">
              Créer un compte gratuit
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </button>
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

        {/* Badge sécurité avec coins plus arrondis et couleurs harmonisées */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <p className="text-xs text-blue-800 font-medium">
              Connexion sécurisée SSL
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}