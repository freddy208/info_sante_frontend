/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useOrganizationAuthStore } from '@/stores/organizationAuthStore';
import { Home, Megaphone, FileText, Lightbulb, Users, Settings, LogOut, X, MessageCircle, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// On définit les types pour les props (doit matcher avec le layout)
interface SidebarProps {
  isOpen: boolean; 
  onClose: () => void;
}

const MENU_ITEMS = [
  { id: 'overview', label: "Vue d'ensemble", icon: Home, href: '/hopitals/dashboard' },
  { id: 'announcements', label: 'Annonces', icon: Megaphone, href: '/hopitals/dashboard/annonces' },
  { id: 'articles', label: 'Articles', icon: FileText, href: '/hopitals/dashboard/articles' },
  { id: 'advice', label: 'Conseils', icon: Lightbulb, href: '/hopitals/dashboard/conseils' },
  { id: 'comments', label: 'Commentaires', icon: MessageCircle, href: '/hopitals/dashboard/commentaires' },
  { id: 'statistics', label: 'Statistiques', icon: BarChart2, href: '/hopitals/dashboard/statistiques' },
  { id: 'settings', label: 'Paramètres', icon: Settings, href: '/hopitals/dashboard/parametres' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { organization, logout } = useOrganizationAuthStore();

  return (
    <>
      {/* Conteneur principal avec gestion de l'animation mobile */}
<aside className={`
  fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 ease-in-out
  lg:translate-x-0 lg:shadow-nonea
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
        <div className="flex flex-col h-full">
          {/* Header de la Sidebar */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-teal-200">
                {organization?.name ? organization.name.charAt(0) : 'H'}
              </div>
              <span className="font-bold text-gray-900 truncate max-w-[120px]">
                {organization?.name || 'Hôpital'}
              </span>
            </div>
            {/* Bouton fermer (visible uniquement sur mobile) */}
            <button 
              onClick={onClose} 
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X size={20}/>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'} 
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer avec Déconnexion */}
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}