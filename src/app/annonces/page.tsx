/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Star,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  MessageCircle,
  Heart,
  Grid,
  List,
  ChevronRight,
  Loader2,
  Bookmark,
  Share2,
  Check,
  Sparkles,
  Zap,
  Award,
  Info,
  TrendingUp,
  AlertTriangle,
  Lock,
  LogIn
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query'; 

// API & Types
import { announcementsApi } from '@/lib/api-endponts';
import { categoriesApi } from '@/lib/api-endponts';
import { bookmarksApi } from '@/lib/api-endponts';
import { Announcement, AnnouncementStatus, TargetAudience, QueryAnnouncementDto, PaginatedAnnouncementsResponse } from '@/types/announcement';
import { Category, PaginatedCategoriesResponse } from '@/types/category';
import { ContentType } from '@/types/reaction';

// ✅ IMPORT DES UTILITAIRES PARTAGÉS
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';

// Hooks
import { useBookmarksList, useToggleBookmark } from '@/hooks/useBookmarks';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

// ==========================================
// SOUS-COMPOSANTS
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
        {/* Image */}
        <img
          src={ getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 225, crop: 'fill' })}
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3">
          {/* ✅ CORRECTION : On passe le nom de la catégorie pour l'icône et la couleur */}
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
        
        {/* Priority Badge */}
        {announcement.priority === 'URGENT' && (
          <div className="absolute bottom-3 left-3">
             <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-red-600 text-white shadow-md animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" /> URGENT
            </span>
          </div>
        )}

        {/* Actions */}
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
        
        {/* Capacity Bar */}
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
              <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-teal-600" /> {announcement.startDate ? new Date(announcement.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''} - {announcement.endDate ? new Date(announcement.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-teal-600" /> {announcement.location?.address}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-2 text-teal-600" /> {announcement.targetAudience?.join(', ')}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Simplified Grid Card
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
        <img src={announcement.thumbnailImage || announcement.featuredImage} alt={announcement.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
             {/* ✅ CORRECTION ICI AUSSI */}
             <span className={`inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r ${getCategoryColor(announcement.category?.name || '')} text-white shadow-sm`}>
                {getCategoryIcon(announcement.category?.name)} {announcement.category?.name}
            </span>
        </div>
        {announcement.isPinned && (
             <div className="absolute top-2 right-2">
             <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
        )}
        {/* Bouton Bookmark en grille */}
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

function FiltersBar({ 
  activeFiltersCount, 
  onOpenFilters,
  searchTerm,
  onSearchChange
}: { 
  activeFiltersCount: number; 
  onOpenFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {searchTerm && (
              <button onClick={() => onSearchChange('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <button onClick={onOpenFilters} className="flex items-center px-4 py-2 bg-linear-to-r from-teal-500 to-teal-600 text-white text-sm font-medium rounded-full hover:from-teal-600 hover:to-teal-700 shadow-md">
            <Filter className="h-4 w-4 mr-2" />
            Filtres {activeFiltersCount > 0 && <span className="ml-2 bg-white text-teal-600 text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">{activeFiltersCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onResetFilters, searchTerm }: { onResetFilters: () => void; searchTerm: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Filter className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune campagne trouvée</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {searchTerm ? `Aucun résultat pour "${searchTerm}". Essayez d'autres mots-clés.` : "Aucune annonce ne correspond à vos critères actuels."}
      </p>
      <button onClick={onResetFilters} className="px-6 py-2.5 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors flex items-center">
        <X className="h-4 w-4 mr-2" />
        Réinitialiser les filtres
      </button>
    </div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function AnnouncementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');
  const searchParam = searchParams.get('search');
  
  // États UI
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  // ✅ ÉTAT AUTHENTIFICATION
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          setIsAuthenticated(false);
          return;
        }
        const { state } = JSON.parse(authStorage);
        setIsAuthenticated(!!state.token);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ UNIQUE DÉFINITION DE L'ÉTAT FILTERS
  const [filters, setFilters] = useState<{
    category?: string;
    city?: string;
    price?: 'free' | 'paid';
    hasPlaces?: boolean;
  }>({});
  
  // ✅ SYNCHRONISATION URL -> ÉTAT
  useEffect(() => {
    if (categoryIdParam) {
      setFilters(prev => ({ ...prev, category: categoryIdParam }));
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [categoryIdParam, searchParam]);

// ✅ REMPLACEMENT TOTAL (Version Générique)
// Cela permet de récupérer tous les favoris tout en protégeant des erreurs 401/429.
const { data: bookmarksResponse } = useBookmarksList(
  { limit: 50 },
  {
    // Sécurité : Lance la requête seulement si connecté
    isAuthenticated: isAuthenticated,
    
    // Sécurité : Arrête les tentatives sur erreur 401 pour éviter le 429
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) return false;
      return failureCount < 1;
    },
  }
);

// Logique de transformation (Map) : On garde tous les IDs
const bookmarkedIds = useMemo(() => {
  // On prend tous les favoris (pas de filtre .filter(...))
  return new Set(bookmarksResponse?.data.map(b => b.contentId) || []);
}, [bookmarksResponse]);

  const toggleBookmark = useToggleBookmark();

  const handleBookmarkToggle = (contentId: string) => {
    toggleBookmark.mutate(
      ContentType.ANNOUNCEMENT,
      contentId,
      bookmarkedIds.has(contentId)
    );
  };

  // 1. Récupérer les catégories
  const { data: categoriesResponse } = useQuery<PaginatedCategoriesResponse>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories({ isActive: true }),
    staleTime: 1000 * 60 * 10
  });
  const categories = categoriesResponse?.data || [];

  // 2. Construire les paramètres pour l'API (Backend)
  const queryDto = useMemo<QueryAnnouncementDto>(() => {
    const dto: QueryAnnouncementDto = {
      page,
      limit: 10,
      status: AnnouncementStatus.PUBLISHED,
    };

    if (searchTerm) dto.search = searchTerm;
    if (filters.category) dto.categoryId = filters.category;
    if (filters.city) dto.city = filters.city;
    
    return dto;
  }, [page, searchTerm, filters]);

  // 3. Récupérer les annonces
  const { 
    data: announcementsResponse, 
    isLoading, 
    isFetching,
    refetch 
  } = useQuery<PaginatedAnnouncementsResponse>({
    queryKey: ['announcements', 'list', queryDto],
    queryFn: () => announcementsApi.getAnnouncements(queryDto),
    placeholderData: (previousData) => previousData, 
  });

  const announcements = announcementsResponse?.data || [];
  const meta = announcementsResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  // 4. Filtrage Côté Client (Prix et places restantes, car géré en Frontend)
  const displayAnnouncements = useMemo(() => {
    let filtered = [...announcements];
    
    if (filters.price === 'free') {
      filtered = filtered.filter(a => a.isFree);
    } else if (filters.price === 'paid') {
      filtered = filtered.filter(a => !a.isFree);
    }

    if (filters.hasPlaces) {
      filtered = filtered.filter(a => a.capacity && a.registeredCount < a.capacity);
    }

    return filtered;
  }, [announcements, filters]);

  // Compteurs
  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== false).length;

  // Handlers
  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  };

  // Filtre Modal Component
  const FiltersModal = () => {
    if (!isFiltersModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
        <motion.div 
          initial={{ y: '100%', opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filtrer</h3>
            <button onClick={() => setIsFiltersModalOpen(false)}><X className="h-6 w-6 text-gray-500" /></button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Catégories</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setFilters({...filters, category: undefined})}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${!filters.category ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Toutes
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setFilters({...filters, category: cat.id})}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filters.category === cat.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {getCategoryIcon(cat.name)} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ville */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Ville</h4>
            <div className="flex flex-wrap gap-2">
              {['Douala', 'Yaoundé', 'Bafoussam', 'Garoua'].map(city => (
                <button 
                  key={city}
                  onClick={() => setFilters({...filters, city: filters.city === city ? undefined : city})}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${filters.city === city ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">Prix</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilters({...filters, price: filters.price === 'free' ? undefined : 'free'})} 
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${filters.price === 'free' ? 'bg-teal-50 border-teal-600 text-teal-700' : 'bg-white text-gray-600'}`}
              >
                Gratuit
              </button>
              <button 
                onClick={() => setFilters({...filters, price: filters.price === 'paid' ? undefined : 'paid'})} 
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${filters.price === 'paid' ? 'bg-teal-50 border-teal-600 text-teal-700' : 'bg-white text-gray-600'}`}
              >
                Payant
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={handleResetFilters} 
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium transition-colors hover:bg-gray-50"
            >
              Effacer
            </button>
            <button 
              onClick={() => setIsFiltersModalOpen(false)} 
              className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              Voir les résultats
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Campagnes de Santé</h1>
          <div className="w-9" /> {/* Spacer for center alignment */}
        </div>
      </header>
      
      {/* Filters & Search */}
      <FiltersBar 
        activeFiltersCount={activeFiltersCount}
        onOpenFilters={() => setIsFiltersModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Results Header */}
      <div className="px-4 py-3 max-w-7xl mx-auto flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {meta?.total || 0} campagne{meta?.total !== 1 && 's'} trouvée{meta?.total !== 1 && 's'}
        </span>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}><List className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}><Grid className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading && page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <span className="text-gray-500">Chargement...</span>
          </div>
        ) : displayAnnouncements.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="space-y-6">
                <AnimatePresence>
                  {displayAnnouncements.map((announcement) => (
                    <AnnouncementCard 
                      key={announcement.id} 
                      announcement={announcement} 
                      isBookmarked={bookmarkedIds.has(announcement.id)}
                      onBookmarkToggle={() => handleBookmarkToggle(announcement.id)}
                      isAuthenticated={isAuthenticated}
                      onLoginPrompt={() => setIsLoginPromptOpen(true)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {displayAnnouncements.map((announcement) => (
                    <AnnouncementGridCard 
                      key={announcement.id} 
                      announcement={announcement}
                      isBookmarked={bookmarkedIds.has(announcement.id)}
                      onBookmarkToggle={() => handleBookmarkToggle(announcement.id)}
                      isAuthenticated={isAuthenticated}
                      onLoginPrompt={() => setIsLoginPromptOpen(true)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination / Load More */}
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button 
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="px-8 py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-all flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Charger plus de résultats
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState onResetFilters={handleResetFilters} searchTerm={searchTerm} />
        )}
      </main>

      {/* Modals */}
      <FiltersModal />

      {/* ✅ MODALE DE CONNEXION */}
      <AnimatePresence>
        {isLoginPromptOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-gray-600 mb-6">Vous devez être connecté pour ajouter des favoris.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => (window.location.href = '/login')}
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
