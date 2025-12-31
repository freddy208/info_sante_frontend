/* eslint-disable react-hooks/set-state-in-effect */
// app/offline/page.tsx
'use client'; // Nécessaire pour useEffect

import { WifiOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  // Détecter le changement de connexion
  useEffect(() => {
    // Vérification initiale
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Optionnel : recharger automatiquement quand on revient en ligne
      window.location.reload(); 
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulation d'un délai ou rechargement simple
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header visuel */}
        <div className="bg-teal-50 p-6 flex justify-center border-b border-teal-100">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <WifiOff className="w-12 h-12 text-teal-600" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isOnline ? "Connexion rétablie..." : "Vous êtes hors ligne"}
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isOnline 
              ? "Nous essayons de reconnecter l'application..."
              : "Il semble que vous n'ayez pas de connexion Internet. Certaines informations peuvent ne pas être à jour."
            }
          </p>

          <div className="space-y-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying || isOnline}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Tentative...
                </>
              ) : (
                "Réessayer maintenant"
              )}
            </button>

            <Link 
              href="/" 
              className="block w-full text-center text-teal-600 font-medium py-3 px-6 rounded-lg hover:bg-teal-50 transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}