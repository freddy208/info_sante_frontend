import { User, UserPlus, Building2 } from 'lucide-react';
import { ProfileCard } from './ProfileCard';

export function HeroSection() {
  return (
    <section className="relative bg-linear-to-br from-teal-50 via-white to-cyan-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Bienvenue sur <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-cyan-600">
              Info Santé 237
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            La plateforme de santé camerounaise qui s&apos;adapte à vous. Choisissez votre espace pour commencer.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
            title="J’ai un compte Info Santé"
            description="Connectez-vous ou créez un compte pour personnaliser votre expérience, recevoir des alertes sanitaires et suivre les informations qui vous concernent."
            color="emerald"
            href="/auth/connexion"
            features={["Alertes sanitaires", "Contenus personnalisés", "Sources officielles suivies"]}
          />
          <ProfileCard
            icon={Building2}
            title="organisme sanitaire"
            description="Publiez, gérez et diffusez des informations sanitaires fiables à destination du public et des partenaires."
            color="purple"
            href="/hopitals/dashboard"
            features={["Publication d’informations", "Gestion des campagnes", "Statistiques de diffusion"]}
          />
        </div>
      </div>
    </section>
  );
}