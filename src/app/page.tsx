// app/page.tsx
import type { Metadata } from 'next';
import { HeroSection } from '@/components/portal/HeroSection';
import { TrustSection } from '@/components/portal/TrustSection';
import { Footer } from '@/components/layout/Footer';

// SEO : Très important même pour une page portail
export const metadata: Metadata = {
  title: "Info Santé 237 | Portail d'information sanitaire au Cameroun",
  description:
    "Info Santé 237 est le portail d'information sanitaire du Cameroun. Consultez les actualités de santé, recevez des alertes sanitaires et accédez à des espaces dédiés aux citoyens et aux structures de santé.",
  keywords:
    "information sanitaire cameroun, santé cameroun, portail santé cameroun, alertes sanitaires, hôpitaux cameroun, système de santé cameroun",
  openGraph: {
    title: "Info Santé 237 | Le portail officiel d'information sanitaire",
    description:
      "Actualités, alertes et informations fiables sur la santé au Cameroun.",
    images: ["/images/og-image-info-sante-237.jpg"],
  },
};


export default function PortalPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col">
      <main className="grow">
        <HeroSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}