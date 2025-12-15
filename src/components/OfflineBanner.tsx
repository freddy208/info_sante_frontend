// components/OfflineBanner.tsx
'use client';

import { useNetwork } from '@/app/contexts/NetworkContext';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline } = useNetwork();

  if (isOnline) {
    return null; // Ne rien afficher si en ligne
  }

  return (
    <div className="bg-amber-500 text-white p-3 text-center flex items-center justify-center gap-2 z-50 relative">
      <WifiOff className="w-5 h-5" />
      <span className="font-medium">
        Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être indisponibles.
      </span>
    </div>
  );
}