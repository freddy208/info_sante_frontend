/* eslint-disable react-hooks/set-state-in-effect */
 "use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PublicOrganization } from "@/types/public";

// Fix icône Leaflet
const createCustomIcon = () => {
  return L.divIcon({
    html: `<div style="background-color: #EF5350; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/></svg>
           </div>`,
    className: "custom-marker",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
};

// ==========================================
// COMPOSANT DE CONTRÔLE : AJUSTEMENT DU ZOOM
// ==========================================
// Ce composant interne force la carte à ajuster sa vue pour montrer tous les marqueurs
function MapController({ organizations, userLocation }: { organizations: PublicOrganization[], userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    // S'il y a des organisations, on calcule les limites pour les inclure toutes
    if (organizations.length > 0) {
      const bounds = L.latLngBounds(
        organizations.map((org) => [org.latitude, org.longitude] as L.LatLngExpression)
      );
      
      // On étend les limites pour inclure l'utilisateur s'il est là
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }

      // On ajuste la carte avec un peu de marge (padding) pour ne pas coller aux bords
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 }); 
    } 
    // Sinon, on centre sur l'utilisateur
    else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [organizations, userLocation, map]);

  return null;
}

interface MapRendererProps {
  organizations: PublicOrganization[];
  userLocation: { lat: number; lng: number } | null;
  defaultCenter: [number, number]; // <--- Ajouter cette prop
}

export default function MapRenderer({ organizations, userLocation, defaultCenter }: MapRendererProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Squelette de chargement interne
  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 animate-pulse">
        <div className="h-8 w-8 bg-slate-300 rounded-full mb-2"></div>
        <div className="h-2 w-20 bg-slate-300 rounded"></div>
      </div>
    );
  }

  const center: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter; 

  return (
    <MapContainer 
      center={center} 
      zoom={userLocation ? 13 : 6} 
      className="h-full w-full z-0"
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Injection du contrôleur de vue */}
      <MapController organizations={organizations} userLocation={userLocation} />
      
      {/* Marqueurs des organisations */}
      {organizations.map((org) => (
        <Marker 
          key={org.id} 
          position={[org.latitude, org.longitude]}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="font-sans text-sm p-1 min-w-[150px]">
              <h3 className="font-bold text-gray-900 mb-1">{org.name}</h3>
              <p className="text-gray-600 text-xs">{org.type.replace('_', ' ')}</p>
              {org.distance && (
                <div className="mt-2 p-1 bg-blue-50 rounded text-blue-700 text-xs font-semibold text-center">
                  {org.distance.toFixed(1)} km
                </div>
              )}
              <p className="text-gray-600 text-xs mt-1">📞 {org.phone}</p>
              <button className="mt-3 w-full bg-blue-600 text-white text-xs py-1.5 rounded shadow-sm hover:bg-blue-700 transition-colors">
                Itinéraire
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Marqueur Utilisateur */}
      {userLocation && (
         <Marker position={[userLocation.lat, userLocation.lng]} opacity={0.8}>
            <Popup>Vous êtes ici</Popup>
         </Marker>
      )}
    </MapContainer>
  );
}