'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Menu, X, Search, User, LogOut, Package, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import SearchBar from '@/components/search-bar';

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, wishlist } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-primary/20 bg-gradient-to-b from-background to-background/95 backdrop-blur-xl shadow-lg shadow-primary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                🎮
              </span>
            </div>
            <span
              className="hidden font-bold text-foreground sm:inline text-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ToyCart Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-foreground/80 transition-all duration-300 hover:text-primary hover:font-bold px-2 py-1 rounded-lg hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-full"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                size="icon"
                className="relative bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl rounded-full hover:scale-110 active:scale-95"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border-2 border-white shadow-md">
                    {cart.length > 99 ? '99+' : cart.length}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/orders">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                    aria-label="Orders"
                  >
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                    aria-label="Profile"
                  >
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="hover:bg-secondary/10 hover:text-secondary transition-all duration-300 rounded-full"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex hover:bg-secondary/10 hover:text-secondary transition-all duration-300 rounded-full"
                  aria-label="Login"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="border-t border-border md:hidden">
            <div className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/orders"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                  <Link
                    href="/profile"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                      setIsMenuOpen(false);
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground flex items-center gap-2 text-left w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
