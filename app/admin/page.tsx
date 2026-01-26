'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Package, Users, ShoppingCart, DollarSign, 
  TrendingUp, AlertCircle, ArrowRight 
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadDashboard();
      loadAnalytics();
    }
  }, [isAuthenticated, isAdmin, loading]);

  const loadDashboard = async () => {
    try {
      const response = await api.getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await api.getAnalytics(12);
      if (response.success) {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData?.total_users || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/users',
    },
    {
      title: 'Total Products',
      value: dashboardData?.total_products || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: dashboardData?.total_orders || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${(dashboardData?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: dashboardData?.pending_orders || 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/admin/orders?status=pending',
    },
    {
      title: 'Low Stock Products',
      value: dashboardData?.low_stock_products || 0,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: '/admin/products?low_stock=true',
    },
  ];

  // Prepare chart data
  const salesChartData = analyticsData?.sales_by_month?.map((item: any) => ({
    month: item.month_label || item.month,
    revenue: parseFloat(item.revenue || 0),
    orders: parseInt(item.orders || 0),
  })) || [];

  const profitChartData = analyticsData?.profit_data?.map((item: any) => ({
    month: item.month_label || item.month,
    revenue: parseFloat(item.revenue || 0),
    profit: parseFloat(item.profit || 0),
    cost: parseFloat(item.cost || 0),
  })) || [];

  const productSalesData = analyticsData?.product_sales?.slice(0, 10).map((item: any) => ({
    name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
    sold: parseInt(item.total_sold || 0),
    revenue: parseFloat(item.total_revenue || 0),
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-foreground/70">Manage your store and track performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/70">
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Revenue (Last 12 Months)</CardTitle>
              <CardDescription>Monthly revenue and order count</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
                orders: { label: 'Orders', color: 'hsl(var(--chart-2))' },
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      name="Revenue (₹)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Profit Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Analysis (Last 12 Months)</CardTitle>
              <CardDescription>Revenue vs Profit breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
                profit: { label: 'Profit', color: 'hsl(var(--chart-3))' },
                cost: { label: 'Cost', color: 'hsl(var(--chart-4))' },
              }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue (₹)" />
                    <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit (₹)" />
                    <Bar dataKey="cost" fill="hsl(var(--chart-4))" name="Cost (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Product Sales Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              sold: { label: 'Quantity Sold', color: 'hsl(var(--chart-1))' },
              revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
            }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productSalesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="sold" fill="hsl(var(--chart-1))" name="Quantity Sold" />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-2))" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/products">
                <Button className="w-full">
                  Manage Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/users">
                <Button className="w-full">
                  Manage Users <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and process orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/orders">
                <Button className="w-full">
                  View Orders <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
