"use client";

import { Twitter, Facebook, Linkedin, Instagram, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900  text-white pt-24 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* GRILLE PRINCIPALE "BIG APP" (4 Colonnes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* COLONNE 1 : BRAND (Priorité Absolue) */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">MboaSanté</h2>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                Plateforme nationale d’information sanitaire au Cameroun. Accessible, claire et fiable.
              </p>
            </div>

            {/* Réseaux sociaux (Style minimal) */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* COLONNE 2 : SOLUTIONS */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">
              Solutions
            </h3>
            <ul className="space-y-4 text-sm">
              {['Recherche d\'hôpitaux', 'Alertes et vigilances sanitaires', 'Informations de prévention', 'Annuaire des services de santé', 'Pharmacies de garde (informations)'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 3 : ENTREPRISE */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">
              Entreprise
            </h3>
            <ul className="space-y-4 text-sm">
              {['À propos de nous', 'Carrières', 'Presse', 'Partenaires', 'Politique de confidentialité'].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLONNE 4 : MOBILE & PWA (Propre et intégré) */}
          <div>
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">
              Application
            </h3>
            
            <div className="space-y-6">
              {/* Style "Big App" pour le PWA : Simple et direct */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-white font-medium text-sm mb-3">MboaSanté sur votre mobile</p>
                <p className="text-xs text-neutral-400 leading-5 mb-4">
                  Installez l’application sans passer par un store : :
                </p>
                <ol className="text-xs text-neutral-300 space-y-1.5 list-decimal list-inside marker:text-primary">
                  <li>Ouvrez le menu du navigateur</li>
                  <li>Appuyez sur &quot;Ajouter à l&apos;écran d&apos;accueil&quot;</li>
                </ol>
              </div>

              {/* Badge Eco-Data discret */}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Mode économie de données activé
              </div>
            </div>
          </div>
        </div>

        {/* BARRE INFERIEURE (LEGAL & LOVE) */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} MboaSanté. Tous droits réservés.
          </p>

          {/* Le "Cœur" intégré proprement dans le footer légal */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer">
            <span>Conçu avec amour pour le Cameroun 🇨🇲</span>
          </div>
        </div>
      </div>
    </footer>
  );
}