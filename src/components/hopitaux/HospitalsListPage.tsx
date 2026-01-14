/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, Phone, Star, Search, ChevronDown, Grid3x3, List, Heart, Navigation, Shield, CheckCircle, Activity, RefreshCw, Lock, ArrowUpDown,
  ChevronUp,
  Filter
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Imports
import { organizationsApi, reactionsApi } from '@/lib/api-endponts'; 
import { Organization, OrganizationType } from '@/types/organization';
import { CreateReactionDto, ReactionType as ReactReactionType, ContentType } from '@/types/reaction';

// Hooks Custom (Optimisés)
import useDebounce  from '@/hooks/useDebounce'; // Assure-toi que ce hook existe
import { useBookmarksCheck } from '@/hooks/useBookmarks';
import { useAuthState } from '@/hooks/useAuthState';

// Components UI
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
});

// --- UI HELPERS ---

// Options de tri
const SORT_OPTIONS = [
  { value: 'distance', label: 'Plus proche' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'name', label: 'Nom (A-Z)' },
];

const FilterPanel: React.FC<{
  activeFilters: any;
  setActiveFilters: React.Dispatch<React.SetStateAction<any>>;
  allCities: string[];
  allTypes: OrganizationType[];
  getTypeLabel: (type: OrganizationType) => string;
  resetFilters: () => void;
}> = ({ activeFilters, setActiveFilters, allCities, allTypes, getTypeLabel, resetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCity = (city: string) => {
    setActiveFilters((prev: any) => {
      const current = prev.cities || [];
      return { ...prev, cities: current.includes(city) ? current.filter((c: string) => c !== city) : [...current, city] };
    });
  };

  const toggleType = (type: string) => {
     setActiveFilters((prev: any) => ({
        ...prev,
        type: prev.type === type ? '' : type // Single select pour type
     }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center font-bold text-gray-700">
          <Filter className="w-4 h-4 mr-2 text-blue-600" />
          Filtres & Tri
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-5 space-y-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Types */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Type d&apos;établissement</h4>
            <div className="flex flex-wrap gap-2">
              {allTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilters.type === type
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Villes</h4>
            <div className="flex flex-wrap gap-2">
              {allCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilters.cities?.includes(city)
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={resetFilters}
            className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onRedirect: () => void }> = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
        <p className="text-gray-500 mb-6">Vous devez être connecté pour ajouter cet hôpital à vos favoris.</p>
        <div className="space-y-3">
          <button 
            onClick={onRedirect}
            className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Se connecter
          </button>
          <button 
            onClick={onClose}
            className="w-full py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---

const HospitalsListPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isReady: authReady } = useAuthState(); // ✅ Auth propre

  // États
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const [activeFilters, setActiveFilters] = useState<{
    cities: string[];
    type: OrganizationType | string;
  }>({
    cities: [],
    type: ''
  });

  // ✅ État de tri connecté
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Organization | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- REACT QUERY : RÉCUPÉRATION DES DONNÉES ---
  const { 
    data: organizationsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['organizations', 'list', debouncedSearch, activeFilters.cities, activeFilters.type, sortBy, 1],
    queryFn: () => organizationsApi.getOrganizations({
      search: debouncedSearch,
      city: activeFilters.cities[0], // API supporte peut-être qu'une ville, à vérifier
      type: activeFilters.type as string || undefined,
      limit: 20,
      sortBy: sortBy // ✅ ENVOI DU TRI
    }),
    placeholderData: (previousData) => previousData,
    enabled: true, // Toujours activé
  });

  const organizations = organizationsData?.data || [];
  const total = organizationsData?.meta.total || 0;

  // ✅ OPTIMISATION BATCH CHECK : Favoris
  // On collecte tous les IDs pour une seule requête au lieu de N requêtes
  const organizationIds = useMemo(() => organizations.map(o => o.id), [organizations]);
  const { data: bookmarkedMap } = useBookmarksCheck(
    ContentType.ORGANIZATION, 
    organizationIds, 
    authReady && isAuthenticated
  );

  // --- REACT QUERY : LIKES ---
  const toggleReactionMutation = useMutation({
    mutationFn: (data: CreateReactionDto) => reactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });
      // On ne met pas de toast ici car l'UI update est instantanée (optimistic update possible mais non implémenté pour simplifier)
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    }
  });

  // --- EFFETS ---
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  // --- HANDLERS ---
  const handleLike = (hospitalId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!authReady || !isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    toggleReactionMutation.mutate({
      contentType: ContentType.ORGANIZATION,
      contentId: hospitalId,
      type: ReactReactionType.LIKE
    });
  };

  const handleBookmark = (hospitalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Logique bookmark (toggle) peut être ajoutée ici via un hook useToggleBookmark
    // Pour l'instant, on affiche juste l'état grâce au bookmarkedMap
    if (!authReady || !isAuthenticated) {
        setShowLoginModal(true);
        return;
    }
    toast.success("Fonctionnalité bientôt disponible (Toggle Bookmark)");
  }

  const resetFilters = () => {
    setActiveFilters({ cities: [], type: '' });
    setSearchQuery('');
    setSortBy('distance');
  };

  const getTypeLabel = (type: OrganizationType): string => {
    switch (type) {
      case OrganizationType.HOSPITAL_PUBLIC: return 'Hôpital Public';
      case OrganizationType.HOSPITAL_PRIVATE: return 'Hôpital Privé';
      case OrganizationType.CLINIC: return 'Clinique';
      case OrganizationType.HEALTH_CENTER: return 'Centre de Santé';
      case OrganizationType.DISPENSARY: return 'Dispensaire';
      case OrganizationType.NGO: return 'ONG';
      case OrganizationType.MINISTRY: return 'Ministère';
      default: return type;
    }
  };

  const getTypeColor = (type: OrganizationType): string => {
    switch (type) {
      case OrganizationType.HOSPITAL_PUBLIC: return 'bg-blue-100 text-blue-800';
      case OrganizationType.HOSPITAL_PRIVATE: return 'bg-purple-100 text-purple-800';
      case OrganizationType.CLINIC: return 'bg-green-100 text-green-800';
      case OrganizationType.HEALTH_CENTER: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateToDetails = (id: string) => router.push(`/hopitals/${id}`);

  // Helper pour vérifier si bookmarké
  const isBookmarked = (id: string) => !!bookmarkedMap?.[id];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Meta pour SEO Client-side fallback, mais priorité au Server Component */}
      <Head>
        <title>Trouvez un Hôpital - Santé Cameroun</title>
        <meta name="description" content="Annuaire des hôpitaux et cliniques au Cameroun" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Hôpitaux</h1>
          </div>
          
          {/* Bouton Sort visible en mobile ou desktop si besoin */}
          <div className="relative group">
             <button className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
               <ArrowUpDown className="w-4 h-4 mr-1" />
               {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
             </button>
             {/* Dropdown Sort Simple */}
             <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-100 hidden group-hover:block z-50">
                {SORT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value as any)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
                        {opt.label}
                    </button>
                ))}
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sticky top-20 z-30">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, ville, spécialité..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => setViewMode('list')} className={`py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Liste</button>
             <button onClick={() => setViewMode('map')} className={`py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Carte</button>
          </div>
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allCities={['Douala', 'Yaoundé', 'Bafoussam', 'Ngaoundéré', 'Bamenda', 'Garoua', 'Maroua', 'Buea']}
          allTypes={[OrganizationType.HOSPITAL_PUBLIC, OrganizationType.HOSPITAL_PRIVATE, OrganizationType.CLINIC, OrganizationType.HEALTH_CENTER, OrganizationType.DISPENSARY]}
          getTypeLabel={getTypeLabel}
          resetFilters={resetFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-gray-900 font-bold text-lg">{total}</span> établissements
          </p>
          <button onClick={() => refetch()} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <RefreshCw className="w-4 h-4 mr-1" /> Actualiser
          </button>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {isLoading ? (
               // Skeletons...
               <div className="text-center py-12 text-gray-500">Chargement...</div>
            ) : isError ? (
               <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                 <p className="text-red-500">Erreur de chargement.</p>
                 <button onClick={() => refetch()} className="mt-4 text-blue-600 underline">Réessayer</button>
               </div>
            ) : organizations.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                 <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
                 <p className="text-gray-500 mb-4">Essayez d&apos;élargir votre zone de recherche.</p>
                 <button onClick={resetFilters} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Effacer les filtres</button>
               </div>
            ) : (
              organizations.map((hospital) => (
                <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4" onClick={() => navigateToDetails(hospital.id)}>
                    {/* Image */}
                    <div className="relative shrink-0">
                      <img 
                        src={hospital.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=100`} 
                        alt={hospital.name} 
                        className="w-24 h-24 rounded-xl object-cover bg-gray-50"
                        loading="lazy" // ✅ LAZY LOADING
                      />
                      {hospital.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-sm border-2 border-white" aria-label="Vérifié">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{hospital.name}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeColor(hospital.type)}`}>
                              {getTypeLabel(hospital.type)}
                            </span>
                            {hospital.emergencyAvailable && (
                              <span className="flex items-center text-red-600 font-medium text-xs">
                                <Activity className="w-3 h-3 mr-1" /> Urgences
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{hospital.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center mt-4 space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                          {hospital.city}, {hospital.region}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                          <span className="font-bold text-gray-900">{hospital.totalReviews || 0} avis</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                      <button 
                        onClick={(e) => handleBookmark(hospital.id, e)}
                        className={`p-2.5 rounded-xl transition-colors ${isBookmarked(hospital.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        title="Favoris"
                      >
                        <Heart className={`w-6 h-6 ${isBookmarked(hospital.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${hospital.phone}`); }} 
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Appeler"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
           <div className="h-[600px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
             <MapView 
               hospitals={organizations}
               userLocation={userLocation}
               selectedHospital={selectedHospital}
               setSelectedHospital={setSelectedHospital}
               getDirections={(h) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`)}
               navigateToDetails={navigateToDetails}
               getTypeLabel={getTypeLabel}
               getMarkerColor={(t) => t === OrganizationType.HOSPITAL_PUBLIC ? '#3B82F6' : '#8B5CF6'}
             />
           </div>
        )}
      </main>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onRedirect={() => router.push('/login')} 
      />
    </div>
  );
};

export default HospitalsListPage;