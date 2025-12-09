/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */

'use client';
import { useState, useEffect, useMemo } from 'react';
import { Heart, Shield, Activity, Sparkles, ArrowRight, Zap, Users, MapPin, Search, Clock, Star, TrendingUp, Award, Bell, Calendar, Phone, FileText, ChevronRight, Stethoscope, Briefcase, Hospital } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function InfoSanteOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
    
    // Détecter mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      if (!isMobile) {
        setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  // Générer des particules magiques lors du changement d'étape
  useEffect(() => {
    const newParticles = [...Array(20)].map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2
    }));
    setParticles(newParticles);
    
    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const floatingElements = useMemo(() => {
    if (!mounted) return [];
    
    const elements = [];
    for (let i = 0; i < 15; i++) {
      elements.push({
        id: i,
        left: (i * 37 + 23) % 100,
        top: (i * 53 + 17) % 100,
        animationDelay: (i * 0.3) % 3,
        animationDuration: 3 + (i % 3),
        fontSize: 20 + (i % 3) * 10
      });
    }
    return elements;
  }, [mounted]);

  const steps = [
    {
      title: "Bienvenue sur Info Santé 237",
      subtitle: "Votre santé, notre priorité",
      description: "La première plateforme camerounaise qui révolutionne l'accès aux soins de santé",
      icon: Activity,
      gradient: "from-teal-500 via-emerald-500 to-cyan-500",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=800&fit=crop",
      features: [
        { icon: Search, text: "Trouvez les meilleurs établissements", color: "teal", emoji: "🏥" },
        { icon: MapPin, text: "Géolocalisation en temps réel", color: "emerald", emoji: "📍" },
        { icon: Clock, text: "Disponibilité 24/7", color: "cyan", emoji: "⏰" },
        { icon: Shield, text: "Données certifiées et sécurisées", color: "teal", emoji: "🔒" }
      ]
    },
    {
      title: "Des services pour tous",
      subtitle: "Santé accessible et moderne",
      description: "Des fonctionnalités puissantes pour prendre soin de votre santé et celle de vos proches",
      icon: Stethoscope,
      gradient: "from-emerald-500 via-teal-500 to-green-500",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop",
      features: [
        { icon: FileText, text: "Dossier médical numérique sécurisé", color: "emerald", emoji: "📋" },
        { icon: Calendar, text: "Prise de rendez-vous simplifiée", color: "teal", emoji: "📅" },
        { icon: Phone, text: "Téléconsultation avec des experts", color: "green", emoji: "💬" },
        { icon: Bell, text: "Rappels intelligents personnalisés", color: "emerald", emoji: "🔔" }
      ]
    },
    {
      title: "Une communauté qui vous fait confiance",
      subtitle: "Rejoignez des milliers d'utilisateurs",
      description: "Faites partie du mouvement qui transforme l'accès à la santé au Cameroun",
      icon: Users,
      gradient: "from-cyan-500 via-teal-500 to-emerald-500",
      image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&h=800&fit=crop",
      features: [
        { icon: Users, text: "50,000+ utilisateurs actifs", color: "cyan", emoji: "👥" },
        { icon: Star, text: "4.9/5 étoiles de satisfaction", color: "teal", emoji: "⭐" },
        { icon: TrendingUp, text: "98% de recommandation", color: "emerald", emoji: "📈" },
        { icon: Award, text: "Certifié Ministère de la Santé", color: "cyan", emoji: "🏆" }
      ]
    }
  ];
  const router = useRouter();


const nextStep = () => {
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    router.push("/auth/inscription");
  }
};

