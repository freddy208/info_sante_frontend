/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/dashboard/DashboardLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganizationAuthStore } from '@/stores/organizationAuthStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { organization, logout } = useOrganizationAuthStore();
  const router = useRouter();

  // Protection de route : si pas d'organisation, redirection login
  useEffect(() => {
    if (!organization) {
      router.push('/auth/login-organization');
    }
  }, [organization, router]);

  if (!organization) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Fixée à gauche */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
    isOpen={sidebarOpen} 
    onClose={() => setSidebarOpen(false)} 
  />
      </aside>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}