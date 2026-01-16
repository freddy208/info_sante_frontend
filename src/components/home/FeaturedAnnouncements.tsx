/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Eye, 
  Bookmark, 
  Loader2, 
  AlertTriangle,
  Lock,
  LogIn,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// Imports API et Hooks
import { useAnnouncementsList } from '@/hooks/useAnnouncements'; 
import { Announcement, AnnouncementStatus, Priority } from '@/types/announcement'; 
import { ContentType } from '@/types/reaction';

// Imports Utilitaires
import { getAnnouncementImageUrl, getCloudinaryImageUrl } from '@/lib/cloudinary';
import { getCategoryIcon } from '@/components/home/utils/category-utils';
import { useBookmarksList, useToggleBookmark } from '@/hooks/useBookmarks';

export default function FeaturedAnnouncements() {
  const { 
    data: announcementsResponse, 
    isLoading, 
    error 
  } = useAnnouncementsList({ 
    limit: 8, 
    status: AnnouncementStatus.PUBLISHED 
  });

  // ✅ GESTION DE L'AUTHENTIFICATION
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

  // ✅ LOGIQUE DES FAVORIS (BOOKMARKS)
  const { data: bookmarksResponse } = useBookmarksList({ 
    limit: 50, 
  });

  const bookmarkedIds = useMemo(() => {
    return new Set(bookmarksResponse?.data.map(b => b.contentId) || []);
  }, [bookmarksResponse]);

  const toggleBookmark = useToggleBookmark();

  const handleBookmarkToggle = (e: MouseEvent<HTMLButtonElement>, contentId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }

    toggleBookmark.mutate(
      ContentType.ANNOUNCEMENT,
      contentId,
      bookmarkedIds.has(contentId)
    );
  };

  // ✅ UTILISATION UNIQUE DES DONNÉES API
  const announcements = announcementsResponse?.data || [];

  return (
    <>
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dernières campagnes</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Ne manquez aucune opportunité de santé près de chez vous
              </p>
            </div>
            <Link href="/annonces" className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap transition-colors">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Grille des Annonces */}
          {isLoading && !announcements.length ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
              <span className="text-gray-500 text-sm font-medium">Chargement...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {announcements.slice(0, 8).map((announcement, index) => {
                // Vérifier si c'est un favori
                const isBookmarked = bookmarkedIds.has(announcement.id);
                
                // Calculs pour l'affichage
                const isFull = announcement.capacity && announcement.registeredCount >= announcement.capacity;
                const imageSrc = announcement.thumbnailImage || announcement.featuredImage;

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 flex flex-col"
                  >
                    <Link href={`/annonces/${announcement.slug || announcement.id}`} className="block h-full flex-col">
                      
                      {/* 1. Image Container */}
                      <div className="relative h-40 sm:h-48 overflow-hidden shrink-0">
                        <img
                          src={getAnnouncementImageUrl(imageSrc, { width: 400, height: 225, crop: 'fill' })}
                          alt={announcement.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Badges Superposés */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-80" />
                        
                        <div className="absolute top-2 left-2 flex gap-2">
                          {/* Badge Catégorie */}
                          {announcement.category && (
                            <div className="bg-teal-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                              <span>{getCategoryIcon(announcement.category)}</span>
                              <span className="hidden sm:inline">{announcement.category.name}</span>
                            </div>
                          )}
                          
                          {/* Badge Urgence / Priorité */}
                          {announcement.priority === Priority.URGENT && (
                            <div className="bg-red-500/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="h-3 w-3" />
                              <span>URGENT</span>
                            </div>
                          )}
                        </div>

                        {/* ✅ Badge Bookmark Interactif */}
                        <button 
                          className={`absolute top-2 right-2 rounded-full p-1.5 backdrop-blur-sm shadow-sm hover:bg-white transition-all ${isBookmarked ? 'bg-white text-yellow-500' : 'bg-white/90 text-gray-600'}`}
                          onClick={(e) => handleBookmarkToggle(e, announcement.id)}
                        >
                          <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* 2. Contenu Texte */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col">
                        {/* Organisation */}
                        {announcement.organization && (
                          <div className="flex items-center gap-2 mb-2">
                            {announcement.organization.logo && (
                              <img 
                                src={announcement.organization.logo} 
                                alt="Logo" 
                                className="w-5 h-5 rounded-full object-cover border border-gray-200" 
                              />
                            )}
                            <span className="text-xs font-medium text-gray-500 truncate">
                              {announcement.organization.name}
                            </span>
                          </div>
                        )}

                        {/* Titre */}
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-teal-600 transition-colors min-h-5">
                          {announcement.title}
                        </h3>
                        
                        {/* Méta-données */}
                        <div className="space-y-1.5 mb-3 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-teal-600" />
                            <span className="truncate">
                              {new Date(announcement.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              {announcement.endDate && ` - ${new Date(announcement.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-teal-600" />
                            <span className="truncate">
                              {announcement.location?.city || 'En ligne'}
                              {announcement.location?.region && `, ${announcement.location?.region}`}
                            </span>
                          </div>
                        </div>

                        {/* Indicateur de Places */}
                        {announcement.requiresRegistration && announcement.capacity && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                              <span className={`font-medium ${isFull ? 'text-red-600' : 'text-gray-600'}`}>
                                {isFull ? 'COMPLET' : 'Places disponibles'}
                              </span>
                              <span className="text-gray-500">
                                {announcement.registeredCount} / {announcement.capacity}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-teal-500'}`}
                                style={{ width: `${Math.min((announcement.registeredCount / announcement.capacity) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer: Prix & Vues & Bouton Détails */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                          {/* Prix */}
                          <span className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md ${announcement.isFree ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>
                            {announcement.isFree ? 'Gratuit' : `${announcement.cost} XAF`}
                          </span>
                          
                          {/* Ajout explicite du lien vers détails */}
                          <span className="text-xs font-bold text-teal-600 flex items-center gap-1 group-hover:underline">
                            Voir détails <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bouton "Voir tout" */}
          <div className="text-center mt-10">
            <Link 
              href="/annonces" 
              className="inline-flex items-center px-8 py-3 bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Voir toutes les annonces
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
    </>
  );
}