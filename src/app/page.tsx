import { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { AlertBanner } from "@/components/landing/AlertBanner";
import { UserGate } from "@/components/landing/UserGate";
// GeoSection est maintenant un Client Component qui gère lui-même le lazy loading interne
import { GeoSection } from "@/components/landing/GeoSection";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "MboaSanté | L'info santé fiable au Cameroun",
  description:
    "MboaSanté est votre portail d'information sanitaire au Cameroun.",
  keywords: "santé cameroun, mboa santé",
  openGraph: {
    title: "MboaSanté",
    description: "L'information santé, proche de vous.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="grow">
        <HeroSection />
        <AlertBanner />
        <UserGate />
        <GeoSection />
        
        <section className="py-12 bg-white text-center">
            <p className="text-(--text-secondary)">Plus de contenus à venir...</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}