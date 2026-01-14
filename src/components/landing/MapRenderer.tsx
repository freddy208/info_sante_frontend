/* eslint-disable react-hooks/set-state-in-effect */
 
"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-cluster"; // ✅ IMPORT CLUSTERING
import { PublicOrganization } from "@/types/public";

// Fix icône Leaflet (Inchangé)
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

// Composant de contrôle inchangé
function MapController({ organizations, userLocation }: { organizations: PublicOrganization[], userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (organizations.length > 0) {
      const bounds = L.latLngBounds(
        organizations.map((org) => [org.latitude, org.longitude] as L.LatLngExpression)
      );
      
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 }); 
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [organizations, userLocation, map]);

  return null;
}

interface MapRendererProps {
  organizations: PublicOrganization[];
  userLocation: { lat: number; lng: number } | null;
  defaultCenter: [number, number];
}

export default function MapRenderer({ organizations, userLocation, defaultCenter }: MapRendererProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Hook appelé **toujours**, même si on retourne un skeleton
  const icons = useMemo(() => {
    return organizations.map(org => ({
      id: org.id,
      icon: createCustomIcon(),
      position: [org.latitude, org.longitude] as [number, number],
    }));
  }, [organizations]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      
      {/* ✅ IMPLEMENTATION DU CLUSTERING */}
      <MarkerClusterGroup
        chunkedLoading
        // Options de style pour les clusters (groupes)
        iconCreateFunction={(cluster) => {
          // Icône personnalisée pour le groupe de marqueurs
          const count = cluster.getChildCount();
          let size = 40;
          if (count > 10) size = 50;
          if (count > 50) size = 60;

          return L.divIcon({
            html: `<div style="background-color: #3b82f6; color: white; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">
                     ${count}
                   </div>`,
            className: "custom-cluster-icon",
            iconSize: [size, size],
          });
        }}
      >
        {icons.map(({ id, icon, position }) => {
  const org = organizations.find((o) => o.id === id);
  if (!org) return null;

  return (
    <Marker key={id} position={position} icon={icon}>
      <Popup>
        <div className="font-sans text-sm p-2 min-w-[180px] flex flex-col gap-1">
          <h3 className="font-bold text-gray-900">{org.name}</h3>
          <p className="text-gray-500 text-xs">{org.type}</p>
          {org.phone && <p className="text-gray-500 text-xs">📞 {org.phone}</p>}
          {org.distance && <p className="text-gray-500 text-xs">📍 {org.distance.toFixed(2)} km</p>}

          <button
            onClick={() => window.location.href = `/hopitals/${org.id}`}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
          >
            Voir détails
          </button>
        </div>
      </Popup>
    </Marker>
  );
})}

      </MarkerClusterGroup>

      {/* Marqueur Utilisateur (Hors du cluster pour rester visible) */}
      {userLocation && (
         <Marker position={[userLocation.lat, userLocation.lng]} opacity={0.8}>
            <Popup>Vous êtes ici</Popup>
         </Marker>
      )}
    </MapContainer>
  );
}