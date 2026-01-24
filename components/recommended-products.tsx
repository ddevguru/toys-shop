import React from 'react';
import ProductCard from './product-card';

const recommendedProducts = [
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
];

export default function RecommendedProducts() {
  return (
    <section className="py-12 md:py-20">
      {/* Section Header */}
      <div className="mb-16 space-y-4 text-center">
        <span className="inline-block text-primary font-bold text-lg tracking-widest uppercase">
          Similar Products
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold text-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          You May Also Like
        </h2>
        <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
          Explore similar products that our customers love
        </p>
      </div>

      {/* Products Grid - 2 rows, 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
        {recommendedProducts.slice(0, 3).map((product, idx) => (
          <div
            key={product.id}
            className="animate-slideUp"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <ProductCard {...product} variant="default" />
          </div>
        ))}
      </div>
    </section>
  );
}
