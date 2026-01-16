'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR : 
         On lui passe 'onClose' pour qu'elle puisse se fermer sur mobile
      */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* TOPBAR : 
           On lui passe 'onMenuClick' pour ouvrir la sidebar sur mobile
        */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Overlay pour fermer le menu en cliquant à côté (Mobile uniquement) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}