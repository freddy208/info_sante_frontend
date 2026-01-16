/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Star, Bookmark, Share2, ThumbsUp,
  MapPin, Calendar, Clock, Users, Eye, Heart,
  ChevronDown, Copy, Check, Phone, Globe,
  AlertTriangle, Send, Loader2, Lock, LogIn,
  MessageCircle, X, CheckCircle, AlertCircle,
  FileText, Building, Navigation, Bell,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// API & Hooks
import { useAnnouncement, useAnnouncementsList, useRegisterAnnouncement } from '@/hooks/useAnnouncements';
import { useBookmarksCheck, useIsBookmarked, useToggleBookmark } from '@/hooks/useBookmarks'; 
import { getAnnouncementImageUrl, getCloudinaryImageUrl } from '@/lib/cloudinary';

// ✅ IMPORTS NAVBAR & FOOTER
import Navbar from '@/components/shared/Navbar';

// ✅ IMPORTS RÉACTIONS & TYPES
import { useReactionStats, useToggleReaction } from '@/hooks/useReactions';
import { ReactionType, ContentType } from '@/types/reaction';
import { Announcement, AnnouncementStatus } from '@/types/announcement';

// Utils
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';
import { useCommentsByContent, useCreateComment } from '@/hooks/useComments';

// Leaflet Dynamic Imports
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const setupLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
};

// ==========================================
// SOUS-COMPOSANTS
// ==========================================

function InteractiveMap({ location, organizationName }: { location: any; organizationName: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setupLeafletIcons();
  }, []);
  
  if (!isClient || !location) return null;

  return (
    <div className="w-full h-64 md:h-80 z-0">
      <MapContainer 
        center={[location.latitude, location.longitude]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }} 
        className="rounded-xl"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-gray-900">{organizationName}</h3>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

