"use client";

import { motion } from "framer-motion";
import { BookOpen, User, Building2, ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useOrganizationAuthStore } from "@/stores/organizationAuthStore";

export function UserGate() {
  const { isAuthenticated: isUserAuth, user } = useAuthStore();
  const { isAuthenticated: isOrgAuth, organization } = useOrganizationAuthStore();

  const publicCard = {
    title: "Je m'informe",
    subtitle: "Accédez librement aux alertes, conseils de santé et annuaires sans compte.",
    icon: BookOpen,
    gradient: "from-teal-500 to-emerald-600",
    textColor: "text-teal-600",
    link: "/accueil",
    btnText: "Accès libre",
    badge: "Public",
    btnVariant: "outline" as const,
  };

  const personalCard = isUserAuth ? {
    title: `Bonjour, ${user?.firstName || 'Utilisateur'} !`,
    subtitle: "Retournez à votre tableau de bord pour vos fonctionnalités personnalisées.",
    icon: LayoutDashboard,
    gradient: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    link: "/accueil",
    btnText: "Mon Tableau de bord",
    badge: "Connecté",
    btnVariant: "default" as const,
  } : {
    title: "Mon Espace personnel",
    subtitle: "Gérez vos favoris, recevez des alertes et personnalisez votre expérience.",
    icon: User,
    gradient: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    link: "/auth/connexion",
    btnText: "Se connecter",
    badge: "Compte requis",
    btnVariant: "default" as const,
  };

  const partnerCard = isOrgAuth ? {
    title: organization?.name || "Espace Pro",
    subtitle: "Gérez vos annonces, vos membres et publiez des informations validées.",
    icon: ShieldCheck,
    gradient: "from-purple-500 to-pink-600",
    textColor: "text-purple-600",
    link: "/dashboard",
    btnText: "Gérer l'organisation",
    badge: "Session Pro",
    btnVariant: "default" as const,
  } : {
    title: "Espace Partenaires",
    subtitle: "Hôpitaux et cliniques : rejoignez le réseau pour informer les citoyens.",
    icon: Building2,
    gradient: "from-purple-500 to-pink-600",
    textColor: "text-purple-600",
    link: "/hopitals/login",
    btnText: "Accès Professionnel",
    badge: "Professionnel",
    btnVariant: "outline" as const,
  };

  const cards = [publicCard, personalCard, partnerCard];

  return (
    <section className="py-20 bg-slate-50/50 relative overflow-hidden">
      {/* Fond décoratif conservé */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-50 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-slate-100",
                (isUserAuth && card.badge === "Connecté") || (isOrgAuth && card.badge === "Session Pro") ? "ring-2 ring-primary/20" : ""
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-linear-to-br text-white", card.gradient)}>
                  <card.icon size={32} />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border",
                  card.badge === "Public" ? "bg-teal-50 text-teal-600 border-teal-100" : 
                  card.badge.includes("Session") || card.badge === "Connecté" ? "bg-blue-50 text-blue-600 border-blue-100" :
                  "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                  {card.badge}
                </span>
              </div>

              <h3 className={cn("text-2xl font-bold mb-3 tracking-tight", card.textColor)}>{card.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 grow">{card.subtitle}</p>

              <Link href={card.link} className="block w-full mt-auto">
                <Button
                  variant={card.btnVariant}
                  className={cn(
                    "w-full rounded-full h-12 font-bold text-sm transition-all shadow-sm",
                    card.btnVariant === 'default' 
                      ? `bg-linear-to-r ${card.gradient} text-white border-0 hover:opacity-90 hover:shadow-md`
                      : "hover:bg-slate-50 hover:text-primary border-slate-200"
                  )}
                >
                  {card.btnText}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}