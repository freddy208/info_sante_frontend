import { Shield, Globe, CheckCircle } from 'lucide-react';
import { TrustFeature } from './TrustFeature';

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pourquoi nous faire confiance ?</h2>
          <p className="mt-4 text-lg text-gray-600">Une plateforme pensée pour informer, protéger et accompagner la population camerounaise.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <TrustFeature icon={Shield} title="Sécurisé & Fiable" description="La protection des données et la fiabilité des informations sont au cœur de notre engagement, avec des contenus issus de sources professionnelles et reconnues." />
          <TrustFeature icon={Globe} title="Accessible à tous" description="Une plateforme disponible sur mobile et ordinateur, conçue pour être utilisable partout au Cameroun, même dans des contextes de connectivité limitée." />
          <TrustFeature icon={CheckCircle} title="Approuvé par l'État" description="Développé en cohérence avec les enjeux de santé publique et les orientations du système de santé camerounais." />
        </div>
      </div>
    </section>
  );
}