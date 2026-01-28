'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Package, Truck, CheckCircle, Clock, XCircle, Download, ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/orders/' + orderId);
        return;
      }
      loadOrder();
    }
  }, [isAuthenticated, loading, orderId]);

  const loadOrder = async () => {
    if (!orderId || isNaN(parseInt(orderId))) {
      console.error('Invalid order ID:', orderId);
      setLoadingData(false);
      return;
    }
    
    try {
      const orderIdNum = parseInt(orderId);
      const response = await api.getOrder(orderIdNum) as any;
      if (response.success) {
        setOrder(response.data || response.order);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'processing':
        return <Package className="h-6 w-6 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = async () => {
    if (!order || !order.id) {
      alert('Order information is missing. Please refresh the page.');
      return;
    }
    
    try {
      // First ensure invoice exists
      const generateResponse = await api.generateInvoice(order.id) as any;
      if (!generateResponse.success) {
        alert(generateResponse.message || 'Failed to generate invoice');
        return;
      }

      // Download the invoice file
      const blob = await api.downloadInvoice(order.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = generateResponse.invoice_url?.includes('.pdf') 
        ? `invoice-${order.id}.pdf` 
        : `invoice-${order.id}.html`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      alert(error.message || 'Failed to download invoice');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!isAuthenticated || !order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <Link href="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Order Details</h1>
            <Badge className={`${getStatusColor(order.order_status)} text-lg px-4 py-2`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.order_status)}
                <span className="capitalize">{order.order_status}</span>
              </div>
            </Badge>
          </div>
          <p className="text-lg text-foreground/70">Order #{order.order_number}</p>
        </div>

        <div className="space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 py-4 border-b border-muted last:border-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.main_image || '/placeholder.svg'}
                        alt={item.product_name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product_name}</h3>
                      <p className="text-sm text-foreground/70">Quantity: {item.quantity}</p>
                      <p className="text-sm text-foreground/70">Price: ₹{item.product_price?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">₹{item.subtotal?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{order.shipping_name}</p>
              {order.shipping_email && (
                <p className="text-sm text-foreground/70 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {order.shipping_email}
                </p>
              )}
              {order.shipping_phone && (
                <p className="text-sm text-foreground/70 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {order.shipping_phone}
                </p>
              )}
              <p className="text-sm text-foreground/70 mt-2">
                {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
              </p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground/70">Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount_amount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground/70">Shipping</span>
                  <span>₹{order.shipping_cost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/70">Tax (GST 18%)</span>
                  <span>₹{order.tax_amount?.toLocaleString() || '0'}</span>
                </div>
                <div className="border-t-2 border-primary/20 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    ₹{order.total_amount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.tracking_number && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono font-semibold text-lg">{order.tracking_number}</p>
                <p className="text-sm text-foreground/70 mt-2">
                  Track your package using the tracking number above
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleDownloadInvoice}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Invoice
            </Button>
            <Link href="/orders" className="flex-1">
              <Button variant="outline" className="w-full rounded-full">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

