'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminUsers() {
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
      loadUsers();
    }
  }, [isAuthenticated, isAdmin, loading]);

  const loadUsers = async () => {
    try {
      const response = await api.getUsers({ search: searchTerm });
      if (response.success) {
        setUsers(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;
    
    try {
      await api.deleteUser(id);
      loadUsers();
    } catch (error) {
      alert('Failed to deactivate user');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadUsers();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Users</h1>
          <p className="text-foreground/70">Manage user accounts</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                    <p className="text-sm text-foreground/70">{user.email}</p>
                    <p className="text-sm text-foreground/70">@{user.username}</p>
                    <p className="text-sm text-foreground/70">Role: {user.role}</p>
                    <p className="text-sm text-foreground/70">
                      Status: {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-sm text-foreground/70">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {user.role !== 'admin' && (
                    <Button
                      variant="outline"
                      onClick={() => handleDeactivate(user.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

