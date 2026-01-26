'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, X, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface InstagramStory {
  id: number;
  username: string;
  avatar: string;
  image: string;
  viewed: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
}

interface InstagramReel {
  id: number;
  username: string;
  avatar: string;
  video: string; // For now using image, can be replaced with video URL
  image: string; // Thumbnail
  likes: number;
  comments: number;
  views: number;
  caption: string;
  timestamp: string;
  product: Product;
}

const stories: InstagramStory[] = [
  {
    id: 1,
    username: 'New Drops',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: false,
  },
  {
    id: 2,
    username: 'Unboxing',
    avatar: '',
    image: '/studio-collection.jpg',
    viewed: false,
  },
  {
    id: 3,
    username: 'Fan Love',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: true,
  },
  {
    id: 4,
    username: 'Studio Life',
    avatar: '',
    image: '/studio-collection.jpg',
    viewed: true,
  },
  {
    id: 5,
    username: 'Safe Play',
    avatar: '',
    image: '/hero-toys-1.jpg',
    viewed: false,
  },
];

const reels: InstagramReel[] = [
  {
    id: 1,
    username: 'toycart.studio',
    avatar: '🎮',
    video: '/hero-toys-1.jpg',
    image: '/hero-toys-1.jpg',
    likes: 12543,
    comments: 428,
    views: 89234,
    caption: 'Superhero collection just dropped! Every toy tells a story of adventure and imagination. Which character is your favorite?',
    timestamp: '2 days ago',
    product: {
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
  },
  {
    id: 2,
    username: 'toycart.studio',
    avatar: '🎮',
    video: '/studio-collection.jpg',
    image: '/studio-collection.jpg',
    likes: 18391,
    comments: 645,
    views: 156789,
    caption: 'Our customers love these collectible figures! Limited edition pieces that make perfect gifts. Grab yours before they are gone!',
    timestamp: '1 week ago',
    product: {
      id: 2,
      name: 'Superhero Action Figures',
      category: 'Superhero',
      price: 1999,
      rating: 4.8,
      reviewCount: 256,
      image: '/studio-collection.jpg',
      badge: 'Best Seller',
    },
  },
  {
    id: 3,
    username: 'toycart.studio',
    avatar: '🎮',
    video: '/hero-toys-1.jpg',
    image: '/hero-toys-1.jpg',
    likes: 22534,
    comments: 867,
    views: 234567,
    caption: 'Unboxing the new Cartoon Favorites collection! These adorable characters bring joy to every playroom. Who wants to see more?',
    timestamp: '10 days ago',
    product: {
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
  },
];

export default function InstagramSection() {
  const router = useRouter();
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [selectedReel, setSelectedReel] = useState<InstagramReel | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleLike = (reelId: number) => {
    const newLiked = new Set(likedReels);
    if (newLiked.has(reelId)) {
      newLiked.delete(reelId);
    } else {
      newLiked.add(reelId);
    }
    setLikedReels(newLiked);
  };

  const openReelPopup = (reel: InstagramReel) => {
    setSelectedReel(reel);
    setIsPlaying(true);
  };

  const closeReelPopup = () => {
    setSelectedReel(null);
    setIsPlaying(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-4 text-center animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-2 animate-fadeIn">
            <span className="text-2xl sm:text-3xl md:text-4xl animate-pulse-slow">📸</span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground animate-slideUp"
              style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
            >
              Follow Our Story
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 font-medium leading-relaxed animate-fadeIn px-4" style={{ animationDelay: '0.2s' }}>
            Join thousands of happy kids and parents sharing their toy moments with us
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm sm:text-base text-primary font-bold hover:underline"
          >
            @toycart.studio
          </a>
        </div>

        {/* Stories Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 md:pb-0 justify-center items-center">
            {stories.map((story, index) => {
              // Alternate gradient direction: even indices get orange-to-purple, odd get purple-to-orange
              const gradientStyle = index % 2 === 0 
                ? { background: 'linear-gradient(to bottom right, #f97316, #a855f7)' }
                : { background: 'linear-gradient(to bottom right, #a855f7, #f97316)' };
              
              return (
              <div
                key={story.id}
                  className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-[3px] transition-all duration-300 hover:scale-105"
                    style={gradientStyle}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-background">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.username}
                    fill
                        className="object-cover rounded-full"
                  />
                    </div>
                  </div>
                  <p className="text-foreground font-medium text-sm md:text-base text-center whitespace-nowrap">
                    {story.username}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reels Section */}
        <div>
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Latest Reels
          </h3>

          <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {reels.map((reel, idx) => (
              <div
                key={reel.id}
                className="group min-w-[280px] sm:min-w-[320px] md:min-w-0 rounded-2xl overflow-hidden border-2 border-muted hover:border-primary/50 transition-all duration-500 bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/20 animate-slideUp cursor-pointer flex-shrink-0 md:flex-shrink"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => openReelPopup(reel)}
              >
                {/* Reel Video/Image */}
                <div className="relative h-96 overflow-hidden bg-muted">
                  <Image
                    src={reel.image || "/placeholder.svg"}
                    alt={reel.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Reel Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white font-bold text-xs">REELS</span>
                  </div>

                  {/* Views Count */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white font-bold text-xs">👁️ {formatNumber(reel.views)}</span>
                  </div>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom Actions Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-5 w-5" />
                          <span className="text-sm font-semibold">{formatNumber(reel.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-semibold">{formatNumber(reel.comments)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reel Content */}
                <div className="p-5 md:p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
                      {reel.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {reel.username}
                      </p>
                      <p className="text-foreground/50 text-xs">{reel.timestamp}</p>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-foreground/80 text-sm leading-relaxed line-clamp-2">
                    {reel.caption}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center gap-6 pt-3 border-t border-muted">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(reel.id);
                      }}
                      className="flex items-center gap-2 group/like transition-all duration-300 hover:text-red-500"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-300 ${
                          likedReels.has(reel.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-foreground/60'
                        }`}
                      />
                      <span className="text-sm font-semibold text-foreground/70">
                        {likedReels.has(reel.id)
                          ? formatNumber(reel.likes + 1)
                          : formatNumber(reel.likes)}
                      </span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex items-center gap-2 transition-all duration-300 hover:text-primary"
                    >
                      <MessageCircle className="h-5 w-5 text-foreground/60" />
                      <span className="text-sm font-semibold text-foreground/70">
                        {formatNumber(reel.comments)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More */}
          <div className="flex justify-center mt-12 md:mt-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              View More on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Reel Popup with Product Details */}
      {selectedReel && (
        <Dialog open={!!selectedReel} onOpenChange={closeReelPopup}>
          <DialogContent className="max-w-[95vw] lg:max-w-7xl w-full p-0 gap-0 bg-black/98 backdrop-blur-xl border-0 overflow-hidden rounded-none lg:rounded-2xl" showCloseButton={false}>
            <div className="relative flex flex-col lg:flex-row h-[95vh] max-h-[900px] lg:max-h-[850px] w-full overflow-hidden">
              {/* Reel Video Section - Left Side */}
              <div className="relative w-full lg:w-[60%] h-[45vh] lg:h-full bg-black flex items-center justify-center overflow-hidden flex-shrink-0">
                {/* Close Button */}
                <button
                  onClick={closeReelPopup}
                  className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 shadow-lg border border-white/10"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Reel Video/Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={selectedReel.video || selectedReel.image || "/placeholder.svg"}
                    alt={selectedReel.caption}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Play/Pause Overlay */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                      <div className="w-24 h-24 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center animate-pulse shadow-2xl border-2 border-white/30">
                        <svg className="w-12 h-12 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reel Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">
                      {selectedReel.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base mb-0.5">{selectedReel.username}</p>
                      <p className="text-white/80 text-xs">{selectedReel.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-white text-sm lg:text-base leading-relaxed mb-4 font-medium">{selectedReel.caption}</p>
                  <div className="flex items-center gap-6 text-white">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleLike(selectedReel.id);
                      }}
                      className="flex items-center gap-2 hover:scale-110 transition-transform duration-300"
                    >
                      <Heart
                        className={`h-6 w-6 transition-all duration-300 ${
                          likedReels.has(selectedReel.id)
                            ? 'fill-red-500 text-red-500 scale-110'
                            : ''
                        }`}
                      />
                      <span className="text-base font-bold">{formatNumber(selectedReel.likes)}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-base font-bold">{formatNumber(selectedReel.comments)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">👁️ {formatNumber(selectedReel.views)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Section - Right Side */}
              <div className="w-full lg:w-[40%] h-[55vh] lg:h-full bg-background overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex-shrink-0">
                <div className="p-6 md:p-8 lg:p-10 space-y-6 lg:space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                      Featured Product
                    </h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl border-4 border-muted group">
                    <Image
                      src={selectedReel.product.image || "/placeholder.svg"}
                      alt={selectedReel.product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                    {selectedReel.product.badge && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white/20">
                        {selectedReel.product.badge}
                      </div>
                    )}
                    {/* Discount Badge */}
                    {selectedReel.product.discountPrice && (
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white/20">
                        {Math.round(((selectedReel.product.price - selectedReel.product.discountPrice) / selectedReel.product.price) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-5">
                    <div>
                      <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wide">
                        {selectedReel.product.category}
                      </p>
                      <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {selectedReel.product.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedReel.product.rating)
                                  ? 'fill-warning text-warning'
                                  : 'text-muted fill-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-base text-foreground/70 font-semibold">
                          {selectedReel.product.rating}
                        </span>
                        <span className="text-sm text-foreground/50">•</span>
                        <span className="text-sm text-foreground/60 font-medium">
                          {selectedReel.product.reviewCount} reviews
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2 p-4 rounded-2xl bg-muted/50 border-2 border-muted">
                      {selectedReel.product.discountPrice ? (
                        <>
                          <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-foreground">
                              ₹{selectedReel.product.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-xl text-foreground/50 line-through">
                              ₹{selectedReel.product.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                              Save ₹{(selectedReel.product.price - selectedReel.product.discountPrice).toLocaleString()}
                            </span>
                            <span className="text-sm font-semibold text-foreground/60">
                              ({Math.round(((selectedReel.product.price - selectedReel.product.discountPrice) / selectedReel.product.price) * 100)}% off)
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-foreground">
                          ₹{selectedReel.product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Shop Now Button */}
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-7 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl"
                      style={{ fontFamily: 'var(--font-heading)' }}
                      onClick={() => {
                        closeReelPopup();
                        router.push(`/product/${selectedReel.product.id}`);
                      }}
                    >
                      <ShoppingCart className="h-6 w-6 mr-2" />
                      Shop Now
                    </Button>

                    {/* Quick Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 hover:bg-muted hover:border-primary/50 transition-all duration-300 rounded-xl"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(selectedReel.id);
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 mr-2 transition-all duration-300 ${
                            likedReels.has(selectedReel.id)
                              ? 'fill-red-500 text-red-500 scale-110'
                              : ''
                          }`}
                        />
                        <span className="font-semibold">Like</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1 border-2 hover:bg-muted hover:border-primary/50 transition-all duration-300 rounded-xl"
                      >
                        <Share2 className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Share</span>
                      </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="pt-4 border-t border-muted">
                      <p className="text-sm text-foreground/60 leading-relaxed">
                        This product is featured in our latest reel. Click "Shop Now" to view full details, specifications, and customer reviews.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
