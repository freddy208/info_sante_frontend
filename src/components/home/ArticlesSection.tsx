/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Eye, 
  MessageCircle, 
  Heart, 
  Loader2, 
  Calendar, 
  Clock, 
  ShieldCheck,
  Star,
  Building 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Imports API et Hooks
import { useArticlesList } from '@/hooks/useArticles';
import { Article } from '@/types/article';
import { ArticleStatus } from '@/types/article';

// Imports Utilitaires
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

export default function ArticlesSection() {
  // ==========================================
  // 1. RÉCUPÉRATION DES DONNÉES (API UNIQUEMENT)
  // ==========================================

  const { 
    data: articlesResponse, 
    isLoading, 
    error 
  } = useArticlesList({
    limit: 6, 
    status: ArticleStatus.PUBLISHED,
  });

  // On utilise directement les données de l'API
  const articles = articlesResponse?.data || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Formes d'arrière-plan subtilles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-20 translate-y-32 -translate-x-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
            >
              Articles de santé <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-600">récents</span>
            </motion.h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Des conseils médicaux vérifiés et des actualités sanitaires pour vous accompagner au quotidien.
            </p>
          </div>
          <Link 
            href="/articles" 
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors group"
          >
            Voir tous <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
            <span className="text-gray-500 text-sm font-medium">Chargement des articles...</span>
          </div>
        ) : articles.length === 0 ? (
          // État vide : Aucun article trouvé
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Building className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucun article disponible pour le moment.</p>
          </div>
        ) : (
          /* Grille des Articles */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 
                  group border relative overflow-hidden flex flex-col
                  ${article.isFeatured ? 'border-amber-200 hover:border-amber-400' : 'border-gray-100 hover:border-teal-100'}
                `}
              >
                <Link href={`/articles/${article.slug || article.id}`} className="block h-full">
                  {/* Image Header */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    {/* Badge "À la une" */}
                    {article.isFeatured && (
                      <div className="absolute top-3 right-3 z-20 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        À la une
                      </div>
                    )}
                    
                    {/* Image */}
                    <img
                      src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 225, crop: 'fill' })}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badge Catégorie */}
                    {article.category && (
                      <div className="absolute top-3 left-3 z-20 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        {article.category.name}
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col grow">
                    
                    {/* 🛡️ ÉLÉMENT DE RÉASSURANCE (Ligne Organisation) */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        {article.organization?.logo ? (
                          <img 
                            src={article.organization.logo} 
                            alt={article.organization.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <Building className="h-6 w-6 text-gray-400" />
                        )}
                        
                        <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                          {article.organization?.name || 'Rédaction MboaSanté'}
                        </span>
                      </div>

                      {/* ✅ BADGE VÉRIFIÉ (CRITICAL FOR TRUST) */}
                      {article.organization?.isVerified && (
                        <div className="flex items-center gap-0.5 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100" title="Organisation vérifiée par MboaSanté">
                          <ShieldCheck className="h-3 w-3 fill-current" />
                          <span className="text-[10px] font-bold leading-none">Vérifié</span>
                        </div>
                      )}
                    </div>

                    {/* Titre */}
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-base sm:text-lg leading-snug group-hover:text-teal-700 transition-colors min-h-12">
                      {article.title}
                    </h3>
                    
                    {/* Résumé */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed grow">
                      {article.excerpt}
                    </p>

                    {/* Metadonnées (Date & Temps) */}
                    <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                        <Calendar className="h-3 w-3 mr-1.5" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 mr-1.5" />
                        {article.readingTime || 5} min
                      </div>
                    </div>

                    {/* Footer: Stats & CTA */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center justify-between">
                        
                        {/* Social Proof (Stats) */}
                        <div className="flex items-center space-x-3 text-xs sm:text-xs font-medium text-gray-400">
                          <div className="flex items-center hover:text-blue-500 transition-colors">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            {article.viewsCount}
                          </div>
                          <div className="flex items-center hover:text-red-500 transition-colors">
                            <Heart className="h-3.5 w-3.5 mr-1" />
                            {article.reactionsCount}
                          </div>
                        </div>

                        {/* 💡 BOUTON D'ACTION (Voir Détails) */}
                        <span className="inline-flex items-center gap-1 text-teal-600 text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
                          Lire l&apos;article
                          <ArrowRight className="h-4 w-4" />
                        </span>
                        
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bouton "Voir tout" global */}
        <div className="text-center mt-12 sm:mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/articles" 
              className="inline-flex items-center px-8 py-3.5 bg-linear-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Explorer tous nos articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