function HeroImageSection({ 
  announcement, 
  isBookmarked, 
  onBookmarkToggle, 
  onShare,
  isAuthenticated, // ✅ AJOUT PROPS
  onLoginPrompt // ✅ AJOUT PROPS
}: { 
  announcement: Announcement; 
  isBookmarked: boolean; 
  onBookmarkToggle: () => void; 
  onShare: () => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}) {
  const handleBookmarkClick = () => {
    if (!isAuthenticated) { onLoginPrompt(); return; }
    onBookmarkToggle();
  };

  const getStatusBadge = () => {
    if (!announcement.capacity) return null;
    const fillPercentage = Math.round((announcement.registeredCount / announcement.capacity) * 100);
    if (fillPercentage >= 100) return { text: 'Complet', bgColor: 'bg-red-500', icon: '🔴' };
    return { text: 'Places disponibles', bgColor: 'bg-green-500', icon: '🟢' };
  };
  const statusBadge = getStatusBadge();
  
  const catColorClass = announcement.category ? getCategoryColor(announcement.category.name) : 'from-gray-400 to-gray-600';
  const catIcon = announcement.category ? getCategoryIcon(announcement.category) : '🏥';

  return (
    <div className="relative w-full h-[60vh] min-h-80 sm:h-[70vh]">
      <img
        src={getAnnouncementImageUrl(announcement.featuredImage, { width: 1920, height: 1080, crop: 'fill' })}
        alt={announcement.title}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20">
        <button onClick={() => window.history.back()} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex space-x-3">
          <button onClick={handleBookmarkClick} className={`p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 ${isBookmarked ? 'text-yellow-300' : ''}`}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button onClick={onShare} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {announcement.category && (
        <div className="absolute top-1/4 left-4 md:left-8 z-10 -translate-y-1/2">
          <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 px-4 py-2 inline-flex items-center bg-linear-to-br ${catColorClass}`}>
            <span className="text-xl mr-2">{catIcon}</span>
            <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">{announcement.category.name}</span>
          </div>
        </div>
      )}

      {statusBadge && (
        <div className="absolute bottom-4 right-4 md:right-8 z-30">
          <div className={`${statusBadge.bgColor} backdrop-blur-sm bg-opacity-90 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg`}>
            <span className="text-sm sm:text-base mr-2">{statusBadge.icon}</span>
            <span className="text-white font-medium text-sm sm:text-base">{statusBadge.text}</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg leading-tight">
          {announcement.title}
        </h1>
        <p className="text-sm sm:text-base text-white/90 max-w-3xl line-clamp-2 drop-shadow">
          {announcement.excerpt}
        </p>
      </div>
    </div>
  );
}

function ContentSection({ 
  announcement, 
  onLikeClick, 
  isLiked,
  likeCount
}: { 
  announcement: Announcement; 
  onLikeClick: () => void;
  isLiked: boolean;
  likeCount: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const capacity = announcement.capacity || 0;
  const registeredCount = announcement.registeredCount || 0;
  const fillPercentage = capacity > 0 ? Math.round((registeredCount / capacity) * 100) : 0;
  const isFull = capacity > 0 && registeredCount >= capacity;
  
  const getTargetAudienceLabel = (audience: string) => {
    const labels: Record<string, string> = {
      'CHILDREN': 'Enfants', 'INFANTS': 'Nourrissons', 'ADULTS': 'Adults',
      'ELDERLY': 'Personnes âgées', 'PREGNANT_WOMEN': 'Femmes enceintes',
      'YOUTH': 'Jeunes', 'TEENAGERS': 'Ados', 'FAMILIES': 'Familles'
    };
    return labels[audience] || 'Tous';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 relative z-20">
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
        
        {/* Organisation */}
        <section className="mb-8 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-200">
              <img src={getCloudinaryImageUrl(announcement.organization?.logo || 'H', { width: 200, height: 200 })} alt={announcement.organization?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center"><Building className="h-4 w-4 mr-1 text-teal-600" /> {announcement.organization?.type || 'Établissement de Santé'}</span>
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-teal-600" /> {announcement.location?.city}</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors w-fit">
              Voir le profil
            </button>
          </div>
        </section>

        {/* Stats Actions */}
        <section className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Eye className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{announcement.viewsCount}</p>
              <p className="text-xs text-gray-600">Vues</p>
            </div>
          </div>
          
          <button 
            onClick={onLikeClick} 
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
             <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-sm font-medium hidden sm:inline">J&apos;aime</span>
             <span className="text-xl font-bold">{likeCount}</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full text-green-600"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{registeredCount}</p>
              <p className="text-xs text-gray-600">Inscrits</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-full text-pink-600"><MessageCircle className="h-5 w-5" /></div>
            <div>
              <p className="text-xl font-bold text-gray-900">{announcement.commentsCount}</p>
              <p className="text-xs text-gray-600">Commentaires</p>
            </div>
          </div>
        </section>

        {/* Date & Lieu */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
             <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                   <p className="text-sm text-purple-800 font-medium">Date de l&apos;événement</p>
                   <p className="text-lg font-bold text-gray-900">
                     {new Date(announcement.startDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                   </p>
                </div>
             </div>
             <div className="flex items-center pt-4 border-t border-purple-100">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                <p className="text-sm font-medium text-gray-900">
                  {new Date(announcement.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(announcement.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
          </div>
          
          <div className="bg-linear-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
             <h3 className="text-sm font-medium text-blue-800 mb-4 flex items-center">
               <MapPin className="h-4 w-4 mr-2 text-blue-600" /> Lieu
             </h3>
             <p className="text-gray-600 mb-4">{announcement.location?.address}, {announcement.location?.city}</p>
             <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 h-48 sm:h-56 mb-4">
               <InteractiveMap location={announcement.location} organizationName={announcement.organization?.name || ''} />
             </div>
             <div className="flex gap-3 mt-4">
               <button className="flex-1 px-4 py-3 bg-white text-blue-600 font-medium rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center">
                 <Navigation className="h-4 w-4 mr-2" /> Itinéraire
               </button>
             </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-8">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
             <FileText className="h-5 w-5 mr-2 text-gray-700" /> À propos de cette campagne
           </h3>
           <div className="relative bg-gray-50 rounded-2xl p-6">
              <div className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-5'}`}>
                {announcement.content}
              </div>
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent pointer-events-none"></div>
              )}
           </div>
           <button 
             onClick={() => setIsExpanded(!isExpanded)} 
             className="mt-4 px-6 py-3 bg-white text-teal-700 font-medium rounded-xl border border-teal-200 hover:bg-teal-50 transition-colors flex items-center mx-auto"
           >
              {isExpanded ? 'Masquer' : 'Afficher plus'} 
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
           </button>
        </section>

        {/* Public Cible */}
        <section className="mb-8">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
             <Users className="h-5 w-5 mr-2 text-teal-600" /> Public cible
           </h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {announcement.targetAudience?.map((audience) => (
                 <div key={audience} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-teal-200 transition-colors group">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">
                      {getTargetAudienceLabel(audience)}
                    </span>
                 </div>
              ))}
           </div>
        </section>

        {/* Capacité */}
        {announcement.requiresRegistration && capacity > 0 && (
           <section className="mb-8 bg-linear-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center">
                   <Users className="h-5 w-5 mr-2 text-teal-700" /> Inscriptions
                 </h3>
                 <div className="text-right">
                    <p className="text-3xl font-bold text-teal-700">{capacity - registeredCount}</p>
                    <p className="text-sm text-gray-600">places restantes</p>
                 </div>
              </div>
              <div className="w-full bg-teal-200 rounded-full h-4 mb-2 overflow-hidden">
                 <div 
                   className={`h-4 rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-teal-600'}`} 
                   style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                 ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                 <span className="flex items-center">
                   <CheckCircle className="h-4 w-4 mr-1 text-teal-600" /> {registeredCount} personne{registeredCount > 1 && 's'} déjà inscrite{registeredCount > 1 && 's'}
                 </span>
                 {isFull && (
                   <span className="text-red-600 font-bold flex items-center">
                     <AlertCircle className="h-4 w-4 mr-1" /> Complet
                   </span>
                 )}
              </div>
           </section>
        )}
      </div>
    </div>
  );
}

