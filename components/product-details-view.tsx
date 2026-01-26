'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/cart-context';

interface ProductDetailsViewProps {
  id: number;
  name: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  features: string[];
  material: string;
  ageGroup: string;
  stockCount: number;
  image?: string;
}

export default function ProductDetailsView({
  id,
  name,
  price,
  discountPrice,
  rating,
  reviewCount,
  category,
  description,
  features,
  material,
  ageGroup,
  stockCount,
  image = '/hero-toys-1.jpg',
}: ProductDetailsViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('blue');
  const { addToCart, updateQuantity, cart, addToWishlist, isInWishlist } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(id));

  // Check if product is already in cart and sync quantity
  useEffect(() => {
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cart, id]);

  const colors = ['blue', 'red', 'green', 'yellow'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Left: Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative rounded-2xl overflow-hidden bg-muted h-96 md:h-[500px]">
          <Image
            src="/hero-toys-1.jpg"
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((_, idx) => (
            <button
              key={idx}
              className="relative rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-colors h-24"
            >
              <Image
                src="/studio-collection.jpg"
                alt={`Product ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* More Info Tabs - Below Image */}
        <div className="pt-12 mt-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/30 rounded-lg p-1 h-auto">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-2 data-[state=active]:border-primary/40 rounded-md py-2"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="specs"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-2 data-[state=active]:border-primary/40 rounded-md py-2"
              >
                Specs
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:border-2 data-[state=active]:border-primary/40 rounded-md py-2"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-4 text-sm text-foreground/70">
              <p className="leading-relaxed">{description}</p>
              <div className="space-y-3 pt-2">
                <p className="font-semibold text-foreground">Product Highlights:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Premium quality materials ensure durability and long-lasting play</li>
                  <li>Designed with child safety standards in mind</li>
                  <li>Encourages creative play and imagination</li>
                  <li>Perfect for both solo play and group activities</li>
                  <li>Easy to clean and maintain</li>
                </ul>
                <p className="pt-2 leading-relaxed">
                  This product has been carefully crafted to provide hours of entertainment while promoting learning and development. Each piece is designed with attention to detail, ensuring a premium play experience that both kids and parents will love.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specs" className="mt-4 space-y-3">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Age Group:</span>
                  <span className="font-semibold text-foreground">{ageGroup}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Material:</span>
                  <span className="font-semibold text-foreground">{material}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Safety Certified:</span>
                  <span className="font-semibold text-foreground">Yes</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Dimensions:</span>
                  <span className="font-semibold text-foreground">Varies by item</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Weight:</span>
                  <span className="font-semibold text-foreground">Lightweight</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Warranty:</span>
                  <span className="font-semibold text-foreground">6 months</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-foreground/70">Country of Origin:</span>
                  <span className="font-semibold text-foreground">India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Care Instructions:</span>
                  <span className="font-semibold text-foreground">Wipe clean with damp cloth</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-4">
              <div className="space-y-4">
                {/* Review 1 */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">Priya Sharma</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">2 days ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    Amazing quality! My daughter loves playing with these. The colors are vibrant and the build quality is excellent. Highly recommended!
                  </p>
                </div>

                {/* Review 2 */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">Rahul Mehta</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">1 week ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    Great value for money. The product arrived on time and packaging was secure. Kids are enjoying it a lot!
                  </p>
                </div>

                {/* Review 3 */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">Anita Patel</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    Perfect gift for birthdays! The quality exceeded my expectations. Safe for kids and very durable.
                  </p>
                </div>

                {/* Review 4 */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">Vikram Singh</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-foreground/60">3 weeks ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    Good product overall. Fast delivery and good customer service. Would buy again!
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="space-y-6">
        {/* Category & Title */}
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
            {category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3">
            {name}
          </h1>
          <p className="text-lg text-foreground/60">{description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-foreground/60">
            ({reviewCount} customer reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-primary">
            ₹{(discountPrice || price).toLocaleString()}
          </span>
          {discountPrice && (
            <>
              <span className="text-xl text-foreground/50 line-through">
                ₹{price.toLocaleString()}
              </span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(((price - discountPrice) / price) * 100)}% Off
              </span>
            </>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-3 p-4 rounded-xl bg-secondary/30">
          <p className="font-semibold text-foreground">Key Features:</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-foreground/70">
                <span className="text-primary mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Color Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Color: <span className="capitalize">{selectedColor}</span>
            </label>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-primary scale-110'
                      : 'border-border hover:border-primary/50'
                  } bg-${color}-400`}
                  aria-label={`Color: ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-2 w-fit">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3"
              >
                −
              </Button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border border-border rounded-lg py-2 px-3"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3"
              >
                +
              </Button>
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              {stockCount} items available
            </p>
          </div>
        </div>

        {/* Stock Status */}
        {stockCount > 0 ? (
          <div className="p-3 rounded-lg bg-green-100/50 border border-green-200">
            <p className="text-sm font-semibold text-green-700">✓ In Stock</p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-red-100/50 border border-red-200">
            <p className="text-sm font-semibold text-red-700">Out of Stock</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            disabled={stockCount === 0}
            onClick={() => {
              const cartItem = cart.find(item => item.id === id);
              if (cartItem) {
                // Update existing cart item quantity
                updateQuantity(id, quantity);
              } else {
                // Add new item to cart with selected quantity
                for (let i = 0; i < quantity; i++) {
                  addToCart({
                    id,
                    name,
                    price: discountPrice || price,
                    image,
                  });
                }
              }
            }}
          >
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary/5 rounded-full font-bold px-6 bg-transparent"
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              addToWishlist({
                id,
                name,
                price: discountPrice || price,
                image,
                category,
              });
            }}
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>

        {/* Shipping Info - Right Side */}
        <div className="space-y-3 p-4 rounded-xl bg-muted/50 border border-border">
          <div className="text-sm font-bold text-foreground">Shipping Info:</div>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Free delivery on orders above ₹999</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Delivery in 3-7 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Easy 30-day returns</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Safe & certified packaging</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
