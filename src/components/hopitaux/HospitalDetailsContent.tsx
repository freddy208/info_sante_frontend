/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  MapPin, Phone, Clock, ChevronLeft, Heart, Navigation, CheckCircle, 
  Activity, Users, Megaphone, FileText, Share2, ExternalLink, Mail, 
  Lock, Bookmark, X, Map
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Imports de l'API et des Types
import { organizationsApi, announcementsApi, articlesApi } from '@/lib/api-endponts';
import { Organization, OrganizationType } from '@/types/organization';
import { ContentType, ReactionType } from '@/types/reaction';
import { Announcement } from '@/types/announcement';
import { Article } from '@/types/article';

// Imports des Hooks
import { useOrganization } from '@/hooks/useOrganizations';
import { useToggleReaction, useReactionStats } from '@/hooks/useReactions';
import { useBookmarksCheck } from '@/hooks/useBookmarks'; // ✅ Hook optimisé
import { useAuthState } from '@/hooks/useAuthState'; // ✅ Hook sécurisé pour l'auth

// Composants
import dynamic from 'next/dynamic';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="relative h-96 bg-white rounded-2xl shadow-xl overflow-hidden flex items-center justify-center animate-pulse">
      <Map className="w-12 h-12 text-gray-300 animate-bounce" />
    </div>
  )
});

