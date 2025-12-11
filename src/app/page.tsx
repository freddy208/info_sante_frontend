/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */

'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Heart, Shield, Activity, Sparkles, ArrowRight, Zap, Users, MapPin, Search, Clock, Star, TrendingUp, Award, Bell, Calendar, Phone, FileText, ChevronRight, Stethoscope, Briefcase, Hospital, User, UserPlus, Building2 } from 'lucide-react';
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
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Carousel auto-play
  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prevStep) => (prevStep + 1) % steps.length);
      }, 5000); // Change d'image toutes les 5 secondes
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay]);

  // Pause auto-play when user interacts with carousel
  const handleCarouselInteraction = () => {
    setAutoPlay(false);
    // Restart auto-play after 10 seconds of inactivity
    setTimeout(() => setAutoPlay(true), 10000);
  };

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
      image: "https://res.cloudinary.com/duqsblvzm/image/upload/v1765277231/landing1_y1vebp.webp",
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
      image: "https://res.cloudinary.com/duqsblvzm/image/upload/v1765277230/landing2_dxlqsc.webp",
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
      image: "https://res.cloudinary.com/duqsblvzm/image/upload/v1765277230/landing3_xzgjmk.webp",
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
    handleCarouselInteraction();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/auth/inscription");
    }
  };

  const prevStep = () => {
    handleCarouselInteraction();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    handleCarouselInteraction();
    setCurrentStep(index);
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

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with skip button */}
        <div className="fixed top-4 right-4 z-50 sm:absolute sm:top-6 sm:right-6">
          <button
            onClick={skipOnboarding}
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full font-semibold transition-all hover:scale-105 shadow-lg border border-gray-200 hover:shadow-teal-200/50 hover:border-teal-200 text-sm sm:text-base"
          >
            Passer
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
          <div className={`max-w-6xl w-full transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Carousel with auto-play */}
            <div className="relative mb-8 sm:mb-12">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentStep * 100}%)` }}
                >
                  {steps.map((step, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={step.image}
                          alt={step.title}
                          className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent`} />
                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{step.title}</h2>
                          <p className="text-lg sm:text-xl opacity-90">{step.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Carousel navigation dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentStep ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Carousel navigation arrows */}
                <button
                  onClick={prevStep}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180" />
                </button>
                <button
                  onClick={nextStep}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Features list */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Découvrez nos fonctionnalités</h3>
                <div className="space-y-3 sm:space-y-4">
                  {currentStepData.features.slice(0, 2).map((feature, index) => {
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
              </div>
              
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Pourquoi nous choisir</h3>
                <div className="space-y-3 sm:space-y-4">
                  {currentStepData.features.slice(2).map((feature, index) => {
                    const FeatureIcon = feature.icon;
                    const isHovered = hoveredFeature === index + 2;
                    return (
                      <div
                        key={index + 2}
                        onMouseEnter={() => setHoveredFeature(index + 2)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="group bg-white hover:bg-gradient-to-r hover:from-white hover:to-teal-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-100 hover:border-teal-200 relative overflow-hidden"
                        style={{ 
                          animationDelay: `${(index + 2) * 100}ms`,
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
              </div>
            </div>

            {/* Three CTAs for different user types */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">Rejoignez-nous selon votre profil</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* CTA for anonymous/guest users */}
                <button
                  onClick={() => router.push("/accueil")}
                  className="group relative bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all hover:scale-105 hover:shadow-xl border border-blue-200 hover:border-blue-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="bg-blue-500 text-white p-3 sm:p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg sm:text-xl">Explorer en tant qu&apos;invité</h4>
                      <p className="text-gray-600 text-sm sm:text-base mt-1">Découvrez nos services sans inscription</p>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                      <span>Commencer</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* CTA for registered users */}
                <button
                  onClick={() => router.push("/auth/connexion")}
                  className="group relative bg-gradient-to-br from-emerald-50 to-teal-100 hover:from-emerald-100 hover:to-teal-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all hover:scale-105 hover:shadow-xl border border-emerald-200 hover:border-emerald-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="bg-emerald-500 text-white p-3 sm:p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg sm:text-xl">Espace utilisateur</h4>
                      <p className="text-gray-600 text-sm sm:text-base mt-1">Accédez à votre compte personnel</p>
                    </div>
                    <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                      <span>Se connecter</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                {/* CTA for hospitals */}
                <button
                  onClick={() => router.push("/hopitals/dashboard")}
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all hover:scale-105 hover:shadow-xl border border-purple-200 hover:border-purple-300"
                >
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="bg-purple-500 text-white p-3 sm:p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg sm:text-xl">Espace hôpitaux</h4>
                      <p className="text-gray-600 text-sm sm:text-base mt-1">Gérez votre établissement</p>
                    </div>
                    <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                      <span>Accéder</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Description section */}
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                {currentStepData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
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