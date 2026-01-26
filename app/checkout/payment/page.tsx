'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [orderData, setOrderData] = useState<any>(null);

  // Payment form fields
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [walletType, setWalletType] = useState<'paytm' | 'phonepe' | 'gpay'>('paytm');

  useEffect(() => {
    // Get order data from sessionStorage
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    if (pendingOrder) {
      setOrderData(JSON.parse(pendingOrder));
    } else {
      // If no pending order, redirect to cart
      router.push('/cart');
    }
  }, [router]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    if (e.target.name === 'cardNumber') {
      // Format card number with spaces
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }
    
    if (e.target.name === 'expiry') {
      // Format expiry as MM/YY
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }
    
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) return;
    }

    setCardData(prev => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const syncCartToBackend = async () => {
    try {
      // Get current backend cart
      const backendCartResponse = await api.getCart() as any;
      const backendCart = Array.isArray(backendCartResponse.data) ? backendCartResponse.data : [];
      
      // Sync local cart items to backend
      for (const item of cart) {
        // Check if item exists in backend
        const backendItem = Array.isArray(backendCart) 
          ? backendCart.find((bi: any) => bi.product_id === item.id)
          : null;
        
        if (backendItem) {
          // Item exists, update quantity if different
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

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Sync cart to backend before payment
      await syncCartToBackend();
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, always succeed
      // In real app, this would call payment gateway API
      const paymentSuccess = true; // Simulated
      
      if (paymentSuccess) {
        // Create order in backend
        const orderPayload = {
          shipping_address: orderData.shipping_address,
          shipping_city: orderData.shipping_city,
          shipping_state: orderData.shipping_state,
          shipping_postal_code: orderData.shipping_postal_code,
          shipping_phone: orderData.shipping_phone,
          shipping_name: orderData.shipping_name,
          shipping_email: orderData.shipping_email,
          payment_method: 'online',
          payment_status: 'completed',
          payment_gateway: paymentMethod === 'card' ? 'card' : paymentMethod === 'upi' ? 'upi' : walletType,
        };

        const response = await api.post('orders', orderPayload) as any;
        
        if (response.success && response.data) {
          // Clear cart and pending order
          clearCart();
          sessionStorage.removeItem('pendingOrder');
          setPaymentStatus('success');
          
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${response.data.id || response.data.order_id}`);
          }, 2000);
        } else {
          throw new Error(response.message || 'Order creation failed');
        }
      } else {
        setPaymentStatus('failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Payment Successful!</h2>
          <p className="text-foreground/70">Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">Payment Failed</h2>
          <p className="text-foreground/70">Please try again or use a different payment method.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setPaymentStatus('pending')}>Try Again</Button>
            <Button variant="outline" onClick={() => router.push('/checkout')}>
              Back to Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 flex items-center gap-3">
          <CreditCard className="h-10 w-10 text-primary" />
          Payment Gateway
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border-2 border-muted rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Select Payment Method</h2>

              <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'upi' | 'wallet') => setPaymentMethod(value)}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-xl hover:border-primary/50 transition-all">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer font-semibold">
                      Credit/Debit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-xl hover:border-primary/50 transition-all">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer font-semibold">
                      UPI
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 border-muted rounded-xl hover:border-primary/50 transition-all">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex-1 cursor-pointer font-semibold">
                      Digital Wallet
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={cardData.cardName}
                      onChange={handleCardInputChange}
                      placeholder="John Doe"
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="rounded-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        maxLength={3}
                        required
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg text-sm text-foreground/70">
                    <p className="font-semibold mb-2">Test Card Details:</p>
                    <p>Card: 4111 1111 1111 1111</p>
                    <p>Expiry: Any future date (e.g., 12/25)</p>
                    <p>CVV: Any 3 digits (e.g., 123)</p>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upiId">UPI ID *</Label>
                    <Input
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm text-foreground/70">
                    <p>Enter your UPI ID to proceed with payment</p>
                  </div>
                </div>
              )}

              {/* Wallet Payment Form */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div>
                    <Label>Select Wallet</Label>
                    <RadioGroup value={walletType} onValueChange={(value: 'paytm' | 'phonepe' | 'gpay') => setWalletType(value)}>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paytm" id="paytm" />
                          <Label htmlFor="paytm" className="cursor-pointer">Paytm</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phonepe" id="phonepe" />
                          <Label htmlFor="phonepe" className="cursor-pointer">PhonePe</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="gpay" id="gpay" />
                          <Label htmlFor="gpay" className="cursor-pointer">Google Pay</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-sm text-foreground/70">
                    <p>You will be redirected to {walletType} for payment</p>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePayment}
                disabled={loading || (paymentMethod === 'card' && (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv)) || (paymentMethod === 'upi' && !upiId)}
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full h-14 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${orderData.total.toLocaleString()}`
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-3xl p-6 space-y-4 sticky top-20">
              <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>₹{orderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">GST (18%)</span>
                  <span>₹{orderData.gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="text-success font-bold">Free</span>
                </div>
                <div className="border-t-2 border-primary/20 pt-2 flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{orderData.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

