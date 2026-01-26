'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const signatureProducts = [
  {
    id: 1,
    name: 'Premium Hero Collection',
    description: 'Hand-crafted superhero figures with articulated joints',
    ageGroup: '8+',
    label: "Parents' Choice",
    price: 3499,
    rating: 4.9,
    reviewCount: 456,
    image: '/hero-toys-1.jpg',
  },
  {
    id: 2,
    name: 'Deluxe Character Studio Box',
    description: 'Collector-grade cartoon character set with premium packaging',
    ageGroup: '6+',
    label: 'Top Rated',
    price: 2999,
    rating: 4.8,
    reviewCount: 389,
    image: '/studio-collection.jpg',
  },
  {
    id: 3,
    name: 'Creative Master Collection',
    description: 'Everything you need for imaginative building and crafting',
    ageGroup: '5+',
    label: 'Best Value',
    price: 1899,
    rating: 4.7,
    reviewCount: 234,
    image: '/hero-toys-1.jpg',
  },
];

function SignatureProductCard({ product, index }: { product: typeof signatureProducts[0], index: number }) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group relative rounded-2xl overflow-hidden bg-card border border-muted transition-all duration-500 cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 animate-scaleIn"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Badge - Top Left */}
        <div className="absolute top-3 left-3 z-20">
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {product.label}
          </div>
        </div>

        {/* Favorite Icon - Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-all duration-300',
              isWishlisted && 'fill-red-500 text-red-500'
            )}
          />
        </button>

        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground shadow-lg hover:bg-gray-50 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2 bg-gradient-to-b from-card/50 to-card">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3 transition-all duration-300',
                    i < Math.floor(product.rating)
                      ? 'fill-warning text-warning'
                      : 'text-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-foreground/60 font-medium ml-1">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3
            className="font-bold text-base leading-tight text-foreground line-clamp-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {product.name}
          </h3>

          {/* Age Group Tag */}
          <div className="text-xs font-medium text-primary uppercase tracking-wide">
            Age {product.ageGroup}
          </div>

          {/* Price and Cart Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              ₹{product.price.toLocaleString()}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SignatureProducts() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-4 text-center animate-fadeInUp">
          <span className="inline-block text-primary font-bold text-sm sm:text-base md:text-lg tracking-widest uppercase animate-fadeIn">
            ⭐ Premium Selection
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Our Signature Picks
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium max-w-2xl mx-auto leading-relaxed animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Premium selections that define playful excellence and pure joy
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
          {signatureProducts.map((product, index) => (
            <SignatureProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
