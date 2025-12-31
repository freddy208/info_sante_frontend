/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Activity, AlertCircle } from "lucide-react"; // Ajout de AlertCircle
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { publicApi } from "@/lib/api";
import { PublicOrganization } from "@/types/public";

const MapRenderer = dynamic(() => import("./MapRenderer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 animate-pulse space-y-3">
      <MapPin className="w-8 h-8" />
      <span className="text-sm font-medium">Chargement de la carte...</span>
    </div>
  ),
});

export function GeoSection() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [loadingLoc, setLoadingLoc] = useState(true);
  
  // NOUVELLE ÉTAT : Pour gérer les erreurs de GPS
  const [geoError, setGeoError] = useState<string | null>(null); 

  // 1. Récupérer la position au premier chargement
  useEffect(() => {
    const locateUser = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Succès
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            loadNearbyHospitals(latitude, longitude);
            setGeoError(null); // Réinitialiser l'erreur si ça réussit
          },
          (error) => {
            // Erreur de géolocalisation
            console.warn("Géolocalisation refusée ou échouée.", error);
            
            // FIX : On définit un message d'erreur explicite
            let msg = "Impossible de vous localiser.";
            if (error.code === error.PERMISSION_DENIED) {
              msg = "Accès à la position refusé par le navigateur.";
            }
            setGeoError(msg);
            setLoadingLoc(false);
            
            // IMPORTANT : On NE FORCE PAS Yaoundé.
            // On laisse userLocation à null.
            // La carte s'affichera avec une vue par défaut (tout le pays ou le dernier centre)
          }
        );
      } else {
        setGeoError("Votre navigateur ne supporte pas la géolocalisation.");
        setLoadingLoc(false);
      }
    };

    locateUser();
  }, []);

  const loadNearbyHospitals = async (lat: number, lng: number) => {
    setLoadingLoc(true);
    try {
      const data = await publicApi.getNearbyOrganizations({ lat, lng, radius: 50 });
      setOrganizations(data);
    } catch (error) {
      console.error("Erreur chargement organisations", error);
    } finally {
      setLoadingLoc(false);
    }
  };

  const handleLocateMe = () => {
    setGeoError(null); // On efface l'erreur au clic
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        loadNearbyHospitals(latitude, longitude);
      });
    }
  };

  // Centre par défaut pour la carte si l'utilisateur n'est pas localisé (ex: Centre du Cameroun)
  // Cela n'affecte PAS la recherche, juste le centrage de la carte au chargement
  const defaultCenter: [number, number] = [4.0, 11.5];

  return (
    <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* ... (Titres et description inchangés) ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
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
              Accès instantané à l&apos;annuaire complet. Hôpitaux, pharmacies et cliniques disponibles à proximité de votre position actuelle.
            </p>
          </div>
          {/* ... Boutons ... */}
        </div>

        {/* Le Conteneur de la Carte */}
        <div className="relative group">
          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border-[6px] border-white">
            
            {/* Overlay Flottant - Statistiques Dynamiques */}
            <div className="absolute top-6 left-6 z-1000 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 max-w-xs transition-transform group-hover:scale-105 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                    {geoError ? "Localisation désactivée" : "Disponibles"}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {loadingLoc ? '--' : organizations.length} 
                    <span className="text-sm font-normal text-slate-500"> structures</span>
                  </p>
                </div>
              </div>
              
              {/* Affichage de l'erreur si GPS échoue */}
              {geoError && (
                <div className="mt-3 p-2 bg-red-50 text-red-600 rounded text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{geoError}</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <div className={`w-2 h-2 rounded-full ${loadingLoc ? 'bg-slate-300' : userLocation ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                {loadingLoc ? 'Localisation en cours...' : geoError ? 'GPS requis' : 'Prêt'}
              </div>
            </div>

            {/* FAB "Ma Position" */}
            <div className="absolute bottom-8 right-8 z-1000">
              <button 
                onClick={handleLocateMe} 
                className={`w-14 h-14 rounded-full shadow-xl shadow-blue-900/10 flex items-center justify-center border border-slate-100 transition-all duration-200
                  ${geoError ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-110'}`} 
                title={geoError ? "Activer GPS" : "Me géolocaliser"}
              >
                <Navigation className="w-6 h-6 fill-current" />
              </button>
            </div>

            {/* La carte */}
            {/* On passe userLocation (null ou objet) et le centre par défaut */}
            <MapRenderer 
              organizations={organizations} 
              userLocation={userLocation} 
              defaultCenter={defaultCenter} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}