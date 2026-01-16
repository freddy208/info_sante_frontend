/* eslint-disable @next/next/no-img-element */
// src/components/dashboard/TopBar.tsx
import { useOrganizationAuthStore } from '@/stores/organizationAuthStore';
import { Menu, User } from 'lucide-react';

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { organization } = useOrganizationAuthStore();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900 hidden md:block">Tableau de bord</h1>
          <p className="text-sm text-gray-500 md:hidden">{organization?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">{organization?.name}</p>
          <p className="text-xs text-teal-600 font-medium capitalize">{organization?.type.toLowerCase().replace('_', ' ')}</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
          {organization?.logo ? (
            <img src={organization.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={20} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}