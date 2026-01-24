import React from 'react';
import ProductCard from './product-card';

const featuredProducts = [
  {
    id: 1,
    name: 'Cartoon Characters Set',
    category: 'Cartoon',
    price: 2499,
    discountPrice: 1999,
    rating: 4.5,
    reviewCount: 128,
    image: '/hero-toys-1.jpg',
    badge: 'New',
  },
  {
    id: 2,
    name: 'Superhero Action Figures',
    category: 'Superhero',
    price: 1999,
    rating: 4.8,
    reviewCount: 256,
    image: '/studio-collection.jpg',
    badge: 'Best Seller',
  },
  {
    id: 3,
    name: 'Creative Building Blocks',
    category: 'Creative',
    price: 1499,
    discountPrice: 999,
    rating: 4.6,
    reviewCount: 89,
    image: '/hero-toys-1.jpg',
    badge: null,
  },
  {
    id: 4,
    name: 'Educational Puzzle Set',
    category: 'Educational',
    price: 899,
    rating: 4.4,
    reviewCount: 145,
    image: '/studio-collection.jpg',
    badge: null,
  },
  {
    id: 5,
    name: 'Premium Character Series',
    category: 'Cartoon',
    price: 3499,
    discountPrice: 2799,
    rating: 4.9,
    reviewCount: 312,
    image: '/hero-toys-1.jpg',
    badge: 'Limited Edition',
  },
  {
    id: 6,
    name: 'Collectible Heroes Pack',
    category: 'Superhero',
    price: 2899,
    rating: 4.7,
    reviewCount: 178,
    image: '/studio-collection.jpg',
    badge: 'Best Seller',
  },
  {
    id: 7,
    name: 'DIY Craft Kit',
    category: 'Creative',
    price: 1299,
    rating: 4.3,
    reviewCount: 67,
    image: '/hero-toys-1.jpg',
    badge: null,
  },
  {
    id: 8,
    name: 'Smart Learning Toys',
    category: 'Educational',
    price: 2199,
    discountPrice: 1699,
    rating: 4.6,
    reviewCount: 203,
    image: '/studio-collection.jpg',
    badge: 'New',
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 md:py-28 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 space-y-3 text-center animate-fadeInUp">
          <span className="inline-block text-primary font-bold text-lg tracking-widest uppercase animate-fadeIn">
            ✨ Trending Now
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Featured Toys
          </h2>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Discover our handpicked selection of popular and trending toys that kids absolutely love
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          {featuredProducts.slice(0, 3).map((product, idx) => (
            <div
              key={product.id}
              className="animate-slideUp"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <ProductCard {...product} variant="default" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
