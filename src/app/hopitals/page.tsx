/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { MapPin, Phone, Star, Clock, Filter, Search, X, ChevronDown, Grid3x3, List, Heart, Navigation, Plus, Minus, Target, Shield, CheckCircle, Users, Calendar, Activity, TrendingUp, Award, ChevronUp } from 'lucide-react';
import { getCloudinaryThumbnailUrl } from '@/lib/cloudinary';

// Types pour les données
enum OrganizationType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CLINIC = 'CLINIC',
  HEALTH_CENTER = 'HEALTH_CENTER',
  NGO = 'NGO',
  HEALTH_DISTRICT = 'HEALTH_DISTRICT'
}

interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  logo: string;
  type: OrganizationType;
  specialties: string[];
  website: string | null;
  isActive: boolean;
  isVerified: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  totalReviews: number;
  registrationNumber: string;
  emergencyAvailable: boolean;
  insuranceAccepted: string[];
  openingHours: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Données mock
const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'Hôpital Central de Yaoundé',
    email: 'info@hcy.cm',
    phone: '+237 222 23 14 52',
    address: 'Avenue Charles Atangana',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'hcy-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Cardiologie', 'Pédiatrie', 'Gynécologie', 'Urgences 24/7'],
    website: 'https://www.hcy.cm',
    isActive: true,
    isVerified: true,
    latitude: 3.8480,
    longitude: 11.5021,
    rating: 4.2,
    totalReviews: 156,
    registrationNumber: 'HCY-2020-001',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA'],
    openingHours: '24/7',
    description: 'Hôpital de référence pour les maladies cardiaques et pédiatriques',
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2023-08-10')
  },
  {
    id: '2',
    name: 'Hôpital Laquintinie de Douala',
    email: 'contact@laquintinie.cm',
    phone: '+237 233 42 11 31',
    address: 'Boulevard de la Liberté',
    city: 'Douala',
    region: 'Littoral',
    country: 'Cameroun',
    logo: 'laquintinie-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Chirurgie', 'Ophtalmologie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 4.0483,
    longitude: 9.7043,
    rating: 4.0,
    totalReviews: 142,
    registrationNumber: 'HLQ-2019-002',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz'],
    openingHours: '24/7',
    description: 'Spécialisé en chirurgie et ophtalmologie',
    createdAt: new Date('2019-05-20'),
    updatedAt: new Date('2023-07-22')
  },
  {
    id: '3',
    name: 'Hôpital Général de Douala',
    email: 'info@hgd.cm',
    phone: '+237 233 42 20 11',
    address: 'Rue Joss',
    city: 'Douala',
    region: 'Littoral',
    country: 'Cameroun',
    logo: 'hgd-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Médecine Interne', 'Pédiatrie', 'Urgences 24/7'],
    website: 'https://www.hgd.cm',
    isActive: true,
    isVerified: true,
    latitude: 4.0511,
    longitude: 9.7679,
    rating: 3.8,
    totalReviews: 128,
    registrationNumber: 'HGD-2018-003',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS'],
    openingHours: '24/7',
    description: 'Hôpital général avec services de médecine interne et pédiatrie',
    createdAt: new Date('2018-11-10'),
    updatedAt: new Date('2023-08-05')
  },
  {
    id: '4',
    name: 'Hôpital Jamot de Yaoundé',
    email: 'contact@hopital-jamot.cm',
    phone: '+237 222 23 16 01',
    address: 'Rue Mballa II',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'hopital-jamot-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Pneumologie', 'Cardiologie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 3.8660,
    longitude: 11.5185,
    rating: 4.1,
    totalReviews: 167,
    registrationNumber: 'HJY-2021-004',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA'],
    openingHours: '24/7',
    description: 'Spécialisé en pneumologie et cardiologie',
    createdAt: new Date('2021-02-18'),
    updatedAt: new Date('2023-08-15')
  },
  {
    id: '5',
    name: 'Centre Hospitalier et Universitaire (CHU) de Yaoundé',
    email: 'info@chu-yaounde.cm',
    phone: '+237 222 23 40 14',
    address: 'Campus de l\'Université de Yaoundé I',
    city: 'Yaoundé',
    region: 'Centre',
    country: 'Cameroun',
    logo: 'chu-yaounde-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Toutes spécialités', 'Urgences 24/7', 'Formation médicale'],
    website: 'https://www.chu-yaounde.cm',
    isActive: true,
    isVerified: true,
    latitude: 3.8265,
    longitude: 11.4998,
    rating: 4.3,
    totalReviews: 189,
    registrationNumber: 'CHUY-2017-005',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Allianz', 'AXA', 'Mutuelle des fonctionnaires'],
    openingHours: '24/7',
    description: 'Centre hospitalier universitaire avec toutes les spécialités',
    createdAt: new Date('2017-09-05'),
    updatedAt: new Date('2023-08-20')
  },
  {
    id: '6',
    name: 'Hôpital Régional de Bafoussam',
    email: 'info@hr-bafoussam.cm',
    phone: '+237 233 33 12 45',
    address: 'Avenue des Chutes',
    city: 'Bafoussam',
    region: 'Ouest',
    country: 'Cameroun',
    logo: 'hr-bafoussam-logo.png',
    type: OrganizationType.PUBLIC,
    specialties: ['Médecine Générale', 'Pédiatrie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 5.4769,
    longitude: 10.4182,
    rating: 3.7,
    totalReviews: 98,
    registrationNumber: 'HRB-2019-006',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS'],
    openingHours: '24/7',
    description: 'Hôpital régional desservant la région de l\'Ouest',
    createdAt: new Date('2019-07-30'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: '7',
    name: 'Hôpital Ad Lucem de Mbouda',
    email: 'contact@adlucem-mbouda.cm',
    phone: '+237 233 33 56 78',
    address: 'Quartier Chefferie',
    city: 'Mbouda',
    region: 'Ouest',
    country: 'Cameroun',
    logo: 'adlucem-logo.png',
    type: OrganizationType.PRIVATE,
    specialties: ['Chirurgie', 'Gynécologie', 'Urgences'],
    website: 'https://www.adlucem-mbouda.cm',
    isActive: true,
    isVerified: false,
    latitude: 5.6363,
    longitude: 10.2548,
    rating: 3.9,
    totalReviews: 76,
    registrationNumber: 'HALM-2020-007',
    emergencyAvailable: false,
    insuranceAccepted: ['Allianz', 'AXA'],
    openingHours: '08:00 - 18:00',
    description: 'Hôpital privé spécialisé en chirurgie et gynécologie',
    createdAt: new Date('2020-03-12'),
    updatedAt: new Date('2023-06-25')
  },
  {
    id: '8',
    name: 'Hôpital Protestant de Ngaoundéré',
    email: 'info@hpn-gaoundere.cm',
    phone: '+237 222 62 12 34',
    address: 'Quartier Djalingo',
    city: 'Ngaoundéré',
    region: 'Adamaoua',
    country: 'Cameroun',
    logo: 'hpn-logo.png',
    type: OrganizationType.PRIVATE,
    specialties: ['Médecine Interne', 'Pédiatrie', 'Urgences 24/7'],
    website: null,
    isActive: true,
    isVerified: true,
    latitude: 7.3158,
    longitude: 13.5785,
    rating: 3.6,
    totalReviews: 84,
    registrationNumber: 'HPN-2021-008',
    emergencyAvailable: true,
    insuranceAccepted: ['CNPS', 'Mutuelle des fonctionnaires'],
    openingHours: '24/7',
    description: 'Hôpital protestant avec services de médecine interne et pédiatrie',
    createdAt: new Date('2021-10-08'),
    updatedAt: new Date('2023-08-01')
  }
];

// --- COMPOSANTS SUR MESURE ---

// Composant Dropdown personnalisé et moderne
interface CustomDropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: { value: string | number; label: string; count?: number }[];
  placeholder?: string;
  icon?: React.ReactNode;
}
const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center">
          {icon && <span className="mr-2 text-gray-400">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors duration-150 ${
                value === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              <span>{option.label}</span>
              {option.count !== undefined && <span className="text-xs text-gray-400">({option.count})</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Filtre Dépliable
const FilterPanel: React.FC<{
  activeFilters: any;
  setActiveFilters: React.Dispatch<React.SetStateAction<any>>;
  allCities: string[];
  allTypes: OrganizationType[];
  allSpecialties: string[];
  mockHospitals: Hospital[];
  getTypeLabel: (type: OrganizationType) => string;
  resetFilters: () => void;
  filteredCount: number;
}> = ({ activeFilters, setActiveFilters, allCities, allTypes, allSpecialties, mockHospitals, getTypeLabel, resetFilters, filteredCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (filterType: string, value: string) => {
    setActiveFilters((prev: { [x: string]: string[]; }) => {
      const currentValues = prev[filterType] as string[];
      if (currentValues.includes(value)) {
        return { ...prev, [filterType]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [filterType]: [...currentValues, value] };
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <h3 className="font-semibold text-gray-900">Filtres avancés</h3>
        <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6 border-t border-gray-100">
          {/* Filtre par Ville */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Ville</h4>
            <div className="flex flex-wrap gap-2">
              {allCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleFilter('cities', city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilters.cities.includes(city)
                      ? 'bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Filtre par Spécialité */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Spécialités</h4>
            <div className="columns-2 gap-2">
              {allSpecialties.slice(0, 10).map(specialty => (
                <label key={specialty} className="flex items-center p-2 space-x-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeFilters.specialties.includes(specialty)}
                    onChange={() => toggleFilter('specialties', specialty)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Filtre par Services */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Services</h4>
            <label className="flex items-center p-2 space-x-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.services.includes('Urgences 24/7')}
                onChange={() => toggleFilter('services', 'Urgences 24/7')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Urgences 24/7</span>
            </label>
          </div>

          {/* Filtre par Note */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Note minimale</h4>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setActiveFilters((prev: any) => ({ ...prev, minRating: star }))}
                  className="p-1"
                >
                  <Star className={`w-6 h-6 transition-colors duration-200 ${
                    star <= activeFilters.minRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Carte
const MapView: React.FC<{
  hospitals: Hospital[];
  userLocation: {lat: number, lng: number} | null;
  selectedHospital: Hospital | null;
  setSelectedHospital: (hospital: Hospital | null) => void;
  getDirections: (hospital: Hospital) => void;
  navigateToHospitalDetails: (id: string) => void;
  getTypeLabel: (type: OrganizationType) => string;
  getMarkerColor: (type: OrganizationType) => string;
}> = ({ 
  hospitals, 
  userLocation, 
  selectedHospital, 
  setSelectedHospital, 
  getDirections, 
  navigateToHospitalDetails,
  getTypeLabel,
  getMarkerColor
}) => {
  const [mapBounds, setMapBounds] = useState({ minLat: 2, maxLat: 14, minLng: 8, maxLng: 16 });
  const [showMapDrawer, setShowMapDrawer] = useState(false);

  // Calculer les limites de la carte en fonction des hôpitaux
  useEffect(() => {
    if (hospitals.length > 0) {
      const lats = hospitals.map(h => h.latitude);
      const lngs = hospitals.map(h => h.longitude);
      const minLat = Math.min(...lats) - 0.5;
      const maxLat = Math.max(...lats) + 0.5;
      const minLng = Math.min(...lngs) - 0.5;
      const maxLng = Math.max(...lngs) + 0.5;
      setMapBounds({ minLat, maxLat, minLng, maxLng });
    }
  }, [hospitals]);

  return (
    <div className="relative h-96 lg:h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Carte OpenStreetMap avec iframe */}
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.minLng},${mapBounds.minLat},${mapBounds.maxLng},${mapBounds.maxLat}&layer=mapnik`}
        style={{ border: 0 }}
        allowFullScreen
        title="Carte des hôpitaux"
      />
      
      {/* Marqueurs personnalisés */}
      {hospitals.map(hospital => {
        const isSelected = selectedHospital?.id === hospital.id;
        const markerColor = getMarkerColor(hospital.type);
        
        // Calculer la position relative sur la carte
        const left = ((hospital.longitude - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
        const top = ((mapBounds.maxLat - hospital.latitude) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
        
        return (
          <div
            key={hospital.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <button
              onClick={() => setSelectedHospital(hospital)}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-200 ${
                isSelected ? 'ring-4 ring-white scale-125' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: markerColor }}
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        );
      })}
      
      {/* Contrôles de la carte */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        {userLocation && (
          <button 
            onClick={() => {
              // Centrer la carte sur la position de l'utilisateur
              // Ceci est une simulation, dans une vraie application, vous utiliseriez l'API de la carte
              alert(`Centrage sur votre position: ${userLocation.lat}, ${userLocation.lng}`);
            }}
            className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Target className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
      
      {/* Popup pour l'hôpital sélectionné */}
      {selectedHospital && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                <img 
                  src={getCloudinaryThumbnailUrl(selectedHospital.logo, 48)} 
                  alt={selectedHospital.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedHospital.name)}&background=e0e7ff&color=4f46e5&size=48`;
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedHospital.name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium">{selectedHospital.rating}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedHospital(null)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              selectedHospital.type === OrganizationType.PUBLIC ? 'bg-blue-100 text-blue-800' : 
              selectedHospital.type === OrganizationType.PRIVATE ? 'bg-purple-100 text-purple-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {getTypeLabel(selectedHospital.type)}
            </span>
            {userLocation && (
              <span className="ml-2 text-sm text-gray-600">
                {Math.round(
                  Math.sqrt(
                    Math.pow(selectedHospital.latitude - userLocation.lat, 2) + 
                    Math.pow(selectedHospital.longitude - userLocation.lng, 2)
                  ) * 111
                )} km
              </span>
            )}
          </div>
          
          {selectedHospital.emergencyAvailable && (
            <div className="flex items-center mb-3 text-sm text-gray-600">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Urgences 24/7
              </span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                navigateToHospitalDetails(selectedHospital.id);
                setSelectedHospital(null);
              }}
              className="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Voir profil
            </button>
            <button 
              onClick={() => {
                getDirections(selectedHospital);
                setSelectedHospital(null);
              }}
              className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              Itinéraire
            </button>
          </div>
        </div>
      )}
      
      {/* Liste inférieure (drawer) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-20 transition-transform duration-300 ${showMapDrawer ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'}`}>
        <button 
          onClick={() => setShowMapDrawer(!showMapDrawer)}
          className="w-full py-3 flex items-center justify-center"
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </button>
        
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              {hospitals.length} hôpitaux
            </h3>
            {showMapDrawer && (
              <button 
                onClick={() => setShowMapDrawer(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          
          {showMapDrawer && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {hospitals.map(hospital => {
                const isSelected = selectedHospital?.id === hospital.id;
                
                return (
                  <div 
                    key={hospital.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedHospital(hospital);
                      setShowMapDrawer(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={getCloudinaryThumbnailUrl(hospital.logo, 48)} 
                        alt={hospital.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=48`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{hospital.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="ml-1 text-xs">{hospital.rating}</span>
                        {userLocation && (
                          <span className="ml-2 text-xs text-gray-500">
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

// Composant principal
const HospitalsListPage: React.FC = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeFilters, setActiveFilters] = useState<{ cities: string[]; types: string[]; specialties: string[]; services: string[]; distance: number; minRating: number; }>({
    cities: [], types: [], specialties: [], services: [], distance: 100, // Augmenté à 100km pour inclure plus d'hôpitaux
    minRating: 0
  });
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showMapDrawer, setShowMapDrawer] = useState(false);
  const [displayCount, setDisplayCount] = useState(8); // Augmenté à 8 pour afficher plus d'hôpitaux
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAllHospitals, setShowAllHospitals] = useState(false); // Nouvel état pour afficher tous les hôpitaux

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: 4.0483, lng: 9.7043 })
      );
    } else {
      setUserLocation({ lat: 4.0483, lng: 9.7043 });
    }
  }, [mounted]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredAndSortedHospitals = useMemo(() => {
    let filtered = [...mockHospitals];
    
    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(hospital => 
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        hospital.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) || 
        hospital.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtrer par ville
    if (activeFilters.cities.length > 0) {
      filtered = filtered.filter(hospital => activeFilters.cities.includes(hospital.city));
    }
    
    // Filtrer par type
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(hospital => activeFilters.types.includes(hospital.type));
    }
    
    // Filtrer par spécialités
    if (activeFilters.specialties.length > 0) {
      filtered = filtered.filter(hospital => 
        activeFilters.specialties.some(spec => hospital.specialties.includes(spec))
      );
    }
    
    // Filtrer par services
    if (activeFilters.services.length > 0) {
      filtered = filtered.filter(hospital => {
        if (activeFilters.services.includes('Urgences 24/7') && !hospital.emergencyAvailable) {
          return false;
        }
        return true;
      });
    }
    
    // Filtrer par distance (uniquement si la position de l'utilisateur est disponible et si showAllHospitals est false)
    if (userLocation && !showAllHospitals) {
      filtered = filtered.filter(hospital => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          hospital.latitude, 
          hospital.longitude
        );
        return distance <= activeFilters.distance;
      });
    }
    
    // Filtrer par note minimale
    if (activeFilters.minRating > 0) {
      filtered = filtered.filter(hospital => hospital.rating >= activeFilters.minRating);
    }

    // Trier
    filtered.sort((a, b) => {
      if (sortBy === 'distance' && userLocation) {
        const distanceA = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          a.latitude, 
          a.longitude
        );
        const distanceB = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          b.latitude, 
          b.longitude
        );
        return distanceA - distanceB;
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
    
    return filtered;
  }, [activeFilters, sortBy, userLocation, searchQuery, showAllHospitals]);

  const displayedHospitals = filteredAndSortedHospitals.slice(0, displayCount);
  const featuredHospitals = useMemo(() => [...mockHospitals].sort((a, b) => b.rating - a.rating).slice(0, 3), []);
  
  // Implémentation correcte des fonctions de type
  const getTypeLabel = (type: OrganizationType): string => {
    switch (type) {
      case OrganizationType.PUBLIC:
        return 'Hôpital Public';
      case OrganizationType.PRIVATE:
        return 'Hôpital Privé';
      case OrganizationType.CLINIC:
        return 'Clinique';
      case OrganizationType.HEALTH_CENTER:
        return 'Centre de Santé';
      case OrganizationType.NGO:
        return 'ONG Médicale';
      case OrganizationType.HEALTH_DISTRICT:
        return 'District de Santé';
      default:
        return 'Établissement';
    }
  };

  const getTypeColor = (type: OrganizationType): string => {
    switch (type) {
      case OrganizationType.PUBLIC:
        return 'bg-blue-100 text-blue-800';
      case OrganizationType.PRIVATE:
        return 'bg-purple-100 text-purple-800';
      case OrganizationType.CLINIC:
        return 'bg-green-100 text-green-800';
      case OrganizationType.HEALTH_CENTER:
        return 'bg-yellow-100 text-yellow-800';
      case OrganizationType.NGO:
        return 'bg-pink-100 text-pink-800';
      case OrganizationType.HEALTH_DISTRICT:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarkerColor = (type: OrganizationType): string => {
    switch (type) {
      case OrganizationType.PUBLIC:
        return '#3B82F6'; // Bleu
      case OrganizationType.PRIVATE:
        return '#8B5CF6'; // Violet
      case OrganizationType.CLINIC:
        return '#10B981'; // Vert
      case OrganizationType.HEALTH_CENTER:
        return '#F59E0B'; // Orange
      case OrganizationType.NGO:
        return '#EC4899'; // Rose
      case OrganizationType.HEALTH_DISTRICT:
        return '#6366F1'; // Indigo
      default:
        return '#6B7280'; // Gris
    }
  };

  const resetFilters = () => { 
    setActiveFilters({ cities: [], types: [], specialties: [], services: [], distance: 100, minRating: 0 }); 
    setSearchQuery(''); 
    setShowAllHospitals(false); // Réinitialiser aussi l'état showAllHospitals
  };
  
  // Implémentation correcte de activeFiltersCount
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += activeFilters.cities.length;
    count += activeFilters.types.length;
    count += activeFilters.specialties.length;
    count += activeFilters.services.length;
    if (activeFilters.distance !== 100) count += 1; // Changé de 20 à 100
    if (activeFilters.minRating > 0) count += 1;
    if (searchQuery) count += 1;
    if (showAllHospitals) count -= 1; // Ne pas compter showAllHospitals comme un filtre actif
    return count;
  }, [activeFilters, searchQuery, showAllHospitals]);
  
  const allCities = [...new Set(mockHospitals.map(h => h.city))];
  const allTypes = [...new Set(mockHospitals.map(h => h.type))];
  const allSpecialties = [...new Set(mockHospitals.flatMap(h => h.specialties))];
  const loadMoreHospitals = () => setDisplayCount(prev => prev + 5);
  const navigateToHospitalDetails = (id: string) => {
  // Stocke l'hôpital sélectionné
  sessionStorage.setItem('selectedHospital', JSON.stringify(mockHospitals.find(h => h.id === id)));
  router.push('/hopitals/details');
};
  const callHospital = (phone: string) => window.open(`tel:${phone}`);
  const getDirections = (hospital: Hospital) => {
    if (typeof window !== 'undefined') {
      if (userLocation) {
        window.open(
          `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.latitude},${hospital.longitude}`,
          '_blank'
        );
      } else {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`,
          '_blank'
        );
      }
    }
  };
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      <Head>
        <title>Liste des Hôpitaux - Santé Cameroun</title>
        <meta name="description" content="Trouvez un hôpital près de vous au Cameroun" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Hôpitaux</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barre de recherche et filtres principaux */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un hôpital, une spécialité, une ville..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <CustomDropdown
              value={activeFilters.cities[0] || ''}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, cities: val ? [val as string] : [] }))}
              options={[{ value: '', label: 'Toutes les villes' }, ...allCities.map(c => ({ value: c, label: c }))]}
              placeholder="Ville"
              icon={<MapPin className="w-4 h-4" />}
            />
            <CustomDropdown
              value={activeFilters.types[0] || ''}
              onChange={(val) => setActiveFilters(prev => ({ ...prev, types: val ? [val as string] : [] }))}
              options={[{ value: '', label: 'Tous les types' }, ...allTypes.map(t => ({ value: t, label: getTypeLabel(t as OrganizationType) }))]}
              placeholder="Type"
              icon={<Shield className="w-4 h-4" />}
            />
            <CustomDropdown
              value={activeFilters.distance}
              onChange={(val) => {
                setActiveFilters(prev => ({ ...prev, distance: val as number }));
                setShowAllHospitals(false); // Désactiver showAllHospitals lorsqu'un filtre de distance est appliqué
              }}
              options={[{ value: 5, label: 'Moins de 5 km' }, { value: 10, label: 'Moins de 10 km' }, { value: 20, label: 'Moins de 20 km' }, { value: 50, label: 'Moins de 50 km' }, { value: 100, label: 'Moins de 100 km' }]}
              placeholder="Distance"
              icon={<Target className="w-4 h-4" />}
            />
            <CustomDropdown
              value={sortBy}
              onChange={(val) => setSortBy(val as 'distance' | 'rating' | 'name')}
              options={[{ value: 'distance', label: 'Plus proche' }, { value: 'rating', label: 'Mieux noté' }, { value: 'name', label: 'Nom (A-Z)' }]}
              placeholder="Trier par"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('list')} 
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => setViewMode('map')} 
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === 'map' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Panneau de filtres avancés */}
        <FilterPanel
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          allCities={allCities}
          allTypes={allTypes}
          allSpecialties={allSpecialties}
          mockHospitals={mockHospitals}
          getTypeLabel={getTypeLabel}
          resetFilters={resetFilters}
          filteredCount={filteredAndSortedHospitals.length}
        />
        
        {/* En-tête des résultats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredAndSortedHospitals.length}</span> hôpitaux trouvés
            {filteredAndSortedHospitals.length < mockHospitals.length && (
              <span className="ml-2">
                sur <span className="font-semibold text-gray-900">{mockHospitals.length}</span> au total
              </span>
            )}
          </p>
          <div className="flex items-center space-x-2">
            {filteredAndSortedHospitals.length < mockHospitals.length && (
              <button 
                onClick={() => setShowAllHospitals(true)} 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Afficher tous les hôpitaux
              </button>
            )}
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Vue Liste */}
        {viewMode === 'list' && (
          <div className="space-y-6 pb-24">
            {displayedHospitals.length > 0 ? (
              displayedHospitals.map(hospital => {
                const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, hospital.latitude, hospital.longitude) : null;
                return (
                  <div key={hospital.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className="p-6 lg:flex lg:items-center lg:justify-between">
                      <div className="flex-0 lg:flex-1">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={getCloudinaryThumbnailUrl(hospital.logo, 100)} 
                            alt={hospital.name} 
                            className="w-20 h-20 rounded-xl object-cover bg-gray-100" 
                            onError={(e) => { 
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=100`; 
                            }} 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-bold text-gray-900 truncate">{hospital.name}</h3>
                              {hospital.isVerified && <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />}
                            </div>
                            <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 font-semibold text-gray-700">{hospital.rating}</span> 
                                <span className="ml-1">({hospital.totalReviews})</span>
                              </div>
                              {distance && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {distance.toFixed(1)} km
                                </div>
                              )}
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${getTypeColor(hospital.type)}`}>
                                {getTypeLabel(hospital.type)}
                              </span>
                              {hospital.emergencyAvailable && (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Urgences 24/7
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 lg:flex lg:items-center lg:space-x-3">
                        <button 
                          onClick={() => toggleFavorite(hospital.id)} 
                          className={`p-3 rounded-full transition-all duration-200 ${
                            favorites.includes(hospital.id) ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(hospital.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => callHospital(hospital.phone)} 
                          className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Appeler
                        </button>
                        <button 
                          onClick={() => navigateToHospitalDetails(hospital.id)} 
                          className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                        >
                          Voir profil
                        </button>
                        <button 
                          onClick={() => getDirections(hospital)} 
                          className="flex items-center justify-center px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Itinéraire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucun hôpital trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres.</p>
                <button onClick={resetFilters} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
            {displayedHospitals.length < filteredAndSortedHospitals.length && (
              <button onClick={loadMoreHospitals} className="w-full py-3 bg-white text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200">
                Charger plus d&apos;hôpitaux ({Math.min(5, filteredAndSortedHospitals.length - displayedHospitals.length)})
              </button>
            )}
          </div>
        )}

        {/* Vue Carte */}
        {viewMode === 'map' && (
          <MapView
            hospitals={filteredAndSortedHospitals}
            userLocation={userLocation}
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
            getDirections={getDirections}
            navigateToHospitalDetails={navigateToHospitalDetails}
            getTypeLabel={getTypeLabel}
            getMarkerColor={getMarkerColor}
          />
        )}
      </main>
    </div>
  );
};

export default HospitalsListPage;