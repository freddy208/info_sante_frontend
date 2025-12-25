"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Activity, Zap } from "lucide-react";
import { Button } from "../ui/button";

export function HeroSection() {
  return (
<section className="
  relative w-full min-h-[600px] md:min-h-[700px]
  bg-gradient-to-br
  from-[var(--primary-dark)]   /* Haut-Gauche : Vert Très Foncé (Profond) */
  via-[var(--secondary)]       /* Milieu : Bleu Vif (Transition dynamique) */
  to-[var(--secondary-light)]  /* Bas-Droite : Bleu Ciel (Lumière & Profondeur) */
  text-white
  pt-20 pb-32
  overflow-hidden
  flex items-center
">
  {/* Overlay réduit : On laisse les couleurs respirer ! */}
  <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>

      
      {/* Formes d'arrière-plan animées (Blobs) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary opacity-30 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent opacity-20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      
      {/* Pattern subtil de texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge "Fierté" */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-medium text-white/90">Plateforme nationale d’information sanitaire</span>
          </motion.div>

          {/* Titre Principal */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            <span className="block">MboaSanté</span>
            <span className="block text-3xl md:text-4xl font-light text-(--primary-light) mt-2">
             L’information fiable pour mieux protéger votre santé.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Une information sanitaire fiable, claire et accessible à tous, pour accompagner les Camerounais partout sur le territoire.
          </p>

          {/* 3. Barre de Recherche "Glassmorphism" Premium */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-3xl mx-auto group"
          >
            {/* Effet de lueur derrière la barre (COULEUR BLUE SANTÉ) */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl p-2 border border-white/50 transform transition-transform duration-300 group-hover:scale-[1.01]">
              <div className="pl-5 pr-3">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full bg-transparent border-none text-slate-900 text-lg placeholder-slate-400 focus:outline-none focus:ring-0 h-12"
                placeholder="Symptômes, hôpitaux, informations de santé..."
              />
              <Button className="bg-linear-to-r from-primary to-secondary hover:from-(--primary-dark) hover:to-(--secondary-dark) rounded-full px-8 h-12 text-white font-bold shadow-lg transition-all transform hover:scale-105">
                Rechercher
              </Button>
            </div>
          </motion.div>

          {/* 4. Tags de recherche populaire (UX pattern moderne) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm text-white/70"
          >
            <span className="font-semibold">Populaires :</span>
            {['Choléra', 'Hôpital Central', 'Pharmacie Yaoundé', 'Vaccination'].map((tag, index) => (
              <button 
                key={index}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-1"
              >
                <Activity className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </motion.div>

          {/* 5. Localisation & Confiance (RETOUR AU BLEU MÉDICAL) */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-white/60 text-sm font-medium">
            <div className="flex items-center gap-2">
              {/* Bleu Médical pur */}
              <MapPin className="w-4 h-4 text-blue-300" />
              <span>Couverture des 10 régions du Cameroun</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-2">
              {/* Bleu Médical pur */}
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span>Plateforme disponible 24h/24</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Wave SVG Separator (CORRIGÉ : Vague complète, pas de lignes droites) */}
      {/* Le path commence maintenant à M0 et finit à 1200 pour éviter l'effet "rebandance" */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-20"
        >
          {/* Nouveau Path qui couvre toute la largeur (0 à 1200) pour une vague fluide */}
          <path 
            d="M0,50 C150,0 350,100 500,50 C650,0 850,100 1000,50 C1100,15 1150,0 1200,50 V120 H0 V50 Z" 
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>
    </section>
  );
}