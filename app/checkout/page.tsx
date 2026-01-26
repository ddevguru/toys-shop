'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, MapPin, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    shipping_name: user?.name || '',
    shipping_email: user?.email || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'India',
  });

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        shipping_name: user.name || '',
        shipping_email: user.email || '',
      }));
    }
  }, [user]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateGST = () => {
    return Math.round(cartTotal * 0.18);
  };

  const calculateShipping = () => {
    return 0; // Free shipping
  };

  const calculateTotal = () => {
    return cartTotal + calculateGST() + calculateShipping();
  };

  const syncCartToBackend = async () => {
    try {
      // Get current backend cart
      const backendCartResponse = await api.getCart() as any;
      const backendCart = Array.isArray(backendCartResponse.data) ? backendCartResponse.data : [];
      
      // Sync local cart items to backend
      // The backend addToCart API handles both adding new items and updating existing ones
      for (const item of cart) {
        // First, update quantity if item exists, or add if new
        // We need to set the exact quantity, so we'll use updateCart if item exists
        const backendItem = Array.isArray(backendCart) 
          ? backendCart.find((bi: any) => bi.product_id === item.id)
          : null;
        
        if (backendItem) {
          // Item exists, update quantity
          if (backendItem.quantity !== item.quantity) {
            await api.updateCart(item.id, item.quantity);
          }
        } else {
          // Item doesn't exist, add it
          await api.addToCart(item.id, item.quantity);
        }
      }

      // Remove items from backend that are not in local cart
      if (Array.isArray(backendCart)) {
        for (const backendItem of backendCart) {
          const existsInLocal = cart.some(item => item.id === backendItem.product_id);
          if (!existsInLocal) {
            await api.removeFromCart(backendItem.product_id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync cart to backend:', error);
      // Don't throw - continue with order placement
    }
  };

  const handleOnlinePayment = async () => {
    setProcessingPayment(true);
    try {
      // First, sync local cart to backend
      await syncCartToBackend();
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to dummy payment gateway
      const orderData = {
        ...formData,
        payment_method: 'online',
        items: cart,
        subtotal: cartTotal,
        gst: calculateGST(),
        shipping: calculateShipping(),
        total: calculateTotal(),
      };
      
      // Store order data in sessionStorage for payment gateway
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
      
      // Redirect to payment gateway
      router.push('/checkout/payment');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleCODOrder = async () => {
    setLoading(true);
    try {
      // First, sync local cart to backend
      await syncCartToBackend();

      const orderData = {
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_phone: formData.shipping_phone,
        shipping_name: formData.shipping_name,
        shipping_email: formData.shipping_email,
        payment_method: 'cod',
        payment_status: 'pending',
      };

      const response = await api.post('orders', orderData) as any;
      
      if (response.success && response.data) {
        clearCart();
        router.push(`/checkout/success?orderId=${response.data.id || response.data.order_id}`);
      } else {
        throw new Error(response.message || 'Order placement failed');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.shipping_name || !formData.shipping_email || !formData.shipping_phone ||
        !formData.shipping_address || !formData.shipping_city || !formData.shipping_state ||
        !formData.shipping_postal_code) {
      alert('Please fill all required fields');
      return;
    }

    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else {
      handleCODOrder();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left: Shipping & Payment Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-card border-2 border-muted rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_name" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="shipping_name"
                      name="shipping_name"
                      value={formData.shipping_name}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      Email *
                    </Label>
                    <Input
                      id="shipping_email"
                      name="shipping_email"
                      type="email"
                      value={formData.shipping_email}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="shipping_phone"
                      name="shipping_phone"
                      type="tel"
                      value={formData.shipping_phone}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_city" className="mb-2">City *</Label>
                    <Input
                      id="shipping_city"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_state" className="mb-2">State *</Label>
                    <Input
                      id="shipping_state"
                      name="shipping_state"
                      value={formData.shipping_state}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shipping_postal_code" className="mb-2">Postal Code *</Label>
                    <Input
                      id="shipping_postal_code"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="shipping_address" className="mb-2">Address *</Label>
                  <Input
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    className="rounded-lg"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border-2 border-muted rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={(value: 'online' | 'cod') => setPaymentMethod(value)}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-xl hover:border-primary/50 transition-all">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Online Payment</p>
                          <p className="text-sm text-foreground/60">Pay securely with card, UPI, or wallet</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-xl hover:border-primary/50 transition-all">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">Cash on Delivery (COD)</p>
                          <p className="text-sm text-foreground/60">Pay when you receive your order</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-3xl p-8 space-y-6 sticky top-20">
                <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-xs text-foreground/60">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-primary/20 pt-4 space-y-3">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>GST (18%)</span>
                    <span>₹{calculateGST().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span className="text-success font-bold">Free</span>
                  </div>
                  <div className="border-t-2 border-primary/20 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full h-14 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  disabled={loading || processingPayment}
                >
                  {processingPayment ? 'Processing...' : paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                </Button>

                <Link href="/cart">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-primary rounded-full h-12 font-bold bg-transparent"
                  >
                    Back to Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

