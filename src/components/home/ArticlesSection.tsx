/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, MessageCircle, Heart, Loader2, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Imports API et Hooks
import { useArticlesList } from '@/hooks/useArticles';
import { mockArticles } from '@/lib/mock-data';
import { Article } from '@/types/article';
import { Category } from '@/types/category'; // Nécessaire pour accéder à category.name
import { ArticleStatus } from '@/types/article';

// Imports Utilitaires
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

export default function ArticlesSection() {
  // ==========================================
  // 1. RÉCUPÉRATION DES DONNÉES (API + FALLBACK)
  // ==========================================

  const { 
    data: articlesResponse, 
    isLoading, 
    error 
  } = useArticlesList({
    limit: 6, 
    status: ArticleStatus.PUBLISHED,
    featured: true // On suppose qu'on veut les articles en avant
  });

  // LOGIQUE SÉCURISÉE Fallback :
  // Si l'API répond et a des données -> API
  // Sinon (Erreur, Chargement initial rapide, ou Vide) -> Mocks
  const articles = (articlesResponse && articlesResponse.data && articlesResponse.data.length > 0)
    ? articlesResponse.data
    : mockArticles;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Formes d'arrière-plan */}
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
              Restez informé avec nos derniers articles médicaux et conseils d&apos;experts
            </p>
          </div>
          <Link 
            href="/articles" 
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center text-sm sm:text-base whitespace-nowrap px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors"
          >
            Voir tous <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
            <span className="text-gray-500 text-sm font-medium">Chargement des articles...</span>
          </div>
        ) : (
          /* Grille des Articles */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.slice(0, 6).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/articles/${article.slug || article.id}`} className="block h-full">
                  {/* Image Header */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={getCloudinaryImageUrl(article.featuredImage, { width: 400, height: 225, crop: 'fill' })}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge Catégorie */}
                    {article.category && (
                      <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        {article.category.name}
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col h-full">
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-sm sm:text-lg group-hover:text-teal-600 transition-colors min-h-10">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm sm:text-base grow">
                      {article.excerpt}
                    </p>

                    {/* Metadonnées */}
                    <div className="flex items-center flex-wrap gap-2 mb-4 text-xs sm:text-sm text-gray-500">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                        {article.author || 'Rédaction MboaSanté'}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {article.readingTime || 5} min
                      </span>
                    </div>

                    {/* Footer Stats */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-500 font-medium">
                        <div className="flex items-center hover:text-gray-700 transition-colors">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.viewsCount}
                        </div>
                        <div className="flex items-center hover:text-gray-700 transition-colors">
                          <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.commentsCount}
                        </div>
                        <div className="flex items-center hover:text-red-500 transition-colors">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {article.reactionsCount}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                         <ArrowRight className="h-4 w-4 text-teal-600" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bouton "Voir tout" */}
        <div className="text-center mt-10 sm:mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              href="/articles" 
              className="inline-flex items-center px-8 py-3 bg-linear-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Voir tous les articles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}