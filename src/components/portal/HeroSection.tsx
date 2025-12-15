/* eslint-disable @typescript-eslint/no-unused-vars */
// components/hero-section.tsx
import { User, UserPlus, Building2, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import ProfileCard from './ProfileCard';
import FloatingParticles from './FloatingParticles';

export default function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-teal-50 via-white to-cyan-50 py-16 md:py-24 overflow-hidden">
      <FloatingParticles />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6 border border-teal-200/50">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-gray-700">Votre santé, notre priorité</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            Bienvenue sur{' '}
            <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 animate-gradient">
              Info Santé 237
            </span>
          </h1>
          
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            La plateforme de santé camerounaise qui s&apos;adapte à vous. 
            <span className="block mt-2 font-semibold text-teal-700">Choisissez votre espace pour commencer.</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ProfileCard
            icon={User}
            title="Je suis un visiteur"
            description="Accédez librement aux informations sanitaires officielles, aux campagnes de prévention et aux structures de santé près de chez vous."
            color="blue"
            href="/accueil"
            features={["Actualités sanitaires", "Campagnes de prévention", "Carte des hôpitaux"]}
          />
          
          <ProfileCard
            icon={UserPlus}
            title="J'ai un compte Info Santé"
            description="Connectez-vous ou créez un compte pour personnaliser votre expérience, recevoir des alertes sanitaires et suivre les informations qui vous concernent."
            color="emerald"
            href="/auth/connexion"
            features={["Alertes sanitaires", "Contenus personnalisés", "Sources officielles suivies"]}
          />
          
          <ProfileCard
            icon={Building2}
            title="Organisme sanitaire"
            description="Publiez, gérez et diffusez des informations sanitaires fiables à destination du public et des partenaires."
            color="purple"
            href="/hopitals/dashboard"
            features={["Publication d'informations", "Gestion des campagnes", "Statistiques de diffusion"]}
          />
        </div>
      </div>
    </section>
  );
}