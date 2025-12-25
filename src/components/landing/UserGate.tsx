"use client";

import { motion } from "framer-motion";
import { BookOpen, User, Building2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assurez-vous d'avoir ce helper ou importez clsx

const cards = [
  {
    title: "Je m'informe",
    subtitle: "Accédez à des informations de prévention et à un annuaire des structures de santé.",
    icon: BookOpen,
    // On utilise des dégradés ou des bordures fines pour un look pro
    gradient: "from-teal-500 to-emerald-600",
    textColor: "text-teal-600",
    link: "/info",
    btnText: "Explorer",
    badge: "Libre d'accès",
    btnVariant: "outline" as const // Style secondaire
  },
  {
    title: "Mon Espace personnel",
    subtitle: "Gérez vos favoris, recevez des alertes et personnalisez votre expérience.",
    icon: User,
    gradient: "from-blue-500 to-indigo-600",
    textColor: "text-blue-600",
    link: "/auth/login",
    btnText: "Se connecter",
    badge: "Compte requis",
    btnVariant: "default" as const // Style primaire
  },
  {
    title: "Espace Partenaires",
    subtitle: "Hôpitaux, cliniques et organismes : partagez des informations validées.",
    icon: Building2,
    gradient: "from-purple-500 to-pink-600",
    textColor: "text-purple-600",
    link: "/pro",
    btnText: "Accès Pro",
    badge: "Professionnel",
    btnVariant: "outline" as const
  }
];

export function UserGate() {
  return (
    <section className="py-20 bg-slate-50/50 relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-(--primary)/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-(--text-primary) mb-4 tracking-tight">
            Bienvenue sur <span className="text-primary">MboaSanté</span>
          </h2>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            ne plateforme d’information sanitaire pensée pour tous, accessible partout au Cameroun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }} // L'effet de soulèvement
              className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full overflow-hidden"
            >
              {/* Décoration d'arrière-plan subtile */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${card.gradient} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-opacity group-hover:opacity-10 duration-500`}></div>

              {/* Header de la carte */}
              <div className="relative z-10 flex flex-col items-center text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${card.gradient} text-white shadow-lg flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <card.icon className="w-8 h-8" strokeWidth={2} />
                </div>
                
                <h3 className="text-xl font-bold text-(--text-primary) mb-3">
                  {card.title}
                </h3>
                
                <p className="text-sm text-(--text-secondary) leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              {/* Pied de carte */}
              <div className="mt-auto pt-6 border-t border-slate-50">
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-(--text-disabled)">
                    {card.badge}
                  </span>
                </div>

                <Link href={card.link} className="block w-full">
                  <Button 
                    variant={card.btnVariant}
                    className={cn(
                      "w-full rounded-full h-12 text-base font-semibold transition-all duration-300 shadow-md border-2",
                      card.btnVariant === 'outline' && `border-slate-200 hover:border-primary hover:text-primary hover:bg-transparent`,
                      card.btnVariant === 'default' && `bg-linear-to-r ${card.gradient} hover:shadow-lg hover:shadow-(--primary)/30 border-transparent text-white`
                    )}
                  >
                    {card.btnText}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}