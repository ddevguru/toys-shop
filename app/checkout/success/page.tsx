'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Home, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId || isNaN(parseInt(orderId))) {
      console.error('Invalid order ID:', orderId);
      setLoading(false);
      return;
    }
    
    try {
      const orderIdNum = parseInt(orderId);
      const response = await api.getOrder(orderIdNum) as any;
      if (response.success) {
        const orderData = response.data || response.order || {};
        console.log('Order data:', orderData); // Debug log
        setOrder(orderData);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderId || isNaN(parseInt(orderId))) {
      alert('Order ID is missing or invalid. Please refresh the page.');
      return;
    }
    
    // Use order.id if available (more reliable), otherwise use orderId from URL
    const invoiceOrderId = order?.id || parseInt(orderId);
    
    if (!invoiceOrderId || isNaN(invoiceOrderId)) {
      alert('Order information is missing. Please refresh the page.');
      return;
    }
    
    try {
      // First ensure invoice exists
      const generateResponse = await api.generateInvoice(invoiceOrderId) as any;
      if (!generateResponse.success) {
        alert(generateResponse.message || 'Failed to generate invoice');
        return;
      }

      // Download the invoice file
      const blob = await api.downloadInvoice(invoiceOrderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = generateResponse.invoice_url?.includes('.pdf') 
        ? `invoice-${invoiceOrderId}.pdf` 
        : `invoice-${invoiceOrderId}.html`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Failed to download invoice:', error);
      alert(error.message || 'Failed to download invoice. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-foreground/70">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          {orderId && (
            <p className="text-sm text-foreground/60">
              Order ID: <span className="font-bold">{orderId}</span>
            </p>
          )}
        </div>

        {order && (
          <div className="bg-card border-2 border-muted rounded-3xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-foreground/70">Order Status</span>
                <span className="font-semibold capitalize">{order.status || 'Confirmed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Payment Method</span>
                <span className="font-semibold capitalize">{order.payment_method || 'Online'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Payment Status</span>
                <span className="font-semibold capitalize">{order.payment_status || 'Completed'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(order.total_amount || order.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="border-2 border-primary rounded-full h-12 font-bold px-8"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Invoice
          </Button>
          <Link href="/">
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground font-bold rounded-full h-12 px-8">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading order details...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

