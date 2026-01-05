import { Metadata } from "next";
import dynamic from "next/dynamic";

// 1. HERO SECTION : Chargement immédiat (Pas de changement ici, c'est une import normale)
import { HeroSection } from "@/components/landing/HeroSection";
import Footer from "@/components/layout/Footer";

// ==========================================
// 2. LAZY LOADING ALERT BANNER
// ==========================================
// ✅ CORRECTION : On utilise .then(mod => mod.AlertBanner) car c'est un Named Export
const AlertBanner = dynamic(
  () => import("@/components/landing/AlertBanner").then((mod) => mod.AlertBanner),
  {
    loading: () => (
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="container mx-auto px-4">
          <div className="h-24 bg-white/50 rounded-2xl animate-pulse w-full max-w-4xl mx-auto" />
        </div>
      </section>
    ),
    //ssr: false,
  }
);

// ==========================================
// 3. LAZY LOADING USER GATE
// ==========================================
// ✅ CORRECTION : On utilise .then(mod => mod.UserGate)
const UserGate = dynamic(
  () => import("@/components/landing/UserGate").then((mod) => mod.UserGate),
  {
    loading: () => (
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto h-96">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl animate-pulse h-full" />
              ))}
           </div>
        </div>
      </section>
    ),
    //ssr: false,
  }
);

// ==========================================
// 4. LAZY LOADING GEO SECTION
// ==========================================
// ✅ CORRECTION : On utilise .then(mod => mod.GeoSection)
const GeoSection = dynamic(
  () => import("@/components/landing/GeoSection").then((mod) => mod.GeoSection),
  {
    loading: () => (
      <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white h-[600px] animate-pulse" />
    ),
    ssr: true,
  }
);

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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="grow">
        {/* 1. HERO SECTION */}
        <HeroSection />
        
        {/* 2. ALERT BANNER (Lazy Load) */}
        <AlertBanner />
        
        {/* 3. USER GATE (Lazy Load) */}
        <UserGate />
        
        {/* 4. GEO SECTION (Lazy Load) */}
        <GeoSection />
        
        <section className="py-12 bg-white text-center">
            <p className="text-slate-500">Plus de contenus à venir...</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}