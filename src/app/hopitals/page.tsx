/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, Phone, Star, Filter, Search, ChevronDown, Grid3x3, List, Heart, Navigation, Target, Shield, CheckCircle, Activity, RefreshCw, ChevronUp, Lock 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Imports API & Types
import { organizationsApi, reactionsApi } from '@/lib/api-endponts'; 
import { Organization, OrganizationType, PaginatedOrganizationsResponse } from '@/types/organization';
import { CreateReactionDto, ReactionType as ReactReactionType, ContentType } from '@/types/reaction';

// Imports Composants
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

// --- UTILITAIRES & HOOKS ---

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="relative h-96 bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
});

// --- COMPOSANTS UI ---

interface CustomDropdownProps {
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:border-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center truncate">
          {icon && <span className="mr-2 text-blue-500">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors ${
                value === option.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center font-bold text-gray-700">
          <Filter className="w-4 h-4 mr-2 text-blue-600" />
          Filtres
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="p-5 space-y-6 border-t border-gray-100">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ville</h4>
            <div className="flex flex-wrap gap-2">
              {allCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilters.cities.includes(city)
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
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
};

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onRedirect: () => void }> = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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

  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Organization | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('access_token');

  // --- REACT QUERY : RÉCUPÉRATION DES DONNÉES ---
  const { 
    data: organizationsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery<PaginatedOrganizationsResponse>({
    queryKey: ['organizations', 'list', debouncedSearch, activeFilters.cities, activeFilters.type, sortBy, 1],
    queryFn: () => organizationsApi.getOrganizations({
      search: debouncedSearch,
      city: activeFilters.cities[0],
      type: activeFilters.type as string || undefined,
      limit: 20,
    }),
    placeholderData: (previousData) => previousData,
  });

  const organizations = organizationsData?.data || [];
  const total = organizationsData?.meta.total || 0;

  // --- REACT QUERY : LIKES ---
  const toggleReactionMutation = useMutation({
    mutationFn: (data: CreateReactionDto) => reactionsApi.create(data),
    onSuccess: (returnedData, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });
      if (returnedData) {
        toast.success('Ajouté aux favoris');
      } else {
        toast.success('Retiré des favoris');
      }
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation(null)
      );
    }
  }, []);

  // --- HANDLERS ---
  const handleLike = (hospitalId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Important pour ne pas naviguer en cliquant sur "J'aime"
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    toggleReactionMutation.mutate({
      contentType: ContentType.ORGANIZATION,
      contentId: hospitalId,
      type: ReactReactionType.LIKE
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setActiveFilters({ cities: [], type: '' });
    setSearchQuery('');
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

  // --- RENDERS ---
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Head>
        <title>Trouvez un Hôpital - Santé Cameroun</title>
        <meta name="description" content="Annuaire des hôpitaux et cliniques au Cameroun" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-2">Hôpitaux</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Search & Quick Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" 
              value={searchQuery} 
              onChange={handleSearchChange}
              placeholder="Rechercher par nom, ville..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <CustomDropdown
              value={activeFilters.cities[0] || ''}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, cities: val ? [String(val)] : [] }))}
              options={[{ value: '', label: 'Toutes les villes' }, { value: 'Douala', label: 'Douala' }, { value: 'Yaoundé', label: 'Yaoundé' }, { value: 'Bafoussam', label: 'Bafoussam' }]}
              placeholder="Ville"
              icon={<MapPin className="w-4 h-4" />}
            />
            <CustomDropdown
              value={activeFilters.type}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, type: String(val) }))}
              options={[{ value: '', label: 'Tous les types' }, { value: OrganizationType.HOSPITAL_PUBLIC, label: 'Public' }, { value: OrganizationType.HOSPITAL_PRIVATE, label: 'Privé' }, { value: OrganizationType.CLINIC, label: 'Clinique' }]}
              placeholder="Type"
              icon={<Shield className="w-4 h-4" />}
            />
            <div className="col-span-2 flex items-center space-x-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
              <button 
                onClick={() => setViewMode('list')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => setViewMode('map')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <FilterPanel
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allCities={['Douala', 'Yaoundé', 'Bafoussam', 'Ngaoundéré', 'Bamenda']}
          allTypes={[OrganizationType.HOSPITAL_PUBLIC, OrganizationType.HOSPITAL_PRIVATE, OrganizationType.CLINIC]}
          getTypeLabel={getTypeLabel}
          resetFilters={resetFilters}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-gray-900 font-bold text-lg">{total}</span> hôpitaux trouvés
          </p>
          <button onClick={() => refetch()} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <RefreshCw className="w-4 h-4 mr-1" /> Actualiser
          </button>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex space-x-2 mt-4">
                        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-red-500 font-medium">Erreur lors du chargement des hôpitaux.</p>
                <button onClick={() => refetch()} className="mt-4 text-blue-600 underline">Réessayer</button>
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
                <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche.</p>
                <button onClick={resetFilters} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                  Effacer les filtres
                </button>
              </div>
            ) : (
              organizations.map((hospital) => (
                // ✅ CORRECTION : Ajout de cursor-pointer sur la div de carte
                <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4" onClick={() => navigateToDetails(hospital.id)}>
                    <div className="relative group">
                      <img 
                        src={hospital.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=100`} 
                        alt={hospital.name} 
                        className="w-24 h-24 rounded-xl object-cover bg-gray-50"
                      />
                      {hospital.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1 rounded-full shadow-sm border-2 border-white">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate">{hospital.name}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getTypeColor(hospital.type)}`}>
                              {getTypeLabel(hospital.type)}
                            </span>
                            {hospital.emergencyAvailable && (
                              <span className="flex items-center text-red-600 font-medium text-xs">
                                <Activity className="w-3 h-3 mr-1" /> Urgences 24/7
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

                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2">
                      <button 
                        onClick={(e) => handleLike(hospital.id, e)} // ✅ StopPropagation ajouté
                        className={`p-2.5 rounded-xl flex-1 sm:flex-none transition-all ${
                          toggleReactionMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        title="Ajouter aux favoris"
                      >
                        <Heart className={`w-6 h-6 text-gray-400 hover:text-red-500 transition-colors ${toggleReactionMutation.isPending ? 'animate-pulse' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${hospital.phone}`); }} // ✅ StopPropagation ajouté
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Appeler"
                      >
                        <Phone className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigateToDetails(hospital.id); }} // ✅ StopPropagation ajouté (bouton explicite au cas où)
                        className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex-1 sm:flex-none"
                        title="Voir détails"
                      >
                        <Navigation className="w-6 h-6 mx-auto" />
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
               navigateToDetails={navigateToDetails} // ✅ Prop passée correctement
               getTypeLabel={getTypeLabel}
               getMarkerColor={(t) => t === OrganizationType.HOSPITAL_PUBLIC ? '#3B82F6' : '#8B5CF6'}
             />
           </div>
        )}
      </main>

      {/* Modal Connexion */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onRedirect={() => router.push('/login')} 
      />
    </div>
  );
};

export default HospitalsListPage;