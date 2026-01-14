// src/app/page.tsx
import { Metadata } from "next";
import HomeView from "./home-view"; // On importe le composant client qu'on vient de créer

// ==========================================
// 1. METADONNÉES (SEO)
// ==========================================
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
    description: "L'information santé fiable au Cameroun.",
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

// ==========================================
// 2. SERVER COMPONENT (Racine)
// ==========================================
export default function HomePage() {
  // On rend simplement le composant client qui contient toute la logique
  return <HomeView />;
}