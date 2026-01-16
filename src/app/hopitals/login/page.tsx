/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, 
  EyeOff, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

import { useLoginOrganization } from '@/hooks/useOrganizations';
import { useOrganizationAuthStore } from '@/stores/organizationAuthStore';
import { LoginOrganizationFormData, loginOrganizationSchema } from '@/lib/validations/organization';
import { toast } from 'react-hot-toast';

export default function OrganizationLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, login: loginStore } = useOrganizationAuthStore();
  const loginMutation = useLoginOrganization();

  const form = useForm<LoginOrganizationFormData>({
    resolver: zodResolver(loginOrganizationSchema),
    defaultValues: { email: '', password: '' },
  });

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/hopitals/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginOrganizationFormData) => {
    try {
      // 1. Appel API via le hook mutation
      const response = await loginMutation.mutateAsync(data);
      
      // 2. Mise à jour du store global Organisation
      loginStore({
        organization: response.organization,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      });

      toast.success(`Bienvenue, ${response.organization.name} !`);

      // 3. Redirection vers le futur dashboard
      setTimeout(() => {
        router.push('/hopitals/dashboard');
      }, 500);

    } catch (error: any) {
      // L'erreur est déjà gérée par le toast dans le hook, 
      // mais on peut ajouter un log ici si besoin
      console.error('Login Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl shadow-blue-100/50 mb-6 border border-blue-50">
            <Building2 className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Espace <span className="text-blue-600">Partenaire</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Gérez votre établissement et vos services
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-blue-200/20 border border-white p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...form.register('email')}
                  type="email"
                  placeholder="admin@hopital-exemple.cm"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-slate-900 font-medium"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs font-semibold ml-1 italic">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Mot de passe</label>
                <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...form.register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs font-semibold ml-1 italic">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Accéder au dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Votre établissement n&apos;est pas encore inscrit ?
            </p>
            <Link 
              href="/organizations/register" 
              className="mt-2 inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
            >
              Rejoindre le réseau <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-full border border-slate-200/50">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Certifié conforme aux normes de santé
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}