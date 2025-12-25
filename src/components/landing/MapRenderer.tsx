/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockHospitals } from "@/lib/mockData";

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

export default function MapRenderer() {
  // État pour s'assurer que le composant est bien monté dans le DOM
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tant que ce n'est pas monté, on affiche un squelette (Loading)
  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[4.0, 11.5]} 
      zoom={6} 
      className="h-full w-full z-0"
      scrollWheelZoom={false}
      zoomControl={false} // On désactive le contrôle de zoom par défaut pour éviter le bug d'affichage
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mockHospitals.map((hospital) => (
        <Marker 
          key={hospital.id} 
          position={[hospital.lat, hospital.lng]}
          icon={createCustomIcon()}
        >
          <Popup>
            <div className="font-sans text-sm p-1">
              <h3 className="font-bold text-gray-900">{hospital.name}</h3>
              <p className="text-gray-600 text-xs mt-1">{hospital.type}</p>
              <p className="text-gray-600 text-xs mt-1">📞 {hospital.phone}</p>
              <button className="mt-2 w-full bg-primary text-white text-xs py-1.5 rounded shadow-sm hover:bg-(--primary-dark) transition-colors">
                Itinéraire
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}