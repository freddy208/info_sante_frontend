
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Activity, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicApi } from "@/lib/api";
import { PublicSearchResponse, SearchResultItem } from "@/types/public";
import Link from "next/link";

type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicSearchResponse | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- Debounce + AbortController + retry léger ---
  useEffect(() => {
    if (query.length === 0) {
      setResults(null);
      setSearchStatus('idle');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        setSearchStatus('loading');

        publicApi.search(query, controller.signal)
          .then((res) => {
            setResults(res);
            setSearchStatus(res.data.length === 0 ? 'empty' : 'success');
          })
          .catch((err) => {
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
            console.error("Erreur recherche", err);
            setSearchStatus('error');
            setResults({ status: 'empty', data: [], suggestions: [] });
          });
      } else {
        setSearchStatus('idle');
        setResults(null);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // --- Click / Escape pour fermer le dropdown ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setResults(null);
        setSearchStatus('idle');
      }
    };
    const handleEscape = (e: KeyboardEvent) => e.key === "Escape" && (setResults(null), setSearchStatus('idle'));

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getLink = (item: SearchResultItem) => {
    if (item.type === 'ORGANIZATION') return `/hopitals/${item.id}`;
    if (item.type === 'ANNOUNCEMENT') return `/annonces/${item.slug ?? item.id}`;
    if (item.type === 'ARTICLE') return `/articles/${item.slug ?? item.id}`;
    return '#';
  };

  const handleSubmit = (e: FormEvent) => e.preventDefault();
  const handleTagClick = (tag: string) => setQuery(tag);

  const memoizedResults = useMemo(() => results?.data ?? [], [results]);

  return (
    <section      className="relative w-full h-[600px] md:h-[700px] 
      bg-(--primary-dark)
      bg-linear-to-br
      from-(--primary-dark)
      via-primary
      to-(--secondary-dark)
      text-white
      pt-20 pb-32
      overflow-hidden
      flex items-center">
      {/* Background blobs verts */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-30 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-500 opacity-20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4 md:mb-6">
            <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-xs md:text-sm font-medium text-white/90">Plateforme nationale d’information sanitaire</span>
          </motion.div>

          {/* Titres */}
          <h1 className="text-4xl md:text-7xl font-extrabold mb-4 md:mb-6 tracking-tight drop-shadow-2xl">
            <span className="block">MboaSanté</span>
            <span className="block text-2xl md:text-4xl font-light text-green-100 mt-1 md:mt-2">
              L’information fiable pour mieux protéger votre santé.
            </span>
          </h1>

          <p className="text-base md:text-xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Une information sanitaire fiable, claire et accessible à tous, pour accompagner les Camerounais partout sur le territoire.
          </p>

          {/* Barre de Recherche */}
          <motion.div ref={searchContainerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative max-w-3xl mx-auto group z-50">
            <form onSubmit={handleSubmit} className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl p-2 border border-white/50 transform transition-transform duration-300 group-hover:scale-[1.01]">
              <div className="pl-4 pr-2 md:pl-5 md:pr-3">
                <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full bg-transparent border-none text-slate-900 text-base md:text-lg placeholder-slate-400 focus:outline-none focus:ring-0 h-12"
                placeholder="Symptômes, hôpitaux..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                aria-label="Rechercher un hôpital, un symptôme ou une information santé"
              />
              <Button type="submit" className="bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-full px-4 md:px-8 h-10 md:h-12 text-white font-bold shadow-lg transition-all transform hover:scale-105 text-sm md:text-base">
                Rechercher
              </Button>
            </form>

            {/* Dropdown Résultats */}
            <AnimatePresence>
              {query.length > 0 && (searchStatus !== 'idle') && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }} 
                  className="absolute top-full left-0 w-full mt-3 md:mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-y-auto max-h-[60vh] z-50"
                >
                   {searchStatus === 'loading' && (
                    <div className="p-4 flex justify-center text-slate-500 text-sm">
                      <div className="flex items-center gap-2 animate-pulse">
                        <div className="rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Recherche en cours...
                      </div>
                    </div>
                  )}

                  {searchStatus === 'error' && (
                    <div className="p-6 text-center bg-red-50">
                      <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">!</span>
                      </div>
                      <h4 className="font-bold text-slate-900">Erreur de connexion</h4>
                      <p className="text-sm text-slate-500 mb-4">Impossible de contacter le serveur. Vérifiez votre internet.</p>
                      <Button onClick={() => setQuery(query)} variant="outline" size="sm" className="mx-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        Réessayer
                      </Button>
                    </div>
                  )}

                  {searchStatus === 'success' && memoizedResults.length > 0 && memoizedResults.map(item => (
                    <Link href={getLink(item)} key={item.id}>
                      <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${item.type === 'ORGANIZATION' ? 'bg-blue-500' : item.type === 'ANNOUNCEMENT' ? 'bg-red-500' : 'bg-teal-500'}`}>
                          {item.type === 'ORGANIZATION' ? 'H' : item.type === 'ANNOUNCEMENT' ? 'A' : 'I'}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                          <p className="text-xs text-slate-500 truncate">{item.type === 'ORGANIZATION' ? item.cityName : item.excerpt}</p>
                        </div>
                      </button>
                    </Link>
                  ))}

                  {searchStatus === 'empty' && (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900">Aucun résultat pour &quot;{query}&quot;</h4>
                      <p className="text-sm text-slate-500 mb-4">Essayez ces recherches connexes :</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {results?.suggestions?.map((s, i) => (
                          <button key={i} onClick={() => handleTagClick(s)} className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full text-xs font-semibold transition-colors border border-slate-200">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tags populaires */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4 md:mt-6 flex flex-wrap justify-center items-center gap-2 md:gap-3 text-xs md:text-sm text-white/70">
            <span className="font-semibold">Populaires :</span>
            {['Choléra', 'Hôpital Central', 'Pharmacie Yaoundé', 'Vaccination'].map((tag, i) => (
              <button key={i} onClick={() => handleTagClick(tag)} className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span className="hidden sm:inline">{tag}</span>
                <span className="sm:hidden">{tag.split(' ')[0]}</span>
              </button>
            ))}
          </motion.div>

          {/* Info Footer */}
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 text-white/60 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-green-200" />
              <span>Couverture des 10 régions</span>
            </div>
            <div className="h-3 w-px bg-white/20 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Disponible 24h/24</span>
            </div>
          </div>

        </motion.div>
      </div>

      {/* SVG Footer Wave */}
      <div className="absolute bottom-0 left-0 w-full leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12 md:h-20">
          <path d="M0,50 C150,0 350,100 500,50 C650,0 850,100 1000,50 C1100,15 1150,0 1200,50 V120 H0 V50 Z" fill="#FFFFFF"></path>
        </svg>
      </div>
    </section>
  );
}
