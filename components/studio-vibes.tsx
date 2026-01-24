import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function StudioVibes() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden rounded-3xl">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/studio-collection.jpg"
          alt="Studio Collection Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 py-12 md:py-20 max-w-2xl">
        <div className="space-y-6 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight text-balance animate-slideInLeft" style={{ fontFamily: 'var(--font-heading)' }}>
            Studio-grade toys for studio-grade smiles
          </h2>
          <p className="text-lg text-white/90 text-balance leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Experience the blend of modern design and playful creativity. Our curated collection brings professional aesthetics to childhood joy.
          </p>
          <div className="animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Explore Studio Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
