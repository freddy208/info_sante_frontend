/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useMemo, MouseEvent, useEffect, Suspense } from 'react'; // ✅ AJOUT SUSPENSE
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Star, ChevronDown, X, MapPin, Calendar, 
  Users, Loader2, Bookmark, Share2, List, Grid, AlertTriangle, Lock as LockIcon
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'; 

// ✅ AJOUT DES IMPORTS
import Navbar from '@/components/shared/Navbar'; // Import du Navbar
import { useAuthStore } from '@/stores/authStore'; // Import du Store CORRECT

// API & Hooks
import { announcementsApi, categoriesApi, bookmarksApi } from '@/lib/api-endponts';
import { Announcement, QueryAnnouncementDto, PaginatedAnnouncementsResponse } from '@/types/announcement';
import { Category, PaginatedCategoriesResponse } from '@/types/category';
import { ContentType } from '@/types/reaction';

// Utils
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { useBookmarksList, useToggleBookmark } from '@/hooks/useBookmarks';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';


// ==========================================
// COMPOSANTS CARTES (Code Intégré)
// ==========================================

function AnnouncementCard({ 
  announcement, 
  isBookmarked, 
  onBookmarkToggle, 
  isAuthenticated,
  onLoginPrompt 
}: { 
  announcement: Announcement; 
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  
  const fillPercentage = announcement.capacity 
    ? Math.round((announcement.registeredCount / announcement.capacity) * 100) 
    : 0;

  const handleViewDetails = () => {
    router.push(`/annonces/${announcement.slug || announcement.id}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/annonces/${announcement.slug}`;
    if (navigator.share) navigator.share({ title: announcement.title, url });
    else {
      navigator.clipboard.writeText(url);
      toast('Lien copié !', { icon: '📋' });
    }
  };

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    onBookmarkToggle();
  };

  const handleToggleDetails = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetails(prev => !prev);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <img
          src={ getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 225, crop: 'fill' })}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-linear-to-r ${getCategoryColor(announcement.category?.name || '')} text-white shadow-md`}>
            {getCategoryIcon(announcement.category?.name)} {announcement.category?.name}
          </span>
        </div>
        
        {announcement.isPinned && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-md">
              <Star className="h-3 w-3 mr-1" /> Épinglé
            </span>
          </div>
        )}
        
        {announcement.priority === 'URGENT' && (
          <div className="absolute bottom-3 left-3">
             <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white shadow-md animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" /> URGENT
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 flex space-x-2">
          <button 
            onClick={handleBookmarkClick} 
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
          </button>
          <button onClick={handleShare} className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white">
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-2">{announcement.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{announcement.excerpt}</p>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-teal-600" />
            {announcement.location?.city}
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-teal-600" />
            {announcement.startDate ? new Date(announcement.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Users className="h-4 w-4 mr-1 text-teal-600" />
          {announcement.organization?.name}
        </div>
        
        {announcement.capacity && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{announcement.registeredCount} inscrits</span>
              <span>{announcement.capacity - announcement.registeredCount} places restantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all ${fillPercentage > 90 ? 'bg-red-500' : 'bg-teal-600'}`} style={{ width: `${fillPercentage}%` }}></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button onClick={handleToggleDetails} className="text-teal-600 text-sm font-medium flex items-center hover:text-teal-700">
            {showDetails ? 'Moins' : 'Détails'} <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={handleViewDetails} className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">
            S&apos;inscrire
          </button>
        </div>

        <AnimatePresence>
          {showDetails && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 space-y-2">
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2 text-teal-600" /> {announcement.startDate ? new Date(announcement.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''} - {announcement.endDate ? new Date(announcement.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-teal-600" /> {announcement.location?.address}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-teal-600" /> {announcement.targetAudience?.join(', ')}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AnnouncementGridCard({ 
  announcement, 
  isBookmarked, 
  onBookmarkToggle, 
  isAuthenticated,
  onLoginPrompt
}: { 
  announcement: Announcement; 
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const router = useRouter();
  const fillPercentage = announcement.capacity ? Math.round((announcement.registeredCount / announcement.capacity) * 100) : 0;

  const handleBookmarkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      onLoginPrompt();
      return;
    }
    onBookmarkToggle();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48">
        <img src={ getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 225, crop: 'fill' })} alt={announcement.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
             <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r ${getCategoryColor(announcement.category?.name || '')} text-white shadow-sm`}>
                {getCategoryIcon(announcement.category?.name)} {announcement.category?.name}
            </span>
        </div>
        {announcement.isPinned && (
             <div className="absolute top-2 right-2">
             <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
        )}
        <button 
          onClick={handleBookmarkClick} 
          className="absolute top-2 right-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{announcement.title}</h3>
        <div className="space-y-1 text-xs text-gray-600 mb-2">
          <div className="flex items-center"><MapPin className="h-3 w-3 mr-1 text-teal-600" /> {announcement.location?.city}</div>
          <div className="flex items-center"><Calendar className="h-3 w-3 mr-1 text-teal-600" /> {announcement.startDate ? new Date(announcement.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</div>
        </div>
        <div className="mt-auto">
             {announcement.capacity && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className={`h-1.5 rounded-full ${fillPercentage > 90 ? 'bg-red-500' : 'bg-teal-600'}`} style={{ width: `${fillPercentage}%` }}></div>
                </div>
             )}
            <button 
                onClick={() => router.push(`/annonces/${announcement.slug || announcement.id}`)} 
                className="w-full py-1.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full hover:bg-teal-100 transition-colors"
            >
                Voir les détails
            </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// COMPOSANT LOADING
// ==========================================

function AnnouncementsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
      <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
    </div>
  );
}

// ==========================================
// CONTENU PRINCIPAL
// ==========================================

function AnnouncementsContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ MAINTENANT À L'INTÉRIEUR DE SUSPENSE
  
  // ✅ 1. AUTHENTIFICATION CORRIGÉE
  const { isAuthenticated, user } = useAuthStore();

  // ✅ 2. ÉTAT URL-DRIVEN (SEO & Refresh-safe)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || undefined;
  const cityFilter = searchParams.get('city') || undefined;
  const isFreeFilter = searchParams.get('isFree') === 'true' ? true : (searchParams.get('isFree') === 'false' ? false : undefined);
  const hasPlacesFilter = searchParams.get('hasPlaces') === 'true';

  // États UI
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Pour le debounce local
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // Sync search from URL on mount
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // ✅ 3. DONNÉES
  const { data: categoriesResponse } = useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories({ isActive: true }),
    staleTime: 1000 * 60 * 10
  });
  const categories = categoriesResponse?.data || [];

  // Construction du DTO
  const queryDto: QueryAnnouncementDto = useMemo(() => {
    return {
      page,
      limit: 12,
      search: searchTerm || undefined,
      categoryId,
      city: cityFilter,
      isFree: isFreeFilter,
    };
  }, [page, searchTerm, categoryId, cityFilter, isFreeFilter, hasPlacesFilter]);

  // ✅ 4. REQUÊTE ANNONCES
  const { 
    data: announcementsResponse, 
    isLoading, 
    isFetching
  } = useQuery<PaginatedAnnouncementsResponse>({
    queryKey: ['announcements', 'list', queryDto],
    queryFn: () => announcementsApi.getAnnouncements(queryDto),
    placeholderData: (prevData) => prevData,
  });

  const announcements = announcementsResponse?.data || [];
  const meta = announcementsResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  // ✅ 5. FAVORIS
  const { data: bookmarksResponse } = useBookmarksList(
    { limit: 100 },
    { isAuthenticated }
  );

  const bookmarkedIds = useMemo(() => {
    return new Set(bookmarksResponse?.data.map(b => b.contentId) || []);
  }, [bookmarksResponse]);

  const toggleBookmark = useToggleBookmark();

  // ✅ 6. HANDLERS (Avec Debounce)
  const updateUrl = (newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      updateUrl({ search: searchTerm, page: 1 });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    router.push('?page=1');
  };

  const activeFiltersCount = [
    cityFilter, 
    isFreeFilter !== undefined,
    hasPlacesFilter,
    categoryId
  ].filter(Boolean).length;

  const handleApplyFilters = (newFilters: {
    categoryId?: string;
    city?: string;
    isFree?: boolean;
    hasPlaces?: boolean;
  }) => {
    updateUrl({
      categoryId: newFilters.categoryId,
      city: newFilters.city,
      isFree: newFilters.isFree === true ? 'true' : (newFilters.isFree === false ? 'false' : undefined),
      hasPlaces: newFilters.hasPlaces ? 'true' : undefined,
      page:1
    });
  };

  const FiltersModal = () => {
    if (!isFiltersModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
        <motion.div 
          initial={{ y: '100%', opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: '100%', opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filtrer les campagnes</h3>
            <button onClick={() => setIsFiltersModalOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
          </div>

          {/* Catégories */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Catégories</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleApplyFilters({ categoryId: undefined })} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${!categoryId ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>Toutes</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleApplyFilters({ categoryId: cat.id })} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${categoryId === cat.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{getCategoryIcon(cat.name)} {cat.name}</button>
              ))}
            </div>
          </div>

          {/* Ville */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Ville</h4>
            <div className="flex flex-wrap gap-2">
              {['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'].map(city => (
                <button key={city} onClick={() => handleApplyFilters({ city: cityFilter === city ? undefined : city })} className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${cityFilter === city ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>{city}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={handleResetFilters} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50">Effacer</button>
            <button onClick={() => setIsFiltersModalOpen(false)} className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors">Voir les résultats</button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ✅ NAVBAR INTÉGRÉE */}
      <Navbar />
      
      {/* ✅ CONTAINER AVEC PADDING HAUT (Pour ne pas être caché sous le Navbar fixe) */}
      <div className="pt-20 md:pt-24">
        {/* Filters & Search Bar */}
        <div className="sticky top-16 md:top-20 z-40 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <button onClick={() => setIsFiltersModalOpen(true)} className="flex items-center px-4 py-2 bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-full hover:from-teal-600 hover:to-teal-700 shadow-md">
                <Filter className="h-4 w-4 mr-2" />
                Filtres {activeFiltersCount > 0 && <span className="ml-2 bg-white text-teal-600 text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">{activeFiltersCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="px-4 py-3 max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">
            {isLoading ? 'Chargement...' : `${meta?.total || 0} campagne${meta?.total !== 1 ? 's' : ''}`}
          </span>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><List className="h-4 w-4" /></button>
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><Grid className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6">
          {(isLoading || isFetching) && page === 1 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
              <span className="text-gray-500">Mise à jour des résultats...</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <Filter className="h-12 w-12 text-gray-300 mb-4" />
               <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
               <p className="text-gray-600 mb-6 max-w-md">Essayez de modifier vos filtres ou votre recherche.</p>
               <button onClick={handleResetFilters} className="text-teal-600 font-medium text-sm hover:underline">Réinitialiser les filtres</button>
            </div>
          ) : (
            <>
              {viewMode === 'list' ? (
                <div className="space-y-6">
                  <AnimatePresence mode='popLayout'>
                    {announcements.map((announcement) => (
                      <AnnouncementCard 
                        key={announcement.id} 
                        announcement={announcement} 
                        isBookmarked={bookmarkedIds.has(announcement.id)}
                        onBookmarkToggle={() => toggleBookmark.mutate(ContentType.ANNOUNCEMENT, announcement.id, bookmarkedIds.has(announcement.id))}
                        isAuthenticated={isAuthenticated}
                        onLoginPrompt={() => setIsLoginPromptOpen(true)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   <AnimatePresence mode='popLayout'>
                    {announcements.map((announcement) => (
                      <AnnouncementGridCard 
                        key={announcement.id}
                        announcement={announcement}
                        isBookmarked={bookmarkedIds.has(announcement.id)}
                        onBookmarkToggle={() => toggleBookmark.mutate(ContentType.ANNOUNCEMENT, announcement.id, bookmarkedIds.has(announcement.id))}
                        isAuthenticated={isAuthenticated}
                        onLoginPrompt={() => setIsLoginPromptOpen(true)}
                      />
                    ))}
                   </AnimatePresence>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1 || isFetching} className="px-4 py-2 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 disabled:opacity-50">
                    Précédent
                  </button>
                  <span className="text-sm font-medium">Page {page} / {totalPages}</span>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages || isFetching} className="px-4 py-2 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 disabled:opacity-50">
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <FiltersModal />

      <AnimatePresence>
        {isLoginPromptOpen && (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LockIcon className="h-8 w-8 text-gray-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
                <p className="text-gray-600 mb-6">Vous devez être connecté pour ajouter des favoris.</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => (window.location.href = '/auth/connexion')}
                    className="w-full py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => setIsLoginPromptOpen(false)}
                    className="w-full py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// WRAPPER AVEC SUSPENSE
// ==========================================

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<AnnouncementsLoading />}>
      <AnnouncementsContent />
    </Suspense>
  );
}
