/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Target, X } from 'lucide-react';
import Image from 'next/image';
import { getCloudinaryThumbnailUrl } from '@/lib/cloudinary';
import { Organization, OrganizationType } from '@/types/organization';

interface MapViewProps {
  hospitals: Organization[];
  userLocation: {lat: number, lng: number} | null;
  selectedHospital: Organization | null;
  setSelectedHospital: React.Dispatch<React.SetStateAction<Organization | null>>;
  getDirections: (hospital: Organization) => void;
  navigateToDetails: (id: string) => void;
  getTypeLabel: (type: OrganizationType) => string;
  getMarkerColor: (type: OrganizationType) => string;
}

const MapView: React.FC<MapViewProps> = ({ 
  hospitals, 
  userLocation, 
  selectedHospital, 
  setSelectedHospital, 
  getDirections, 
  navigateToDetails,
  getTypeLabel,
  getMarkerColor
}) => {
  const [showMapDrawer, setShowMapDrawer] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // ✅ CORRECTION : On déplace l'assignation window au début de l'effet pour s'assurer qu'elle est prête quand les marqueurs sont créés
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).navigateToDetails = (id: string) => {
        navigateToDetails(id);
      };
      (window as any).getDirections = (id: string) => {
        const hospital = hospitals.find(h => h.id === id);
        if (hospital) getDirections(hospital);
      };
    }
  }, [hospitals, navigateToDetails, getDirections]); // Dépendances correctes

  const createCustomIcon = (type: OrganizationType, isSelected: boolean) => {
    const color = getMarkerColor(type);
    const size = isSelected ? 40 : 32;
    
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ${isSelected ? 'animation: pulse 2s infinite;' : ''}
          "></div>
          <svg width="${size * 0.6}" height="${size * 0.6}" fill="white" viewBox="0 0 20 20" style="position: relative; z-index: 1;">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          ${isSelected ? '<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 3px solid white; animation: ping 1s infinite;"></div>' : ''}
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
          }
        </style>
      `,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size/2, size], 
      popupAnchor: [0, -size/2]
    });
  };

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [4.0483, 9.7043], 
      zoom: 7,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    const validHospitals = hospitals.filter(h => h.latitude && h.longitude);

    validHospitals.forEach(hospital => {
      const isSelected = selectedHospital?.id === hospital.id;
      
      const marker = L.marker(
        [hospital.latitude!, hospital.longitude!],
        { icon: createCustomIcon(hospital.type, isSelected) }
      ).addTo(mapInstanceRef.current!);

      const popupContent = `
        <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <img src="${getCloudinaryThumbnailUrl(hospital.logo!, 60)}" 
                 style="width: 50px; height: 50px; border-radius: 8px; margin-right: 12px; object-fit: cover;"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=50'">
            <div>
              <h3 style="margin: 0; font-weight: bold; font-size: 16px;">${hospital.name}</h3>
              <div style="display: flex; align-items: center; margin-top: 4px;">
                <span style="background: #FEF3C7; color: #92400E; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                  ⭐ ${hospital.totalReviews} avis
                </span>
                <span style="margin-left: 8px; color: #6B7280; font-size: 14px;">
                  ${getTypeLabel(hospital.type)}
                </span>
              </div>
            </div>
          </div>
          ${hospital.emergencyAvailable ? '<div style="background: #FEE2E2; color: #991B1B; padding: 4px 8px; border-radius: 6px; font-size: 12px; margin-bottom: 8px;">🚨 Urgences 24/7</div>' : ''}
          <div style="display: flex; gap: 8px;">
            <button onclick="window.navigateToDetails('${hospital.id}')" 
                    style="flex: 1; padding: 8px; background: #F3F4F6; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              👁️ Voir profil
            </button>
            <button onclick="window.getDirections('${hospital.id}')" 
                    style="flex: 1; padding: 8px; background: #3B82F6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              🧭 Itinéraire
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      marker.on('click', () => {
        setSelectedHospital(hospital);
      });

      markersRef.current.push(marker);
    });

    if (validHospitals.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

    if (userLocation) {
      const userMarker = L.marker(
        [userLocation.lat, userLocation.lng],
        {
          icon: L.divIcon({
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background-color: #3B82F6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
            `,
            className: 'user-location-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })
        }
      ).addTo(mapInstanceRef.current);
      
      markersRef.current.push(userMarker);
    }
  }, [hospitals, selectedHospital, userLocation, getTypeLabel, getMarkerColor, navigateToDetails]); // Dépendance ajoutée

  return (
    <div className="relative h-80 sm:h-96 lg:h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      
      {userLocation && (
        <button 
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 12);
            }
          }}
          className="absolute top-4 right-4 z-1000 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 transform hover:scale-110"
        >
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </button>
      )}
      
      <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg rounded-t-2xl shadow-2xl z-1000 transition-transform duration-300 ${showMapDrawer ? 'translate-y-0' : 'translate-y-[calc(100%-70px)]'}`}>
        <button 
          onClick={() => setShowMapDrawer(!showMapDrawer)}
          className="w-full py-4 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <div className="w-14 h-1.5 bg-linear-to-r from-blue-400 to-indigo-500 rounded-full"></div>
        </button>
        
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              {hospitals.length} hôpitaux
            </h3>
            {showMapDrawer && (
              <button 
                onClick={() => setShowMapDrawer(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {showMapDrawer && (
            <div className="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
              {hospitals.map(hospital => {
                const isSelected = selectedHospital?.id === hospital.id;
                const hospitalLogo = hospital.logo 
                  ? getCloudinaryThumbnailUrl(hospital.logo, 56)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=56`;
                
                return (
                  <div 
                    key={hospital.id}
                    // ✅ CORRECTION : Wrapper clickable (cursor-pointer) pour le Drawer
                    className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      isSelected ? 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md' : 'bg-gray-50 hover:bg-gray-100'
                    }"
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setShowMapDrawer(false);
                      if (mapInstanceRef.current && hospital.latitude && hospital.longitude) {
                        mapInstanceRef.current.setView([hospital.latitude, hospital.longitude], 14);
                      }
                      // ✅ AJOUT : Navigation vers les détails quand on clique sur la carte du drawer
                      navigateToDetails(hospital.id);
                    }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden mr-3 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner relative">
                      <Image 
                        src={hospitalLogo}
                        alt={hospital.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-xl"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate text-sm sm:text-base">{hospital.name}</h4>
                      <div className="flex items-center flex-wrap gap-2 mt-1">
                        <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="ml-1 text-xs font-medium text-yellow-700">{hospital.totalReviews} avis</span>
                        </div>
                        {userLocation && hospital.latitude && hospital.longitude && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {Math.round(
                              Math.sqrt(
                                Math.pow(hospital.latitude - userLocation.lat, 2) + 
                                Math.pow(hospital.longitude - userLocation.lng, 2)
                              ) * 111
                            )} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;