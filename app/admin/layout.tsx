'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/users/history', label: 'User History', icon: Users },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-muted p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="w-full justify-start">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="mt-8 pt-8 border-t border-muted">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}

