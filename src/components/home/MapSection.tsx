'use client';

import Link from 'next/link';
import { Search, MapPin, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { mockHospitals } from '@/lib/mock-data';

// Import dynamique de Leaflet pour éviter les erreurs de SSR
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-gray-200 animate-pulse"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>
});

export default function MapSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Trouvez un hôpital près de chez vous
        </h2>

        {/* Conteneur de la carte : HAUTEUR AUGMENTÉE */}
        <div 
          className="relative bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg" 
          style={{ height: '500px', minHeight: '350px' }} // ✅ AJUSTEMENT ICI : Hauteur augmentée à 500px
        >
          <LeafletMap hospitals={mockHospitals} />
                
          {/* Filtres */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-10 flex gap-2">
            <button className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
              Public
            </button>
            <button className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
              Privé
            </button>
            <button className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors">
              Urgences 24/7
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="absolute top-4 left-4 right-20 sm:right-auto sm:left-4 z-10">
            <div className="bg-white rounded-lg shadow-md p-2 flex">
              <input
                type="text"
                placeholder="Rechercher une ville..."
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base flex-1"
              />
              <button className="px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Bouton de localisation */}
          <div className="absolute bottom-4 right-4 z-10">
            <button className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow" aria-label="Ma position">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
            </button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link href="/hopitaux" className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors text-sm sm:text-base">
            Voir tous les hôpitaux
          </Link>
        </div>
      </div>
    </section>
  );
}