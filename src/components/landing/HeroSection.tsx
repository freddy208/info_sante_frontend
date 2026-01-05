"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";
import { PublicSearchResponse, SearchResultItem } from "@/types/public";
import Link from "next/link";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length === 0) {
      setResults(null);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2 && !isFetchingRef.current) {
        performSearch(query);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setResults(null);
        setLoading(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResults(null);
        setLoading(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const performSearch = async (q: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await publicApi.search(q);
      setResults(res);
    } catch (err) {
      console.error("Erreur recherche", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const getLink = (item: SearchResultItem) => {
    if (item.type === 'ORGANIZATION') {
      return `/organizations/${item.id}`;
    }
    if (item.type === 'ANNOUNCEMENT') {
      return `/annonces/${item.slug ?? item.id}`;
    }
    if (item.type === 'ARTICLE') {
      return `/articles/${item.slug ?? item.id}`;
    }
    return '#';
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.length >= 2 && !isFetchingRef.current) {
      performSearch(query);
    }
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
  };

  return (
    <section 
        // ✅ CORRECTION 1 : HAUTEUR FIXE (h au lieu de min-h)
        // Cela empêche la section de s'agrandir et de pousser le contenu en bas.
        className="
      relative w-full h-[600px] md:h-[700px] 
      bg-(--primary-dark)
      bg-linear-to-br
      from-(--primary-dark)
      via-primary
      to-(--secondary-dark)
      text-white
      pt-20 pb-32
      overflow-hidden
      flex items-center"
      >
      {/* Background elements... */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-500 opacity-20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-medium text-white/90">Plateforme nationale d’information sanitaire</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-2xl">
            <span className="block">MboaSanté</span>
            <span className="block text-3xl md:text-4xl font-light text-blue-300 mt-2">
             L’information fiable pour mieux protéger votre santé.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Une information sanitaire fiable, claire et accessible à tous, pour accompagner les Camerounais partout sur le territoire.
          </p>

          {/* Barre de Recherche */}
          <motion.div ref={searchContainerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative max-w-3xl mx-auto group z-50">
            <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            {/* Ajout du <form> pour la touche Entrée */}
            <form onSubmit={handleSubmit} className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl p-2 border border-white/50 transform transition-transform duration-300 group-hover:scale-[1.01]">
              <div className="pl-5 pr-3">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full bg-transparent border-none text-slate-900 text-lg placeholder-slate-400 focus:outline-none focus:ring-0 h-12"
                placeholder="Symptômes, hôpitaux, informations de santé..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              <Button type="submit" className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full px-8 h-12 text-white font-bold shadow-lg transition-all transform hover:scale-105">
                Rechercher
              </Button>
            </form>

            {/* Dropdown Résultats */}
            <AnimatePresence>
              {query.length > 0 && (results || loading) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  // ✅ CORRECTION 2 : Z-INDEX ÉLEVÉ (100) et max-height strict
                  className="absolute top-full left-0 w-full mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-100 text-left"
                >
                  {loading ? (
                    <div className="p-4 flex justify-center text-slate-500 text-sm">
                       <div className="flex items-center gap-2">
                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                         Recherche en cours...
                       </div>
                    </div>
                  ) : results?.status === 'success' && results.data.length > 0 ? (
                    // ✅ CORRECTION 3 : Max-height pour éviter que le dropdown occupe tout l'écran visuellement
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {results.data.map((item) => (
                        <Link href={getLink(item)} key={item.id} className="w-full text-left block">
                          <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${item.type === 'ORGANIZATION' ? 'bg-blue-500' : item.type === 'ANNOUNCEMENT' ? 'bg-red-500' : 'bg-teal-500'}`}>
                               {item.type === 'ORGANIZATION' ? 'H' : item.type === 'ANNOUNCEMENT' ? 'A' : 'I'}
                             </div>
                             <div className="overflow-hidden">
                               <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                               <p className="text-xs text-slate-500 truncate">
                                 {item.type === 'ORGANIZATION' ? item.cityName : item.excerpt}
                               </p>
                             </div>
                          </button>
                        </Link>
                      ))}
                    </div>
                  ) : results?.status === 'empty' ? (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900">Aucun résultat pour &quot;{query}&quot;</h4>
                      <p className="text-sm text-slate-500 mb-4">Essayez ces recherches connexes :</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {results.suggestions?.map((s, index) => (
                          <button key={index} onClick={() => handleTagClick(s)} className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full text-xs font-semibold transition-colors border border-slate-200">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 flex flex-wrap justify-center items-center gap-3 text-sm text-white/70">
            <span className="font-semibold">Populaires :</span>
            {['Choléra', 'Hôpital Central', 'Pharmacie Yaoundé', 'Vaccination'].map((tag, index) => (
              <button key={index} onClick={() => handleTagClick(tag)} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </motion.div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-white/60 text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span>Couverture des 10 régions du Cameroun</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span>Plateforme disponible 24h/24</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Footer Hero SVG... */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-20">
          <path d="M0,50 C150,0 350,100 500,50 C650,0 850,100 1000,50 C1100,15 1150,0 1200,50 V120 H0 V50 Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}