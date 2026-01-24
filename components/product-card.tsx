'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  discountPrice,
  rating,
  reviewCount,
  image,
  badge,
  variant = 'default',
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const discount = discountPrice
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Determine badge color based on badge text
  const getBadgeColor = (badgeText: string | undefined) => {
    if (!badgeText) return '';
    const lowerBadge = badgeText.toLowerCase();
    if (lowerBadge.includes('new')) return 'bg-primary';
    if (lowerBadge.includes('best seller') || lowerBadge.includes('trending') || lowerBadge.includes('soft') || lowerBadge.includes('stem')) return 'bg-accent';
    return 'bg-secondary';
  };

  return (
    <Link href={`/product/${id}`}>
      <div
        className={cn(
          'group relative rounded-2xl overflow-hidden bg-card border border-muted transition-all duration-500 cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 animate-scaleIn',
          variant === 'compact' && 'hover:translate-y-[-8px]',
          variant === 'featured' && 'hover:translate-y-[-6px]'
        )}
      >
        {/* Badge Container - Top Left */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {badge && (
            <div className={cn(
              'text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm',
              getBadgeColor(badge)
            )}>
              {badge}
            </div>
          )}
        {discount > 0 && (
          <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            Save {discount}%
          </div>
        )}
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
            src={image || '/placeholder.svg'}
            alt={name}
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
                <span
                  key={i}
                  className={cn(
                    'text-sm transition-all duration-300',
                    i < Math.floor(rating) ? 'text-warning' : 'text-muted'
                  )}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-foreground/60 font-medium ml-1">
              ({reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3
            className="font-bold text-base leading-tight text-foreground line-clamp-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {name}
          </h3>

          {/* Category Tag */}
          <div className="text-xs font-medium text-primary uppercase tracking-wide">
            {category}
          </div>

          {/* Price and Cart Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
              ₹{discountPrice || price}
              {discountPrice && (
                <span className="text-sm text-foreground/50 line-through font-normal ml-2">
                  ₹{price}
                </span>
              )}
            </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
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

