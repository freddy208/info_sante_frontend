// src/components/portal/ProfileCard.tsx
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProfileCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'blue' | 'emerald' | 'purple';
  href: string;
  features: string[];
}

export function ProfileCard({ icon: Icon, title, description, color, href, features }: ProfileCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      cardBg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      featureBg: 'bg-blue-100 text-blue-700'
    },
    emerald: {
      bg: 'from-emerald-500 to-emerald-600',
      text: 'text-emerald-600',
      cardBg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      featureBg: 'bg-emerald-100 text-emerald-700'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      cardBg: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      featureBg: 'bg-purple-100 text-purple-700'
    },
  };

  const currentColor = colorClasses[color];

  return (
    <Link href={href} className="group block">
      <div className={`relative h-full p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${currentColor.cardBg}`}>
        <div className={`inline-flex p-4 rounded-full text-white mb-6 ${currentColor.bg}`}>
          <Icon className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <h3 className={`text-2xl font-bold mb-4 ${currentColor.text}`}>{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={`flex items-center font-bold text-lg ${currentColor.text} group-hover:translate-x-2 transition-transform`}>
          <span>Accéder à l&apos;espace</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  );
}