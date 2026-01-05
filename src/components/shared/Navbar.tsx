'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Activity, Search, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

// Schéma de validation pour la recherche
const searchSchema = z.object({
  query: z.string().min(1, 'Veuillez entrer un terme de recherche'),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const handleSearch = (data: SearchFormData) => {
    router.push(`/recherche?q=${encodeURIComponent(data.query)}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/accueil" className="flex items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white p-1.5 sm:p-2 rounded-full shadow-2xl">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" strokeWidth={2.5} />
                </div>
              </div>
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-900">Info santé Cameroun</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link href="/accueil" className="text-gray-900 hover:text-teal-600 font-medium transition-colors">Accueil</Link>
            <Link href="/annonces" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Campagnes</Link>
            <Link href="/articles" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Articles</Link>
            <Link href="/conseils" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Conseils</Link>
            <Link href="/hopitals" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">Hopitaux</Link>
          </nav>

          {/* Boutons Connexion/Inscription Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <Link href="/auth/connexion" className="px-3 lg:px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors text-sm lg:text-base">Connexion</Link>
            <Link href="/auth/inscription" className="px-3 lg:px-4 py-2 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all text-sm lg:text-base">Inscription</Link>
          </div>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/accueil" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-teal-600 hover:bg-gray-50">Accueil</Link>
            <Link href="/annonces" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Annonces</Link>
            <Link href="/articles" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Articles</Link>
            <Link href="/conseils" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Conseils</Link>
            <Link href="/hopitals" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Hopitaux</Link>
            <div className="pt-4 pb-2 border-t border-gray-200">
              <Link href="/auth/connexion" className="block px-3 py-2 rounded-md text-base font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50">Connexion</Link>
              <Link href="/auth/inscription" className="block px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700">Inscription</Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}