/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Eye, Bookmark, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Imports API et Hooks
import { useAnnouncementsList } from '@/hooks/useAnnouncements'; // ✅ Hook sécurisé
import { mockAnnouncements } from '@/lib/mock-data';
import { Announcement, AnnouncementStatus } from '@/types/announcement'; // Types stricts
import { Category } from '@/types/category'; // ✅ Correction : Import de l'interface principale pour accéder à .icon

// Imports Utilitaires et Fonctions
import { getCloudinaryImageUrl } from '@/lib/cloudinary';
import { getCategoryIcon } from '@/components/home/utils/category-utils'; // Assurez-vous que ce fichier existe et est typé comme montré précédemment

export default function FeaturedAnnouncements() {
  // ==========================================
  // 1. RÉCUPÉRATION DES DONNÉES (API + FALLBACK)
  // ==========================================
  
  const { 
    data: announcementsResponse, 
    isLoading, 
    error 
  } = useAnnouncementsList({ 
    limit: 8, 
    status: AnnouncementStatus.PUBLISHED 
  });

  // LOGIQUE SÉCURISÉE Fallback :
  // Si l'API répond (existe) ET qu'il y a des données -> API
  // Sinon (Erreur, Chargement initial rapide, ou Vide) -> Mocks
  const announcements = (announcementsResponse && announcementsResponse.data && announcementsResponse.data.length > 0)
    ? announcementsResponse.data
    : mockAnnouncements;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dernières annonces</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Ne manquez aucune campagne de santé à proximité
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
            <span className="text-gray-500 text-sm font-medium">Chargement des annonces...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {announcements.slice(0, 8).map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/annonces/${announcement.slug || announcement.id}`} className="block h-full">
                  {/* Image Container */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={getCloudinaryImageUrl(announcement.featuredImage, { width: 400, height: 225, crop: 'fill' })}
                      alt={announcement.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge Favoris (Bookmark) */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                    </div>

                    {/* Badge Catégorie */}
                    {announcement.category && (
                      <div className="absolute top-2 left-2 bg-teal-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span className="text-sm">{getCategoryIcon(announcement.category)}</span>
                        <span className="hidden sm:inline">{announcement.category.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Contenu Texte */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm sm:text-base group-hover:text-teal-600 transition-colors min-h-10">
                      {announcement.title}
                    </h3>
                    
                    {/* Méta-données */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 shrink-0" />
                        <span className="truncate">
                          {announcement.location?.city}
                          {announcement.location?.city && announcement.location?.region && ', '}
                          {announcement.location?.region}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 shrink-0" />
                        <span>
                          {new Date(announcement.startDate).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Coût & Vues */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                      <span className="text-xs sm:text-sm font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                        {announcement.isFree ? 'Gratuit' : `${announcement.cost} XAF`}
                      </span>
                      
                      <div className="flex items-center text-xs sm:text-sm text-gray-500 font-medium">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {announcement.viewsCount}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bouton "Voir tout" */}
        <div className="text-center mt-8 sm:mt-10">
          <Link 
            href="/annonces" 
            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            Voir toutes les annonces
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}