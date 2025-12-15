// components/trust-section.tsx
import { Shield, Globe, CheckCircle } from 'lucide-react';
import TrustFeature from './TrustFeature';

export default function TrustSection() {
  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #14b8a6 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Une plateforme de{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-cyan-600">
              confiance
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Pensée pour informer, protéger et accompagner la population camerounaise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <TrustFeature
            icon={Shield}
            title="Sécurisé & Fiable"
            description="La protection des données et la fiabilité des informations sont au cœur de notre engagement, avec des contenus issus de sources professionnelles et reconnues."
            delay={0}
          />
          <TrustFeature
            icon={Globe}
            title="Accessibilité nationale"
            description="Une plateforme disponible sur mobile et ordinateur, conçue pour être utilisable partout au Cameroun, même dans des contextes de connectivité limitée."
            delay={100}
          />
          <TrustFeature
            icon={CheckCircle}
            title="Approuvé par l'État"
            description="Développé en cohérence avec les enjeux de santé publique et les orientations du système de santé camerounais."
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}