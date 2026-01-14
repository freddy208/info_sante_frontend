/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Activity, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { publicApi } from "@/lib/api";
import { PublicOrganization } from "@/types/public";
import { OrganizationType } from "@/types/organization";

// --- Composant MapRenderer dynamique (Leaflet) ---
const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 animate-pulse space-y-3">
      <MapPin className="w-8 h-8" />
      <span className="text-sm font-medium">Chargement de la carte...</span>
    </div>
  ),
});

// --- Config filtres ---
const FILTERS_CONFIG = [
  { id: OrganizationType.HOSPITAL_PUBLIC, label: "Hôpitaux Publics" },
  { id: OrganizationType.HOSPITAL_PRIVATE, label: "Hôpitaux Privés" },
  { id: OrganizationType.CLINIC, label: "Cliniques" },
  { id: OrganizationType.HEALTH_CENTER, label: "Centres de Santé" },
  { id: OrganizationType.DISPENSARY, label: "Dispensaires" },
  { id: OrganizationType.NGO, label: "ONG" },
];

export function GeoSection() {
  // --- États ---
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<OrganizationType[]>([]);

  const defaultCenter: [number, number] = [3.848, 11.5021]; // Yaoundé

  // --- REFS pour AbortController / fallback timer / debounce ---
  const abortControllerRef = useRef<AbortController | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // --- Fonction pour charger les organisations ---
  const loadNearbyHospitals = async (
    lat: number,
    lng: number,
    types?: OrganizationType[],
    retries = 2,
    delay = 500
  ) => {
    setLoadingLoc(true);

    // Annuler requête précédente
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const data = await publicApi.getNearbyOrganizations(
        { lat, lng, radius: 20, types, limit: 50 },
        abortControllerRef.current.signal
      );
      setOrganizations(data || []);
      setGeoError(null);
    } catch (error: any) {
      // Ignorer les annulations
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;

      console.error("Erreur chargement organisations", error);

      if (retries > 0 && error.response?.status === 429) {
        // Retry exponentiel
        setTimeout(() => {
          loadNearbyHospitals(lat, lng, types, retries - 1, delay * 2);
        }, delay);
      } else {
        setGeoError(
          error.response?.status === 429
            ? "Trop de requêtes. Veuillez patienter."
            : "Impossible de charger les organisations."
        );
        setOrganizations([]);
      }
    } finally {
      setLoadingLoc(false);
    }
  };

  // --- Localisation utilisateur ---
  const locateUser = () => {
    if (!navigator.geolocation) {
      setGeoError("Votre navigateur ne supporte pas la géolocalisation.");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        if (fallbackTimerRef.current) {
          clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }

        loadNearbyHospitals(latitude, longitude, activeFilters);
      },
      (error) => {
        console.warn("Géolocalisation échouée.", error);
        let msg = "Impossible de vous localiser.";
        if (error.code === error.PERMISSION_DENIED) msg = "Accès GPS refusé.";
        else if (error.code === error.POSITION_UNAVAILABLE) msg = "Position indisponible.";
        setGeoError(msg);
        setLoadingLoc(false);
      }
    );
  };

  // --- Toggle filtre avec debounce ---
  const toggleFilter = (type: OrganizationType) => {
    const newFilters = activeFilters.includes(type)
      ? activeFilters.filter((t) => t !== type)
      : [...activeFilters, type];

    setActiveFilters(newFilters);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const lat = userLocation?.lat || defaultCenter[0];
      const lng = userLocation?.lng || defaultCenter[1];
      loadNearbyHospitals(lat, lng, newFilters);
    }, 250);
  };

  const handleLocateMe = () => {
    setGeoError(null);
    setLoadingLoc(true);
    locateUser();
  };

  // --- Effet au montage ---
  useEffect(() => {
    locateUser();

    // Fallback timer 2s pour charger la position par défaut
    fallbackTimerRef.current = setTimeout(() => {
      if (!userLocation && organizations.length === 0) {
        loadNearbyHospitals(defaultCenter[0], defaultCenter[1], activeFilters);
      }
    }, 2000);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // --- Memoization des données pour MapRenderer ---
  const memoizedOrganizations = useMemo(() => organizations, [organizations]);

  return (
    <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
            >
              Trouver les soins <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-teal-500">
                autour de moi
              </span>
            </motion.h2>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
              Accès instantané à l&apos;annuaire complet. Hôpitaux, pharmacies et cliniques à proximité.
            </p>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <Activity className="w-4 h-4" />
              <span>{activeFilters.length} filtre(s) actif(s)</span>
              <button
                onClick={() => {
                  setActiveFilters([]);
                  const lat = userLocation?.lat || defaultCenter[0];
                  const lng = userLocation?.lng || defaultCenter[1];
                  loadNearbyHospitals(lat, lng, []);
                }}
                className="hover:text-blue-800 font-bold ml-1"
              >
                (Réinitialiser)
              </button>
            </div>
          )}
        </div>

        {/* Barre de filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={activeFilters.length === 0 ? "default" : "outline"}
            onClick={() => {
              setActiveFilters([]);
              const lat = userLocation?.lat || defaultCenter[0];
              const lng = userLocation?.lng || defaultCenter[1];
              loadNearbyHospitals(lat, lng, []);
            }}
            className="rounded-full text-sm h-9 px-4"
          >
            Tout voir
          </Button>

          {FILTERS_CONFIG.map((filter) => {
            const isActive = activeFilters.includes(filter.id as OrganizationType);
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                onClick={() => toggleFilter(filter.id as OrganizationType)}
                className={`rounded-full text-sm h-9 px-4 transition-all ${
                  isActive
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:border-blue-300 hover:text-blue-600"
                }`}
                aria-pressed={isActive}
                aria-label={`Filtrer par ${filter.label}`}
              >
                {filter.label}
                {isActive && <X className="w-3 h-3 ml-2" aria-hidden="true" />}
              </Button>
            );
          })}
        </div>

        {/* Carte + overlay */}
        <div className="relative group">
          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-[6px] border-white">
            {/* Overlay statistiques */}
            <div className="absolute top-6 left-6 z-1000 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs transition-transform group-hover:scale-105 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                    {geoError ? "Localisation désactivée" : activeFilters.length > 0 ? "Filtrés" : "Disponibles"}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loadingLoc ? "--" : organizations.length}
                    <span className="text-sm font-normal text-slate-500"> structures</span>
                  </p>
                </div>
              </div>

              {geoError && (
                <div className="mt-3 p-2 bg-red-50 text-red-600 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{geoError}</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <div
                  className={`w-2 h-2 rounded-full ${
                    loadingLoc ? "bg-slate-300" : userLocation ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                {loadingLoc ? "Recherche en cours..." : userLocation ? "Prêt (GPS actif)" : geoError ? "GPS bloqué" : "Prêt (Défaut)"}
              </div>
            </div>

            {/* Bouton GPS */}
            <div className="absolute bottom-8 right-8 z-1000">
              <button
                onClick={handleLocateMe}
                className={`w-14 h-14 rounded-full shadow-xl shadow-blue-900/10 flex items-center justify-center border border-slate-100 transition-all duration-200
                  ${geoError ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-white text-blue-600 hover:bg-blue-50 hover:scale-110"}`}
                title={geoError ? "Activer GPS" : "Me géolocaliser"}
              >
                <Navigation className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* Carte */}
            <MapRenderer
              key={userLocation ? `${userLocation.lat},${userLocation.lng}` : "default"}
              organizations={memoizedOrganizations}
              userLocation={userLocation}
              defaultCenter={defaultCenter}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
