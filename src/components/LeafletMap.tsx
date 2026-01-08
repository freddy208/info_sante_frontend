/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ==========================================
// FIX DES ICONES (Bug classique Next.js)
// ==========================================
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// ==========================================
// TYPES
// ==========================================
interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  lat: number; // Utilisez "lat" comme dans MapSection
  lng: number; // Utilisez "lng" comme dans MapSection
  specialties: string[];
}

interface LeafletMapProps {
  hospitals: Hospital[];
}

// ==========================================
// SOUS-COMPOSANT : Centrage automatique
// ==========================================
// Ce composant s'assure que la carte se centre automatiquement sur les hôpitaux
function MapUpdater({ hospitals }: { hospitals: Hospital[] }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (hospitals.length > 0) {
      const bounds = L.latLngBounds(hospitals.map(h => [h.lat, h.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [hospitals, map]);

  return null;
}

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function LeafletMap({ hospitals }: LeafletMapProps) {
  
  // Centre par défaut si pas de données
  const defaultCenter: [number, number] = [3.8480, 11.5021];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className="w-full h-full z-0 rounded-lg"
      // zoomControl={{ position: 'topright' }}
    >
      {/* Fond de carte */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mise à jour automatique du centre de la carte */}
      <MapUpdater hospitals={hospitals} />

      {/* 
        ✅ BOUCLE DÉCLARATIVE DES MARQUEURS
        React va automatiquement créer/retirer/mettre à jour ces marqueurs
        dès que la liste 'hospitals' change.
      */}
      {hospitals.map((hospital) => (
        <Marker 
          key={hospital.id} // L'ID est crucial pour React
          position={[hospital.lat, hospital.lng]}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-1">{hospital.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{hospital.address}, {hospital.city}</p>
              {hospital.phone && (
                <p className="text-sm text-gray-600 mb-1">{hospital.phone}</p>
              )}
              
              {/* Spécialités */}
              <div className="flex flex-wrap gap-1 mt-2">
                {hospital.specialties.length > 0 ? (
                  hospital.specialties.map(s => (
                    <span key={s} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{s}</span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">Aucune spécialité</span>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <a href={`/hopitaux/${hospital.id}`} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Voir détails →
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}