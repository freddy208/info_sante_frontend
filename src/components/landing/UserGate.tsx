"use client";

import { motion } from "framer-motion";
import { BookOpen, User, Building2, ArrowRight, LayoutDashboard } from "lucide-react"; // Ajout de LayoutDashboard
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore"; // ✅ Import du store

// On garde le type, mais on le rend partiellement facultatif pour la carte dynamique
type UserGateCard = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  textColor: string;
  link: string;
  btnText: string;
  badge: string;
  btnVariant: "default" | "outline";
};

export function UserGate() {
  // ✅ Récupération de l'état d'authentification
  const { isAuthenticated, user } = useAuthStore();

  // ==========================================
  // 1. CARTE STATIQUE : JE M'INFORME (Toujours visible)
  // ==========================================
  const publicCard: UserGateCard = {
    title: "Je m'informe",
    subtitle: "Accédez à des informations de prévention et à un annuaire des structures de santé.",
    icon: BookOpen,
    gradient: "from-teal-500 to-emerald-600",
    textColor: "text-teal-600",
    link: "/accueil",
    btnText: "Explorer",
    badge: "Libre d'accès",
    btnVariant: "outline",
  };

  // ==========================================
  // 2. CARTE DYNAMIQUE : MON ESPACE (Selon l'état)
  // ==========================================
  const personalCard: UserGateCard = isAuthenticated ? {
    // ✅ CAS UTILISATEUR CONNECTÉ
    title: `Bonjour, ${user?.firstName || 'Utilisateur'} !`,
    subtitle: "Retournez à votre tableau de bord et accédez à vos fonctionnalités personnalisées.",
    icon: LayoutDashboard, // Icône de tableau de bord
    gradient: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    link: "/accueil", // Redirection directe vers l'app
    btnText: "Mon Tableau de bord",
    badge: "Connecté",
    btnVariant: "default",
  } : {
    // ✅ CAS UTILISATEUR NON CONNECTÉ
    title: "Mon Espace personnel",
    subtitle: "Gérez vos favoris, recevez des alertes et personnalisez votre expérience.",
    icon: User,
    gradient: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    link: "/auth/connexion",
    btnText: "Se connecter",
    badge: "Compte requis",
    btnVariant: "default",
  };

  // ==========================================
  // 3. CARTE STATIQUE : PARTENAIRES (Toujours visible)
  // ==========================================
  const partnerCard: UserGateCard = {
    title: "Espace Partenaires",
    subtitle: "Hôpitaux, cliniques et organismes : partagez des informations validées.",
    icon: Building2,
    gradient: "from-purple-500 to-pink-600",
    textColor: "text-purple-600",
    link: "/hopitals/login",
    btnText: "Accès Pro",
    badge: "Professionnel",
    btnVariant: "outline",
  };

  // Assemblage final des cartes
  const cards = [publicCard, personalCard, partnerCard];

  return (
    <section aria-labelledby="user-gate-title" className="py-20 bg-slate-50/50 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-50 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titre de la section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-(--primary)/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-(--primary)/20">
            Services
          </span>
          <h2 id="user-gate-title" className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4 tracking-tight">
            Bienvenue sur <span className="text-primary">MboaSanté</span>
          </h2>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            Une plateforme d’information sanitaire pensée pour tous, accessible partout au Cameroun.
          </p>
        </motion.div>

        {/* Grille des cartes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100",
                // Optionnel : Mettre en avant la carte connectée
                isAuthenticated && card.title.includes("Bonjour") && "ring-2 ring-blue-500 ring-offset-2"
              )}
            >
              {/* Badge */}
              <div className="absolute top-6 right-6">
                <span className={cn(
                  "text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                  isAuthenticated && card.title.includes("Bonjour")
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-slate-100 text-slate-400 border-slate-200"
                )}>
                  {card.badge}
                </span>
              </div>

              {/* Icône */}
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-linear-to-br", card.gradient)}>
                <card.icon className="w-8 h-8 text-white" />
              </div>

              {/* Textes */}
              <h3 className={cn("text-2xl font-bold mb-3 text-slate-900", card.textColor)}>{card.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 grow">{card.subtitle}</p>

              {/* Bouton */}
              <Link href={card.link} className="block w-full mt-auto">
                <Button
                  variant={card.btnVariant}
                  className={cn(
                    "w-full rounded-full h-12 font-semibold transition-all",
                    card.btnVariant === 'default'
                      ? `bg-linear-to-r ${card.gradient} text-white border-0 hover:opacity-90 shadow-md`
                      : "hover:bg-slate-50 hover:text-primary"
                  )}
                >
                  {card.btnText}
                  <ArrowRight
                    className={cn("ml-2 w-4 h-4 transition-transform", card.btnVariant === 'default' ? "group-hover:translate-x-1" : "")}
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}