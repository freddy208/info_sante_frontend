/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// ✅ CORRECTION ICI : Import sans faute de frappe
import { useCategoriesList } from '@/hooks/useCategories';
import { mockCategories } from '@/lib/mock-data';
import { getCategoryIcon, getCategoryColor } from '@/components/home/utils/category-utils';

export default function CategoriesGrid() {
  // ==========================================
  // 1. RÉCUPÉRATION DES DONNÉES (API + FALLBACK)
  // ==========================================
  
  const { 
    data: categoriesResponse, 
    isLoading, 
    error 
  } = useCategoriesList({ 
    isActive: true,
    parentOnly: true 
  });

  // LOGIQUE SÉCURISÉE :
  // 1. Si l'API répond (categoriesResponse existe) ET qu'il y a des données -> on prend l'API.
  // 2. Sinon (Erreur, Chargement, ou API vide) -> on prend les mocks pour l'UI.
  const categories = (categoriesResponse && categoriesResponse.data && categoriesResponse.data.length > 0)
    ? categoriesResponse.data 
    : mockCategories;

  // Pour le compteur total, on préfère la donnée API si dispo, sinon la longueur du mock
  const totalCategories = categoriesResponse?.meta?.total || categories.length;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Formes d'arrière-plan */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-20 -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 translate-y-32 -translate-x-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Explorez par <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-blue-600">catégorie</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Découvrez nos campagnes de santé organisées par catégorie pour trouver facilement ce qui vous intéresse
            </p>
          </motion.div>
        </div>

        {/* Grille des Catégories */}
        {isLoading && !categories.length ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
            <span className="text-gray-500 font-medium">Chargement des catégories...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.slice(0, 10).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link 
                  href={`/categories/${category.slug || category.id}`} 
                  className="group relative bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden block h-full"
                >
                  {/* Overlay de couleur au survol */}
                  <div className={`absolute inset-0 bg-linear-to-br ${getCategoryColor(category.name)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-between">
                    {/* Icône Cercle */}
                    <div className={`w-14 h-14 sm:w-20 sm:h-20 bg-linear-to-br ${getCategoryColor(category.name)} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl sm:text-4xl">{getCategoryIcon(category)}</span>
                    </div>
                    
                    {/* Contenu Texte */}
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base lg:text-lg group-hover:text-teal-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center justify-center text-xs sm:text-sm text-gray-500 mb-1">
                        <span className="font-semibold text-teal-600">{category.announcementsCount}</span>
                        <span className="mx-1.5 opacity-50">•</span>
                        <span>campagne{category.announcementsCount > 1 ? 's' : ''}</span>
                      </div>
                      
                      {category.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 hidden sm:block">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bouton "Voir tout" */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Link 
            href="/categories" 
            className="inline-flex items-center px-6 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-full hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            Voir toutes les catégories
            <MoreHorizontal className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}