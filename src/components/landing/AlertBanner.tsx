"use client";

import { mockAlerts } from "@/lib/mockData";
import { AlertTriangle, AlertCircle, ArrowRight, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; 

export function AlertBanner() {
  const alerts = mockAlerts;

  // Configuration des styles dynamiques selon le niveau d'alerte
  const getAlertStyles = (level: string) => {
    if (level === 'critical') {
      return {
        border: "border-l-4 border-[var(--error)] border-y border-r border-transparent hover:border-[var(--error)]/30",
        iconBg: "bg-red-50 text-[var(--error)]",
        titleColor: "text-gray-900",
        badgeBg: "bg-red-100 text-[var(--error)]",
        shadow: "hover:shadow-[0_8px_30px_rgb(239,68,68,0.12)]"
      };
    }
    return {
      border: "border-l-4 border-[var(--warning)] border-y border-r border-transparent hover:border-[var(--warning)]/30",
      iconBg: "bg-amber-50 text-[var(--warning)]",
      titleColor: "text-gray-900",
      badgeBg: "bg-amber-100 text-[var(--warning)]",
      shadow: "hover:shadow-[0_8px_30px_rgb(245,158,11,0.12)]"
    };
  };

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-8 relative overflow-hidden">
      {/* Décoration subtile de fond */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-[0.02] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header de la section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-(--error) opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-(--error)"></span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-(--text-primary) tracking-tight">
                Vigilance Sanitaire
              </h2>
              <p className="text-xs text-(--text-secondary) font-medium">
                Informations issues de sources sanitaires officielles
              </p>
            </div>
          </div>
          
          <button className="text-sm font-semibold text-primary hover:text-(--primary-dark) flex items-center gap-1 transition-colors group">
            Voir toutes les alertes
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grille des alertes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alerts.map((alert) => {
            const styles = getAlertStyles(alert.level);
            const Icon = alert.level === 'critical' ? AlertTriangle : AlertCircle;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: alert.id * 0.1 }}
                whileHover={{ y: -4 }}
                // J'ai changé rounded-xl en rounded-2xl ici :
                className={`relative bg-white rounded-2xl p-5 shadow-sm transition-all duration-300 cursor-default group ${styles.border} ${styles.shadow}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icône stylisée dans un rond */}
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${styles.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.badgeBg}`}>
                        {alert.level === 'critical' ? 'URGENCE' : 'ATTENTION'}
                      </span>
                      <div className="flex items-center gap-1 text-(--text-disabled)">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{alert.date}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-(--text-primary) mb-1">
                      {alert.title}
                    </h3>
                    
                    <p className="text-sm text-(--text-secondary) mb-3 leading-relaxed">
                      {alert.description}
                    </p>

                    {/* Pied de carte avec Localisation et Bouton */}
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-(--text-primary) font-medium text-xs">
                        <MapPin className="w-3.5 h-3.5 text-(--text-secondary)" />
                        {alert.location}
                      </div>
                      <Button 
                        variant="ghost" 
                        className="h-7 px-3 text-xs font-semibold hover:bg-slate-50"
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}