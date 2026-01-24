'use client';

import React from 'react';
import { Heart, Star, Zap } from 'lucide-react';

export default function MarqueeBanner() {
  const items = [
    { icon: Heart, text: 'Free shipping on orders above ₹999' },
    { icon: Star, text: 'Limited Edition Superhero Sets' },
    { icon: Zap, text: 'Safe & Certified Toys' },
    { icon: Star, text: 'New Cartoon Collection Live Now' },
  ];

  return (
    <section className="py-6 md:py-8 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 overflow-hidden">
      <div className="flex gap-8 md:gap-12 animate-scroll">
        {[...Array(3)].map((_, iteration) => (
          <div key={iteration} className="flex gap-8 md:gap-12 shrink-0">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${iteration}-${idx}`}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm md:text-base font-semibold text-foreground">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
