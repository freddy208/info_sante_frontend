import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedAnnouncements from '@/components/home/FeaturedAnnouncements';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import ArticlesSection from '@/components/home/ArticlesSection';
import MapSection from '@/components/home/MapSection';
import Testimonials from '@/components/home/Testimonials';
import NewsletterCTA from '@/components/home/NewsletterCTA';

export default function AccueilPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedAnnouncements />
      <CategoriesGrid />
      <ArticlesSection />
      <MapSection />
      <Testimonials />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}

/*export const metadata = {
  title: 'Info Santé Cameroun - Accueil',
  description: 'Toute l\'information sanitaire du Cameroun en un seul endroit. Campagnes de vaccination, dépistages et conseils de santé.',
};*/