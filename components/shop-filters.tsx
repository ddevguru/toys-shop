'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ShopFiltersProps {
  onFilterChange: (filters: any) => void;
}

export default function ShopFilters({ onFilterChange }: ShopFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [] as string[],
    ageGroup: [] as string[],
    priceRange: [0, 5000] as [number, number],
    sortBy: 'popularity',
  });

  const categories = [
    { id: 'cartoon', label: 'Cartoon Characters' },
    { id: 'superhero', label: 'Superheroes' },
    { id: 'creative', label: 'DIY & Creative' },
    { id: 'educational', label: 'Educational' },
    { id: 'limited', label: 'Limited Edition' },
  ];

  const ageGroups = [
    { id: '3-5', label: '3 - 5 years' },
    { id: '5-8', label: '5 - 8 years' },
    { id: '8-12', label: '8 - 12 years' },
    { id: '12+', label: '12+ years' },
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Popularity' },
    { id: 'newest', label: 'Newest' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
  ];

  const handleCategoryChange = (categoryId: string) => {
    const updated = selectedFilters.category.includes(categoryId)
      ? selectedFilters.category.filter((c) => c !== categoryId)
      : [...selectedFilters.category, categoryId];
    const newFilters = { ...selectedFilters, category: updated };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAgeGroupChange = (ageId: string) => {
    const updated = selectedFilters.ageGroup.includes(ageId)
      ? selectedFilters.ageGroup.filter((a) => a !== ageId)
      : [...selectedFilters.ageGroup, ageId];
    const newFilters = { ...selectedFilters, ageGroup: updated };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortId: string) => {
    const newFilters = { ...selectedFilters, sortBy: sortId };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseInt(e.target.value);
    const newFilters = {
      ...selectedFilters,
      priceRange: [selectedFilters.priceRange[0], newPrice] as [number, number],
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Sort */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.id}
                checked={selectedFilters.sortBy === option.id}
                onChange={(e) => handleSortChange(e.target.value)}
                className="rounded-full"
              />
              <span className="text-sm text-foreground/70">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3 border-t border-border pt-6">
        <h3 className="font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.category.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded"
              />
              <span className="text-sm text-foreground/70">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div className="space-y-3 border-t border-border pt-6">
        <h3 className="font-semibold text-foreground">Age Group</h3>
        <div className="space-y-2">
          {ageGroups.map((age) => (
            <label key={age.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.ageGroup.includes(age.id)}
                onChange={() => handleAgeGroupChange(age.id)}
                className="rounded"
              />
              <span className="text-sm text-foreground/70">{age.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 border-t border-border pt-6">
        <h3 className="font-semibold text-foreground">Price Range</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={selectedFilters.priceRange[1]}
            onChange={handlePriceChange}
            className="w-full accent-primary"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/70">₹0</span>
            <span className="font-semibold text-foreground">
              ₹{selectedFilters.priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full border-border hover:bg-secondary bg-transparent"
        onClick={() => {
          const resetFilters = {
            category: [],
            ageGroup: [],
            priceRange: [0, 5000] as [number, number],
            sortBy: 'popularity',
          };
          setSelectedFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