// --- MODAL DE CONNEXION ---
const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onRedirect: () => void }> = ({ isOpen, onClose, onRedirect }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connexion requise</h3>
        <p className="text-gray-500 mb-6">Connectez-vous pour interagir avec cet hôpital.</p>
        <div className="space-y-3">
          <button onClick={onRedirect} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
            Se connecter
          </button>
          <button onClick={onClose} className="w-full py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PAGE PRINCIPALE ---
interface HospitalDetailsContentProps {
  id: string;
}

const HospitalDetailsContent: React.FC<HospitalDetailsContentProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // ✅ SÉCURITÉ : Utilisation du hook d'Auth au lieu du localStorage direct
  const { isAuthenticated, isAuthenticated: isAuthLoading } = useAuthState();

  // États
  const [activeTab, setActiveTab] = useState<'announcements' | 'articles'>('announcements');
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Note: L'état isLiked sera synchronisé avec l'API dans un vrai scénario via un hook useUserReaction(id)

  // --- REQUÊTES API ---

  // 1. Récupérer l'hôpital
  const { data: hospital, isLoading: isLoadingHospital, isError: isHospitalError } = useOrganization(id);

  // 2. Récupérer les stats de réactions
  const { data: reactionStats } = useReactionStats('ORGANIZATION', id, true);

  // 3. Récupérer les annonces
  const { data: announcementsRes, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ['announcements', 'hospital-list', id],
    queryFn: () => announcementsApi.getAnnouncements({ organizationId: id, limit: 10 }),
    enabled: !!id,
  });
  const announcements = announcementsRes?.data || [];

  // 4. Récupérer les articles
  const { data: articlesRes, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles', 'hospital-list', id],
    queryFn: () => articlesApi.getArticles({ organizationId: id, limit: 10 }),
    enabled: !!id,
  });
  const articles = articlesRes?.data || [];

  // --- OPTIMISATION CHECKMANY (FAVORIS) ---
  // On collecte les IDs pour vérifier les favoris en une seule requête
  const announcementIds = useMemo(() => announcements.map(a => a.id), [announcements]);
  const articleIds = useMemo(() => articles.map(a => a.id), [articles]);

  // Batch check pour les annonces
  const { data: bookmarkedAnnouncements } = useBookmarksCheck(
    ContentType.ANNOUNCEMENT, 
    announcementIds, 
    isAuthenticated && !isAuthLoading
  );

  // Batch check pour les articles
  const { data: bookmarkedArticles } = useBookmarksCheck(
    ContentType.ARTICLE, 
    articleIds, 
    isAuthenticated && !isAuthLoading
  );

  // --- MUTATIONS ---
  const toggleReactionMutation = useToggleReaction();

  // --- HANDLERS ---

  const handleShare = async () => {
    const shareData = {
      title: hospital?.name,
      text: hospital?.description ?? undefined,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erreur partage:', err);
      }
    } else {
      // Fallback : copier le lien
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    // Logique optimiste ici si nécessaire, ou appel direct
    toggleReactionMutation.mutate(
      {
        contentType: ContentType.ORGANIZATION,
        contentId: id,
        type: ReactionType.LIKE
      },
      {
        onSuccess: () => toast.success('Réaction enregistrée'),
        onError: () => toast.error('Erreur lors de la réaction')
      }
    );
  };

  // --- LOADING & ERROR STATES ---

  if (isLoadingHospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement de l&apos;hôpital...</p>
        </div>
      </div>
    );
  }

  if (isHospitalError || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hôpital introuvable</h1>
          <button onClick={() => router.push('/hopitals')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="relative bg-white pb-6 sm:pb-8 shadow-sm">
        <div className="h-40 sm:h-48 bg-linear-to-r from-blue-600 to-indigo-600 relative">
          {hospital.emergencyAvailable && (
            <div className="absolute top-4 sm:top-10 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center shadow-md animate-pulse">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Urgences 24/7
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors shadow-md">
            <ChevronLeft className="w-6 h-6" />
          </button>
          {/* ✅ FIX : Bouton Share fonctionnel */}
          <button onClick={handleShare} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors shadow-md">
            <Share2 className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-20">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white p-1.5 shadow-xl border-4 border-white self-center sm:self-auto relative group transition-transform hover:scale-105 cursor-pointer" onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <img 
                src={hospital.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=120`} 
                alt={hospital.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{hospital.name}</h1>
                {hospital.isVerified && (
                  <div className="flex items-center bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-1" />
                    <span className="text-xs sm:text-sm font-semibold text-blue-700">Vérifié</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-2">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm bg-blue-100 text-blue-800`}>
                  {getTypeLabel(hospital.type)}
                </span>
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full w-fit">
                  <Heart className="w-4 h-4 mr-2 text-yellow-500" />
                  <span className="font-bold text-yellow-700">{reactionStats?.LIKE || 0} favoris</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                <button onClick={(e) => handleLike(e)} className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center sm:justify-start transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Ajouter aux favoris
                </button>
                
                {/* ✅ FIX : Balise <a> native pour le téléphone */}
                <a href={`tel:${hospital.phone}`} className="w-full sm:w-auto px-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold flex items-center justify-center hover:bg-gray-100 border border-gray-200 transition-colors">
                  <Phone className="w-5 h-5 mr-2" />
                  Appeler
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Stats Rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Users className="w-6 h-6" /></div>
            <div><div className="text-xs sm:text-sm text-gray-500">Abonnés</div><div className="text-lg sm:text-2xl font-bold text-gray-900">{reactionStats?.total || 0}</div></div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Megaphone className="w-6 h-6" /></div>
            <div><div className="text-xs sm:text-sm text-gray-500">Annonces</div><div className="text-lg sm:text-2xl font-bold text-gray-900">{announcements.length || 0}</div></div>
          </div>
          <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-green-100 rounded-full text-green-600"><FileText className="w-6 h-6" /></div>
            <div><div className="text-xs sm:text-sm text-gray-500">Articles</div><div className="text-lg sm:text-2xl font-bold text-gray-900">{articles.length || 0}</div></div>
          </div>
        </div>

        {/* Informations Contact & Horaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-start">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-3"><MapPin className="w-5 h-5" /></div>
               <div><div className="font-medium text-gray-900">Adresse</div><div className="text-gray-600">{hospital.address}, {hospital.city}</div></div>
             </div>
             <div className="flex items-start mt-4">
               <div className="p-2 bg-green-50 rounded-lg text-green-600 mr-3"><Phone className="w-5 h-5" /></div>
               <div><div className="font-medium text-gray-900">Téléphone</div><a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">{hospital.phone}</a></div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Horaires d&apos;ouverture
            </h3>
            <div className="bg-gray-50 p-4 rounded-xl">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm font-mono">{hospital.openingHours}</pre>
            </div>
          </div>
        </div>

        {/* Carte */}
        {hospital.latitude && hospital.longitude && (
          <div className="h-[400px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <MapView hospitals={[hospital]} userLocation={null} selectedHospital={null} setSelectedHospital={() => {}} getDirections={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`)} navigateToDetails={() => {}} getTypeLabel={getTypeLabel} getMarkerColor={() => '#3B82F6'} />
          </div>
        )}

        {/* Description */}
        <div id="about-section" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">À propos de {hospital.name}</h3>
          <p className="text-gray-700 leading-relaxed">{hospital.description}</p>
        </div>

        {/* Onglets Navigation */}
        <div className="bg-white sticky top-0 z-30 shadow-md rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex">
            <button onClick={() => setActiveTab('announcements')} className={`flex-1 py-4 font-medium transition-colors text-center relative ${activeTab === 'announcements' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              Annonces ({announcements.length})
              {activeTab === 'announcements' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
            </button>
            <button onClick={() => setActiveTab('articles')} className={`flex-1 py-4 font-medium transition-colors text-center relative ${activeTab === 'articles' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}>
              Articles ({articles.length})
              {activeTab === 'articles' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600"></div>}
            </button>
          </div>
        </div>

        {/* Contenu des Onglets */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            {isLoadingAnnouncements ? <div className="p-8 text-center">Chargement...</div> : announcements.length === 0 ? <div className="p-8 text-center bg-white rounded-xl">Aucune annonce</div> : 
              announcements.map((announcement) => (
                <div key={announcement.slug} onClick={() => router.push(`/annonces/${announcement.id}`)} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group flex gap-4">
                   {/* ✅ PERF : loading="lazy" sur les images des listes */}
                  {announcement.featuredImage && (
                    <img 
                      src={getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 300, crop: 'fill' })}
                      alt={announcement.title}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{announcement.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{announcement.content?.substring(0, 100)}...</p>
                    
                    {/* ✅ OPTIMISATION : Affichage du favori basé sur checkMany */}
                    {isAuthenticated && bookmarkedAnnouncements?.[announcement.id] && (
                      <div className="mt-2 flex items-center text-xs text-blue-600 font-semibold">
                        <Bookmark className="w-3 h-3 mr-1 fill-current" /> Ajouté aux favoris
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'articles' && (
            <div className="space-y-4">
               {articles.map((article) => (
                 <div key={article.id} onClick={() => router.push(`/articles/${article.slug!}`)} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer group flex gap-4">
                    {article.featuredImage && (
                      <img 
                        src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 300, crop: 'fill' })}
                        alt={article.title}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">{article.title}</h3>
                       {/* ✅ OPTIMISATION : Affichage du favori basé sur checkMany */}
                       {isAuthenticated && bookmarkedArticles?.[article.id] && (
                        <div className="mt-2 flex items-center text-xs text-blue-600 font-semibold">
                          <Bookmark className="w-3 h-3 mr-1 fill-current" /> Ajouté aux favoris
                        </div>
                      )}
                    </div>
                 </div>
               ))}
            </div>
        )}

      </main>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onRedirect={() => router.push('/login')} />
    </div>
  );
};

// Helper function locale (peut être déplacé dans un fichier utils)
function getTypeLabel(type: OrganizationType): string {
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
}

export default HospitalDetailsContent;