// ... imports inchangés ...

function CommentsSection({ 
  contentId, 
  isAuthenticated, 
  onLoginPrompt 
}: { 
  contentId: string; 
  isAuthenticated: boolean; 
  onLoginPrompt: () => void;
}) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // ✅ 1. Ajouter QueryClient pour la gestion du cache
  const queryClient = useQueryClient();

  const queryOptions = useMemo(() => ({ limit: 10 }), []);
  const { data: commentsResponse, isLoading } = useCommentsByContent(
    'ANNOUNCEMENT',
    contentId,
    queryOptions
  );
  const comments = commentsResponse?.data || [];
  const createMutation = useCreateComment();

  const handleSubmit = () => {
    if (!isAuthenticated) { onLoginPrompt(); return; }
    if (!newComment.trim()) return;
    createMutation.mutate(
      { contentType: 'ANNOUNCEMENT', contentId: contentId, content: newComment }, 
      { 
        onSuccess: () => {
          // ✅ 2. INVALIDER LE CACHE pour rafraîchir la liste immédiatement
          queryClient.invalidateQueries({ 
            queryKey: ['comments', 'content', 'ANNOUNCEMENT', contentId] 
          });
          setNewComment(''); 
        }
      }
    );
  };

  const handleReplySubmit = (parentId: string) => {
    if (!isAuthenticated) { onLoginPrompt(); return; }
    if (!replyContent.trim()) return;
    createMutation.mutate(
      { contentType: 'ANNOUNCEMENT', contentId: contentId, content: replyContent, parentCommentId: parentId }, 
      { 
        onSuccess: () => { 
          queryClient.invalidateQueries({ 
            queryKey: ['comments', 'content', 'ANNOUNCEMENT', contentId] 
          });
          setReplyContent(''); 
          setReplyingTo(null); 
        } 
      }
    );
  };

  const formatTimeAgo = (date: Date | string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " ans";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    interval = seconds / 86400;
    if (interval > 1) return "il y a " + Math.floor(interval) + " jours";
    interval = seconds / 3600;
    if (interval > 1) return "il y a " + Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return "il y a " + Math.floor(interval) + " min";
    return "à l'instant";
  };

  const getInitials = (user: any) => {
    if (!user) return 'U';
    const first = user.firstName ? user.firstName[0].toUpperCase() : '';
    const last = user.lastName ? user.lastName[0].toUpperCase() : '';
    return (first + last) || user.firstName?.substring(0, 1).toUpperCase() || 'U';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-8">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-blue-600" /> Commentaires ({comments.length})
        </h2>
        
        {/* Zone de nouveau commentaire (Inchangée) */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
              Moi
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated ? "Ajouter un commentaire..." : "Connectez-vous pour commenter"}
                disabled={!isAuthenticated}
                className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm ${!isAuthenticated ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button 
                  onClick={handleSubmit} 
                  disabled={createMutation.isPending || !newComment.trim() || !isAuthenticated} 
                  className="px-6 py-2.5 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-bold"
                >
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />} Publier
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 text-teal-600 animate-spin" /></div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                
                {/* =========================== */}
                {/* 1. COMMENTAIRE PARENT (Style Normal) */}
                {/* =========================== */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-gray-300">
                    {comment.user?.avatar ? (
                      <img 
                        src={getCloudinaryImageUrl(comment.user.avatar, { width: 100, height: 100 })} 
                        alt={comment.user.firstName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">
                        {getInitials(comment.user)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Utilisateur inconnu'}
                      </h3>
                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                    
                    <button 
                      onClick={() => setReplyingTo(comment.id)} 
                      className="mt-3 text-xs font-medium text-gray-500 hover:text-teal-600 flex items-center"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" /> Répondre
                    </button>

                    {/* =========================== */}
                    {/* 2. ZONE INPUT RÉPONSE (Si actif) */}
                    {/* =========================== */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <textarea 
                          value={replyContent} 
                          onChange={(e) => setReplyContent(e.target.value)} 
                          className="w-full text-sm p-2 bg-white border rounded mb-2" 
                          placeholder="Répondre..." 
                          rows={2} 
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Annuler</button>
                          <button onClick={() => handleReplySubmit(comment.id)} className="px-3 py-1 bg-teal-600 text-white rounded text-xs disabled:opacity-50">
                            Répondre
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* =========================== */}
                {/* 3. LISTE DES RÉPONSES (Style Imbriqué) */}
                {/* =========================== */}
                {/* ✅ CORRECTION ICI : On mappe sur comment.replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 md:ml-12 pl-4 border-l-2 border-gray-200 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                        
                        {/* Avatar Réponse (Plus petit) */}
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                          {reply.user?.avatar ? (
                            <img 
                              src={getCloudinaryImageUrl(reply.user.avatar, { width: 50, height: 50 })} 
                              alt={reply.user.firstName} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500">
                              {getInitials(reply.user)}
                            </span>
                          )}
                        </div>

                        {/* Contenu Réponse */}
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            {/* Nom Réponse */}
                            <h4 className="font-bold text-gray-800 text-xs">
                              {reply.user ? `${reply.user.firstName} ${reply.user.lastName}` : 'Utilisateur'}
                            </h4>
                            <span className="text-[10px] text-gray-400">{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Indicateur "Voir plus" si plus de 3 réponses */}
                    {(comment.totalReplies || 0) > 3 && (
                      <div className="ml-11 mt-2 text-xs font-medium text-teal-600 hover:underline cursor-pointer">
                        Voir les {comment.totalReplies} autres réponses
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <MessageCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun commentaire pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SimilarAnnouncements({ 
  currentCategoryId, 
  currentId, 
  bookmarkMap 
}: { 
  currentCategoryId?: string; 
  currentId: string; 
  bookmarkMap: Record<string, boolean>;
}) {
  const queryParams = useMemo(() => ({ 
    categoryId: currentCategoryId, 
    limit: 3, 
    status: AnnouncementStatus.PUBLISHED 
  }), [currentCategoryId]);
  
  const { data: response } = useAnnouncementsList(queryParams);
  const similar = response?.data?.filter(a => a.id !== currentId) || [];

  if (!similar.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Campagnes similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {similar.map((campaign) => {
           const isBookmarked = bookmarkMap[campaign.id] || false;
           return (
           <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="h-40 relative">
                 <img 
                   src={getAnnouncementImageUrl(campaign.featuredImage,  { width: 400, height: 225, crop: 'fill' })} 
                   alt={campaign.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                   loading="lazy" 
                 />
                 <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center text-xs font-medium text-gray-700">
                  <span className="mr-1">{getCategoryIcon(campaign.category)}</span>
                  {campaign.category?.name}
                 </div>
                 {isBookmarked && (
                   <Bookmark className="absolute top-3 right-3 h-4 w-4 text-yellow-500 fill-current drop-shadow-md" />
                 )}
              </div>
              <div className="p-4">
                 <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{campaign.title}</h3>
                 <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-600">
                      {campaign.isFree ? 'Gratuit' : `${campaign.cost} XAF`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {campaign.registeredCount || 0}/{campaign.capacity || 0}
                    </span>
                 </div>
                 <button 
                   onClick={() => window.location.href = `/annonces/${campaign.slug}`} 
                   className="w-full mt-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-bold hover:bg-teal-100 transition-colors"
                 >
                   Voir détails
                 </button>
              </div>
           </div>
        )})}
      </div>
    </section>
  );
}

function RegistrationModal({ 
  isOpen, 
  onClose, 
  announcement, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  announcement: Announcement; 
  onConfirm: (data: { visitorName: string; visitorPhone: string; visitorEmail?: string }) => void;
}) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    if (!formData.name || !formData.phone) { toast.error("Veuillez remplir les champs obligatoires"); return; }
    onConfirm({ visitorName: formData.name, visitorPhone: formData.phone, visitorEmail: formData.email || undefined }); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: '100%', opacity: 0 }} 
        transition={{ type: 'spring', damping: 25, stiffness: 300 }} 
        className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl"
      >
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Inscription à la campagne</h2>
          <button onClick={onClose}><X className="h-6 w-6 text-gray-500" /></button>
        </header>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600" 
              placeholder="Votre nom" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600" 
              placeholder="+237..." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-600" 
              placeholder="email@exemple.com" 
            />
          </div>
        </div>
        <footer className="mt-6">
          <button 
            onClick={handleSubmit} 
            className="w-full py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-xl font-bold shadow-md hover:from-teal-700 hover:to-blue-700"
          >
            Confirmer mon inscription
          </button>
        </footer>
      </motion.div>
    </div>
  );
}

// ==========================================
// PAGE PRINCIPALE
// ==========================================

export default function AnnouncementDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  
  // Data Fetching
  const { data: announcement, isLoading, error } = useAnnouncement(slug || '');
  const registerMutation = useRegisterAnnouncement();
  
  // États
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (announcement?.id) {
      // On invalide la requête pour s'assurer d'avoir le dernier "viewsCount"
      // Note : La clé doit correspondre à celle définie dans votre hook useAnnouncement
      queryClient.invalidateQueries({ 
        queryKey: ['announcements', 'detail', announcement.id] 
      });
    }
  }, [announcement?.id]);


  // État d'authentification (Détection changement)
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) { 
          setIsAuthenticated(false); 
          return; 
        }
        const { state } = JSON.parse(authStorage);
        setIsAuthenticated(!!state.accessToken); // ✅ On utilise accessToken ici aussi
      } catch { 
        setIsAuthenticated(false); 
      }
    };
    checkAuthStatus();
    
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ LOGIQUE FAVORIS OPTIMISÉE (checkMany)
  const { data: bookmarkCheck } = useIsBookmarked(ContentType.ANNOUNCEMENT, announcement?.id || '', isAuthenticated);
  const toggleBookmark = useToggleBookmark();
  
  // Récupération des similaires pour le check
  const queryParams = useMemo(() => ({ 
    categoryId: announcement?.categoryId, 
    limit: 3, 
    status: AnnouncementStatus.PUBLISHED 
  }), [announcement?.categoryId]);
  const { data: similarResponse } = useAnnouncementsList(queryParams);
  const similarIds = useMemo(() => {
    const list = similarResponse?.data?.filter(a => a.id !== announcement?.id) || [];
    return list.map(a => a.id);
  }, [similarResponse, announcement?.id]);

  // Fusion pour le check par lot
  const allIdsToCheck = useMemo(() => {
    const ids = [...similarIds];
    if (announcement?.id) ids.push(announcement.id);
    return ids;
  }, [similarIds, announcement?.id]);

  const { data: bookmarksMap } = useBookmarksCheck(
    ContentType.ANNOUNCEMENT,
    allIdsToCheck,
    isAuthenticated
  );

  // État dérivé pour le favori principal
  const isBookmarked = bookmarkCheck?.isBookmarked || false;

  // ✅ HOOKS RÉACTIONS
  const { data: stats } = useReactionStats(ContentType.ANNOUNCEMENT, announcement?.id || '', !!announcement?.id);
  const toggleReaction = useToggleReaction();

  // Handlers
  const handleLikeClick = () => {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    toggleReaction.mutate(
      { contentType: ContentType.ANNOUNCEMENT, contentId: announcement!.id, type: ReactionType.LIKE }, 
      { onSuccess: (data) => setIsLiked(!!data) } // Optimistic UI : si on reçoit une réaction, on assume que c'est le like
    );
  };

  const handleBookmarkToggle = () => {
    if (!isAuthenticated) { setIsLoginPromptOpen(true); return; }
    toggleBookmark.mutate(ContentType.ANNOUNCEMENT, announcement!.id, isBookmarked);
  };

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-teal-600" /></div>;
  if (error || !announcement) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><h2 className="text-2xl">Annonce non trouvée</h2></div>;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: announcement.title, url });
    else { 
      navigator.clipboard.writeText(url); 
      toast.success('Lien copié !'); 
    }
  };

  const getOrCreateDeviceId = (): string => {
    const storageKey = 'device_uuid';
    let deviceId = localStorage.getItem(storageKey);
    if (!deviceId) {
      deviceId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : 'device-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(storageKey, deviceId);
    }
    return deviceId;
  };

  const handleRegistrationSubmit = (data: { visitorName: string; visitorPhone: string; visitorEmail?: string }) => {
    const deviceId = getOrCreateDeviceId();
    registerMutation.mutate(
      { id: announcement.id, data: { ...data, deviceId: deviceId } }, 
      { 
        onSuccess: () => { 
          setIsRegistrationModalOpen(false); 
          setIsConfirmationModalOpen(true); 
          setIsInterested(true); 
          queryClient.invalidateQueries({ queryKey: ['announcements'] }); 
          queryClient.invalidateQueries({ queryKey: ['announcements', 'detail', announcement.id] }); 
        } 
      }
    );
  };

  const handleInterestToggle = () => {
    if (!isInterested) { 
      setIsRegistrationModalOpen(true); 
    } else { 
      setIsInterested(false); 
      // Logique pour annuler l'inscription si nécessaire
      toast.success('Inscription annulée'); 
    }
  };
  
  const likeCount = stats?.LIKE || 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ✅ NAVBAR */}
      <Navbar />
      <main className="pt-16 md:pt-20">

      <HeroImageSection 
        announcement={announcement} 
        isBookmarked={isBookmarked} 
        onBookmarkToggle={handleBookmarkToggle} 
        onShare={handleShare}
        isAuthenticated={isAuthenticated}
        onLoginPrompt={() => setIsLoginPromptOpen(true)}
      />
      
      <div className="w-full pt-24 sm:pt-28">
         <ContentSection 
            announcement={announcement} 
            onLikeClick={handleLikeClick} 
            isLiked={isLiked} 
            likeCount={likeCount} 
         />
         <CommentsSection 
            contentId={announcement.id} 
            isAuthenticated={isAuthenticated} 
            onLoginPrompt={() => setIsLoginPromptOpen(true)} 
         />
         
         {/* ✅ ANNONCES SIMILAIRES AJOUTÉES */}
         <SimilarAnnouncements 
            currentCategoryId={announcement.categoryId} 
            currentId={announcement.id} 
            bookmarkMap={bookmarksMap || {}} 
         />
      </div>
      </main>

      {/* Fixed Footer Action Bar (Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button onClick={handleInterestToggle} className={`p-2.5 rounded-full border-2 transition-all ${isInterested ? 'bg-green-100 border-green-500 text-green-600' : 'border-gray-200 text-gray-600'}`}>
            {isInterested ? <Check className="h-5 w-5" /> : <Star className="h-5 w-5" />}
          </button>
          <div className="flex-1 min-w-0 px-2">
             <h4 className="text-sm font-bold text-gray-900 truncate">{announcement.title}</h4>
             {announcement.capacity && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                   <div 
                     className={`h-2 rounded-full ${isInterested ? 'bg-green-500' : 'bg-teal-500'}`} 
                     style={{ width: `${(announcement.registeredCount / announcement.capacity) * 100}%` }}
                   ></div>
                </div>
             )}
          </div>
          <button 
            onClick={handleInterestToggle} 
            className="px-6 py-2 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-full font-bold shadow-md disabled:opacity-50"
          >
            {isInterested ? 'Inscrit' : "S'inscrire"}
          </button>
        </div>
      </footer>

      {/* Modals */}
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
        announcement={announcement} 
        onConfirm={handleRegistrationSubmit} 
      />

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
              <p className="text-gray-600 mb-6">Vous devez être connecté pour effectuer cette action.</p>
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

      <AnimatePresence>
        {isConfirmationModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
             <motion.div 
               initial={{ scale: 0.9 }} 
               animate={{ scale: 1 }} 
               className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
             >
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Check className="h-8 w-8 text-green-600" />
               </div>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Inscription validée !</h2>
               <p className="text-gray-600 mb-6">Vous serez contacté prochainement pour les détails.</p>
               <button 
                 onClick={() => setIsConfirmationModalOpen(false)} 
                 className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold"
               >
                 Fermer
               </button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}