'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    title: 'Playtime, Upgraded.',
    subtitle: 'Discover curated cartoon, superhero, and character toys that spark joy and imagination.',
    image: '/hero-toys-1.jpg',
    badges: [
      { text: 'New', color: 'bg-accent' },
      { text: 'Best Seller', color: 'bg-primary' },
      { text: 'Limited Edition', color: 'bg-secondary' },
    ],
  },
  {
    id: 2,
    title: 'Studio Vibes, Playtime Dreams',
    subtitle: 'Where modern design meets childhood wonder. Handpicked toys for happy moments.',
    image: '/studio-collection.jpg',
    badges: [
      { text: 'New Arrival', color: 'bg-accent' },
      { text: "Parents' Choice", color: 'bg-primary' },
    ],
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden border-2 sm:border-4 border-primary/20 shadow-2xl shadow-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover transition-transform duration-700"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-12 animate-slideUp">
            <div className="max-w-lg space-y-2 sm:space-y-4 md:space-y-6">
              <h1
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {slide.title}
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-white/90 text-balance font-medium">
                {slide.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4 sm:pt-6">
                <Button
                  size="sm"
                  className="sm:size-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 text-xs sm:text-base"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:size-lg bg-white/20 border-2 border-white text-white hover:bg-white/30 hover:border-white font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm text-xs sm:text-base"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  View Collections
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-2 right-2 sm:top-8 sm:right-8 flex flex-col gap-1 sm:gap-3">
              {slide.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className={`${badge.color} text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-1.5 sm:p-2 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-6 h-2 sm:w-8 sm:h-3'
                : 'bg-white/50 w-2 h-2 sm:w-3 sm:h-3 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
