'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  HelpCircle,
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  Home,
  Megaphone,
  FileText,
  Lightbulb,
  Users,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation'; // Changement de 'next/router' à 'next/navigation'
import { toast } from 'react-hot-toast';

// Page d'aide et de support
export default function HelpSupport() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('help');
  
  const router = useRouter();

  // Données mock pour les tutoriels vidéo
  const videoTutorials = [
    { id: 1, title: "Créer votre première campagne", duration: "5:30", thumbnail: "https://picsum.photos/seed/tutorial1/320/180.jpg" },
    { id: 2, title: "Publier une campagne efficace", duration: "8:15", thumbnail: "https://picsum.photos/seed/tutorial2/320/180.jpg" },
    { id: 3, title: "Analyser vos statistiques", duration: "6:45", thumbnail: "https://picsum.photos/seed/tutorial3/320/180.jpg" }
  ];

  // Données mock pour les catégories d'aide
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Démarrage',
      description: 'Configuration initiale de votre compte',
      icon: '🎯',
      articles: [
        'Comment créer un compte',
        'Premiers pas avec le tableau de bord',
        'Configuration de votre profil'
      ]
    },
    {
      id: 'campaign-management',
      title: 'Gestion des campagnes',
      description: 'Créer, publier et gérer vos campagnes',
      icon: '📢',
      articles: [
        'Créer une nouvelle campagne',
        'Personnaliser votre campagne',
        'Planifier des publications'
      ]
    },
    {
      id: 'statistics',
      title: 'Comprendre vos statistiques',
      description: 'Analyser et améliorer vos performances',
      icon: '📊',
      articles: [
        'Lire vos rapports de performance',
        'Exporter vos données',
        'Comparer les périodes'
      ]
    },
    {
      id: 'account-settings',
      title: 'Paramètres du compte',
      description: 'Personnaliser votre profil et préférences',
      icon: '⚙️',
      articles: [
        'Mettre à jour vos informations',
        'Gérer les notifications',
        'Sécurité et confidentialité'
      ]
    }
  ];

  // Questions fréquentes
  const faqs = [
    "Comment publier une campagne?",
    "Comment répondre aux avis?",
    "Comment inviter des membres d'équipe?",
    "Comment exporter mes statistiques?",
    "Comment modifier mon profil public?"
  ];

  // Toggle pour les catégories d'aide
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Mock user data
  const user = {
    name: 'Dr. Kamga',
    avatar: 'https://res.cloudinary.com/duqsblvzm/image/upload/v1765043225/ministere-sante-logo.png',
    role: 'Administrateur',
    hospital: 'Hôpital Général',
    email: 'dr.kamga@hospitalgeneral.cm'
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'Nouveau membre dans l\'équipe', time: 'Il y a 5 minutes', action: 'Voir' },
    { id: 2, title: 'Paramètres de sécurité mis à jour', time: 'Il y a 1 heure', action: 'Voir' },
    { id: 3, title: 'Rapport hebdomadaire disponible', time: 'Il y a 3 heures', action: 'Voir' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} notifications={notifications} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Contenu de la page d'aide */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Titre de la page */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Aide & Support</h1>
              <p className="text-gray-600 text-lg">Comment pouvons-nous vous aider?</p>
            </div>
            
            {/* Barre de recherche */}
            <div className="mb-10">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-gray-900 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                  placeholder="Rechercher dans l'aide..."
                />
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat en direct</h3>
                    <p className="text-gray-600 mb-4">Lun-Ven 9h-18h</p>
                    <button className="text-teal-600 font-medium flex items-center">
                      Démarrer <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Envoyer un email</h3>
                    <p className="text-gray-600 mb-4">Réponse sous 24h</p>
                    <button className="text-blue-600 font-medium flex items-center">
                      Envoyer <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Phone className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Appeler le support</h3>
                    <p className="text-gray-600 mb-4">+237 XXX XX XX XX</p>
                    <button className="text-green-600 font-medium flex items-center">
                      Appeler <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Catégories d'aide */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📚</span> Catégories d&apos;aide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedCategory === category.id ? 'transform rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-5 pt-0">
                            <ul className="space-y-2 pt-3">
                              {category.articles.map((article, index) => (
                                <li key={index} className="flex items-center text-gray-700 hover:text-teal-600 cursor-pointer transition-colors">
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                  {article}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tutoriels vidéo */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🎥</span> Tutoriels vidéo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videoTutorials.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-teal-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <span className="mr-1">🕐</span> {video.duration}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
                  Voir tous les tutoriels <ChevronRight className="inline h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Questions fréquentes */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">❓</span> Questions fréquentes
              </h2>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <ul className="space-y-3">
                  {faqs.map((faq, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-teal-600 mr-2">•</span>
                      <span className="text-gray-700 hover:text-teal-600 cursor-pointer transition-colors">{faq}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <button className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
                    Voir toutes les FAQ <ChevronRight className="inline h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Informations de contact */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📞</span> Nous contacter
              </h2>
              <div className="bg-teal-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-teal-600 mr-3" />
                    <span className="text-gray-700">support-hospitals@santefacile.cm</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-teal-600 mr-3" />
                    <span className="text-gray-700">+237 XXX XX XX XX</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 text-teal-600 mr-3" />
                    <span className="text-gray-700">+237 6 XX XX XX XX (WhatsApp)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">🕐</span>
                    <span className="text-gray-700">Lun-Ven, 9h-18h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Composant pour la barre latérale
function Sidebar({ activeMenu, setActiveMenu }: { 
  activeMenu: string; 
  setActiveMenu: (menu: string) => void 
}) {
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home, path: '/hopitals/dashboard' },
    { id: 'announcements', label: 'Annonces', icon: Megaphone, path: '/hopitals/dashboard/annonces' },
    { id: 'articles', label: 'Articles', icon: FileText, path: '/hopitals/dashboard/articles' },
    { id: 'advice', label: 'Conseils', icon: Lightbulb, path: '/hopitals/dashboard/conseils' },
    { id: 'subscribers', label: 'Abonnés', icon: Users, path: '/hopitals/dashboard/abonnes' },
    { id: 'reviews', label: 'Avis', icon: MessageSquare, path: '/hopitals/dashboard/avis' },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, path: '/hopitals/dashboard/statistiques' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/hopitals/dashboard/parametres' },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle, path: '/hopitals/dashboard/aide' }
  ];

  const router = useRouter();

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    router.push('/auth/connexion');
  };

  const handleMenuClick = (itemId: string, path: string) => {
    setActiveMenu(itemId);
    router.push(path);
  };

  return (
    <div className="hidden lg:flex w-64 bg-white h-full shadow-md flex-col rounded-r-2xl">
      {/* Logo et nom de l'hôpital */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
            HG
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Hôpital Général</h2>
            <p className="text-xs text-gray-500">Espace administrateur</p>
          </div>
        </div>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 p-4 overflow-y-auto" role="navigation" aria-label="Menu principal">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                  <span className={`font-medium ${isActive ? 'text-teal-700' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section d'aide et déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

// Composant pour l'en-tête
function Header({ user, notifications, toggleSidebar }: { 
  user: any; 
  notifications: Array<{ id: number; title: string; time: string; action: string }>;
  toggleSidebar: () => void;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Bouton pour afficher/masquer la sidebar sur mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Afficher le menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-900">Aide & Support</h1>
            <p className="text-gray-500">Bonjour, {user.name}! 👋</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Bouton de recherche */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Bouton de notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true"></span>
              )}
            </button>

            {/* Menu des notifications */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50">
                    <button className="text-sm font-medium text-teal-600 hover:text-teal-700">
                      Voir toutes les notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Menu utilisateur"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </button>

            {/* Menu utilisateur */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Mon profil</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </button>
                  </div>
                  <div className="py-2 border-t border-gray-100">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}