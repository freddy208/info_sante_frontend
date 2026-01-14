//src/components/shared/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  // 🔍 DEBUG : Afficher l'état d'authentification
  useEffect(() => {
    console.log('🔍 Navbar - État auth:', { 
      isAuthenticated, 
      user: user ? `${user.firstName} ${user.lastName}` : 'null' 
    });
  }, [isAuthenticated, user]);

  // Fermer le menu user en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Obtenir l'initiale de l'utilisateur
  const getUserInitial = () => {
    if (!user?.firstName) return 'U';
    return user.firstName.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Déconnexion...');
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
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
              <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-gray-900">
                Info santé Cameroun
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link href="/accueil" className="text-gray-900 hover:text-teal-600 font-medium transition-colors">
              Accueil
            </Link>
            <Link href="/annonces" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Campagnes
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Articles
            </Link>
            <Link href="/conseils" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Conseils
            </Link>
            <Link href="/hopitals" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
              Hôpitaux
            </Link>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isAuthenticated && user ? (
              // Menu utilisateur connecté
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {/* Avatar avec initiale */}
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-teal-500 via-emerald-500 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    {getUserInitial()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.firstName}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      {/* Info utilisateur */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <Link
                        href="/profil"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                        Mon profil
                      </Link>

                      <Link
                        href="/preferences"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Mes préférences
                      </Link>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Boutons Connexion/Inscription pour utilisateur non connecté
              <>
                <Link
                  href="/auth/connexion"
                  className="px-3 lg:px-4 py-2 text-teal-600 font-medium hover:text-teal-700 transition-colors text-sm lg:text-base"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/inscription"
                  className="px-3 lg:px-4 py-2 bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 text-white font-medium rounded-full hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all text-sm lg:text-base shadow-lg hover:shadow-xl"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Info utilisateur mobile (si connecté) */}
              {isAuthenticated && user && (
                <div className="flex items-center space-x-3 px-3 py-3 bg-linear-to-r from-teal-50 to-emerald-50 rounded-lg mb-2">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-500 via-emerald-500 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-lg">
                    {getUserInitial()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <Link
                href="/accueil"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/annonces"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Campagnes
              </Link>
              <Link
                href="/articles"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/conseils"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Conseils
              </Link>
              <Link
                href="/hopitals"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hôpitaux
              </Link>

              {/* Actions mobile */}
              <div className="pt-4 pb-2 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/profil"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserIcon className="w-5 h-5 mr-2" />
                      Mon profil
                    </Link>
                    <Link
                      href="/preferences"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Mes préférences
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 mt-1 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/connexion"
                      className="block px-3 py-2 rounded-md text-base font-medium text-teal-600 hover:text-teal-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/auth/inscription"
                      className="block px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-linear-to-r from-teal-500 via-emerald-500 to-cyan-600 hover:from-teal-600 hover:via-emerald-600 hover:to-cyan-700 transition-all shadow-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}