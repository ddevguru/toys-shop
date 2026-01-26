'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';

const categories = ['Cartoon Characters', 'Superheroes', 'Creative', 'Educational', 'Plush Toys', 'Outdoor'];
const ageGroups = ['0-2 Years', '3-5 Years', '5-8 Years', '8-12 Years', '12+ Years'];

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts();
      if (response.success && response.data) {
        // Transform API data to match component format
        const transformed = response.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category_name || p.category_slug || 'Uncategorized',
          price: parseFloat(p.price),
          discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
          rating: parseFloat(p.rating) || 0,
          reviewCount: p.review_count || 0,
          image: p.main_image || '/placeholder.svg',
          badge: p.badge || null,
        }));
        setAllProducts(transformed);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

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
