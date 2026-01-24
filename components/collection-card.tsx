'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CollectionCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  productCount: number;
  color: string;
  icon?: React.ReactNode;
}

export default function CollectionCard({
  id,
  title,
  description,
  image,
  productCount,
  color,
  icon,
}: CollectionCardProps) {
  return (
    <Link href={`/shop?collection=${id}`}>
      <div
        className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-square transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:translate-y-[-12px] border-3"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          borderColor: color,
        }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
          {/* Top Icon */}
          {icon && (
            <div className="text-white text-4xl transform transition-transform duration-500 group-hover:scale-110 group-hover:translate-y-[-8px]">
              {icon}
            </div>
          )}

          {/* Bottom Content */}
          <div className="space-y-3">
            {/* Title */}
            <h3
              className="text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {title}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-sm md:text-base font-medium">
              {description}
            </p>

            {/* Product Count & Button */}
            <div className="flex items-center justify-between pt-4 group-hover:translate-x-2 transition-transform duration-300">
              <span className="text-white/80 text-sm font-semibold">
                {productCount} Items
              </span>
              <div className="w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Accent */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150"
          style={{ backgroundColor: color }}
        />
      </div>
    </Link>
  );
}
