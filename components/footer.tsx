'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <span className="font-bold text-foreground">ToyCart Studio</span>
            </div>
            <p className="text-sm text-foreground/60">
              Curated toys for playful kids and happy parents. Studio-grade toys for studio-grade smiles.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'Categories', href: '/shop?view=categories' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Help Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Help</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'FAQ', href: '/#faq' },
                { label: 'Shipping', href: '/contact' },
                { label: 'Returns', href: '/contact' },
                { label: 'Support', href: '/contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-accent mt-0.5" />
                <a
                  href="mailto:hello@toycart.studio"
                  className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                >
                  hello@toycart.studio
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-accent mt-0.5" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                >
                  +91 9876 543 210
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <p className="text-sm text-foreground/60">
                  Studio, Mumbai, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-foreground">Follow us</span>
            <div className="flex gap-2">
              {[
                { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-secondary hover:bg-accent"
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon className="h-5 w-5 text-secondary-foreground" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-xs text-foreground/50">
            © 2024 ToyCart Studio. Made with love for kids. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
