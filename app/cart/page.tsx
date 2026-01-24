'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isEmpty = cart.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shopping Cart
          </h1>
          <p className="text-lg text-foreground/70 font-medium">
            {isEmpty ? 'Your cart is empty' : `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {isEmpty ? (
          <div className="text-center py-20 space-y-6">
            <div className="text-6xl">🛒</div>
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-foreground/70 max-w-md mx-auto">
              Start shopping and add some amazing toys to your cart!
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 md:gap-8 bg-card border-2 border-muted rounded-3xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-xl font-bold text-foreground mb-2"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        ₹{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-primary/10 rounded-full transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-primary/10 rounded-full transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 hover:bg-red-50 text-red-600 rounded-full transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex flex-col justify-between items-end">
                    <p className="text-sm text-foreground/60">Subtotal</p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-3xl p-8 space-y-6 sticky top-20">
                <h2
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Order Summary
                </h2>

                <div className="space-y-4 border-b-2 border-primary/20 pb-6">
                  <div className="flex justify-between text-foreground/70 font-medium">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70 font-medium">
                    <span>Shipping</span>
                    <span className="text-success font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-foreground/70 font-medium">
                    <span>Discount</span>
                    <span className="text-success font-bold">-₹0</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full h-14 text-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                  Proceed to Checkout
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-2 border-primary rounded-full h-12 font-bold bg-transparent"
                  asChild
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
