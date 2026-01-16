// src/components/dashboard/StatsCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'teal' | 'blue' | 'purple' | 'yellow' | 'red';
  description?: string;
}

export function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
  // Mapping des couleurs pour correspondre au design propre
  const colorMap = {
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
  };

  const selectedColor = colorMap[color] || colorMap.teal;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${selectedColor.bg} ${selectedColor.text}`}>
          {icon}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-2 italic">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}