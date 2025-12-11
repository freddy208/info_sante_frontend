/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { MapPin, Phone, Star, Clock, Filter, Search, X, ChevronDown, Grid3x3, List, Heart, Navigation, Plus, Minus, Target, Shield, CheckCircle, Users, Calendar, Activity, TrendingUp, Award, ChevronUp, Stethoscope, Eye, Globe, RefreshCw } from 'lucide-react';
import { getCloudinaryThumbnailUrl } from '@/lib/cloudinary';
import { Hospital, OrganizationType } from '@/types/organization';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';


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

/// --- COMPOSANTS SUR MESURE ---

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
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 backdrop-blur-sm"
      >
        <div className="flex items-center">
          {icon && <span className="mr-2 text-blue-500">{icon}</span>}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                value === option.value ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border-l-4 border-blue-500' : 'text-gray-700'
              }`}
            >
              <span>{option.label}</span>
              {option.count !== undefined && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">({option.count})</span>}
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
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900">Filtres avancés</h3>
        </div>
        <ChevronUp className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5 space-y-6 border-t border-gray-100">
          {/* Filtre par Ville */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              Ville
            </h4>
            <div className="flex flex-wrap gap-2">
              {allCities.map(city => (
                <button
                  key={city}
                  onClick={() => toggleFilter('cities', city)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeFilters.cities.includes(city)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
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
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2 text-blue-500" />
              Spécialités
            </h4>
            <div className="columns-1 sm:columns-2 gap-2">
              {allSpecialties.slice(0, 10).map(specialty => (
                <label key={specialty} className="flex items-center p-3 space-x-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={activeFilters.specialties.includes(specialty)}
                    onChange={() => toggleFilter('specialties', specialty)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{specialty}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Filtre par Services */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Services
            </h4>
            <label className="flex items-center p-3 space-x-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200">
              <input
                type="checkbox"
                checked={activeFilters.services.includes('Urgences 24/7')}
                onChange={() => toggleFilter('services', 'Urgences 24/7')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">Urgences 24/7</span>
            </label>
          </div>

          {/* Filtre par Note */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Note minimale
            </h4>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setActiveFilters((prev: any) => ({ ...prev, minRating: star }))}
                  className="p-1 transform transition-all duration-200 hover:scale-110"
                >
                  <Star className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-200 ${
                    star <= activeFilters.minRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
          
          {/* Bouton de réinitialisation */}
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={resetFilters}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Carte avec Leaflet
const MapView = dynamic(() => import('@/components/MapView'), { 
  ssr: false,
  loading: () => (
    <div className="relative h-80 sm:h-96 lg:h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement de la carte...</p>
        </div>
      </div>
    </div>
  )
});
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Head>
        <title>Liste des Hôpitaux - Santé Cameroun</title>
        <meta name="description" content="Trouvez un hôpital près de vous au Cameroun" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Liste des Hôpitaux - Santé Cameroun" />
        <meta property="og:description" content="Trouvez un hôpital près de vous au Cameroun" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Liste des Hôpitaux - Santé Cameroun" />
        <meta name="twitter:description" content="Trouvez un hôpital près de vous au Cameroun" />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2.5 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="ml-3 flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hôpitaux</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Barre de recherche et filtres principaux */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-5 sm:p-6 mb-6 space-y-5 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un hôpital, une spécialité, une ville..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'list' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => setViewMode('map')} 
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  viewMode === 'map' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
          <p className="text-gray-600 flex items-center">
            <span className="font-bold text-gray-900 text-lg mr-2">{filteredAndSortedHospitals.length}</span> 
            <span className="text-lg">hôpitaux trouvés</span>
            {filteredAndSortedHospitals.length < mockHospitals.length && (
              <span className="ml-2">
                sur <span className="font-bold text-gray-900 text-lg">{mockHospitals.length}</span> au total
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {filteredAndSortedHospitals.length < mockHospitals.length && (
              <button 
                onClick={() => setShowAllHospitals(true)} 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-all duration-200 transform hover:scale-105"
              >
                <Globe className="w-4 h-4 mr-1" />
                Afficher tous les hôpitaux
              </button>
            )}
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-all duration-200 transform hover:scale-105">
                <RefreshCw className="w-4 h-4 mr-1" />
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
                  <div key={hospital.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group transform hover:-translate-y-1">
                    <div className="p-5 sm:p-6 lg:flex lg:items-center lg:justify-between">
                      <div className="flex-0 lg:flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="relative">
                            <img 
                              src={getCloudinaryThumbnailUrl(hospital.logo, 100)} 
                              alt={hospital.name} 
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner" 
                              onError={(e) => { 
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hospital.name)}&background=e0e7ff&color=4f46e5&size=100`; 
                              }} 
                            />
                            {hospital.isVerified && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1.5 shadow-md">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{hospital.name}</h3>
                            </div>
                            <div className="flex flex-wrap items-center mt-2 space-x-4 text-sm text-gray-500">
                              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="ml-1 font-bold text-yellow-700">{hospital.rating}</span> 
                                <span className="ml-1 text-yellow-600">({hospital.totalReviews})</span>
                              </div>
                              {distance && (
                                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                  <span className="font-medium text-blue-700">{distance.toFixed(1)} km</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(hospital.type)}`}>
                                {getTypeLabel(hospital.type)}
                              </span>
                              {hospital.emergencyAvailable && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                  <Activity className="w-3 h-3 mr-1" />
                                  Urgences 24/7
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2 lg:flex-nowrap lg:items-center lg:space-x-3">
                        <button 
                          onClick={() => toggleFavorite(hospital.id)} 
                          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                            favorites.includes(hospital.id) ? 'bg-red-100 text-red-500 shadow-md' : 'bg-gray-100 text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(hospital.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => callHospital(hospital.phone)} 
                          className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Appeler</span>
                        </button>
                        <button 
                          onClick={() => navigateToHospitalDetails(hospital.id)} 
                          className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Voir profil</span>
                        </button>
                        <button 
                          onClick={() => getDirections(hospital)} 
                          className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Itinéraire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <MapPin className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun hôpital trouvé</h3>
                <p className="text-gray-500 mb-6">Essayez de modifier vos filtres.</p>
                <button onClick={resetFilters} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Réinitialiser les filtres
                </button>
              </div>
            )}
            {displayedHospitals.length < filteredAndSortedHospitals.length && (
              <button onClick={loadMoreHospitals} className="w-full py-4 bg-gradient-to-r from-white to-gray-50 text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                <ChevronDown className="w-5 h-5 mr-2" />
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