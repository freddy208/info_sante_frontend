/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
 
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Loader2 } from 'lucide-react';

// API & Types
import { publicApi } from '@/lib/api';
import { PublicOrganization } from '@/types/public';
import { OrganizationType } from '@/types/organization';

// Import dynamique de Leaflet
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-200 animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  ),
});

export default function MapSection() {
  // 1. ÉTAT
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ligne 35 environ
  const [activeFilters, setActiveFilters] = useState<OrganizationType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultCenter: [number, number] = [3.848, 11.5021]; // Yaoundé

  // 2. LOGIQUE API & GPS
const loadNearbyHospitals = async (lat: number, lng: number, types?: OrganizationType[]) => {
  setLoading(true);
  try {
    const data = await publicApi.getNearbyOrganizations({
      lat,
      lng,
      radius: 20,
      types, // Maintenant, types est OrganizationType[], ce qui matche l'API
      limit: 50,
    });
      setOrganizations(data || []);
    } catch (error) {
      console.error("Erreur API MapSection:", error);
      setOrganizations([]); 
    } finally {
      setLoading(false);
    }
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          loadNearbyHospitals(latitude, longitude, activeFilters);
        },
        (error) => {
          console.warn("GPS refusé, utilisation du centre par défaut.", error);
          loadNearbyHospitals(defaultCenter[0], defaultCenter[1], activeFilters);
        }
      );
    } else {
      loadNearbyHospitals(defaultCenter[0], defaultCenter[1], activeFilters);
    }
  };

  useEffect(() => {
    locateUser();
  }, []);

  // 3. GESTION DES INTERACTIONS
const handleFilterClick = (typeId: OrganizationType | 'RESET') => {
  if (typeId === 'RESET') {
    setActiveFilters([]);
    const lat = userLocation?.lat || defaultCenter[0];
    const lng = userLocation?.lng || defaultCenter[1];
    loadNearbyHospitals(lat, lng, []);
    return;
  }

  const newFilters = activeFilters.includes(typeId as OrganizationType)
    ? activeFilters.filter((t) => t !== typeId)
    : [...activeFilters, typeId as OrganizationType];

  setActiveFilters(newFilters);
  
  const lat = userLocation?.lat || defaultCenter[0];
  const lng = userLocation?.lng || defaultCenter[1];
  loadNearbyHospitals(lat, lng, newFilters);
};
  // 4. FILTRAGE LOCAL
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery) return organizations;
    const lowerQuery = searchQuery.toLowerCase();
    return organizations.filter(
      (org) =>
        org.name.toLowerCase().includes(lowerQuery) ||
        org.city?.toLowerCase().includes(lowerQuery)
    );
  }, [organizations, searchQuery]);

  // ✅ SOLUTION CORRECTIVE : Adaptateur Robuste
  const hospitalsForMap = useMemo(() => {
    
    const mapData = filteredOrganizations.map((org, index) => {
      // Force Number conversion au cas où l'API renvoie des String
      const lat = Number(org.latitude || org.latitude || 0);
      const lng = Number(org.longitude || org.longitude || 0);

      // Décalage AGRESSIF pour le test (0.01 degré ~= 1 km)
      // Cela permet de voir si le deuxième marqueur existe mais est caché
      const offsetLat = index * 0.005; 
      const offsetLng = index * 0.005;

      return {
        ...org,
        specialties: [], 
        lat: lat + offsetLat,
        lng: lng + offsetLng,
      };
    });
    return mapData;
  }, [filteredOrganizations]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
          Trouvez un hôpital près de chez vous
        </h2>

        {/* Conteneur de la carte */}
        <div 
          className="relative bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg" 
          style={{ height: '500px', minHeight: '350px' }}
        >
          {/* 
              ✅ FIX CRITIQUE : Ajout de la prop "key".
              Cela force React à détruire et recréer le composant Carte 
              à chaque fois que le nombre d'hôpitaux change.
              Cela évite le "cache" visuel de Leaflet.
          */}
          <LeafletMap 
            key={`map-${hospitalsForMap.length}`} 
            hospitals={hospitalsForMap} 
          />
                
          {/* UI : Filtres (Haut Droite) */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 z-10 flex gap-2 flex-col sm:flex-row">
            <button 
              onClick={() => handleFilterClick(OrganizationType.HOSPITAL_PUBLIC)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                activeFilters.includes(OrganizationType.HOSPITAL_PUBLIC)
                  ? 'bg-green-600 text-white ring-2 ring-green-300' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Public
            </button>
            
            <button 
              onClick={() => handleFilterClick(OrganizationType.HOSPITAL_PRIVATE)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                activeFilters.includes(OrganizationType.HOSPITAL_PRIVATE)
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Privé
            </button>
            
            <button 
              onClick={() => handleFilterClick(OrganizationType.CLINIC)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                activeFilters.includes(OrganizationType.CLINIC)
                  ? 'bg-orange-600 text-white ring-2 ring-orange-300' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              }`}
            >
              Urgences 24/7
            </button>

            {activeFilters.length > 0 && (
              <button 
                onClick={() => handleFilterClick('RESET')} 
                className="text-xs text-red-600 font-bold px-2 hover:bg-red-50 rounded"
              >
                Reset
              </button>
            )}
          </div>

          {/* UI : Recherche (Haut Gauche) */}


          {/* UI : Bouton GPS (Bas Droite) */}
          <div className="absolute bottom-4 right-4 z-10">
            <button 
              onClick={locateUser}
              className="p-2 sm:p-3 bg-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-teal-600"
              aria-label="Ma position"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <a 
            href="/hopitaux"
            className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-teal-600 font-medium rounded-full border border-teal-600 hover:bg-teal-50 transition-colors text-sm sm:text-base"
          >
            Voir tous les hôpitaux
          </a>
        </div>
      </div>
    </section>
  );
}