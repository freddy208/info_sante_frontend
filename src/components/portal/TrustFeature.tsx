// components/trust-feature.tsx
import { LucideIcon } from 'lucide-react';

interface TrustFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export default function TrustFeature({ icon: Icon, title, description, delay }: TrustFeatureProps) {
  return (
    <div 
      className="text-center transform transition-all duration-500 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="inline-flex p-4 bg-linear-to-br from-teal-100 to-cyan-100 rounded-2xl text-teal-600 mb-5 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:rotate-3 transform">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}