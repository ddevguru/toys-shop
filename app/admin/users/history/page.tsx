'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserHistoryPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadUserHistory();
    }
  }, [isAuthenticated, isAdmin, loading]);

  const loadUserHistory = async () => {
    try {
      const response = await api.getAnalytics(12) as any;
      if (response.success && response.data) {
        setUsers(response.data.user_purchase_history || []);
      }
    } catch (error) {
      console.error('Failed to load user history:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">User Purchase History</h1>
            <p className="text-foreground/70">View all users' payment and buying history</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-foreground/70">No user purchase history found</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{user.name}</CardTitle>
                      <p className="text-sm text-foreground/70 mt-1">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {user.total_orders} Orders
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-foreground/70">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{user.total_orders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Total Spent</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{(user.total_spent || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/70">Last Order</p>
                      <p className="text-sm font-semibold text-foreground">
                        {user.last_order_date
                          ? new Date(user.last_order_date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // View user orders
                        window.location.href = `/admin/orders?user_id=${user.id}`;
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Orders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

