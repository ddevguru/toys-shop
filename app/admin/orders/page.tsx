'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminOrders() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadOrders();
    }
  }, [isAuthenticated, isAdmin, loading, statusFilter]);

  const loadOrders = async () => {
    try {
      const params: any = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await api.getOrders(params) as any;
      if (response.success) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.updateOrder(orderId, { order_status: status });
      loadOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Orders</h1>
            <p className="text-foreground/70">Manage and track orders</p>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.order_number}</CardTitle>
                    <p className="text-sm text-foreground/70">
                      {order.user_name} ({order.user_email})
                    </p>
                    <p className="text-sm text-foreground/70">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{order.total_amount}</p>
                    <p className="text-sm text-foreground/70">Status: {order.order_status}</p>
                    <p className="text-sm text-foreground/70">Payment: {order.payment_status}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={order.order_status}
                    onValueChange={(value) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        // First ensure invoice exists
                        const generateResponse = await api.generateInvoice(order.id) as any;
                        if (!generateResponse.success) {
                          alert(generateResponse.message || 'Failed to generate invoice');
                          return;
                        }

                        // Download the invoice file
                        try {
                          const blob = await api.downloadInvoice(order.id);
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          // Always use HTML extension (PDF generation is incomplete)
                          const fileName = `invoice-${order.id}-${generateResponse.invoice_number || Date.now()}.html`;
                          a.download = fileName;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (downloadError: any) {
                          // If download fails, try opening in new tab
                          console.error('Download failed, opening in new tab:', downloadError);
                          if (generateResponse.invoice_url) {
                            window.open(generateResponse.invoice_url, '_blank');
                          } else {
                            throw downloadError;
                          }
                        }
                      } catch (error: any) {
                        console.error('Failed to download invoice:', error);
                        alert(error.message || 'Failed to generate invoice');
                      }
                    }}
                  >
                    Generate Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

