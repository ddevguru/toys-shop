'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isEmpty = wishlist.length === 0;

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            My Wishlist
          </h1>
          <p className="text-lg text-foreground/70 font-medium">
            {isEmpty ? 'Your wishlist is empty' : `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl">💝</div>
            <h2 className="text-2xl font-bold text-foreground">Your wishlist is empty</h2>
            <p className="text-foreground/70 max-w-md mx-auto">
              Add items to your wishlist by clicking the heart icon on products you love!
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 py-3">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden bg-card border-2 border-muted hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:translate-y-[-8px]"
              >
                {/* Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-125"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full hover:bg-red-50 text-red-600 shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Heart className="h-6 w-6 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7 space-y-4 bg-gradient-to-b from-card/50 to-card">
                  {/* Category */}
                  <div className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block">
                    {item.category}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg md:text-xl font-bold text-foreground line-clamp-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full h-11 shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Link href={`/product/${item.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-bold rounded-full h-11 bg-transparent"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
