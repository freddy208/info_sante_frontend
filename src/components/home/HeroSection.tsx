/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react'; // ✅ AJOUT useCallback
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Activity, ArrowRight, Bell, Users, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useOrganizationsList } from '@/hooks/useOrganizations';
import { useAnnouncementsList } from '@/hooks/useAnnouncements';
import { publicApi } from '@/lib/api';

// ==========================================
// 1. DÉFINITION DES TYPES
// ==========================================

interface SearchResultItem {
  id: string;
  title: string;
  type: 'ORGANIZATION' | 'ANNOUNCEMENT' | 'ARTICLE';
  slug?: string | null;
  excerpt?: string | null;
  city?: string | null;
  region?: string | null;
}

interface PublicSearchResponse {
  status: 'success' | 'empty';
  data: SearchResultItem[];
  suggestions?: string[];
}

export default function HeroSection() {
  const router = useRouter();
  
  // ==========================================
  // 2. ÉTAT LOCAL (Search & UX)
  // ==========================================
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[] | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isFetchingRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 3. DONNÉES RÉELLES (API) pour les Stats
  // ==========================================
  
  const { data: announcementsData } = useAnnouncementsList({ page: 1, limit: 1 });
  const announcementsCount = announcementsData?.meta?.total ?? 0;

  const { data: organizationsData } = useOrganizationsList({ page: 1, limit: 1 } );
   const organizationsCount = 
    (organizationsData as any)?.meta?.total || 
    (Array.isArray(organizationsData) ? organizationsData.length : 0);

  // ✅ CORRECTION ERREUR 1 : Gestion du type pour usersCount
  // Intl.NumberFormat renvoie un string (ex: "50 k"), on ne peut pas faire de division dessus.
  // On le formate directement ici.
  const usersCount = new Intl.NumberFormat('fr-FR', { 
    notation: "compact", 
    maximumFractionDigits: 1 
  }).format(50000); 

  // ==========================================
  // 4. LOGIQUE DE RECHERCHE (Optimisée)
  // ==========================================

  // ✅ CORRECTION ERREUR 2 : Suppression de la duplication. 
  // On ne garde que cette version optimisée avec useCallback.
  const performSearch = useCallback(async (q: string) => {
    if (isFetchingRef.current) return;
    // 🔒 SÉCURITÉ : Nettoyage basique
    const cleanQuery = q.trim().slice(0, 100); 
    
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const response: PublicSearchResponse = await publicApi.search(cleanQuery);
      setResults(response.data);
      
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      } else {
        setSuggestions(['Vaccination', 'Diabète', 'Paludisme']);
      }
    } catch (error) {
      console.error("Erreur recherche", error);
      setResults([]);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []); // Dépendances vides car tout est interne ou passé en argument

  // ✅ EFFET OPTIMISÉ : Dépendance sur performSearch (stable grâce à useCallback)
  useEffect(() => {
    if (query.length === 0) {
      setResults(null);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2 && !isFetchingRef.current) {
        performSearch(query);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, performSearch, isDropdownOpen]); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setQuery(''); 
        setResults(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
        setResults(null);
        searchContainerRef.current?.querySelector('input')?.blur();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const getLink = (item: SearchResultItem) => {
    if (item.type === 'ORGANIZATION') return `/hopitals/${item.id}`;
    if (item.type === 'ANNOUNCEMENT') return `/annonces/${item.slug || item.id}`;
    if (item.type === 'ARTICLE') return `/articles/${item.slug || item.id}`;
    return '#';
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length >= 2) setIsDropdownOpen(true);
    else setIsDropdownOpen(false);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) setIsDropdownOpen(true);
  };

  return (
    <section className="relative mt-16 md:mt-20 bg-linear-to-br from-teal-600 via-blue-600 to-cyan-600 overflow-hidden ">
      {/* Formes d'arrière-plan animées (Blobs) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500 opacity-20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-32 relative z-10">
        
        {/* GRID CONTAINER : 2 Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:items-start">
          
          {/* COLONNE GAUCHE : Texte, Recherche, Stats */}
          <div className="text-white space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                L&apos;information sanitaire <span className="text-cyan-200">digne de confiance</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl">
                Recevez les alertes des campagnes de vaccination, dépistages et consultations gratuites près de chez vous.
              </p>
            </motion.div>

            {/* Search Component */}
            <div ref={searchContainerRef} className="relative z-50">
              <div className="relative group transition-all duration-300">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                
                <div className="relative flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-2xl p-1.5 border border-white/50 transform transition-transform duration-300 group-hover:scale-[1.01]">
                  <div className="pl-5 pr-2 shrink-0">
                    <Search className="h-6 w-6 text-gray-400" />
                  </div>
                  
                  <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    className="w-full bg-transparent border-none text-gray-900 text-lg placeholder-gray-500 focus:outline-none h-12"
                    placeholder="Symptômes, hôpitaux, campagnes..."
                    autoComplete="off"
                  />
                  
                  {loading && (
                    <div className="pr-4 shrink-0">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    </div>
                  )}
                  
                  {!loading && query && (
                    <button 
                      onClick={() => { setQuery(''); setIsDropdownOpen(false); }}
                      className="pr-4 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  
                  {!loading && !query && (
                    <button 
                      onClick={() => query.length >= 2 && performSearch(query)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Dropdown de résultats */}
                <AnimatePresence>
                  {isDropdownOpen && (results !== null || loading) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {loading ? (
                        <div className="p-8 flex flex-col items-center justify-center text-gray-500">
                          <Loader2 className="h-8 w-8 animate-spin mb-2 text-blue-500" />
                          <span className="text-sm font-medium">Recherche en cours...</span>
                        </div>
                      ) : results && results.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                          {results.map((item) => (
                            <Link 
                              href={getLink(item)} 
                              key={item.id} 
                              onClick={() => setIsDropdownOpen(false)}
                              className="block w-full text-left"
                            >
                              <button className="w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-3 group/item">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                                  item.type === 'ORGANIZATION' ? 'bg-blue-500' : 
                                  item.type === 'ANNOUNCEMENT' ? 'bg-red-500' : 'bg-teal-500'
                                }`}>
                                  {item.type === 'ORGANIZATION' ? 'H' : item.type === 'ANNOUNCEMENT' ? 'A' : 'I'}
                                </div>
                                <div className="overflow-hidden">
                                  <h4 className="font-bold text-slate-800 truncate group-hover/item:text-blue-600 transition-colors">{item.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                    {item.type === 'ORGANIZATION' && (
                                      <>
                                        <MapPin className="w-3 h-3" />
                                        <span>{item.city}, {item.region}</span>
                                      </>
                                    )}
                                    {item.type !== 'ORGANIZATION' && item.excerpt && (
                                      <span className="truncate">{item.excerpt}</span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <Search className="h-6 w-6" />
                          </div>
                          <h4 className="font-bold text-slate-900">Aucun résultat pour &quot;{query}&quot;</h4>
                          <p className="text-sm text-slate-500 mb-4">Essayez ces recherches connues :</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {suggestions.map((s, index) => (
                              <button 
                                key={index} 
                                onClick={() => handleTagClick(s)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full text-sm font-semibold transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggestions Rapides (Tags) */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['Vaccination', 'Dépistage VIH', 'Consultation Gratuite'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleTagClick(suggestion)}
                    className="px-4 py-2 bg-white/20 text-white/90 hover:bg-white/30 hover:text-white border border-white/10 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2"
                  >
                    {suggestion === 'Vaccination' && <Activity className="w-4 h-4 text-yellow-300" />}
                    {suggestion === 'Dépistage VIH' && <Activity className="w-4 h-4 text-red-300" />}
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Real-time Stats Cards */}
              <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <StatCard icon={Bell} color="teal" title={`${announcementsCount}`} subtitle="Annonces Actives" />
                <StatCard icon={MapPin} color="blue" title={`${organizationsCount}`} subtitle="Hôpitaux & Cliniques" />
                
                {/* ✅ CORRECTION ICI : On passe usersCount tel quel (String) car il est déjà formaté compact */}
                <StatCard icon={Users} color="purple" title={usersCount} subtitle="Utilisateurs" />
              </div>
            </div>
          </div> 

          {/* COLONNE DROITE : Illustration */}
          <div className="relative justify-center md:justify-end mt-8 md:mt-0 hidden md:flex">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative transform transition-transform duration-500 hover:-translate-y-2 group w-full max-w-md lg:max-w-full"
            >
              <div className="absolute inset-0 bg-linear-to-r from-teal-400/20 to-blue-400/20 rounded-3xl blur-3xl group-hover:blur-xl transition-all"></div>
              <img 
                src="https://res.cloudinary.com/duqsblvzm/image/upload/v1765157251/logoHeader_f6pnu3.webp" 
                alt="Healthcare Cameroon"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover ring-1 ring-white/20"
              />
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

// Composant carte de statistique
function StatCard({ icon: Icon, color, title, subtitle }: { icon: any; color: string; title: string; subtitle: string }) {
  const colorMap: Record<string, string> = {
    teal: 'bg-teal-100 text-teal-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-white/50 group h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="h-2 w-2 rounded-full bg-green-500"></div>
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</p>
        <p className="text-sm font-medium text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}
