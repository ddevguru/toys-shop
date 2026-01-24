'use client';

import React from 'react';
import CollectionCard from '@/components/collection-card';

const categories = [
  {
    id: 1,
    title: 'Superhero Squad',
    description: 'Powerful characters with incredible powers',
    image: '/studio-collection.jpg',
    productCount: 48,
    color: '#EF4444',
    icon: '🦸',
  },
  {
    id: 2,
    title: 'Cartoon Favorites',
    description: 'Beloved characters from your favorite shows',
    image: '/hero-toys-1.jpg',
    productCount: 62,
    color: '#3B82F6',
    icon: '🎬',
  },
  {
    id: 3,
    title: 'Playful Creatures',
    description: 'Adorable animals and magical beings',
    image: '/studio-collection.jpg',
    productCount: 35,
    color: '#10B981',
    icon: '🦁',
  },
  {
    id: 4,
    title: 'Building & Creating',
    description: 'Educational toys for creative minds',
    image: '/hero-toys-1.jpg',
    productCount: 54,
    color: '#F59E0B',
    icon: '🧱',
  },
  {
    id: 5,
    title: 'Adventure Heroes',
    description: 'Action-packed adventure with epic battles',
    image: '/studio-collection.jpg',
    productCount: 41,
    color: '#8B5CF6',
    icon: '⚔️',
  },
  {
    id: 6,
    title: 'Collectible Figures',
    description: 'Rare and limited edition collector items',
    image: '/hero-toys-1.jpg',
    productCount: 28,
    color: '#EC4899',
    icon: '✨',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Header Section */}
      <div className="relative px-4 md:px-8 lg:px-12 py-12 md:py-20 border-b-2 border-muted overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="space-y-4">
            <h1
              className="text-5xl md:text-6xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Our Collections
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl font-medium">
              Explore our carefully curated collections of premium toys and characters. Each collection is designed to bring joy and spark imagination.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 md:px-8 lg:px-12 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <CollectionCard key={category.id} {...category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

