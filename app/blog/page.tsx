'use client';

import React, { useState } from 'react';
import { useState as useStateAlias } from 'react';
import BlogCard from '@/components/blog-card';
import { Button } from '@/components/ui/button';

const allBlogPosts = [
  {
    id: 1,
    title: 'Top 10 Educational Toys That Make Learning Fun',
    excerpt: 'Discover the best educational toys that combine fun with learning. Parents share their favorite picks for different age groups.',
    category: 'Parenting',
    image: '/hero-toys-1.jpg',
    readTime: 5,
    date: 'Jan 15, 2024',
    slug: 'educational-toys-learning-fun',
  },
  {
    id: 2,
    title: 'How to Choose Safe Toys for Your Child',
    excerpt: 'A comprehensive guide to understanding toy safety standards and choosing certified, non-toxic toys for your kids.',
    category: 'Toy Care',
    image: '/studio-collection.jpg',
    readTime: 7,
    date: 'Jan 12, 2024',
    slug: 'choose-safe-toys-child',
  },
  {
    id: 3,
    title: 'Best Gift Ideas: Superhero Toys for Every Age',
    excerpt: 'Looking for the perfect gift? Check out our curated list of superhero toys that kids of all ages love.',
    category: 'Gift Ideas',
    image: '/hero-toys-1.jpg',
    readTime: 6,
    date: 'Jan 10, 2024',
    slug: 'superhero-toys-gift-ideas',
  },
  {
    id: 4,
    title: 'Toy Storage Ideas: Organize Like a Pro',
    excerpt: 'Creative and practical solutions for organizing your child\'s toy collection. Keep toys accessible and your space tidy.',
    category: 'Toy Care',
    image: '/studio-collection.jpg',
    readTime: 4,
    date: 'Jan 8, 2024',
    slug: 'toy-storage-organization',
  },
  {
    id: 5,
    title: 'The Benefits of Character Toys in Child Development',
    excerpt: 'Explore how character toys contribute to creative play, emotional development, and social skills in children.',
    category: 'Parenting',
    image: '/hero-toys-1.jpg',
    readTime: 8,
    date: 'Jan 5, 2024',
    slug: 'character-toys-development',
  },
  {
    id: 6,
    title: 'Trending Cartoon Collections This Season',
    excerpt: 'Stay updated with the latest and most popular cartoon character collections that are taking the toy market by storm.',
    category: 'Trends',
    image: '/studio-collection.jpg',
    readTime: 5,
    date: 'Jan 1, 2024',
    slug: 'trending-cartoon-collections',
  },
  {
    id: 7,
    title: 'DIY Activities Using Creative Toy Sets',
    excerpt: 'Fun DIY projects and activities you can do with creative toy sets to enhance playtime engagement.',
    category: 'Parenting',
    image: '/hero-toys-1.jpg',
    readTime: 6,
    date: 'Dec 28, 2023',
    slug: 'diy-activities-creative-toys',
  },
  {
    id: 8,
    title: 'Limited Edition Collectibles: A Parent\'s Guide',
    excerpt: 'Everything you need to know about collecting limited edition toys - from value to storage and authentication.',
    category: 'Gift Ideas',
    image: '/studio-collection.jpg',
    readTime: 7,
    date: 'Dec 25, 2023',
    slug: 'limited-edition-collectibles-guide',
  },
];

const categories = ['All', 'Parenting', 'Toy Care', 'Gift Ideas', 'Trends'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts =
    selectedCategory === 'All'
      ? allBlogPosts
      : allBlogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-12 space-y-4 text-center animate-fadeInUp">
          <div className="inline-block bg-secondary/40 border border-secondary/60 rounded-full px-4 py-2 mb-4 animate-fadeIn">
            <span className="text-secondary-foreground text-sm font-semibold">The ToyCart Journal</span>
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance animate-slideUp"
            style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s' }}
          >
            Play Stories & Tips
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto font-normal leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Parenting advice, toy reviews, and fun activity ideas to make every day special.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`rounded-full ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-foreground/60">No blog posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
