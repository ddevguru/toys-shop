import React from 'react';
import { Shield, Sparkles, Truck, Heart, Gift, Zap } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Loved by Kids',
    description: 'Our toys bring smiles to thousands of playrooms daily',
    gradient: 'from-red-400 to-red-600',
    bgGradient: 'from-red-50 to-red-100/50',
    iconColor: 'text-red-600',
  },
  {
    icon: Shield,
    title: '100% Safe & Certified',
    description: 'All toys tested and certified for child safety standards',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Handpicked collections curated by toy experts',
    gradient: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100/50',
    iconColor: 'text-purple-600',
  },
  {
    icon: Truck,
    title: 'Super Fast Shipping',
    description: 'Quick delivery across India with easy returns',
    gradient: 'from-green-400 to-green-600',
    bgGradient: 'from-green-50 to-green-100/50',
    iconColor: 'text-green-600',
  },
  {
    icon: Gift,
    title: 'Special Gift Packaging',
    description: 'Beautiful wrapping perfect for every occasion',
    gradient: 'from-teal-400 to-teal-600',
    bgGradient: 'from-teal-50 to-teal-100/50',
    iconColor: 'text-teal-600',
  },
  {
    icon: Zap,
    title: 'Instant Support',
    description: '24/7 customer care to help with any questions',
    gradient: 'from-yellow-400 to-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100/50',
    iconColor: 'text-yellow-600',
  },
];

export default function WhyChooseUs() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-4 text-center animate-fadeInUp">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Why Kids Love Us 🎉
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 max-w-2xl mx-auto font-medium leading-relaxed animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            From safety to smiles, we're committed to creating unforgettable moments
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className={`group relative rounded-3xl border-2 border-transparent overflow-hidden transition-all duration-500 hover:translate-y-[-8px] animate-scaleIn`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}
                />

                {/* Gradient Border on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-all duration-500 blur-xl`}
                />

                {/* Content */}
                <div className="relative p-4 sm:p-6 md:p-8 lg:p-10 space-y-2 sm:space-y-3 md:space-y-4 h-full flex flex-col bg-white group-hover:bg-white/95 backdrop-blur transition-all duration-300">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-foreground"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-foreground/70 leading-relaxed font-medium flex-grow">
                    {feature.description}
                  </p>

                  {/* Bottom Accent */}
                  <div
                    className={`h-1 w-16 rounded-full bg-gradient-to-r ${feature.gradient} transform transition-all duration-300 group-hover:w-24`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { number: '50K+', label: 'Happy Kids' },
            { number: '10K+', label: 'Toys Available' },
            { number: '4.9★', label: 'Customer Rating' },
            { number: '24/7', label: 'Support' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 hover:border-primary/50 transition-all duration-300"
            >
              <div
                className="text-3xl md:text-4xl font-bold text-primary"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {stat.number}
              </div>
              <p className="text-foreground/70 font-medium mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
