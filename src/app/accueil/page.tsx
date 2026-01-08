/* eslint-disable @typescript-eslint/no-unused-vars */
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedAnnouncements from '@/components/home/FeaturedAnnouncements';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import ArticlesSection from '@/components/home/ArticlesSection';
import MapSection from '@/components/home/MapSection';
import Testimonials from '@/components/home/Testimonials';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { GeoSection } from '@/components/landing/GeoSection';
import { Metadata } from 'next';

// ✅ 1. SEO : Métadonnées activées
export const metadata: Metadata = {
  title: "MboaSanté | L'info santé fiable au Cameroun",
  description:
    "MboaSanté est votre portail d'information sanitaire au Cameroun. Trouvez hôpitaux, pharmacies et alertes santé près de chez vous.",
  keywords: "santé cameroun, mboa santé, hôpital cameroun, pharmacie garde",
  openGraph: {
    title: "MboaSanté | L'information santé, proche de vous.",
    description: "Accès instantané à l'annuaire santé et aux alertes sanitaires au Cameroun.",
    type: "website",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }], 
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MboaSanté',
    description: 'L\'information santé fiable au Cameroun.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Composant de Skeleton générique pour Suspense
function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  );
}

export default function AccueilPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* 1. Hero : Pas de Suspense (Doit être instantané) */}
      <HeroSection />

      {/* 2. Annonces : Chargement prioritaire */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturedAnnouncements />
      </Suspense>

      {/* 3. Catégories : Peut charger en parallèle */}
      <Suspense fallback={<SectionLoader />}>
        <CategoriesGrid />
      </Suspense>


      {/* 5. Articles : Peut attendre un peu */}
      <Suspense fallback={<SectionLoader />}>
        <ArticlesSection />
      </Suspense>

      {/* 4. Carte (Lourde) : Chargement indépendant */}
      <Suspense fallback={<SectionLoader />}>
        <MapSection />
      </Suspense>

      <Testimonials />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}

