'use client';

import { Star } from 'lucide-react';

const getAvatarColor = (name: string) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  return name.split(' ').map(part => part.charAt(0)).join('').substring(0, 2).toUpperCase();
};

export default function Testimonials() {
  const testimonials = [
    { 
      name: "Marie K.", 
      city: "Douala", 
      text: "Grâce à cette app, j'ai pu vacciner mes enfants à temps. Les alertes sont très utiles !" 
    },
    { 
      name: "Paul N.", 
      city: "Yaoundé", 
      text: "J'ai été informé de la campagne de dépistage du VIH. Très pratique!" 
    },
    { 
      name: "Sophie D.", 
      city: "Bafoussam", 
      text: "Application très utile pour trouver un hôpital près de chez moi!" 
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Ce qu&apos;ils disent de nous</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic text-sm sm:text-base">
                {testimonial.text}
              </p>
              <div className="flex items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getAvatarColor(testimonial.name)} rounded-full flex items-center justify-center text-white font-semibold mr-3 sm:mr-4 text-sm sm:text-base`}>
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}