'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Package, Truck, CheckCircle, Clock, XCircle, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrdersPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/orders');
        return;
      }
      loadOrders();
    }
  }, [isAuthenticated, loading]);

  const loadOrders = async () => {
    try {
      const response = await api.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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

  const handleDownloadInvoice = async (orderId: number) => {
    try {
      // First ensure invoice exists
      const generateResponse = await api.generateInvoice(orderId) as any;
      if (!generateResponse.success) {
        alert(generateResponse.message || 'Failed to generate invoice');
        return;
      }

      // Download the invoice file
      const blob = await api.downloadInvoice(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = generateResponse.invoice_url?.includes('.pdf') 
        ? `invoice-${orderId}.pdf` 
        : `invoice-${orderId}.html`;
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
        <p>Loading orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-lg text-foreground/70">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <Package className="h-20 w-20 text-foreground/30 mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">No orders yet</h2>
            <p className="text-foreground/70 max-w-md mx-auto">
              Start shopping and your orders will appear here!
            </p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-8 py-3">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-2 border-muted hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">Order #{order.order_number}</CardTitle>
                        <Badge className={getStatusColor(order.order_status)}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.order_status)}
                            <span className="capitalize">{order.order_status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/70">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-foreground/70">
                        Payment: <span className="capitalize font-semibold">{order.payment_method}</span> - 
                        <span className={`ml-1 capitalize ${order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.payment_status}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{order.total_amount?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="border-t border-muted pt-4">
                      <h3 className="font-semibold mb-3">Order Items</h3>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-muted/50 last:border-0">
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-foreground/60">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold text-primary">₹{item.subtotal?.toLocaleString() || '0'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                      <div className="border-t border-muted pt-4">
                        <h3 className="font-semibold mb-2">Shipping Address</h3>
                        <p className="text-sm text-foreground/70">
                          {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
                        </p>
                        {order.shipping_phone && (
                          <p className="text-sm text-foreground/70 mt-1">Phone: {order.shipping_phone}</p>
                        )}
                      </div>
                    )}

                    {/* Tracking Info */}
                    {order.tracking_number && (
                      <div className="border-t border-muted pt-4">
                        <h3 className="font-semibold mb-2">Tracking Information</h3>
                        <p className="text-sm text-foreground/70">
                          Tracking Number: <span className="font-mono font-semibold">{order.tracking_number}</span>
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-muted">
                      <Button
                        variant="outline"
                        onClick={() => handleDownloadInvoice(order.id)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Invoice
                      </Button>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

