'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allProducts = [
  {
    id: 1,
    name: 'Classic Wooden Train Set',
    category: 'Creative',
    price: 1299,
    rating: 4.5,
    reviewCount: 60,
    image: '/hero-toys-1.jpg',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Super Hero Action Squad',
    category: 'Superhero',
    price: 899,
    rating: 4.8,
    reviewCount: 48,
    image: '/studio-collection.jpg',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Pastel Plush Bunny',
    category: 'Plush',
    price: 599,
    rating: 4.5,
    reviewCount: 60,
    image: '/hero-toys-1.jpg',
    badge: 'Soft',
  },
  {
    id: 4,
    name: 'Space Explorer Rocket',
    category: 'Educational',
    price: 1499,
    rating: 4.5,
    reviewCount: 60,
    image: '/studio-collection.jpg',
    badge: 'New',
  },
  {
    id: 5,
    name: 'Cartoon Characters Set',
    category: 'Cartoon',
    price: 2499,
    discountPrice: 1999,
    rating: 4.5,
    reviewCount: 128,
    image: '/hero-toys-1.jpg',
    badge: 'New',
  },
  {
    id: 6,
    name: 'Superhero Action Figures',
    category: 'Superhero',
    price: 1999,
    rating: 4.8,
    reviewCount: 256,
    image: '/studio-collection.jpg',
    badge: 'Best Seller',
  },
  {
    id: 7,
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
    id: 8,
    name: 'Educational Puzzle Set',
    category: 'Educational',
    price: 899,
    rating: 4.4,
    reviewCount: 145,
    image: '/studio-collection.jpg',
    badge: null,
  },
  {
    id: 9,
    name: 'Premium Hero Collection',
    category: 'Superhero',
    price: 3499,
    rating: 4.9,
    reviewCount: 312,
    image: '/hero-toys-1.jpg',
    badge: 'Limited Edition',
  },
  {
    id: 10,
    name: 'Collectible Heroes Pack',
    category: 'Superhero',
    price: 2899,
    rating: 4.7,
    reviewCount: 178,
    image: '/studio-collection.jpg',
    badge: 'Best Seller',
  },
  {
    id: 11,
    name: 'DIY Craft Kit',
    category: 'Creative',
    price: 1299,
    rating: 4.3,
    reviewCount: 67,
    image: '/hero-toys-1.jpg',
    badge: null,
  },
  {
    id: 12,
    name: 'Smart Learning Toys',
    category: 'Educational',
    price: 2199,
    discountPrice: 1699,
    rating: 4.6,
    reviewCount: 203,
    image: '/studio-collection.jpg',
    badge: 'New',
  },
];

const categories = ['Cartoon Characters', 'Superheroes', 'Creative', 'Educational', 'Plush Toys', 'Outdoor'];
const ageGroups = ['0-2 Years', '3-5 Years', '5-8 Years', '8-12 Years', '12+ Years'];

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    setSelectedAgeGroups(prev =>
      prev.includes(ageGroup) ? prev.filter(a => a !== ageGroup) : [...prev, ageGroup]
    );
  };

  const filteredProducts = allProducts.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shop Toys
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            {/* Categories Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label htmlFor={category} className="text-foreground/70 cursor-pointer text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Group Filter */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Age Group</h3>
              <div className="space-y-3">
                {ageGroups.map((ageGroup) => (
                  <div key={ageGroup} className="flex items-center space-x-2">
                    <Checkbox
                      id={ageGroup}
                      checked={selectedAgeGroups.includes(ageGroup)}
                      onCheckedChange={() => handleAgeGroupChange(ageGroup)}
                    />
                    <Label htmlFor={ageGroup} className="text-foreground/70 cursor-pointer text-sm">
                      {ageGroup}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Side - Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-muted">
              <p className="text-foreground/70 font-medium">
                Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> results
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground/70 hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-full border-muted">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="low-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  badge={product.badge || undefined}
                  variant="default" 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
