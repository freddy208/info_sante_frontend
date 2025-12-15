// components/ui/profile-card.tsx
import Link from 'next/link';
import { ArrowRight, CheckCircle, LucideIcon } from 'lucide-react';

// Définition des types pour les props du composant
interface ProfileCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'blue' | 'emerald' | 'purple';
  href: string;
  features: string[];
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 via-blue-600 to-cyan-600',
    text: 'text-blue-600',
    cardBg: 'bg-gradient-to-br from-blue-50/80 to-white',
    border: 'border-blue-200/50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    glow: 'group-hover:shadow-blue-500/20'
  },
  emerald: {
    gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
    text: 'text-emerald-600',
    cardBg: 'bg-gradient-to-br from-emerald-50/80 to-white',
    border: 'border-emerald-200/50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    glow: 'group-hover:shadow-emerald-500/20'
  },
  purple: {
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    text: 'text-purple-600',
    cardBg: 'bg-gradient-to-br from-purple-50/80 to-white',
    border: 'border-purple-200/50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    glow: 'group-hover:shadow-purple-500/20'
  },
};

export default function ProfileCard({ icon: Icon, title, description, color, href, features }: ProfileCardProps) {
  const currentColor = colorClasses[color];

  return (
    <Link href={href} className="group block">
      <div className={`relative h-full p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${currentColor.cardBg} ${currentColor.border} hover:shadow-2xl ${currentColor.glow}`}>
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className={`inline-flex p-4 rounded-2xl text-white mb-6 shadow-lg ${currentColor.iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          
          <h3 className={`text-2xl font-bold mb-4 ${currentColor.text}`}>{title}</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm font-medium transform transition-transform duration-200 hover:translate-x-1">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className={`flex items-center font-bold text-lg ${currentColor.text} group-hover:translate-x-2 transition-all duration-300`}>
            <span>Accéder à l&apos;espace</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}