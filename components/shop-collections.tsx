import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const collections = [
  {
    id: 1,
    name: 'Cartoon Characters',
    href: '/shop?category=cartoon',
    image: '/hero-toys-1.jpg',
    description: 'Beloved characters from your favorite shows',
  },
  {
    id: 2,
    name: 'Superheroes',
    href: '/shop?category=superhero',
    image: '/studio-collection.jpg',
    description: 'Powerful figures for brave adventurers',
  },
  {
    id: 3,
    name: 'DIY & Creative',
    href: '/shop?category=creative',
    image: '/hero-toys-1.jpg',
    description: 'Build, create, and imagine',
  },
  {
    id: 4,
    name: 'Educational',
    href: '/shop?category=educational',
    image: '/studio-collection.jpg',
    description: 'Learning through playful exploration',
  },
  {
    id: 5,
    name: 'Limited Edition',
    href: '/shop?category=limited',
    image: '/hero-toys-1.jpg',
    description: 'Exclusive drops and rare collections',
  },
];

export default function ShopCollections() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-4 text-center animate-fadeInUp">
          <span className="inline-block text-primary font-bold text-sm sm:text-lg tracking-widest uppercase animate-fadeIn">
            🛍️ Collections
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Shop by Collection
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium max-w-2xl mx-auto leading-relaxed animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Browse our curated themed collections and discover your next favorite toy
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              href={collection.href}
              className="group relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden aspect-square transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:translate-y-[-8px] sm:hover:translate-y-[-12px] border-2 sm:border-3 border-muted hover:border-primary/50 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-125"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 md:p-6 text-center space-y-2 sm:space-y-3 md:space-y-4">
                <h3
                  className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight text-balance"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {collection.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium hidden md:block">
                  {collection.description}
                </p>
                <div className="inline-block bg-white text-foreground hover:bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg transform group-hover:scale-110 group-hover:shadow-xl">
                  Shop Now →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
