'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  rating: number;
  totalReviews: number;
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Priya M.',
    rating: 5,
    title: 'Perfect Gift for My 6 Year Old!',
    content: 'My son absolutely loves these toys. They\'re durable, colorful, and safe. Great quality for the price. Highly recommended!',
    date: 'Jan 15, 2024',
    helpful: 234,
    verified: true,
  },
  {
    id: 2,
    author: 'Rahul K.',
    rating: 4,
    title: 'Great Quality, Amazing Service',
    content: 'Ordered these toys for my nephew. Delivery was super fast. The toys are well-made and my nephew is having a blast with them.',
    date: 'Jan 12, 2024',
    helpful: 156,
    verified: true,
  },
  {
    id: 3,
    author: 'Deepa S.',
    rating: 5,
    title: 'Worth Every Penny!',
    content: 'These are the best toys I\'ve ever bought. My kids spend hours playing with them. The packaging was beautiful too!',
    date: 'Jan 8, 2024',
    helpful: 189,
    verified: true,
  },
  {
    id: 4,
    author: 'Amit P.',
    rating: 4,
    title: 'Good Quality, Fast Delivery',
    content: 'Received the order in 2 days. Toys are exactly as described. Kids love them!',
    date: 'Jan 5, 2024',
    helpful: 92,
    verified: true,
  },
];

const ratingDistribution = [
  { stars: 5, count: 128, percentage: 50 },
  { stars: 4, count: 85, percentage: 33 },
  { stars: 3, count: 25, percentage: 10 },
  { stars: 2, count: 8, percentage: 4 },
  { stars: 1, count: 6, percentage: 2 },
];

export default function ProductReviews({
  productId,
  productName,
  rating,
  totalReviews,
}: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState('helpful');

  return (
    <section className="py-12 md:py-16">
      <div className="space-y-12">
        {/* Reviews Header */}
        <div className="space-y-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Customer Reviews
          </h2>

          {/* Rating Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left: Overall Rating */}
            <div className="flex flex-col items-start space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-5xl md:text-6xl font-bold text-foreground">{rating}</span>
                  <div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(rating)
                              ? 'fill-warning text-warning'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/70 font-medium mt-1">
                      {totalReviews} reviews
                    </p>
                  </div>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-6 w-full">
                Write a Review
              </Button>
            </div>

            {/* Right: Rating Distribution */}
            <div className="md:col-span-2 space-y-4">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm font-semibold text-foreground">{dist.stars}</span>
                    <Star className="h-4 w-4 fill-warning text-warning" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-foreground/70 font-medium w-16 text-right">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sort and Filter */}
        <div className="flex items-center justify-between border-t border-muted pt-8">
          <h3 className="text-xl font-bold text-foreground">Top Reviews</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-foreground">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-full border-2 border-muted bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border-2 border-muted hover:border-primary/50 transition-all duration-300 p-6 md:p-8 bg-gradient-to-br from-card/50 to-card hover:shadow-lg"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-white font-bold">{review.author.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{review.author}</p>
                      {review.verified && (
                        <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-semibold">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-warning text-warning'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-foreground/70">{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3 mb-6">
                <h4 className="font-bold text-foreground text-lg">{review.title}</h4>
                <p className="text-foreground/80 leading-relaxed font-medium">{review.content}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center gap-4 border-t border-muted pt-4">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">Helpful ({review.helpful})</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Reply</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