const skipOnboarding = () => {
  router.push("/accueil");
};


  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      teal: 'bg-teal-500 text-white',
      emerald: 'bg-emerald-500 text-white',
      cyan: 'bg-cyan-500 text-white',
      green: 'bg-green-500 text-white'
    };
    return colors[color] || colors.teal;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden">
      {/* Particules magiques lors des transitions */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none z-50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `sparkle ${particle.duration}s ease-out forwards`,
            animationDelay: `${particle.delay}s`
          }}
        >
          <Sparkles className="w-4 h-4 text-teal-400" />
        </div>
      ))}

      {/* Subtle animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-teal-100/40 to-emerald-100/40 rounded-full blur-3xl transition-all duration-700"
          style={{
            left: `${20 + mousePosition.x * 10}%`,
            top: `${10 + mousePosition.y * 10}%`,
            transform: `scale(${1 + mousePosition.y * 0.1})`
          }}
        />
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-100/30 to-teal-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-emerald-100/30 to-green-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating medical icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute text-teal-600 animate-pulse"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.animationDuration}s`,
              fontSize: `${element.fontSize}px`
            }}
          >
            +
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
        }
      `}</style>

      <div className="relative z-10 min-h-screen flex flex-col pt-4 sm:pt-0">
        {/* Header with skip button - FIX: Bouton visible sur mobile */}
        <div className="fixed top-4 right-4 z-50 sm:absolute sm:top-6 sm:right-6">
          <button
            onClick={skipOnboarding}
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-semibold transition-all hover:scale-105 shadow-lg border border-gray-200 hover:shadow-teal-200/50 hover:border-teal-200 text-sm sm:text-base"
          >
            Passer
          </button>
        </div>

        {/* Progress indicators */}
        <div className="pt-16 sm:pt-8 px-4">
          <div className="max-w-md mx-auto flex gap-2 sm:gap-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${
                  index <= currentStep
                    ? `bg-gradient-to-r ${step.gradient} shadow-md`
                    : 'bg-gray-200'
                }`}
                style={{
                  transform: index === currentStep ? 'scaleY(1.5)' : 'scaleY(1)',
                  transition: 'all 0.5s ease-out'
                }}
              />
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-medium animate-pulse">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
          <div className={`max-w-6xl w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left side - Content */}
              <div className="order-2 lg:order-1">
                {/* Icon badge */}
                <div className="inline-flex mb-4 sm:mb-6">
                  <div className="relative group">
                    <div 
                      className={`absolute inset-0 bg-gradient-to-r ${currentStepData.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`}
                      style={{ animation: 'glow 3s ease-in-out infinite' }}
                    />
                    <div 
                      className="relative bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100"
                      style={{ animation: 'float 3s ease-in-out infinite' }}
                    >
                      <Icon className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${currentStepData.gradient} bg-clip-text text-transparent`} strokeWidth={2} />
                    </div>
                  </div>
                </div>

                {/* Title section - FIX: Texte responsive */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight">
                    {currentStepData.title}
                  </h1>
                  <p className={`text-xl sm:text-2xl md:text-3xl font-semibold bg-gradient-to-r ${currentStepData.gradient} bg-clip-text text-transparent mb-3 sm:mb-4`}>
                    {currentStepData.subtitle}
                  </p>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {currentStepData.features.map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    const isHovered = hoveredFeature === index;
                    return (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredFeature(index)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="group bg-white hover:bg-gradient-to-r hover:from-white hover:to-teal-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-100 hover:border-teal-200 relative overflow-hidden"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
                          transition: 'all 0.3s ease-out'
                        }}
                      >
                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-100/30 to-transparent animate-pulse" />
                        )}
                        
                        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                          <div className={`${getColorClasses(feature.color)} p-2.5 sm:p-3 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 flex-shrink-0`}>
                            <FeatureIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold text-base sm:text-lg">{feature.text}</p>
                          </div>
                          <div className="text-2xl sm:text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                            {feature.emoji}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={nextStep}
                    className={`group relative px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r ${currentStepData.gradient} hover:shadow-2xl text-white text-lg sm:text-xl font-bold rounded-xl sm:rounded-2xl shadow-xl transition-all hover:scale-110 inline-flex items-center justify-center gap-2 sm:gap-3 overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }} />
                    
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform relative z-10" />
                    <span className="relative z-10">
                      {currentStep < steps.length - 1 ? 'Continuer' : 'Commencer'}
                    </span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                  </button>

                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl sm:rounded-2xl font-bold transition-all hover:scale-105 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl text-base sm:text-lg"
                    >
                      Retour
                    </button>
                  )}
                </div>
              </div>

              {/* Right side - Image - FIX: Hauteur responsive + 3D désactivé sur mobile */}
              <div className="order-1 lg:order-2">
                <div className="relative group">
                  <div className={`absolute -inset-4 bg-gradient-to-r ${currentStepData.gradient} rounded-2xl sm:rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500`} />
                  <div 
                    className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-transform duration-500 group-hover:scale-105"
                    style={!isMobile ? {
                      transform: `perspective(1000px) rotateY(${(mousePosition.x - 0.5) * 5}deg) rotateX(${(mousePosition.y - 0.5) * -5}deg)`
                    } : {}}
                  >
                    <img 
                      src={currentStepData.image}
                      alt={currentStepData.title}
                      className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.gradient} opacity-10 group-hover:opacity-5 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-y-full group-hover:translate-y-full transition-transform duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - FIX: Meilleur responsive */}
        <div className="py-6 sm:py-8 bg-white/50 backdrop-blur-sm border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 sm:gap-4 text-center md:text-left">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500 animate-pulse flex-shrink-0" style={{ animationDuration: '1.5s' }} />
                <p className="text-xs sm:text-sm font-medium">Conçu avec passion pour le Cameroun 🇨🇲</p>
              </div>
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-green-800 font-semibold">
                  Certifié Ministère de la Santé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}