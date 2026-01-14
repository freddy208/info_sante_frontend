// src/app/home-view.tsx
"use client"; // ✅ INDISPENSABLE car on utilise useEffect et useAuthStore

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation"; // ✅ CORRECTION : next/navigation et non next/router
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

// ==========================================
// LAZY LOADING DES COMPOSANTS
// ==========================================

const HeroSection = dynamic(() => import("@/components/landing/HeroSection").then(mod => mod.HeroSection));
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
  }
);
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
  }
);
const GeoSection = dynamic(
  () => import("@/components/landing/GeoSection").then((mod) => mod.GeoSection),
  {
    loading: () => (
      <section className="py-24 bg-gradient-to-b from-white via-slate-50 to-white h-[600px] animate-pulse" />
    ),
    ssr: true,
  }
);

// ✅ CORRECTION ICI : On utilise mod.default car c'est un export default
const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.default));

// ==========================================
// COMPOSANT PRINCIPAL (LOGIQUE + AFFICHAGE)
// ==========================================
export default function HomeView() {
  const router = useRouter(); // ✅ Importation correcte depuis next/navigation
  const { isAuthenticated, isLoading } = useAuthStore();

  // Redirection intelligente
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/accueil');
    }
  }, [isAuthenticated, isLoading, router]);

  // Affichage d'un loader pendant la vérification du store
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    );
  }

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