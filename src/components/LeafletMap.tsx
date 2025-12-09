/* eslint-disable @typescript-eslint/no-explicit-any */
// Créez un fichier : /components/LeafletMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Correction pour les icônes de marqueur par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  latitude: number;
  longitude: number;
  specialties: string[];
}

interface LeafletMapProps {
  hospitals: Hospital[];
}

export default function LeafletMap({ hospitals }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Ne charger la carte que côté client
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Initialiser la carte
      mapInstanceRef.current = L.map(mapRef.current).setView([3.8480, 11.5021], 6);
      
      // Ajouter la couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Ajouter des marqueurs pour chaque hôpital
      hospitals.forEach(hospital => {
        if (hospital.latitude && hospital.longitude) {
          const marker = L.marker([hospital.latitude, hospital.longitude]).addTo(mapInstanceRef.current!);
          
          // Créer le contenu de la popup
          const popupContent = `
            <div class="p-2" style="min-width: 200px;">
              <h3 class="font-bold text-lg mb-1">${hospital.name}</h3>
              <p class="text-sm text-gray-600 mb-1">${hospital.address}, ${hospital.city}</p>
              <p class="text-sm text-gray-600 mb-1">${hospital.phone}</p>
              <div class="flex flex-wrap gap-1 mt-2">
                ${hospital.specialties.map(s => `<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">${s}</span>`).join('')}
              </div>
              <div class="mt-2">
                <a href="/hopitaux/${hospital.id}" class="text-teal-600 hover:text-teal-700 text-sm font-medium">Voir détails</a>
              </div>
            </div>
          `;
          
          marker.bindPopup(popupContent);
        }
      });
    }
    
    // Nettoyage lors du démontage
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hospitals]);

  return <div ref={mapRef} className="w-full h-full"></div>;
}