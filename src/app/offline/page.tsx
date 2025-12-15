// app/offline/page.tsx
import { WifiOff } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vous êtes hors ligne</h1>
        <p className="text-gray-600 mb-6">
          Il semble que vous n&apos;ayez pas de connexion à Internet. 
          Les pages que vous avez déjà visitées devraient être accessibles.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}