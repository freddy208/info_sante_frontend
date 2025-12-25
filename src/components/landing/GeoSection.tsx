"use client";

import dynamic from "next/dynamic";
import { MapPin, Navigation, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Importation dynamique du rendu de la carte
const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 animate-pulse space-y-3">
      <MapPin className="w-8 h-8" />
      <span className="text-sm font-medium">Chargement de la carte...</span>
    </div>
  ),
});

export function GeoSection() {
  return (
    <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white relative overflow-hidden">
      
      {/* Forme d'arrière-plan abstraite pour le volume */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[600px] bg-blue-50/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              // CORRECTION ESPACEMENT : mb-4 remplacé par mb-2
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm"
            >
              <Activity className="w-3.5 h-3.5" />
              Géolocalisation en temps réel
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Trouver les soins <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-500">
                autour de moi
              </span>
            </motion.h2>
            
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Accès instantané à l&apos;annuaire complet. Hôpitaux, pharmacies et cliniques disponibles à proximité de votre position actuelle.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* CORRECTION BOUTON : Ajout explicite de text-white et d'un dégradé moderne */}
            <Button 
              className="rounded-full px-8 h-14 text-base font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              Liste complète
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Le Conteneur de la Carte Premium */}
        <div className="relative group">
          {/* Ombre décorative sous la carte */}
          <div className="absolute -bottom-6 left-10 right-10 h-8 bg-slate-900/10 blur-xl rounded-[inherit] -z-10"></div>

          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-[6px] border-white">
            
            {/* Overlay Flottant - Statistiques Rapides */}
            <div className="absolute top-6 left-6 z-1000 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs transition-transform group-hover:scale-105 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Disponibles</p>
                  <p className="text-2xl font-bold text-slate-900">156 <span className="text-sm font-normal text-slate-500">structures</span></p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Mise à jour il y a 2 min
              </div>
            </div>

            {/* Overlay Flottant - FAB (Floating Action Button) "Ma Position" */}
            <div className="absolute bottom-8 right-8 z-1000">
              <button className="w-14 h-14 bg-white text-blue-600 rounded-full shadow-xl shadow-blue-900/10 flex items-center justify-center hover:bg-blue-50 hover:scale-110 transition-all duration-200 border border-slate-100">
                <Navigation className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* Overlay Flottant - Filtres (Visuel pour montrer la complexité) */}
            <div className="absolute top-6 right-6 z-1000 hidden md:flex flex-col gap-2">
              <button className="w-10 h-10 bg-white text-slate-600 rounded-lg shadow-md border border-slate-100 flex items-center justify-center hover:text-blue-600 hover:shadow-lg transition-all">
                <Activity className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white text-slate-600 rounded-lg shadow-md border border-slate-100 flex items-center justify-center hover:text-blue-600 hover:shadow-lg transition-all">
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* La carte elle-même */}
            <MapRenderer />
          </div>
        </div>
      </div>
    </section>
  );
}